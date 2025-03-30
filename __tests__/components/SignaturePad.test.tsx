import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignaturePad from '@/components/signature/SignaturePad';
import { toast } from 'react-hot-toast';

// Mock react-signature-canvas
jest.mock('react-signature-canvas', () => {
  const MockSignatureCanvas = () => <canvas data-testid="signature-canvas" />;
  MockSignatureCanvas.prototype.clear = jest.fn();
  MockSignatureCanvas.prototype.toDataURL = jest.fn().mockReturnValue('data:image/png;base64,test');
  MockSignatureCanvas.prototype.isEmpty = jest.fn().mockReturnValue(false);
  return MockSignatureCanvas;
});

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
}));

describe('SignaturePad', () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders signature pad with title and canvas', () => {
    render(<SignaturePad onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    expect(screen.getByText('Assinatura Digital')).toBeInTheDocument();
    expect(screen.getByText('Use o campo abaixo para desenhar sua assinatura')).toBeInTheDocument();
    expect(screen.getByTestId('signature-canvas')).toBeInTheDocument();
  });

  it('handles clear button click', () => {
    render(<SignaturePad onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    const clearButton = screen.getByRole('button', { name: 'Limpar assinatura' });
    fireEvent.click(clearButton);
    
    // Save button should be disabled after clearing
    expect(screen.getByRole('button', { name: 'Salvar assinatura' })).toBeDisabled();
  });

  it('handles cancel button click', () => {
    render(<SignaturePad onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    const cancelButton = screen.getByRole('button', { name: 'Cancelar assinatura' });
    fireEvent.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('handles save button click with valid signature', async () => {
    render(<SignaturePad onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    // Simulate drawing on canvas
    const canvas = screen.getByTestId('signature-canvas');
    fireEvent.mouseDown(canvas);
    fireEvent.mouseMove(canvas);
    fireEvent.mouseUp(canvas);

    // Click save button
    const saveButton = screen.getByRole('button', { name: 'Salvar assinatura' });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith('data:image/png;base64,test');
    });
  });

  it('shows error when trying to save empty signature', () => {
    render(<SignaturePad onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    const saveButton = screen.getByRole('button', { name: 'Salvar assinatura' });
    expect(saveButton).toBeDisabled();

    // Try to save without drawing
    fireEvent.click(saveButton);

    expect(toast.error).not.toHaveBeenCalled();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('shows loading state while saving', async () => {
    render(<SignaturePad onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    // Simulate drawing
    const canvas = screen.getByTestId('signature-canvas');
    fireEvent.mouseDown(canvas);
    fireEvent.mouseMove(canvas);
    fireEvent.mouseUp(canvas);

    // Click save and check for loading state
    const saveButton = screen.getByRole('button', { name: 'Salvar assinatura' });
    fireEvent.click(saveButton);

    expect(screen.getByText('Salvando...')).toBeInTheDocument();
  });
}); 