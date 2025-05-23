import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ErrorLayoutProps {
  children: ReactNode;
}

export function ErrorLayout({ children }: ErrorLayoutProps): JSX.Element {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />
      
      {/* Animated Blobs */}
      <motion.div
        className="absolute top-0 -left-4 w-72 h-72 bg-primary dark:bg-primary/30 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      <motion.div
        className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 dark:bg-blue-500/30 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [90, 0, 90],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      <motion.div
        className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-300 dark:bg-yellow-500/30 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 bg-component-bg-light dark:bg-component-bg-dark rounded-lg shadow-lg dark:shadow-neutral-900/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
} 