import { DocumentStatus } from '../enums/document';
import { User } from './user';
import { Signature } from './signature';

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

export interface DocumentState {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
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

export interface DocumentCardProps {
  document: Document;
  onView?: () => void;
  onDelete?: () => void;
  onSign?: () => void;
}

export interface ExtendedDocument extends Document {
  signatureCount: number;
  lastSignatureDate?: Date;
} 