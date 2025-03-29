import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getSession({ req });
    if (!session?.user?.id) {
        return res.status(401).json({ 
            success: false,
            error: "Não autorizado" 
        });
    }

    if (req.method === "GET") {
        try {
            const documents = await prisma.document.findMany({
                where: { userId: session.user.id },
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    name: true,
                    fileKey: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                    userId: true
                }
            });

            return res.status(200).json({
                success: true,
                data: documents
            });
        } catch (error) {
            console.error("Erro ao buscar documentos:", error);
            return res.status(500).json({ 
                success: false,
                error: "Erro interno ao buscar documentos" 
            });
        }
    }

    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ 
        success: false,
        error: `Método ${req.method} não permitido` 
    });
}