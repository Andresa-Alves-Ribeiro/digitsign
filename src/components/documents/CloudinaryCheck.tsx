import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { TOAST_CONFIG } from '@/constants/toast';
import LoadingSpinner from './LoadingSpinner';
import { CloudinaryCheckProps } from '@/types/interfaces/cloudinary';

const CloudinaryCheck: React.FC<CloudinaryCheckProps> = ({ children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const checkCloudinary = async () => {
      try {
        const response = await fetch('/api/cloudinary/check');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao verificar Cloudinary');
        }

        if (!data.configured) {
          throw new Error('Cloudinary não está configurado corretamente');
        }

        setIsConfigured(true);
      } catch (error) {
        console.error('Erro detalhado ao verificar Cloudinary:', error);
        toast.error('Erro ao verificar configuração do Cloudinary', TOAST_CONFIG);
        setIsConfigured(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkCloudinary();
  }, [router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isConfigured) {
    return null;
  }

  return <>{children}</>;
};

export default CloudinaryCheck; 