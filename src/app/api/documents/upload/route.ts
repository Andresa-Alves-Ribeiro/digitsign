import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { promises as fs } from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// Tipos permitidos de arquivo
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/x-pdf'];
const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { message: "Nenhum arquivo enviado" },
                { status: 400 }
            );
        }

        // Verifica o tipo do arquivo
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            return NextResponse.json(
                { 
                    message: "Tipo de arquivo não permitido. Apenas PDFs são aceitos.",
                    details: {
                        mimetype: file.type,
                        name: file.name
                    }
                },
                { status: 400 }
            );
        }

        // Verifica o tamanho do arquivo
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { message: "Arquivo muito grande. Tamanho máximo permitido: 30MB" },
                { status: 400 }
            );
        }

        const uploadDir = path.join(process.cwd(), "uploads");
        
        // Cria o diretório de uploads se não existir
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        // Gera um nome único para o arquivo
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const fileName = `${uniqueSuffix}.pdf`;
        const filePath = path.join(uploadDir, fileName);

        // Converte o arquivo para buffer e salva
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await fs.writeFile(filePath, buffer);

        // Salvar metadados no banco de dados
        await prisma.document.create({
            data: {
                name: file.name,
                fileKey: fileName,
                userId: session.user.id,
                status: "PENDING",
                mimeType: file.type,
                size: file.size,
            },
        });

        return NextResponse.json({ 
            message: "File uploaded successfully",
            fileName: fileName,
            originalName: file.name,
            size: file.size,
            mimeType: file.type
        });
    } catch (err) {
        console.error('Error in upload handler:', err);
        if (err instanceof Error) {
            return NextResponse.json({ 
                message: "Error uploading file",
                error: err.message 
            }, { status: 500 });
        }
        return NextResponse.json({ 
            message: "Error uploading file",
            error: "Unknown error occurred" 
        }, { status: 500 });
    }
} 