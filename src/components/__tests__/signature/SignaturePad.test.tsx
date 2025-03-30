import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SignaturePad } from '@/components/signature/SignaturePad'
import toast from 'react-hot-toast'
import { TOAST_CONFIG } from '@/constants/toast'

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  loading: jest.fn(),
  dismiss: jest.fn(),
}))

// Mock react-signature-canvas
const mockClear = jest.fn()
const mockIsEmpty = jest.fn()
const mockToDataURL = jest.fn()

jest.mock('react-signature-canvas', () => {
  return React.forwardRef((props: any, ref) => {
    React.useEffect(() => {
      if (ref) {
        // @ts-ignore
        ref.current = {
          clear: mockClear,
          isEmpty: mockIsEmpty,
          toDataURL: mockToDataURL,
        }
      }
    }, [ref])

    return (
      <canvas
        data-testid="signature-canvas"
        className={props.canvasProps?.className}
        aria-label={props.canvasProps?.['aria-label']}
        onMouseUp={props.onEnd}
      />
    )
  })
})

describe('SignaturePad Component', () => {
  const mockOnSave = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockIsEmpty.mockReturnValue(true)
    mockToDataURL.mockReturnValue('data:image/png;base64,test')
  })

  it('renders correctly', () => {
    render(
      <SignaturePad onSave={mockOnSave} onCancel={mockOnCancel} />
    )

    expect(screen.getByText('Assinatura Digital')).toBeInTheDocument()
    expect(screen.getByText('Use o campo abaixo para desenhar sua assinatura')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Limpar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument()
    expect(screen.getByTestId('signature-canvas')).toBeInTheDocument()
  })

  it('handles cancel action', () => {
    render(
      <SignaturePad onSave={mockOnSave} onCancel={mockOnCancel} />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('shows error when trying to save empty signature', async () => {
    mockIsEmpty.mockReturnValue(true)
    render(
      <SignaturePad onSave={mockOnSave} onCancel={mockOnCancel} />
    )

    const saveButton = screen.getByRole('button', { name: 'Salvar' })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Por favor, desenhe uma assinatura antes de salvar', TOAST_CONFIG)
    })
    expect(mockOnSave).not.toHaveBeenCalled()
  })

  it('handles successful signature save', async () => {
    mockIsEmpty.mockReturnValue(false)
    mockOnSave.mockResolvedValueOnce(undefined)

    render(
      <SignaturePad onSave={mockOnSave} onCancel={mockOnCancel} />
    )

    // Simulate drawing on the canvas
    const canvas = screen.getByTestId('signature-canvas')
    fireEvent.mouseDown(canvas)
    fireEvent.mouseMove(canvas)
    fireEvent.mouseUp(canvas)

    const saveButton = screen.getByRole('button', { name: 'Salvar' })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith('data:image/png;base64,test')
      expect(toast.success).toHaveBeenCalledWith('Assinatura salva com sucesso!', expect.any(Object))
    })
  })

  it('handles error when saving signature', async () => {
    mockIsEmpty.mockReturnValue(false)
    mockOnSave.mockRejectedValueOnce(new Error('Failed to save'))

    render(
      <SignaturePad onSave={mockOnSave} onCancel={mockOnCancel} />
    )

    // Simulate drawing on the canvas
    const canvas = screen.getByTestId('signature-canvas')
    fireEvent.mouseDown(canvas)
    fireEvent.mouseMove(canvas)
    fireEvent.mouseUp(canvas)

    const saveButton = screen.getByRole('button', { name: 'Salvar' })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith('data:image/png;base64,test')
      expect(toast.error).toHaveBeenCalledWith('Erro ao salvar assinatura', expect.any(Object))
    })
  })

  it('disables save button while saving', async () => {
    mockIsEmpty.mockReturnValue(false)
    // Create a promise that we can resolve later
    let resolvePromise: (value: unknown) => void
    const savePromise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    mockOnSave.mockReturnValue(savePromise)

    render(
      <SignaturePad onSave={mockOnSave} onCancel={mockOnCancel} />
    )

    // Simulate drawing on the canvas
    const canvas = screen.getByTestId('signature-canvas')
    fireEvent.mouseDown(canvas)
    fireEvent.mouseMove(canvas)
    fireEvent.mouseUp(canvas)

    const saveButton = screen.getByRole('button', { name: 'Salvar' })
    fireEvent.click(saveButton)

    // Wait for the button to be disabled
    await waitFor(() => {
      expect(saveButton).toBeDisabled()
    })

    // Resolve the save promise
    resolvePromise!(undefined)

    // Verify button is enabled after save completes
    await waitFor(() => {
      expect(saveButton).not.toBeDisabled()
    })
  })

  it('handles clear action', async () => {
    mockIsEmpty.mockReturnValue(true)
    render(
      <SignaturePad onSave={mockOnSave} onCancel={mockOnCancel} />
    )

    const clearButton = screen.getByRole('button', { name: 'Limpar' })
    fireEvent.click(clearButton)

    await waitFor(() => {
      expect(mockClear).toHaveBeenCalled()
    })

    // Try to save after clearing
    const saveButton = screen.getByRole('button', { name: 'Salvar' })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Por favor, desenhe uma assinatura antes de salvar', TOAST_CONFIG)
    })
  })
}) 