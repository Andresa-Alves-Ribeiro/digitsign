import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";
import path from 'path';
import fs from 'fs';

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

    try {
        console.log('Buscando documento com ID:', id);
        const document = await prisma.document.findUnique({
            where: { id },
            select: {
                id: true,
                fileKey: true,
                userId: true,
                mimeType: true,
            }
        });

        if (!document) {
            console.log('Documento não encontrado no banco de dados');
            return res.status(404).json({ error: "Documento não encontrado" });
        }

        console.log('Documento encontrado:', document);

        if (document.userId !== session.user.id) {
            console.log('Acesso negado: usuário não é o dono do documento');
            return res.status(403).json({ error: "Acesso negado" });
        }

        // Caminho do arquivo no diretório de uploads
        const filePath = path.join(process.cwd(), 'uploads', document.fileKey);
        console.log('Caminho do arquivo:', filePath);

        // Verificar se o arquivo existe
        if (!fs.existsSync(filePath)) {
            console.error('Arquivo não encontrado no caminho:', filePath);
            return res.status(404).json({ error: "Arquivo não encontrado" });
        }

        console.log('Arquivo encontrado, enviando...');

        // Ler o arquivo
        const fileBuffer = fs.readFileSync(filePath);

        // Configurar os headers da resposta
        res.setHeader('Content-Type', document.mimeType || 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${document.fileKey}"`);

        // Enviar o arquivo
        return res.send(fileBuffer);
    } catch (error) {
        console.error('Erro ao buscar documento:', error);
        return res.status(500).json({ error: "Erro interno ao buscar documento" });
    }
} 