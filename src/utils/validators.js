export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  return { valid: true };
};

export const validateListName = (name) => {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'List name is required' };
  }
  
  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
    return { valid: false, error: 'List name cannot be empty' };
  }
  
  if (trimmedName.length > 100) {
    return { valid: false, error: 'List name too long (max 100 characters)' };
  }
  
  return { valid: true, value: trimmedName };
};

export const validateItemName = (name) => {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Item name is required' };
  }
  
  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
    return { valid: false, error: 'Item name cannot be empty' };
  }
  
  if (trimmedName.length > 200) {
    return { valid: false, error: 'Item name too long (max 200 characters)' };
  }
  
  return { valid: true, value: trimmedName };
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential XSS vectors
    .substring(0, 500);   // Hard limit
};