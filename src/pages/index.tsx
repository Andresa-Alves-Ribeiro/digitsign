import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useDocumentStore } from '@/store/useDocumentStore';
import { Button } from '@/components/Button';
import { toast } from 'react-hot-toast';
import { DashboardStats } from '@/types/interfaces';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { DocumentStatus } from '@/types/enums';
import { DocumentArrowUpIcon, ClipboardDocumentListIcon, DocumentCheckIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const router = useRouter();
  const { documents, setDocuments, setLoading } = useDocumentStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalDocuments: 0,
    pendingDocuments: 0,
    signedDocuments: 0,
  });

  const calculateStats = useCallback(() => {
    const total = documents.length;
    const pending = documents.filter(doc => doc.status === DocumentStatus.PENDING).length;
    const signed = documents.filter(doc => doc.status === DocumentStatus.SIGNED).length;

    setStats({
      totalDocuments: total,
      pendingDocuments: pending,
      signedDocuments: signed,
    });
  }, [documents]);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/documents');
        if (!response.ok) throw new Error('Erro ao carregar documentos');
        const data = await response.json();
        setDocuments(data);
        calculateStats();
      } catch (error) {
        console.error('Error loading documents:', error);
        toast.error('Erro ao carregar documentos');
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [setDocuments, setLoading, calculateStats]);

  const handleUpload = () => {
    router.push('/documents/upload');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Button
            variant="primary"
            onClick={handleUpload}
          >
            Upload de Documento
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">Total de Documentos</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalDocuments}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">Documentos Pendentes</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingDocuments}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">Documentos Assinados</h3>
          <p className="text-3xl font-bold text-green-600">{stats.signedDocuments}</p>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Card para Upload de Documento */}
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

        {/* Card para Documentos Pendentes */}
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

        {/* Card para Documentos Assinados */}
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
