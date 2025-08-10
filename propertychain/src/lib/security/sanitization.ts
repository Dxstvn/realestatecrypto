/**
 * Input Sanitization Utilities - PropertyChain
 * 
 * Comprehensive input sanitization and validation
 * Following UpdatedUIPlan.md Step 66 specifications and CLAUDE.md principles
 */

import DOMPurify from 'isomorphic-dompurify'
import validator from 'validator'

/**
 * Sanitization options
 */
interface SanitizeOptions {
  allowTags?: string[]
  allowAttributes?: Record<string, string[]>
  stripTags?: boolean
  escapeHtml?: boolean
  maxLength?: number
  trimWhitespace?: boolean
}

/**
 * Validation result
 */
interface ValidationResult {
  isValid: boolean
  sanitized: string
  errors: string[]
  warnings: string[]
}

/**
 * Input Sanitizer class
 */
export class InputSanitizer {
  private static instance: InputSanitizer
  
  private constructor() {}
  
  static getInstance(): InputSanitizer {
    if (!InputSanitizer.instance) {
      InputSanitizer.instance = new InputSanitizer()
    }
    return InputSanitizer.instance
  }
  
  /**
   * Sanitize HTML content
   */
  sanitizeHTML(
    input: string, 
    options: SanitizeOptions = {}
  ): string {
    if (!input || typeof input !== 'string') {
      return ''
    }
    
    let sanitized = input
    
    // Trim whitespace if requested
    if (options.trimWhitespace !== false) {
      sanitized = sanitized.trim()
    }
    
    // Apply max length
    if (options.maxLength) {
      sanitized = sanitized.slice(0, options.maxLength)
    }
    
    // Strip all tags if requested
    if (options.stripTags) {
      sanitized = sanitized.replace(/<[^>]*>/g, '')
    } else {
      // Use DOMPurify for safe HTML sanitization
      const config: any = {
        ALLOWED_TAGS: options.allowTags || [
          'p', 'br', 'strong', 'em', 'u', 's', 'a', 'ul', 'ol', 'li',
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'
        ],
        ALLOWED_ATTR: options.allowAttributes || {
          'a': ['href', 'title', 'target'],
          '*': ['class', 'id']
        },
        FORBID_TAGS: ['script', 'object', 'embed', 'iframe', 'frame'],
        FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
      }
      
      sanitized = DOMPurify.sanitize(sanitized, config) as unknown as string
    }
    
    // Escape remaining HTML if requested
    if (options.escapeHtml) {
      sanitized = this.escapeHtml(sanitized)
    }
    
    return sanitized
  }
  
  /**
   * Sanitize plain text
   */
  sanitizeText(input: string, maxLength?: number): string {
    if (!input || typeof input !== 'string') {
      return ''
    }
    
    let sanitized = input
      .trim()
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
      .replace(/\s+/g, ' ') // Normalize whitespace
    
    if (maxLength) {
      sanitized = sanitized.slice(0, maxLength)
    }
    
    return sanitized
  }
  
  /**
   * Sanitize email address
   */
  sanitizeEmail(input: string): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    
    if (!input || typeof input !== 'string') {
      errors.push('Email is required')
      return { isValid: false, sanitized: '', errors, warnings }
    }
    
    let sanitized = input.toLowerCase().trim()
    
    // Basic format validation
    if (!validator.isEmail(sanitized)) {
      errors.push('Invalid email format')
    }
    
    // Additional security checks
    if (sanitized.includes('..')) {
      errors.push('Email contains consecutive dots')
    }
    
    if (sanitized.length > 254) {
      errors.push('Email too long (max 254 characters)')
      sanitized = sanitized.slice(0, 254)
    }
    
