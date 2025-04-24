import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import AuthGuard from '../AuthGuard';

// Mock dos hooks
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn()
}));

describe('AuthGuard', () => {
  const mockRouter = {
    push: jest.fn(),
    pathname: '/protected'
  };

  const mockUseAuth = {
    isAuthenticated: false,
    isLoading: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue(mockUseAuth);
  });

  it('should redirect to login when user is not authenticated', () => {
    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  it('should show loading state while authentication is being checked', () => {
    (useAuth as jest.Mock).mockReturnValue({ ...mockUseAuth, isLoading: true });

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByTestId('loading-animation')).toBeInTheDocument();
  });

  it('should render children when user is authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ ...mockUseAuth, isAuthenticated: true });

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });
}); 