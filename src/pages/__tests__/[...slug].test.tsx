import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentStore } from '@/store/useDocumentStore';
import DynamicPage from '../[...slug]';

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

describe('Dynamic Page', () => {
  const mockRouter = {
    push: jest.fn(),
    query: {
      slug: ['documents', '1']
    }
  };

  const mockUseAuth = {
    isAuthenticated: true,
    user: {
      id: '1',
      name: 'Test User',
      email: 'test@example.com'
    }
  };

  const mockDocument = {
    id: '1',
    name: 'Test Document',
    status: 'pending',
    createdAt: new Date().toISOString(),
    fileKey: 'test-file-key',
    userId: '1'
  };

  const mockUseDocumentStore = {
    documents: [mockDocument],
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

  it('should render document details', () => {
    render(<DynamicPage />);

    expect(screen.getByText('Test Document')).toBeInTheDocument();
    expect(screen.getByText(/pendente/i)).toBeInTheDocument();
  });

  it('should show loading state', () => {
    (useDocumentStore as jest.Mock).mockReturnValue({
      ...mockUseDocumentStore,
      loading: true
    });

    render(<DynamicPage />);

    expect(screen.getByTestId('loading-animation')).toBeInTheDocument();
  });

  it('should show error state', () => {
    const errorMessage = 'Failed to load document';
    (useDocumentStore as jest.Mock).mockReturnValue({
      ...mockUseDocumentStore,
      error: new Error(errorMessage)
    });

    render(<DynamicPage />);

    expect(screen.getByText(/erro ao carregar documento/i)).toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      ...mockUseAuth,
      isAuthenticated: false
    });

    render(<DynamicPage />);

    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  it('should handle document not found', () => {
    (useDocumentStore as jest.Mock).mockReturnValue({
      ...mockUseDocumentStore,
      documents: []
    });

    render(<DynamicPage />);

    expect(screen.getByText(/documento não encontrado/i)).toBeInTheDocument();
  });

  it('should render PDF viewer when document is loaded', () => {
    render(<DynamicPage />);

    expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument();
  });

  it('should handle document status changes', async () => {
    render(<DynamicPage />);

    const statusBadge = screen.getByText('pendente');
    expect(statusBadge).toBeInTheDocument();

    // Simular mudança de status
    const updatedDocument = {
      ...mockDocument,
      status: 'signed'
    };

    (useDocumentStore as jest.Mock).mockReturnValue({
      ...mockUseDocumentStore,
      documents: [updatedDocument]
    });

    await waitFor(() => {
      expect(screen.getByText('assinado')).toBeInTheDocument();
    });
  });

  it('should handle different slug patterns', () => {
    const slugPatterns = [
      ['documents', '1'],
      ['documents', 'upload'],
      ['documents', 'new']
    ];

    slugPatterns.forEach(slug => {
      (useRouter as jest.Mock).mockReturnValue({
        ...mockRouter,
        query: { slug }
      });

      const { unmount } = render(<DynamicPage />);
      expect(screen.getByTestId('dynamic-page-container')).toBeInTheDocument();
      unmount();
    });
  });

  it('should render back button', () => {
    render(<DynamicPage />);

    const backButton = screen.getByRole('button', { name: /voltar/i });
    expect(backButton).toBeInTheDocument();
  });

  it('should navigate back when back button is clicked', () => {
    render(<DynamicPage />);

    const backButton = screen.getByRole('button', { name: /voltar/i });
    fireEvent.click(backButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });
}); 