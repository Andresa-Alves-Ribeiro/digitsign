import { useRouter } from 'next/router';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { ErrorLayout } from '@/components/ErrorLayout';

export default function Unauthorized() {
  const router = useRouter();

  return (
    <ErrorLayout>
      <ErrorDisplay
        error="Você precisa estar autenticado para acessar esta página."
        onRetry={() => router.push('/login')}
      />
    </ErrorLayout>
  );
} 