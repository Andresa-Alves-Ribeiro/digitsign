import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const resolvedParams = await params;
  try {
    const session = await getServerSession(authOptions);
        
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const id = resolvedParams.id;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Document ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        signature: true,
      },
    });

    if (!document) {
      return new Response(JSON.stringify({ error: 'Document not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (document.userId !== session.user.id) {
      return new Response(JSON.stringify({ error: 'Access denied' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(document), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching document metadata:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 