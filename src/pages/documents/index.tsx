import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useSession, getSession } from 'next-auth/react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { PlusIcon, DocumentIcon, ChartBarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Loading from '@/components/Loading';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import DocumentCards from '@/components/documents/DocumentCards';
import DocumentTable from '@/components/documents/DocumentTable';
import { Document } from '@/types/interfaces';
import { DocumentStatus } from '@/types/enums';
import { GetServerSideProps } from 'next';

export default function DocumentsPage(): JSX.Element | null {
  const router = useRouter();
  const { status } = useSession();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; docId: string | null }>({
    show: false,
    docId: null
  });

  useEffect(() => {
    const fetchDocuments = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch('/api/documents');
                
        if (!response.ok) {
          throw new Error('Failed to fetch documents');
        }

        const data = await response.json() as Document[];
        setDocuments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchDocuments();
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Loading text="Carregando documentos..." />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (status === 'authenticated') {
    return (
      <div className="h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex sm:flex-row sm:items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-sm text-gray-600">Bem-vindo ao seu painel de controle</p>
              </div>
              <Link
                href="/documents/upload"
                className="inline-flex items-center w-max px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                                Novo Documento
              </Link>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <DocumentIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Documentos</p>
                  <p className="text-2xl font-semibold text-gray-900">{documents.length}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <ChartBarIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Documentos Pendentes</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {documents.filter(d => d.status === DocumentStatus.PENDING).length}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <UserGroupIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Assinaturas</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {documents.filter(d => d.signature).length}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Documentos Recentes</h2>
            </div>
            <div className="p-6">
              <DocumentCards
                documents={documents}
                onDelete={(docId) => setDeleteConfirmation({ show: true, docId })}
                onSign={(docId) => router.push(`/documents/${docId}/sign`)}
              />
              <div>
                <DocumentTable
                  documents={documents}
                  onDelete={(docId) => setDeleteConfirmation({ show: true, docId })}
                  onSign={(docId) => router.push(`/documents/${docId}/sign`)}
                />
              </div>
            </div>
          </div>
        </div>

        <ConfirmationDialog
          isOpen={deleteConfirmation.show}
          onClose={() => setDeleteConfirmation({ show: false, docId: null })}
          onConfirm={async () => {
            if (!deleteConfirmation.docId) return;
            try {
              const response = await fetch(`/api/documents/${deleteConfirmation.docId}`, {
                method: 'DELETE',
              });
              if (!response.ok) {
                throw new Error('Erro ao excluir documento');
              }
              setDocuments(documents.filter(d => d.id !== deleteConfirmation.docId));
              toast.success('Documento excluído com sucesso');
              setDeleteConfirmation({ show: false, docId: null });
            } catch (error) {
              toast.error('Erro ao excluir documento');
              console.error(error);
            }
          }}
          title="Confirmar exclusão"
          message="Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita."
          confirmText="Excluir"
          cancelText="Cancelar"
        />
      </div>
    );
  }

  return null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}; 