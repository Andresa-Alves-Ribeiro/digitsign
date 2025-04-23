import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

interface ViewResponse {
  error?: string;
  url?: string;
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ViewResponse>
): Promise<void> {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID do documento inválido' });
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
      return res.status(403).json({ error: 'Você não tem permissão para visualizar este documento' });
    }

    try {
      // Primeiro, vamos verificar se o arquivo existe no Cloudinary
      await cloudinary.api.resource(document.fileKey, {
        resource_type: 'raw',
        type: 'upload'
      });

      // Generate a secure URL for the PDF
      const secureUrl = cloudinary.url(document.fileKey, {
        resource_type: 'raw',
        type: 'upload',
        secure: true
      });

      return res.status(200).json({ url: secureUrl });
    } catch (cloudinaryError) {
      console.error('Cloudinary error:', cloudinaryError);
      return res.status(404).json({ error: 'Arquivo não encontrado no Cloudinary' });
    }
  } catch (error) {
    console.error('Error viewing document:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 