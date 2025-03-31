import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useDocumentStore } from '@/store/useDocumentStore';
import { toast } from 'react-hot-toast';
import { Document } from '@/types/interfaces';
import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { DocumentStatus } from '@/types/enums';
import { 
  DocumentArrowUpIcon, 
  ClipboardDocumentListIcon, 
  DocumentCheckIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  DocumentTextIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalDocuments: number;
  pendingDocuments: number;
  signedDocuments: number;
  recentDocuments: Document[];
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

  const calculateStats = useCallback((documents: Document[]) => {
    const total = documents.length;
    const pending = documents.filter(doc => doc.status === DocumentStatus.PENDING).length;
    const signed = documents.filter(doc => doc.status === DocumentStatus.SIGNED).length;
    const recent = [...documents].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

    setStats({
      totalDocuments: total,
      pendingDocuments: pending,
      signedDocuments: signed,
      recentDocuments: recent,
    });
  }, []);

  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/documents');
      if (!response.ok) throw new Error('Erro ao carregar documentos');
      const data: Document[] = await response.json();
      setDocuments(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Erro ao carregar documentos');
    } finally {
      setLoading(false);
    }
  }, [setDocuments, setLoading, calculateStats]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  return (
    <div className="px-4 py-8 h-full bg-zinc-100">
      <div className="flex flex-col gap-3 mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-sm border border-blue-100">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-lg text-gray-600 font-medium">
          Seja bem-vindo, {session?.user?.name ?? 'Usuário'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Total de Documentos</h3>
            <DocumentTextIcon className="w-6 h-6 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900">{stats.totalDocuments}</p>
            <span className="text-sm text-green-500 flex items-center">
              <ArrowUpIcon className="w-4 h-4 mr-1" />
              12%
            </span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Documentos Pendentes</h3>
            <ClockIcon className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingDocuments}</p>
            <span className="text-sm text-red-500 flex items-center">
              <ArrowDownIcon className="w-4 h-4 mr-1" />
              5%
            </span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Documentos Assinados</h3>
            <CheckCircleIcon className="w-6 h-6 text-green-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-green-600">{stats.signedDocuments}</p>
            <span className="text-sm text-green-500 flex items-center">
              <ArrowUpIcon className="w-4 h-4 mr-1" />
              8%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-700">Atividades Recentes</h3>
            <Link href="/documents" className="text-sm text-blue-600 hover:text-blue-700">
              Ver todos
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  doc.status === DocumentStatus.SIGNED 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {doc.status === DocumentStatus.SIGNED ? 'Assinado' : 'Pendente'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-700">Distribuição</h3>
            <ChartBarIcon className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Assinados</span>
                <span className="font-medium text-gray-900">{stats.signedDocuments}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(stats.signedDocuments / stats.totalDocuments) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Pendentes</span>
                <span className="font-medium text-gray-900">{stats.pendingDocuments}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${(stats.pendingDocuments / stats.totalDocuments) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
        >
          <div className="p-6">
            <div className="flex items-center mb-4">
              <DocumentArrowUpIcon className="w-6 h-6 text-blue-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Upload de Documento</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Faça upload de um novo documento para assinatura
            </p>
            <Link
              href="/documents/upload"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              <DocumentArrowUpIcon className="w-4 h-4 mr-2" />
              Upload
            </Link>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
        >
          <div className="p-6">
            <div className="flex items-center mb-4">
              <ClipboardDocumentListIcon className="w-6 h-6 text-yellow-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Documentos Pendentes</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Visualize e assine documentos pendentes
            </p>
            <Link
              href="/documents"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 transition-colors duration-200"
            >
              <ClockIcon className="w-4 h-4 mr-2" />
              Ver Pendentes
            </Link>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
        >
          <div className="p-6">
            <div className="flex items-center mb-4">
              <DocumentCheckIcon className="w-6 h-6 text-green-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Documentos Assinados</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Acesse documentos já assinados
            </p>
            <Link
              href="/documents/signed"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
            >
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Ver Assinados
            </Link>
          </div>
        </motion.div>
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
