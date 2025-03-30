import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '@/components/error/ErrorBoundary';

// Componente que lança erro para testar o ErrorBoundary
const ThrowError = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Limpa o console.error para não poluir o output dos testes
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders error message when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/ops! algo deu errado/i)).toBeInTheDocument();
    expect(screen.getByText(/test error/i)).toBeInTheDocument();
  });

  it('renders retry button when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument();
  });

  it('resets error state when retry button is clicked', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const retryButton = screen.getByRole('button', { name: /tentar novamente/i });
    fireEvent.click(retryButton);

    expect(screen.queryByText(/ops! algo deu errado/i)).not.toBeInTheDocument();
  });

  it('renders with custom error message', () => {
    render(
      <ErrorBoundary message="Custom error message">
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('renders with custom retry button text', () => {
    render(
      <ErrorBoundary retryText="Custom retry text">
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByRole('button', { name: /custom retry text/i })).toBeInTheDocument();
  });
}); 