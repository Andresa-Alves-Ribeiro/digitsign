import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useRouter } from 'next/router';
import LoginPage from '../login';
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
  default: (props) => {
    const { fill, priority, ...restProps } = props;
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...restProps} />;
  },
}));

describe('LoginPage', () => {
  const mockLogin = jest.fn();
  const mockRouter = { push: jest.fn() };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: false
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders login page correctly', async () => {
    await act(async () => {
      renderWithProviders(<LoginPage />);
    });

    expect(screen.getByText('Bem-vindo de volta!')).toBeInTheDocument();
    expect(screen.getByText('Faça login para continuar')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('shows loading state when submitting', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      login: jest.fn(() => new Promise(resolve => setTimeout(resolve, 100))),
      isLoading: false
    });

    render(<LoginPage />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/senha/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });

    const submitButton = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(submitButton);
    
    const loadingButton = await screen.findByRole('button', { name: /carregando\.\.\./i });
    expect(loadingButton).toBeDisabled();
  });

  it('handles form submission correctly', async () => {
    await act(async () => {
      renderWithProviders(<LoginPage />);
    });

    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
    });

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });

  it('shows validation errors for invalid form submission', async () => {
    renderWithProviders(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeInTheDocument();
      expect(screen.getByText('A senha deve ter no mínimo 6 caracteres')).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('navigates to register page when clicking register link', async () => {
    renderWithProviders(<LoginPage />);

    const registerLink = screen.getByText('Registre-se');
    expect(registerLink).toHaveAttribute('href', '/register');
  });
}); 