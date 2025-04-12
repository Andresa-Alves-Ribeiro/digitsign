'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import withAuth from '../../../features/auth/withAuth';
import SignaturePad from '../../../components/signature/SignaturePad';
import { motion } from 'framer-motion';

interface ApiResponse {
  error?: string;
  success?: boolean;
}

function SignDocumentPage(): JSX.Element {
  const router = useRouter();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
    
  if (!params?.id) {
    return <div>Documento não encontrado</div>;
  }

  const documentId = params.id as string;

  const handleSaveSignature = async (signatureData: string): Promise<void> => {
    if (!signatureData || signatureData.trim() === '') {
      setError('Por favor, desenhe sua assinatura antes de salvar.');
      return;
    }

    if (!signatureData.startsWith('data:image/png;base64,')) {
      console.error('Invalid signature format:', signatureData.substring(0, 50) + '...');
      setError('Formato de assinatura inválido. Tente novamente.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const requestBody = {
        documentId: documentId,
        signatureData: signatureData,
      };

      const response = await fetch('/api/documents/sign', {
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
  };

  if (isSubmitting) {
    return <div>Processing signature...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-4 sm:py-6 lg:py-8">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg">
            <div className="px-4 py-5 sm:p-6 lg:p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-50 p-2.5 sm:p-3 rounded-lg">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Assinar Documento</h1>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">ID do Documento:</span>
                        <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md break-all">{documentId}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => router.back()}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                                        Voltar
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
                  <div className="max-w-2xl mx-auto">
                    <SignaturePad
                      onSave={handleSaveSignature}
                      onCancel={() => router.back()}
                    />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700 break-words">{error}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-4 sm:py-6 lg:py-8">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg">
          <div className="px-4 py-5 sm:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-50 p-2.5 sm:p-3 rounded-lg">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Assinar Documento</h1>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">ID do Documento:</span>
                      <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md break-all">{documentId}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => router.back()}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                                    Voltar
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
                <div className="max-w-2xl mx-auto">
                  <SignaturePad
                    onSave={handleSaveSignature}
                    onCancel={() => router.back()}
                  />
                </div>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700 break-words">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(SignDocumentPage);