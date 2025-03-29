import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getSession({ req });
    if (!session) return res.status(401).json({ error: "Não autorizado" });

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "ID do documento inválido" });
    }

    if (req.method === "GET") {
        try {
            const document = await prisma.document.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    fileKey: true,
                    userId: true,
                    status: true,
                    mimeType: true,
                    size: true,
                    createdAt: true,
                    updatedAt: true,
                }
            });

            if (!document) {
                return res.status(404).json({ error: "Documento não encontrado" });
            }

            if (document.userId !== session.user.id) {
                return res.status(403).json({ error: "Acesso negado" });
            }

            return res.status(200).json(document);
        } catch (error) {
            console.error('Erro ao buscar documento:', error);
            return res.status(500).json({ error: "Erro interno ao buscar documento" });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}