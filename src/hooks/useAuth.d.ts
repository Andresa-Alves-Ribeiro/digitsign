import { User } from 'next-auth';

interface LoginData {
    email: string;
    password: string;
}

interface RegisterResponse {
    id: string;
    name: string;
    email: string;
}

interface LoginResponse {
    error?: string;
    ok: boolean;
    url?: string;
}

export function useAuth(): {
    user: User | null;
    loading: boolean;
    register: (name: string, email: string, password: string) => Promise<RegisterResponse>;
    login: (data: LoginData) => Promise<LoginResponse>;
    logout: () => Promise<void>;
} 