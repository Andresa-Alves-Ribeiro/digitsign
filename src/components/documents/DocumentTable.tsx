import { motion } from 'framer-motion';
import Link from 'next/link';
import { PdfIcon } from '@/assets/icons';
import { PencilSquareIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { DocumentTableProps as DocumentTablePropsType } from '@/types/interfaces';
import { useDocumentActions } from '@/utils/document';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Badge from '@/components/ui/Badge';

const DocumentTable: React.FC<DocumentTablePropsType> = ({ documents, onDelete, onSign }) => {
  const { onSign: handleSign, onDelete: handleDelete } = useDocumentActions({
    onDocumentsChange: () => {
      if (onDelete) {
        onDelete(documents[0].id);
      }
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'signed':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pendente';
      case 'signed':
        return 'Assinado';
      default:
        return status;
    }
  };

  const MobileView = () => (
    <div className="lg:hidden space-y-4">
      {documents.map((doc, _index) => (
        <motion.div
          key={doc.id}
          variants={rowVariants}
          initial="hidden"
          animate="visible"
          className="bg-component-bg-light dark:bg-component-bg-dark rounded-lg shadow-sm p-4 border border-neutral-100 dark:border-neutral-700"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-10 w-10 text-neutral-400 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800 rounded-md flex items-center justify-center">
                <PdfIcon className="h-6 w-6" />
              </div>
              <div>
                <Link href={`/documents/${doc.id}`} className="text-sm font-medium text-text-light dark:text-text-dark hover:text-green-600 dark:hover:text-green-400">
                  {doc.name}
                </Link>
                <div className="mt-1 flex items-center text-xs text-text-light/70 dark:text-text-dark/80">
                  <span>{new Date(doc.createdAt).toLocaleDateString('pt-BR')}</span>
                  <span className="mx-2">•</span>
                  <span>{doc.size ? `${(doc.size / (1024 * 1024)).toFixed(2)} MB` : '-'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link 
                href={`/documents/${doc.id}`}
                className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
              >
                <EyeIcon className="w-5 h-5" />
              </Link>
              {doc.status.toLowerCase() === 'pending' && (
                <button
                  onClick={() => onSign ? onSign(doc.id) : handleSign(doc.id)}
                  className="p-1.5 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 rounded-full hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors duration-200"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => onDelete ? onDelete(doc.id) : handleDelete(doc.id)}
                className="p-1.5 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-200"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="mt-3">
            <Badge variant={getStatusColor(doc.status)}>
              {getStatusText(doc.status)}
            </Badge>
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Desktop view for large screens
  const DesktopView = () => (
    <div className="hidden lg:block bg-component-bg-light dark:bg-component-bg-dark rounded-lg shadow-sm">
      <div className="w-full">
        <table className="w-full divide-y divide-neutral-200 dark:divide-neutral-700">
          <thead className="bg-neutral-50 dark:bg-neutral-800/50 sticky top-0 z-10">
            <tr>
              <th scope="col" className="w-1/3 px-4 py-3 text-left text-xs font-medium text-text-light/70 dark:text-text-dark/70 uppercase tracking-wider">
                Nome do documento
              </th>
              <th scope="col" className="w-1/6 px-4 py-3 text-left text-xs font-medium text-text-light/70 dark:text-text-dark/70 uppercase tracking-wider">
                Data
              </th>
              <th scope="col" className="w-1/6 px-4 py-3 text-left text-xs font-medium text-text-light/70 dark:text-text-dark/70 uppercase tracking-wider">
                Tamanho
              </th>
              <th scope="col" className="w-1/6 px-4 py-3 text-left text-xs font-medium text-text-light/70 dark:text-text-dark/70 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="w-1/6 px-4 py-3 text-right text-xs font-medium text-text-light/70 dark:text-text-dark/70 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>

          <motion.tbody
            className="bg-component-bg-light dark:bg-component-bg-dark divide-y divide-neutral-200 dark:divide-neutral-700"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {documents.map((doc, _index) => (
              <motion.tr
                key={doc.id}
                variants={rowVariants}
                className="transition-colors duration-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 text-neutral-400 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800 rounded-md flex items-center justify-center">
                      <PdfIcon className="h-6 w-6" />
                    </div>
                    <div className="ml-4 min-w-0">
                      <Link href={`/documents/${doc.id}`} className="block w-96 text-sm font-medium text-text-light dark:text-text-dark hover:text-green-600 dark:hover:text-green-400 overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer">
                        {doc.name}
                      </Link>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-text-light/70 dark:text-text-dark/80">
                  {format(new Date(doc.createdAt), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-text-light/70 dark:text-text-dark/80">
                  {doc.size ? `${(doc.size / (1024 * 1024)).toFixed(2)} MB` : '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Badge variant={getStatusColor(doc.status)}>
                    {getStatusText(doc.status)}
                  </Badge>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Link 
                      href={`/documents/${doc.id}`}
                      className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </Link>
                    {doc.status.toLowerCase() === 'pending' && (
                      <button
                        onClick={() => onSign ? onSign(doc.id) : handleSign(doc.id)}
                        className="p-1.5 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 rounded-full hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors duration-200"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete ? onDelete(doc.id) : handleDelete(doc.id)}
                      className="p-1.5 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-200"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </div>
  );

  return (
    <>
      <MobileView />
      <DesktopView />
    </>
  );
};

export default DocumentTable; 