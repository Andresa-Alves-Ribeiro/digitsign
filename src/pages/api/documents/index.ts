import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { DocumentStatus } from '@prisma/client';

interface DocumentResponse {
  id: string;
  name: string;
  fileKey: string;
  userId: string;
  status: DocumentStatus;
  createdAt: Date;
  updatedAt: Date;
  mimeType?: string | null;
  size?: number | null;
  signature: {
    id: string;
    documentId: string;
    userId: string;
    signatureImg: string;
    createdAt: Date;
    signedAt: Date | null;
  } | null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DocumentResponse[] | { error: string }>
): Promise<void> {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get all documents with their signatures
    const documentsWithSignatures = await prisma.document.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        signature: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(documentsWithSignatures);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return res.status(500).json({ error: 'Erro ao buscar documentos' });
  }
} 