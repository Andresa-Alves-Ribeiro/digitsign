import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

interface DocumentMetadataResponse {
  id: string;
  name: string;
  fileKey: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  signature: {
    id: string;
    documentId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DocumentMetadataResponse | { error: string }>
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
      include: {
        signature: true,
      }
    });

    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    if (document.userId !== session.user.id) {
      return res.status(403).json({ error: 'Você não tem permissão para acessar este documento' });
    }

    return res.status(200).json(document);
  } catch (error) {
    console.error('Error fetching document metadata:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 