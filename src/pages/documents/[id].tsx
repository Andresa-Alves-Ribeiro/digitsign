import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatFileSize } from '@/utils/file';
import { getStatusConfig } from '@/constants/documentStatus';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { Document, DocumentStatus } from '@prisma/client';
import { useDocumentActions } from '@/utils/document';
import { PDFViewer } from '@/components/PDFViewer';
import { GetServerSideProps } from 'next';
import { getDocumentServerSideProps } from '@/utils/documentServerSide';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';

interface DocumentPageProps {
  document: Document | null;
  error: string | null;
}

const DocumentPage: React.FC<DocumentPageProps> = ({ document: initialDocument, error: initialError }) => {
  const router = useRouter();
  const { data: _session } = useSession();
  const [document, ] = useState<Document | null>(initialDocument);
  const [error, setError] = useState<string | null>(initialError);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { onSign } = useDocumentActions({
    onDeleteConfirm: async () => {
      setIsDeleteDialogOpen(true);
    }
  });

  const handleDeleteDocument = async (): Promise<void> => {
    if (!document) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/documents/${document.id}/delete`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json() as { error?: string };
        throw new Error(errorData.error ?? 'Erro ao excluir documento');
      }

      router.push('/documents');
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      setError(error instanceof Error ? error.message : 'Erro ao excluir documento');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex justify-center items-center h-full">
        <div>Documento não encontrado</div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(document.status);

  return (
    <div className="overflow-y-auto">
      <div className="px-4 md:px-6 py-6 h-full">
        <div className="bg-component-bg-light dark:bg-component-bg-dark rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700 p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-xl font-bold text-zinc-800">{document.name}</h1>

            <div className="flex items-center gap-2">
              {document.status === DocumentStatus.PENDING && (
                <button
                  onClick={() => onSign(document.id)}
                  className="p-2 flex items-center gap-2 bg-green-100 text-green-700 text-sm rounded-md hover:bg-green-200 transition-colors duration-200 m-0 cursor-pointer"
                >
                  <PencilSquareIcon className="w-4 h-4" /> Assinar Documento
                </button>
              )}

              <button
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isDeleting}
                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${isDeleting
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                {isDeleting ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-component-bg-light dark:bg-component-bg-dark rounded-lg p-4 flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${statusConfig.color}`}>
                {statusConfig.icon}
              </div>

              <div>
                <p className="text-sm text-text-light/70 dark:text-text-dark/70">Status</p>
                <p className={`font-medium ${statusConfig.color}`}>
                  {statusConfig.label}
                </p>
              </div>
            </div>

            <div className="bg-component-bg-light dark:bg-component-bg-dark rounded-lg p-4 flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <div>
                <p className="text-sm text-text-light/70 dark:text-text-dark/70">Data de upload</p>
                <p className="font-medium text-text-light dark:text-text-dark">
                  {format(new Date(document.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              </div>
            </div>

            <div className="bg-component-bg-light dark:bg-component-bg-dark rounded-lg p-4 flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-text-light/70 dark:text-text-dark/70">Tamanho do arquivo</p>
                <p className="font-medium text-text-light dark:text-text-dark">{document.size && formatFileSize(document.size)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
          <PDFViewer url={`/api/documents/${document.id}/view`} />
        </div>
      </div>
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteDocument}
        title="Excluir documento"
        message="Tem certeza que deseja excluir este documento?"
        confirmText="Excluir"
        type="danger"
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<DocumentPageProps> = getDocumentServerSideProps;

export default DocumentPage;