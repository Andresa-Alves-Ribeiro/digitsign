import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import DocumentList from './DocumentList'
import { useDocuments } from '@/hooks/useDocuments'

// Mock do hook useDocuments
jest.mock('@/hooks/useDocuments', () => ({
  useDocuments: jest.fn(),
}))

describe('DocumentList', () => {
  const mockDocuments = [
    {
      id: '1',
      title: 'Document 1',
      content: 'Content 1',
      userId: 'user1',
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Document 2',
      content: 'Content 2',
      userId: 'user1',
      createdAt: new Date(),
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state correctly', () => {
    ;(useDocuments as jest.Mock).mockReturnValue({
      documents: [],
      isLoading: true,
      error: null,
    })

    render(<DocumentList />)
    
    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
  })

  it('renders error state correctly', () => {
    const errorMessage = 'Erro ao carregar documentos'
    ;(useDocuments as jest.Mock).mockReturnValue({
      documents: [],
      isLoading: false,
      error: errorMessage,
    })

    render(<DocumentList />)
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('renders empty state correctly', () => {
    ;(useDocuments as jest.Mock).mockReturnValue({
      documents: [],
      isLoading: false,
      error: null,
    })

    render(<DocumentList />)
    
    expect(screen.getByText(/nenhum documento encontrado/i)).toBeInTheDocument()
  })

  it('renders documents list correctly', () => {
    ;(useDocuments as jest.Mock).mockReturnValue({
      documents: mockDocuments,
      isLoading: false,
      error: null,
    })

    render(<DocumentList />)
    
    mockDocuments.forEach(doc => {
      expect(screen.getByText(doc.title)).toBeInTheDocument()
      expect(screen.getByText(doc.content)).toBeInTheDocument()
    })
  })

  it('handles document selection', () => {
    const mockOnSelect = jest.fn()
    ;(useDocuments as jest.Mock).mockReturnValue({
      documents: mockDocuments,
      isLoading: false,
      error: null,
    })

    render(<DocumentList onSelect={mockOnSelect} />)
    
    const firstDocument = screen.getByText(mockDocuments[0].title)
    fireEvent.click(firstDocument)

    expect(mockOnSelect).toHaveBeenCalledWith(mockDocuments[0])
  })

  it('handles document deletion', async () => {
    const mockDeleteDocument = jest.fn()
    ;(useDocuments as jest.Mock).mockReturnValue({
      documents: mockDocuments,
      isLoading: false,
      error: null,
      deleteDocument: mockDeleteDocument,
    })

    render(<DocumentList />)
    
    const deleteButtons = screen.getAllByRole('button', { name: /excluir/i })
    fireEvent.click(deleteButtons[0])

    await waitFor(() => {
      expect(mockDeleteDocument).toHaveBeenCalledWith(mockDocuments[0].id)
    })
  })

  it('shows confirmation dialog before deletion', async () => {
    const mockDeleteDocument = jest.fn()
    ;(useDocuments as jest.Mock).mockReturnValue({
      documents: mockDocuments,
      isLoading: false,
      error: null,
      deleteDocument: mockDeleteDocument,
    })

    render(<DocumentList />)
    
    const deleteButtons = screen.getAllByRole('button', { name: /excluir/i })
    fireEvent.click(deleteButtons[0])

    expect(screen.getByText(/confirmar exclusão/i)).toBeInTheDocument()
    
    const confirmButton = screen.getByRole('button', { name: /confirmar/i })
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(mockDeleteDocument).toHaveBeenCalledWith(mockDocuments[0].id)
    })
  })

  it('cancels document deletion', () => {
    const mockDeleteDocument = jest.fn()
    ;(useDocuments as jest.Mock).mockReturnValue({
      documents: mockDocuments,
      isLoading: false,
      error: null,
      deleteDocument: mockDeleteDocument,
    })

    render(<DocumentList />)
    
    const deleteButtons = screen.getAllByRole('button', { name: /excluir/i })
    fireEvent.click(deleteButtons[0])

    expect(screen.getByText(/confirmar exclusão/i)).toBeInTheDocument()
    
    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    fireEvent.click(cancelButton)

    expect(mockDeleteDocument).not.toHaveBeenCalled()
  })
}) 