/**
 * Sentry Server Configuration - PropertyChain
 * 
 * Error tracking and performance monitoring for server-side
 * Following UpdatedUIPlan.md Step 65 specifications and CLAUDE.md principles
 */

import * as Sentry from '@sentry/nextjs'
// import { nodeProfilingIntegration } from '@sentry/profiling-node'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Environment configuration
  environment: process.env.NODE_ENV,
  
  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Profiling
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.01 : 0.1,
  
  // Release tracking
  release: process.env.SENTRY_RELEASE || 'development',
  
  // Integration configuration
  integrations: [
    // nodeProfilingIntegration(),
    // new Sentry.Integrations.Http({ tracing: true }),
    // new Sentry.Integrations.Console(),
  ],
  
  // Filter sensitive data
  beforeSend(event) {
    // Remove sensitive data from error context
    if (event.request?.headers) {
      delete event.request.headers.authorization
      delete event.request.headers.cookie
      delete event.request.headers['x-api-key']
    }
    
    // Filter out known non-critical errors
    if (event.exception) {
      const error = event.exception.values?.[0]
      const errorMessage = error?.value || ''
      
      const ignoredErrors = [
        'AbortError',
        'NetworkError',
        'TimeoutError',
        'ECONNRESET',
        'ENOTFOUND',
        'ETIMEDOUT',
      ]
      
      if (ignoredErrors.some(ignored => errorMessage.includes(ignored))) {
        return null
      }
    }
    
    return event
  },
  
  // Enhanced error context
  initialScope: {
    tags: {
      component: 'server',
      platform: 'node',
      runtime: 'nodejs',
    },
  },
  
  // Debug mode for development
  debug: process.env.NODE_ENV === 'development',
  
  // Disable in development unless explicitly enabled
  enabled: process.env.NODE_ENV === 'production' || process.env.SENTRY_ENABLED === 'true',
})