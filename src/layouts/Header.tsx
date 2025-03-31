import { useSession } from "next-auth/react";
import LogoutButton from "@/features/auth/LogoutButton";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    HomeIcon,
    DocumentArrowUpIcon,
    UserIcon,
    ChevronDownIcon,
    ArrowRightStartOnRectangleIcon
} from '@heroicons/react/24/outline';

interface HeaderProps {
    activePage?: 'dashboard' | 'upload' | 'pending' | 'signed' | 'documents';
}

export default function Header({ activePage = 'dashboard' }: HeaderProps) {
    const { data: session } = useSession();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        function handleScroll() {
            setIsScrolled(window.scrollY > 10);
        }

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header className={`left-0 sticky right-0 top-0 transition-all duration-300 ${isScrolled
            ? 'bg-white/80 backdrop-blur-md shadow-md'
            : 'bg-white shadow-sm'
            }`}>
            <div className="mx-auto px-2 sm:px-4 lg:px-6">
                <div className="flex justify-between items-center h-14 sm:h-16">
                    {/* Mobile and Tablet Navigation */}
                    <div className="flex items-center space-x-4 lg:hidden">
                        <Link
                            href="/"
                            className={`p-2 rounded-lg transition-colors duration-200 ${activePage === 'dashboard'
                                    ? 'bg-green-50 text-green-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            title="Dashboard"
                        >
                            <HomeIcon className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/documents/upload"
                            className={`p-2 rounded-lg transition-colors duration-200 ${activePage === 'upload'
                                    ? 'bg-green-50 text-green-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            title="Upload de Documentos"
                        >
                            <DocumentArrowUpIcon className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/documents"
                            className={`p-2 rounded-lg transition-colors duration-200 ${activePage === 'documents'
                                    ? 'bg-green-50 text-green-600'
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
                            className="flex items-center space-x-2 focus:outline-none px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 group"
                        >
                            <div className="relative">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center ring-2 ring-white shadow-sm transition-transform duration-200">
                                    <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full border-2 border-white"></div>
                            </div>

                            <ChevronDownIcon
                                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 cursor-pointer transition-all duration-200 group-hover:text-green-600 ${isDropdownOpen ? 'transform rotate-180' : ''
                                    }`}
                            />
                        </button>

                        <div
                            className={`absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl py-1 z-50 transform transition-all duration-300 ease-in-out ${isDropdownOpen
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
    );
}