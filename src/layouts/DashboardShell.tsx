import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import LogoutButton from '@/features/auth/LogoutButton';
import logo from '@/assets/images/logo.png';
import {
  HomeIcon,
  DocumentArrowUpIcon,
  DocumentTextIcon,
  UserIcon,
  ChevronDownIcon,
  ArrowRightStartOnRectangleIcon
} from '@heroicons/react/24/outline';

interface DashboardShellProps {
  activePage?: 'dashboard' | 'upload' | 'pending' | 'signed' | 'documents';
  children?: React.ReactNode;
}

export default function DashboardShell({ activePage = 'dashboard', children }: DashboardShellProps) {
  const { data: session } = useSession();
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
      className={`flex items-center px-4 py-3 text-gray-700 rounded-lg transition-all duration-200 group ${
        isActive 
          ? 'bg-green-50 hover:bg-green-100 shadow-sm border border-green-100' 
          : 'hover:bg-gray-50'
      }`}
    >
      <Icon className={`w-5 h-5 mr-3 ${
        isActive 
          ? 'text-green-500 group-hover:text-green-600' 
          : 'text-gray-400 group-hover:text-green-500'
      }`} />
      <span className="font-medium">{title}</span>
    </Link>
  );

  return (
    <div className="flex h-full w-full bg-gray-50">
      {/* Sidebar - Hidden on mobile, visible on tablet and up */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white shadow-lg border-r border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <Link href="/" className="flex items-center justify-center">
            <Image
              src={logo}
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
              title="Upload de Documentos" 
              isActive={activePage === 'upload'} 
            />
            <NavLink 
              href="/documents" 
              icon={DocumentTextIcon} 
              title="Todos os Documentos" 
              isActive={activePage === 'documents'} 
            />
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Made by <a href="https://github.com/Andresa-Alves-Ribeiro" target="_blank" className="text-green-500 hover:text-green-600 font-medium">Andresa A. R.</a></span>
            <span>© 2025</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <header className={`sticky top-0 z-60 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-md shadow-md'
            : 'bg-white shadow-sm'
        }`}>
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Mobile and Tablet Navigation */}
              <div className="flex items-center space-x-4 lg:hidden">
                <Link
                  href="/"
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    activePage === 'dashboard'
                      ? 'bg-green-50 text-green-600 shadow-sm border border-green-100'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                  title="Dashboard"
                >
                  <HomeIcon className="w-5 h-5" />
                </Link>
                <Link
                  href="/documents/upload"
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    activePage === 'upload'
                      ? 'bg-green-50 text-green-600 shadow-sm border border-green-100'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                  title="Upload de Documentos"
                >
                  <DocumentArrowUpIcon className="w-5 h-5" />
                </Link>
                <Link
                  href="/documents"
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    activePage === 'documents'
                      ? 'bg-green-50 text-green-600 shadow-sm border border-green-100'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                  title="Todos os Documentos"
                >
                  <DocumentArrowUpIcon className="w-5 h-5" />
                </Link>
              </div>

              {/* User Menu */}
              <div className="relative lg:ml-auto" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 focus:outline-none px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50 group"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center ring-2 ring-white shadow-sm transition-transform duration-200 group-hover:scale-105">
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>

                  <ChevronDownIcon
                    className={`w-4 h-4 text-gray-500 cursor-pointer transition-all duration-200 group-hover:text-green-600 ${
                      isDropdownOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                <div
                  className={`absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl py-1 z-50 transform transition-all duration-300 ease-in-out ${
                    isDropdownOpen
                      ? 'opacity-100 translate-y-0 visible'
                      : 'opacity-0 -translate-y-2 invisible'
                  }`}
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-sm">
                        <UserIcon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{session?.user?.name}</p>
                        <p className="text-xs text-gray-500">{session?.user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100">
                    <LogoutButton
                      className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 group"
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