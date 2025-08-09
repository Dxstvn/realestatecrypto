/**
 * API Constants
 * API endpoints and configuration
 */

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  VERSION: 'v1',
  
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      VERIFY_EMAIL: '/auth/verify-email',
    },
    
    // Properties
    PROPERTIES: {
      LIST: '/properties',
      DETAIL: '/properties/:id',
      CREATE: '/properties',
      UPDATE: '/properties/:id',
      DELETE: '/properties/:id',
      SEARCH: '/properties/search',
      FEATURED: '/properties/featured',
    },
    
    // Users
    USERS: {
      PROFILE: '/user/profile',
      UPDATE_PROFILE: '/user/profile',
      PORTFOLIO: '/user/portfolio',
      TRANSACTIONS: '/user/transactions',
      KYC: '/user/kyc',
    },
    
    // Investments
    INVESTMENTS: {
      CREATE: '/investments',
      LIST: '/investments',
      DETAIL: '/investments/:id',
      CANCEL: '/investments/:id/cancel',
    },
    
    // Admin
    ADMIN: {
      DASHBOARD: '/admin/dashboard',
      PROPERTIES: '/admin/properties',
      USERS: '/admin/users',
      TRANSACTIONS: '/admin/transactions',
      ANALYTICS: '/admin/analytics',
    },
    
    // Blockchain
    BLOCKCHAIN: {
      BALANCE: '/blockchain/balance',
      TRANSACTION: '/blockchain/transaction',
      TOKEN_METADATA: '/blockchain/token/:id',
    },
  },
  
  // HTTP Status Codes
  STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  },
  
  // Error Codes
  ERRORS: {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    RATE_LIMITED: 'RATE_LIMITED',
    SERVER_ERROR: 'SERVER_ERROR',
    BLOCKCHAIN_ERROR: 'BLOCKCHAIN_ERROR',
    INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  },
} as const