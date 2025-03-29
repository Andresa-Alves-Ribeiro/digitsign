import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import withAuth from "@/features/auth/withAuth";
import DashboardLayout from "@/layouts/DashboardLayout";
import Header from "@/layouts/Header";
import { motion } from "framer-motion";
import DocumentList from "@/features/documents/DocumentList";
import { useDocumentStore } from "@/store/useDocumentStore";

function DocumentsPage() {
    const { documents } = useDocumentStore();
    
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
                        className="w-full h-full"
                    >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div>
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Todos os Documentos</h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Gerencie todos os seus documentos em um só lugar
                                </p>
                            </div>
                            {documents && documents.length > 0 && (
                                <Link
                                    href="/documents/upload"
                                    className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Novo Documento
                                </Link>
                            )}
                        </div>

                        <DocumentList />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default withAuth(DocumentsPage); 