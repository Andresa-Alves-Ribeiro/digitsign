import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../public/logo.png';
import {
  HomeIcon,
  DocumentArrowUpIcon,
  ClockIcon,
  CheckCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface DashboardLayoutProps {
  activePage?: 'dashboard' | 'upload' | 'pending' | 'signed' | 'documents';
  children?: React.ReactNode;
}

export default function DashboardLayout({ activePage = 'dashboard', children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="hidden md:block w-64 bg-white shadow-lg">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-100">
          <Link href="/" className="flex items-center justify-center">
            <Image
              src={logo}
              alt="Logo"
              width={120}
              height={120}
              className="w-auto"
            />
          </Link>
        </div>

        <div className="p-4">
          <nav className="space-y-1">
            <Link
              href="/"
              className={`flex items-center px-4 py-2.5 text-gray-700 rounded-lg transition-all duration-200 group ${activePage === 'dashboard' ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-50'
                }`}
            >
              <HomeIcon className={`w-5 h-5 mr-3 ${activePage === 'dashboard' ? 'text-green-500 group-hover:text-green-600' : 'text-gray-400 group-hover:text-green-500'
                }`} />
              <span className="font-medium">Dashboard</span>
            </Link>

            <Link
              href="/documents/upload"
              className={`flex items-center px-4 py-2.5 text-gray-700 rounded-lg transition-all duration-200 group ${activePage === 'upload' ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-50'
                }`}
            >
              <DocumentArrowUpIcon className={`w-5 h-5 mr-3 ${activePage === 'upload' ? 'text-green-500 group-hover:text-green-600' : 'text-gray-400 group-hover:text-green-500'
                }`} />
              <span className="font-medium">Upload de Documentos</span>
            </Link>

            <Link
              href="/documents"
              className={`flex items-center px-4 py-2.5 text-gray-700 rounded-lg transition-all duration-200 group ${activePage === 'documents' ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-50'
                }`}
            >
              <DocumentTextIcon className={`w-5 h-5 mr-3 ${activePage === 'documents' ? 'text-green-500 group-hover:text-green-600' : 'text-gray-400 group-hover:text-green-500'
                }`} />
              <span className="font-medium">Todos os Documentos</span>
            </Link>

            <Link
              href="/documents/pending"
              className={`flex items-center px-4 py-2.5 text-gray-700 rounded-lg transition-all duration-200 group ${activePage === 'pending' ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-50'
                }`}
            >
              <ClockIcon className={`w-5 h-5 mr-3 ${activePage === 'pending' ? 'text-green-500 group-hover:text-green-600' : 'text-gray-400 group-hover:text-green-500'
                }`} />
              <span className="font-medium">Pendentes</span>
            </Link>

            <Link
              href="/documents/signed"
              className={`flex items-center px-4 py-2.5 text-gray-700 rounded-lg transition-all duration-200 group ${activePage === 'signed' ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-50'
                }`}
            >
              <CheckCircleIcon className={`w-5 h-5 mr-3 ${activePage === 'signed' ? 'text-green-500 group-hover:text-green-600' : 'text-gray-400 group-hover:text-green-500'
                }`} />
              <span className="font-medium">Assinados</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="fixed bottom-0 p-4 border-t border-gray-100" style={{ width: 'inherit' }}>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Made by <a href="https://github.com/Andresa-Alves-Ribeiro" target="_blank" className="text-green-500 hover:text-green-600">Andresa A. R.</a></span>
            <span>© 2025</span>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
} 