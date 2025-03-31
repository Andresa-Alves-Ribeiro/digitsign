import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import RegisterPage from '../register';
import { useAuth } from '@/hooks/useAuth';
import { renderWithProviders } from '@/test-utils';

// Mock do next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

// Mock do hook de autenticação
jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn()
}));

// Mock do next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => {
    const { ...restProps } = props;
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe('RegisterPage', () => {
  const mockRegister = jest.fn();
  const mockRouter = { push: jest.fn() };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue({
      register: mockRegister,
      isLoading: false
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders register page correctly', async () => {
    renderWithProviders(<RegisterPage />);

    expect(screen.getByText('Criar uma conta')).toBeInTheDocument();
    expect(screen.getByText('Preencha os dados abaixo para começar')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Seu nome')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirme sua senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /criar conta/i })).toBeInTheDocument();
  });

  it('shows loading state when submitting', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      register: jest.fn(() => new Promise(resolve => setTimeout(resolve, 100))),
      isLoading: false
    });

    render(<RegisterPage />);

    const nameInput = screen.getByRole('textbox', { name: /nome/i });
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/senha/i);
    const confirmPasswordInput = screen.getByLabelText(/confirme sua senha/i);
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.change(confirmPasswordInput, { target: { value: '123456' } });

    const submitButton = screen.getByRole('button', { name: /criar conta/i });
    fireEvent.click(submitButton);
    
    const loadingButton = await screen.findByRole('button', { name: /carregando\.\.\./i });
    expect(loadingButton).toBeDisabled();
  });

  it('handles form submission correctly', async () => {
    renderWithProviders(<RegisterPage />);

    const nameInput = screen.getByPlaceholderText('Seu nome');
    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirme sua senha');
    const submitButton = screen.getByRole('button', { name: /criar conta/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(mockRegister).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });
  });

  it('shows validation errors for invalid form submission', async () => {
    renderWithProviders(<RegisterPage />);

    const submitButton = screen.getByRole('button', { name: /criar conta/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('O nome deve ter no mínimo 3 caracteres')).toBeInTheDocument();
      expect(screen.getByText('Email inválido')).toBeInTheDocument();
      expect(screen.getByText('A senha deve ter no mínimo 6 caracteres')).toBeInTheDocument();
    });

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('shows error when passwords do not match', async () => {
    renderWithProviders(<RegisterPage />);

    const nameInput = screen.getByPlaceholderText('Seu nome');
    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirme sua senha');
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different' } });

    const submitButton = screen.getByRole('button', { name: /criar conta/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('As senhas não coincidem')).toBeInTheDocument();
    });

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('navigates to login page when clicking login link', async () => {
    renderWithProviders(<RegisterPage />);

    const loginLink = screen.getByText('Já tem uma conta?');
    expect(loginLink).toHaveAttribute('href', '/login');
  });
}); 