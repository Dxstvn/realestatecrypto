/**
 * Content Security Policy (CSP) - PropertyChain
 * 
 * Comprehensive CSP configuration for security against XSS, injection attacks
 * Following UpdatedUIPlan.md Step 66 specifications and CLAUDE.md principles
 */

/**
 * CSP directive types
 */
interface CSPDirectives {
  'default-src'?: string[]
  'script-src'?: string[]
  'script-src-elem'?: string[]
  'script-src-attr'?: string[]
  'style-src'?: string[]
  'style-src-elem'?: string[]
  'style-src-attr'?: string[]
  'img-src'?: string[]
  'font-src'?: string[]
  'connect-src'?: string[]
  'media-src'?: string[]
  'object-src'?: string[]
  'child-src'?: string[]
  'frame-src'?: string[]
  'worker-src'?: string[]
  'frame-ancestors'?: string[]
  'form-action'?: string[]
  'base-uri'?: string[]
  'manifest-src'?: string[]
  'upgrade-insecure-requests'?: boolean
  'block-all-mixed-content'?: boolean
  'require-trusted-types-for'?: string[]
  'trusted-types'?: string[]
}

/**
 * Environment-specific CSP configurations
 */
const CSP_CONFIGS = {
  development: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-eval'", // Next.js dev mode
      "'unsafe-inline'", // Development convenience
      'localhost:*',
      '127.0.0.1:*',
      'webpack://',
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Tailwind and styled-components
      'fonts.googleapis.com',
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https:',
      'localhost:*',
      '127.0.0.1:*',
    ],
    'font-src': [
      "'self'",
      'data:',
      'fonts.gstatic.com',
      'fonts.googleapis.com',
    ],
    'connect-src': [
      "'self'",
      'localhost:*',
      '127.0.0.1:*',
      'ws://localhost:*',
      'ws://127.0.0.1:*',
      'wss://localhost:*',
      'https://api.web3.storage',
      'https://ipfs.io',
      'https://*.infura.io',
      'https://*.alchemy.com',
      'https://*.quicknode.com',
      'https://api.coingecko.com',
      'https://sentry.io',
      'https://*.sentry.io',
    ],
    'frame-src': [
      "'self'",
      'https://www.google.com', // reCAPTCHA
      'https://recaptcha.google.com',
    ],
    'worker-src': [
      "'self'",
      'blob:',
    ],
    'media-src': [
      "'self'",
      'data:',
      'blob:',
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': false,
  },
  
  production: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'nonce-{NONCE}'", // Dynamic nonce placeholder
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://js.sentry-cdn.com',
      'https://browser.sentry-cdn.com',
    ],
    'style-src': [
      "'self'",
      "'nonce-{NONCE}'",
      'https://fonts.googleapis.com',
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https:',
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://ipfs.io',
      'https://*.ipfs.io',
      'https://gateway.pinata.cloud',
    ],
    'font-src': [
      "'self'",
      'data:',
      'https://fonts.gstatic.com',
      'https://fonts.googleapis.com',
    ],
    'connect-src': [
      "'self'",
      'https://api.web3.storage',
      'https://ipfs.io',
      'https://*.ipfs.io',
      'https://*.infura.io',
      'https://*.alchemy.com',
      'https://*.quicknode.com',
      'https://api.coingecko.com',
      'https://www.google-analytics.com',
      'https://analytics.google.com',
      'https://sentry.io',
      'https://*.sentry.io',
      'wss://*.pusher.com', // Real-time notifications
    ],
    'frame-src': [
      "'self'",
      'https://www.google.com',
      'https://recaptcha.google.com',
    ],
    'worker-src': [
      "'self'",
      'blob:',
    ],
    'media-src': [
      "'self'",
      'data:',
      'blob:',
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': true,
    'block-all-mixed-content': true,
    'require-trusted-types-for': ["'script'"],
    'trusted-types': ['next-js', 'react', 'default'],
  },
  
  staging: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-eval'", // Allow for debugging
      "'nonce-{NONCE}'",
      'https://staging-*.propertychain.com',
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'",
      'https://fonts.googleapis.com',
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https:',
      'https://staging-*.propertychain.com',
    ],
    'font-src': [
      "'self'",
      'data:',
      'https://fonts.gstatic.com',
    ],
    'connect-src': [
      "'self'",
      'https://staging-*.propertychain.com',
      'https://api-staging.web3.storage',
      'https://*.sepolia.infura.io',
      'https://*.goerli.alchemy.com',
      'wss://staging-*.propertychain.com',
    ],
    'frame-src': [
      "'self'",
      'https://www.google.com',
    ],
    'worker-src': [
      "'self'",
      'blob:',
    ],
    'media-src': [
      "'self'",
      'data:',
      'blob:',
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': true,
  },
} as const

