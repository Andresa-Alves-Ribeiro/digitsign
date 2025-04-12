import React from 'react';
import { DocumentStatus } from '@/types/enums';

export const documentStatusConfig: Record<DocumentStatus, {
    label: string;
    color: string;
    icon: React.ReactNode;
}> = {
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
  }
} as const;

export const getStatusConfig = (status: string): {
  label: string;
  color: string;
  icon: React.ReactNode;
} => {
  return documentStatusConfig[status as DocumentStatus] || documentStatusConfig[DocumentStatus.PENDING];
};

export const isValidStatus = (status: string): status is DocumentStatus => {
  return Object.values(DocumentStatus).includes(status as DocumentStatus);
};