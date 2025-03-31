import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { promises as fs } from "fs";
import path from "path";
import formidable from "formidable";
import { prisma } from "@/lib/prisma";

export const config = {
    api: {
        bodyParser: false,
    },
};

// Tipos permitidos de arquivo
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/x-pdf'];
const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB

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

        const uploadDir = path.join(process.cwd(), "uploads");
        
        // Cria o diretório de uploads se não existir
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        // Configuração do formidable
        const form = formidable({
            uploadDir,
            keepExtensions: true,
            maxFileSize: MAX_FILE_SIZE,
            filter: ({ mimetype }) => {
                return mimetype ? mimetype.includes("pdf") : false;
            },
            filename: (_, ext) => {
                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
                return `${uniqueSuffix}${ext}`;
            }
        });

        const [, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve([fields, files]);
            });
        });

        const file = files.file?.[0] as formidable.File;

        if (!file) {
            return res.status(400).json({ message: "Nenhum arquivo enviado" });
        }

        // Verifica se o arquivo é um PDF baseado na extensão também
        const fileExtension = path.extname(file.originalFilename || file.newFilename || '').toLowerCase();
        const isPDFByExtension = fileExtension === '.pdf';
        const isPDFByMimeType = file.mimetype && ALLOWED_FILE_TYPES.includes(file.mimetype);

        // Se não tiver extensão, tenta inferir pelo conteúdo do arquivo
        let isPDFByContent = false;
        if (!isPDFByExtension && !isPDFByMimeType) {
            try {
                const fileContent = await fs.readFile(file.filepath, { encoding: 'utf8', flag: 'r' });
                isPDFByContent = fileContent.startsWith('%PDF-');
            } catch (err) {
                console.error('Error reading file content:', err);
            }
        }

        if (!isPDFByMimeType && !isPDFByExtension && !isPDFByContent) {
            // Remove o arquivo se não for um PDF válido
            try {
                await fs.unlink(file.filepath);
            } catch (err) {
                console.error('Error removing invalid file:', err);
            }

            return res.status(400).json({ 
                message: "Tipo de arquivo não permitido. Apenas PDFs são aceitos.",
                details: {
                    mimetype: file.mimetype,
                    extension: fileExtension,
                    originalFilename: file.originalFilename,
                    newFilename: file.newFilename
                }
            });
        }

        const fileName = file.newFilename;

        // Obter o tamanho do arquivo
        const stats = await fs.stat(file.filepath);
        const fileSize = stats.size;

        // Salvar metadados no banco de dados
        await prisma.document.create({
            data: {
                name: file.originalFilename || fileName,
                fileKey: fileName,
                userId: session.user.id,
                status: "PENDING",
                mimeType: file.mimetype || 'application/pdf',
                size: fileSize,
            },
        });

        return res.status(200).json({ 
            message: "File uploaded successfully",
            fileName: fileName,
            originalName: file.originalFilename,
            size: fileSize,
            mimeType: file.mimetype || 'application/pdf'
        });
    } catch (err) {
        console.error('Error in upload handler:', err);
        if (err instanceof Error) {
            return res.status(500).json({ 
                message: "Error uploading file",
                error: err.message 
            });
        }
        return res.status(500).json({ 
            message: "Error uploading file",
            error: "Unknown error occurred" 
        });
    }
}