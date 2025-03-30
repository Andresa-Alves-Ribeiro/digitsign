import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DocumentForm from '@/components/documents/DocumentForm';
import { useDocuments } from '@/hooks/useDocuments';

// Mock do hook useDocuments
jest.mock('@/hooks/useDocuments', () => ({
  useDocuments: jest.fn(),
}));

describe('DocumentForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDocuments as jest.Mock).mockReturnValue({
      createDocument: jest.fn(),
      updateDocument: jest.fn(),
      isLoading: false,
      error: null,
    });
  });

  it('renders form fields correctly', () => {
    render(<DocumentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    render(<DocumentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const titleInput = screen.getByLabelText(/título/i);
    const descriptionInput = screen.getByLabelText(/descrição/i);
    const submitButton = screen.getByRole('button', { name: /salvar/i });

    fireEvent.change(titleInput, { target: { value: 'Test Document' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Document',
        description: 'Test Description',
      });
    });
  });

  it('shows validation errors for required fields', async () => {
    render(<DocumentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/título é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/descrição é obrigatória/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('handles cancel button click', () => {
    render(<DocumentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('shows loading state during submission', async () => {
    (useDocuments as jest.Mock).mockReturnValue({
      createDocument: jest.fn(),
      updateDocument: jest.fn(),
      isLoading: true,
      error: null,
    });

    render(<DocumentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const titleInput = screen.getByLabelText(/título/i);
    const descriptionInput = screen.getByLabelText(/descrição/i);
    const submitButton = screen.getByRole('button', { name: /salvar/i });

    fireEvent.change(titleInput, { target: { value: 'Test Document' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/salvando/i)).toBeInTheDocument();
  });

  it('shows error message when submission fails', async () => {
    const error = new Error('Failed to save document');
    (useDocuments as jest.Mock).mockReturnValue({
      createDocument: jest.fn().mockRejectedValue(error),
      updateDocument: jest.fn(),
      isLoading: false,
      error,
    });

    render(<DocumentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const titleInput = screen.getByLabelText(/título/i);
    const descriptionInput = screen.getByLabelText(/descrição/i);
    const submitButton = screen.getByRole('button', { name: /salvar/i });

    fireEvent.change(titleInput, { target: { value: 'Test Document' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/erro ao salvar documento/i)).toBeInTheDocument();
    });
  });

  it('pre-fills form fields when editing existing document', () => {
    const existingDocument = {
      id: '1',
      title: 'Existing Document',
      description: 'Existing Description',
    };

    render(
      <DocumentForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        document={existingDocument}
      />
    );

    expect(screen.getByLabelText(/título/i)).toHaveValue('Existing Document');
    expect(screen.getByLabelText(/descrição/i)).toHaveValue('Existing Description');
  });
}); 