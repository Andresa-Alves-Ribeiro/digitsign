import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import useDocumentStore from '@/store/useDocumentStore';
import DocumentTable from './DocumentTable';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { Document } from '@/types/interfaces';

interface DocumentListProps {
  initialFilter?: string;
}

export default function DocumentList({ initialFilter = 'all' }: DocumentListProps) {
  const router = useRouter();
  const { documents, setDocuments } = useDocumentStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(router.query.status?.toString() ?? initialFilter);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    show: boolean;
    docId: string | null;
  }>({ show: false, docId: null });

  // Atualiza o filtro quando a URL mudar
  useEffect(() => {
    const status = router.query.status?.toString();
    if (status) {
      setStatusFilter(status);
    }
  }, [router.query.status]);

  // Atualiza a URL quando o filtro mudar
  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    const query = value === 'all' ? {} : { status: value };
    void router.push({
      pathname: router.pathname,
      query,
    }, undefined, { shallow: true });
  };

  const fetchDocuments = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch('/api/documents');
      if (!response.ok) {
        throw new Error('Erro ao carregar documentos');
      }
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      toast.error('Erro ao carregar documentos');
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  }, [setDocuments]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const filteredDocuments = documents.filter((doc: Document) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      doc.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <motion.div
        className="bg-component-bg-light dark:bg-component-bg-dark rounded-t-xl shadow-sm p-4 flex flex-col md:flex-row gap-4 items-center justify-between border border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white dark:bg-neutral-800 text-text-light dark:text-text-dark placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FunnelIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <select
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white dark:bg-neutral-800 text-text-light dark:text-text-dark"
              value={statusFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="all">Todos os status</option>
              <option value="pending">Pendentes</option>
              <option value="signed">Assinados</option>
            </select>
          </div>

          <motion.button
            className="p-2 rounded-lg bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchDocuments()}
            disabled={isRefreshing}
          >
            <ArrowPathIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="bg-component-bg-light dark:bg-component-bg-dark rounded-b-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700"
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
            <DocumentTextIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-light dark:text-text-dark mb-1">
              Nenhum documento encontrado
            </h3>
            <p className="text-text-light/70 dark:text-text-dark/70 mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'Tente ajustar seus filtros de busca'
                : 'Você ainda não possui documentos. Crie um novo documento para começar.'}
            </p>
          </div>
        )}
      </motion.div>

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
            const updatedDocuments = documents.filter((d) => d.id !== deleteConfirmation.docId);
            setDocuments(updatedDocuments);
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
    </>
  );
} 