'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const isAuthPage = (pathname: string): boolean => {
  return pathname === '/login' || pathname === '/register';
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      // Always default to light theme
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      // Força o tema claro nas páginas de autenticação
      if (isAuthPage(router.pathname)) {
        document.documentElement.classList.remove('dark');
      } else {
        localStorage.setItem('theme', theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
      }
    }
  }, [theme, mounted, router.pathname]);

  const toggleTheme = () => {
    if (!isAuthPage(router.pathname)) {
      setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    }
  };

  if (!mounted) {
    return null;
  }

  // Força o tema claro nas páginas de autenticação
  const currentTheme = isAuthPage(router.pathname) ? 'light' : theme;

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 