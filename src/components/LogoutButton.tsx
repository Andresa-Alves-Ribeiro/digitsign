import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

interface LogoutButtonProps {
    className?: string;
    children?: React.ReactNode;
    onLogout?: () => void;
    onClick?: () => void;
}

export default function LogoutButton({
    className = "",
    children = "Sair",
    onLogout,
    onClick,
}: LogoutButtonProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoading(true);
            await signOut({
                redirect: false,
                callbackUrl: "/login",
            });
            onLogout?.();
            onClick?.();
            router.push("/login");
        } catch (error) {
            toast.error("Erro ao fazer logout. Por favor, tente novamente.", {
                duration: 4000,
                position: "top-right",
                style: {
                    background: "#ef4444",
                    color: "#fff",
                },
            });
        } finally {
            setIsLoading(false);
            setShowConfirmation(false);
        }
    };

    const handleClick = () => {
        setShowConfirmation(true);
        onClick?.();
    };

    return (
        <>
            {showConfirmation ? (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Confirmar logout
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Tem certeza que deseja sair da sua conta?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                                disabled={isLoading}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                                aria-label="Confirmar logout"
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saindo...
                                    </span>
                                ) : (
                                    "Confirmar"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <button
                    onClick={handleClick}
                    aria-label="Sair da conta"
                    className={`px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 ${className}`}
                    disabled={isLoading}
                >
                    {children}
                </button>
            )}
        </>
    );
}