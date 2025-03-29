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
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const session = await getSession({ req });
        if (!session) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const form = formidable({
            uploadDir: path.join(process.cwd(), "uploads"),
            keepExtensions: true,
            maxFileSize: MAX_FILE_SIZE, // 10MB
        });

        // Cria o diretório de uploads se não existir
        if (!fs.existsSync(form.uploadDir)) {
            fs.mkdirSync(form.uploadDir, { recursive: true });
        }

        const [fields, files] = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve([fields, files]);
            });
        });

        const file = files.file as formidable.File;

        if (!file) {
            return res.status(400).json({ message: "Nenhum arquivo enviado" });
        }

        if (!file.mimetype || !ALLOWED_FILE_TYPES.includes(file.mimetype)) {
            throw new Error("Tipo de arquivo não permitido");
        }

        const fileName = file.newFilename;

        // Salvar metadados no banco de dados
        const document = await prisma.document.create({
            data: {
                name: file.originalFilename || fileName,
                fileKey: fileName,
                userId: session.user.id,
                status: "PENDING",
            },
        });

        return res.status(200).json({ 
            message: "File uploaded successfully",
            fileName: fileName,
            originalName: file.originalFilename
        });
    } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({ message: "Error uploading file" });
    }
}