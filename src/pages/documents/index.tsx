import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import withAuth from "@/features/auth/withAuth";
import { useSession } from 'next-auth/react';
import { DocumentStatus, documentStatusConfig } from '../../constants/documentStatus';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DocumentArrowUpIcon,
    TrashIcon,
    PencilSquareIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import Loading from "@/components/Loading";
import { commonStyles } from "@/constants/styles";
import ConfirmationDialog from "@/components/ConfirmationDialog";

interface Document {
    id: string;
    name: string;
    fileKey: string;
    userId: string;
    status: DocumentStatus;
    mimeType: string;
    size: number;
    createdAt: string;
    updatedAt: string;
}

function DocumentsPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; docId: string | null }>({
        show: false,
        docId: null
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await fetch('/api/documents');
                if (!response.ok) throw new Error('Erro ao carregar documentos');
                const data = await response.json();
                setDocuments(data);
            } catch (error) {
                toast.error('Erro ao carregar documentos');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (status === 'authenticated') {
            fetchDocuments();
        }
    }, [status]);

    if (status === 'loading' || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <Loading text="Carregando documentos..." />
            </div>
        );
    }

    if (status === 'authenticated') {
        return (
            <div className="flex h-screen">
                <div className="flex-1 flex flex-col bg-zinc-100">
                    <div className="flex-1 px-4 md:px-6 py-6 overflow-auto">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="mb-8"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Documentos</h2>
                                        <p className="text-gray-600 mt-1">Gerencie seus documentos</p>
                                    </div>
                                    <Link
                                        href="/documents/upload"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
                                    >
                                        <PlusIcon className="w-5 h-5 mr-2" />
                                        Novo Documento
                                    </Link>
                                </div>
                            </motion.div>

                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nome do documento
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Data
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tamanho
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center group">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <svg className="h-10 w-10 text-gray-400 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </div>

                                                        <div className="ml-4">
                                                            <Link href={`/documents/${doc.id}`} className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                                                                {doc.name}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-left">
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-left">
                                                    <div className="text-sm text-gray-500">
                                                        {doc.size ? `${(doc.size / (1024 * 1024)).toFixed(2)} MB` : '-'}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-left">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${documentStatusConfig[doc.status].color}`}>
                                                        {documentStatusConfig[doc.status].icon}
                                                        <span className="ml-1">{documentStatusConfig[doc.status].label}</span>
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end space-x-3">
                                                        {doc.status !== 'SIGNED' && (
                                                            <Link
                                                                href={`/documents/${doc.id}/sign`}
                                                                className="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50 transition-colors duration-200 m-0"
                                                                title="Assinar documento"
                                                            >
                                                                <PencilSquareIcon className="w-5 h-5" />
                                                            </Link>
                                                        )}

                                                        <button
                                                            onClick={() => setDeleteConfirmation({ show: true, docId: doc.id })}
                                                            className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50 transition-colors duration-200 cursor-pointer"
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
                    </div>
                </div>

                <ConfirmationDialog
                    isOpen={deleteConfirmation.show}
                    onClose={() => setDeleteConfirmation({ show: false, docId: null })}
                    onConfirm={async () => {
                        if (!deleteConfirmation.docId) return;
                        try {
                            const response = await fetch(`/api/documents/${deleteConfirmation.docId}/delete`, {
                                method: 'DELETE',
                            });
                            if (!response.ok) {
                                throw new Error('Erro ao excluir documento');
                            }
                            setDocuments(documents.filter(d => d.id !== deleteConfirmation.docId));
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
            </div>
        );
    }

    return null;
}

export default withAuth(DocumentsPage); 