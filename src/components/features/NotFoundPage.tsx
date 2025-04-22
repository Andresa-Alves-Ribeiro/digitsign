import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { ErrorLayout } from '@/components/layout/ErrorLayout';

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