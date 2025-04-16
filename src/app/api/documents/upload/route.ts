import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

interface UploadFile extends Blob {
    name: string;
    type: string;
}

const ALLOWED_FILE_TYPES = ['application/pdf', 'application/x-pdf'];
const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    console.log('Starting upload process...');
    
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log('No session found - unauthorized');
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Session found, user:', session.user.id);

    const formData = await request.formData();
    const file = formData.get('file') as UploadFile | null;

    if (!file) {
      console.log('No file found in form data');
      return NextResponse.json(
        { message: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    console.log('File received:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    const buffer = Buffer.from(await file.arrayBuffer());

    // Validate file
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      console.log('Invalid file type:', file.type);
      return NextResponse.json(
        {
          message: 'Tipo de arquivo não permitido. Apenas PDFs são aceitos.',
          details: { mimetype: file.type, name: file.name }
        },
        { status: 400 }
      );
    }

    if (buffer.length > MAX_FILE_SIZE) {
      console.log('File too large:', buffer.length);
      return NextResponse.json(
        { message: 'Arquivo muito grande. Tamanho máximo permitido: 30MB' },
        { status: 400 }
      );
    }

    // Upload to Cloudinary
    try {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      const fileName = `${uniqueSuffix}`;

      console.log('Starting Cloudinary upload...', {
        fileName,
        fileType: file.type,
        fileSize: buffer.length,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        hasApiKey: !!process.env.CLOUDINARY_API_KEY,
        hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
        env: process.env.NODE_ENV
      });

      // Convert buffer to base64
      const base64File = buffer.toString('base64');
      const uploadStr = `data:${file.type};base64,${base64File}`;

      const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(uploadStr, {
          resource_type: 'raw',
          public_id: fileName,
          folder: 'documents',
        }, (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('Cloudinary upload success:', result);
            resolve(result);
          }
        });
      });

      // @ts-ignore - Cloudinary types are not perfect
      const { secure_url, public_id } = uploadResponse;

      console.log('Creating document in database...', {
        name: file.name,
        fileKey: public_id,
        userId: session.user.id,
        url: secure_url
      });

      const document = await prisma.document.create({
        data: {
          name: file.name,
          fileKey: public_id,
          userId: session.user.id,
          status: 'PENDING',
          mimeType: file.type,
          size: buffer.length,
          url: secure_url,
        },
      });

      console.log('Document created successfully:', document);

      return NextResponse.json({
        message: 'Upload realizado com sucesso',
        document: {
          id: document.id,
          name: document.name,
          fileKey: document.fileKey,
          size: document.size,
          mimeType: document.mimeType,
          url: document.url,
        }
      });

    } catch (error) {
      console.error('Error in upload process:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }
      return NextResponse.json(
        { 
          message: 'Erro ao fazer upload do arquivo',
          error: process.env.NODE_ENV === 'development' ? error : undefined
        },
        { status: 500 }
      );
    }

  } catch (err) {
    console.error('Upload error:', err);
    
    if (err instanceof Error) {
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      
      return NextResponse.json(
        { 
          message: `Erro no upload: ${err.message}`,
          error: process.env.NODE_ENV === 'development' ? {
            name: err.name,
            message: err.message,
            stack: err.stack
          } : undefined
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}