"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import withAuth from "../../../features/auth/withAuth";
import SignaturePad from "../../../components/signature/SignaturePad";
import DashboardLayout from "../../../layouts/DashboardLayout";
import Header from "../../../layouts/Header";
import { motion } from "framer-motion";

function SignDocumentPage() {
    const router = useRouter();
    const params = useParams();
    const documentId = params.id as string;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSaveSignature = async (signatureData: string) => {
        if (!signatureData) {
            setError("Por favor, desenhe sua assinatura antes de salvar.");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            const response = await fetch(`/api/documents/${documentId}/sign`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    signatureImg: signatureData,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao salvar assinatura");
            }

            router.push(`/documents/${documentId}`);
        } catch (error) {
            console.error("Error saving signature:", error);
            setError(error instanceof Error ? error.message : "Erro ao salvar assinatura. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        className="h-full"
                    >
                        <div>
                            <div className="mb-10">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-green-50 p-3 rounded-full">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">Assinar Documento</h1>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className="text-sm text-gray-500">ID do Documento:</span>
                                            <span className="text-sm font-medium text-gray-700 bg-green-100 px-2 py-0.5 rounded">{documentId}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <SignaturePad
                                onSave={handleSaveSignature}
                                onCancel={() => router.back()}
                            />

                            {error && (
                                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isSubmitting && (
                                <div className="mt-6 flex items-center justify-center space-x-3">
                                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                                    <span className="text-gray-600 font-medium">Processando assinatura...</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default withAuth(SignDocumentPage);