import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import type { Document } from "@prisma/client";
import { authOptions } from "@/lib/auth";

type SignatureSelect = {
    id: string;
    documentId: string;
    signatureImg: string;
    signedAt: Date | null;
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const documents = await prisma.document.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Fetch signatures for all documents
        const signatures = await prisma.signature.findMany({
            where: {
                documentId: {
                    in: documents.map((doc: Document) => doc.id),
                },
            },
            select: {
                id: true,
                documentId: true,
                signatureImg: true,
                signedAt: true,
            },
        });

        // Combine documents with their signatures
        const documentsWithSignatures = documents.map((doc: Document) => ({
            ...doc,
            signature: signatures.find((sig: SignatureSelect) => sig.documentId === doc.id),
        }));

        return NextResponse.json(documentsWithSignatures);
    } catch (error) {
        console.error("Error fetching documents:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
} 