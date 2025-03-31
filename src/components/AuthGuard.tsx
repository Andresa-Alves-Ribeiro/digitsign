import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

interface AuthGuardProps {
    children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (status === 'authenticated') {
        return <>{children}</>;
    }

    return null;
};

export default AuthGuard; 