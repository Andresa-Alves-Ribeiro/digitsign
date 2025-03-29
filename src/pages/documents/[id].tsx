import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import withAuth from "@/features/auth/withAuth";
import Loading from '@/components/Loading';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DashboardLayout from "@/layouts/DashboardLayout";
import Header from "@/layouts/Header";

interface Document {
    id: string;
    name: string;
    fileKey: string;
    userId: string;
    status: string;
    mimeType: string;
    size: number;
    createdAt: string;
    updatedAt: string;
}

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
            fetch(`/api/documents/${id}`)
                .then(res => {
                    if (!res.ok) {
                        router.push('/documents');
                        return;
                    }
                    return res.json();
                })
                .then(data => {
                    if (!data) {
                        router.push('/documents');
                        return;
                    }
                    setDocument(data);
                    setIsLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setIsLoading(false);
                });
        }
    }, [id, session, router]);

    const handleSignDocument = async () => {
        if (!document) return;

        setIsSigning(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulação
            setDocument(prev => prev ? { ...prev, status: 'Signed' } : null);
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
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    if (!document) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div>Documento não encontrado</div>
            </div>
        );
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getStatusTranslation = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'Pending': 'Pendente',
            'Signed': 'Assinado',
            'Rejected': 'Rejeitado',
            'Expired': 'Expirado'
        };
        return statusMap[status] || status;
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'signed':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'expired':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <DashboardLayout activePage="documents" />

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-zinc-100">
                <Header />
                <div className="flex-1 px-4 md:px-6 py-6 overflow-auto">
                    <div className="container mx-auto">
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <div className="flex justify-between items-start mb-6">
                                <h1 className="text-2xl font-bold">{document.name}</h1>
                                <button
                                    onClick={handleDeleteDocument}
                                    disabled={isDeleting}
                                    className={`p-2 rounded-full text-white ${isDeleting
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-red-600 hover:bg-red-700'
                                        } transition-colors group relative`}
                                    title="Excluir documento"
                                >
                                    {isDeleting ? (
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    )}
                                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        Excluir documento
                                    </span>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <span className="font-semibold mr-2">Status:</span>
                                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(document.status)}`}>
                                        {getStatusTranslation(document.status)}
                                    </span>
                                </div>

                                <div>
                                    <span className="font-semibold mr-2">Data de upload:</span>
                                    <span>
                                        {format(new Date(document.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                                    </span>
                                </div>

                                <div>
                                    <span className="font-semibold mr-2">Tamanho do arquivo:</span>
                                    <span>{formatFileSize(document.size)}</span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <button
                                    onClick={handleSignDocument}
                                    disabled={isSigning || document.status === 'Signed'}
                                    className={`bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors ${(isSigning || document.status === 'Signed') ? 'bg-gray-400 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {isSigning ? 'Assinando...' : 'Assinar Documento'}
                                </button>
                            </div>
                        </div>

                        {/* Visualizador de PDF */}
                        <div className="w-full h-[800px] border rounded-lg overflow-hidden">
                            <iframe
                                src={`/api/documents/${document.id}/view`}
                                className="w-full h-full"
                                title={document.name}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withAuth(DocumentViewPage);