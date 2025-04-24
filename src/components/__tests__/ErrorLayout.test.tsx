import { render, screen } from '@testing-library/react';
import ErrorLayout from '../ErrorLayout';

describe('ErrorLayout', () => {
  const defaultProps = {
    title: 'Error Title',
    message: 'Error Message',
    statusCode: 500
  };

  it('should render error title and message', () => {
    render(<ErrorLayout {...defaultProps} />);

    expect(screen.getByText('Error Title')).toBeInTheDocument();
    expect(screen.getByText('Error Message')).toBeInTheDocument();
  });

  it('should render status code', () => {
    render(<ErrorLayout {...defaultProps} />);
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  it('should render with custom status code', () => {
    render(<ErrorLayout {...defaultProps} statusCode={404} />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('should render with custom className', () => {
    const customClassName = 'custom-error-layout';
    render(<ErrorLayout {...defaultProps} className={customClassName} />);

    const container = screen.getByTestId('error-layout-container');
    expect(container).toHaveClass(customClassName);
  });

  it('should render children when provided', () => {
    render(
      <ErrorLayout {...defaultProps}>
        <div data-testid="custom-content">Custom Content</div>
      </ErrorLayout>
    );

    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.getByText('Custom Content')).toBeInTheDocument();
  });

  it('should render with custom icon', () => {
    const customIcon = <span data-testid="custom-icon">⚠️</span>;
    render(<ErrorLayout {...defaultProps} icon={customIcon} />);

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('should render with default icon when no custom icon is provided', () => {
    render(<ErrorLayout {...defaultProps} />);
    expect(screen.getByTestId('default-error-icon')).toBeInTheDocument();
  });

  it('should render with custom action button', () => {
    const customAction = {
      label: 'Custom Action',
      onClick: jest.fn()
    };
    render(<ErrorLayout {...defaultProps} action={customAction} />);

    expect(screen.getByText('Custom Action')).toBeInTheDocument();
  });
}); 