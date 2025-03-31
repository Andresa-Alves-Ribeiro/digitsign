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
            console.log("No session found");
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        console.log("Fetching documents for user:", session.user.id);
        const documents = await prisma.document.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        console.log(`Found ${documents.length} documents`);

        // Fetch signatures for all documents
        const documentIds = documents.map((doc: Document) => doc.id);
        console.log("Fetching signatures for document IDs:", documentIds);
        
        const signatures = await prisma.signature.findMany({
            where: {
                documentId: {
                    in: documentIds,
                },
            },
            select: {
                id: true,
                documentId: true,
                signatureImg: true,
                signedAt: true,
            },
        });

        console.log(`Found ${signatures.length} signatures`);

        // Combine documents with their signatures
        const documentsWithSignatures = documents.map((doc: Document) => ({
            ...doc,
            signature: signatures.find((sig: SignatureSelect) => sig.documentId === doc.id),
        }));

        return NextResponse.json(documentsWithSignatures);
    } catch (error) {
        console.error("Error fetching documents:", error);
        // Log more details about the error
        if (error instanceof Error) {
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        }
        return NextResponse.json(
            { 
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
} 