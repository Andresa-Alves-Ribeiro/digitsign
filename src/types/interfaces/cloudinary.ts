// Cloudinary Domain
export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  format: string;
  resource_type: string;
  bytes: number;
  width: number;
  height: number;
}

export interface CloudinaryCheckResponse {
  configured: boolean;
  error?: string;
}

export interface CloudinaryDocumentCheckResponse {
  exists: boolean;
  error?: string;
}

export interface CloudinaryUploadOptions {
  resource_type?: 'auto' | 'image' | 'video' | 'raw';
  folder?: string;
  allowed_formats?: string[];
  max_bytes?: number;
} 

export interface CloudinaryCheckProps {
  children: React.ReactNode;
}