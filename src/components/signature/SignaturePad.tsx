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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Assine no espaço abaixo</h2>
                
                <div className={`border-2 border-dashed rounded-lg mb-6 transition-colors duration-200 ${
                    isEmpty ? 'border-gray-300 bg-gray-50' : 'border-blue-500 bg-white'
                }`}>
                    <SignatureCanvas
                        ref={sigCanvas}
                        penColor="black"
                        canvasProps={{
                            width: 500,
                            height: 200,
                            className: "w-full h-full bg-white",
                        }}
                        onEnd={() => setIsEmpty(false)}
                        aria-label="Área para assinatura"
                    />
                </div>

                <div className="flex justify-center gap-4">
                    <button 
                        onClick={handleClear}
                        className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 font-medium"
                        aria-label="Limpar assinatura"
                    >
                        Limpar
                    </button>

                    <button 
                        onClick={onCancel}
                        className="px-6 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200 font-medium"
                        aria-label="Cancelar assinatura"
                    >
                        Cancelar
                    </button>

                    <button 
                        onClick={handleSave}
                        disabled={isEmpty || isSaving}
                        className={`px-6 py-2.5 rounded-lg transition-colors duration-200 font-medium ${
                            isEmpty || isSaving
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                        aria-label="Salvar assinatura"
                    >
                        {isSaving ? 'Salvando...' : 'Salvar Assinatura'}
                    </button>
                </div>
            </div>
        </div>
    );
}