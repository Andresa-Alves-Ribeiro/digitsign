import React from 'react';
import { motion } from 'framer-motion';

interface DocumentContainerProps {
  children: React.ReactNode;
}

const DocumentContainer: React.FC<DocumentContainerProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center py-4 sm:py-6 lg:py-8">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg">
          <div className="px-4 py-5 sm:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentContainer; 