import { useSession } from "next-auth/react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function Header() {
    const { data: session } = useSession();

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="text-xl font-semibold text-gray-800">
                                Dashboard
                            </Link>
                        </div>
                        <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link href="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
                                Dashboard
                            </Link>
                            <Link href="/dashboard/analytics" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                                Analytics
                            </Link>
                            <Link href="/dashboard/users" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                                Users
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                            <span className="sr-only">View notifications</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>
                        <div className="flex items-center">
                            <span className="text-sm text-gray-700 mr-4">{session?.user?.email}</span>
                            <LogoutButton className="text-sm" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}