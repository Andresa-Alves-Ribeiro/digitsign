import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

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

        // Converte o arquivo para buffer
        const buffer = Buffer.from(await fileData.arrayBuffer());

        // Retorna o arquivo
        return new NextResponse(buffer, {
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