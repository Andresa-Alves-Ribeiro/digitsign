import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

interface SignRequest {
    signatureData: string;
}

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
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
        const { signatureData } = await request.json() as SignRequest;

        if (!signatureData) {
            return NextResponse.json(
                { error: 'Imagem de assinatura é obrigatória' },
                { status: 400 }
            );
        }

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
                userId: true,
                status: true
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
                { error: 'Você não tem permissão para assinar este documento' },
                { status: 403 }
            );
        }

        if (document.status === 'SIGNED') {
            return NextResponse.json(
                { error: 'Este documento já está assinado' },
                { status: 400 }
            );
        }

        await prisma.$transaction([
            prisma.document.update({
                where: { id },
                data: { status: 'SIGNED' },
            }),
            prisma.signature.create({
                data: {
                    documentId: id,
                    userId: session.user.id,
                    signatureImg: signatureData,
                    signedAt: new Date(),
                },
            }),
        ]);

        return NextResponse.json(
            { success: true, message: 'Documento assinado com sucesso' }
        );
    } catch (error) {
        console.error('Signature error:', error);
        if (error instanceof Error) {
            return NextResponse.json(
                { error: `Erro ao assinar documento: ${error.message}` },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { error: 'Erro interno ao processar a assinatura' },
            { status: 500 }
        );
    }
} 