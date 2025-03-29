import { useEffect } from 'react';
import { useDocumentStore } from '@/store/useDocumentStore';
import Loading from '@/components/Loading';
import { motion } from 'framer-motion';

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
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Documentos</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((document, index) => (
                    <motion.div
                        key={document.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <div className="p-2 rounded-full bg-green-50">
                                        <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h2 className="ml-3 text-lg font-semibold text-gray-900">{document.name}</h2>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {new Date(document.createdAt).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <a
                                    href={`/api/documents/${document.id}/download`}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download
                                </a>
                                <button
                                    onClick={async () => {
                                        if (window.confirm('Tem certeza que deseja excluir este documento?')) {
                                            try {
                                                const response = await fetch(`/api/documents/${document.id}`, {
                                                    method: 'DELETE',
                                                });
                                                if (!response.ok) {
                                                    throw new Error('Failed to delete document');
                                                }
                                                // Update the store to remove the deleted document
                                                setDocuments(documents.filter(doc => doc.id !== document.id));
                                            } catch (err) {
                                                setError(err instanceof Error ? err.message : 'Error deleting document');
                                            }
                                        }
                                    }}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default DocumentList; 