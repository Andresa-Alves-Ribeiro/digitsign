import { useRouter } from 'next/router';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { ErrorLayout } from '@/components/ErrorLayout';

export default function NotFound() {
  const router = useRouter();

  return (
    <ErrorLayout>
      <ErrorDisplay
        error="A página que você está procurando não existe ou foi movida."
        onRetry={() => router.push('/')}
      />
    </ErrorLayout>
  );
} 