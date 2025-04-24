import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentStore } from '@/store/useDocumentStore';
import Home from '../index';

// Mock dos hooks
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn()
}));

jest.mock('@/store/useDocumentStore', () => ({
  useDocumentStore: jest.fn()
}));

describe('Home Page', () => {
  const mockRouter = {
    push: jest.fn()
  };

  const mockUseAuth = {
    isAuthenticated: true,
    user: {
      id: '1',
      name: 'Test User',
      email: 'test@example.com'
    }
  };

  const mockDocuments = [
    {
      id: '1',
      name: 'Document 1',
      status: 'pending',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Document 2',
      status: 'signed',
      createdAt: new Date().toISOString()
    }
  ];

  const mockUseDocumentStore = {
    documents: mockDocuments,
    setDocuments: jest.fn(),
    loading: false,
    setLoading: jest.fn(),
    error: null,
    setError: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue(mockUseAuth);
    (useDocumentStore as jest.Mock).mockReturnValue(mockUseDocumentStore);
  });

  it('should render dashboard with user info', () => {
    render(<Home />);

    expect(screen.getByText(/bem-vindo/i)).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('should render document statistics', () => {
    render(<Home />);

    expect(screen.getByText(/total de documentos/i)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Total de documentos
    expect(screen.getByText('1')).toBeInTheDocument(); // Documentos pendentes
    expect(screen.getByText('1')).toBeInTheDocument(); // Documentos assinados
  });

  it('should render document list', () => {
    render(<Home />);

    expect(screen.getByText('Document 1')).toBeInTheDocument();
    expect(screen.getByText('Document 2')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    (useDocumentStore as jest.Mock).mockReturnValue({
      ...mockUseDocumentStore,
      loading: true
    });

    render(<Home />);

    expect(screen.getByTestId('loading-animation')).toBeInTheDocument();
  });

  it('should show error state', () => {
    const errorMessage = 'Failed to load documents';
    (useDocumentStore as jest.Mock).mockReturnValue({
      ...mockUseDocumentStore,
      error: new Error(errorMessage)
    });

    render(<Home />);

    expect(screen.getByText(/erro ao carregar documentos/i)).toBeInTheDocument();
  });

  it('should navigate to document details when clicking on a document', () => {
    render(<Home />);

    const documentLink = screen.getByText('Document 1');
    fireEvent.click(documentLink);

    expect(mockRouter.push).toHaveBeenCalledWith('/documents/1');
  });

  it('should render new document button', () => {
    render(<Home />);

    const newDocumentButton = screen.getByRole('button', { name: /novo documento/i });
    expect(newDocumentButton).toBeInTheDocument();
  });

  it('should navigate to upload page when clicking new document button', () => {
    render(<Home />);

    const newDocumentButton = screen.getByRole('button', { name: /novo documento/i });
    fireEvent.click(newDocumentButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/documents/upload');
  });

  it('should redirect to login when not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      ...mockUseAuth,
      isAuthenticated: false
    });

    render(<Home />);

    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  it('should handle document status changes', async () => {
    render(<Home />);

    const statusBadge = screen.getByText('pendente');
    expect(statusBadge).toBeInTheDocument();

    // Simular mudança de status
    const updatedDocuments = [
      {
        ...mockDocuments[0],
        status: 'signed'
      },
      mockDocuments[1]
    ];

    (useDocumentStore as jest.Mock).mockReturnValue({
      ...mockUseDocumentStore,
      documents: updatedDocuments
    });

    await waitFor(() => {
      expect(screen.getByText('assinado')).toBeInTheDocument();
    });
  });
}); 