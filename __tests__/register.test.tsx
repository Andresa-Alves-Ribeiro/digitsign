import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useRouter } from 'next/router';
import RegisterPage from '../register';
import { useAuth } from '@/hooks/useAuth';
import { renderWithProviders } from '@/test-utils';
import { v4 as uuidv4 } from 'uuid';

// Mock dos módulos
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

// Mock do next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock do uuid
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('RegisterPage', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockRegister = jest.fn();
  const mockUuid = 'test-uuid';

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue({
      register: mockRegister,
      isLoading: false,
    });
    (uuidv4 as jest.Mock).mockReturnValue(mockUuid);
    
    // Clear mock calls between tests
    mockRouter.push.mockClear();
    mockRegister.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders register page correctly', async () => {
    await act(async () => {
      renderWithProviders(<RegisterPage />);
    });

    expect(screen.getByText('Criar conta')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /criar conta/i })).toBeInTheDocument();
  });

  it('shows loading state when submitting form', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      register: jest.fn(() => new Promise(resolve => setTimeout(resolve, 100))),
      isLoading: false
    });

    render(<RegisterPage />);

    const nameInput = screen.getByRole('textbox', { name: /nome/i });
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/^senha$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar senha/i);
    
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.change(confirmPasswordInput, { target: { value: '123456' } });

    const submitButton = screen.getByRole('button', { name: /criar conta/i });
    fireEvent.click(submitButton);
    
    const loadingButton = await screen.findByRole('button', { name: /carregando\.\.\./i });
    expect(loadingButton).toBeDisabled();
  });

  it('handles form submission correctly', async () => {
    await act(async () => {
      renderWithProviders(<RegisterPage />);
    });

    const nameInput = screen.getByLabelText('Nome');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');
    const submitButton = screen.getByRole('button', { name: /criar conta/i });

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });
    });
  });

  it('shows validation errors for invalid form submission', async () => {
    render(<RegisterPage />);

    const submitButton = screen.getByRole('button', { name: /criar conta/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('O nome deve ter no mínimo 3 caracteres')).toBeInTheDocument();
      expect(screen.getByText('Email inválido')).toBeInTheDocument();
      expect(screen.getByText('A senha deve ter no mínimo 6 caracteres')).toBeInTheDocument();
      expect(mockRegister).not.toHaveBeenCalled();
    });
  });

  it('shows error when passwords do not match', async () => {
    render(<RegisterPage />);

    const nameInput = screen.getByLabelText('Nome');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');
    const submitButton = screen.getByRole('button', { name: /criar conta/i });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('As senhas não coincidem')).toBeInTheDocument();
      expect(mockRegister).not.toHaveBeenCalled();
    });
  });

  it('navigates to login page when clicking login link', async () => {
    render(<RegisterPage />);

    const loginLink = screen.getByText('Faça login');
    fireEvent.click(loginLink);

    // Since we're using Next.js Link component, we need to check the href attribute
    expect(loginLink).toHaveAttribute('href', '/login');
  });
}); 