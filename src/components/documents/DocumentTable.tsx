import { motion } from 'framer-motion';
import Link from 'next/link';
import { getStatusConfig } from '@/constants/documentStatus';
import { PdfIcon } from '@/assets/icons';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { DocumentTableProps as DocumentTablePropsType } from '@/types/interfaces';
import { DocumentStatus } from '@/types/enums/document';
import { useDocumentActions } from '@/utils/document';

const DocumentTable: React.FC<DocumentTablePropsType> = ({ documents, onDelete, onSign }) => {
  const { onSign: handleSign, onDelete: handleDelete } = useDocumentActions(() => {
    if (onDelete) {
      onDelete(documents[0].id);
    }
  });

  return (
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

          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((doc, index) => (
              <motion.tr
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 text-gray-400">
                      <PdfIcon className="h-8 w-8" />
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
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end space-x-2">
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
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentTable; 