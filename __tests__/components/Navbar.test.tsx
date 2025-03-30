import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '@/components/navigation/Navbar';
import { useAuth } from '@/hooks/useAuth';

// Mock do hook useAuth
jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

describe('Navbar', () => {
  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders navbar with user menu when authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      signOut: jest.fn(),
    });

    render(<Navbar />);

    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /menu do usuário/i })).toBeInTheDocument();
  });

  it('renders navbar without user menu when not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
      signOut: jest.fn(),
    });

    render(<Navbar />);

    expect(screen.queryByText(mockUser.name)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /menu do usuário/i })).not.toBeInTheDocument();
  });

  it('opens user menu when clicking menu button', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      signOut: jest.fn(),
    });

    render(<Navbar />);

    const menuButton = screen.getByRole('button', { name: /menu do usuário/i });
    fireEvent.click(menuButton);

    expect(screen.getByText(/perfil/i)).toBeInTheDocument();
    expect(screen.getByText(/configurações/i)).toBeInTheDocument();
    expect(screen.getByText(/sair/i)).toBeInTheDocument();
  });

  it('handles sign out when clicking sign out button', () => {
    const mockSignOut = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      signOut: mockSignOut,
    });

    render(<Navbar />);

    const menuButton = screen.getByRole('button', { name: /menu do usuário/i });
    fireEvent.click(menuButton);

    const signOutButton = screen.getByText(/sair/i);
    fireEvent.click(signOutButton);

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it('closes user menu when clicking outside', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      signOut: jest.fn(),
    });

    render(<Navbar />);

    const menuButton = screen.getByRole('button', { name: /menu do usuário/i });
    fireEvent.click(menuButton);

    // Click outside the menu
    fireEvent.click(document.body);

    expect(screen.queryByText(/perfil/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/configurações/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sair/i)).not.toBeInTheDocument();
  });
}); 