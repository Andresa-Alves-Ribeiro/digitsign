export enum DocumentStatus {
    PENDING,
    SIGNED
}

export const statusLabels: Record<DocumentStatus, string> = {
  [DocumentStatus.PENDING]: 'Pendente',
  [DocumentStatus.SIGNED]: 'Assinado'
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