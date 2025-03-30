import { render, screen, fireEvent } from '@testing-library/react'
import ErrorBoundary from './ErrorBoundary'

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Test Content')).toBeInTheDocument()
    expect(screen.queryByText(/algo deu errado/i)).not.toBeInTheDocument()
  })

  it('renders error message when child component throws error', () => {
    const ErrorComponent = () => {
      throw new Error('Test error')
    }

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )
    
    expect(screen.getByText(/algo deu errado/i)).toBeInTheDocument()
    expect(screen.getByText(/test error/i)).toBeInTheDocument()
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
  })

  it('renders custom error message when provided', () => {
    const ErrorComponent = () => {
      throw new Error('Test error')
    }

    const customMessage = 'Erro personalizado'

    render(
      <ErrorBoundary message={customMessage}>
        <ErrorComponent />
      </ErrorBoundary>
    )
    
    expect(screen.getByText(customMessage)).toBeInTheDocument()
    expect(screen.getByText(/test error/i)).toBeInTheDocument()
  })

  it('handles retry button click', () => {
    const ErrorComponent = () => {
      throw new Error('Test error')
    }

    const onRetry = jest.fn()

    render(
      <ErrorBoundary onRetry={onRetry}>
        <ErrorComponent />
      </ErrorBoundary>
    )
    
    const retryButton = screen.getByRole('button', { name: /tentar novamente/i })
    fireEvent.click(retryButton)

    expect(onRetry).toHaveBeenCalled()
  })

  it('renders without retry button when onRetry is not provided', () => {
    const ErrorComponent = () => {
      throw new Error('Test error')
    }

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )
    
    expect(screen.queryByRole('button', { name: /tentar novamente/i })).not.toBeInTheDocument()
  })

  it('handles different types of errors', () => {
    const ErrorComponent = () => {
      throw new TypeError('Type error')
    }

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )
    
    expect(screen.getByText(/type error/i)).toBeInTheDocument()
  })

  it('handles async errors', async () => {
    const AsyncErrorComponent = () => {
      throw new Error('Async error')
    }

    render(
      <ErrorBoundary>
        <AsyncErrorComponent />
      </ErrorBoundary>
    )
    
    expect(await screen.findByText(/async error/i)).toBeInTheDocument()
  })

  it('renders with custom styling', () => {
    const ErrorComponent = () => {
      throw new Error('Test error')
    }

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )
    
    const errorContainer = screen.getByTestId('error-boundary')
    expect(errorContainer).toHaveStyle({
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: '#fee2e2',
      borderRadius: '0.5rem',
    })
  })

  it('handles multiple errors in the same boundary', () => {
    const ErrorComponent1 = () => {
      throw new Error('First error')
    }

    const ErrorComponent2 = () => {
      throw new Error('Second error')
    }

    render(
      <ErrorBoundary>
        <ErrorComponent1 />
        <ErrorComponent2 />
      </ErrorBoundary>
    )
    
    expect(screen.getByText(/first error/i)).toBeInTheDocument()
    expect(screen.queryByText(/second error/i)).not.toBeInTheDocument()
  })
}) 