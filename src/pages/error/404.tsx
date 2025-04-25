import { useRouter } from 'next/router';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { ErrorLayout } from '@/components/ErrorLayout';
import { BackButton } from '@/components/ui/BackButton';

export default function NotFound() {
  const router = useRouter();

  return (
    <ErrorLayout>
      <div className="space-y-4">
        <ErrorDisplay
          error="A página que você está procurando não existe ou foi movida."
          onRetry={() => router.push('/')}
        />
        <div className="flex justify-center gap-4">
          <BackButton />
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
          >
            Voltar para o Início
          </button>
        </div>
      </div>
    </ErrorLayout>
  );
} 