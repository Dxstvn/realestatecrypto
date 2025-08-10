/**
 * Security Headers - PropertyChain
 * 
 * Comprehensive security headers configuration and middleware
 * Following UpdatedUIPlan.md Step 66 specifications and CLAUDE.md principles
 */

import { NextRequest, NextResponse } from 'next/server'
import { getCSP, generateNonce } from './csp'

/**
 * Security headers configuration
 */
interface SecurityHeadersConfig {
  csp?: {
    enabled: boolean
    reportOnly?: boolean
    nonce?: boolean
  }
  hsts?: {
    enabled: boolean
    maxAge?: number
    includeSubDomains?: boolean
    preload?: boolean
  }
  frameOptions?: {
    enabled: boolean
    policy?: 'DENY' | 'SAMEORIGIN' | 'ALLOW-FROM'
    allowFrom?: string
  }
  contentTypeOptions?: boolean
  referrerPolicy?: {
    enabled: boolean
    policy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url'
  }
  permissionsPolicy?: {
    enabled: boolean
    policies?: Record<string, string[]>
  }
  crossOriginPolicies?: {
    embedderPolicy?: 'unsafe-none' | 'require-corp'
    openerPolicy?: 'unsafe-none' | 'same-origin-allow-popups' | 'same-origin'
    resourcePolicy?: 'same-site' | 'same-origin' | 'cross-origin'
  }
  misc?: {
    removeServerHeader?: boolean
    removePoweredBy?: boolean
    dnsPrefetchControl?: boolean
    hidePoweredBy?: boolean
  }
}

/**
 * Default security headers configuration
 */
