/* eslint-disable indent */
import { User } from 'next-auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import { TOAST_MESSAGES, TOAST_CONFIG } from '@/constants/toast';

interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterResponse {
  id: string;
  name: string;
  email: string;
}

interface LoginResponse {
  error?: string;
  ok: boolean;
  url?: string;
}

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  savedEmail: string | null;
  register: (name: string, email: string, password: string) => Promise<RegisterResponse>;
  login: (data: LoginData) => Promise<LoginResponse>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [loading, setLoading] = useState(false);
  const [savedEmail, setSavedEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for saved credentials on component mount
    const email = localStorage.getItem('rememberedEmail');
    if (email) {
      setSavedEmail(email);
    }
  }, []);

  const register = async (name: string, email: string, password: string): Promise<RegisterResponse> => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? 'Erro ao registrar');
      }

      router.push('/login');
      toast.success(TOAST_MESSAGES.auth.registerSuccess, TOAST_CONFIG);
      return {
        id: result.id,
        name: result.name,
        email: result.email,
      };
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(TOAST_MESSAGES.auth.registerError, TOAST_CONFIG);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData): Promise<LoginResponse> => {
    try {
      setLoading(true);
      const result = await signIn('credentials', {
        ...data,
        redirect: false,
        callbackUrl: '/'
      }) as LoginResponse;

      if (result?.ok) {
        // Handle remember me
        if (data.rememberMe) {
          localStorage.setItem('rememberedEmail', data.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        router.push('/');
        toast.success(TOAST_MESSAGES.auth.loginSuccess, TOAST_CONFIG);
        return {
          ok: true,
        };
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(TOAST_MESSAGES.auth.loginError, TOAST_CONFIG);
      return {
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        ok: false,
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut({ redirect: false });
      // Clear remembered email on logout
      localStorage.removeItem('rememberedEmail');
      router.push('/login');
      toast.success(TOAST_MESSAGES.auth.logoutSuccess, TOAST_CONFIG);
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error(TOAST_MESSAGES.auth.logoutError, TOAST_CONFIG);
    }
  };

  return {
    user: null, // We'll handle the user state properly with useSession later
    loading,
    savedEmail,
    register,
    login,
    logout,
  };
} 