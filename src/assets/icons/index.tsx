import React from 'react';
import { 
  Spinner,
  CaretDown,
  FileText,
  Check,
  X,
  UploadSimple,
  Trash,
  CaretRight,
  SignOut,
  User,
  XCircle,
  File,
  FilePdf
} from '@phosphor-icons/react';

interface IconProps {
  className?: string;
}

export const LoadingSpinner: React.FC<IconProps> = ({ className = "h-4 w-4" }) => (
  <Spinner className={className} weight="bold" />
);

export const DropDownIcon: React.FC<IconProps> = ({ className = "h-4 w-4" }) => (
  <CaretDown className={className} weight="bold" />
);

export const DocumentIcon: React.FC<IconProps> = ({ className = "h-4 w-4" }) => (
  <FileText className={className} weight="bold" />
);

export const PdfIcon: React.FC<IconProps> = ({ className = "h-4 w-4" }) => (
  <FilePdf className={className} weight="bold" />
);

export const CheckIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => (
  <Check className={className} weight="bold" />
);

export const XIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => (
  <X className={className} weight="bold" />
);

export const UploadIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => (
  <UploadSimple className={className} weight="bold" />
);

export const TrashIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => (
  <Trash className={className} weight="bold" />
);

export const ArrowRightIcon: React.FC<IconProps> = ({ className = "h-4 w-4" }) => (
  <CaretRight className={className} weight="bold" />
);

export const LogoutIcon: React.FC<IconProps> = ({ className = "h-4 w-4" }) => (
  <SignOut className={className} weight="bold" />
);

export const UserIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <User className={className} weight="bold" />
);

export const CloseIcon: React.FC<IconProps> = ({ className = "w-7 h-7" }) => (
  <XCircle className={className} weight="bold" />
);

export const FileIcon: React.FC<IconProps> = ({ className = "h-10 w-10" }) => (
  <File className={className} weight="bold" />
); 