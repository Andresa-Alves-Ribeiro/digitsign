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
    color: 'text-yellow-700 bg-yellow-100 border border-yellow-200',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  [DocumentStatus.SIGNED]: {
    label: 'Assinado',
    color: 'text-green-700 bg-green-100 border border-green-200',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  [DocumentStatus.REJECTED]: {
    label: 'Rejeitado',
    color: 'text-red-700 bg-red-100 border border-red-200',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
  [DocumentStatus.EXPIRED]: {
    label: 'Expirado',
    color: 'text-orange-700 bg-orange-100 border border-orange-200',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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