import { createMocks } from 'node-mocks-http';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
import handler from '../../documents/stats';

// Mock do next-auth
jest.mock('next-auth/react', () => ({
  getSession: jest.fn()
}));

// Mock do prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    document: {
      count: jest.fn()
    }
  }
}));

describe('Document Stats API', () => {
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
      message: 'Method not allowed'
    });
  });

  it('should return 401 when not authenticated', async () => {
    const { req, res } = createMocks({
      method: 'GET'
    });

    (getSession as jest.Mock).mockResolvedValueOnce(null);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Unauthorized'
    });
  });

  it('should return document statistics', async () => {
    const mockSession = {
      user: {
        id: '1',
        email: 'test@example.com'
      }
    };

    const { req, res } = createMocks({
      method: 'GET'
    });

    (getSession as jest.Mock).mockResolvedValueOnce(mockSession);
    (prisma.document.count as jest.Mock)
      .mockResolvedValueOnce(10) // total
      .mockResolvedValueOnce(4)  // pending
      .mockResolvedValueOnce(6); // signed

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      total: 10,
      pending: 4,
      signed: 6
    });

    expect(prisma.document.count).toHaveBeenCalledTimes(3);
    expect(prisma.document.count).toHaveBeenCalledWith();
    expect(prisma.document.count).toHaveBeenCalledWith({
      where: {
        status: 'PENDING'
      }
    });
    expect(prisma.document.count).toHaveBeenCalledWith({
      where: {
        status: 'SIGNED'
      }
    });
  });

  it('should handle database errors', async () => {
    const mockSession = {
      user: {
        id: '1',
        email: 'test@example.com'
      }
    };

    const { req, res } = createMocks({
      method: 'GET'
    });

    (getSession as jest.Mock).mockResolvedValueOnce(mockSession);
    (prisma.document.count as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Internal server error'
    });
  });
}); 