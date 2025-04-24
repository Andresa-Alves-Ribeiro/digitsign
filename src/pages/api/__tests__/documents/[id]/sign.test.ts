import { createMocks } from 'node-mocks-http';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import handler from '../../../documents/[id]/sign';
import { PDFDocument } from 'pdf-lib';

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
    },
    signature: {
      findFirst: jest.fn(),
      create: jest.fn()
    }
  }
}));

// Mock do cloudinary
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    api: {
      resource: jest.fn()
    },
    url: jest.fn(),
    uploader: {
      upload_stream: jest.fn()
    }
  }
}));

// Mock do pdf-lib
jest.mock('pdf-lib', () => ({
  PDFDocument: {
    load: jest.fn()
  }
}));

describe('Document Sign API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 405 for non-POST requests', async () => {
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
      method: 'POST'
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce(null);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Não autorizado'
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
      method: 'POST',
      query: {}
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'ID do documento inválido'
    });
  });

  it('should return 400 for missing signature image', async () => {
    const mockSession = {
      user: {
        id: '1',
        email: 'test@example.com'
      }
    };

    const { req, res } = createMocks({
      method: 'POST',
      query: {
        id: '1'
      },
      body: {}
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Imagem da assinatura é obrigatória'
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
      method: 'POST',
      query: {
        id: '1'
      },
      body: {
        signatureImage: 'data:image/png;base64,test'
      }
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
    (prisma.document.findUnique as jest.Mock).mockResolvedValueOnce(null);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Documento não encontrado'
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
      method: 'POST',
      query: {
        id: '1'
      },
      body: {
        signatureImage: 'data:image/png;base64,test'
      }
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
    (prisma.document.findUnique as jest.Mock).mockResolvedValueOnce(mockDocument);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(403);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Você não tem permissão para assinar este documento'
    });
  });

  it('should return 400 when document is already signed', async () => {
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
      documentId: '1',
      userId: '1'
    };

    const { req, res } = createMocks({
      method: 'POST',
      query: {
        id: '1'
      },
      body: {
        signatureImage: 'data:image/png;base64,test'
      }
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
    (prisma.document.findUnique as jest.Mock).mockResolvedValueOnce(mockDocument);
    (prisma.signature.findFirst as jest.Mock).mockResolvedValueOnce(mockSignature);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Você já assinou este documento'
    });
  });

  it('should successfully sign document', async () => {
    const mockSession = {
      user: {
        id: '1',
        email: 'test@example.com'
      }
    };

    const mockDocument = {
      id: '1',
      userId: '1',
      fileKey: 'test-key',
      name: 'test.pdf',
      mimeType: 'application/pdf'
    };

    const mockPDFDoc = {
      getPages: jest.fn().mockReturnValue([{
        getSize: jest.fn().mockReturnValue({ width: 100, height: 100 }),
        drawImage: jest.fn()
      }]),
      embedPng: jest.fn().mockResolvedValue({
        scale: jest.fn().mockReturnValue({ width: 50, height: 50 })
      }),
      save: jest.fn().mockResolvedValue(new Uint8Array())
    };

    const mockSignature = {
      id: '1',
      documentId: '1',
      userId: '1',
      signatureImg: 'data:image/png;base64,test',
      signedAt: new Date(),
      createdAt: new Date()
    };

    const { req, res } = createMocks({
      method: 'POST',
      query: {
        id: '1'
      },
      body: {
        signatureImage: 'data:image/png;base64,test'
      }
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
    (prisma.document.findUnique as jest.Mock).mockResolvedValueOnce(mockDocument);
    (prisma.signature.findFirst as jest.Mock).mockResolvedValueOnce(null);
    (cloudinary.api.resource as jest.Mock).mockResolvedValueOnce({ secure_url: 'test-url' });
    (cloudinary.url as jest.Mock).mockReturnValue('test-url');
    (PDFDocument.load as jest.Mock).mockResolvedValueOnce(mockPDFDoc);
    (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation((options, callback) => {
      callback(null, { public_id: 'test-key' });
      return {
        end: jest.fn()
      };
    });
    (prisma.signature.create as jest.Mock).mockResolvedValueOnce(mockSignature);
    (prisma.document.findUnique as jest.Mock).mockResolvedValueOnce({
      ...mockDocument,
      signatures: [mockSignature]
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      document: {
        ...mockDocument,
        signatures: [mockSignature]
      }
    });

    expect(prisma.signature.create).toHaveBeenCalledWith({
      data: {
        documentId: '1',
        userId: '1',
        signedAt: expect.any(Date),
        signatureImg: 'data:image/png;base64,test'
      }
    });
  });

  it('should handle PDF processing errors', async () => {
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
      method: 'POST',
      query: {
        id: '1'
      },
      body: {
        signatureImage: 'data:image/png;base64,test'
      }
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
    (prisma.document.findUnique as jest.Mock).mockResolvedValueOnce(mockDocument);
    (prisma.signature.findFirst as jest.Mock).mockResolvedValueOnce(null);
    (cloudinary.api.resource as jest.Mock).mockResolvedValueOnce({ secure_url: 'test-url' });
    (PDFDocument.load as jest.Mock).mockRejectedValueOnce(new Error('Failed to load PDF'));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Internal Server Error'
    });
  });
}); 