import { Document } from './document';

export interface DashboardStats {
  totalDocuments: number;
  pendingDocuments: number;
  signedDocuments: number;
  recentDocuments: Document[];
} 