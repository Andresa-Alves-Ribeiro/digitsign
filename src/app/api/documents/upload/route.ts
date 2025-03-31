import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

// Tipos permitidos de arquivo
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/x-pdf'];
const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB

export const config = {
    api: {
        bodyParser: false,
        responseLimit: '30mb',
    },
};

export async function POST(request: Request) {
    try {
        console.log('Starting upload process...');
        
        const session = await getServerSession(authOptions);
        if (!session) {
            console.log('No session found');
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        console.log('Session found, processing form data...');
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            console.log('No file found in form data');
            return NextResponse.json(
                { message: "Nenhum arquivo enviado" },
                { status: 400 }
            );
        }

        console.log('File received:', {
            name: file.name,
            type: file.type,
            size: file.size
        });

        // Verifica o tipo do arquivo
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            console.log('Invalid file type:', file.type);
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
            console.log('File too large:', file.size);
            return NextResponse.json(
                { message: "Arquivo muito grande. Tamanho máximo permitido: 30MB" },
                { status: 400 }
            );
        }

        // Gera um nome único para o arquivo
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const fileName = `${uniqueSuffix}.pdf`;

        console.log('Converting file to buffer...');
        // Converte o arquivo para buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Faz upload do arquivo para o Supabase Storage
        console.log('Starting Supabase upload...');
        console.log('File details:', {
            name: fileName,
            type: file.type,
            size: file.size
        });

        const { error: uploadError } = await supabase
            .storage
            .from('documents')
            .upload(fileName, buffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error('Supabase upload error:', {
                message: uploadError.message,
                name: uploadError.name,
                status: uploadError.status,
                details: uploadError.details
            });
            return NextResponse.json(
                { 
                    message: "Erro ao fazer upload do arquivo", 
                    error: uploadError.message,
                    details: uploadError.details
                },
                { status: 500 }
            );
        }

        console.log('File uploaded to Supabase successfully');

        // Salvar metadados no banco de dados
        console.log('Saving document metadata to database...');
        const document = await prisma.document.create({
            data: {
                name: file.name,
                fileKey: fileName,
                userId: session.user.id,
                status: "PENDING",
                mimeType: file.type,
                size: file.size,
            },
        });

        console.log('Document metadata saved successfully');

        return NextResponse.json({ 
            message: "File uploaded successfully",
            document: {
                id: document.id,
                name: document.name,
                fileKey: document.fileKey,
                size: document.size,
                mimeType: document.mimeType
            }
        });
    } catch (err) {
        console.error('Error in upload handler:', err);
        if (err instanceof Error) {
            return NextResponse.json({ 
                message: "Error uploading file",
                error: err.message,
                stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
            }, { status: 500 });
        }
        return NextResponse.json({ 
            message: "Error uploading file",
            error: "Unknown error occurred" 
        }, { status: 500 });
    }
} 