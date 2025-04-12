/* eslint-disable indent */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import { TOAST_MESSAGES, TOAST_CONFIG } from '@/constants/toast';

interface LoginData {
  email: string;
  password: string;
}

export function useAuth(): {
  isAuthenticated: boolean;
  loading: boolean;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
} {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        setIsAuthenticated(true);
        router.push('/documents');
        toast.success(TOAST_MESSAGES.auth.registerSuccess, TOAST_CONFIG);
      } else {
        throw new Error('Login after registration failed');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(TOAST_MESSAGES.auth.registerError, TOAST_CONFIG);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData): Promise<void> => {
    try {
      setLoading(true);
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.ok) {
        setIsAuthenticated(true);
        toast.success(TOAST_MESSAGES.auth.loginSuccess, TOAST_CONFIG);
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(TOAST_MESSAGES.auth.loginError, TOAST_CONFIG);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await signOut({
        redirect: false,
        callbackUrl: '/login',
      });
      setIsAuthenticated(false);
      router.push('/login');
      toast.success(TOAST_MESSAGES.auth.logoutSuccess, TOAST_CONFIG);
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error(TOAST_MESSAGES.auth.logoutError, TOAST_CONFIG);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    isAuthenticated,
    loading,
    register,
    login,
    logout,
  };
} 