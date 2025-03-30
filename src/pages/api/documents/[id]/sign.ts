import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

interface SignRequest {
    signatureData: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
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

        if (typeof id !== 'string') {
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

        if (document.status === 'SIGNED') {
            return res.status(400).json({ error: 'Este documento já está assinado' });
        }

        await prisma.$transaction([
            prisma.document.update({
                where: { id },
                data: { status: 'SIGNED' },
            }),
            prisma.signature.create({
                data: {
                    documentId: id,
                    userId: session.user.id,
                    signatureImg: signatureData,
                    signedAt: new Date(),
                },
            }),
        ]);

        return res.status(200).json({ success: true, message: 'Documento assinado com sucesso' });
    } catch (error) {
        console.error('Signature error:', error);
        if (error instanceof Error) {
            return res.status(500).json({ error: `Erro ao assinar documento: ${error.message}` });
        }
        return res.status(500).json({ error: 'Erro interno ao processar a assinatura' });
    }
} 