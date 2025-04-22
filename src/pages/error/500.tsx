import { useRouter } from 'next/router';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { ErrorLayout } from '@/components/ErrorLayout';

export default function ServerError() {
  const router = useRouter();

  return (
    <ErrorLayout>
      <ErrorDisplay
        error="Ocorreu um erro no servidor. Por favor, tente novamente mais tarde."
        onRetry={() => router.push('/')}
      />
    </ErrorLayout>
  );
} 