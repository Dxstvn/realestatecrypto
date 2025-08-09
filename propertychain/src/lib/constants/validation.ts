/**
 * Validation Constants
 * Input validation rules and limits
 */

export const VALIDATION = {
  // User fields
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  EMAIL_MAX_LENGTH: 255,
  
  // Property fields
  PROPERTY_TITLE_MAX: 200,
  PROPERTY_DESCRIPTION_MAX: 5000,
  PROPERTY_MIN_PRICE: 1000,
  PROPERTY_MAX_PRICE: 100000000,
  MIN_TOKEN_PRICE: 1,
  MAX_TOKEN_PRICE: 100000,
  
  // Investment limits
  MIN_INVESTMENT: 100,
  MAX_INVESTMENT: 10000000,
  MAX_TOKENS_PER_TRANSACTION: 10000,
  
  // File uploads
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf'],
  MAX_IMAGES_PER_PROPERTY: 20,
  
  // Rate limiting
  MAX_REQUESTS_PER_MINUTE: 60,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  
  // Pagination
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
  
  // Search
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_LENGTH: 100,
} as const

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  POSTAL_CODE: /^[A-Z0-9]{3,10}$/i,
  ETHEREUM_ADDRESS: /^0x[a-fA-F0-9]{40}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
} as const