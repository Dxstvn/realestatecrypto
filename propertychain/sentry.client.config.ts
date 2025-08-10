/**
 * Sentry Client Configuration - PropertyChain
 * 
 * Error tracking and performance monitoring for client-side
 * Following UpdatedUIPlan.md Step 65 specifications and CLAUDE.md principles
 */

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Environment configuration
  environment: process.env.NODE_ENV,
  
  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Session replay for debugging
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.01 : 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Release tracking
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || 'development',
  
  // Integration configuration
  integrations: [
    // Replay is not available in all Sentry packages, commenting out for now
    // new Sentry.Replay({
    //   maskAllText: true,
    //   blockAllMedia: true,
    // }),
    // BrowserTracing is also not available in all packages
    // new Sentry.BrowserTracing({
    //   // Set up automatic route change tracking for Next.js
    //   routingInstrumentation: Sentry.nextRouterInstrumentation,
    // }),
  ],
  
  // Filter out unwanted errors
  beforeSend(event) {
    // Filter out known browser extension errors
    if (event.exception) {
      const error = event.exception.values?.[0]
      const errorMessage = error?.value || ''
      
      // Common browser extension errors
      const ignoredErrors = [
        'Non-Error exception captured',
        'Non-Error promise rejection captured',
        'ChunkLoadError',
        'Loading chunk',
        'Script error',
        'Network request failed',
        'Loading CSS chunk',
        // Browser extension errors
        'top.GLOBALS',
        'originalCreateNotification',
        'canvas.contentDocument',
        'MyApp_RemoveAllHighlights',
        'atomicFindClose',
        // Ad blocker errors
        'window.adnxs',
        'googletag',
        '__gCrWeb',
        'SnapEngage',
      ]
      
      if (ignoredErrors.some(ignored => errorMessage.includes(ignored))) {
        return null
      }
    }
    
    return event
  },
  
  // User context
  initialScope: {
    tags: {
      component: 'client',
      platform: 'web',
    },
  },
  
  // Debug mode for development
  debug: process.env.NODE_ENV === 'development',
  
  // Disable in development unless explicitly enabled
  enabled: process.env.NODE_ENV === 'production' || process.env.SENTRY_ENABLED === 'true',
})