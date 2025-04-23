import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import AuthGuard from '../AuthGuard';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn()
}));

const mockPush = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush
  })
}));

describe('AuthGuard Component', () => {
  const mockChildren = <div>Protected Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children when session exists', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { id: '1', email: 'test@example.com' } },
      status: 'authenticated'
    });

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login when no session exists', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated'
    });

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('should handle loading state', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'loading'
    });

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('returns null when status is not one of the expected states', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unknown'
    });

    const { container } = render(<AuthGuard>{mockChildren}</AuthGuard>);
    expect(container.firstChild).toBeNull();
  });
}); 