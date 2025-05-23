import { createMocks } from 'node-mocks-http';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import handler from '../../documents';

// Mock do next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn()
}));

// Mock do prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    document: {
      findMany: jest.fn()
    },
    signature: {
      findMany: jest.fn()
    }
  }
}));

describe('Documents API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 405 for non-GET requests', async () => {
    const { req, res } = createMocks({
      method: 'POST'
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Method not allowed'
    });
  });

  it('should return 401 when not authenticated', async () => {
    const { req, res } = createMocks({
      method: 'GET'
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Unauthorized'
    });
  });

  it('should return documents for authenticated user', async () => {
    const mockSession = {
      user: {
        id: '1',
        email: 'test@example.com'
      }
    };

    const mockDocuments = [
      {
        id: '1',
        name: 'Document 1',
        fileKey: 'key1',
        userId: '1',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        mimeType: 'application/pdf',
        size: 1000
      }
    ];

    const mockSignatures = [
      {
        id: '1',
        documentId: '1',
        userId: '1',
        signatureImg: 'base64...',
        createdAt: new Date(),
        signedAt: null
      }
    ];

    const { req, res } = createMocks({
      method: 'GET'
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
    (prisma.document.findMany as jest.Mock).mockResolvedValueOnce(mockDocuments);
    (prisma.signature.findMany as jest.Mock).mockResolvedValueOnce(mockSignatures);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual([
      {
        ...mockDocuments[0],
        signature: mockSignatures[0]
      }
    ]);

    expect(prisma.document.findMany).toHaveBeenCalledWith({
      where: {
        userId: mockSession.user.id
      },
      select: {
        id: true,
        name: true,
        fileKey: true,
        userId: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        mimeType: true,
        size: true,
        signature: {
          select: {
            id: true,
            documentId: true,
            userId: true,
            signatureImg: true,
            createdAt: true,
            signedAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  });

  it('should handle errors gracefully', async () => {
    const mockSession = {
      user: {
        id: '1',
        email: 'test@example.com'
      }
    };

    const { req, res } = createMocks({
      method: 'GET'
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
    (prisma.document.findMany as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Internal Server Error'
    });
  });
}); 