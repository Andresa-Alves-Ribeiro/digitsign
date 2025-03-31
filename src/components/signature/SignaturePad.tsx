"use client";

import { useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import toast from 'react-hot-toast'

interface SignaturePadProps {
  onSave: (signature: string) => Promise<void>
  onCancel: () => void
}

interface ExtendedCanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  'data-testid'?: string
}

const SignaturePad = ({ onSave, onCancel }: SignaturePadProps) => {
  const signatureRef = useRef<SignatureCanvas>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear()
      setHasDrawn(false)
    }
  }

  const handleDraw = () => {
    setHasDrawn(true)
  }

  const handleSave = async () => {
    if (!signatureRef.current) return

    if (!hasDrawn || signatureRef.current.isEmpty()) {
      toast.error('Por favor, desenhe uma assinatura antes de salvar')
      return
    }

    try {
      setIsSaving(true)
      const signature = signatureRef.current.toDataURL()
      await onSave(signature)
      toast.success('Assinatura salva com sucesso!')
    } catch (err) {
      console.error('Erro ao salvar assinatura:', err)
      toast.error('Erro ao salvar assinatura')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">Assinatura Digital</h2>
      <p className="text-gray-600 mb-4">Use o campo abaixo para desenhar sua assinatura</p>
      
      <div className="w-full border border-gray-300 rounded-lg mb-4">
        <SignatureCanvas
          ref={signatureRef}
          canvasProps={{
            className: 'w-full h-40',
            'data-testid': 'signature-canvas',
            'aria-label': 'Área para assinatura'
          } as ExtendedCanvasProps}
          onEnd={handleDraw}
        />
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleClear}
          disabled={isSaving}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Limpar
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </div>
  )
}

export default SignaturePad;