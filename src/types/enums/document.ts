export enum DocumentStatus {
    PENDING = 'PENDING',
    SIGNED = 'SIGNED',
    REJECTED = 'REJECTED',
    EXPIRED = 'EXPIRED'
}

export const statusLabels: Record<DocumentStatus, string> = {
  [DocumentStatus.PENDING]: 'Pendente',
  [DocumentStatus.SIGNED]: 'Assinado',
  [DocumentStatus.REJECTED]: 'Rejeitado',
  [DocumentStatus.EXPIRED]: 'Expirado'
};

export interface Document {
    id: string;
    name: string;
    status: DocumentStatus;
    size?: number;
    createdAt: string;
    fileKey: string;
    userId: string;
    mimeType?: string;
} 