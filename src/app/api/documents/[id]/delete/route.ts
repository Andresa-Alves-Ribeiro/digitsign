import { NextResponse } from 'next/server';
import { getServerSession, Session } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function DELETE(
    request: Request,
    { params }: { params: { [key: string]: string | string[] } }
) {
    try {
        // Verificar se o ID existe nos parâmetros
        if (!params.id || Array.isArray(params.id)) {
            return NextResponse.json(
                { error: 'ID do documento inválido' },
                { status: 400 }
            );
        }

        const documentId = params.id;
        const session = await getServerSession(authOptions) as Session;
        
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            );
        }

        const document = await prisma.document.findUnique({
            where: { id: documentId }
        });

        if (!document) {
            return NextResponse.json(
                { error: 'Documento não encontrado' },
                { status: 404 }
            );
        }

        if (document.userId !== session.user.id) {
            return NextResponse.json(
                { error: 'Acesso negado' },
                { status: 403 }
            );
        }

        const filePath = path.join(process.cwd(), 'uploads', document.fileKey);

        // Excluir o arquivo físico
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Excluir o registro do banco de dados
        await prisma.document.delete({
            where: { id: documentId }
        });

        return NextResponse.json(
            { message: 'Documento excluído com sucesso' }
        );
    } catch (error) {
        console.error('Erro ao excluir documento:', error);
        return NextResponse.json(
            { error: 'Erro interno ao excluir documento' },
            { status: 500 }
        );
    }
}