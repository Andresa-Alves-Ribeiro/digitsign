import React from 'react';
import { DocumentStatus } from '@/types/enums/document';

type StatusConfig = {
  label: string;
  color: string;
  icon: React.ReactNode;
};

export const documentStatusConfig: Record<DocumentStatus, StatusConfig> = {
  [DocumentStatus.PENDING]: {
    label: 'Pendente',
    color: 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  [DocumentStatus.SIGNED]: {
    label: 'Assinado',
    color: 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  }
};

export const getStatusConfig = (status: string): StatusConfig => {
  const normalizedStatus = status.toUpperCase() as DocumentStatus;
  
  if (isValidStatus(normalizedStatus)) {
    return documentStatusConfig[normalizedStatus];
  }
  
  // Return default status if no match is found
  return documentStatusConfig[DocumentStatus.PENDING];
};

export const isValidStatus = (status: string): status is DocumentStatus => {
  return Object.values(DocumentStatus).includes(status as DocumentStatus);
};