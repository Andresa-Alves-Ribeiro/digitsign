import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SignDocumentHeader from '@/components/documents/SignDocumentHeader';
import { useRouter } from 'next/router';

// Mock do useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('SignDocumentHeader', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
  };

  const mockDocument = {
    id: '1',
    name: 'Test Document',
    status: 'pending',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
    userId: 'user1',
  };

  const mockOnSign = jest.fn();
  const mockOnCancel = jest.fn();
  const mockOnBack = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.clearAllMocks();
  });

  it('renders document name', () => {
    render(
      <SignDocumentHeader
        document={mockDocument}
        onSign={mockOnSign}
        onCancel={mockOnCancel}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText('Test Document')).toBeInTheDocument();
  });

  it('renders document status', () => {
    render(
      <SignDocumentHeader
        document={mockDocument}
        onSign={mockOnSign}
        onCancel={mockOnCancel}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText('Status: Pending')).toBeInTheDocument();
  });

  it('renders sign button when document is pending', () => {
    render(
      <SignDocumentHeader
        document={mockDocument}
        onSign={mockOnSign}
        onCancel={mockOnCancel}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText('Sign Document')).toBeInTheDocument();
  });

  it('renders cancel button when document is pending', () => {
    render(
      <SignDocumentHeader
        document={mockDocument}
        onSign={mockOnSign}
        onCancel={mockOnCancel}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('does not render sign button when document is signed', () => {
    const signedDocument = {
      ...mockDocument,
      status: 'signed',
    };

    render(
      <SignDocumentHeader
        document={signedDocument}
        onSign={mockOnSign}
        onCancel={mockOnCancel}
        onBack={mockOnBack}
      />
    );

    expect(screen.queryByText('Sign Document')).not.toBeInTheDocument();
  });

  it('does not render cancel button when document is signed', () => {
    const signedDocument = {
      ...mockDocument,
      status: 'signed',
    };

    render(
      <SignDocumentHeader
        document={signedDocument}
        onSign={mockOnSign}
        onCancel={mockOnCancel}
        onBack={mockOnBack}
      />
    );

    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  it('calls onSign when sign button is clicked', () => {
    render(
      <SignDocumentHeader
        document={mockDocument}
        onSign={mockOnSign}
        onCancel={mockOnCancel}
        onBack={mockOnBack}
      />
    );

    fireEvent.click(screen.getByText('Sign Document'));
    expect(mockOnSign).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <SignDocumentHeader
        document={mockDocument}
        onSign={mockOnSign}
        onCancel={mockOnCancel}
        onBack={mockOnBack}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onBack when back button is clicked', () => {
    render(
      <SignDocumentHeader
        document={mockDocument}
        onSign={mockOnSign}
        onCancel={mockOnCancel}
        onBack={mockOnBack}
      />
    );

    fireEvent.click(screen.getByText('Back'));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('renders document creation date', () => {
    render(
      <SignDocumentHeader
        document={mockDocument}
        onSign={mockOnSign}
        onCancel={mockOnCancel}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText(/Created: Jan 1, 2024/i)).toBeInTheDocument();
  });

  it('renders document update date', () => {
    render(
      <SignDocumentHeader
        document={mockDocument}
        onSign={mockOnSign}
        onCancel={mockOnCancel}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText(/Last Updated: Jan 2, 2024/i)).toBeInTheDocument();
  });

  it('renders with custom class', () => {
    render(
      <SignDocumentHeader
        document={mockDocument}
        onSign={mockOnSign}
        onCancel={mockOnCancel}
        onBack={mockOnBack}
        className="custom-class"
      />
    );

    expect(screen.getByTestId('sign-document-header')).toHaveClass('custom-class');
  });

  it('should render sign document header with loading state', () => {
    render(<SignDocumentHeader document={mockDocument} isLoading={true} />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should render sign document header with error state', () => {
    render(<SignDocumentHeader document={mockDocument} error="Erro ao carregar documento" />);
    
    expect(screen.getByText('Erro ao carregar documento')).toBeInTheDocument();
  });

  it('should render sign document header with document status', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    
    expect(screen.getByText('PENDING')).toBeInTheDocument();
  });

  it('should render sign document header with document creation date', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    
    expect(screen.getByText('Criado em: 01/01/2024 10:00')).toBeInTheDocument();
  });

  it('should render sign document header with document update date', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    
    expect(screen.getByText('Atualizado em: 02/01/2024 10:00')).toBeInTheDocument();
  });

  it('should render sign document header with document file size', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    
    expect(screen.getByText('1 KB')).toBeInTheDocument();
  });

  it('should render sign document header with document file type', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    
    expect(screen.getByText('PDF')).toBeInTheDocument();
  });

  it('should render sign document header with document file url', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com/document.pdf');
  });

  it('should render sign document header with document user id', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    
    expect(screen.getByText('Usuário: user1')).toBeInTheDocument();
  });

  it('should render sign document header with sign button', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    
    expect(screen.getByText('Assinar')).toBeInTheDocument();
  });

  it('should render sign document header with reject button', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    
    expect(screen.getByText('Rejeitar')).toBeInTheDocument();
  });

  it('should render sign document header with back button', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    
    expect(screen.getByText('Voltar')).toBeInTheDocument();
  });

  it('should navigate back when clicking back button', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    
    fireEvent.click(screen.getByText('Voltar'));
    expect(mockRouter.back).toHaveBeenCalled();
  });

  it('should call onSign when clicking sign button', () => {
    const onSign = jest.fn();
    render(<SignDocumentHeader document={mockDocument} onSign={onSign} />);
    
    fireEvent.click(screen.getByText('Assinar'));
    expect(onSign).toHaveBeenCalled();
  });

  it('should call onReject when clicking reject button', () => {
    const onReject = jest.fn();
    render(<SignDocumentHeader document={mockDocument} onReject={onReject} />);
    
    fireEvent.click(screen.getByText('Rejeitar'));
    expect(onReject).toHaveBeenCalled();
  });

  it('should render sign document header with custom sign button text', () => {
    render(<SignDocumentHeader document={mockDocument} signButtonText="Confirmar" />);
    
    expect(screen.getByText('Confirmar')).toBeInTheDocument();
  });

  it('should render sign document header with custom reject button text', () => {
    render(<SignDocumentHeader document={mockDocument} rejectButtonText="Cancelar" />);
    
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('should render sign document header with custom back button text', () => {
    render(<SignDocumentHeader document={mockDocument} backButtonText="Retornar" />);
    
    expect(screen.getByText('Retornar')).toBeInTheDocument();
  });

  it('should render sign document header with custom sign button class', () => {
    render(<SignDocumentHeader document={mockDocument} signButtonClassName="custom-sign-button" />);
    
    const signButton = screen.getByText('Assinar');
    expect(signButton).toHaveClass('custom-sign-button');
  });

  it('should render sign document header with custom reject button class', () => {
    render(<SignDocumentHeader document={mockDocument} rejectButtonClassName="custom-reject-button" />);
    
    const rejectButton = screen.getByText('Rejeitar');
    expect(rejectButton).toHaveClass('custom-reject-button');
  });

  it('should render sign document header with custom back button class', () => {
    render(<SignDocumentHeader document={mockDocument} backButtonClassName="custom-back-button" />);
    
    const backButton = screen.getByText('Voltar');
    expect(backButton).toHaveClass('custom-back-button');
  });

  it('should render sign document header with custom sign button color', () => {
    render(<SignDocumentHeader document={mockDocument} signButtonColor="text-blue-500" />);
    
    const signButton = screen.getByText('Assinar');
    expect(signButton).toHaveClass('text-blue-500');
  });

  it('should render sign document header with custom reject button color', () => {
    render(<SignDocumentHeader document={mockDocument} rejectButtonColor="text-red-500" />);
    
    const rejectButton = screen.getByText('Rejeitar');
    expect(rejectButton).toHaveClass('text-red-500');
  });

  it('should render sign document header with custom back button color', () => {
    render(<SignDocumentHeader document={mockDocument} backButtonColor="text-neutral-500" />);
    
    const backButton = screen.getByText('Voltar');
    expect(backButton).toHaveClass('text-neutral-500');
  });

  it('should render sign document header with custom sign button size', () => {
    render(<SignDocumentHeader document={mockDocument} signButtonSize="text-lg" />);
    
    const signButton = screen.getByText('Assinar');
    expect(signButton).toHaveClass('text-lg');
  });

  it('should render sign document header with custom reject button size', () => {
    render(<SignDocumentHeader document={mockDocument} rejectButtonSize="text-lg" />);
    
    const rejectButton = screen.getByText('Rejeitar');
    expect(rejectButton).toHaveClass('text-lg');
  });

  it('should render sign document header with custom back button size', () => {
    render(<SignDocumentHeader document={mockDocument} backButtonSize="text-lg" />);
    
    const backButton = screen.getByText('Voltar');
    expect(backButton).toHaveClass('text-lg');
  });

  it('should render sign document header with custom sign button weight', () => {
    render(<SignDocumentHeader document={mockDocument} signButtonWeight="font-bold" />);
    
    const signButton = screen.getByText('Assinar');
    expect(signButton).toHaveClass('font-bold');
  });

  it('should render sign document header with custom reject button weight', () => {
    render(<SignDocumentHeader document={mockDocument} rejectButtonWeight="font-bold" />);
    
    const rejectButton = screen.getByText('Rejeitar');
    expect(rejectButton).toHaveClass('font-bold');
  });

  it('should render sign document header with custom back button weight', () => {
    render(<SignDocumentHeader document={mockDocument} backButtonWeight="font-bold" />);
    
    const backButton = screen.getByText('Voltar');
    expect(backButton).toHaveClass('font-bold');
  });

  it('should render sign document header with custom sign button alignment', () => {
    render(<SignDocumentHeader document={mockDocument} signButtonAlign="text-center" />);
    
    const signButton = screen.getByText('Assinar');
    expect(signButton).toHaveClass('text-center');
  });

  it('should render sign document header with custom reject button alignment', () => {
    render(<SignDocumentHeader document={mockDocument} rejectButtonAlign="text-center" />);
    
    const rejectButton = screen.getByText('Rejeitar');
    expect(rejectButton).toHaveClass('text-center');
  });

  it('should render sign document header with custom back button alignment', () => {
    render(<SignDocumentHeader document={mockDocument} backButtonAlign="text-center" />);
    
    const backButton = screen.getByText('Voltar');
    expect(backButton).toHaveClass('text-center');
  });

  it('should render sign document header with custom sign button margin', () => {
    render(<SignDocumentHeader document={mockDocument} signButtonMargin="mt-4" />);
    
    const signButton = screen.getByText('Assinar');
    expect(signButton).toHaveClass('mt-4');
  });

  it('should render sign document header with custom reject button margin', () => {
    render(<SignDocumentHeader document={mockDocument} rejectButtonMargin="mt-4" />);
    
    const rejectButton = screen.getByText('Rejeitar');
    expect(rejectButton).toHaveClass('mt-4');
  });

  it('should render sign document header with custom back button margin', () => {
    render(<SignDocumentHeader document={mockDocument} backButtonMargin="mt-4" />);
    
    const backButton = screen.getByText('Voltar');
    expect(backButton).toHaveClass('mt-4');
  });

  it('should render sign document header with custom actions', () => {
    const customAction = jest.fn();
    render(
      <SignDocumentHeader
        document={mockDocument}
        actions={
          <button onClick={customAction}>Custom Action</button>
        }
      />
    );
    const actionButton = screen.getByText('Custom Action');
    fireEvent.click(actionButton);
    expect(customAction).toHaveBeenCalled();
  });

  it('should render sign document header with default actions when no custom actions provided', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  it('should render sign document header with custom status colors', () => {
    render(
      <SignDocumentHeader
        document={mockDocument}
        statusColors={{
          PENDING: 'bg-yellow-100 text-yellow-800',
        }}
      />
    );
    const statusBadge = screen.getByText('PENDING');
    expect(statusBadge).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });

  it('should render sign document header with custom date format', () => {
    render(
      <SignDocumentHeader
        document={mockDocument}
        dateFormat="dd/MM/yyyy"
      />
    );
    expect(screen.getByText('01/01/2024')).toBeInTheDocument();
    expect(screen.getByText('02/01/2024')).toBeInTheDocument();
  });

  it('renders back button', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    const backButton = screen.getByRole('button', { name: /back/i });
    expect(backButton).toBeInTheDocument();
  });

  it('navigates back when back button is clicked', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);
    expect(mockRouter.back).toHaveBeenCalled();
  });

  it('renders with custom class', () => {
    render(<SignDocumentHeader document={mockDocument} className="custom-class" />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('custom-class');
  });

  it('renders with default class when no custom class provided', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-white', 'shadow');
  });

  it('renders with custom title class', () => {
    render(<SignDocumentHeader document={mockDocument} titleClass="custom-title-class" />);
    const title = screen.getByText('Test Document');
    expect(title).toHaveClass('custom-title-class');
  });

  it('renders with default title class when no custom title class provided', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    const title = screen.getByText('Test Document');
    expect(title).toHaveClass('text-2xl', 'font-bold', 'text-neutral-900');
  });

  it('renders with custom status class', () => {
    render(<SignDocumentHeader document={mockDocument} statusClass="custom-status-class" />);
    const status = screen.getByText('PENDING');
    expect(status).toHaveClass('custom-status-class');
  });

  it('renders with default status class when no custom status class provided', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    const status = screen.getByText('PENDING');
    expect(status).toHaveClass('text-sm', 'font-medium', 'text-neutral-500');
  });

  it('renders with custom back button class', () => {
    render(<SignDocumentHeader document={mockDocument} backButtonClass="custom-back-button-class" />);
    const backButton = screen.getByRole('button', { name: /back/i });
    expect(backButton).toHaveClass('custom-back-button-class');
  });

  it('renders with default back button class when no custom back button class provided', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    const backButton = screen.getByRole('button', { name: /back/i });
    expect(backButton).toHaveClass('text-neutral-500', 'hover:text-neutral-700');
  });

  it('renders with custom back button text', () => {
    render(<SignDocumentHeader document={mockDocument} backButtonText="Go Back" />);
    expect(screen.getByText('Go Back')).toBeInTheDocument();
  });

  it('renders with default back button text when no custom back button text provided', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('renders with custom back button icon', () => {
    render(<SignDocumentHeader document={mockDocument} backButtonIcon={<span>←</span>} />);
    expect(screen.getByText('←')).toBeInTheDocument();
  });

  it('renders with default back button icon when no custom back button icon provided', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    expect(screen.getByTestId('back-icon')).toBeInTheDocument();
  });

  it('renders the sign document header with document name', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    expect(screen.getByText('Test Document')).toBeInTheDocument();
  });

  it('renders the sign document header with document status', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    expect(screen.getByText('PENDING')).toBeInTheDocument();
  });

  it('renders the sign document header with document creation date', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    expect(screen.getByText('Created:')).toBeInTheDocument();
    expect(screen.getByText('Jan 1, 2024')).toBeInTheDocument();
  });

  it('renders the sign document header with document update date', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    expect(screen.getByText('Updated:')).toBeInTheDocument();
    expect(screen.getByText('Jan 2, 2024')).toBeInTheDocument();
  });

  it('renders the sign document header with custom class', () => {
    render(<SignDocumentHeader document={mockDocument} className="custom-class" />);
    expect(screen.getByTestId('sign-document-header')).toHaveClass('custom-class');
  });

  it('renders the sign document header with default class', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    expect(screen.getByTestId('sign-document-header')).toHaveClass('bg-white');
  });

  it('renders the sign document header with custom header class', () => {
    render(<SignDocumentHeader document={mockDocument} headerClassName="custom-header-class" />);
    expect(screen.getByTestId('sign-document-header-content')).toHaveClass('custom-header-class');
  });

  it('renders the sign document header with default header class', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    expect(screen.getByTestId('sign-document-header-content')).toHaveClass('max-w-7xl');
  });

  it('renders the sign document header with custom title class', () => {
    render(<SignDocumentHeader document={mockDocument} titleClassName="custom-title-class" />);
    expect(screen.getByTestId('sign-document-header-title')).toHaveClass('custom-title-class');
  });

  it('renders the sign document header with default title class', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    expect(screen.getByTestId('sign-document-header-title')).toHaveClass('text-2xl');
  });

  it('renders the sign document header with custom status class', () => {
    render(<SignDocumentHeader document={mockDocument} statusClassName="custom-status-class" />);
    expect(screen.getByTestId('sign-document-header-status')).toHaveClass('custom-status-class');
  });

  it('renders the sign document header with default status class', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    expect(screen.getByTestId('sign-document-header-status')).toHaveClass('text-sm');
  });

  it('renders the sign document header with custom date class', () => {
    render(<SignDocumentHeader document={mockDocument} dateClassName="custom-date-class" />);
    expect(screen.getByTestId('sign-document-header-date')).toHaveClass('custom-date-class');
  });

  it('renders the sign document header with default date class', () => {
    render(<SignDocumentHeader document={mockDocument} />);
    expect(screen.getByTestId('sign-document-header-date')).toHaveClass('text-sm');
  });
}); 