import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import Error from '../_error';

// Mock do next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

describe('Error Page', () => {
  const mockRouter = {
    push: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should render error page with default status code', () => {
    render(<Error statusCode={500} />);

    expect(screen.getByText(/500/i)).toBeInTheDocument();
    expect(screen.getByText(/erro interno do servidor/i)).toBeInTheDocument();
  });

  it('should render error page with custom status code', () => {
    render(<Error statusCode={404} />);

    expect(screen.getByText(/404/i)).toBeInTheDocument();
    expect(screen.getByText(/página não encontrada/i)).toBeInTheDocument();
  });

  it('should render error page with custom message', () => {
    const customMessage = 'Custom error message';
    render(<Error statusCode={500} message={customMessage} />);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('should render home button', () => {
    render(<Error statusCode={500} />);

    expect(screen.getByRole('button', { name: /voltar para a página inicial/i })).toBeInTheDocument();
  });

  it('should navigate to home page when home button is clicked', () => {
    render(<Error statusCode={500} />);

    const homeButton = screen.getByRole('button', { name: /voltar para a página inicial/i });
    fireEvent.click(homeButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('should render with custom className', () => {
    const customClassName = 'custom-error-page';
    render(<Error statusCode={500} className={customClassName} />);

    const container = screen.getByTestId('error-page-container');
    expect(container).toHaveClass(customClassName);
  });

  it('should render with custom icon', () => {
    const customIcon = <span data-testid="custom-icon">⚠️</span>;
    render(<Error statusCode={500} icon={customIcon} />);

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('should render with default icon when no custom icon is provided', () => {
    render(<Error statusCode={500} />);
    expect(screen.getByTestId('default-error-icon')).toBeInTheDocument();
  });

  it('should render with custom action button', () => {
    const customAction = {
      label: 'Custom Action',
      onClick: jest.fn()
    };
    render(<Error statusCode={500} action={customAction} />);

    expect(screen.getByText('Custom Action')).toBeInTheDocument();
  });

  it('should handle different status codes correctly', () => {
    const statusCodes = [400, 401, 403, 404, 500, 502, 503, 504];
    
    statusCodes.forEach(code => {
      const { unmount } = render(<Error statusCode={code} />);
      expect(screen.getByText(code.toString())).toBeInTheDocument();
      unmount();
    });
  });

  it('should render with children when provided', () => {
    render(
      <Error statusCode={500}>
        <div data-testid="custom-content">Custom Content</div>
      </Error>
    );

    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.getByText('Custom Content')).toBeInTheDocument();
  });
}); 