import { useSession } from "next-auth/react";
import LogoutButton from "@/features/auth/LogoutButton";
import { useState, useEffect, useRef } from "react";
import { UserIcon, LogoutIcon, DropDownIcon } from "@/assets/icons";

export default function Header() {
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
            <div className="mx-auto px-4 sm:px-6 lg:px-4">
                <div className="flex justify-end items-center h-16">
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center space-x-2 focus:outline-none px-3 py-2 rounded-lg transition-all duration-200 group"
                        >
                            <div className="relative">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center ring-2 ring-white shadow-sm transition-transform duration-200">
                                    <UserIcon className="w-5 h-5 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                            </div>

                            <DropDownIcon
                                className={`w-4 h-4 text-gray-500 cursor-pointer transition-all duration-200 group-hover:text-green-600 ${isDropdownOpen ? 'transform rotate-180' : ''
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
                                    <LogoutIcon className="w-4 h-4 mr-3 group-hover:transform group-hover:translate-x-1 transition-transform duration-200" />
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