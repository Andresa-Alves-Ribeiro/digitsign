import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";

interface SignRequest {
    signatureImg: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getSession({ req });
    if (!session) return res.status(401).json({ error: "Não autorizado" });

    const { id } = req.query;

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método não permitido" });
    }

    try {
        const { signatureImg } = req.body as SignRequest;

        if (!signatureImg) {
            return res.status(400).json({ error: "Imagem de assinatura é obrigatória" });
        }

        const document = await prisma.document.findUnique({
            where: { id: id as string },
            select: {
                id: true,
                userId: true,
                status: true
            }
        });

        if (!document) {
            return res.status(404).json({ error: "Documento não encontrado" });
        }

        if (document.userId !== session.user.id) {
            return res.status(403).json({ error: "Você não tem permissão para assinar este documento" });
        }

        if (document.status === "SIGNED") {
            return res.status(400).json({ error: "Este documento já está assinado" });
        }

        await prisma.$transaction([
            prisma.document.update({
                where: { id: id as string },
                data: { status: "SIGNED" },
            }),
            prisma.signature.create({
                data: {
                    documentId: id as string,
                    userId: session.user.id,
                    signatureImg,
                    signedAt: new Date(),
                },
            }),
        ]);

        res.status(200).json({ success: true, message: "Documento assinado com sucesso" });
    } catch (error) {
        console.error("Signature error:", error);
        if (error instanceof Error) {
            return res.status(500).json({ error: `Erro ao assinar documento: ${error.message}` });
        }
        res.status(500).json({ error: "Erro interno ao processar a assinatura" });
    }
}