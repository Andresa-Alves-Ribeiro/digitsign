import React from 'react';
import Link from 'next/link';

interface DashboardLayoutProps {
    children?: React.ReactNode;
    activePage?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activePage }) => {
    return (
        <div className="w-64 bg-white border-r border-gray-200">
            <div className="p-4">
                <h1 className="text-xl font-bold text-gray-900">SuperSign</h1>
            </div>
            <nav className="mt-4">
                <Link 
                    href="/documents"
                    className={`flex items-center px-4 py-2 text-sm ${
                        activePage === 'documents' 
                            ? 'bg-green-50 text-green-700' 
                            : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Documentos
                </Link>
            </nav>
        </div>
    );
};

export default DashboardLayout; 