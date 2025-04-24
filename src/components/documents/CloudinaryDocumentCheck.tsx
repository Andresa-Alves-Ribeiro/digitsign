import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { TOAST_CONFIG } from '@/constants/toast';
import LoadingSpinner from './LoadingSpinner';

interface CloudinaryDocumentCheckProps {
  documentId: string;
  children: React.ReactNode;
}

const CloudinaryDocumentCheck: React.FC<CloudinaryDocumentCheckProps> = ({ documentId, children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkDocument = async () => {
      try {
        const response = await fetch(`/api/documents/${documentId}/cloudinary-check`);
        const data = await response.json();

        if (!response.ok) {
          toast.error(data.error || 'Erro ao verificar documento no Cloudinary', TOAST_CONFIG);
          router.push('/documents');
          return;
        }

        if (!data.exists) {
          toast.error('Documento não encontrado no Cloudinary', TOAST_CONFIG);
          router.push('/documents');
          return;
        }

        setIsValid(true);
      } catch (error) {
        console.error('Error checking document in Cloudinary:', error);
        toast.error('Erro ao verificar documento no Cloudinary', TOAST_CONFIG);
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

export default CloudinaryDocumentCheck; 