import { renderHook, waitFor, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { TOAST_MESSAGES, TOAST_CONFIG } from '@/constants/toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import React from 'react';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

// Mock next-auth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => {
  const mockToast = {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  };
  return {
    __esModule: true,
    default: mockToast,
    toast: mockToast,
  };
});

// Mock fetch
global.fetch = jest.fn();

// Test data
const mockRegisterData = {
  email: 'test@test.com',
  password: 'password',
  name: 'Test User'
};

// Tipos para os mocks
interface _SignInResponse {
  ok?: boolean;
  error?: string | null;
  url?: string;
}

interface FetchResponse {
  ok: boolean;
  json: () => Promise<unknown>;
  text: () => Promise<string>;
}

// Wrapper para os testes
const createTestWrapper = (): React.FC<{ children: React.ReactNode }> => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }): JSX.Element => (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={null}>
        {children}
      </SessionProvider>
    </QueryClientProvider>
  );
  
  TestWrapper.displayName = 'TestWrapper';
  return TestWrapper;
};

describe('useAuth Hook', () => {
  const mockRouter = {
    push: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  describe('register', () => {
    it('handles successful registration', async () => {
      const mockResponse: FetchResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'User registered successfully' }),
        text: () => Promise.resolve(JSON.stringify({ message: 'User registered successfully' }))
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);
      (signIn as jest.Mock).mockResolvedValueOnce({ ok: true });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createTestWrapper()
      });

      // Wait for the hook to be initialized
      await waitFor(() => {
        expect(result.current).toBeDefined();
        expect(result.current.register).toBeDefined();
      });

      await act(async () => {
        await result.current.register(
          mockRegisterData.name,
          mockRegisterData.email,
          mockRegisterData.password
        );
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost/api/register',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: expect.any(String)
        })
      );

      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: mockRegisterData.email,
        password: mockRegisterData.password,
        redirect: false,
      });

      expect(mockRouter.push).toHaveBeenCalledWith('/documents');
      expect(toast.success).toHaveBeenCalledWith(
        TOAST_MESSAGES.auth.registerSuccess,
        TOAST_CONFIG
      );
    });

    it('handles registration error', async () => {
      const mockError = { error: 'Registration failed' };
      const mockResponse: FetchResponse = {
        ok: false,
        json: () => Promise.resolve(mockError),
        text: () => Promise.resolve(JSON.stringify(mockError))
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createTestWrapper()
      });

      // Wait for the hook to be initialized
      await waitFor(() => {
        expect(result.current).toBeDefined();
        expect(result.current.register).toBeDefined();
      });

      try {
        await act(async () => {
          await result.current.register(
            mockRegisterData.name,
            mockRegisterData.email,
            mockRegisterData.password
          );
        });
      } catch (_error) {
        expect(toast.error).toHaveBeenCalledWith(
          TOAST_MESSAGES.auth.registerError,
          TOAST_CONFIG
        );
      }
    });
  });

  describe('login', () => {
    it('handles successful login', async () => {
      (signIn as jest.Mock).mockResolvedValueOnce({ ok: true, error: null });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createTestWrapper()
      });

      // Wait for the hook to be initialized
      await waitFor(() => {
        expect(result.current).toBeDefined();
        expect(result.current.login).toBeDefined();
      });

      await act(async () => {
        await result.current.login({ email: 'test@test.com', password: 'password' });
      });

      expect(signIn).toHaveBeenCalledWith('credentials', {
        redirect: false,
        email: 'test@test.com',
        password: 'password',
      });
      expect(toast.success).toHaveBeenCalledWith(TOAST_MESSAGES.auth.loginSuccess, TOAST_CONFIG);
      expect(result.current.loading).toBe(false);
    });

    it('handles login error', async () => {
      (signIn as jest.Mock).mockResolvedValueOnce({ ok: false, error: 'Invalid credentials' });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createTestWrapper()
      });

      // Wait for the hook to be initialized
      await waitFor(() => {
        expect(result.current).toBeDefined();
        expect(result.current.login).toBeDefined();
      });

      try {
        await act(async () => {
          await result.current.login({ email: 'test@test.com', password: 'wrong' });
        });
      } catch (_error) {
        expect(toast.error).toHaveBeenCalledWith(TOAST_MESSAGES.auth.loginError, TOAST_CONFIG);
        expect(result.current.loading).toBe(false);
      }
    });
  });

  describe('logout', () => {
    it('handles successful logout', async () => {
      (signOut as jest.Mock).mockResolvedValueOnce({});

      const { result } = renderHook(() => useAuth(), {
        wrapper: createTestWrapper()
      });

      // Wait for the hook to be initialized
      await waitFor(() => {
        expect(result.current).toBeDefined();
        expect(result.current.logout).toBeDefined();
      });

      await act(async () => {
        await result.current.logout();
      });

      expect(signOut).toHaveBeenCalledWith({
        redirect: false,
        callbackUrl: '/login',
      });
      expect(toast.success).toHaveBeenCalledWith(TOAST_MESSAGES.auth.logoutSuccess, TOAST_CONFIG);
      expect(result.current.loading).toBe(false);
    });

    it('handles logout error', async () => {
      (signOut as jest.Mock).mockRejectedValueOnce(new Error('Logout failed'));

      const { result } = renderHook(() => useAuth(), {
        wrapper: createTestWrapper()
      });

      // Wait for the hook to be initialized
      await waitFor(() => {
        expect(result.current).toBeDefined();
        expect(result.current.logout).toBeDefined();
      });

      try {
        await act(async () => {
          await result.current.logout();
        });
      } catch (_error) {
        expect(toast.error).toHaveBeenCalledWith(TOAST_MESSAGES.auth.logoutError, TOAST_CONFIG);
        expect(result.current.loading).toBe(false);
      }
    });
  });
}); 