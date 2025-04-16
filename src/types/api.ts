import { ApiResponseStatus } from './enums';
import { NextApiRequest } from 'next';

export interface ApiResponse<T> {
  status: ApiResponseStatus;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiRequestConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  timeout?: number;
  withCredentials?: boolean;
}

export interface ApiClient {
  get: <T>(url: string, config?: ApiRequestConfig) => Promise<ApiResponse<T>>;
  post: <T>(url: string, data?: unknown, config?: ApiRequestConfig) => Promise<ApiResponse<T>>;
  put: <T>(url: string, data?: unknown, config?: ApiRequestConfig) => Promise<ApiResponse<T>>;
  delete: <T>(url: string, config?: ApiRequestConfig) => Promise<ApiResponse<T>>;
  patch: <T>(url: string, data?: unknown, config?: ApiRequestConfig) => Promise<ApiResponse<T>>;
}

export interface NextApiRequestWithFiles extends NextApiRequest {
  file?: Express.Multer.File;
} 