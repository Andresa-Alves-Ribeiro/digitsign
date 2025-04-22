import React from 'react';
import { DocumentStatus } from '@/types/enums/document';

export const documentStatusConfig: Record<DocumentStatus, {
    label: string;
    color: string;
    icon: React.ReactNode;
}> = {
  [DocumentStatus.DRAFT]: {
    label: 'Rascunho',
    color: 'text-gray-700 bg-gray-100 border border-gray-200',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
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
} as const;

export const getStatusConfig = (status: string): {
  label: string;
  color: string;
  icon: React.ReactNode;
} => {
  // Verifica se o status é um valor válido do enum
  if (Object.values(DocumentStatus).includes(status as DocumentStatus)) {
    return documentStatusConfig[status as DocumentStatus];
  }
  
  // Verifica se o status é 'SIGNED' (independente de maiúsculas/minúsculas)
  if (status.toUpperCase() === 'SIGNED') {
    return documentStatusConfig[DocumentStatus.SIGNED];
  }
  
  // Verifica se o status é 'PENDING' (independente de maiúsculas/minúsculas)
  if (status.toUpperCase() === 'PENDING') {
    return documentStatusConfig[DocumentStatus.PENDING];
  }
  
  // Verifica se o status é 'REJECTED' (independente de maiúsculas/minúsculas)
  if (status.toUpperCase() === 'REJECTED') {
    return documentStatusConfig[DocumentStatus.REJECTED];
  }
  
  // Verifica se o status é 'EXPIRED' (independente de maiúsculas/minúsculas)
  if (status.toUpperCase() === 'EXPIRED') {
    return documentStatusConfig[DocumentStatus.EXPIRED];
  }
  
  // Verifica se o status é 'DRAFT' (independente de maiúsculas/minúsculas)
  if (status.toUpperCase() === 'DRAFT') {
    return documentStatusConfig[DocumentStatus.DRAFT];
  }
  
  // Retorna o status padrão se nenhuma correspondência for encontrada
  return documentStatusConfig[DocumentStatus.PENDING];
};

export const isValidStatus = (status: string): status is DocumentStatus => {
  return Object.values(DocumentStatus).includes(status as DocumentStatus);
};