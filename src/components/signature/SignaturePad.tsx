"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

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
            alert("Por favor, desenhe sua assinatura antes de salvar");
            return;
        }
        setIsSaving(true);
        try {
            const signatureData = sigCanvas.current?.toDataURL() ?? "";
            onSave(signatureData);
        } finally {
            setIsSaving(false);
        }
    };

    return (
            <div className="bg-white w-4xl flex flex-col shadow-lg items-center rounded-xl p-8 mx-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Assinatura Digital</h3>
                <p className="text-gray-600 text-center mb-8">Use o campo abaixo para desenhar sua assinatura</p>
                
                <div className={`border-2 border-dashed rounded-xl mb-8 transition-all duration-200 w-full ${
                    isEmpty ? 'border-gray-300 bg-gray-50' : 'border-blue-500 bg-white shadow-sm'
                }`}>
                    <SignatureCanvas
                        ref={sigCanvas}
                        penColor="black"
                        canvasProps={{
                            width: 500,
                            height: 200,
                            className: "w-full h-full bg-white rounded-xl",
                        }}
                        onEnd={() => setIsEmpty(false)}
                        aria-label="Área para assinatura"
                    />
                </div>

                <div className="flex justify-center gap-4 w-full">
                    <button 
                        onClick={handleClear}
                        className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                        aria-label="Limpar assinatura"
                    >
                        Limpar
                    </button>

                    <button 
                        onClick={onCancel}
                        className="flex-1 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                        aria-label="Cancelar assinatura"
                    >
                        Cancelar
                    </button>

                    <button 
                        onClick={handleSave}
                        disabled={isEmpty || isSaving}
                        className={`flex-1 px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md ${
                            isEmpty || isSaving
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                        aria-label="Salvar assinatura"
                    >
                        {isSaving ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </div>
    );
}