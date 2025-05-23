import React from 'react';
import { motion } from 'framer-motion';
import { HomeIcon } from '@heroicons/react/24/outline';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorDisplay({ error, onRetry, className = '' }: ErrorDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-component-bg-light dark:bg-component-bg-dark rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-800 overflow-hidden ${className}`}
    >
      <div className="p-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500 dark:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Ops!
          </h2>
          
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            {error}
          </p>

          {onRetry && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRetry}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Voltar para o Início
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
} 