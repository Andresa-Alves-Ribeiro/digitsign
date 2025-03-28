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
                                SuperSign
                            </Link>
                        </div>

                        <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link href="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                                Ver Assinados
                            </Link>
                            <Link href="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                                Upload de Documentos
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center space-x-4">
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