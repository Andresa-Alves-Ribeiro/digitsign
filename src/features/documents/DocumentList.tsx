import { useEffect } from 'react';
import { useDocumentStore } from '@/store/useDocumentStore';
import Loading from '@/components/Loading';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Document as DocumentType } from '@/types/interfaces';
import { DocumentStatus } from '@/types/enums';
import { documentStatusConfig } from '@/constants/documentStatus';
import { formatFileSizeInMB } from '@/utils/file';

const DocumentList = () => {
    const { documents, isLoading, error, setDocuments, setLoading, setError } = useDocumentStore();

    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/documents');
                if (!response.ok) {
                    throw new Error('Failed to fetch documents');
                }
                const data = await response.json();
                setDocuments(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error fetching documents');
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [setDocuments, setLoading, setError]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loading text="Carregando documentos..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nome
                        </th>
                        <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tamanho
                        </th>
                        <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th scope="col" className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map((document: DocumentType, index) => {
                        const status = document.status as DocumentStatus;
                        const statusConfig = documentStatusConfig[status];

                        return (
                            <motion.tr
                                key={document.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{document.name}</div>
                                </td>
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-left">
                                    <div className="text-sm text-gray-500">
                                        {document.size ? formatFileSizeInMB(document.size) : '-'}
                                    </div>
                                </td>
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-left">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${statusConfig.color}`}>
                                        {statusConfig.icon}
                                        <span className="ml-1">{statusConfig.label}</span>
                                    </span>
                                </td>
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        href={`/documents/${document.id}`}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Visualizar
                                    </Link>
                                </td>
                            </motion.tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default DocumentList; 