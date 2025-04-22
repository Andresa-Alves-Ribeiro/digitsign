import { FC } from 'react';

interface ErrorDisplayProps {
  error: Error | string;
  className?: string;
}

export const ErrorDisplay: FC<ErrorDisplayProps> = ({ error, className = '' }): JSX.Element => {
  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <div className={`text-red-500 text-sm ${className}`}>
      {errorMessage}
    </div>
  );
}; 