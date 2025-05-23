import { useRouter } from 'next/router';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Button from './Button';

interface BackButtonProps {
  className?: string;
  text?: string;
}

export function BackButton({ className = '', text = 'Voltar' }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="secondary"
      onClick={() => router.back()}
      className={`flex items-center justify-center bg-component-bg-light dark:bg-component-bg-dark hover:bg-component-bg-hover-light dark:hover:bg-component-bg-hover-dark ${className}`}
    >
      <ArrowLeftIcon className="w-5 h-5 mr-2 text-neutral-700 dark:text-neutral-300" />
      <span className="text-neutral-700 dark:text-neutral-300">{text}</span>
    </Button>
  );
} 