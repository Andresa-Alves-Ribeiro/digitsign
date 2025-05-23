import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/documents/LoadingSpinner';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return function WithAuthComponent(props: P) {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'unauthenticated') {
        router.push('/login');
      }
    }, [status, router]);

    if (status === 'loading') {
      return <LoadingSpinner text="Verificando autenticação..." />;
    }

    if (status === 'authenticated') {
      return <WrappedComponent {...props} />;
    }

    return null;
  };
};

export default withAuth;