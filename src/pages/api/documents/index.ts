import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const session = await getSession({ req });
        if (!session) {
            return res.status(401).json({ message: "Unauthorized" });
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
                    in: documents.map(doc => doc.id),
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
        const documentsWithSignatures = documents.map(doc => ({
            ...doc,
            signature: signatures.find(sig => sig.documentId === doc.id),
        }));

        return res.status(200).json(documentsWithSignatures);
    } catch (error) {
        console.error("Error fetching documents:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}