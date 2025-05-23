import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { TOAST_CONFIG } from '@/constants/toast';
import LoadingSpinner from './LoadingSpinner';

interface DocumentStatusCheckProps {
  documentId: string;
  children: React.ReactNode;
}

interface DocumentStatusCheckResponse {
  exists: boolean;
  error?: string;
}

const DocumentStatusCheck: React.FC<DocumentStatusCheckProps> = ({ documentId, children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkDocument = async () => {
      try {
        const response = await fetch(`/api/documents/${documentId}/check`);
        const data = await response.json() as DocumentStatusCheckResponse;

        if (!response.ok) {
          toast.error(data.error || 'Erro ao verificar documento', TOAST_CONFIG);
          router.push('/documents');
          return;
        }

        if (!data.exists) {
          toast.error('Documento não encontrado', TOAST_CONFIG);
          router.push('/documents');
          return;
        }

        setIsValid(true);
      } catch (error) {
        console.error('Error checking document:', error);
        toast.error('Erro ao verificar documento', TOAST_CONFIG);
        router.push('/documents');
      } finally {
        setIsLoading(false);
      }
    };

    checkDocument();
  }, [documentId, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isValid) {
    return null;
  }

  return <>{children}</>;
};

export default DocumentStatusCheck; 