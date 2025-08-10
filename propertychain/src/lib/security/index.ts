/**
 * Security Module Index - PropertyChain
 * 
 * Main exports for the comprehensive security system
 * Following UpdatedUIPlan.md Step 66 specifications and CLAUDE.md principles
 */

import crypto from 'crypto'
import { rateLimiters } from './rate-limiting'
import { csrfProtection } from './csrf'
import { sanitizer } from './sanitization'
import { authSecurity } from './auth-security'

// Rate Limiting
export { 
  RateLimiter,
  rateLimiters,
  createRateLimiter,
  rateLimit,
  ProgressiveRateLimiter,
  progressiveLimiter,
  getClientIP,
  isWhitelisted,
} from './rate-limiting'

// CSRF Protection
export {
  CSRFProtection,
  csrfProtection,
  useCSRF,
  withCSRF,
  generateCSRFToken,
  validateCSRFToken,
  CSRFToken,
  DoubleSubmitCSRF,
  doubleSubmitCSRF,
} from './csrf'

// Content Security Policy
export {
  CSPBuilder,
  generateNonce,
  getCSP,
  cspMiddleware,
  handleCSPReport,
  CSP_PRESETS,
  getCSPPreset,
} from './csp'

// Input Sanitization
export {
  InputSanitizer,
  sanitizer,
  sanitizeHTML,
  sanitizeText,
  sanitizeEmail,
  sanitizeURL,
  sanitizePhone,
  sanitizeFilename,
  sanitizeJSON,
  sanitizeSQL,
  sanitizeFormData,
} from './sanitization'

// Security Headers
export {
  SecurityHeaders,
  securityHeaders,
  SECURITY_CONFIGS,
  getSecurityHeadersForEnv,
  PAGE_CONFIGS,
  getSecurityHeadersForPage,
  applyCORSHeaders,
  createSecurityMiddleware,
} from './headers'

// Authentication Security
export {
  AuthSecurityManager,
  authSecurity,
  MFAManager,
} from './auth-security'

// Re-export types
// Note: AlertSeverity type is not available in rate-limiting module
export type { CSPReport } from './csp'
// Note: ValidationResult and SanitizeOptions are not exported from sanitization module
export type { CORSConfig } from './headers'
// Note: SecurityHeadersConfig is not exported from headers module
// Note: SessionConfig and RiskAssessment are not exported from auth-security module

/**
 * Security utility functions
 */

/**
 * Generate cryptographically secure random string
 */
export function generateSecureToken(length = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

/**
 * Generate UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * Time-safe string comparison
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }
  
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  
  return result === 0
}

/**
 * Hash password with salt (bcrypt wrapper)
 */
export async function hashPassword(password: string, saltRounds = 12): Promise<string> {
  // This would use bcrypt in a real implementation
  // For now, return a placeholder
  const crypto = require('crypto')
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // This would use bcrypt in a real implementation
  // For now, return a placeholder verification
  const [salt, storedHash] = hash.split(':')
  const crypto = require('crypto')
  const computedHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return timingSafeEqual(computedHash, storedHash)
}

/**
 * Security middleware composition
 */
export function createSecurityMiddlewareStack() {
  return {
    rateLimit: rateLimiters.api.middleware(),
    csrf: csrfProtection.middleware(),
    // headers: securityHeaders.middleware(), // TODO: Import securityHeaders
  }
}

/**
 * Security validation for API routes
 */
export async function validateAPIRequest(request: Request): Promise<{
  valid: boolean
  errors: string[]
}> {
  const errors: string[] = []
  
  // Check rate limiting
  const rateLimitResult = await rateLimiters.api.check(request as any)
  if (!rateLimitResult.success) {
    errors.push('Rate limit exceeded')
  }
  
  // Check CSRF for unsafe methods
  if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    const csrfValid = await csrfProtection.validateRequest(request as any)
    if (!csrfValid) {
      errors.push('CSRF token validation failed')
    }
  }
  
  // Additional security checks can be added here
  
  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Security configuration based on environment
 */
export function getSecurityConfig() {
  const env = process.env.NODE_ENV || 'production'
  
  return {
    rateLimiting: {
      enabled: true,
      strict: env === 'production',
    },
    csrf: {
      enabled: env !== 'development',
      strict: env === 'production',
    },
    csp: {
      enabled: env === 'production',
      reportOnly: env === 'development',
    },
    headers: {
      hsts: env === 'production',
      frameOptions: true,
    },
    auth: {
      mfaRequired: env === 'production',
      sessionTimeout: env === 'production' ? 30 * 60 : 60 * 60, // 30 min prod, 60 min dev
    },
  }
}

export default {
  rateLimiters,
  csrfProtection,
  // securityHeaders, // TODO: Import or define securityHeaders
  sanitizer,
  authSecurity,
  generateSecureToken,
  generateUUID,
  timingSafeEqual,
  hashPassword,
  verifyPassword,
  createSecurityMiddlewareStack,
  validateAPIRequest,
  getSecurityConfig,
}