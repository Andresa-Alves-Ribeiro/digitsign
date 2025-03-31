"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import withAuth from "../../../features/auth/withAuth";
import SignaturePad from "../../../components/signature/SignaturePad";
import { motion } from "framer-motion";

function SignDocumentPage() {
    const router = useRouter();
    const params = useParams();
    
    if (!params?.id) {
        return <div>Documento não encontrado</div>;
    }

    const documentId = params.id as string;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSaveSignature = async (signatureData: string) => {
        if (!signatureData || signatureData.trim() === "") {
            setError("Por favor, desenhe sua assinatura antes de salvar.");
            return;
        }

        if (!signatureData.startsWith('data:image/png;base64,')) {
            console.error("Invalid signature format:", signatureData.substring(0, 50) + "...");
            setError("Formato de assinatura inválido. Tente novamente.");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            console.log("Sending signature data...");
            console.log("Signature data length:", signatureData.length);
            console.log("Signature data preview:", signatureData.substring(0, 100) + "...");
            
            const requestBody = {
                signatureData: signatureData,
            };
            console.log("Request body:", requestBody);

            const response = await fetch(`/api/documents/${documentId}/sign`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();
            console.log("API Response:", data);
            console.log("Response status:", response.status);

            if (!response.ok) {
                throw new Error(data.error || "Erro ao salvar assinatura");
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
        <div className="flex min-h-screen">
            <div className="flex-1 flex flex-col bg-zinc-100">
                <div className="flex-1 px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-4 md:py-6 overflow-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="h-full"
                    >
                        <div>
                            <div className="mb-4 sm:mb-6 md:mb-10">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-green-50 p-2 sm:p-3 rounded-full w-fit">
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Assinar Documento</h1>
                                        <div className="flex flex-wrap items-center space-x-2 mt-1">
                                            <span className="text-sm text-gray-500">ID do Documento:</span>
                                            <span className="text-sm font-medium text-gray-700 bg-green-100 px-2 py-0.5 rounded break-all">{documentId}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full max-w-full">
                                <SignaturePad
                                    onSave={handleSaveSignature}
                                    onCancel={() => router.back()}
                                />
                            </div>

                            {error && (
                                <div className="mt-4 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm break-words">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isSubmitting && (
                                <div className="mt-4 sm:mt-6 flex items-center justify-center space-x-3">
                                    <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-green-500 border-t-transparent"></div>
                                    <span className="text-sm sm:text-base text-gray-600 font-medium">Processando assinatura...</span>
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