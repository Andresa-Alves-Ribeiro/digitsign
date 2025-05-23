import { User } from './user';
import { Document } from './document';

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
  onSave: (signature: string) => Promise<void>;
  onCancel: () => void;
}

export interface SignatureCardProps {
  signature: Signature;
  onView?: () => void;
  onDelete?: () => void;
} 