/**
 * CSP Builder class
 */
export class CSPBuilder {
  private directives: CSPDirectives = {}
  private nonce?: string
  
  constructor(environment: keyof typeof CSP_CONFIGS = 'production') {
    this.directives = JSON.parse(JSON.stringify(CSP_CONFIGS[environment]))
  }
  
  /**
   * Set nonce for script and style sources
   */
  setNonce(nonce: string): this {
    this.nonce = nonce
    return this
  }
  
  /**
   * Add directive
   */
  addDirective(directive: keyof CSPDirectives, values: string | string[]): this {
    const valueArray = Array.isArray(values) ? values : [values]
    
    const currentValue = this.directives[directive]
    if (currentValue && Array.isArray(currentValue)) {
      (this.directives[directive] as string[]) = [...currentValue, ...valueArray]
    } else {
      (this.directives[directive] as string[]) = valueArray
    }
    
    return this
  }
  
  /**
   * Remove directive
   */
  removeDirective(directive: keyof CSPDirectives): this {
    delete this.directives[directive]
    return this
  }
  
  /**
   * Build CSP header string
   */
  build(): string {
    const policies: string[] = []
    
    for (const [directive, values] of Object.entries(this.directives)) {
      if (typeof values === 'boolean') {
        if (values) {
          policies.push(directive.replace(/([A-Z])/g, '-$1').toLowerCase())
        }
      } else if (Array.isArray(values)) {
        let processedValues = values.map(value => {
          // Replace nonce placeholder
          if (this.nonce && value.includes('{NONCE}')) {
            return value.replace('{NONCE}', this.nonce)
          }
          return value
        })
        
        // Remove duplicates
        processedValues = Array.from(new Set(processedValues))
        
        const directiveName = directive.replace(/([A-Z])/g, '-$1').toLowerCase()
        policies.push(`${directiveName} ${processedValues.join(' ')}`)
      }
    }
    
    return policies.join('; ')
  }
}

/**
 * Generate cryptographically secure nonce
 */
export function generateNonce(): string {
  if (typeof window !== 'undefined' && typeof crypto !== 'undefined' && crypto.getRandomValues) {
    // Client-side: use Web Crypto API
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  } else {
    // Server-side: use Node.js crypto
    const nodeCrypto = require('crypto')
    return nodeCrypto.randomBytes(16).toString('hex')
  }
}

/**
 * Get CSP for current environment
 */
export function getCSP(nonce?: string): string {
  const environment = (process.env.NODE_ENV as keyof typeof CSP_CONFIGS) || 'production'
  const builder = new CSPBuilder(environment)
  
  if (nonce) {
    builder.setNonce(nonce)
  }
  
  // Add environment-specific overrides
  if (process.env.VERCEL_URL) {
    builder.addDirective('connect-src', `https://${process.env.VERCEL_URL}`)
    builder.addDirective('img-src', `https://${process.env.VERCEL_URL}`)
  }
  
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    builder.addDirective('connect-src', process.env.NEXT_PUBLIC_SITE_URL)
    builder.addDirective('img-src', process.env.NEXT_PUBLIC_SITE_URL)
  }
  
  return builder.build()
}

/**
 * CSP middleware for API routes
 */
