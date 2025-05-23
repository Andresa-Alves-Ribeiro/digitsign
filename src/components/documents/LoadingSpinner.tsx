import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = 'Carregando...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
        <p className="mt-4 text-neutral-600">{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner; 