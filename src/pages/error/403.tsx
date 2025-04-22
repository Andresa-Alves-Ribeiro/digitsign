import { useRouter } from 'next/router';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { ErrorLayout } from '@/components/ErrorLayout';

export default function Forbidden() {
  const router = useRouter();

  return (
    <ErrorLayout>
      <ErrorDisplay
        error="Você não tem permissão para acessar esta página."
        onRetry={() => router.push('/')}
      />
    </ErrorLayout>
  );
} 