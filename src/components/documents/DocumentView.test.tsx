import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import DocumentView from './DocumentView'
import { useSignatures } from '@/hooks/useSignatures'

// Mock do hook useSignatures
jest.mock('@/hooks/useSignatures', () => ({
  useSignatures: jest.fn(),
}))

describe('DocumentView', () => {
  const mockDocument = {
    id: '1',
    title: 'Test Document',
    content: 'Test Content',
    userId: 'user1',
    createdAt: new Date(),
  }

  const mockSignatures = [
    {
      id: '1',
      documentId: '1',
      userId: 'user1',
      signatureData: 'base64signature1',
      createdAt: new Date(),
    },
    {
      id: '2',
      documentId: '1',
      userId: 'user2',
      signatureData: 'base64signature2',
      createdAt: new Date(),
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders document details correctly', () => {
    ;(useSignatures as jest.Mock).mockReturnValue({
      signatures: [],
      isLoading: false,
      error: null,
    })

    render(<DocumentView document={mockDocument} />)
    
    expect(screen.getByText(mockDocument.title)).toBeInTheDocument()
    expect(screen.getByText(mockDocument.content)).toBeInTheDocument()
    expect(screen.getByText(/assinaturas/i)).toBeInTheDocument()
  })

  it('renders loading state for signatures', () => {
    ;(useSignatures as jest.Mock).mockReturnValue({
      signatures: [],
      isLoading: true,
      error: null,
    })

    render(<DocumentView document={mockDocument} />)
    
    expect(screen.getByText(/carregando assinaturas/i)).toBeInTheDocument()
  })

  it('renders error state for signatures', () => {
    const errorMessage = 'Erro ao carregar assinaturas'
    ;(useSignatures as jest.Mock).mockReturnValue({
      signatures: [],
      isLoading: false,
      error: errorMessage,
    })

    render(<DocumentView document={mockDocument} />)
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('renders signatures list correctly', () => {
    ;(useSignatures as jest.Mock).mockReturnValue({
      signatures: mockSignatures,
      isLoading: false,
      error: null,
    })

    render(<DocumentView document={mockDocument} />)
    
    mockSignatures.forEach(signature => {
      expect(screen.getByAltText(`Assinatura de ${signature.userId}`)).toBeInTheDocument()
    })
  })

  it('handles signature deletion', async () => {
    const mockDeleteSignature = jest.fn()
    ;(useSignatures as jest.Mock).mockReturnValue({
      signatures: mockSignatures,
      isLoading: false,
      error: null,
      deleteSignature: mockDeleteSignature,
    })

    render(<DocumentView document={mockDocument} />)
    
    const deleteButtons = screen.getAllByRole('button', { name: /excluir assinatura/i })
    fireEvent.click(deleteButtons[0])

    await waitFor(() => {
      expect(mockDeleteSignature).toHaveBeenCalledWith(mockSignatures[0].id)
    })
  })

  it('shows confirmation dialog before signature deletion', async () => {
    const mockDeleteSignature = jest.fn()
    ;(useSignatures as jest.Mock).mockReturnValue({
      signatures: mockSignatures,
      isLoading: false,
      error: null,
      deleteSignature: mockDeleteSignature,
    })

    render(<DocumentView document={mockDocument} />)
    
    const deleteButtons = screen.getAllByRole('button', { name: /excluir assinatura/i })
    fireEvent.click(deleteButtons[0])

    expect(screen.getByText(/confirmar exclusão da assinatura/i)).toBeInTheDocument()
    
    const confirmButton = screen.getByRole('button', { name: /confirmar/i })
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(mockDeleteSignature).toHaveBeenCalledWith(mockSignatures[0].id)
    })
  })

  it('cancels signature deletion', () => {
    const mockDeleteSignature = jest.fn()
    ;(useSignatures as jest.Mock).mockReturnValue({
      signatures: mockSignatures,
      isLoading: false,
      error: null,
      deleteSignature: mockDeleteSignature,
    })

    render(<DocumentView document={mockDocument} />)
    
    const deleteButtons = screen.getAllByRole('button', { name: /excluir assinatura/i })
    fireEvent.click(deleteButtons[0])

    expect(screen.getByText(/confirmar exclusão da assinatura/i)).toBeInTheDocument()
    
    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    fireEvent.click(cancelButton)

    expect(mockDeleteSignature).not.toHaveBeenCalled()
  })

  it('handles signature deletion error', async () => {
    const errorMessage = 'Erro ao excluir assinatura'
    const mockDeleteSignature = jest.fn().mockRejectedValueOnce(new Error(errorMessage))
    ;(useSignatures as jest.Mock).mockReturnValue({
      signatures: mockSignatures,
      isLoading: false,
      error: null,
      deleteSignature: mockDeleteSignature,
    })

    render(<DocumentView document={mockDocument} />)
    
    const deleteButtons = screen.getAllByRole('button', { name: /excluir assinatura/i })
    fireEvent.click(deleteButtons[0])

    expect(screen.getByText(/confirmar exclusão da assinatura/i)).toBeInTheDocument()
    
    const confirmButton = screen.getByRole('button', { name: /confirmar/i })
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })
}) 