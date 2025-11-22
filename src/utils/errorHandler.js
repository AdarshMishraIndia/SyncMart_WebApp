const ERROR_MESSAGES = {
  'auth/user-not-found': 'No account found with this email',
  'auth/wrong-password': 'Incorrect password',
  'auth/email-already-in-use': 'Email already registered',
  'auth/weak-password': 'Password too weak (min 6 characters)',
  'auth/invalid-email': 'Invalid email address',
  'auth/popup-closed-by-user': 'Sign-in cancelled',
  'auth/cancelled-popup-request': 'Sign-in cancelled',
  'permission-denied': 'Access denied',
  'unavailable': 'Service unavailable. Check your connection',
  'not-found': 'Resource not found',
  'already-exists': 'Resource already exists',
};

export const handleFirebaseError = (error) => {
  console.error('Firebase Error:', error);
  
  if (!error) {
    return 'An unknown error occurred';
  }
  
  const errorCode = error.code || error.message;
  return ERROR_MESSAGES[errorCode] || error.message || 'An unexpected error occurred';
};

export const createErrorResult = (error) => {
  return {
    success: false,
    error: handleFirebaseError(error),
    data: null
  };
};

export const createSuccessResult = (data = null) => {
  return {
    success: true,
    error: null,
    data
  };
};

export class AppError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', details = null) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
  }
}