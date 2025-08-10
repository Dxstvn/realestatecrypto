/**
 * Application Constants - PropertyChain
 * 
 * Central location for all application constants following RECOVERY_PLAN.md
 * Ensures consistency across the entire application
 */

// Application Routes
export const ROUTES = {
  // Public Pages
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Properties
  PROPERTIES: '/properties',
  EXPLORE: '/properties/explore',
  PROPERTY_DETAIL: '/properties/:id',
  COMPARE: '/properties/compare',
  
  // Investment Flow
  INVEST: '/invest/:propertyId',
  KYC: '/kyc',
  TRANSACTION: '/transaction',
  
  // Dashboards
  INVESTOR_DASHBOARD: '/dashboard/investor',
  OWNER_DASHBOARD: '/dashboard/owner',
  ADMIN_DASHBOARD: '/dashboard/admin',
  
  // User Account
  SETTINGS: '/settings',
  PROFILE: '/profile',
  PORTFOLIO: '/portfolio',
  TRANSACTIONS: '/transactions',
  DOCUMENTS: '/documents',
  
  // Support & Info
  HOW_IT_WORKS: '/how-it-works',
  ABOUT: '/about',
  CONTACT: '/contact',
  HELP: '/help',
  FAQ: '/faq',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  
  // API Routes
  API: {
    AUTH: '/api/auth',
    PROPERTIES: '/api/properties',
    INVESTMENTS: '/api/investments',
    USERS: '/api/users',
    DOCUMENTS: '/api/documents',
    NOTIFICATIONS: '/api/notifications',
    ANALYTICS: '/api/analytics',
  }
} as const

// Authentication States
export const AUTH_STATES = {
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  ERROR: 'error',
} as const

// User Roles
export const USER_ROLES = {
  INVESTOR: 'investor',
  PROPERTY_OWNER: 'property_owner',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const

// KYC Status
export const KYC_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  PENDING_REVIEW: 'pending_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
} as const

// Property Status
export const PROPERTY_STATUS = {
  DRAFT: 'draft',
  PENDING_APPROVAL: 'pending_approval',
  ACTIVE: 'active',
  FUNDED: 'funded',
  SOLD: 'sold',
  INACTIVE: 'inactive',
} as const

// Investment Status
export const INVESTMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  CONFIRMED: 'confirmed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const

// Transaction Types
export const TRANSACTION_TYPES = {
  INVESTMENT: 'investment',
  WITHDRAWAL: 'withdrawal',
  DIVIDEND: 'dividend',
  FEE: 'fee',
  REFUND: 'refund',
} as const

// Payment Methods
export const PAYMENT_METHODS = {
  CRYPTO: 'crypto',
  WIRE: 'wire',
  ACH: 'ach',
  CREDIT_CARD: 'credit_card',
} as const

// Notification Types
export const NOTIFICATION_TYPES = {
  SYSTEM: 'system',
  INVESTMENT: 'investment',
  PROPERTY: 'property',
  DOCUMENT: 'document',
  PAYMENT: 'payment',
  KYC: 'kyc',
  GENERAL: 'general',
} as const

// Time Constants
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000,
} as const

// Animation Durations (following Section 0 principles)
export const ANIMATION = {
  INSTANT: 0,
  FAST: 150,
  NORMAL: 200,
  SLOW: 300,
  VERY_SLOW: 500,
} as const

// Breakpoints (following Section 0 responsive design)
export const BREAKPOINTS = {
  XS: 375,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1440,
} as const

// Z-Index Layers (following Section 0 layering)
export const Z_INDEX = {
  BASE: 0,
  DROPDOWN: 50,
  STICKY: 100,
  FIXED: 200,
  MODAL_BACKDROP: 250,
  MODAL: 300,
  POPOVER: 400,
  TOOLTIP: 450,
  TOAST: 500,
  NOTIFICATION: 550,
  COMMAND: 600,
} as const

// Form Validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  BIO_MAX_LENGTH: 500,
  COMMENT_MAX_LENGTH: 1000,
} as const

// File Upload Limits
export const FILE_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  DOCUMENT_MAX_SIZE: 20 * 1024 * 1024, // 20MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const

// Currency
export const CURRENCY = {
  DEFAULT: 'USD',
  SYMBOL: '$',
  DECIMALS: 2,
} as const

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'MM/DD/YYYY',
  LONG: 'MMMM DD, YYYY',
  WITH_TIME: 'MM/DD/YYYY HH:mm',
  TIME_ONLY: 'HH:mm',
  ISO: 'YYYY-MM-DD',
} as const

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  GENERIC: 'Operation completed successfully.',
  SAVED: 'Changes saved successfully.',
  DELETED: 'Item deleted successfully.',
  SENT: 'Message sent successfully.',
  COPIED: 'Copied to clipboard.',
  UPLOADED: 'File uploaded successfully.',
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
  RECENT_SEARCHES: 'recent_searches',
  SAVED_FILTERS: 'saved_filters',
} as const

// Environment Variables
export const ENV = {
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_TEST: process.env.NODE_ENV === 'test',
  API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  BLOCKCHAIN_NETWORK: process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK || 'mainnet',
  WALLET_CONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
} as const

// Feature Flags
export const FEATURES = {
  ENABLE_WALLET_CONNECT: true,
  ENABLE_CHAT: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: true,
  ENABLE_SOCIAL_SHARING: true,
  ENABLE_REFERRALS: false,
  ENABLE_SECONDARY_MARKET: false,
} as const

export default {
  ROUTES,
  AUTH_STATES,
  USER_ROLES,
  KYC_STATUS,
  PROPERTY_STATUS,
  INVESTMENT_STATUS,
  TRANSACTION_TYPES,
  PAYMENT_METHODS,
  NOTIFICATION_TYPES,
  TIME,
  ANIMATION,
  BREAKPOINTS,
  Z_INDEX,
  VALIDATION,
  FILE_LIMITS,
  PAGINATION,
  CURRENCY,
  DATE_FORMATS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  ENV,
  FEATURES,
}