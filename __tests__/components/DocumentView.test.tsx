import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DocumentView from '@/components/documents/DocumentView';
import { useDocuments } from '@/hooks/useDocuments';
import { useSignatures } from '@/hooks/useSignatures';

// Mock dos hooks
jest.mock('@/hooks/useDocuments', () => ({
  useDocuments: jest.fn(),
}));

jest.mock('@/hooks/useSignatures', () => ({
  useSignatures: jest.fn(),
}));

describe('DocumentView', () => {
  const mockDocument = {
    id: '1',
    title: 'Test Document',
    description: 'Test Description',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  const mockSignatures = [
    {
      id: '1',
      documentId: '1',
      userId: '1',
      signature: 'data:image/png;base64,...',
      createdAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useDocuments as jest.Mock).mockReturnValue({
      document: mockDocument,
      isLoading: false,
      error: null,
      updateDocument: jest.fn(),
    });
    (useSignatures as jest.Mock).mockReturnValue({
      signatures: mockSignatures,
      isLoading: false,
      error: null,
      createSignature: jest.fn(),
      deleteSignature: jest.fn(),
    });
  });

  it('renders document details correctly', () => {
    render(<DocumentView documentId="1" />);

    expect(screen.getByText('Test Document')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText(/pendente/i)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    (useDocuments as jest.Mock).mockReturnValue({
      document: null,
      isLoading: true,
      error: null,
      updateDocument: jest.fn(),
    });

    render(<DocumentView documentId="1" />);

    expect(screen.getByText(/carregando documento/i)).toBeInTheDocument();
  });

  it('shows error state', () => {
    const error = new Error('Failed to load document');
    (useDocuments as jest.Mock).mockReturnValue({
      document: null,
      isLoading: false,
      error,
      updateDocument: jest.fn(),
    });

    render(<DocumentView documentId="1" />);

    expect(screen.getByText(/erro ao carregar documento/i)).toBeInTheDocument();
  });

  it('handles signature submission', async () => {
    const mockCreateSignature = jest.fn();
    (useSignatures as jest.Mock).mockReturnValue({
      signatures: [],
      isLoading: false,
      error: null,
      createSignature: mockCreateSignature,
      deleteSignature: jest.fn(),
    });

    render(<DocumentView documentId="1" />);

    const signaturePad = screen.getByRole('img', { hidden: true });
    fireEvent.mouseDown(signaturePad);
    fireEvent.mouseMove(signaturePad);
    fireEvent.mouseUp(signaturePad);

    const saveButton = screen.getByRole('button', { name: /salvar assinatura/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockCreateSignature).toHaveBeenCalledWith({
        documentId: '1',
        signature: expect.any(String),
      });
    });
  });

  it('handles signature deletion', async () => {
    const mockDeleteSignature = jest.fn();
    (useSignatures as jest.Mock).mockReturnValue({
      signatures: mockSignatures,
      isLoading: false,
      error: null,
      createSignature: jest.fn(),
      deleteSignature: mockDeleteSignature,
    });

    render(<DocumentView documentId="1" />);

    const deleteButton = screen.getByRole('button', { name: /excluir assinatura/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteSignature).toHaveBeenCalledWith(mockSignatures[0].id);
    });
  });

  it('shows signature preview', () => {
    render(<DocumentView documentId="1" />);

    const signatureImage = screen.getByRole('img', { name: /assinatura/i });
    expect(signatureImage).toHaveAttribute('src', mockSignatures[0].signature);
  });

  it('handles document status update', async () => {
    const mockUpdateDocument = jest.fn();
    (useDocuments as jest.Mock).mockReturnValue({
      document: mockDocument,
      isLoading: false,
      error: null,
      updateDocument: mockUpdateDocument,
    });

    render(<DocumentView documentId="1" />);

    const statusSelect = screen.getByLabelText(/status/i);
    fireEvent.change(statusSelect, { target: { value: 'signed' } });

    await waitFor(() => {
      expect(mockUpdateDocument).toHaveBeenCalledWith({
        ...mockDocument,
        status: 'signed',
      });
    });
  });

  it('disables signature pad when document is signed', () => {
    (useDocuments as jest.Mock).mockReturnValue({
      document: { ...mockDocument, status: 'signed' },
      isLoading: false,
      error: null,
      updateDocument: jest.fn(),
    });

    render(<DocumentView documentId="1" />);

    expect(screen.getByText(/documento já assinado/i)).toBeInTheDocument();
  });
}); 