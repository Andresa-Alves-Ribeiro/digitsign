import { PrismaClient } from '@prisma/client';

interface GlobalWithPrisma {
  prisma: PrismaClient | undefined;
}

const globalForPrisma = globalThis as unknown as GlobalWithPrisma;

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 