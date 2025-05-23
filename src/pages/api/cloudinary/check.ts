import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

interface CloudinaryCheckResponse {
  configured: boolean;
  cloudName?: string;
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
    return res.status(405).json({ configured: false, error: 'Method not allowed' });
  }

  try {
    // Ensure Cloudinary is configured
    ensureCloudinaryConfig();
    
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ configured: false, error: 'Não autorizado' });
    }

    // Check if Cloudinary is configured
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(500).json({ 
        configured: false, 
        error: 'Cloudinary não está configurado corretamente. Verifique as variáveis de ambiente.' 
      });
    }

    // Try to ping Cloudinary
    try {
      await cloudinary.api.ping();
      return res.status(200).json({ 
        configured: true, 
        cloudName: cloudName 
      });
    } catch (error) {
      console.error('Error pinging Cloudinary:', error);
      return res.status(500).json({ 
        configured: false, 
        error: 'Não foi possível conectar ao Cloudinary. Verifique suas credenciais.' 
      });
    }
  } catch (error) {
    console.error('Error checking Cloudinary:', error);
    return res.status(500).json({ configured: false, error: 'Erro ao verificar configuração do Cloudinary' });
  }
} 