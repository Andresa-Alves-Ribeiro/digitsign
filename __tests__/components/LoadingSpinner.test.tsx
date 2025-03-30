import { render, screen } from '@testing-library/react';
import Loading from '@/components/Loading';

describe('Loading', () => {
  it('renders loading spinner with default text', () => {
    render(<Loading />);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('renders loading spinner with custom text', () => {
    const customText = 'Processando...';
    render(<Loading text={customText} />);
    expect(screen.getByText(customText)).toBeInTheDocument();
  });

  it('renders loading dots', () => {
    render(<Loading />);
    const dots = screen.getAllByRole('presentation');
    expect(dots).toHaveLength(3);
    dots.forEach(dot => {
      expect(dot).toHaveClass('bg-green-500', 'rounded-full', 'animate-bounce');
    });
  });

  it('renders spinner with default size', () => {
    render(<Loading />);
    const spinnerContainer = screen.getByRole('presentation');
    expect(spinnerContainer).toHaveClass('w-10', 'h-10');
  });

  it('renders spinner with custom size', () => {
    render(<Loading size="lg" />);
    const spinnerContainer = screen.getByTestId('spinner-container');
    expect(spinnerContainer.firstChild).toHaveClass('w-16', 'h-16');
  });

  it('renders spinner with custom color', () => {
    render(<Loading color="primary" />);
    const spinnerContainer = screen.getByTestId('spinner-container');
    expect(spinnerContainer.firstChild).toHaveClass('border-primary-500');
  });

  it('renders spinner with custom className', () => {
    render(<Loading className="custom-class" />);
    const container = screen.getByTestId('spinner-wrapper');
    expect(container).toHaveClass('custom-class');
  });
}); 