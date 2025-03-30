import { motion } from 'framer-motion';
import Link from 'next/link';
import { documentStatusConfig } from '@/constants/documentStatus';
import { PdfIcon } from '@/assets/icons';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Document as DocumentType, DocumentTableProps as DocumentTablePropsType } from '@/types/interfaces';

const DocumentTable: React.FC<DocumentTablePropsType> = ({ documents, onDelete }) => {
    return (
        <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nome do documento
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Data
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tamanho
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                className="hover:bg-gray-50 transition-colors duration-200"
                            >
                                <td className="px-4 py-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8">
                                            <PdfIcon className="h-8 w-8 text-gray-400 group-hover:text-green-600" />
                                        </div>
                                        <div className="ml-3">
                                            <Link href={`/documents/${doc.id}`} className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                                                {doc.name}
                                            </Link>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        {new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-left">
                                    <div className="text-sm text-gray-500">
                                        {doc.size ? `${(doc.size / (1024 * 1024)).toFixed(2)} MB` : '-'}
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-left">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${documentStatusConfig[doc.status as keyof typeof documentStatusConfig].color}`}>
                                        {documentStatusConfig[doc.status as keyof typeof documentStatusConfig].icon}
                                        <span className="ml-1">{documentStatusConfig[doc.status as keyof typeof documentStatusConfig].label}</span>
                                    </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => onDelete(doc.id)}
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
}

export default DocumentTable; 