import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";
import fs from 'fs';
import path from 'path';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "DELETE") {
        return res.status(405).json({ error: "Método não permitido" });
    }

    const session = await getSession({ req });
    if (!session) return res.status(401).json({ error: "Não autorizado" });

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "ID do documento inválido" });
    }

    try {
        // Buscar o documento
        const document = await prisma.document.findUnique({
            where: { id },
            select: {
                id: true,
                fileKey: true,
                userId: true,
            }
        });

        if (!document) {
            return res.status(404).json({ error: "Documento não encontrado" });
        }

        // Verificar se o usuário é o dono do documento
        if (document.userId !== session.user.id) {
            return res.status(403).json({ error: "Acesso negado" });
        }

        // Caminho do arquivo
        const filePath = path.join(process.cwd(), 'uploads', document.fileKey);

        // Excluir o arquivo físico
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Excluir o registro do banco de dados
        await prisma.document.delete({
            where: { id }
        });

        return res.status(200).json({ message: "Documento excluído com sucesso" });
    } catch (error) {
        console.error('Erro ao excluir documento:', error);
        return res.status(500).json({ error: "Erro interno ao excluir documento" });
    }
} 