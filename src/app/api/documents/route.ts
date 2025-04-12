import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(): Promise<Response> {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const documents = await prisma.document.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const documentIds = documents.map(doc => doc.id);

    const signatures = await prisma.signature.findMany({
      where: {
        documentId: {
          in: documentIds,
        },
      },
    });

    const documentsWithSignatures = documents.map(doc => ({
      ...doc,
      signature: signatures.find(sig => sig.documentId === doc.id) || null,
    }));

    return new Response(JSON.stringify(documentsWithSignatures), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 