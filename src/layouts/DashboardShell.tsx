import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useTheme } from '@/contexts/ThemeContext';
import LogoutButton from '@/features/auth/LogoutButton';
import logoDark from '@/assets/images/logo-dark.png';
import logoLight from '@/assets/images/logo-light.png';
import {
  HomeIcon,
  DocumentArrowUpIcon,
  DocumentTextIcon,
  UserIcon,
  ChevronDownIcon,
  ArrowRightStartOnRectangleIcon,
  _SunIcon as SunIcon,
  _MoonIcon as MoonIcon
} from '@heroicons/react/24/outline';

interface DashboardShellProps {
  activePage?: 'dashboard' | 'upload' | 'pending' | 'signed' | 'documents';
  children?: React.ReactNode;
}

export default function DashboardShell({ activePage = 'dashboard', children }: DashboardShellProps) {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    function handleScroll(): void {
      setIsScrolled(window.scrollY > 10);
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const NavLink = ({ href, icon: Icon, title, isActive }: { 
    href: string; 
    icon: React.ElementType; 
    title: string; 
    isActive: boolean;
  }) => (
    <Link
      href={href}
      className={`flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-lg transition-all duration-200 group cursor-pointer ${
        isActive 
          ? 'bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 shadow-sm border border-green-100 dark:border-green-800' 
          : 'hover:bg-gray-100 dark:hover:bg-green-800'
      }`}
    >
      <Icon className={`w-5 h-5 mr-3 ${
        isActive 
          ? 'text-green-500 dark:text-green-400 group-hover:text-green-600 dark:group-hover:text-green-300' 
          : 'text-gray-400 dark:text-gray-500 group-hover:text-green-500 dark:group-hover:text-green-400'
      }`} />
      <span className="font-medium truncate cursor-pointer">{title}</span>
    </Link>
  );

  return (
    <div className="flex h-full w-full bg-background-light dark:bg-background-dark">
      {/* Sidebar - Hidden on mobile, visible on tablet and up */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-component-bg-light dark:bg-component-bg-dark shadow-lg border-r border-gray-100 dark:border-gray-700">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <Link href="/" className="flex items-center justify-center cursor-pointer">
            <Image
              src={theme === 'dark' ? logoDark : logoLight}
              alt="Logo"
              width={120}
              height={120}
              className="w-auto"
              priority
            />
          </Link>
        </div>

        <div className="p-4">
          <nav className="space-y-2">
            <NavLink 
              href="/" 
              icon={HomeIcon} 
              title="Dashboard" 
              isActive={activePage === 'dashboard'} 
            />
            <NavLink 
              href="/documents/upload" 
              icon={DocumentArrowUpIcon} 
              title="Upload" 
              isActive={activePage === 'upload'} 
            />
            <NavLink 
              href="/documents" 
              icon={DocumentTextIcon} 
              title="Documentos" 
              isActive={activePage === 'documents'} 
            />
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Made by <a href="https://github.com/Andresa-Alves-Ribeiro" target="_blank" className="text-green-500 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300 font-medium">Andresa A. R.</a></span>
            <span>© 2025</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
        {/* Header */}
        <header className={`sticky top-0 z-60 transition-all duration-300 ${
          isScrolled
            ? 'bg-component-bg-light/80 dark:bg-component-bg-dark/80 backdrop-blur-md shadow-md'
            : 'bg-component-bg-light dark:bg-component-bg-dark shadow-sm'
        }`}>
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-end items-center h-16">
              {/* Mobile and Tablet Navigation */}
              <div className="flex items-center space-x-4 lg:hidden">
                <Link
                  href="/"
                  className={`p-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
                    activePage === 'dashboard'
                      ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 shadow-sm border border-green-100 dark:border-green-800'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  title="Dashboard"
                >
                  <HomeIcon className="w-5 h-5" />
                </Link>
                <Link
                  href="/documents/upload"
                  className={`p-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
                    activePage === 'upload'
                      ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 shadow-sm border border-green-100 dark:border-green-800'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  title="Upload"
                >
                  <DocumentArrowUpIcon className="w-5 h-5" />
                </Link>
                <Link
                  href="/documents"
                  className={`p-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
                    activePage === 'documents'
                      ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 shadow-sm border border-green-100 dark:border-green-800'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  title="Documentos"
                >
                  <DocumentTextIcon className="w-5 h-5" />
                </Link>
              </div>

              {/* Theme Toggle and User Menu */}
              <div className="flex items-center space-x-4">
                {/* Theme Toggle Switch */}
                <button
                  onClick={toggleTheme}
                  className="relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 bg-gray-200 dark:bg-gray-700 group"
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  <span
                    className={`${
                      theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-5 w-5 transform rounded-full bg-white transition-all duration-500 ease-in-out shadow-lg`}
                  >
                    <div className="relative h-full w-full">
                      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                        theme === 'dark' ? 'opacity-0' : 'opacity-100'
                      }`}>
                        <svg 
                          className="h-4 w-4 text-amber-500" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          strokeWidth={2} 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" 
                          />
                        </svg>
                      </div>
                      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                        theme === 'dark' ? 'opacity-100' : 'opacity-0'
                      }`}>
                        <svg 
                          className="h-4 w-4 text-indigo-400" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          strokeWidth={2} 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" 
                          />
                        </svg>
                      </div>
                    </div>
                  </span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-100/20 to-indigo-100/20 dark:from-indigo-900/20 dark:to-amber-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </button>

                {/* User Menu */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-3 focus:outline-none px-3 py-2 rounded-lg transition-all duration-200 hover:bg-component-bg-hover-light dark:hover:bg-component-bg-hover-dark group"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center ring-2 ring-white dark:ring-gray-700 shadow-sm transition-transform duration-200 group-hover:scale-105">
                        <UserIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>

                    <ChevronDownIcon
                      className={`w-4 h-4 text-gray-500 dark:text-gray-400 cursor-pointer transition-all duration-200 group-hover:text-green-600 dark:group-hover:text-green-400 ${
                        isDropdownOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`absolute right-0 mt-2 w-72 bg-component-bg-light dark:bg-component-bg-dark rounded-xl shadow-xl py-1 z-50 transform transition-all duration-300 ease-in-out ${
                      isDropdownOpen
                        ? 'opacity-100 translate-y-0 visible'
                        : 'opacity-0 -translate-y-2 invisible'
                    }`}
                  >
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center shadow-sm">
                          <UserIcon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{session?.user?.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{session?.user?.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700">
                      <LogoutButton
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200 group"
                        onLogout={() => setIsDropdownOpen(false)}
                      >
                        <ArrowRightStartOnRectangleIcon className="w-4 h-4 mr-3 group-hover:transform group-hover:translate-x-1 transition-transform duration-200" />
                        Sair
                      </LogoutButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 