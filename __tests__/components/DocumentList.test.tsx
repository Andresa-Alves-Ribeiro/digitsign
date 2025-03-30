import { render, screen, fireEvent } from '@testing-library/react';
import DocumentList from '@/components/documents/DocumentList';
import { useDocuments } from '@/hooks/useDocuments';

// Mock do hook useDocuments
jest.mock('@/hooks/useDocuments', () => ({
  useDocuments: jest.fn(),
}));

describe('DocumentList', () => {
  const mockDocuments = [
    {
      id: '1',
      title: 'Test Document 1',
      description: 'Test Description 1',
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Test Document 2',
      description: 'Test Description 2',
      status: 'signed',
      createdAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    (useDocuments as jest.Mock).mockReturnValue({
      documents: mockDocuments,
      isLoading: false,
      error: null,
      deleteDocument: jest.fn(),
    });
  });

  it('renders document list correctly', () => {
    render(<DocumentList />);

    expect(screen.getByText('Test Document 1')).toBeInTheDocument();
    expect(screen.getByText('Test Document 2')).toBeInTheDocument();
    expect(screen.getByText('Test Description 1')).toBeInTheDocument();
    expect(screen.getByText('Test Description 2')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    (useDocuments as jest.Mock).mockReturnValue({
      documents: [],
      isLoading: true,
      error: null,
      deleteDocument: jest.fn(),
    });

    render(<DocumentList />);
    expect(screen.getByText('Carregando documentos...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    const errorMessage = 'Erro ao carregar documentos';
    (useDocuments as jest.Mock).mockReturnValue({
      documents: [],
      isLoading: false,
      error: new Error(errorMessage),
      deleteDocument: jest.fn(),
    });

    render(<DocumentList />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('handles document deletion', () => {
    const deleteDocument = jest.fn();
    (useDocuments as jest.Mock).mockReturnValue({
      documents: mockDocuments,
      isLoading: false,
      error: null,
      deleteDocument,
    });

    render(<DocumentList />);

    const deleteButtons = screen.getAllByRole('button', { name: /excluir/i });
    fireEvent.click(deleteButtons[0]);

    expect(deleteDocument).toHaveBeenCalledWith(mockDocuments[0].id);
  });
}); 