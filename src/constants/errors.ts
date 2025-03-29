export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'You are not authorized to access this resource',
    SESSION_EXPIRED: 'Your session has expired. Please login again',
  },
  DOCUMENT: {
    UPLOAD_FAILED: 'Failed to upload document',
    FILE_TOO_LARGE: 'File size exceeds the maximum limit',
    INVALID_TYPE: 'File type is not allowed',
    NOT_FOUND: 'Document not found',
  },
  SERVER: {
    INTERNAL_ERROR: 'An internal server error occurred',
    SERVICE_UNAVAILABLE: 'Service is temporarily unavailable',
  },
} as const;

export const ERROR_CODES = {
  AUTH: {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
  },
  DOCUMENT: {
    UPLOAD_FAILED: 400,
    FILE_TOO_LARGE: 413,
    INVALID_TYPE: 415,
    NOT_FOUND: 404,
  },
  SERVER: {
    INTERNAL_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  },
} as const; 