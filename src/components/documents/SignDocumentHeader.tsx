import React from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { BackButton } from '@/components/ui/BackButton';

interface SignDocumentHeaderProps {
  documentId: string;
}

const SignDocumentHeader: React.FC<SignDocumentHeaderProps> = ({ documentId }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div className="flex items-center space-x-4">
        <div className="bg-green-50 dark:bg-green-900/30 p-2.5 sm:p-3 rounded-lg">
          <DocumentTextIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">Assinar Documento</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-sm text-neutral-500 dark:text-neutral-400">ID do Documento:</span>
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-700 px-2.5 py-1 rounded-md break-all">{documentId}</span>
          </div>
        </div>
      </div>
      <BackButton />
    </div>
  );
};

export default SignDocumentHeader; 