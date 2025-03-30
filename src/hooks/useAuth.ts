import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
        try {
            setIsLoading(true);
            const result = await signIn("credentials", {
                redirect: false,
                ...data,
            });

            if (result?.error) {
                toast.error(TOAST_MESSAGES.auth.loginError, TOAST_CONFIG);
            } else {
                toast.success(TOAST_MESSAGES.auth.loginSuccess, TOAST_CONFIG);
                router.push("/documents");
            }
        } catch (error) {
            toast.error(TOAST_MESSAGES.auth.loginError, TOAST_CONFIG);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterData) => {
        try {
            setIsLoading(true);
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

            if (!response.ok) {
                const result = await response.json();
                throw new Error(TOAST_MESSAGES.auth.registerError);
            }

            // After successful registration, sign in the user
            const signInResult = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (signInResult?.error) {
                throw new Error(TOAST_MESSAGES.auth.registerError);
            }

            toast.success(TOAST_MESSAGES.auth.registerSuccess, TOAST_CONFIG);
            router.push("/documents");
        } catch (error: any) {
            toast.error(TOAST_MESSAGES.auth.registerError, TOAST_CONFIG);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await signOut({
                redirect: false,
                callbackUrl: "/login",
            });
            toast.success(TOAST_MESSAGES.auth.logoutSuccess, TOAST_CONFIG);
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