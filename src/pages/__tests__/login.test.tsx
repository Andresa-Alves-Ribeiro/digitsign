import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Login from '../login';

// Mock dos hooks
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn()
}));

describe('Login Page', () => {
  const mockRouter = {
    push: jest.fn()
  };

  const mockUseAuth = {
    login: jest.fn(),
    isAuthenticated: false,
    isLoading: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue(mockUseAuth);
  });

  it('should render login form', () => {
    render(<Login />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('should handle form submission', async () => {
    render(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUseAuth.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  it('should show validation errors for empty fields', async () => {
    render(<Login />);

    const submitButton = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid email', async () => {
    render(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    });
  });

  it('should redirect to home page when already authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      ...mockUseAuth,
      isAuthenticated: true
    });

    render(<Login />);

    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('should show loading state during authentication', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      ...mockUseAuth,
      isLoading: true
    });

    render(<Login />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should show error message on login failure', async () => {
    const errorMessage = 'Invalid credentials';
    (useAuth as jest.Mock).mockReturnValue({
      ...mockUseAuth,
      login: jest.fn().mockRejectedValue(new Error(errorMessage))
    });

    render(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
    });
  });

  it('should have link to register page', () => {
    render(<Login />);

    const registerLink = screen.getByRole('link', { name: /criar uma conta/i });
    expect(registerLink).toHaveAttribute('href', '/register');
  });
}); 