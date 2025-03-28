import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import Header from '@/components/Header';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === 'authenticated') {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Navbar */}
        <Header />

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white shadow-lg h-screen fixed">
            <div className="p-4">
              <nav className="space-y-2">
                <Link
                  href="/"
                  className="block px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Dashboard
                </Link>
                <Link
                  href="/documents/upload"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Upload de Documentos
                </Link>
                <Link
                  href="/documents/pending"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Pendentes
                </Link>
                <Link
                  href="/documents/signed"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Assinados
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 ml-64 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-gray-600">Bem-vindo ao SuperSign, {session.user?.email}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-700">Total de Documentos</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-700">Pendentes</h3>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-700">Assinados</h3>
                <p className="text-3xl font-bold text-green-600">{stats.signed}</p>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Card para Upload de Documento */}
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">Upload de Documento</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Faça upload de um novo documento para assinatura
                  </p>
                  <div className="mt-4">
                    <Link
                      href="/documents/upload"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      Upload
                    </Link>
                  </div>
                </div>
              </div>

              {/* Card para Documentos Pendentes */}
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">Documentos Pendentes</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Visualize e assine documentos pendentes
                  </p>
                  <div className="mt-4">
                    <Link
                      href="/documents/pending"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors"
                    >
                      Ver Pendentes
                    </Link>
                  </div>
                </div>
              </div>

              {/* Card para Documentos Assinados */}
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">Documentos Assinados</h3>
                  
                  <p className="mt-1 text-sm text-gray-500">
                    Acesse o histórico de documentos assinados
                  </p>

                  <div className="mt-4">
                    <Link
                      href="/documents/signed"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                    >
                      Ver Assinados
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return null;
}
