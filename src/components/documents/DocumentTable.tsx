import { motion } from 'framer-motion';
import Link from 'next/link';
import { getStatusConfig } from '@/constants/documentStatus';
import { PdfIcon } from '@/assets/icons';
import { PencilSquareIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { DocumentTableProps as DocumentTablePropsType } from '@/types/interfaces';
import { useDocumentActions } from '@/utils/document';

const DocumentTable: React.FC<DocumentTablePropsType> = ({ documents, onDelete, onSign }) => {
  const { onSign: handleSign, onDelete: handleDelete } = useDocumentActions(() => {
    if (onDelete) {
      onDelete(documents[0].id);
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

  const MobileView = () => (
    <div className="lg:hidden space-y-4">
      {documents.map((doc, _index) => (
        <motion.div
          key={doc.id}
          variants={rowVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-lg shadow-sm p-4 border border-gray-100"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-10 w-10 text-gray-400 bg-gray-50 rounded-md flex items-center justify-center">
                <PdfIcon className="h-6 w-6" />
              </div>
              <div>
                <Link href={`/documents/${doc.id}`} className="text-sm font-medium text-gray-900 hover:text-green-600">
                  {doc.name}
                </Link>
                <div className="mt-1 flex items-center text-xs text-gray-500">
                  <span>{new Date(doc.createdAt).toLocaleDateString('pt-BR')}</span>
                  <span className="mx-2">•</span>
                  <span>{doc.size ? `${(doc.size / (1024 * 1024)).toFixed(2)} MB` : '-'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link 
                href={`/documents/${doc.id}`}
                className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors duration-200"
                title="Visualizar documento"
              >
                <EyeIcon className="w-5 h-5" />
              </Link>
              {doc.status.toLowerCase() === 'pending' && (
                <button
                  onClick={() => onSign ? onSign(doc.id) : handleSign(doc.id)}
                  className="p-1.5 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50 transition-colors duration-200"
                  title="Assinar documento"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => onDelete ? onDelete(doc.id) : handleDelete(doc.id)}
                className="p-1.5 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50 transition-colors duration-200"
                title="Excluir documento"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="mt-3">
            {(() => {
              const statusConfig = getStatusConfig(doc.status);
              return (
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${statusConfig.color} shadow-sm`}
                >
                  {statusConfig.icon}
                  <span className="ml-1">{statusConfig.label}</span>
                </span>
              );
            })()}
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Desktop view for large screens
  const DesktopView = () => (
    <div className="hidden lg:block bg-white rounded-lg shadow-sm">
      <div className="w-full">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th scope="col" className="w-1/3 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome do documento
              </th>
              <th scope="col" className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th scope="col" className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tamanho
              </th>
              <th scope="col" className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="w-1/6 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>

          <motion.tbody 
            className="bg-white divide-y divide-gray-200"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {documents.map((doc, _index) => (
              <motion.tr
                key={doc.id}
                variants={rowVariants}
                className="transition-colors duration-200"
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 text-gray-400 bg-gray-50 rounded-md flex items-center justify-center">
                      <PdfIcon className="h-6 w-6" />
                    </div>
                    <div className="ml-4 min-w-0">
                      <Link href={`/documents/${doc.id}`} className="block w-96 text-sm font-medium text-gray-900 hover:text-green-600 overflow-hidden text-ellipsis whitespace-nowrap" title={doc.name}>
                        {doc.name}
                      </Link>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doc.size ? `${(doc.size / (1024 * 1024)).toFixed(2)} MB` : '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-left">
                  {(() => {
                    const statusConfig = getStatusConfig(doc.status);
                    return (
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${statusConfig.color} shadow-sm`}
                      >
                        {statusConfig.icon}
                        <span className="ml-1">{statusConfig.label}</span>
                      </span>
                    );
                  })()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Link 
                      href={`/documents/${doc.id}`}
                      className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors duration-200"
                      title="Visualizar documento"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </Link>
                    {doc.status.toLowerCase() === 'pending' && (
                      <button
                        onClick={() => onSign ? onSign(doc.id) : handleSign(doc.id)}
                        className="p-1.5 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50 transition-colors duration-200"
                        title="Assinar documento"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete ? onDelete(doc.id) : handleDelete(doc.id)}
                      className="p-1.5 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50 transition-colors duration-200"
                      title="Excluir documento"
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