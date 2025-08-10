/**
 * Test Utilities - PropertyChain
 * 
 * Testing utilities and helpers
 * Following UpdatedUIPlan.md Step 59 specifications and CLAUDE.md principles
 */

import React, { ReactElement } from 'react'
import { render, RenderOptions, RenderResult } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AuthProvider } from '@/contexts/auth-context'
import { NotificationProvider } from '@/contexts/notification-context'
import userEvent from '@testing-library/user-event'

// Create a custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  withAuth?: boolean
  withTheme?: boolean
  withQuery?: boolean
  initialAuth?: any
  initialTheme?: 'light' | 'dark' | 'system'
}

// All providers wrapper
export function AllProviders({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

// Custom render function
export function customRender(
  ui: ReactElement,
  options?: CustomRenderOptions
): RenderResult {
  const {
    withAuth = true,
    withTheme = true,
    withQuery = true,
    ...renderOptions
  } = options || {}

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    let content = children

    if (withQuery) {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, refetchOnWindowFocus: false },
          mutations: { retry: false },
        },
      })
      content = (
        <QueryClientProvider client={queryClient}>
          {content}
        </QueryClientProvider>
      )
    }

    if (withAuth) {
      content = <AuthProvider>{content}</AuthProvider>
    }

    if (withTheme) {
      content = <ThemeProvider>{content}</ThemeProvider>
    }

    return <>{content}</>
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Create mock data factories
export const mockFactory = {
  // User mock
  user: (overrides?: Partial<any>) => ({
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'investor',
    walletAddress: '0x1234567890123456789012345678901234567890',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  }),

  // Property mock
  property: (overrides?: Partial<any>) => ({
    id: 'property-123',
    name: 'Test Property',
    description: 'A beautiful test property',
    price: 500000,
    location: {
      address: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
      country: 'USA',
    },
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1500,
    yearBuilt: 2020,
    propertyType: 'Single Family',
    status: 'for_sale',
    images: ['/test-image-1.jpg', '/test-image-2.jpg'],
    tokenId: '1',
    tokenSupply: 1000,
    tokensSold: 250,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  }),

  // Transaction mock
  transaction: (overrides?: Partial<any>) => ({
    id: 'tx-123',
    hash: '0xabcdef1234567890',
    from: '0x1234567890123456789012345678901234567890',
    to: '0x0987654321098765432109876543210987654321',
    value: '1000000000000000000',
    status: 'completed',
    type: 'purchase',
    propertyId: 'property-123',
    timestamp: new Date('2024-01-01'),
    gasUsed: '21000',
    gasPrice: '20000000000',
    blockNumber: 12345678,
    ...overrides,
  }),

  // Portfolio mock
  portfolio: (overrides?: Partial<any>) => ({
    userId: 'user-123',
    totalValue: 1500000,
    totalInvested: 1200000,
    totalReturns: 300000,
    properties: [
      {
        propertyId: 'property-123',
        tokens: 100,
        investmentAmount: 50000,
        currentValue: 55000,
        returns: 5000,
      },
    ],
    performance: {
      daily: 0.5,
      weekly: 2.3,
      monthly: 5.8,
      yearly: 24.5,
    },
    ...overrides,
  }),
}

// Wait utilities
export const waitUtils = {
  // Wait for a specific amount of time
  wait: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  // Wait for next tick
  nextTick: () => new Promise(resolve => process.nextTick(resolve)),

  // Wait for animation frame
  nextFrame: () => new Promise(resolve => requestAnimationFrame(resolve as any)),

  // Wait for condition
  waitFor: async (
    condition: () => boolean,
    timeout = 5000,
    interval = 100
  ): Promise<void> => {
    const startTime = Date.now()
    
    while (!condition()) {
      if (Date.now() - startTime > timeout) {
        throw new Error('Timeout waiting for condition')
      }
      await waitUtils.wait(interval)
    }
  },
}

// Mock API responses
export const mockApi = {
  // Success response
  success: (data: any, delay = 0) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ok: true,
          status: 200,
          json: async () => data,
          text: async () => JSON.stringify(data),
        })
      }, delay)
    })
  },

  // Error response
  error: (status = 500, message = 'Internal Server Error', delay = 0) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ok: false,
          status,
          json: async () => ({ error: message }),
          text: async () => message,
        })
      }, delay)
    })
  },
}

// Test IDs for consistent querying
export const testIds = {
  // Navigation
  header: 'header',
  footer: 'footer',
  sidebar: 'sidebar',
  nav: 'navigation',
  
  // Buttons
  submitButton: 'submit-button',
  cancelButton: 'cancel-button',
  saveButton: 'save-button',
  deleteButton: 'delete-button',
  
  // Forms
  loginForm: 'login-form',
  signupForm: 'signup-form',
  propertyForm: 'property-form',
  searchForm: 'search-form',
  
  // Inputs
  emailInput: 'email-input',
  passwordInput: 'password-input',
  searchInput: 'search-input',
  
  // Cards
  propertyCard: 'property-card',
  portfolioCard: 'portfolio-card',
  transactionCard: 'transaction-card',
  
  // Tables
  propertyTable: 'property-table',
  transactionTable: 'transaction-table',
  userTable: 'user-table',
  
  // Modals
  confirmModal: 'confirm-modal',
  propertyModal: 'property-modal',
  transactionModal: 'transaction-modal',
}

// Accessibility testing utilities
export const a11y = {
  // Check for ARIA attributes
  hasAriaLabel: (element: HTMLElement, label: string) => {
    return element.getAttribute('aria-label') === label
  },

  // Check for role
  hasRole: (element: HTMLElement, role: string) => {
    return element.getAttribute('role') === role
  },

  // Check tab index
  isFocusable: (element: HTMLElement) => {
    const tabIndex = element.getAttribute('tabindex')
    return tabIndex !== '-1'
  },

  // Check for screen reader only text
  hasScreenReaderText: (element: HTMLElement, text: string) => {
    const srOnly = element.querySelector('.sr-only')
    return srOnly?.textContent === text
  },
}

// Setup user event
export const setupUser = () => userEvent.setup()

// Export everything
export * from '@testing-library/react'
export { customRender as render, setupUser as user }