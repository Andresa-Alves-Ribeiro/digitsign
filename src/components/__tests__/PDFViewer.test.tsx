import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PDFViewer from '../PDFViewer';

// Mock do react-pdf
jest.mock('react-pdf', () => ({
  Document: ({ children, onLoadSuccess }: any) => (
    <div data-testid="pdf-document" onClick={() => onLoadSuccess({ numPages: 2 })}>
      {children}
    </div>
  ),
  Page: ({ pageNumber }: any) => (
    <div data-testid={`pdf-page-${pageNumber}`}>Page {pageNumber}</div>
  ),
  pdfjs: {
    GlobalWorkerOptions: {
      workerSrc: ''
    }
  }
}));

describe('PDFViewer', () => {
  const defaultProps = {
    url: 'https://example.com/test.pdf',
    onError: jest.fn(),
    onLoadSuccess: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    render(<PDFViewer {...defaultProps} />);
    expect(screen.getByTestId('loading-animation')).toBeInTheDocument();
  });

  it('should render PDF document when loaded', async () => {
    render(<PDFViewer {...defaultProps} />);

    const document = screen.getByTestId('pdf-document');
    fireEvent.click(document);

    await waitFor(() => {
      expect(screen.getByTestId('pdf-page-1')).toBeInTheDocument();
    });
  });

  it('should handle page navigation', async () => {
    render(<PDFViewer {...defaultProps} />);

    const document = screen.getByTestId('pdf-document');
    fireEvent.click(document);

    await waitFor(() => {
      expect(screen.getByTestId('pdf-page-1')).toBeInTheDocument();
    });

    const nextButton = screen.getByRole('button', { name: /próxima página/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByTestId('pdf-page-2')).toBeInTheDocument();
    });

    const prevButton = screen.getByRole('button', { name: /página anterior/i });
    fireEvent.click(prevButton);

    await waitFor(() => {
      expect(screen.getByTestId('pdf-page-1')).toBeInTheDocument();
    });
  });

  it('should call onLoadSuccess with correct number of pages', async () => {
    render(<PDFViewer {...defaultProps} />);

    const document = screen.getByTestId('pdf-document');
    fireEvent.click(document);

    await waitFor(() => {
      expect(defaultProps.onLoadSuccess).toHaveBeenCalledWith({ numPages: 2 });
    });
  });

  it('should handle zoom controls', async () => {
    render(<PDFViewer {...defaultProps} />);

    const document = screen.getByTestId('pdf-document');
    fireEvent.click(document);

    await waitFor(() => {
      expect(screen.getByTestId('pdf-page-1')).toBeInTheDocument();
    });

    const zoomInButton = screen.getByRole('button', { name: /aumentar zoom/i });
    const zoomOutButton = screen.getByRole('button', { name: /diminuir zoom/i });

    fireEvent.click(zoomInButton);
    fireEvent.click(zoomOutButton);

    // Verificar se os botões de zoom estão funcionando
    expect(zoomInButton).not.toBeDisabled();
    expect(zoomOutButton).not.toBeDisabled();
  });

  it('should handle error state', () => {
    const errorMessage = 'Failed to load PDF';
    render(
      <PDFViewer
        {...defaultProps}
        onError={(error) => defaultProps.onError(error)}
      />
    );

    // Simular erro ao carregar o PDF
    const document = screen.getByTestId('pdf-document');
    fireEvent.click(document);
    defaultProps.onError(new Error(errorMessage));

    expect(screen.getByText(/erro ao carregar o pdf/i)).toBeInTheDocument();
  });
}); 