import { createMocks } from 'node-mocks-http';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import handler from '../../documents/upload';
import multer from 'multer';
import formidable from 'formidable';
import fs from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next';

interface MulterRequest extends NextApiRequest {
  file?: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
  };
}

interface CloudinaryResponse {
  public_id: string;
  secure_url: string;
}

// Mock do next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn()
}));

// Mock do prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    document: {
      create: jest.fn()
    }
  }
}));

// Mock do cloudinary
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn()
    }
  }
}));

// Mock do multer
jest.mock('multer', () => {
  return jest.fn(() => ({
    single: () => (req: MulterRequest, res: NextApiResponse, next: (error?: Error) => void) => {
      req.file = {
        buffer: Buffer.from('test pdf content'),
        originalname: 'test.pdf',
        mimetype: 'application/pdf',
        size: 1024
      };
      next();
    }
  }));
});

// Mock do formidable
jest.mock('formidable', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    parse: jest.fn()
  }))
}));

// Mock do fs/promises
jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
  unlink: jest.fn()
}));

describe('Upload API', () => {
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
      message: 'Unauthorized'
    });
  });

  it('should handle successful file upload', async () => {
    const mockSession = {
      user: {
        id: '1',
        email: 'test@example.com'
      }
    };

    const mockCloudinaryResponse: CloudinaryResponse = {
      public_id: 'test-public-id',
      secure_url: 'https://test-url.com'
    };

    const mockDocument = {
      id: '1',
      name: 'test.pdf',
      fileKey: 'test-public-id',
      userId: '1',
      status: 'pending',
      mimeType: 'application/pdf',
      size: 1024
    };

    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        'content-type': 'multipart/form-data'
      }
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
    (cloudinary.uploader.upload as jest.Mock).mockResolvedValueOnce(mockCloudinaryResponse);
    (prisma.document.create as jest.Mock).mockResolvedValueOnce(mockDocument);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Documento enviado com sucesso',
      document: mockDocument
    });

    expect(cloudinary.uploader.upload).toHaveBeenCalled();
    expect(prisma.document.create).toHaveBeenCalledWith({
      data: {
        name: 'test.pdf',
        fileKey: 'test-public-id',
        userId: '1',
        status: 'pending',
        mimeType: 'application/pdf',
        size: 1024
      }
    });
  });

  it('should handle file validation errors', async () => {
    const mockSession = {
      user: {
        id: '1',
        email: 'test@example.com'
      }
    };

    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        'content-type': 'multipart/form-data'
      }
    });

    // Simular erro de validação do multer
    (multer as jest.Mock).mockImplementationOnce(() => ({
      single: () => (req: MulterRequest, res: NextApiResponse, next: (error?: Error) => void) => {
        next(new Error('Tipo de arquivo não permitido. Apenas PDFs são aceitos.'));
      }
    }));

    (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Internal Server Error',
      details: {
        name: 'Error'
      }
    });
  });

  it('should handle missing file', async () => {
    const mockSession = {
      user: {
        id: '1',
        email: 'test@example.com'
      }
    };

    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        'content-type': 'multipart/form-data'
      }
    });

    // Simular ausência de arquivo
    (multer as jest.Mock).mockImplementationOnce(() => ({
      single: () => (req: MulterRequest, res: NextApiResponse, next: (error?: Error) => void) => {
        next();
      }
    }));

    (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Nenhum arquivo enviado',
      details: { mimetype: undefined, name: undefined }
    });
  });

  it('should handle cloudinary upload errors', async () => {
    const mockSession = {
      user: {
        id: '1',
        email: 'test@example.com'
      }
    };

    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        'content-type': 'multipart/form-data'
      }
    });

    (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
    (cloudinary.uploader.upload as jest.Mock).mockRejectedValueOnce(new Error('Upload failed'));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Internal Server Error',
      details: {
        name: 'Error'
      }
    });
  });

  it('should handle file upload and create document successfully', async () => {
    const { req, res } = createMocks({
      method: 'POST'
    });

    const mockUser = {
      id: '1',
      email: 'test@example.com'
    };

    const mockFile = {
      originalFilename: 'test.pdf',
      filepath: '/tmp/test.pdf',
      mimetype: 'application/pdf',
      size: 1024
    };

    const mockDocument = {
      id: '1',
      name: 'test.pdf',
      userId: '1',
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: mockUser
    });

    (formidable as unknown as jest.Mock).mockImplementation(() => ({
      parse: jest.fn().mockImplementation((req, callback) => {
        callback(null, {}, { file: mockFile });
      })
    }));

    (fs.readFile as jest.Mock).mockResolvedValueOnce(Buffer.from('test'));
    (fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined);
    (prisma.document.create as jest.Mock).mockResolvedValueOnce(mockDocument);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Documento enviado com sucesso',
      document: mockDocument
    });

    expect(prisma.document.create).toHaveBeenCalledWith({
      data: {
        name: mockFile.originalFilename,
        userId: mockUser.id,
        status: 'PENDING'
      }
    });
  });

  it('should handle invalid file type', async () => {
    const { req, res } = createMocks({
      method: 'POST'
    });

    const mockUser = {
      id: '1',
      email: 'test@example.com'
    };

    const mockFile = {
      originalFilename: 'test.txt',
      filepath: '/tmp/test.txt',
      mimetype: 'text/plain',
      size: 1024
    };

    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: mockUser
    });

    (formidable as unknown as jest.Mock).mockImplementation(() => ({
      parse: jest.fn().mockImplementation((req, callback) => {
        callback(null, {}, { file: mockFile });
      })
    }));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Tipo de arquivo inválido. Apenas arquivos PDF são permitidos.'
    });
  });

  it('should handle file size limit exceeded', async () => {
    const { req, res } = createMocks({
      method: 'POST'
    });

    const mockUser = {
      id: '1',
      email: 'test@example.com'
    };

    const mockFile = {
      originalFilename: 'test.pdf',
      filepath: '/tmp/test.pdf',
      mimetype: 'application/pdf',
      size: 10 * 1024 * 1024 + 1 // 10MB + 1 byte
    };

    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: mockUser
    });

    (formidable as unknown as jest.Mock).mockImplementation(() => ({
      parse: jest.fn().mockImplementation((req, callback) => {
        callback(null, {}, { file: mockFile });
      })
    }));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Tamanho do arquivo excede o limite de 10MB'
    });
  });

  it('should handle file parsing errors', async () => {
    const { req, res } = createMocks({
      method: 'POST'
    });

    const mockUser = {
      id: '1',
      email: 'test@example.com'
    };

    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: mockUser
    });

    (formidable as unknown as jest.Mock).mockImplementation(() => ({
      parse: jest.fn().mockImplementation((req, callback) => {
        callback(new Error('File parsing error'), {}, {});
      })
    }));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Erro ao processar o arquivo'
    });
  });

  it('should handle database errors', async () => {
    const { req, res } = createMocks({
      method: 'POST'
    });

    const mockUser = {
      id: '1',
      email: 'test@example.com'
    };

    const mockFile = {
      originalFilename: 'test.pdf',
      filepath: '/tmp/test.pdf',
      mimetype: 'application/pdf',
      size: 1024
    };

    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: mockUser
    });

    (formidable as unknown as jest.Mock).mockImplementation(() => ({
      parse: jest.fn().mockImplementation((req, callback) => {
        callback(null, {}, { file: mockFile });
      })
    }));

    (fs.readFile as jest.Mock).mockResolvedValueOnce(Buffer.from('test'));
    (fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined);
    (prisma.document.create as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Erro ao salvar o documento'
    });
  });

  it('should handle file system errors', async () => {
    const { req, res } = createMocks({
      method: 'POST'
    });

    const mockUser = {
      id: '1',
      email: 'test@example.com'
    };

    const mockFile = {
      originalFilename: 'test.pdf',
      filepath: '/tmp/test.pdf',
      mimetype: 'application/pdf',
      size: 1024
    };

    (getServerSession as jest.Mock).mockResolvedValueOnce({
      user: mockUser
    });

    (formidable as unknown as jest.Mock).mockImplementation(() => ({
      parse: jest.fn().mockImplementation((req, callback) => {
        callback(null, {}, { file: mockFile });
      })
    }));

    (fs.readFile as jest.Mock).mockRejectedValueOnce(new Error('File system error'));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Erro ao processar o arquivo'
    });
  });
}); 