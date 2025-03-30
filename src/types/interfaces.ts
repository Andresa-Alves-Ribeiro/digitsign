// User Domain
export interface User {
  id: string;
  email: string;
  name: string;
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
  mimeType: string | null;
  size: number | null;
  createdAt: Date;
  updatedAt: Date;
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
  loading: boolean;
  error: string | null;
}

// Signature Domain
export interface Signature {
  id: string;
  documentId: string;
  userId: string;
  signatureData: string;
  createdAt: Date;
  document?: Document;
  user?: User;
}

export interface SignaturePadProps {
  onSave: (signatureData: string) => void;
  onClear?: () => void;
}

// Auth Domain
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name: string;
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
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
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
}

export interface DocumentTableProps {
  documents: Document[];
  onDelete: (id: string) => void;
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
  rejectedDocuments: number;
}

// Extended Types
export interface ExtendedCanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  ref?: React.RefObject<HTMLCanvasElement>;
} 