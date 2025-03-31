import { DocumentStatus } from './enums';

// User Domain
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  user: User;
  expires: string;
}

// Document Domain
export interface Document {
  id: string;
  name: string;
  fileKey: string;
  userId: string;
  status: DocumentStatus;
  mimeType?: string | null;
  size?: number | null;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  signature?: Signature;
}

export interface DocumentUploadResponse {
  id: string;
  name: string;
  path: string;
  type: string;
  size: number;
  mimeType: string;
}

export interface DocumentState {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
}

// Signature Domain
export interface Signature {
  id: string;
  documentId: string;
  userId: string;
  signatureImage: string;
  createdAt: Date;
  updatedAt: Date;
  document?: Document;
  user?: User;
}

export interface SignaturePadProps {
  onSave: (signatureData: string) => void;
  onClear?: () => void;
}

// Auth Domain
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  name: string;
  confirmPassword: string;
}

export interface Session {
  user: User;
  expires: string;
}

// Component Props
export interface HeaderProps {
  user?: User;
}

export interface DashboardLayoutProps {
  children: React.ReactNode;
}

export interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
}

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export interface AuthGuardProps {
  children: React.ReactNode;
}

export interface LogoutButtonProps {
  onLogout: () => void;
}

export interface DocumentCardsProps {
  documents: Document[];
  onDelete: (id: string) => void;
  onSign: (id: string) => void;
}

export interface DocumentTableProps {
  documents: Document[];
  onDelete: (id: string) => void;
  onSign: (id: string) => void;
}

export interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

// API Domain
export interface SignRequest {
  signatureData: string;
}

// Dashboard Domain
export interface DashboardStats {
  totalDocuments: number;
  pendingDocuments: number;
  signedDocuments: number;
}

// Extended Types
export interface ExtendedCanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  ref?: React.RefObject<HTMLCanvasElement>;
}

export interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export interface CardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  children?: React.ReactNode;
}

export interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface DocumentCardProps {
  document: Document;
  onView?: () => void;
  onDelete?: () => void;
  onSign?: () => void;
}

export interface SignatureCardProps {
  signature: Signature;
  onView?: () => void;
  onDelete?: () => void;
}

export interface UserMenuProps {
  user: User;
  onLogout: () => void;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ExtendedDocument extends Document {
  signatureCount: number;
  lastSignatureDate?: Date;
} 