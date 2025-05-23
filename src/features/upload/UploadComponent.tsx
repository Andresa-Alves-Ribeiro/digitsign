import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { useState } from 'react';
import LoadingSpinner from '@/components/documents/LoadingSpinner';
import useDocumentStore from '@/store/useDocumentStore';
import { getSession } from 'next-auth/react';
import { commonStyles } from '@/constants/styles';
import { MAX_FILE_SIZE, MAX_FILE_SIZE_MB } from '@/constants/app';
import { formatFileSizeInMB } from '@/utils/file';
import Logger from '@/utils/logger';
import { Document } from '@/types/interfaces';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface UploadResponse {
  message?: string;
  error?: string;
  document?: Document;
  details?: {
    mimetype: string;
    name: string;
  };
}

const UploadComponent = () => {
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
    <div className="flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="bg-component-bg-light dark:bg-component-bg-dark rounded-2xl shadow-md p-6 border border-neutral-600 dark:border-neutral-800">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-3 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 bg-clip-text text-transparent">
              Carregue seu documento
            </h1>
            <p className="text-text-light/80 dark:text-text-dark/80 text-lg">Faça upload do seu documento PDF de forma segura e rápida</p>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ErrorDisplay 
                  error={error} 
                  onRetry={() => {
                    setError(null);
                    setStoreError(null);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-500 p-4 mb-6 rounded-md"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-400 dark:text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Documento enviado com sucesso! Redirecionando...</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              <LoadingSpinner text="Enviando arquivo..." />
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="mt-1 relative">
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex flex-col items-center justify-center px-8 py-16 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 group-hover:border-transparent transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-green-600/5 dark:from-green-500/10 dark:to-green-600/10 rounded-xl" />
                    <motion.div 
                      className="flex justify-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      <div className="p-4 rounded-full bg-green-50 dark:bg-green-900/30 group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors duration-300">
                        <DocumentTextIcon className="h-12 w-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                      </div>
                    </motion.div>
                    <label
                      htmlFor="file"
                      className="mt-4 relative cursor-pointer rounded-md font-medium text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500 dark:focus-within:ring-green-400"
                    >
                      <span className="text-lg">Selecione um arquivo</span>
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
                    <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">PDF até {MAX_FILE_SIZE_MB}MB</p>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {file && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-4 flex items-center justify-between p-4 bg-component-bg-light dark:bg-component-bg-dark rounded-xl border border-neutral-200 shadow-sm"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-full bg-component-bg-light dark:bg-component-bg-dark">
                        <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{file.name}</p>
                        <p className="text-xs text-neutral-500">
                          {formatFileSizeInMB(file.size)}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        setFile(null);
                        const input = document.getElementById('file') as HTMLInputElement;
                        if (input) input.value = '';
                      }}
                      className={commonStyles.button.ghost}
                    >
                      <svg className="h-5 w-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-max bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center text-lg"
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
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadComponent;