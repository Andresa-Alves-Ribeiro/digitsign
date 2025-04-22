import { useEffect, useState, useCallback } from 'react';
import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { Document } from '@/types/interfaces';
import { DocumentStatus } from '@/types/enums/document';
import { DashboardStats } from '@/types/interfaces/dashboard';
import {
  DocumentTextIcon,
  ClockIcon,
  DocumentCheckIcon,
} from '@heroicons/react/24/outline';
import useDocumentStore from '@/store/useDocumentStore';
import { toast } from 'react-hot-toast';
import Logger from '@/utils/logger';

import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import RecentActivities from '@/components/dashboard/RecentActivities';
import SigningTimeline from '@/components/dashboard/SigningTimeline';

interface ApiErrorResponse {
  message: string;
}

export default function Home() {
  const { data: session } = useSession();
  const { setDocuments, setLoading } = useDocumentStore();
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
      recentDocuments: recent.map(doc => ({
        ...doc,
        status: doc.status.toUpperCase() as DocumentStatus
      })),
    });
  }, []);

  const loadDocuments = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch('/api/documents');

      if (!response.ok) {
        const errorData = await response.json() as ApiErrorResponse;
        throw new Error(errorData.message ?? 'Erro ao carregar documentos');
      }

      const data = await response.json() as Document[];
      setDocuments(data);
      calculateStats(data);
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Erro desconhecido ao carregar documentos';
      Logger.error('Error loading documents:', errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setDocuments, setLoading, calculateStats]);

  useEffect(() => {
    void loadDocuments();
  }, [loadDocuments]);

  return (
    <div className="px-4 pt-4 h-full bg-zinc-100">
      <PageHeader session={session} title="Dashboard" description={`Seja bem-vindo, ${session?.user?.name ?? 'Usuário'}`} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <StatCard
          title="Total de Documentos"
          value={stats.totalDocuments}
          icon={DocumentTextIcon}
          iconColor="text-blue-500"
          valueColor="text-blue-600"
          percentageColor="text-green-500"
          description="Quer fazer um novo upload?"
          buttonColor="bg-blue-600"
          buttonHoverColor="hover:bg-blue-700"
          buttonText="Novo Documento"
          href="/documents/upload"
          isActionCard
        />
        <StatCard
          title="Documentos Pendentes"
          value={stats.pendingDocuments}
          total={stats.totalDocuments}
          icon={ClockIcon}
          iconColor="text-yellow-500"
          valueColor="text-yellow-600"
          percentageColor="text-red-500"
          description={`Você tem ${stats.pendingDocuments} documentos pendentes de assinatura`}
          buttonColor="bg-yellow-600"
          buttonHoverColor="hover:bg-yellow-700"
          buttonText="Ver Pendentes"
          href="/documents"
          isActionCard
        />
        <StatCard
          title="Documentos Assinados"
          value={stats.signedDocuments}
          total={stats.totalDocuments}
          icon={DocumentCheckIcon}
          iconColor="text-green-500"
          valueColor="text-green-600"
          percentageColor="text-green-500"
          description={`Você tem ${stats.signedDocuments} documentos assinados`}
          buttonColor="bg-green-600"
          buttonHoverColor="hover:bg-green-700"
          buttonText="Ver Assinados"
          href="/documents/signed"
          isActionCard
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RecentActivities documents={stats.recentDocuments} />
        
        <SigningTimeline documents={stats.recentDocuments} />
      </div>
    </div>
  );
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
