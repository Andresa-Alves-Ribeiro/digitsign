export enum DocumentStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  SIGNED = 'SIGNED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST'
}

export enum SignatureType {
  DIGITAL = 'DIGITAL',
  MANUAL = 'MANUAL'
}

export enum DocumentType {
  CONTRACT = 'CONTRACT',
  AGREEMENT = 'AGREEMENT',
  PROPOSAL = 'PROPOSAL',
  REPORT = 'REPORT',
  OTHER = 'OTHER'
}

export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

export enum ApiResponseStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  LOADING = 'LOADING'
}

export enum DocumentAction {
  VIEW = 'VIEW',
  SIGN = 'SIGN',
  DELETE = 'DELETE',
  DOWNLOAD = 'DOWNLOAD'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export enum NotificationType {
  DOCUMENT_CREATED = 'DOCUMENT_CREATED',
  DOCUMENT_UPDATED = 'DOCUMENT_UPDATED',
  DOCUMENT_SIGNED = 'DOCUMENT_SIGNED',
  DOCUMENT_REJECTED = 'DOCUMENT_REJECTED',
  DOCUMENT_EXPIRED = 'DOCUMENT_EXPIRED'
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum Theme {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  SYSTEM = 'SYSTEM'
}

export enum Language {
  PT_BR = 'PT_BR',
  EN_US = 'EN_US',
  ES_ES = 'ES_ES'
}

export enum LoadingSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
} 