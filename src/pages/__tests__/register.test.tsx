import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Register from '../register';

// Mock dos hooks
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn()
}));

describe('Register Page', () => {
  const mockRouter = {
    push: jest.fn()
  };

  const mockUseAuth = {
    register: jest.fn(),
    isAuthenticated: false,
    isLoading: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue(mockUseAuth);
  });

  it('should render registration form', () => {
    render(<Register />);

    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /criar conta/i })).toBeInTheDocument();
  });

  it('should handle form submission', async () => {
    render(<Register />);

    const nameInput = screen.getByLabelText(/nome/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar senha/i);
    const submitButton = screen.getByRole('button', { name: /criar conta/i });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUseAuth.register).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  it('should show validation errors for empty fields', async () => {
    render(<Register />);

    const submitButton = screen.getByRole('button', { name: /criar conta/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for password mismatch', async () => {
    render(<Register />);

    const passwordInput = screen.getByLabelText(/senha/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar senha/i);

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
    fireEvent.click(screen.getByRole('button', { name: /criar conta/i }));

    await waitFor(() => {
      expect(screen.getByText(/as senhas não coincidem/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid email', async () => {
    render(<Register />);

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /criar conta/i }));

    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    });
  });

  it('should redirect to home page when already authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      ...mockUseAuth,
      isAuthenticated: true
    });

    render(<Register />);

    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('should show loading state during registration', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      ...mockUseAuth,
      isLoading: true
    });

    render(<Register />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should show error message on registration failure', async () => {
    const errorMessage = 'Email already exists';
    (useAuth as jest.Mock).mockReturnValue({
      ...mockUseAuth,
      register: jest.fn().mockRejectedValue(new Error(errorMessage))
    });

    render(<Register />);

    const nameInput = screen.getByLabelText(/nome/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar senha/i);
    const submitButton = screen.getByRole('button', { name: /criar conta/i });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email já está em uso/i)).toBeInTheDocument();
    });
  });

  it('should have link to login page', () => {
    render(<Register />);

    const loginLink = screen.getByRole('link', { name: /já tem uma conta/i });
    expect(loginLink).toHaveAttribute('href', '/login');
  });
}); 