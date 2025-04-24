import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

interface CheckResponse {
  exists: boolean;
  fileKey?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckResponse>
): Promise<void> {
  if (req.method !== 'GET') {
    return res.status(405).json({ exists: false, error: 'Method not allowed' });
  }

  try {
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

    return res.status(200).json({ exists: true, fileKey: document.fileKey });
  } catch (error) {
    console.error('Error checking document:', error);
    return res.status(500).json({ exists: false, error: 'Erro ao verificar documento' });
  }
} 