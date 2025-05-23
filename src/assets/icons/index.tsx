import React from 'react';
import {
  ChevronDownIcon,
  DocumentTextIcon,
  CheckIcon as HeroCheckIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  TrashIcon as HeroTrashIcon,
  ArrowRightStartOnRectangleIcon,
  UserIcon as HeroUserIcon,
  XCircleIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

interface IconProps {
  className?: string;
}

export const LoadingSpinner: React.FC<IconProps> = ({ className = 'h-4 w-4' }) => (
  <div className={`${className} relative`}>
    <div className="absolute inset-0 border-2 border-neutral-300 rounded-full"></div>
    <div className="absolute inset-0 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
  </div>
);

export const DropDownIcon: React.FC<IconProps> = ({ className = 'h-4 w-4' }) => (
  <ChevronDownIcon className={className} />
);

export const DocumentIcon: React.FC<IconProps> = ({ className = 'h-4 w-4' }) => (
  <DocumentTextIcon className={className} />
);

export const PdfIcon: React.FC<IconProps> = ({ className = 'h-4 w-4' }) => (
  <DocumentArrowDownIcon className={className} />
);

export const CheckIcon: React.FC<IconProps> = ({ className = 'h-5 w-5' }) => (
  <HeroCheckIcon className={className} />
);

export const XIcon: React.FC<IconProps> = ({ className = 'h-5 w-5' }) => (
  <XMarkIcon className={className} />
);

export const UploadIcon: React.FC<IconProps> = ({ className = 'h-5 w-5' }) => (
  <ArrowUpTrayIcon className={className} />
);

export const TrashIcon: React.FC<IconProps> = ({ className = 'h-5 w-5' }) => (
  <HeroTrashIcon className={className} />
);

export const ArrowRightIcon: React.FC<IconProps> = ({ className = 'h-4 w-4' }) => (
  <ChevronDownIcon className={`${className} rotate-[-90deg]`} />
);

export const LogoutIcon: React.FC<IconProps> = ({ className = 'h-4 w-4' }) => (
  <ArrowRightStartOnRectangleIcon className={className} />
);

export const UserIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <HeroUserIcon className={className} />
);

export const CloseIcon: React.FC<IconProps> = ({ className = 'w-7 h-7' }) => (
  <XCircleIcon className={className} />
);

export const FileIcon: React.FC<IconProps> = ({ className = 'h-10 w-10' }) => (
  <DocumentIcon className={className} />
); 