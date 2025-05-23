import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorMessage from '@/components/ui/ErrorMessage';

describe('ErrorMessage', () => {
  it('should render error message with text', () => {
    render(<ErrorMessage message="Erro ao carregar dados" />);
    
    expect(screen.getByText('Erro ao carregar dados')).toBeInTheDocument();
  });

  it('should render error message with custom class', () => {
    render(<ErrorMessage message="Erro ao carregar dados" className="custom-class" />);
    
    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toHaveClass('custom-class');
  });

  it('should render error message with custom color', () => {
    render(<ErrorMessage message="Erro ao carregar dados" color="text-red-500" />);
    
    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toHaveClass('text-red-500');
  });

  it('should render error message with custom size', () => {
    render(<ErrorMessage message="Erro ao carregar dados" size="text-lg" />);
    
    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toHaveClass('text-lg');
  });

  it('should render error message with custom weight', () => {
    render(<ErrorMessage message="Erro ao carregar dados" weight="font-bold" />);
    
    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toHaveClass('font-bold');
  });

  it('should render error message with custom alignment', () => {
    render(<ErrorMessage message="Erro ao carregar dados" align="text-center" />);
    
    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toHaveClass('text-center');
  });

  it('should render error message with custom margin', () => {
    render(<ErrorMessage message="Erro ao carregar dados" margin="mt-4" />);
    
    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toHaveClass('mt-4');
  });

  it('should render error message with custom padding', () => {
    render(<ErrorMessage message="Erro ao carregar dados" padding="p-4" />);
    
    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toHaveClass('p-4');
  });

  it('should render error message with custom background color', () => {
    render(<ErrorMessage message="Erro ao carregar dados" backgroundColor="bg-red-100" />);
    
    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toHaveClass('bg-red-100');
  });

  it('should render error message with custom border color', () => {
    render(<ErrorMessage message="Erro ao carregar dados" borderColor="border-red-500" />);
    
    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toHaveClass('border-red-500');
  });

  it('should render error message with custom shadow', () => {
    render(<ErrorMessage message="Erro ao carregar dados" shadow="shadow-lg" />);
    
    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toHaveClass('shadow-lg');
  });

  it('should render error message with custom width', () => {
    render(<ErrorMessage message="Erro ao carregar dados" width="w-full" />);
    
    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toHaveClass('w-full');
  });

  it('should render error message with custom height', () => {
    render(<ErrorMessage message="Erro ao carregar dados" height="h-full" />);
    
    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toHaveClass('h-full');
  });

  it('should render error message with custom rounded corners', () => {
    render(<ErrorMessage message="Erro ao carregar dados" rounded="rounded-lg" />);
    
    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toHaveClass('rounded-lg');
  });

  it('should render error message with custom opacity', () => {
    render(<ErrorMessage message="Erro ao carregar dados" opacity="opacity-75" />);
    
    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toHaveClass('opacity-75');
  });

  it('should render error message with custom transition', () => {
    render(<ErrorMessage message="Erro ao carregar dados" transition="transition-all" />);
    
    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toHaveClass('transition-all');
  });

  it('should render error message with custom hover effect', () => {
    render(<ErrorMessage message="Erro ao carregar dados" hover="hover:bg-red-200" />);
    
    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toHaveClass('hover:bg-red-200');
  });

  it('should render error message with custom focus effect', () => {
    render(<ErrorMessage message="Erro ao carregar dados" focus="focus:outline-none" />);
    
    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toHaveClass('focus:outline-none');
  });

  it('should render error message with custom active effect', () => {
    render(<ErrorMessage message="Erro ao carregar dados" active="active:bg-red-300" />);
    
    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toHaveClass('active:bg-red-300');
  });

  it('should render error message with custom disabled effect', () => {
    render(<ErrorMessage message="Erro ao carregar dados" disabled="disabled:opacity-50" />);
    
    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toHaveClass('disabled:opacity-50');
  });

  it('should render error message with icon', () => {
    render(<ErrorMessage message="Erro ao carregar dados" icon="error" />);
    
    const icon = screen.getByTestId('error-icon');
    expect(icon).toBeInTheDocument();
  });

  it('should render error message with custom icon color', () => {
    render(<ErrorMessage message="Erro ao carregar dados" icon="error" iconColor="text-red-500" />);
    
    const icon = screen.getByTestId('error-icon');
    expect(icon).toHaveClass('text-red-500');
  });

  it('should render error message with custom icon size', () => {
    render(<ErrorMessage message="Erro ao carregar dados" icon="error" iconSize="w-6 h-6" />);
    
    const icon = screen.getByTestId('error-icon');
    expect(icon).toHaveClass('w-6 h-6');
  });

  it('should render error message with custom icon margin', () => {
    render(<ErrorMessage message="Erro ao carregar dados" icon="error" iconMargin="mr-2" />);
    
    const icon = screen.getByTestId('error-icon');
    expect(icon).toHaveClass('mr-2');
  });

  it('should render error message with custom icon padding', () => {
    render(<ErrorMessage message="Erro ao carregar dados" icon="error" iconPadding="p-1" />);
    
    const icon = screen.getByTestId('error-icon');
    expect(icon).toHaveClass('p-1');
  });

  it('should render error message with custom icon background color', () => {
    render(<ErrorMessage message="Erro ao carregar dados" icon="error" iconBackgroundColor="bg-red-100" />);
    
    const icon = screen.getByTestId('error-icon');
    expect(icon).toHaveClass('bg-red-100');
  });

  it('should render error message with custom icon border color', () => {
    render(<ErrorMessage message="Erro ao carregar dados" icon="error" iconBorderColor="border-red-500" />);
    
    const icon = screen.getByTestId('error-icon');
    expect(icon).toHaveClass('border-red-500');
  });

  it('should render error message with custom icon shadow', () => {
    render(<ErrorMessage message="Erro ao carregar dados" icon="error" iconShadow="shadow-md" />);
    
    const icon = screen.getByTestId('error-icon');
    expect(icon).toHaveClass('shadow-md');
  });

  it('should render error message with custom icon width', () => {
    render(<ErrorMessage message="Erro ao carregar dados" icon="error" iconWidth="w-8" />);
    
    const icon = screen.getByTestId('error-icon');
    expect(icon).toHaveClass('w-8');
  });

  it('should render error message with custom icon height', () => {
    render(<ErrorMessage message="Erro ao carregar dados" icon="error" iconHeight="h-8" />);
    
    const icon = screen.getByTestId('error-icon');
    expect(icon).toHaveClass('h-8');
  });

  it('should render error message with custom icon rounded corners', () => {
    render(<ErrorMessage message="Erro ao carregar dados" icon="error" iconRounded="rounded-full" />);
    
    const icon = screen.getByTestId('error-icon');
    expect(icon).toHaveClass('rounded-full');
  });

  it('should render error message with custom icon opacity', () => {
    render(<ErrorMessage message="Erro ao carregar dados" icon="error" iconOpacity="opacity-75" />);
    
    const icon = screen.getByTestId('error-icon');
    expect(icon).toHaveClass('opacity-75');
  });

  it('should render error message with custom icon transition', () => {
    render(<ErrorMessage message="Erro ao carregar dados" icon="error" iconTransition="transition-all" />);
    
    const icon = screen.getByTestId('error-icon');
    expect(icon).toHaveClass('transition-all');
  });

  it('should render error message with custom icon hover effect', () => {
    render(<ErrorMessage message="Erro ao carregar dados" icon="error" iconHover="hover:scale-110" />);
    
    const icon = screen.getByTestId('error-icon');
    expect(icon).toHaveClass('hover:scale-110');
  });

  it('should render error message with custom icon focus effect', () => {
    render(<ErrorMessage message="Erro ao carregar dados" icon="error" iconFocus="focus:outline-none" />);
    
    const icon = screen.getByTestId('error-icon');
    expect(icon).toHaveClass('focus:outline-none');
  });

  it('should render error message with custom icon active effect', () => {
    render(<ErrorMessage message="Erro ao carregar dados" icon="error" iconActive="active:scale-95" />);
    
    const icon = screen.getByTestId('error-icon');
    expect(icon).toHaveClass('active:scale-95');
  });

  it('should render error message with custom icon disabled effect', () => {
    render(<ErrorMessage message="Erro ao carregar dados" icon="error" iconDisabled="disabled:opacity-50" />);
    
    const icon = screen.getByTestId('error-icon');
    expect(icon).toHaveClass('disabled:opacity-50');
  });
}); 