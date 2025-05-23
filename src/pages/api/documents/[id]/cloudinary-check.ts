import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

interface CloudinaryCheckResponse {
  exists: boolean;
  fileKey?: string;
  error?: string;
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
  res: NextApiResponse<CloudinaryCheckResponse>
): Promise<void> {
  if (req.method !== 'GET') {
    return res.status(405).json({ exists: false, error: 'Method not allowed' });
  }

  try {
    // Ensure Cloudinary is configured
    ensureCloudinaryConfig();
    
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ exists: false, error: 'Não autorizado' });
    }

    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ exists: false, error: 'ID do documento inválido' });
    }

    const document = await prisma.document.findUnique({
      where: { id },
      select: {
        id: true,
        fileKey: true,
        userId: true
      }
    });

    if (!document) {
      return res.status(404).json({ exists: false, error: 'Documento não encontrado' });
    }

    if (document.userId !== session.user.id) {
      return res.status(403).json({ exists: false, error: 'Você não tem permissão para acessar este documento' });
    }

    try {
      // Check if the file exists in Cloudinary
      await cloudinary.api.resource(document.fileKey, {
        resource_type: 'raw',
        type: 'upload'
      });

      return res.status(200).json({ exists: true, fileKey: document.fileKey });
    } catch (cloudinaryError) {
      console.error('Cloudinary error:', cloudinaryError);
      return res.status(404).json({ 
        exists: false, 
        fileKey: document.fileKey,
        error: 'Arquivo não encontrado no Cloudinary' 
      });
    }
  } catch (error) {
    console.error('Error checking document in Cloudinary:', error);
    return res.status(500).json({ exists: false, error: 'Erro ao verificar documento no Cloudinary' });
  }
} 