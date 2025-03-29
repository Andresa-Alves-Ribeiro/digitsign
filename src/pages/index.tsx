import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import Image from 'next/image';
import logo from '../../public/logo.png';
import {
  HomeIcon,
  DocumentArrowUpIcon,
  ClockIcon,
  CheckCircleIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';

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
          <div className="hidden md:block w-64 bg-white shadow-lg">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-100">
              <Link href="/" className="flex items-center justify-center">
                <Image
                  src={logo}
                  alt="Logo"
                  width={120}
                  height={120}
                  className="w-auto"
                />
              </Link>
            </div>

            <div className="p-4">
              <nav className="space-y-1">
                <Link
                  href="/"
                  className="flex items-center px-4 py-2.5 text-gray-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-200 group"
                >
                  <HomeIcon className="w-5 h-5 mr-3 text-blue-500 group-hover:text-blue-600" />
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link
                  href="/documents/upload"
                  className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 group"
                >
                  <DocumentArrowUpIcon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" />
                  <span className="font-medium">Upload de Documentos</span>
                </Link>
                <Link
                  href="/documents/pending"
                  className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 group"
                >
                  <ClockIcon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" />
                  <span className="font-medium">Pendentes</span>
                </Link>
                <Link
                  href="/documents/signed"
                  className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 group"
                >
                  <CheckCircleIcon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" />
                  <span className="font-medium">Assinados</span>
                </Link>
              </nav>
            </div>

            {/* Sidebar Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>v1.0.0</span>
                <span>© 2025</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <Header />
            <div className="flex-1 px-4 md:px-6 py-6 overflow-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <div className="flex items-center">
                  <ChartBarIcon className="w-10 h-10 text-green-600 mr-3" />
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
                      href="/documents/pending"
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
                      href="/documents/signed"
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
