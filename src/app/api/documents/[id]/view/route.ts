import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import path from 'path';
import fs from 'fs';
import { authOptions } from "@/lib/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json(
            { error: "Não autorizado" },
            { status: 401 }
        );
    }

    const { id } = await params;

    if (!id) {
        return NextResponse.json(
            { error: "ID do documento inválido" },
            { status: 400 }
        );
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
            return NextResponse.json(
                { error: "Documento não encontrado" },
                { status: 404 }
            );
        }

        console.log('Documento encontrado:', document);

        if (document.userId !== session.user.id) {
            console.log('Acesso negado: usuário não é o dono do documento');
            return NextResponse.json(
                { error: "Acesso negado" },
                { status: 403 }
            );
        }

        // Caminho do arquivo no diretório de uploads
        const filePath = path.join(process.cwd(), 'uploads', document.fileKey);
        console.log('Caminho do arquivo:', filePath);

        // Verificar se o arquivo existe
        if (!fs.existsSync(filePath)) {
            console.error('Arquivo não encontrado no caminho:', filePath);
            return NextResponse.json(
                { error: "Arquivo não encontrado" },
                { status: 404 }
            );
        }

        console.log('Arquivo encontrado, enviando...');

        // Ler o arquivo
        const fileBuffer = fs.readFileSync(filePath);

        // Criar a resposta com o arquivo
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': document.mimeType || 'application/pdf',
                'Content-Disposition': `inline; filename="${document.fileKey}"`,
            },
        });
    } catch (error) {
        console.error('Erro ao buscar documento:', error);
        return NextResponse.json(
            { error: "Erro interno ao buscar documento" },
            { status: 500 }
        );
    }
} 