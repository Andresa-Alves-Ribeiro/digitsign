import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { join } from 'path';
import { readFile } from 'fs/promises';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

    const filepath = join(process.cwd(), 'uploads', document.fileKey);
    const fileBuffer = await readFile(filepath);

    res.setHeader('Content-Type', document.mimeType || 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${document.name}"`);
    return res.send(fileBuffer);
  } catch (error) {
    console.error('Error viewing document:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 