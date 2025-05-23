import { createMocks } from 'node-mocks-http';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import handler from '../../documents/[id]';

// Mock do next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn()
}));

// Mock do prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    document: {
      findUnique: jest.fn(),
      delete: jest.fn()
    },
    signature: {
      findUnique: jest.fn(),
      delete: jest.fn()
    }
  }
}));

// Mock do cloudinary
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      destroy: jest.fn()
    }
  }
}));

describe('Document Delete API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 405 for non-DELETE requests', async () => {
    const { req, res } = createMocks({
      method: 'GET'
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Method not allowed'
    });
  });

  it('should return 401 when not authenticated', async () => {
    const { req, res } = createMocks({
      method: 'DELETE'
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Unauthorized'
    });
  });

  it('should return 400 for invalid document ID', async () => {
    const mockSession = {
      user: {
        id: '1',
        email: 'test@example.com'
      }
    };

    const { req, res } = createMocks({
      method: 'DELETE',
      query: {}
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Invalid document ID'
    });
  });

  it('should return 404 when document not found', async () => {
    const mockSession = {
      user: {
        id: '1',
        email: 'test@example.com'
      }
    };

    const { req, res } = createMocks({
      method: 'DELETE',
      query: {
        id: '1'
      }
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
    (prisma.document.findUnique as jest.Mock).mockResolvedValueOnce(null);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Document not found'
    });
  });

  it('should return 403 when user does not own the document', async () => {
    const mockSession = {
      user: {
        id: '1',
        email: 'test@example.com'
      }
    };

    const mockDocument = {
      id: '1',
      userId: '2',
      fileKey: 'test-key'
    };

    const { req, res } = createMocks({
      method: 'DELETE',
      query: {
        id: '1'
      }
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
    (prisma.document.findUnique as jest.Mock).mockResolvedValueOnce(mockDocument);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(403);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Access denied'
    });
  });

  it('should successfully delete document and associated data', async () => {
    const mockSession = {
      user: {
        id: '1',
        email: 'test@example.com'
      }
    };

    const mockDocument = {
      id: '1',
      userId: '1',
      fileKey: 'test-key'
    };

    const mockSignature = {
      id: '1',
      documentId: '1'
    };

    const { req, res } = createMocks({
      method: 'DELETE',
      query: {
        id: '1'
      }
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
    (prisma.document.findUnique as jest.Mock).mockResolvedValueOnce(mockDocument);
    (prisma.signature.findUnique as jest.Mock).mockResolvedValueOnce(mockSignature);
    (cloudinary.uploader.destroy as jest.Mock).mockResolvedValueOnce({ result: 'ok' });
    (prisma.signature.delete as jest.Mock).mockResolvedValueOnce(mockSignature);
    (prisma.document.delete as jest.Mock).mockResolvedValueOnce(mockDocument);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Document deleted successfully'
    });

    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('test-key', {
      resource_type: 'raw',
      type: 'upload'
    });
    expect(prisma.signature.delete).toHaveBeenCalledWith({
      where: { documentId: '1' }
    });
    expect(prisma.document.delete).toHaveBeenCalledWith({
      where: { id: '1' }
    });
  });

  it('should handle cloudinary deletion errors gracefully', async () => {
    const mockSession = {
      user: {
        id: '1',
        email: 'test@example.com'
      }
    };

    const mockDocument = {
      id: '1',
      userId: '1',
      fileKey: 'test-key'
    };

    const { req, res } = createMocks({
      method: 'DELETE',
      query: {
        id: '1'
      }
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
    (prisma.document.findUnique as jest.Mock).mockResolvedValueOnce(mockDocument);
    (cloudinary.uploader.destroy as jest.Mock).mockRejectedValueOnce(new Error('Cloudinary error'));
    (prisma.document.delete as jest.Mock).mockResolvedValueOnce(mockDocument);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Document deleted successfully'
    });

    expect(prisma.document.delete).toHaveBeenCalledWith({
      where: { id: '1' }
    });
  });
}); 