const DEFAULT_CONFIG: Required<SecurityHeadersConfig> = {
  csp: {
    enabled: true,
    reportOnly: false,
    nonce: true,
  },
  hsts: {
    enabled: process.env.NODE_ENV === 'production',
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  frameOptions: {
    enabled: true,
    policy: 'DENY',
  },
  contentTypeOptions: true,
  referrerPolicy: {
    enabled: true,
    policy: 'strict-origin-when-cross-origin',
  },
  permissionsPolicy: {
    enabled: true,
    policies: {
      'accelerometer': ['none'],
      'ambient-light-sensor': ['none'],
      'autoplay': ['self'],
      'battery': ['none'],
      'camera': ['none'],
      'cross-origin-isolated': ['none'],
      'display-capture': ['none'],
      'document-domain': ['none'],
      'encrypted-media': ['none'],
      'execution-while-not-rendered': ['none'],
      'execution-while-out-of-viewport': ['none'],
      'fullscreen': ['self'],
      'geolocation': ['none'],
      'gyroscope': ['none'],
      'keyboard-map': ['none'],
      'magnetometer': ['none'],
      'microphone': ['none'],
      'midi': ['none'],
      'navigation-override': ['none'],
      'payment': ['self'],
      'picture-in-picture': ['none'],
      'publickey-credentials-get': ['self'],
      'screen-wake-lock': ['none'],
      'sync-xhr': ['none'],
      'usb': ['none'],
      'web-share': ['self'],
      'xr-spatial-tracking': ['none'],
    },
  },
  crossOriginPolicies: {
    embedderPolicy: 'require-corp',
    openerPolicy: 'same-origin',
    resourcePolicy: 'same-origin',
  },
  misc: {
    removeServerHeader: true,
    removePoweredBy: true,
    dnsPrefetchControl: true,
    hidePoweredBy: true,
  },
}

/**
 * Security Headers Manager
 */
export class SecurityHeaders {
  private config: Required<SecurityHeadersConfig>
  
  constructor(config: Partial<SecurityHeadersConfig> = {}) {
    this.config = this.mergeConfig(DEFAULT_CONFIG, config)
  }
  
  /**
   * Apply all security headers to response
   */
  apply(request: NextRequest, response: NextResponse, nonce?: string): NextResponse {
    const headers = this.generateHeaders(request, nonce)
    
    // Apply headers to response
    Object.entries(headers).forEach(([name, value]) => {
      if (value) {
        response.headers.set(name, value)
      }
    })
    
    return response
  }
  
  /**
   * Generate security headers object
   */
  generateHeaders(request: NextRequest, nonce?: string): Record<string, string> {
    const headers: Record<string, string> = {}
    const isProduction = process.env.NODE_ENV === 'production'
    
    // Content Security Policy
    if (this.config.csp.enabled) {
      const cspNonce = this.config.csp.nonce ? (nonce || generateNonce()) : undefined
      const cspHeader = getCSP(cspNonce)
      
      if (this.config.csp.reportOnly) {
        headers['Content-Security-Policy-Report-Only'] = cspHeader
      } else {
        headers['Content-Security-Policy'] = cspHeader
      }
    }
    
    // HTTP Strict Transport Security
    if (this.config.hsts.enabled && isProduction) {
      let hstsValue = `max-age=${this.config.hsts.maxAge}`
      
      if (this.config.hsts.includeSubDomains) {
        hstsValue += '; includeSubDomains'
      }
      
      if (this.config.hsts.preload) {
        hstsValue += '; preload'
      }
      
      headers['Strict-Transport-Security'] = hstsValue
    }
    
    // X-Frame-Options
    if (this.config.frameOptions.enabled) {
      let frameOptionsValue = this.config.frameOptions.policy
      
      if (this.config.frameOptions.policy === 'ALLOW-FROM' && this.config.frameOptions.allowFrom) {
        frameOptionsValue = `ALLOW-FROM ${this.config.frameOptions.allowFrom}` as any
      }
      
      if (frameOptionsValue) {
        headers['X-Frame-Options'] = frameOptionsValue
      }
    }
    
    // X-Content-Type-Options
    if (this.config.contentTypeOptions) {
      headers['X-Content-Type-Options'] = 'nosniff'
    }
    
    // Referrer Policy
    if (this.config.referrerPolicy.enabled && this.config.referrerPolicy.policy) {
      headers['Referrer-Policy'] = this.config.referrerPolicy.policy
    }
    
    // Permissions Policy (formerly Feature Policy)
    if (this.config.permissionsPolicy.enabled && this.config.permissionsPolicy.policies) {
      const policies = Object.entries(this.config.permissionsPolicy.policies)
        .map(([feature, allowlist]) => {
          const allowlistStr = allowlist.map(origin => {
            if (origin === 'none') return '()'
            if (origin === 'self') return 'self'
            if (origin === '*') return '*'
            return `"${origin}"`
          }).join(' ')
          
          return `${feature}=(${allowlistStr})`
        })
      
      headers['Permissions-Policy'] = policies.join(', ')
    }
    
    // Cross-Origin Policies
    if (this.config.crossOriginPolicies.embedderPolicy) {
      headers['Cross-Origin-Embedder-Policy'] = this.config.crossOriginPolicies.embedderPolicy
    }
    
    if (this.config.crossOriginPolicies.openerPolicy) {
      headers['Cross-Origin-Opener-Policy'] = this.config.crossOriginPolicies.openerPolicy
    }
    
    if (this.config.crossOriginPolicies.resourcePolicy) {
      headers['Cross-Origin-Resource-Policy'] = this.config.crossOriginPolicies.resourcePolicy
    }
    
    // Additional security headers
    headers['X-XSS-Protection'] = '1; mode=block'
    headers['X-Permitted-Cross-Domain-Policies'] = 'none'
    headers['X-Download-Options'] = 'noopen'
    
    // DNS Prefetch Control
    if (this.config.misc.dnsPrefetchControl) {
      headers['X-DNS-Prefetch-Control'] = 'off'
    }
    
    // Remove identifying headers
    if (this.config.misc.removePoweredBy) {
      headers['X-Powered-By'] = '' // This will be removed
    }
    
    // Expect-CT (Certificate Transparency)
    if (isProduction) {
      headers['Expect-CT'] = 'max-age=86400, enforce'
    }
    
    return headers
  }
  
  /**
   * Create middleware function
   */
  middleware() {
    return (request: NextRequest) => {
      const nonce = this.config.csp.nonce ? generateNonce() : undefined
      const response = NextResponse.next()
      
      return this.apply(request, response, nonce)
    }
  }
  
  /**
   * Merge configuration objects
   */
  private mergeConfig(
    defaultConfig: Required<SecurityHeadersConfig>,
    userConfig: Partial<SecurityHeadersConfig>
  ): Required<SecurityHeadersConfig> {
    const merged = { ...defaultConfig }
    
    if (userConfig.csp) {
      merged.csp = { ...merged.csp, ...userConfig.csp }
    }
    
    if (userConfig.hsts) {
      merged.hsts = { ...merged.hsts, ...userConfig.hsts }
    }
    
    if (userConfig.frameOptions) {
      merged.frameOptions = { ...merged.frameOptions, ...userConfig.frameOptions }
    }
    
    if (userConfig.referrerPolicy) {
      merged.referrerPolicy = { ...merged.referrerPolicy, ...userConfig.referrerPolicy }
    }
    
    if (userConfig.permissionsPolicy) {
      merged.permissionsPolicy = { ...merged.permissionsPolicy, ...userConfig.permissionsPolicy }
    }
    
    if (userConfig.crossOriginPolicies) {
      merged.crossOriginPolicies = { ...merged.crossOriginPolicies, ...userConfig.crossOriginPolicies }
    }
    
    if (userConfig.misc) {
      merged.misc = { ...merged.misc, ...userConfig.misc }
    }
    
    if (userConfig.contentTypeOptions !== undefined) {
      merged.contentTypeOptions = userConfig.contentTypeOptions
    }
    
    return merged
  }
}

/**
 * Default security headers instance
 */
export const securityHeaders = new SecurityHeaders()

/**
 * Environment-specific configurations
 */
export const SECURITY_CONFIGS = {
  development: {
    csp: {
      enabled: false, // Disabled for easier development
    },
    hsts: {
      enabled: false, // No HTTPS in development
    },
    crossOriginPolicies: {
      embedderPolicy: 'unsafe-none' as const,
      openerPolicy: 'unsafe-none' as const,
      resourcePolicy: 'cross-origin' as const,
    },
  },
  
  staging: {
    csp: {
      enabled: true,
      reportOnly: true, // Report-only mode in staging
    },
    hsts: {
      enabled: true,
      maxAge: 86400, // 1 day for staging
    },
  },
  
  production: {
    csp: {
      enabled: true,
      reportOnly: false,
    },
    hsts: {
      enabled: true,
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
  },
}

/**
 * Get security headers for environment
 */
export function getSecurityHeadersForEnv(env?: string): SecurityHeaders {
  const environment = (env || process.env.NODE_ENV || 'production') as keyof typeof SECURITY_CONFIGS
  const config = SECURITY_CONFIGS[environment] || SECURITY_CONFIGS.production
  
  return new SecurityHeaders(config)
}

/**
 * Page-specific security header configurations
 */
export const PAGE_CONFIGS = {
  // API routes
  api: {
    frameOptions: {
      enabled: true,
      policy: 'DENY' as const,
    },
    crossOriginPolicies: {
      resourcePolicy: 'same-origin' as const,
    },
  },
  
  // Payment pages
  payment: {
    frameOptions: {
      enabled: true,
      policy: 'SAMEORIGIN' as const,
    },
    csp: {
      enabled: true,
      reportOnly: false,
    },
  },
  
  // Admin pages
  admin: {
    frameOptions: {
      enabled: true,
      policy: 'DENY' as const,
    },
    referrerPolicy: {
      enabled: true,
      policy: 'strict-origin' as const,
    },
  },
  
  // Public pages
  public: {
    frameOptions: {
      enabled: true,
      policy: 'SAMEORIGIN' as const,
    },
    crossOriginPolicies: {
      resourcePolicy: 'cross-origin' as const,
    },
  },
}

/**
 * Get security headers for specific page type
 */
export function getSecurityHeadersForPage(pageType: keyof typeof PAGE_CONFIGS): SecurityHeaders {
  const config = PAGE_CONFIGS[pageType] || {}
  return new SecurityHeaders(config)
}

/**
 * CORS configuration
 */
export interface CORSConfig {
  origin?: string | string[] | boolean
  methods?: string[]
  allowedHeaders?: string[]
  credentials?: boolean
  maxAge?: number
}

/**
 * Apply CORS headers
 */
export function applyCORSHeaders(
  request: NextRequest,
  response: NextResponse,
  config: CORSConfig = {}
): NextResponse {
  const origin = request.headers.get('origin')
  const {
    origin: allowedOrigin = process.env.NODE_ENV === 'development' ? '*' : false,
    methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders = ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    credentials = true,
    maxAge = 86400,
  } = config
  
  // Handle origin
  if (allowedOrigin === true) {
    response.headers.set('Access-Control-Allow-Origin', origin || '*')
  } else if (typeof allowedOrigin === 'string') {
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin)
  } else if (Array.isArray(allowedOrigin) && origin && allowedOrigin.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }
  
  // Other CORS headers
  response.headers.set('Access-Control-Allow-Methods', methods.join(', '))
  response.headers.set('Access-Control-Allow-Headers', allowedHeaders.join(', '))
  response.headers.set('Access-Control-Max-Age', maxAge.toString())
  
  if (credentials) {
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }
  
  return response
}

/**
 * Security middleware factory
 */
export function createSecurityMiddleware(config?: Partial<SecurityHeadersConfig>) {
  const headers = new SecurityHeaders(config)
  
  return (request: NextRequest) => {
    const response = NextResponse.next()
    return headers.apply(request, response)
  }
}

export default SecurityHeaders