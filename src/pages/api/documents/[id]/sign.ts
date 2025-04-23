import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import { PDFDocument, PDFImage } from 'pdf-lib';
import { Document, Signature } from '@prisma/client';

interface SignResponse {
  error?: string;
  document?: Document & {
    signatures: Signature[];
  };
}

interface CloudinaryResource {
  public_id: string;
  resource_type: string;
  type: string;
}

interface SignatureDimensions {
  width: number;
  height: number;
}

interface PageSize {
  width: number;
  height: number;
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignResponse>
): Promise<void> {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const { id } = req.query;
    const { signatureImage } = req.body as { signatureImage: string };

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID do documento inválido' });
    }

    if (!signatureImage) {
      return res.status(400).json({ error: 'Imagem da assinatura é obrigatória' });
    }

    const document = await prisma.document.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        fileKey: true,
        name: true,
        mimeType: true
      }
    });

    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    if (document.userId !== session.user.id) {
      return res.status(403).json({ error: 'Você não tem permissão para assinar este documento' });
    }

    // Check if user has already signed
    const existingSignature = await prisma.signature.findFirst({
      where: {
        documentId: document.id,
        userId: session.user.id
      }
    });

    if (existingSignature) {
      return res.status(400).json({ error: 'Você já assinou este documento' });
    }

    try {
      // Primeiro, vamos verificar se o arquivo existe no Cloudinary
      await cloudinary.api.resource(document.fileKey, {
        resource_type: 'raw',
        type: 'upload'
      });

      // Download the PDF from Cloudinary
      const pdfResponse = await fetch(cloudinary.url(document.fileKey, {
        resource_type: 'raw',
        type: 'upload',
        secure: true
      }));

      if (!pdfResponse.ok) {
        throw new Error('Failed to download PDF from Cloudinary');
      }

      const pdfBytes = await pdfResponse.arrayBuffer();
      let pdfDoc: PDFDocument;
      try {
        pdfDoc = await PDFDocument.load(pdfBytes);
        if (!pdfDoc) {
          throw new Error('Failed to load PDF document');
        }
      } catch (_loadError) {
        throw new Error('Failed to load PDF document');
      }

      // Convert base64 signature to image
      const base64Data = signatureImage.split(',')[1];
      if (!base64Data) {
        throw new Error('Invalid signature image format');
      }
      const signatureBytes = Buffer.from(base64Data, 'base64');

      // Embed the signature image
      let signatureImageObj: PDFImage;
      try {
        const embeddedImage = await pdfDoc.embedPng(signatureBytes);
        if (!embeddedImage) {
          throw new Error('Failed to embed signature image');
        }
        signatureImageObj = embeddedImage;
      } catch (_embedError) {
        throw new Error('Failed to embed signature image');
      }

      const scaledImage = signatureImageObj.scale(0.5);
      const signatureDims: SignatureDimensions = {
        width: scaledImage.width,
        height: scaledImage.height
      };

      // Add signature to the last page
      const pages = pdfDoc.getPages();
      if (!pages || pages.length === 0) {
        throw new Error('PDF document has no pages');
      }

      const lastPage = pages[pages.length - 1];
      const pageSize: PageSize = lastPage.getSize();

      try {
        lastPage.drawImage(signatureImageObj, {
          x: pageSize.width - signatureDims.width - 50,
          y: 50,
          width: signatureDims.width,
          height: signatureDims.height,
        });
      } catch (_drawError) {
        throw new Error('Failed to draw signature on PDF');
      }

      // Save the modified PDF
      let modifiedPdfBytes: Uint8Array;
      try {
        const savedBytes = await pdfDoc.save();
        if (!savedBytes) {
          throw new Error('Failed to save modified PDF');
        }
        modifiedPdfBytes = savedBytes;
      } catch (_saveError) {
        throw new Error('Failed to save modified PDF');
      }

      // Upload the modified PDF back to Cloudinary
      await new Promise<CloudinaryResource>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'raw',
            public_id: document.fileKey,
            overwrite: true,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryResource);
          }
        );

        // Convert ArrayBuffer to Buffer and pipe to upload stream
        const buffer = Buffer.from(modifiedPdfBytes);
        uploadStream.end(buffer);
      });

      // Create signature record
      await prisma.signature.create({
        data: {
          documentId: document.id,
          userId: session.user.id,
          signedAt: new Date(),
          signatureImg: signatureImage
        },
      });

      // Get updated document with signatures
      const updatedDocument = await prisma.document.findUnique({
        where: { id: document.id }
      });

      if (!updatedDocument) {
        throw new Error('Failed to fetch updated document');
      }

      const signatures = await prisma.signature.findMany({
        where: { documentId: document.id }
      });

      return res.status(200).json({ 
        document: {
          ...updatedDocument,
          signatures
        }
      });
    } catch (cloudinaryError) {
      console.error('Cloudinary error:', cloudinaryError);
      return res.status(404).json({ error: 'Arquivo não encontrado no Cloudinary' });
    }
  } catch (error) {
    console.error('Error signing document:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 