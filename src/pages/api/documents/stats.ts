import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });
    
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const [total, pending, signed] = await Promise.all([
      prisma.document.count(),
      prisma.document.count({
        where: {
          status: 'PENDING'
        }
      }),
      prisma.document.count({
        where: {
          status: 'SIGNED'
        }
      })
    ]);

    return res.status(200).json({
      total,
      pending,
      signed
    });
  } catch (error) {
    console.error('Error fetching document stats:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 