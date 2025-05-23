'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/signatures', label: 'Signatures' },
    { path: '/templates', label: 'Templates' },
    { path: '/settings', label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-neutral-100 dark:bg-neutral-900">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white dark:bg-neutral-800 transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className={`text-xl font-bold text-neutral-900 dark:text-white ${!isSidebarOpen && 'hidden'}`}>
              DigitSign
            </span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <svg
              className="w-6 h-6 text-neutral-600 dark:text-neutral-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              )}
            </svg>
          </button>
        </div>
        <nav className="mt-8">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 ${
                    isActive(item.path) ? 'bg-neutral-100 dark:bg-neutral-700' : ''
                  }`}
                >
                  <span className={!isSidebarOpen ? 'hidden' : ''}>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        {children}
      </main>
    </div>
  );
} 