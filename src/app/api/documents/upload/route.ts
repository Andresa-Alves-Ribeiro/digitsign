import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

interface UploadFile extends Blob {
    name: string;
    type: string;
}

const ALLOWED_FILE_TYPES = ['application/pdf', 'application/x-pdf'];
const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

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
        const file = formData.get('file') as UploadFile | null;

        if (!file) {
            return NextResponse.json(
                { message: "Nenhum arquivo enviado" },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Validate file
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            return NextResponse.json(
                {
                    message: "Tipo de arquivo não permitido. Apenas PDFs são aceitos.",
                    details: { mimetype: file.type, name: file.name }
                },
                { status: 400 }
            );
        }

        if (buffer.length > MAX_FILE_SIZE) {
            return NextResponse.json(
                { message: "Arquivo muito grande. Tamanho máximo permitido: 30MB" },
                { status: 400 }
            );
        }

        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const fileName = `${uniqueSuffix}.pdf`;

        const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(fileName, buffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            return NextResponse.json(
                { message: "Erro ao fazer upload", error: uploadError.message },
                { status: 500 }
            );
        }

        const document = await prisma.document.create({
            data: {
                name: file.name,
                fileKey: fileName,
                userId: session.user.id,
                status: "PENDING",
                mimeType: file.type,
                size: buffer.length,
            },
        });

        return NextResponse.json({
            message: "Upload realizado com sucesso",
            document: {
                id: document.id,
                name: document.name,
                fileKey: document.fileKey,
                size: document.size,
                mimeType: document.mimeType
            }
        });

    } catch (err) {
        console.error('Upload error:', err);
        return NextResponse.json(
            { message: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}