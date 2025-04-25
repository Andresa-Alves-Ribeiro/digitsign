'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Create a default value for the context to avoid the "must be used within a ThemeProvider" error
const defaultContextValue: ThemeContextType = {
  theme: 'light',
  toggleTheme: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultContextValue);

// Function to check if the current page is an auth page
const isAuthPage = (pathname: string): boolean => {
  return pathname === '/login' || pathname === '/register';
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as Theme;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Force light theme on auth pages
    if (isAuthPage(pathname)) {
      setTheme('light');
    } else {
      setTheme(savedTheme || (systemPrefersDark ? 'dark' : 'light'));
    }
    setMounted(true);
  }, [pathname]);

  useEffect(() => {
    if (mounted) {
      // Only save theme to localStorage if not on auth page
      if (!isAuthPage(pathname)) {
        localStorage.setItem('theme', theme);
      }
      
      if (theme === 'dark' && !isAuthPage(pathname)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme, mounted, pathname]);

  const toggleTheme = () => {
    // Prevent theme toggle on auth pages
    if (isAuthPage(pathname)) return;
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Use the default value during server-side rendering
  const value = mounted 
    ? { theme, toggleTheme } 
    : defaultContextValue;

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
} 