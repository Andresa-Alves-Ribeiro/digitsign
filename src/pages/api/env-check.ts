import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

interface EnvCheckResponse {
  cloudinaryConfigured: boolean;
  cloudName?: string;
  apiKeyConfigured: boolean;
  apiSecretConfigured: boolean;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EnvCheckResponse>
): Promise<void> {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      cloudinaryConfigured: false, 
      apiKeyConfigured: false, 
      apiSecretConfigured: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ 
        cloudinaryConfigured: false, 
        apiKeyConfigured: false, 
        apiSecretConfigured: false, 
        error: 'Não autorizado' 
      });
    }

    // Check if Cloudinary is configured
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    return res.status(200).json({ 
      cloudinaryConfigured: !!cloudName,
      cloudName: cloudName,
      apiKeyConfigured: !!apiKey,
      apiSecretConfigured: !!apiSecret
    });
  } catch (error) {
    console.error('Error checking environment variables:', error);
    return res.status(500).json({ 
      cloudinaryConfigured: false, 
      apiKeyConfigured: false, 
      apiSecretConfigured: false, 
      error: 'Erro ao verificar variáveis de ambiente' 
    });
  }
} 