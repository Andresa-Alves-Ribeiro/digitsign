import React from 'react';

const ErrorPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
      <div className="max-w-md w-full p-8 bg-component-bg-light dark:bg-component-bg-dark rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">Erro</h1>
        <p className="text-text-light dark:text-text-dark">Ocorreu um erro inesperado.</p>
      </div>
    </div>
  );
};

export default ErrorPage; 