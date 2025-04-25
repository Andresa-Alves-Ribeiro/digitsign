'use client';

import React, { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import withAuth from '../../../features/auth/withAuth';
import SignaturePad from '../../../components/signature/SignaturePad';
import SignDocumentHeader from '../../../components/documents/SignDocumentHeader';
import ErrorMessage from '../../../components/documents/ErrorMessage';
import LoadingSpinner from '../../../components/documents/LoadingSpinner';
import DocumentContainer from '../../../components/documents/DocumentContainer';
import Button from '@/components/ui/Button';
import { TrashIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { TOAST_CONFIG } from '@/constants/toast';
import DocumentStatusCheck from '../../../components/documents/DocumentStatusCheck';
import CloudinaryCheck from '../../../components/documents/CloudinaryCheck';
import CloudinaryDocumentCheck from '../../../components/documents/CloudinaryDocumentCheck';

interface ApiResponse {
  error?: string;
  success?: boolean;
}

function SignDocumentPage() {
  const router = useRouter();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const documentId = params?.id as string;

  const handleClear = useCallback((): void => {
    // @ts-expect-error - Accessing window.signaturePadMethods
    const signaturePad = window.signaturePadMethods as { clear?: () => void } | undefined;
    if (signaturePad?.clear) {
      try {
        signaturePad.clear();
      } catch (error) {
        console.error('Error clearing signature pad:', error);
      }
    }
  }, []);

  const handleSaveSignature = useCallback(async (signatureData: string): Promise<void> => {
    if (!signatureData || signatureData.trim() === '') {
      setError('Por favor, desenhe sua assinatura antes de salvar.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const requestBody = {
        signatureImage: signatureData,
      };

      const response = await fetch(`/api/documents/${documentId}/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json() as ApiResponse;

      if (!response.ok) {
        throw new Error(data.error ?? 'Erro ao salvar assinatura');
      }

      router.push(`/documents/${documentId}`);
    } catch (error) {
      console.error('Error saving signature:', error);
      setError(error instanceof Error ? error.message : 'Erro ao salvar assinatura. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }, [documentId, router, setError, setIsSubmitting]);

  const handleSave = useCallback(async (): Promise<void> => {
    // @ts-expect-error - Accessing window.signaturePadMethods
    const signaturePad = window.signaturePadMethods as { 
      isEmpty?: () => boolean;
      toDataURL?: () => string;
    } | undefined;
    
    if (!signaturePad?.isEmpty || signaturePad.isEmpty()) {
      toast.error('Por favor, desenhe uma assinatura antes de salvar', TOAST_CONFIG);
      return;
    }

    try {
      setIsSaving(true);
      if (!signaturePad.toDataURL) {
        throw new Error('Método toDataURL não disponível');
      }
      const signature = signaturePad.toDataURL();
      await handleSaveSignature(signature);
      toast.success('Assinatura salva com sucesso!', TOAST_CONFIG);
    } catch (error) {
      console.error('Error saving signature:', error);
      toast.error('Erro ao salvar assinatura', TOAST_CONFIG);
    } finally {
      setIsSaving(false);
    }
  }, [handleSaveSignature, setIsSaving]);

  if (!params?.id) {
    return <div className="text-text-light dark:text-text-dark">Documento não encontrado</div>;
  }

  if (isSubmitting) {
    return <LoadingSpinner />;
  }

  return (
    <CloudinaryCheck>
      <DocumentStatusCheck documentId={documentId}>
        <CloudinaryDocumentCheck documentId={documentId}>
          <DocumentContainer>
            <SignDocumentHeader documentId={documentId} />

            <div className="bg-component-bg-light dark:bg-component-bg-dark p-6 rounded-lg shadow-md">
              <SignaturePad
                onSave={handleSaveSignature}
                onCancel={() => router.back()}
              />

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Button
                  variant="clear"
                  onClick={handleClear}
                  disabled={isSaving}
                  className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <TrashIcon className="w-5 h-5 mr-2" />
                  Limpar
                </Button>
                <Button
                  variant="cancel"
                  onClick={() => router.back()}
                  disabled={isSaving}
                  className="flex items-center justify-center bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700"
                >
                  <XMarkIcon className="w-5 h-5 mr-2" />
                  Cancelar
                </Button>
                <Button
                  variant="save"
                  onClick={handleSave}
                  isLoading={isSaving}
                  disabled={isSaving}
                  className="flex items-center justify-center bg-primary text-white hover:bg-primary-dark dark:bg-primary-dark dark:hover:bg-primary"
                >
                  {!isSaving && <CheckIcon className="w-5 h-5 mr-2" />}
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </div>

            {error && <ErrorMessage message={error} />}
          </DocumentContainer>
        </CloudinaryDocumentCheck>
      </DocumentStatusCheck>
    </CloudinaryCheck>
  );
}

export default withAuth(SignDocumentPage);