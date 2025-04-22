import { motion } from 'framer-motion';
import Link from 'next/link';
import { getStatusConfig } from '@/constants/documentStatus';
import { PdfIcon } from '@/assets/icons';
import { CalendarIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { DocumentCardsProps as DocumentCardsPropsType } from '@/types/interfaces';
import { DocumentStatus } from '@/types/enums/document';
import { useDocumentActions } from '@/utils/document';

const DocumentCards: React.FC<DocumentCardsPropsType> = ({ documents, onDelete, onSign }) => {
  const { onSign: handleSign, onDelete: handleDelete } = useDocumentActions(() => {
    // Atualiza a lista de documentos após a exclusão
    if (onDelete) {
      onDelete(documents[0].id); // Isso vai disparar a atualização no componente pai
    }
  });

  return (
    <div className="lg:hidden space-y-4">
      {documents.map((doc, index) => (
        <motion.div
          key={doc.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 h-8 w-8 text-gray-400 group-hover:text-green-600 transition-colors duration-200">
                <PdfIcon className="h-8 w-8" />
              </div>
              <div className="group">
                <Link href={`/documents/${doc.id}`} className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                  {doc.name}
                </Link>
                <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                  <div>
                    {doc.size ? `${(doc.size / (1024 * 1024)).toFixed(2)} MB` : '-'}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {doc.status.toLowerCase() === 'pending' && (
                <button
                  onClick={() => onSign ? onSign(doc.id) : handleSign(doc.id)}
                  className="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50 transition-colors duration-200"
                  title="Assinar documento"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => onDelete ? onDelete(doc.id) : handleDelete(doc.id)}
                className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50 transition-colors duration-200"
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
                  style={{ 
                    backgroundColor: doc.status === DocumentStatus.PENDING ? '#FEF3C7' : undefined,
                    color: doc.status === DocumentStatus.PENDING ? '#B45309' : undefined
                  }}
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
};

export default DocumentCards; 