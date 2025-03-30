"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { commonStyles } from "@/constants/styles";
import { toast } from "react-hot-toast";

interface SignaturePadProps {
    onSave: (signatureData: string) => void;
    onCancel: () => void;
}

export default function SignaturePad({ onSave, onCancel }: SignaturePadProps) {
    const sigCanvas = useRef<SignatureCanvas>(null);
    const [isEmpty, setIsEmpty] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const handleClear = () => {
        sigCanvas.current?.clear();
        setIsEmpty(true);
    };

    const handleSave = async () => {
        if (isEmpty) {
            toast.error("Por favor, desenhe sua assinatura antes de salvar");
            return;
        }
        setIsSaving(true);
        try {
            if (!sigCanvas.current) {
                throw new Error("Canvas não inicializado");
            }

            const signatureData = sigCanvas.current.toDataURL('image/png');
            if (!signatureData) {
                throw new Error("Não foi possível gerar a assinatura");
            }

            // Verifica se a assinatura tem conteúdo (não é apenas um canvas vazio)
            const img = new Image();
            img.src = signatureData;
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            onSave(signatureData);
        } catch (error) {
            console.error("Error saving signature:", error);
            toast.error("Erro ao processar a assinatura. Tente novamente.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white w-full max-w-4xl flex flex-col shadow-lg items-center rounded-xl p-4 sm:p-6 md:p-8 mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 md:mb-8 text-center">Assinatura Digital</h3>
            <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 md:mb-8">Use o campo abaixo para desenhar sua assinatura</p>
            
            <div className={`border-2 border-dashed rounded-xl mb-4 sm:mb-6 md:mb-8 transition-all duration-200 w-full ${
                isEmpty ? 'border-gray-300 bg-gray-50' : 'border-blue-500 bg-white shadow-sm'
            }`}>
                <SignatureCanvas
                    ref={sigCanvas}
                    penColor="black"
                    canvasProps={{
                        width: 500,
                        height: 200,
                        className: "w-full h-[150px] sm:h-[180px] md:h-[200px] bg-white rounded-xl",
                    }}
                    onEnd={() => setIsEmpty(false)}
                    aria-label="Área para assinatura"
                />
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 w-full">
                <button 
                    onClick={handleClear}
                    className={`${commonStyles.button.clear} w-full sm:w-auto`}
                    aria-label="Limpar assinatura"
                >
                    Limpar
                </button>

                <button 
                    onClick={onCancel}
                    className={`${commonStyles.button.cancel} w-full sm:w-auto`}
                    aria-label="Cancelar assinatura"
                >
                    Cancelar
                </button>

                <button 
                    onClick={handleSave}
                    disabled={isEmpty || isSaving}
                    className={`${commonStyles.button.save} w-full sm:w-auto`}
                    aria-label="Salvar assinatura"
                >
                    {isSaving ? 'Salvando...' : 'Salvar'}
                </button>
            </div>
        </div>
    );
}