/**
 * Sentry Configuration - PropertyChain
 * 
 * Error tracking and performance monitoring setup
 * Following UpdatedUIPlan.md Step 50 specifications and CLAUDE.md principles
 */

import * as Sentry from '@sentry/nextjs'

// Sentry configuration
export function initSentry() {
  const environment = process.env.NODE_ENV
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

  if (!dsn) {
    console.warn('Sentry DSN not configured')
    return
  }

  Sentry.init({
    dsn,
    environment,
    
    // Performance Monitoring
    integrations: [],

    // Sample rates
    tracesSampleRate: environment === 'production' ? 0.1 : 1.0,
    
    // Release tracking
    release: process.env.NEXT_PUBLIC_APP_VERSION,
    
    
    // User feedback
    beforeSend(event, hint) {
      // Filter out sensitive data
      if (event.request) {
        // Remove auth headers
        if (event.request.headers) {
          delete event.request.headers['Authorization']
          delete event.request.headers['Cookie']
        }
        // Remove sensitive query params
        if (event.request.query_string) {
          const queryString = typeof event.request.query_string === 'string' 
            ? event.request.query_string 
            : new URLSearchParams(event.request.query_string as any).toString()
          event.request.query_string = filterSensitiveParams(queryString)
        }
      }

      // Filter out non-error console logs
      if (event.level === 'log') {
        return null
      }

      // Add user context
      if (typeof window !== 'undefined') {
        const userId = getUserId()
        if (userId) {
          event.user = {
            id: userId,
            ip_address: '{{auto}}',
          }
        }
      }

      return event
    },

    // Ignore specific errors
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      // Network errors
      'Network request failed',
      'NetworkError',
      'Failed to fetch',
      // User actions
      'User cancelled',
      'User denied',
      // Known third-party errors
      'fb_xd_fragment',
      'Can\'t find variable: ZiteReader',
      'jigsaw is not defined',
      'ComboSearch is not defined',
      'atomicFindClose',
    ],

    // Ignore transactions
    ignoreTransactions: [
      '/health',
      '/ping',
      '/_next/static',
      '/favicon.ico',
    ],

    // Breadcrumbs
    beforeBreadcrumb(breadcrumb, hint) {
      // Filter out debug breadcrumbs in production
      if (environment === 'production' && breadcrumb.level === 'debug') {
        return null
      }

      // Add custom breadcrumbs for specific actions
      if (breadcrumb.category === 'navigation') {
        breadcrumb.data = {
          ...breadcrumb.data,
          timestamp: Date.now(),
        }
      }

      return breadcrumb
    },
  })
}

// Helper function to get user ID
function getUserId(): string | null {
  if (typeof window === 'undefined') return null
  
  // Get from auth context or localStorage
  const authData = localStorage.getItem('auth')
  if (authData) {
    try {
      const auth = JSON.parse(authData)
      return auth.userId || null
    } catch {
      return null
    }
  }
  return null
}

// Filter sensitive parameters
function filterSensitiveParams(queryString: string): string {
  const sensitiveParams = ['token', 'key', 'secret', 'password', 'auth']
  const params = new URLSearchParams(queryString)
  
  sensitiveParams.forEach(param => {
    if (params.has(param)) {
      params.set(param, '[REDACTED]')
    }
  })
  
  return params.toString()
}

// Custom error boundary
export function captureException(error: Error, context?: Record<string, any>) {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('custom', context)
    }
    Sentry.captureException(error)
  })
}

// Performance monitoring
export function measurePerformance(name: string, fn: () => void) {
  return Sentry.withScope((scope) => {
    scope.setTag('operation', name)
    try {
      const result = fn()
      return result
    } catch (error) {
      Sentry.captureException(error)
      throw error
    }
  })
}

// User feedback
export function showUserFeedback(error?: Error) {
  const eventId = error ? Sentry.captureException(error) : Sentry.lastEventId()
  
  Sentry.showReportDialog({
    eventId,
    title: 'We\'re sorry, something went wrong',
    subtitle: 'Our team has been notified. If you\'d like to help, tell us what happened below.',
    subtitle2: '',
    labelName: 'Name',
    labelEmail: 'Email',
    labelComments: 'What happened?',
    labelClose: 'Close',
    labelSubmit: 'Submit',
    errorGeneric: 'An error occurred while submitting your report. Please try again.',
    successMessage: 'Your feedback has been sent. Thank you!',
  })
}

// Set user context
export function setUserContext(user: {
  id: string
  email?: string
  username?: string
  role?: string
}) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  })
}

// Clear user context on logout
export function clearUserContext() {
  Sentry.withScope((scope) => {
    scope.clear()
  })
}

// Add custom breadcrumb
export function addBreadcrumb(
  message: string,
  category: string,
  level: Sentry.SeverityLevel = 'info',
  data?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now(),
  })
}

// Track custom events
export function trackEvent(
  eventName: string,
  category: string,
  data?: Record<string, any>
) {
  addBreadcrumb(eventName, category, 'info', data)
  
  // Also send to analytics if configured
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, {
      event_category: category,
      ...data,
    })
  }
}

// Monitor API calls
export async function monitorApiCall<T>(
  name: string,
  apiCall: () => Promise<T>
): Promise<T> {
  return Sentry.withScope(async (scope) => {
    scope.setTag('api_call', name)
    try {
      const result = await apiCall()
      return result
    } catch (error) {
      Sentry.captureException(error as Error, { tags: { apiCall: name } })
      throw error
    }
  })
}

// Web Vitals monitoring
export function reportWebVitals(metric: {
  id: string
  name: string
  value: number
  label: string
}) {
  // Send metric to Sentry
  Sentry.setMeasurement(metric.name, metric.value, '')

  // Send to Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    })
  }
}

// Export Sentry instance
export { Sentry }