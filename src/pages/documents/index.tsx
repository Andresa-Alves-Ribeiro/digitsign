import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import { useSession, getSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { UserGroupIcon, DocumentTextIcon, ClockIcon } from '@heroicons/react/24/outline';
import Loading from '@/components/Loading';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import DocumentCards from '@/components/documents/DocumentCards';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        calculateStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchDocuments();
    }
  }, [status, calculateStats]);

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
      <div className="h-full bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <PageHeader title="Seus Documentos" description="Gerencie seus documentos aqui" />
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <StatCard
              title="Total de Documentos"
              value={stats.totalDocuments}
              icon={DocumentTextIcon}
              color="blue"
            />
            <StatCard
              title="Documentos Pendentes"
              value={stats.pendingDocuments}
              icon={ClockIcon}
              color="yellow"
            />
            <StatCard
              title="Documentos Assinados"
              value={stats.signedDocuments}
              icon={UserGroupIcon}
              color="green"
            />
          </div>

          {/* Document List */}
          <div className="bg-white rounded-lg shadow">
            <DocumentTable
              documents={documents}
              onDelete={(docId) => setDeleteConfirmation({ show: true, docId })}
              onSign={(docId) => router.push(`/documents/${docId}/sign`)}
            />
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