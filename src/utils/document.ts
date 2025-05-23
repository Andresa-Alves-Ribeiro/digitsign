import { useRouter } from 'next/router';
import { prisma } from '@/services/prisma';
import Logger from '@/utils/logger';
import { Document, Prisma } from '@prisma/client';
import { toast } from 'react-hot-toast';

export interface DocumentWithSignatures extends Document {
  signature: {
    id: string;
    documentId: string;
    signedAt: Date | null;
    signatureImg: string;
    userId: string;
    createdAt: Date;
  } | null;
}

export interface DocumentActionsProps {
  onDocumentsChange?: (documents: Document[]) => void;
  onDeleteConfirm?: (documentId: string) => Promise<void>;
}

export const useDocumentActions = ({ onDocumentsChange, onDeleteConfirm }: DocumentActionsProps = {}): {
  onSign: (documentId: string) => void;
  onDelete: (documentId: string) => void;
} => {
  const router = useRouter();

  const onSign = (documentId: string): void => {
    router.push(`/documents/${documentId}/sign`);
  };

  const onDelete = (documentId: string): void => {
    if (onDeleteConfirm) {
      onDeleteConfirm(documentId);
    } else {
      // Fallback to basic confirm if no custom handler is provided
      if (!confirm('Tem certeza que deseja excluir este documento?')) {
        return;
      }
      handleDelete(documentId);
    }
  };

  const handleDelete = async (documentId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir documento');
      }

      // Atualiza a lista de documentos se o callback foi fornecido
      if (onDocumentsChange) {
        const updatedResponse = await fetch('/api/documents');
        if (updatedResponse.ok) {
          const updatedDocuments = await updatedResponse.json() as Document[];
          onDocumentsChange(updatedDocuments);
        }
      }

      toast.success('Documento excluído com sucesso');
      router.push('/documents');
    } catch (error) {
      Logger.error('Erro ao excluir documento:', error);
      toast.error('Erro ao excluir documento');
      throw error;
    }
  };

  return {
    onSign,
    onDelete
  };
};

export async function deleteDocument(id: string): Promise<Document> {
  try {
    return await prisma.document.delete({
      where: { id }
    });
  } catch (error) {
    Logger.error('Failed to delete document', error, { documentId: id });
    throw error;
  }
}

export async function getDocument(id: string): Promise<DocumentWithSignatures> {
  try {
    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        signature: true
      }
    });

    if (!document) {
      throw new Error('Document not found');
    }

    return document;
  } catch (error) {
    Logger.error('Failed to fetch document', error, { documentId: id });
    throw error;
  }
}

export async function updateDocument(id: string, data: Prisma.DocumentUpdateInput): Promise<Document> {
  try {
    return await prisma.document.update({
      where: { id },
      data
    });
  } catch (error) {
    Logger.error('Failed to update document', error, { documentId: id });
    throw error;
  }
} 