    // Check for dangerous patterns
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /onload=/i,
      /onerror=/i,
    ]
    
    for (const pattern of dangerousPatterns) {
      if (pattern.test(sanitized)) {
        errors.push('Email contains potentially dangerous content')
        break
      }
    }
    
    return {
      isValid: errors.length === 0,
      sanitized,
      errors,
      warnings,
    }
  }
  
  /**
   * Sanitize URL
   */
  sanitizeURL(input: string): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    
    if (!input || typeof input !== 'string') {
      errors.push('URL is required')
      return { isValid: false, sanitized: '', errors, warnings }
    }
    
    let sanitized = input.trim()
    
    // Add protocol if missing
    if (!sanitized.match(/^https?:\/\//)) {
      sanitized = 'https://' + sanitized
    }
    
    // Validate URL format
    if (!validator.isURL(sanitized, {
      protocols: ['http', 'https'],
      require_protocol: true,
    })) {
      errors.push('Invalid URL format')
    }
    
    // Security checks
    try {
      const url = new URL(sanitized)
      
      // Block dangerous protocols
      if (!['http:', 'https:'].includes(url.protocol)) {
        errors.push('Only HTTP and HTTPS protocols are allowed')
      }
      
      // Block localhost and private IPs in production
      if (process.env.NODE_ENV === 'production') {
        if (url.hostname === 'localhost' || 
            url.hostname === '127.0.0.1' ||
            url.hostname.startsWith('192.168.') ||
            url.hostname.startsWith('10.') ||
            url.hostname.startsWith('172.')) {
          errors.push('Private IP addresses and localhost not allowed')
        }
      }
      
      // Check for URL shorteners (potential security risk)
      const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly']
      if (shorteners.includes(url.hostname)) {
        warnings.push('URL shorteners may pose security risks')
      }
      
    } catch (error) {
      errors.push('Malformed URL')
    }
    
    return {
      isValid: errors.length === 0,
      sanitized,
      errors,
      warnings,
    }
  }
  
  /**
   * Sanitize phone number
   */
  sanitizePhone(input: string, locale = 'US'): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    
    if (!input || typeof input !== 'string') {
      errors.push('Phone number is required')
      return { isValid: false, sanitized: '', errors, warnings }
    }
    
    // Remove all non-numeric characters except +
    let sanitized = input.replace(/[^\d+]/g, '')
    
    // Validate phone number
    if (!validator.isMobilePhone(sanitized, locale as any)) {
      errors.push('Invalid phone number format')
    }
    
    return {
      isValid: errors.length === 0,
      sanitized,
      errors,
      warnings,
    }
  }
  
  /**
   * Sanitize filename
   */
  sanitizeFilename(input: string): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    
    if (!input || typeof input !== 'string') {
      errors.push('Filename is required')
      return { isValid: false, sanitized: '', errors, warnings }
    }
    
    let sanitized = input
      .trim()
      // Remove path traversal attempts
      .replace(/\.\./g, '')
      .replace(/[\/\\]/g, '')
      // Remove dangerous characters
      .replace(/[<>:"|?*\x00-\x1f]/g, '')
      // Normalize whitespace
      .replace(/\s+/g, '_')
    
    // Check length
    if (sanitized.length > 255) {
      sanitized = sanitized.slice(0, 255)
      warnings.push('Filename truncated to 255 characters')
    }
    
    // Check for reserved names (Windows)
    const reserved = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9']
    if (reserved.includes(sanitized.toUpperCase())) {
      sanitized = `file_${sanitized}`
      warnings.push('Filename was reserved, prefixed with "file_"')
    }
    
    // Ensure filename is not empty after sanitization
    if (!sanitized) {
      sanitized = 'unnamed_file'
      warnings.push('Filename was empty after sanitization, using default')
    }
    
    return {
      isValid: errors.length === 0,
      sanitized,
      errors,
      warnings,
    }
  }
  
  /**
   * Sanitize JSON input
   */
  sanitizeJSON(input: string, maxDepth = 10): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    
    if (!input || typeof input !== 'string') {
      errors.push('JSON input is required')
      return { isValid: false, sanitized: '{}', errors, warnings }
    }
    
    let sanitized = input.trim()
    
    try {
      // Parse JSON to validate structure
      const parsed = JSON.parse(sanitized)
      
      // Check for prototype pollution attempts
      if (this.hasPrototypePollution(parsed)) {
        errors.push('JSON contains potentially dangerous prototype pollution')
      }
      
      // Check depth
      if (this.getObjectDepth(parsed) > maxDepth) {
        errors.push(`JSON exceeds maximum depth of ${maxDepth}`)
      }
      
      // Re-stringify to normalize format
      sanitized = JSON.stringify(parsed)
      
    } catch (error) {
      errors.push('Invalid JSON format')
    }
    
    return {
      isValid: errors.length === 0,
      sanitized,
      errors,
      warnings,
    }
  }
  
  /**
   * Sanitize SQL-like input
   */
  sanitizeSQL(input: string): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    
    if (!input || typeof input !== 'string') {
      return { isValid: true, sanitized: '', errors, warnings }
    }
    
    let sanitized = input.trim()
    
    // Check for SQL injection patterns
    const sqlInjectionPatterns = [
      /('|(\\'))|(;)|(\|)|(\*)|(%)|(--)|(\+)|(\||\\)/i,
      /union\s+select/i,
      /insert\s+into/i,
      /delete\s+from/i,
      /drop\s+table/i,
      /update\s+set/i,
      /exec\s*\(/i,
      /script\s*>/i,
    ]
    
    for (const pattern of sqlInjectionPatterns) {
      if (pattern.test(sanitized)) {
        errors.push('Input contains potentially dangerous SQL patterns')
        break
      }
    }
    
    // Escape single quotes
    sanitized = sanitized.replace(/'/g, "''")
    
    return {
      isValid: errors.length === 0,
      sanitized,
      errors,
      warnings,
    }
  }
  
  /**
   * Escape HTML characters
   */
  private escapeHtml(input: string): string {
    const htmlEscapes: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    }
    
    return input.replace(/[&<>"'\/]/g, char => htmlEscapes[char])
  }
  
  /**
   * Check for prototype pollution
   */
  private hasPrototypePollution(obj: any): boolean {
    if (obj && typeof obj === 'object') {
      if ('__proto__' in obj || 'constructor' in obj || 'prototype' in obj) {
        return true
      }
      
      for (const key in obj) {
        if (this.hasPrototypePollution(obj[key])) {
          return true
        }
      }
    }
    
    return false
  }
  
  /**
   * Get object depth
   */
  private getObjectDepth(obj: any): number {
    if (obj === null || typeof obj !== 'object') {
      return 0
    }
    
    let maxDepth = 0
    for (const key in obj) {
      const depth = this.getObjectDepth(obj[key])
      maxDepth = Math.max(maxDepth, depth)
    }
    
    return maxDepth + 1
  }
}

