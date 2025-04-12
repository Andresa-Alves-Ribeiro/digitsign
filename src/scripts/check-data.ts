import { prisma } from '../lib/prisma';
import { User, Document, Signature } from '@prisma/client';

async function checkData(): Promise<{
  users: User[];
  documents: Document[];
  signatures: Signature[];
}> {
  const users = await prisma.user.findMany();
  const documents = await prisma.document.findMany();
  const signatures = await prisma.signature.findMany();

  return {
    users,
    documents,
    signatures,
  };
}

export default checkData; 