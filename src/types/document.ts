import { DocumentStatus } from './enums/document';
import { User } from './auth';

export interface Document {
  id: string;
  title: string;
  description: string;
  type: string;
  status: DocumentStatus;
  content: string;
  metadata: Record<string, string>;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
  signedAt?: Date;
  signedBy?: User;
}

export interface DocumentCreateInput {
  title: string;
  description: string;
  type: string;
  content: string;
  metadata?: Record<string, string>;
}

export interface DocumentUpdateInput {
  title?: string;
  description?: string;
  type?: string;
  content?: string;
  metadata?: Record<string, string>;
  status?: DocumentStatus;
}

export interface DocumentFilter {
  type?: string;
  status?: DocumentStatus;
  createdBy?: string;
  signedBy?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

export interface DocumentSort {
  field: keyof Document;
  order: 'asc' | 'desc';
}

export interface DocumentPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DocumentListResponse {
  items: Document[];
  pagination: DocumentPagination;
}

export interface DocumentUploadResponse {
  success: boolean;
  document?: Document;
  error?: string;
} 