/**
 * Global sanitizer instance
 */
export const sanitizer = InputSanitizer.getInstance()

/**
 * Utility functions for common sanitization tasks
 */
export const sanitizeHTML = (input: string, options?: SanitizeOptions) => 
  sanitizer.sanitizeHTML(input, options)

export const sanitizeText = (input: string, maxLength?: number) => 
  sanitizer.sanitizeText(input, maxLength)

export const sanitizeEmail = (input: string) => 
  sanitizer.sanitizeEmail(input)

export const sanitizeURL = (input: string) => 
  sanitizer.sanitizeURL(input)

export const sanitizePhone = (input: string, locale?: string) => 
  sanitizer.sanitizePhone(input, locale)

export const sanitizeFilename = (input: string) => 
  sanitizer.sanitizeFilename(input)

export const sanitizeJSON = (input: string, maxDepth?: number) => 
  sanitizer.sanitizeJSON(input, maxDepth)

export const sanitizeSQL = (input: string) => 
  sanitizer.sanitizeSQL(input)

/**
 * Batch sanitization for form data
 */
export function sanitizeFormData(
  data: Record<string, any>,
  rules: Record<string, {
    type: 'text' | 'html' | 'email' | 'url' | 'phone' | 'filename' | 'json' | 'sql'
    options?: any
  }>
): {
  sanitized: Record<string, any>
  errors: Record<string, string[]>
  warnings: Record<string, string[]>
} {
  const sanitized: Record<string, any> = {}
  const errors: Record<string, string[]> = {}
  const warnings: Record<string, string[]> = {}
  
  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field]
    
    if (value !== undefined && value !== null) {
      let result: ValidationResult
      
      switch (rule.type) {
        case 'text':
          result = {
            isValid: true,
            sanitized: sanitizer.sanitizeText(value, rule.options?.maxLength),
            errors: [],
            warnings: [],
          }
          break
        case 'html':
          result = {
            isValid: true,
            sanitized: sanitizer.sanitizeHTML(value, rule.options),
            errors: [],
            warnings: [],
          }
          break
        case 'email':
          result = sanitizer.sanitizeEmail(value)
          break
        case 'url':
          result = sanitizer.sanitizeURL(value)
          break
        case 'phone':
          result = sanitizer.sanitizePhone(value, rule.options?.locale)
          break
        case 'filename':
          result = sanitizer.sanitizeFilename(value)
          break
        case 'json':
          result = sanitizer.sanitizeJSON(value, rule.options?.maxDepth)
          break
        case 'sql':
          result = sanitizer.sanitizeSQL(value)
          break
        default:
          result = {
            isValid: true,
            sanitized: String(value),
            errors: [],
            warnings: [],
          }
      }
      
      sanitized[field] = result.sanitized
      if (result.errors.length > 0) {
        errors[field] = result.errors
      }
      if (result.warnings.length > 0) {
        warnings[field] = result.warnings
      }
    }
  }
  
  return { sanitized, errors, warnings }
}

export default sanitizer