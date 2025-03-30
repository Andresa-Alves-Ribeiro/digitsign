import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      },
    },
    status: 'authenticated',
  }),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

describe('useAuth', () => {
  it('returns user data when authenticated', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('handles sign in', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signIn('credentials', {
        email: 'test@example.com',
        password: 'password',
      });
    });

    expect(result.current.isAuthenticated).toBe(true);
  });

  it('handles sign out', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.isAuthenticated).toBe(false);
  });
}); 