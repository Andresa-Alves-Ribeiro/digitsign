import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import withAuth from "@/features/auth/withAuth";
import Loading from '@/components/Loading';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatFileSize } from '@/utils/file';
import { getStatusConfig } from '@/constants/documentStatus';
import { DocumentStatus } from '@/types/enums';
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Document } from '@/types/interfaces';

function DocumentViewPage() {
    const router = useRouter();
    const { id } = router.query;
    const { data: session } = useSession();
    const [document, setDocument] = useState<Document | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSigning, setIsSigning] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (id && session) {
            console.log('=== Iniciando carregamento do documento ===');
            console.log('ID do documento:', id);
            console.log('Session:', session ? 'Autenticado' : 'Não autenticado');

            fetch(`/api/documents/${id}/metadata`)
                .then(res => {
                    console.log('Status da resposta:', res.status);
                    if (!res.ok) {
                        console.log('Erro na resposta:', res.statusText);
                        router.push('/documents');
                        return;
                    }
                    return res.json();
                })
                .then(data => {
                    console.log('Dados recebidos:', data);
                    if (!data) {
                        console.log('Nenhum dado recebido');
                        router.push('/documents');
                        return;
                    }
                    setDocument(data);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error('Erro ao buscar documento:', err);
                    setError(err.message);
                    setIsLoading(false);
                });
        }
    }, [id, session, router]);

    const handleSignDocument = async () => {
        if (!document) return;

        setIsSigning(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setDocument(prev => prev ? { ...prev, status: DocumentStatus.SIGNED } : null);
        } catch (error) {
            console.error('Erro ao assinar documento:', error);
            setError('Erro ao assinar o documento. Tente novamente.');
        } finally {
            setIsSigning(false);
        }
    };

    const handleDeleteDocument = async () => {
        if (!document) return;

        if (!confirm('Tem certeza que deseja excluir este documento?')) {
            return;
        }

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/documents/${document.id}/delete`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Erro ao excluir documento');
            }

            router.push('/documents');
        } catch (error) {
            console.error('Erro ao excluir documento:', error);
            setError(error instanceof Error ? error.message : 'Erro ao excluir documento');
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    if (!document) {
        return (
            <div className="flex justify-center items-center h-full">
                <div>Documento não encontrado</div>
            </div>
        );
    }

    const statusConfig = getStatusConfig(document.status);

    return (
        <div className="overflow-y-auto">
            <div className="container mx-auto px-4 md:px-6 py-6">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-start mb-6">
                        <h1 className="text-xl font-bold text-zinc-800">{document.name}</h1>

                        <div className="flex items-center gap-2">
                            {(() => {
                                return document.status === 'PENDING' && (
                                    <button
                                        onClick={handleSignDocument}
                                        disabled={isSigning}
                                        className="p-2 flex items-center gap-2 bg-green-100 text-green-700 text-sm rounded-md hover:bg-green-200 transition-colors duration-200 m-0 cursor-pointer"
                                    >
                                        <PencilSquareIcon className="w-4 h-4" /> {isSigning ? 'Assinando...' : 'Assinar Documento'}
                                    </button>
                                );
                            })()}

                            <button
                                onClick={handleDeleteDocument}
                                disabled={isDeleting}
                                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${isDeleting
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                                    }`}
                                title="Excluir documento"
                            >
                                {isDeleting ? (
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                )}
                                {isDeleting ? 'Excluindo...' : 'Excluir'}
                            </button>
                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-3">
                            <div className={`p-2 border-none bg-green-400 rounded-lg ${statusConfig.color} bg-opacity-20`}>
                                {statusConfig.icon}
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <p className={`font-medium border-none px-1 ${statusConfig.color}`}>
                                    {statusConfig.label}
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Data de upload</p>
                                <p className="font-medium text-gray-900">
                                    {format(new Date(document.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Tamanho do arquivo</p>
                                <p className="font-medium text-gray-900">{document.size && formatFileSize(document.size)}</p>
                            </div>
                        </div>
                    </div>


                </div>

                {/* Visualizador de PDF */}
                <div className="w-full border rounded-lg overflow-hidden">
                    <iframe
                        src={`/api/documents/${document.id}/view`}
                        className="w-full h-[700px]"
                        title={document.name}
                        onError={(e) => {
                            console.error('Erro no iframe:', e);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default withAuth(DocumentViewPage);