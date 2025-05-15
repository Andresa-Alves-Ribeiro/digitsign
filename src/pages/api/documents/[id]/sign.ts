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
  secure_url: string;
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

// Helper function to ensure Cloudinary is configured
function ensureCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary não está configurado corretamente. Verifique as variáveis de ambiente.');
  }

  // Reconfigure Cloudinary to ensure it's using the latest credentials
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignResponse>
): Promise<void> {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Ensure Cloudinary is configured
    ensureCloudinaryConfig();
    
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
        name: true,
        fileKey: true,
        userId: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        mimeType: true,
        size: true,
        signature: true
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
      try {
        await cloudinary.api.resource(document.fileKey, {
          resource_type: 'raw',
          type: 'upload'
        });
      } catch (cloudinaryError) {
        return res.status(404).json({ 
          error: 'Arquivo não encontrado no Cloudinary. Por favor, tente fazer upload do documento novamente.' 
        });
      }

      // Download the PDF from Cloudinary
      const cloudinaryUrl = cloudinary.url(document.fileKey, {
        resource_type: 'raw',
        type: 'upload',
        secure: true
      });
      
      try {
        // Use a more reliable method to download the PDF
        const pdfResponse = await fetch(cloudinaryUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/pdf',
            'User-Agent': 'SuperSign/1.0'
          }
        });
        
        if (!pdfResponse.ok) {
          // Try an alternative approach using Cloudinary's API
          try {
            const result = await cloudinary.api.resource(document.fileKey, {
              resource_type: 'raw',
              type: 'upload'
            }) as CloudinaryResource;
            
            if (!result || !result.secure_url) {
              throw new Error('No secure URL found in Cloudinary response');
            }
            
            const alternativeUrl = result.secure_url;
            
            const alternativeResponse = await fetch(alternativeUrl, {
              method: 'GET',
              headers: {
                'Accept': 'application/pdf',
                'User-Agent': 'SuperSign/1.0'
              }
            });
            
            if (!alternativeResponse.ok) {
              throw new Error(`Alternative download failed with status: ${alternativeResponse.status}`);
            }
            
            const pdfBytes = await alternativeResponse.arrayBuffer();
            
            let pdfDoc: PDFDocument;
            try {
              pdfDoc = await PDFDocument.load(pdfBytes);
              if (!pdfDoc) {
                throw new Error('Failed to load PDF document');
              }
            } catch (loadError) {
              return res.status(500).json({ 
                error: 'Falha ao carregar o documento PDF. O arquivo pode estar corrompido.' 
              });
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

            // Upload the modified PDF to Cloudinary
            try {
              const uploadResult = await cloudinary.uploader.upload(
                Buffer.from(modifiedPdfBytes).toString('base64'),
                {
                  resource_type: 'raw',
                  public_id: document.fileKey,
                  overwrite: true
                }
              ) as CloudinaryResource;

              if (!uploadResult || !uploadResult.secure_url) {
                throw new Error('Failed to upload modified PDF to Cloudinary');
              }

              // Create signature record
              const signature = await prisma.signature.create({
                data: {
                  documentId: document.id,
                  userId: session.user.id,
                  signedAt: new Date(),
                  signatureImg: signatureImage
                }
              });

              return res.status(200).json({
                document: {
                  id: document.id,
                  name: document.name,
                  fileKey: document.fileKey,
                  userId: document.userId,
                  status: document.status,
                  createdAt: document.createdAt,
                  updatedAt: document.updatedAt,
                  mimeType: document.mimeType,
                  size: document.size,
                  signatures: [signature]
                }
              });
            } catch (uploadError) {
              return res.status(500).json({
                error: 'Falha ao fazer upload do documento assinado'
              });
            }
          } catch (alternativeError) {
            return res.status(500).json({
              error: 'Falha ao processar o documento'
            });
          }
        }
      } catch (downloadError) {
        return res.status(500).json({
          error: 'Falha ao baixar o documento'
        });
      }
    } catch (processError) {
      return res.status(500).json({
        error: 'Falha ao processar o documento'
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
} 