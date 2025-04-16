import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Loading from '@/components/Loading';
import useDocumentStore from '@/store/useDocumentStore';
import { getSession } from 'next-auth/react';
import { commonStyles } from '@/constants/styles';
import { MAX_FILE_SIZE, MAX_FILE_SIZE_MB } from '@/constants/app';
import { formatFileSizeInMB } from '@/utils/file';
import Logger from '@/utils/logger';
import { Document } from '@/types/interfaces';

interface UploadResponse {
  message?: string;
  error?: string;
  document?: Document;
  details?: {
    mimetype: string;
    name: string;
  };
}

const UploadComponent = (): JSX.Element => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { addDocument, setLoading, setError: setStoreError, loading } = useDocumentStore();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    setStoreError(null);

    if (!file) {
      setError('Por favor, selecione um arquivo');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(`O arquivo deve ter no máximo ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const session = await getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });
      
      const data = await res.json() as UploadResponse;

      if (!res.ok) {
        const errorDetails = data.details ? ` (MIME Type: ${data.details.mimetype}, File: ${data.details.name})` : '';
        throw new Error(`${data.message ?? data.error ?? 'Erro ao fazer upload do arquivo'}${errorDetails}`);
      }

      if (!data.document) {
        throw new Error('Documento não encontrado na resposta');
      }

      setSuccess(true);
      addDocument({
        ...data.document,
        mimeType: data.document.mimeType ?? null,
        size: data.document.size ?? null
      });
      setFile(null);
      setTimeout(() => {
        router.push('/documents');
      }, 1500);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer upload do arquivo';
      
      // Adicionar contexto ao log de erro
      const errorContext = {
        fileName: file?.name,
        fileSize: file?.size,
        fileType: file?.type,
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : error
      };
      
      Logger.error('Upload error:', errorMessage, errorContext);
      setError(errorMessage);
      setStoreError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full px-4 md:px-6 py-6 overflow-auto flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Carregue seu documento</h1>
            <p className="text-gray-600">Faça upload do seu documento PDF</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">Documento enviado com sucesso! Redirecionando...</p>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="mb-6">
              <Loading text="Enviando documento..." />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="mt-1 relative">
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex flex-col items-center justify-center px-8 py-12 border-2 border-dashed border-gray-300 rounded-lg bg-white group-hover:border-transparent transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-green-600/5 rounded-lg" />
                    <div className="flex justify-center">
                      <div className="p-3 rounded-full bg-green-50 group-hover:bg-green-100 transition-colors duration-300">
                        <svg
                          className="h-8 w-8 text-green-500 group-hover:text-green-600 transition-colors duration-300"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                    <label
                      htmlFor="file"
                      className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                    >
                      <span className="text-base">Selecione um arquivo</span>
                      <input
                        id="file"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          const selectedFile = e.target.files?.[0];
                          if (selectedFile) {
                            if (selectedFile.size > MAX_FILE_SIZE) {
                              setError(`O arquivo deve ter no máximo ${MAX_FILE_SIZE_MB}MB`);
                              e.target.value = '';
                              setFile(null);
                            } else if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
                              setError('Por favor, selecione apenas arquivos PDF');
                              e.target.value = '';
                              setFile(null);
                            } else {
                              setFile(selectedFile);
                              setError(null);
                            }
                          } else {
                            setFile(null);
                          }
                        }}
                        className="sr-only"
                        required
                      />
                    </label>
                  </div>
                </div>
              </div>

              {file && (
                <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-green-50">
                      <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSizeInMB(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      const input = document.getElementById('file') as HTMLInputElement;
                      if (input) input.value = '';
                    }}
                    className={commonStyles.button.ghost}
                  >
                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className={'w-max bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center'}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Enviar Documento
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadComponent;