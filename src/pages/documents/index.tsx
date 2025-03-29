import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import withAuth from "@/features/auth/withAuth";
import DashboardLayout from "@/layouts/DashboardLayout";
import Header from "@/layouts/Header";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

function DocumentsPage() {
    const [documents, setDocuments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            fetchDocuments();
        }
    }, [session]);

    const fetchDocuments = async () => {
        try {
            const res = await fetch("/api/documents");
            if (!res.ok) throw new Error("Erro ao carregar documentos");
            const data = await res.json();
            setDocuments(data);
        } catch (error) {
            console.error("Error fetching documents:", error);
            toast.error("Erro ao carregar documentos");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen">
                <DashboardLayout activePage="documents" />
                <div className="flex-1 flex items-center justify-center bg-zinc-100">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                </div>
            </div>
        );
    }

    if (documents.length === 0) {
        return (
            <div className="flex h-screen">
                <DashboardLayout activePage="documents" />
                <div className="flex-1 flex flex-col bg-zinc-100">
                    <Header />
                    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-4xl mx-auto w-full"
                        >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                                <div>
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Todos os Documentos</h1>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Gerencie todos os seus documentos em um só lugar
                                    </p>
                                </div>
                                <Link
                                    href="/documents/upload"
                                    className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Novo Documento
                                </Link>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 text-center max-w-2xl mx-auto">
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-medium text-gray-900">Nenhum documento encontrado</h3>
                                    <p className="text-sm text-gray-500">Você ainda não possui nenhum documento.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen">
            <DashboardLayout activePage="documents" />
            <div className="flex-1 flex flex-col bg-zinc-100">
                <Header />
                <div className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-4xl mx-auto w-full"
                    >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                            <div>
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Todos os Documentos</h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Gerencie todos os seus documentos em um só lugar
                                </p>
                            </div>
                            <Link
                                href="/documents/upload"
                                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Novo Documento
                            </Link>
                        </div>

                        <div className="flex flex-col space-y-3 sm:space-y-4">
                            {documents.map((doc) => (
                                <motion.div
                                    key={doc.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                                >
                                    <Link href={`/documents/${doc.id}`}>
                                        <div className="p-3 sm:p-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                                                <div className="flex items-center space-x-3 sm:space-x-4">
                                                    <div className="p-2 bg-gray-100 rounded-lg">
                                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h2 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                                                            {doc.name}
                                                        </h2>
                                                        <p className="text-xs sm:text-sm text-gray-500">
                                                            {new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span
                                                    className={`inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                                                        doc.signature
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                                >
                                                    {doc.signature ? 'Assinado' : 'Pendente'}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default withAuth(DocumentsPage); 