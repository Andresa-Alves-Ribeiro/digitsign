import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn, signOut } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { TOAST_CONFIG, TOAST_MESSAGES } from '@/constants/toast';

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData extends LoginData {
    name: string;
    confirmPassword: string;
}

export const useAuth = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const login = async (data: LoginData) => {
        setIsLoading(true);
        try {
            const result = await signIn("credentials", {
                redirect: false,
                ...data,
            });

            if (result?.error) {
                toast.error(TOAST_MESSAGES.auth.loginError, TOAST_CONFIG);
            } else {
                router.push("/");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterData) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            toast.success(TOAST_MESSAGES.auth.registerSuccess, TOAST_CONFIG);
            router.push("/login");
        } catch (error: any) {
            toast.error(error.message || TOAST_MESSAGES.auth.registerError, TOAST_CONFIG);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await signOut({
                redirect: false,
                callbackUrl: "/login",
            });
            router.push("/login");
        } catch (error) {
            toast.error(TOAST_MESSAGES.auth.logoutError, TOAST_CONFIG);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        login,
        register,
        logout,
        isLoading,
    };
}; 