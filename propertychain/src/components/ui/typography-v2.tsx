/**
 * Typography Components V2 - PropertyLend
 * Phase 4.1: Content & Typography
 * 
 * Enhanced typography system with refined type scale
 * Following the UI_POLISH_PLAN specifications
 */

'use client'

import { ReactNode, HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

// Enhanced typography variants with the refined type scale
const typographyVariants = cva('', {
  variants: {
    variant: {
      'display-lg': 'text-7xl lg:text-8xl font-extrabold leading-none tracking-tighter',
      'display': 'text-5xl lg:text-6xl font-bold leading-tight tracking-tight',
      'h1': 'text-4xl lg:text-5xl font-bold leading-tight tracking-tight',
      'h2': 'text-3xl lg:text-4xl font-semibold leading-snug',
      'h3': 'text-2xl lg:text-3xl font-semibold leading-snug',
      'h4': 'text-xl lg:text-2xl font-medium leading-normal',
      'h5': 'text-lg lg:text-xl font-medium leading-normal',
      'h6': 'text-base lg:text-lg font-medium leading-normal',
      'body-lg': 'text-lg leading-relaxed',
      'body': 'text-base leading-relaxed',
      'body-sm': 'text-sm leading-normal',
      'caption': 'text-xs leading-normal',
      'overline': 'text-xs font-semibold tracking-widest uppercase',
    },
    color: {
      default: 'text-gray-900 dark:text-white',
      muted: 'text-gray-600 dark:text-gray-400',
      subtle: 'text-gray-500 dark:text-gray-500',
      primary: 'text-purple-600 dark:text-purple-400',
      success: 'text-green-600 dark:text-green-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      error: 'text-red-600 dark:text-red-400',
      gradient: 'bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
    weight: {
      thin: 'font-thin',
      extralight: 'font-extralight',
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
      black: 'font-black',
    },
  },
  defaultVariants: {
    variant: 'body',
    color: 'default',
    align: 'left',
  },
})

// Component mapping for semantic HTML
const variantElementMap = {
  'display-lg': 'h1',
  'display': 'h1',
  'h1': 'h1',
  'h2': 'h2',
  'h3': 'h3',
  'h4': 'h4',
  'h5': 'h5',
  'h6': 'h6',
  'body-lg': 'p',
  'body': 'p',
  'body-sm': 'p',
  'caption': 'span',
  'overline': 'span',
} as const

export interface TypographyProps 
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: keyof JSX.IntrinsicElements
  children: ReactNode
  truncate?: boolean | number
  balance?: boolean
  gradient?: boolean
  shadow?: 'sm' | 'md' | 'lg'
}

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  ({ 
    variant = 'body',
    color,
    align,
    weight,
    as,
    children, 
    className,
    truncate,
    balance = false,
    gradient = false,
    shadow,
    ...props 
  }, ref) => {
    const Component = as || variantElementMap[variant || 'body'] || 'p'
    
    return (
      <Component
        ref={ref as any}
        className={cn(
          typographyVariants({ 
            variant, 
            color: gradient ? 'gradient' : color,
            align,
            weight 
          }),
          balance && 'text-balance',
          truncate === true && 'truncate',
          truncate === 2 && 'line-clamp-2',
          truncate === 3 && 'line-clamp-3',
          shadow === 'sm' && 'drop-shadow-sm',
          shadow === 'md' && 'drop-shadow-md',
          shadow === 'lg' && 'drop-shadow-lg',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Typography.displayName = 'Typography'

// Specialized heading components
export const Heading = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ variant = 'h2', ...props }, ref) => (
    <Typography ref={ref} variant={variant} {...props} />
  )
)
Heading.displayName = 'Heading'

export const Display = forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant'> & { size?: 'lg' | 'md' }>(
  ({ size = 'md', ...props }, ref) => (
    <Typography 
      ref={ref} 
      variant={size === 'lg' ? 'display-lg' : 'display'} 
      {...props} 
    />
  )
)
Display.displayName = 'Display'

// Text components
export const Text = forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ variant = 'body', ...props }, ref) => (
    <Typography ref={ref} variant={variant} {...props} />
  )
)
Text.displayName = 'Text'

