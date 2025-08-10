/**
 * Google Analytics Configuration - PropertyChain
 * 
 * Analytics tracking and conversion monitoring
 * Following UpdatedUIPlan.md Step 50 specifications and CLAUDE.md principles
 */

'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

// GA Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// Page view tracking
export function pageview(url: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }
}

// Event tracking
export function event({
  action,
  category,
  label,
  value,
  parameters,
}: {
  action: string
  category: string
  label?: string
  value?: number
  parameters?: Record<string, any>
}) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
      ...parameters,
    })
  }
}

// E-commerce tracking
export const ecommerce = {
  // View item
  viewItem: (item: {
    id: string
    name: string
    category: string
    price: number
    currency?: string
  }) => {
    event({
      action: 'view_item',
      category: 'ecommerce',
      parameters: {
        currency: item.currency || 'USD',
        value: item.price,
        items: [
          {
            item_id: item.id,
            item_name: item.name,
            item_category: item.category,
            price: item.price,
            quantity: 1,
          },
        ],
      },
    })
  },

  // Add to cart
  addToCart: (item: {
    id: string
    name: string
    category: string
    price: number
    quantity?: number
    currency?: string
  }) => {
    event({
      action: 'add_to_cart',
      category: 'ecommerce',
      parameters: {
        currency: item.currency || 'USD',
        value: item.price * (item.quantity || 1),
        items: [
          {
            item_id: item.id,
            item_name: item.name,
            item_category: item.category,
            price: item.price,
            quantity: item.quantity || 1,
          },
        ],
      },
    })
  },

  // Begin checkout
  beginCheckout: (items: any[], value: number, currency = 'USD') => {
    event({
      action: 'begin_checkout',
      category: 'ecommerce',
      parameters: {
        currency,
        value,
        items,
      },
    })
  },

  // Purchase
  purchase: (transaction: {
    id: string
    value: number
    currency?: string
    tax?: number
    shipping?: number
    items: any[]
  }) => {
    event({
      action: 'purchase',
      category: 'ecommerce',
      parameters: {
        transaction_id: transaction.id,
        value: transaction.value,
        currency: transaction.currency || 'USD',
        tax: transaction.tax || 0,
        shipping: transaction.shipping || 0,
        items: transaction.items,
      },
    })
  },
}

// User properties
export function setUserProperties(properties: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('set', { user_properties: properties })
  }
}

// Custom dimensions
export function setCustomDimensions(dimensions: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_MEASUREMENT_ID, {
      custom_map: dimensions,
    })
  }
}

// Conversion tracking
export const conversions = {
  // Sign up
  signUp: (method: string) => {
    event({
      action: 'sign_up',
      category: 'engagement',
      parameters: {
        method,
      },
    })
  },

  // Login
  login: (method: string) => {
    event({
      action: 'login',
      category: 'engagement',
      parameters: {
        method,
      },
    })
  },

  // Investment inquiry
  investmentInquiry: (propertyId: string, value: number) => {
    event({
      action: 'generate_lead',
      category: 'conversion',
      parameters: {
        currency: 'USD',
        value,
        property_id: propertyId,
      },
    })
  },

  // Investment completed
  investmentCompleted: (propertyId: string, value: number) => {
    event({
      action: 'investment_completed',
      category: 'conversion',
      value,
      parameters: {
        property_id: propertyId,
        currency: 'USD',
      },
    })
  },
}

