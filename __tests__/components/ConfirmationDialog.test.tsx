import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmationDialog from '@/components/ConfirmationDialog';

describe('ConfirmationDialog', () => {
  const mockOnConfirm = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dialog with title and message', () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Test Title"
        message="Test Message"
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('renders with custom confirm button text', () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Test Title"
        message="Test Message"
        confirmText="Custom Confirm"
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByRole('button', { name: /custom confirm/i })).toBeInTheDocument();
  });

  it('renders with custom cancel button text', () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Test Title"
        message="Test Message"
        cancelText="Custom Cancel"
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByRole('button', { name: /custom cancel/i })).toBeInTheDocument();
  });

  it('handles confirm button click', () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Test Title"
        message="Test Message"
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    );

    const confirmButton = screen.getByRole('button', { name: /confirmar/i });
    fireEvent.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('handles close button click', () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Test Title"
        message="Test Message"
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('handles close icon click', () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Test Title"
        message="Test Message"
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    );

    const closeIcon = screen.getByRole('button', { name: /fechar/i });
    fireEvent.click(closeIcon);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not render when isOpen is false', () => {
    render(
      <ConfirmationDialog
        isOpen={false}
        title="Test Title"
        message="Test Message"
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    );

    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Message')).not.toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Test Title"
        message="Test Message"
        className="custom-class"
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    );

    const dialog = screen.getByTestId('dialog-content');
    expect(dialog).toHaveClass('custom-class');
  });

  it('renders with custom icon', () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Test Title"
        message="Test Message"
        icon={<span data-testid="custom-icon">⚠️</span>}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders with custom description', () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Test Title"
        message="Test Message"
        description="Test Description"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByTestId('dialog-description')).toHaveTextContent('Test Description');
  });

  it('disables confirm button when loading', () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Test Title"
        message="Test Message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );

    const confirmButton = screen.getByRole('button', { name: /confirmar/i });
    expect(confirmButton).toBeDisabled();
  });

  it('renders with custom button texts', () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Test Title"
        message="Test Message"
        confirmText="Yes"
        cancelText="No"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByRole('button', { name: /yes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /no/i })).toBeInTheDocument();
  });
}); 