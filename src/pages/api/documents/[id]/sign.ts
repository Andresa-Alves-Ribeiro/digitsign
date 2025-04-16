import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

interface SignRequest {
  signatureData: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const { id } = req.query;
    const { signatureData } = req.body as SignRequest;

    if (!signatureData) {
      return res.status(400).json({ error: 'Imagem de assinatura é obrigatória' });
    }

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID do documento inválido' });
    }

    const document = await prisma.document.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        status: true
      }
    });

    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    if (document.userId !== session.user.id) {
      return res.status(403).json({ error: 'Você não tem permissão para assinar este documento' });
    }

    if (document.status.toUpperCase() === 'SIGNED') {
      return res.status(400).json({ error: 'Este documento já foi assinado' });
    }

    // Create signature record
    const signature = await prisma.signature.create({
      data: {
        documentId: id,
        userId: session.user.id,
        signatureImg: signatureData,
        signedAt: new Date(),
      },
    });

    // Update document status
    await prisma.document.update({
      where: { id },
      data: {
        status: 'SIGNED'
      }
    });

    return res.status(201).json({
      message: 'Documento assinado com sucesso',
      signature,
    });
  } catch (error) {
    console.error('Error signing document:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 