export const Lead = forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => (
    <Typography ref={ref} variant="body-lg" color="muted" {...props} />
  )
)
Lead.displayName = 'Lead'

export const Caption = forwardRef<HTMLSpanElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => (
    <Typography ref={ref} variant="caption" color="muted" {...props} />
  )
)
Caption.displayName = 'Caption'

export const Overline = forwardRef<HTMLSpanElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => (
    <Typography ref={ref} variant="overline" {...props} />
  )
)
Overline.displayName = 'Overline'

// Special text components
export function GradientText({ 
  children, 
  className,
  from = 'from-purple-500',
  to = 'to-purple-600',
  ...props 
}: HTMLAttributes<HTMLSpanElement> & { from?: string; to?: string }) {
  return (
    <span
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent font-semibold',
        from,
        to,
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

// Inline code
export function Code({ children, className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        'relative rounded bg-gray-100 dark:bg-gray-800',
        'px-[0.3rem] py-[0.2rem] font-mono text-sm',
        'text-gray-900 dark:text-gray-100',
        className
      )}
      {...props}
    >
      {children}
    </code>
  )
}

// Blockquote
export function Blockquote({ children, className, ...props }: HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className={cn(
        'mt-6 border-l-4 border-purple-500 pl-6',
        'italic text-gray-600 dark:text-gray-400',
        'bg-gray-50 dark:bg-gray-900/50 py-4 pr-6 rounded-r-lg',
        className
      )}
      {...props}
    >
      {children}
    </blockquote>
  )
}

// List components
export function List({ children, className, ...props }: HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={cn(
        'my-6 ml-6 list-disc space-y-2',
        '[&>li]:text-gray-700 dark:[&>li]:text-gray-300',
        className
      )}
      {...props}
    >
      {children}
    </ul>
  )
}

export function OrderedList({ children, className, ...props }: HTMLAttributes<HTMLOListElement>) {
  return (
    <ol
      className={cn(
        'my-6 ml-6 list-decimal space-y-2',
        '[&>li]:text-gray-700 dark:[&>li]:text-gray-300',
        className
      )}
      {...props}
    >
      {children}
    </ol>
  )
}

// Article wrapper for long-form content
export function Article({ children, className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <article
      className={cn(
        'prose prose-gray dark:prose-invert max-w-none',
        'prose-headings:font-semibold prose-headings:tracking-tight',
        'prose-p:leading-relaxed prose-p:text-gray-600 dark:prose-p:text-gray-400',
        'prose-a:text-purple-600 dark:prose-a:text-purple-400',
        'prose-a:no-underline hover:prose-a:underline',
        'prose-strong:font-semibold prose-strong:text-gray-900 dark:prose-strong:text-white',
        'prose-code:bg-gray-100 dark:prose-code:bg-gray-800',
        'prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
        'prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950',
        'prose-blockquote:border-l-purple-500',
        'prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-900',
        'prose-img:rounded-xl prose-img:shadow-lg',
        'prose-hr:border-gray-200 dark:prose-hr:border-gray-800',
        className
      )}
      {...props}
    >
      {children}
    </article>
  )
}

// Financial/Numeric display
export interface NumericDisplayProps extends HTMLAttributes<HTMLSpanElement> {
  value: number | string
  prefix?: string
  suffix?: string
  decimals?: number
  trend?: 'up' | 'down' | 'neutral'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function NumericDisplay({
  value,
  prefix = '',
  suffix = '',
  decimals = 2,
  trend,
  size = 'md',
  className,
  ...props
}: NumericDisplayProps) {
  const formattedValue = typeof value === 'number' 
    ? value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : value

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-5xl',
  }

  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400',
  }

  return (
    <span
      className={cn(
        'font-bold tabular-nums',
        sizeClasses[size],
        trend && trendColors[trend],
        !trend && 'text-gray-900 dark:text-white',
        className
      )}
      {...props}
    >
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  )
}

// Export all components as a namespace
export const TypographyV2 = {
  Root: Typography,
  Display,
  Heading,
  Text,
  Lead,
  Caption,
  Overline,
  GradientText,
  Code,
  Blockquote,
  List,
  OrderedList,
  Article,
  NumericDisplay,
}