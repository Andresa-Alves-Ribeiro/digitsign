import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/button/Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByTestId('button')).toHaveTextContent('Click me');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByTestId('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles correctly', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByTestId('button');
    expect(button).toHaveClass('bg-primary-600');
  });

  it('applies size styles correctly', () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByTestId('button');
    expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByTestId('button');
    expect(button).toBeDisabled();
  });

  it('shows loading state', () => {
    render(<Button isLoading>Loading Button</Button>);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
    expect(screen.getByTestId('button')).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>);
    const button = screen.getByTestId('button');
    expect(button).toHaveClass('custom-class');
  });
}); 