import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import withAuth from "../../../components/withAuth";
import { motion } from "framer-motion";

function DocumentsPage() {
    const [documents, setDocuments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { data: session } = useSession();

    useEffect(() => {
        if (session) {
            fetchDocuments();
        }
    }, [session]);

    const fetchDocuments = async () => {
        try {
            const res = await fetch("/api/documents");
            const data = await res.json();
            setDocuments(data);
        } catch (error) {
            console.error("Error fetching documents:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8 max-w-7xl"
        >
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Meus Documentos</h1>
                <Link href="/documents/upload">
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Upload de Documento
                    </motion.button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {documents.map((doc, index) => (
                    <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-semibold text-lg text-gray-800 truncate">{doc.name}</h2>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    doc.status === "PENDING" 
                                        ? "bg-yellow-100 text-yellow-800" 
                                        : "bg-green-100 text-green-800"
                                }`}>
                                    {doc.status === "PENDING" ? "Pendente" : "Assinado"}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">
                                {new Date(doc.createdAt).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                })}
                            </p>
                            <Link 
                                href={`/documents/${doc.id}`}
                                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            >
                                <span className="mr-2">Visualizar</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

export default withAuth(DocumentsPage);