// User engagement tracking
export const engagement = {
  // Share
  share: (method: string, contentType: string, itemId: string) => {
    event({
      action: 'share',
      category: 'engagement',
      parameters: {
        method,
        content_type: contentType,
        item_id: itemId,
      },
    })
  },

  // Search
  search: (searchTerm: string, resultsCount?: number) => {
    event({
      action: 'search',
      category: 'engagement',
      parameters: {
        search_term: searchTerm,
        results_count: resultsCount,
      },
    })
  },

  // View search results
  viewSearchResults: (searchTerm: string, resultsCount: number) => {
    event({
      action: 'view_search_results',
      category: 'engagement',
      parameters: {
        search_term: searchTerm,
        results_count: resultsCount,
      },
    })
  },

  // Scroll depth
  scrollDepth: (percentage: number) => {
    event({
      action: 'scroll',
      category: 'engagement',
      parameters: {
        percent_scrolled: percentage,
      },
    })
  },

  // Time on page
  timeOnPage: (seconds: number, pagePath: string) => {
    event({
      action: 'time_on_page',
      category: 'engagement',
      value: seconds,
      parameters: {
        page_path: pagePath,
      },
    })
  },
}

// Property tracking
export const propertyTracking = {
  // View property
  viewProperty: (property: {
    id: string
    title: string
    price: number
    location: string
    type: string
  }) => {
    event({
      action: 'view_property',
      category: 'property',
      parameters: {
        property_id: property.id,
        property_title: property.title,
        property_price: property.price,
        property_location: property.location,
        property_type: property.type,
      },
    })
  },

  // Save property
  saveProperty: (propertyId: string) => {
    event({
      action: 'save_property',
      category: 'property',
      parameters: {
        property_id: propertyId,
      },
    })
  },

  // Contact agent
  contactAgent: (propertyId: string, method: string) => {
    event({
      action: 'contact_agent',
      category: 'property',
      parameters: {
        property_id: propertyId,
        contact_method: method,
      },
    })
  },

  // Schedule viewing
  scheduleViewing: (propertyId: string) => {
    event({
      action: 'schedule_viewing',
      category: 'property',
      parameters: {
        property_id: propertyId,
      },
    })
  },
}

// Error tracking
export function trackError(error: {
  message: string
  stack?: string
  fatal?: boolean
}) {
  event({
    action: 'exception',
    category: 'error',
    parameters: {
      description: error.message,
      fatal: error.fatal || false,
      error_stack: error.stack,
    },
  })
}

// Performance tracking
export function trackTiming(
  category: string,
  variable: string,
  value: number,
  label?: string
) {
  event({
    action: 'timing_complete',
    category: 'performance',
    parameters: {
      name: variable,
      value,
      event_category: category,
      event_label: label,
    },
  })
}

// Google Analytics Provider Component
export function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
      pageview(url)
    }
  }, [pathname, searchParams])

  if (!GA_MEASUREMENT_ID) {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              send_page_view: true,
            });
          `,
        }}
      />
    </>
  )
}

// Scroll depth tracking hook
export function useScrollDepthTracking() {
  useEffect(() => {
    let maxScroll = 0
    const trackScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY
      const percentage = Math.round((scrolled / scrollHeight) * 100)

      // Track in 25% increments
      if (percentage > maxScroll) {
        if (percentage >= 25 && maxScroll < 25) {
          engagement.scrollDepth(25)
          maxScroll = 25
        } else if (percentage >= 50 && maxScroll < 50) {
          engagement.scrollDepth(50)
          maxScroll = 50
        } else if (percentage >= 75 && maxScroll < 75) {
          engagement.scrollDepth(75)
          maxScroll = 75
        } else if (percentage >= 90 && maxScroll < 90) {
          engagement.scrollDepth(90)
          maxScroll = 90
        }
      }
    }

    window.addEventListener('scroll', trackScroll, { passive: true })
    return () => window.removeEventListener('scroll', trackScroll)
  }, [])
}

// Time on page tracking hook
export function useTimeOnPageTracking() {
  const pathname = usePathname()
  
  useEffect(() => {
    const startTime = Date.now()

    const trackTime = () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000)
      engagement.timeOnPage(timeOnPage, pathname || '/')
    }

    // Track when user leaves
    window.addEventListener('beforeunload', trackTime)
    
    // Track when visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackTime()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', trackTime)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      trackTime() // Track when component unmounts
    }
  }, [pathname])
}