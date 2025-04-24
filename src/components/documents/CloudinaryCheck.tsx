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
          toast.error(data.error ?? 'Erro ao verificar configuração do Cloudinary', TOAST_CONFIG);
          router.push('/documents');
          return;
        }

        if (!data.configured) {
          toast.error('Cloudinary não está configurado corretamente', TOAST_CONFIG);
          router.push('/documents');
          return;
        }

        setIsConfigured(true);
      } catch (error) {
        console.error('Error checking Cloudinary:', error);
        toast.error('Erro ao verificar configuração do Cloudinary', TOAST_CONFIG);
        router.push('/documents');
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