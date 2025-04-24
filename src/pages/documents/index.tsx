import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import { useSession, getSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  DocumentTextIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import Loading from '@/components/ui/Loading';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import DocumentTable from '@/components/documents/DocumentTable';
import { Document } from '@/types/interfaces';
import { GetServerSideProps } from 'next';
import StatCard from '@/components/dashboard/StatCard';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import PageHeader from '@/components/PageHeader';
import { DocumentStatus } from '@/types/enums/document';
import { DashboardStats } from '@/types/interfaces/dashboard';

export default function DocumentsPage() {
  const router = useRouter();
  const { status } = useSession();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; docId: string | null }>({
    show: false,
    docId: null
  });
  const [stats, setStats] = useState<DashboardStats>({
    totalDocuments: 0,
    pendingDocuments: 0,
    signedDocuments: 0,
    recentDocuments: [],
  });

  const calculateStats = useCallback((documents: Document[]): void => {
    const total = documents.length;
    const pending = documents.filter(d => d.status.toUpperCase() === DocumentStatus.PENDING).length;
    const signed = documents.filter(d => d.status.toUpperCase() === DocumentStatus.SIGNED).length;
    const recent = [...documents].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

    setStats({
      totalDocuments: total,
      pendingDocuments: pending,
      signedDocuments: signed,
      recentDocuments: recent,
    });
  }, []);

  const fetchDocuments = useCallback(async (): Promise<void> => {
    try {
      setIsRefreshing(true);
      const response = await fetch('/api/documents');

      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const data = await response.json() as Document[];
      setDocuments(data);
      calculateStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  }, [calculateStats]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchDocuments();
    }
  }, [status, fetchDocuments]);

  useEffect(() => {
    let filtered = [...documents];

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(doc =>
        doc.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredDocuments(filtered);
  }, [documents, searchTerm, statusFilter]);

  if (status === 'loading' || loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Loading text="Carregando documentos..." />
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />;
  }

  if (status === 'authenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <PageHeader
              title="Seus Documentos"
              description="Gerencie seus documentos, assine pendentes e acompanhe o status de cada um."
              showNewDocumentButton={true}
            />
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StatCard
              title="Total de Documentos"
              value={stats.totalDocuments}
              icon={DocumentTextIcon}
              iconColor="text-blue-500"
              valueColor="text-blue-600"
              isActionCard={false}
            />
            <StatCard
              title="Documentos Pendentes"
              value={stats.pendingDocuments}
              icon={ClockIcon}
              iconColor="text-yellow-500"
              valueColor="text-yellow-600"
              isActionCard={false}
            />
            <StatCard
              title="Documentos Assinados"
              value={stats.signedDocuments}
              icon={UserGroupIcon}
              iconColor="text-green-500"
              valueColor="text-green-600"
              isActionCard={false}
            />
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FunnelIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos os status</option>
                  <option value="pending">Pendentes</option>
                  <option value="signed">Assinados</option>
                </select>
              </div>

              <motion.button
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fetchDocuments()}
                disabled={isRefreshing}
              >
                <ArrowPathIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>
          </motion.div>

          {/* Document List */}
          <motion.div
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {filteredDocuments.length > 0 ? (
              <DocumentTable
                documents={filteredDocuments}
                onDelete={(docId) => setDeleteConfirmation({ show: true, docId })}
                onSign={(docId) => router.push(`/documents/${docId}/sign`)}
              />
            ) : (
              <div className="p-8 text-center">
                <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum documento encontrado</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Tente ajustar seus filtros de busca'
                    : 'Você ainda não possui documentos. Crie um novo documento para começar.'}
                </p>
              </div>
            )}
          </motion.div>
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
              const updatedDocuments = documents.filter(d => d.id !== deleteConfirmation.docId);
              setDocuments(updatedDocuments);
              calculateStats(updatedDocuments);
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
    props: { session },
  };
}; 