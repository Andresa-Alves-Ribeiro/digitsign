import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import Header from '@/layouts/Header';
import { motion } from 'framer-motion';
import {
  DocumentArrowUpIcon,
  ClockIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/layouts/DashboardLayout';

interface DashboardStats {
  pending: number;
  signed: number;
  total: number;
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({ pending: 0, signed: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/documents/stats');
        if (!response.ok) throw new Error('Erro ao carregar estatísticas');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        toast.error('Erro ao carregar estatísticas');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === 'authenticated') {
    return (
      <div className="flex h-screen">
          {/* Sidebar */}
          <DashboardLayout />

          {/* Main Content */}
          <div className="flex-1 flex flex-col bg-zinc-100">
            <Header />
            <div className="flex-1 px-4 md:px-6 py-6 overflow-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <div className="flex items-center">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h2>
                    <p className="text-gray-600 mt-1">Bem-vindo ao SuperSign, {session.user?.name}</p>
                  </div>
                </div>
              </motion.div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">Total de Documentos</h3>
                    <DocumentTextIcon className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">Pendentes</h3>
                    <ClockIcon className="w-6 h-6 text-yellow-500" />
                  </div>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">Assinados</h3>
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold text-green-600">{stats.signed}</p>
                </motion.div>
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
                      <ClipboardDocumentListIcon className="w-6 h-6 text-green-500 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">Documentos Pendentes</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      Visualize e assine documentos pendentes
                    </p>
                    <Link
                      href="/documents"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
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
                      <DocumentCheckIcon className="w-6 h-6 text-purple-500 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">Documentos Assinados</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      Acesse o histórico de documentos assinados
                    </p>
                    <Link
                      href="/documents"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
                    >
                      <CheckCircleIcon className="w-4 h-4 mr-2" />
                      Ver Assinados
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
      </div>
    );
  }

  return null;
}
