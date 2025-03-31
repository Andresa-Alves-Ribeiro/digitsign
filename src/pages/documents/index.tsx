import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import withAuth from "@/features/auth/withAuth";
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import Loading from "@/components/Loading";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import DocumentCards from "@/components/documents/DocumentCards";
import DocumentTable from "@/components/documents/DocumentTable";
import { Document } from '@/types/interfaces';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

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
                console.log('Documentos carregados:', data);
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
            <div className="bg-zinc-100 h-full">
                <div className="max-w-full">
                    <div className="px-4 py-4 sm:py-6">
                        <div className="space-y-4 sm:space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="mb-4 sm:mb-8"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Documentos</h2>
                                        <p className="text-sm sm:text-base text-gray-600 mt-1">Gerencie seus documentos</p>
                                    </div>

                                    <Link
                                        href="/documents/upload"
                                        className="inline-flex w-max items-center px-3 sm:px-4 py-2 border border-transparent text-sm font-medium text-white rounded-lg shadow-sm bg-green-600 hover:bg-green-700 transition-colors duration-200"
                                    >
                                        <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                        Novo Documento
                                    </Link>
                                </div>
                            </motion.div>

                            <DocumentCards 
                                documents={documents} 
                                onDelete={(docId) => setDeleteConfirmation({ show: true, docId })} 
                                onSign={(docId) => router.push(`/documents/${docId}/sign`)}
                            />
                            <DocumentTable 
                                documents={documents} 
                                onDelete={(docId) => setDeleteConfirmation({ show: true, docId })} 
                                onSign={(docId) => router.push(`/documents/${docId}/sign`)}
                            />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    return {
        props: {
            session,
        },
    };
};

export default withAuth(DocumentsPage); 