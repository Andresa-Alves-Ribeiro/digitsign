import React from 'react';

export type DocumentStatus = 'PENDING' | 'SIGNED' | 'REJECTED' | 'EXPIRED';

export const documentStatus = {
    PENDING: 'PENDING',
    SIGNED: 'SIGNED',
    REJECTED: 'REJECTED',
    EXPIRED: 'EXPIRED',
} as const;

export const documentStatusConfig = {
    [documentStatus.PENDING]: {
        label: 'Pendente',
        color: 'bg-yellow-100 text-yellow-800',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    [documentStatus.SIGNED]: {
        label: 'Assinado',
        color: 'bg-green-100 text-green-800',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
    },
    [documentStatus.REJECTED]: {
        label: 'Rejeitado',
        color: 'bg-red-100 text-red-800',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
    },
    [documentStatus.EXPIRED]: {
        label: 'Expirado',
        color: 'bg-gray-100 text-gray-800',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
} as const;

export const getStatusConfig = (status: DocumentStatus) => {
    return documentStatusConfig[status] || documentStatusConfig[documentStatus.PENDING];
};

export const isValidStatus = (status: string): status is DocumentStatus => {
    return Object.values(documentStatus).includes(status as DocumentStatus);
}; 