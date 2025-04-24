import { render, screen, fireEvent } from '@testing-library/react';
import ErrorDisplay from '../ErrorDisplay';

describe('ErrorDisplay', () => {
  const defaultProps = {
    title: 'Error Title',
    message: 'Error Message',
    onRetry: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render error title and message', () => {
    render(<ErrorDisplay {...defaultProps} />);

    expect(screen.getByText('Error Title')).toBeInTheDocument();
    expect(screen.getByText('Error Message')).toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', () => {
    const mockOnRetry = jest.fn();
    render(<ErrorDisplay {...defaultProps} onRetry={mockOnRetry} />);

    const retryButton = screen.getByRole('button', { name: /tentar novamente/i });
    fireEvent.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('should not show retry button when onRetry is not provided', () => {
    const { onRetry: _onRetry, ...propsWithoutRetry } = defaultProps;
    render(<ErrorDisplay {...propsWithoutRetry} />);

    expect(screen.queryByRole('button', { name: /tentar novamente/i })).not.toBeInTheDocument();
  });

  it('should render custom icon when provided', () => {
    const customIcon = <span data-testid="custom-icon">⚠️</span>;
    render(<ErrorDisplay {...defaultProps} icon={customIcon} />);

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('should render default icon when no custom icon is provided', () => {
    render(<ErrorDisplay {...defaultProps} />);

    expect(screen.getByTestId('default-error-icon')).toBeInTheDocument();
  });
}); 