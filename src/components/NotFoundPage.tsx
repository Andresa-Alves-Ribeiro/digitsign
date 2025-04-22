import { ErrorDisplay } from '@/components/ErrorDisplay';
import { ErrorLayout } from '@/components/ErrorLayout';

interface NotFoundPageProps {
  path?: string;
}

export function NotFoundPage({ path }: NotFoundPageProps) {
  return (
    <ErrorLayout>
      <ErrorDisplay
        error={`A página ${path || 'que você está procurando'} não existe ou foi movida.`}
        onRetry={() => {
          window.location.href = '/';
        }}
      />
    </ErrorLayout>
  );
} 