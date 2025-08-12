/**
 * Standardized Button Component V2
 * PropertyLend DeFi Platform
 * 
 * Unified button with consistent sizing system
 * Following Phase 1.1 of UI_POLISH_PLAN.md
 */

'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { BUTTON_SIZES, ANIMATION } from '@/lib/design-system/constants'

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none',
  {
    variants: {
      variant: {
        // Primary - Gradient background
        primary: [
          'bg-gradient-to-r from-primary-600 to-purple-600',
          'text-white',
          'hover:from-primary-700 hover:to-purple-700',
          'active:scale-[0.98]',
          'shadow-lg shadow-primary-600/20',
          'hover:shadow-xl hover:shadow-primary-600/30',
          'focus-visible:ring-primary-600',
        ].join(' '),
        
        // Secondary - Solid background
        secondary: [
          'bg-gray-800',
          'text-gray-100',
          'hover:bg-gray-700',
          'active:bg-gray-900',
          'border border-gray-700',
          'hover:border-gray-600',
          'focus-visible:ring-gray-600',
        ].join(' '),
        
        // Outline - Border only
        outline: [
          'border border-gray-700',
          'bg-transparent',
          'text-gray-100',
          'hover:bg-gray-800/50',
          'hover:border-gray-600',
          'focus-visible:ring-gray-600',
        ].join(' '),
        
        // Ghost - Minimal style
        ghost: [
          'text-gray-100',
          'hover:bg-gray-800/30',
          'hover:text-white',
          'focus-visible:ring-gray-600',
        ].join(' '),
        
        // Destructive - Red/danger
        destructive: [
          'bg-red-600',
          'text-white',
          'hover:bg-red-700',
          'active:bg-red-800',
          'shadow-lg shadow-red-600/20',
          'hover:shadow-xl hover:shadow-red-600/30',
          'focus-visible:ring-red-600',
        ].join(' '),
        
        // Success - Green
        success: [
          'bg-green-600',
          'text-white',
          'hover:bg-green-700',
          'active:bg-green-800',
          'shadow-lg shadow-green-600/20',
          'hover:shadow-xl hover:shadow-green-600/30',
          'focus-visible:ring-green-600',
        ].join(' '),
        
        // Glass - Glassmorphic effect
        glass: [
          'bg-white/5',
          'backdrop-blur-md',
          'border border-white/10',
          'text-white',
          'hover:bg-white/10',
          'hover:border-white/20',
          'shadow-lg',
          'focus-visible:ring-white/50',
        ].join(' '),
      },
      
      size: {
        sm: 'h-8 px-3 text-sm rounded-md min-w-[64px]',
        md: 'h-10 px-4 text-base rounded-lg min-w-[80px]',
        lg: 'h-12 px-6 text-base rounded-lg min-w-[96px]',
        xl: 'h-14 px-8 text-lg rounded-xl min-w-[128px]',
      },
      
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
      
      loading: {
        true: 'cursor-wait',
        false: '',
      },
    },
    
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
      loading: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const ButtonV2 = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading = false,
      disabled,
      icon,
      iconPosition = 'left',
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    
    // Get size-specific styles from constants
    const sizeStyles = size ? {
      sm: { '--btn-height': BUTTON_SIZES.sm.height },
      md: { '--btn-height': BUTTON_SIZES.md.height },
      lg: { '--btn-height': BUTTON_SIZES.lg.height },
      xl: { '--btn-height': BUTTON_SIZES.xl.height },
    }[size] : {}
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, loading, className }))}
        ref={ref}
        disabled={disabled || loading}
        style={sizeStyles as React.CSSProperties}
        {...props}
      >
        {loading && (
          <Loader2 
            className={cn(
              'animate-spin',
              size === 'sm' && 'h-3 w-3',
              size === 'md' && 'h-4 w-4',
              size === 'lg' && 'h-5 w-5',
              size === 'xl' && 'h-6 w-6',
              children && 'mr-2'
            )}
          />
        )}
        
        {!loading && icon && iconPosition === 'left' && (
          <span className={cn(children && 'mr-2')}>{icon}</span>
        )}
        
        {children}
        
        {!loading && icon && iconPosition === 'right' && (
          <span className={cn(children && 'ml-2')}>{icon}</span>
        )}
      </Comp>
    )
  }
)

ButtonV2.displayName = 'ButtonV2'

export { ButtonV2, buttonVariants }