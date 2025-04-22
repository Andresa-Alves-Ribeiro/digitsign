import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'DELETE') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      res.status(400).json({ error: 'Invalid document ID' });
      return;
    }

    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    if (document.userId !== session.user.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const signature = await prisma.signature.findUnique({
      where: { documentId: id },
    });

    if (signature) {
      await prisma.signature.delete({
        where: { documentId: id },
      });
    }

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(document.fileKey, {
        resource_type: 'raw',
        type: 'upload'
      });
    } catch (cloudinaryError) {
      console.error('Error deleting from Cloudinary:', cloudinaryError);
      // Continue with document deletion even if Cloudinary deletion fails
    }

    await prisma.document.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
} 