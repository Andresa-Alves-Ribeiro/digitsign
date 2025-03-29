"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import withAuth from "../../../features/auth/withAuth";
import SignaturePad from "../../../components/signature/SignaturePad";

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
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex-1 container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Assinar Documento</h1>
                            <p className="text-sm text-gray-500 mt-1">Documento ID: {documentId}</p>
                        </div>
                        <button
                            onClick={() => router.back()}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Voltar
                        </button>
                    </div>

                    <div className="max-w-2xl mx-auto">
                        <p className="text-gray-600 mb-6">
                            Por favor, desenhe sua assinatura no campo abaixo e clique em "Salvar Assinatura"
                            para finalizar o processo.
                        </p>

                        <SignaturePad
                            onSave={handleSaveSignature}
                            onCancel={() => router.back()}
                        />

                        {error && (
                            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}

                        {isSubmitting && (
                            <div className="mt-4 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                <span className="ml-2 text-gray-600">Salvando assinatura...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withAuth(SignDocumentPage);