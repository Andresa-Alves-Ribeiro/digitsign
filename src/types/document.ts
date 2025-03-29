export interface Document {
  id: string;
  name: string;
  path: string;
  size: number;
  type: string;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentUploadResponse {
  success: boolean;
  document?: Document;
  error?: string;
} 