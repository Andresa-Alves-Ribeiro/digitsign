import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/ui/Button';

describe('Button', () => {
  it('should render button with text', () => {
    render(<Button>Clique aqui</Button>);
    
    expect(screen.getByText('Clique aqui')).toBeInTheDocument();
  });

  it('should render button with default variant', () => {
    render(<Button>Clique aqui</Button>);
    
    const button = screen.getByText('Clique aqui');
    expect(button).toHaveClass('bg-primary');
  });

  it('should render button with secondary variant', () => {
    render(<Button variant="secondary">Clique aqui</Button>);
    
    const button = screen.getByText('Clique aqui');
    expect(button).toHaveClass('bg-secondary');
  });

  it('should render button with outline variant', () => {
    render(<Button variant="outline">Clique aqui</Button>);
    
    const button = screen.getByText('Clique aqui');
    expect(button).toHaveClass('border');
  });

  it('should render button with text variant', () => {
    render(<Button variant="text">Clique aqui</Button>);
    
    const button = screen.getByText('Clique aqui');
    expect(button).toHaveClass('text-primary');
  });

  it('should render button with small size', () => {
    render(<Button size="sm">Clique aqui</Button>);
    
    const button = screen.getByText('Clique aqui');
    expect(button).toHaveClass('px-2');
    expect(button).toHaveClass('py-1');
    expect(button).toHaveClass('text-sm');
  });

  it('should render button with large size', () => {
    render(<Button size="lg">Clique aqui</Button>);
    
    const button = screen.getByText('Clique aqui');
    expect(button).toHaveClass('px-6');
    expect(button).toHaveClass('py-3');
    expect(button).toHaveClass('text-lg');
  });

  it('should render button with full width', () => {
    render(<Button fullWidth>Clique aqui</Button>);
    
    const button = screen.getByText('Clique aqui');
    expect(button).toHaveClass('w-full');
  });

  it('should render button with disabled state', () => {
    render(<Button disabled>Clique aqui</Button>);
    
    const button = screen.getByText('Clique aqui');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50');
    expect(button).toHaveClass('cursor-not-allowed');
  });

  it('should render button with loading state', () => {
    render(<Button loading>Clique aqui</Button>);
    
    const button = screen.getByText('Clique aqui');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-70');
    expect(button).toHaveClass('cursor-wait');
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render button with icon', () => {
    render(
      <Button>
        <span data-testid="icon">Icon</span>
        Clique aqui
      </Button>
    );
    
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('should render button with icon only', () => {
    render(
      <Button iconOnly>
        <span data-testid="icon">Icon</span>
      </Button>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('p-2');
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clique aqui</Button>);
    
    fireEvent.click(screen.getByText('Clique aqui'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick handler when disabled', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Clique aqui</Button>);
    
    fireEvent.click(screen.getByText('Clique aqui'));
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should not call onClick handler when loading', () => {
    const handleClick = jest.fn();
    render(<Button loading onClick={handleClick}>Clique aqui</Button>);
    
    fireEvent.click(screen.getByText('Clique aqui'));
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should render button with custom class', () => {
    render(<Button className="custom-class">Clique aqui</Button>);
    
    const button = screen.getByText('Clique aqui');
    expect(button).toHaveClass('custom-class');
  });

  it('should render button with type submit', () => {
    render(<Button type="submit">Clique aqui</Button>);
    
    const button = screen.getByText('Clique aqui');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should render button with type reset', () => {
    render(<Button type="reset">Clique aqui</Button>);
    
    const button = screen.getByText('Clique aqui');
    expect(button).toHaveAttribute('type', 'reset');
  });

  it('should render button with type button', () => {
    render(<Button type="button">Clique aqui</Button>);
    
    const button = screen.getByText('Clique aqui');
    expect(button).toHaveAttribute('type', 'button');
  });
}); 