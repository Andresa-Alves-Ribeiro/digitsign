import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

type RouteContext = {
    params: {
        id: string;
    };
};

export async function DELETE(
    request: NextRequest,
    { params }: RouteContext
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            );
        }

        const { id } = params;
        if (!id) {
            return NextResponse.json(
                { error: 'ID do documento inválido' },
                { status: 400 }
            );
        }

        const document = await prisma.document.findUnique({
            where: { id },
            select: {
                id: true,
                fileKey: true,
                userId: true,
            }
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
            where: { id }
        });

        return NextResponse.json(
            { message: 'Documento excluído com sucesso' }
        );
    } catch (error) {
        console.error('Erro ao excluir documento:', error);
        if (error instanceof Error) {
            return NextResponse.json(
                { error: `Erro ao excluir documento: ${error.message}` },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { error: 'Erro interno ao excluir documento' },
            { status: 500 }
        );
    }
} 