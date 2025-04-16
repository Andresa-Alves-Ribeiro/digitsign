import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { join } from 'path';
import { promises as fs } from 'fs';
import multer from 'multer';
import { NextApiRequestWithFiles } from '@/types/api';
import type { Request, Response, NextFunction } from 'express';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ALLOWED_FILE_TYPES = ['application/pdf', 'application/x-pdf'];
const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = join(process.cwd(), 'uploads');
    fs.mkdir(uploadsDir, { recursive: true })
      .then(() => cb(null, uploadsDir))
      .catch(err => cb(err, uploadsDir));
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.originalname}`;
    cb(null, filename);
  }
});

interface UploadResponse {
  message?: string;
  document?: {
    id: string;
    name: string;
    fileKey: string;
  };
  error?: string;
  details?: {
    mimetype?: string;
    name?: string;
  };
}

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  // Check if file has .pdf extension
  const isPdfExtension = file.originalname.toLowerCase().endsWith('.pdf');
  
  // Check if mimetype is allowed
  const isAllowedMimeType = file.mimetype && ALLOWED_FILE_TYPES.includes(file.mimetype);
  
  if (isAllowedMimeType || isPdfExtension) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido. Apenas PDFs são aceitos.'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE
  }
});

type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

const runMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  fn: MiddlewareFunction
): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    fn(req as unknown as Request, res as unknown as Response, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadResponse>
): Promise<void> {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Run multer middleware
    await runMiddleware(req, res, upload.single('file'));

    // Get the file from the request
    const file = (req as NextApiRequestWithFiles).file;

    if (!file) {
      return res.status(400).json({ 
        message: 'Nenhum arquivo enviado',
        details: { mimetype: undefined, name: undefined }
      });
    }

    // Create document record
    const document = await prisma.document.create({
      data: {
        name: file.originalname || 'Untitled',
        fileKey: file.filename,
        userId: session.user.id,
        status: 'pending',
        mimeType: file.mimetype,
        size: file.size
      },
    });

    return res.status(201).json({
      message: 'Documento enviado com sucesso',
      document,
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? { 
        mimetype: undefined,
        name: error.name
      } : undefined
    });
  }
} 