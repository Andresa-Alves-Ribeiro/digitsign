import { createMocks } from 'node-mocks-http';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import handler from '@/pages/api/documents/[id]/status';

// Mock do next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn()
}));

// Mock do prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    document: {
      findUnique: jest.fn(),
      update: jest.fn()
    }
  }
}));

describe('Document Status API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 405 for non-PUT requests', async () => {
    const { req, res } = createMocks({
      method: 'POST'
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Method not allowed'
    });
  });

  it('should return 401 for unauthenticated requests', async () => {
    const { req, res } = createMocks({
      method: 'PUT',
      query: {
        id: '1'
      }
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Não autorizado'
    });
  });

  it('should return 400 for invalid document ID', async () => {
    const { req, res } = createMocks({
      method: 'PUT',
      query: {
        id: 'invalid-id'
      }
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: {
        id: '1',
        email: 'test@example.com'
      }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'ID do documento inválido'
    });
  });

  it('should return 404 for non-existent document', async () => {
    const { req, res } = createMocks({
      method: 'PUT',
      query: {
        id: '1'
      },
      body: {
        status: 'SIGNED'
      }
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: {
        id: '1',
        email: 'test@example.com'
      }
    });

    (prisma.document.findUnique as jest.Mock).mockResolvedValueOnce(null);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Documento não encontrado'
    });
  });

  it('should return 403 for unauthorized user', async () => {
    const { req, res } = createMocks({
      method: 'PUT',
      query: {
        id: '1'
      },
      body: {
        status: 'SIGNED'
      }
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: {
        id: '2',
        email: 'test@example.com'
      }
    });

    (prisma.document.findUnique as jest.Mock).mockResolvedValueOnce({
      id: '1',
      userId: '1',
      status: 'PENDING'
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(403);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Você não tem permissão para atualizar este documento'
    });
  });

  it('should successfully update document status', async () => {
    const { req, res } = createMocks({
      method: 'PUT',
      query: {
        id: '1'
      },
      body: {
        status: 'SIGNED'
      }
    });

    const mockUser = {
      id: '1',
      email: 'test@example.com'
    };

    const mockDocument = {
      id: '1',
      userId: '1',
      status: 'PENDING',
      name: 'test.pdf'
    };

    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: mockUser
    });

    (prisma.document.findUnique as jest.Mock).mockResolvedValueOnce(mockDocument);
    (prisma.document.update as jest.Mock).mockResolvedValueOnce({
      ...mockDocument,
      status: 'SIGNED'
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Status do documento atualizado com sucesso',
      document: {
        ...mockDocument,
        status: 'SIGNED'
      }
    });

    expect(prisma.document.update).toHaveBeenCalledWith({
      where: {
        id: '1'
      },
      data: {
        status: 'SIGNED'
      }
    });
  });

  it('should handle database errors gracefully', async () => {
    const { req, res } = createMocks({
      method: 'PUT',
      query: {
        id: '1'
      },
      body: {
        status: 'SIGNED'
      }
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: {
        id: '1',
        email: 'test@example.com'
      }
    });

    (prisma.document.findUnique as jest.Mock).mockResolvedValueOnce({
      id: '1',
      userId: '1',
      status: 'PENDING'
    });

    (prisma.document.update as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Internal server error'
    });
  });
}); 