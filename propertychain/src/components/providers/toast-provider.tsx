/**
 * Toast Provider - PropertyChain
 * 
 * Enhanced notification system using Sonner with PropertyChain styling
 * Follows Section 0 principles and Section 7.2 specifications
 */

'use client'

import { ReactNode } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { useTheme } from './theme-provider'

interface ToastProviderProps {
  children: ReactNode
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  expand?: boolean
  visibleToasts?: number
  duration?: number
  gap?: number
}

export function ToastProvider({ 
  children,
  position = 'top-right',
  expand = false,
  visibleToasts = 3,
  duration = 4000,
  gap = 8,
}: ToastProviderProps) {
  const { resolvedTheme } = useTheme()

  return (
    <>
      {children}
      <Toaster
        position={position}
        expand={expand}
        visibleToasts={visibleToasts}
        gap={gap}
        richColors
        closeButton
        toastOptions={{
          duration,
          style: {
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
            fontSize: '14px',
            lineHeight: '20px',
            borderRadius: '8px',
            padding: '12px 16px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            background: resolvedTheme === 'dark' ? '#1f2937' : '#ffffff',
            color: resolvedTheme === 'dark' ? '#f3f4f6' : '#111827',
          },
          className: 'propertychain-toast',
          descriptionClassName: 'propertychain-toast-description',
          actionButtonStyle: {
            backgroundColor: 'transparent',
            border: '1px solid currentColor',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '12px',
            fontWeight: '500',
            color: 'inherit',
            marginLeft: '8px',
          },
          cancelButtonStyle: {
            backgroundColor: 'transparent',
            color: resolvedTheme === 'dark' ? '#9ca3af' : '#6b7280',
          },
        }}
        theme={resolvedTheme as 'light' | 'dark'}
        // Icons configuration
        icons={{
          success: '✅',
          error: '❌',
          warning: '⚠️',
          info: 'ℹ️',
        }}
        // Offset from edges
        offset="16px"
      />
    </>
  )
}