import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    console.log('=== Iniciando rota de visualização do documento ===');
    console.log('URL da requisição:', request.url);
    
    const session = await getServerSession(authOptions);
    console.log('Session:', session ? 'Autenticado' : 'Não autenticado');
    
    if (!session) {
        console.log('Erro: Usuário não autenticado');
        return NextResponse.json(
            { error: "Não autorizado" },
            { status: 401 }
        );
    }

    const { id } = await params;
    console.log('ID do documento:', id);

    if (!id) {
        console.log('Erro: ID do documento inválido');
        return NextResponse.json(
            { error: "ID do documento inválido" },
            { status: 400 }
        );
    }

    try {
        console.log('Buscando documento no banco de dados...');
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
            console.log('Erro: Documento não encontrado no banco de dados');
            return NextResponse.json(
                { error: "Documento não encontrado" },
                { status: 404 }
            );
        }

        console.log('Documento encontrado:', {
            id: document.id,
            fileKey: document.fileKey,
            userId: document.userId,
            mimeType: document.mimeType
        });

        if (document.userId !== session.user.id) {
            console.log('Erro: Acesso negado - usuário não é o dono do documento');
            return NextResponse.json(
                { error: "Acesso negado" },
                { status: 403 }
            );
        }

        console.log('Iniciando download do arquivo do Supabase...');
        // Busca o arquivo do Supabase Storage
        const { data: fileData, error: fileError } = await supabase
            .storage
            .from('documents')
            .download(document.fileKey);

        if (fileError) {
            console.error('Erro ao buscar arquivo do Supabase:', fileError);
            return NextResponse.json(
                { error: "Erro ao buscar arquivo" },
                { status: 500 }
            );
        }

        console.log('Arquivo encontrado no Supabase, convertendo para buffer...');
        // Converte o arquivo para buffer
        const buffer = Buffer.from(await fileData.arrayBuffer());
        console.log('Tamanho do buffer:', buffer.length);

        console.log('Retornando arquivo com headers apropriados...');
        // Retorna o arquivo
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': document.mimeType || 'application/pdf',
                'Content-Disposition': `inline; filename="${document.fileKey}"`,
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch (error) {
        console.error('Erro ao buscar documento:', error);
        if (error instanceof Error) {
            console.error('Stack trace:', error.stack);
        }
        return NextResponse.json(
            { error: "Erro interno ao buscar documento" },
            { status: 500 }
        );
    }
} 