import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import formidable from "formidable";
import { prisma } from "@/lib/prisma";

export const config = {
    api: {
        bodyParser: false, // Desativa o bodyParser padrão para usar formidable
    },
};

// Tipos permitidos de arquivo
const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getSession({ req });
    if (!session) return res.status(401).json({ error: "Não autorizado" });

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método não permitido" });
    }

    let uploadedFilePath: string | null = null;

    try {
        // Configuração do formidable
        const form = formidable({
            uploadDir: path.join(process.cwd(), "public", "uploads"),
            filename: (name, ext) => `${uuidv4()}${ext}`,
            maxFileSize: MAX_FILE_SIZE,
        });

        // Processar o upload
        const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve([fields, files]);
            });
        });

        const file = files.file?.[0];
        
        // Validações
        if (!file) {
            return res.status(400).json({ error: "Nenhum arquivo enviado" });
        }

        if (!file.mimetype || !ALLOWED_FILE_TYPES.includes(file.mimetype)) {
            throw new Error("Tipo de arquivo não permitido");
        }

        const documentName = fields.name?.[0];
        if (!documentName || typeof documentName !== 'string' || documentName.trim().length === 0) {
            throw new Error("Nome do documento é obrigatório");
        }

        uploadedFilePath = file.filepath;
        const fileName = path.basename(file.filepath);

        // Salvar metadados no banco de dados
        const document = await prisma.document.create({
            data: {
                name: documentName.trim(),
                fileKey: fileName,
                userId: session.user.id,
                status: "PENDING",
            },
        });

        res.status(201).json(document);
    } catch (error) {
        console.error("Upload error:", error);
        
        // Limpar arquivo em caso de erro
        if (uploadedFilePath) {
            try {
                await fs.unlink(uploadedFilePath);
            } catch (unlinkError) {
                console.error("Error deleting file:", unlinkError);
            }
        }

        if (error instanceof Error) {
            if (error.message === "Tipo de arquivo não permitido") {
                return res.status(400).json({ error: "Tipo de arquivo não permitido. Tipos aceitos: PDF, JPEG, PNG e GIF" });
            }
            if (error.message === "Nome do documento é obrigatório") {
                return res.status(400).json({ error: "Nome do documento é obrigatório" });
            }
        }

        res.status(500).json({ error: "Erro no upload do arquivo" });
    }
}