export function cspMiddleware(customDirectives?: Partial<CSPDirectives>) {
  return (req: any, res: any, next: Function) => {
    const nonce = generateNonce()
    const builder = new CSPBuilder()
      .setNonce(nonce)
    
    if (customDirectives) {
      Object.entries(customDirectives).forEach(([directive, values]) => {
        if (values && typeof values !== 'boolean') {
          builder.addDirective(directive as keyof CSPDirectives, values)
        }
      })
    }
    
    const cspHeader = builder.build()
    
    // Support both Express and Next.js response objects
    if (res.setHeader) {
      res.setHeader('Content-Security-Policy', cspHeader)
      res.setHeader('X-Content-Security-Policy', cspHeader) // Legacy
      res.setHeader('X-WebKit-CSP', cspHeader) // Legacy
    } else if (res.headers) {
      res.headers.set('Content-Security-Policy', cspHeader)
      res.headers.set('X-Content-Security-Policy', cspHeader) // Legacy
      res.headers.set('X-WebKit-CSP', cspHeader) // Legacy
    }
    
    // Make nonce available to the response
    if (res.locals !== undefined) {
      res.locals = res.locals || {}
      res.locals.nonce = nonce
    }
    
    if (next) next()
  }
}

/**
 * CSP Reporter endpoint handler
 */
export interface CSPReport {
  'csp-report': {
    'document-uri': string
    'referrer': string
    'blocked-uri': string
    'violated-directive': string
    'original-policy': string
    'disposition': 'enforce' | 'report'
    'status-code': number
    'script-sample'?: string
    'line-number'?: number
    'column-number'?: number
  }
}

export function handleCSPReport(report: CSPReport): void {
  const violation = report['csp-report']
  
  // Log CSP violations
  console.warn('CSP Violation detected:', {
    documentUri: violation['document-uri'],
    blockedUri: violation['blocked-uri'],
    violatedDirective: violation['violated-directive'],
    originalPolicy: violation['original-policy'],
    disposition: violation.disposition,
    timestamp: new Date().toISOString(),
  })
  
  // Send to error tracking
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    (window as any).Sentry.captureMessage('CSP Violation', {
      level: 'warning',
      tags: {
        type: 'csp_violation',
        directive: violation['violated-directive'],
      },
      extra: violation,
    })
  }
  
  // In production, you might want to send to a logging service
  if (process.env.NODE_ENV === 'production' && process.env.CSP_REPORT_URI) {
    fetch(process.env.CSP_REPORT_URI, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ violation, timestamp: new Date().toISOString() }),
    }).catch(console.error)
  }
}

/**
 * CSP configuration presets for different pages
 */
export const CSP_PRESETS = {
  // Dashboard with charts and interactive elements
  dashboard: {
    'script-src': [
      "'self'",
      "'nonce-{NONCE}'",
      'https://unpkg.com', // For chart libraries
      'https://cdn.jsdelivr.net',
    ],
    'style-src': [
      "'self'",
      "'nonce-{NONCE}'",
      'https://unpkg.com',
      'https://cdn.jsdelivr.net',
    ],
  },
  
  // Payment pages with Stripe/payment processors
  payment: {
    'script-src': [
      "'self'",
      "'nonce-{NONCE}'",
      'https://js.stripe.com',
      'https://checkout.stripe.com',
    ],
    'frame-src': [
      "'self'",
      'https://js.stripe.com',
      'https://hooks.stripe.com',
      'https://checkout.stripe.com',
    ],
    'connect-src': [
      "'self'",
      'https://api.stripe.com',
      'https://maps.googleapis.com',
    ],
  },
  
  // Public pages with minimal requirements
  public: {
    'script-src': [
      "'self'",
      "'nonce-{NONCE}'",
    ],
    'style-src': [
      "'self'",
      "'nonce-{NONCE}'",
    ],
    'img-src': [
      "'self'",
      'data:',
      'https:',
    ],
  },
} as const

/**
 * Get CSP preset
 */
export function getCSPPreset(preset: keyof typeof CSP_PRESETS, nonce?: string): string {
  const builder = new CSPBuilder()
  
  if (nonce) {
    builder.setNonce(nonce)
  }
  
  const presetDirectives = CSP_PRESETS[preset]
  Object.entries(presetDirectives).forEach(([directive, values]) => {
    builder.addDirective(directive as keyof CSPDirectives, values)
  })
  
  return builder.build()
}

export default CSPBuilder