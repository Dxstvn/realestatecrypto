import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

/**
 * Typography Components - Compliant with Section 0 Principles
 * 
 * Principles Applied:
 * 1. Clarity Over Cleverness - Clear hierarchy with obvious purpose
 * 2. Consistency - Exact specifications from Section 1.2
 * 3. Progressive Disclosure - Truncation support for long text
 * 4. Respect The Grid - Line heights follow 8px/4px grid
 * 5. Content First - Typography leads, minimal decoration
 * 6. Generous Whitespace - Proper margins between elements
 * 7. Performance - Optimized font loading in globals.css
 * 8. Accessibility - Semantic HTML tags, proper heading hierarchy
 * 
 * Visual Hierarchy (Section 0.2):
 * - Title to Subtitle: 1.5x - 2x
 * - H1 (36px) → H2 (30px) = 1.2x
 * - H2 (30px) → H3 (24px) = 1.25x
 * - Visual weight rules applied
 */

// Display Components (Largest text for hero sections)
const displayVariants = cva(
  "font-sans tracking-tight text-balance", // text-balance from utilities
  {
    variants: {
      size: {
        large: "text-display-lg", // 60px/72px/-0.04em
        default: "text-display",  // 48px/56px/-0.03em
      },
      weight: {
        bold: "font-bold",
        extrabold: "font-extrabold",
      },
    },
    defaultVariants: {
      size: "default",
      weight: "bold",
    },
  }
)

export interface DisplayProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof displayVariants> {
  as?: "h1" | "h2" | "div" | "span"
  gradient?: boolean // For gradient text effect
}

export const Display = React.forwardRef<HTMLDivElement, DisplayProps>(
  ({ className, size, weight, as: Component = "div", gradient = false, children, ...props }, ref) => {
    return (
      <Component
        ref={ref as any}
        className={cn(
          displayVariants({ size, weight }),
          gradient && "gradient-text",
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
Display.displayName = "Display"

// Heading Components (H1-H6 with exact specifications)
interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  truncate?: boolean | number // Progressive disclosure
  balance?: boolean // Better text wrapping
}

export const H1 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, as: Component = "h1", truncate, balance = true, ...props }, ref) => {
    return (
      <Component
        ref={ref as any}
        className={cn(
          "text-h1", // 36px/44px/-0.03em/700
          "text-neutral-900 dark:text-neutral-100",
          balance && "text-balance",
          truncate === true && "truncate",
          typeof truncate === "number" && `truncate-${truncate}`,
          "mb-3", // 24px margin bottom (3 * 8px grid)
          className
        )}
        {...props}
      />
    )
  }
)
H1.displayName = "H1"

export const H2 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, as: Component = "h2", truncate, balance = true, ...props }, ref) => {
    return (
      <Component
        ref={ref as any}
        className={cn(
          "text-h2", // 30px/38px/-0.02em/700
          "text-neutral-900 dark:text-neutral-100",
          balance && "text-balance",
          truncate === true && "truncate",
          typeof truncate === "number" && `truncate-${truncate}`,
          "mb-3", // 24px margin bottom
          className
        )}
        {...props}
      />
    )
  }
)
H2.displayName = "H2"

export const H3 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, as: Component = "h3", truncate, balance = true, ...props }, ref) => {
    return (
      <Component
        ref={ref as any}
        className={cn(
          "text-h3", // 24px/32px/-0.02em/600
          "text-neutral-900 dark:text-neutral-100",
          balance && "text-balance",
          truncate === true && "truncate",
          typeof truncate === "number" && `truncate-${truncate}`,
          "mb-2", // 16px margin bottom
          className
        )}
        {...props}
      />
    )
  }
)
H3.displayName = "H3"

export const H4 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, as: Component = "h4", truncate, balance = true, ...props }, ref) => {
    return (
      <Component
        ref={ref as any}
        className={cn(
          "text-h4", // 20px/30px/-0.01em/600
          "text-neutral-900 dark:text-neutral-100",
          balance && "text-balance",
          truncate === true && "truncate",
          typeof truncate === "number" && `truncate-${truncate}`,
          "mb-2", // 16px margin bottom
          className
        )}
        {...props}
      />
    )
  }
)
H4.displayName = "H4"

export const H5 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, as: Component = "h5", truncate, balance = true, ...props }, ref) => {
    return (
      <Component
        ref={ref as any}
        className={cn(
          "text-h5", // 18px/28px/0/600
          "text-neutral-900 dark:text-neutral-100",
          balance && "text-balance",
          truncate === true && "truncate",
          typeof truncate === "number" && `truncate-${truncate}`,
          "mb-2", // 16px margin bottom
          className
        )}
        {...props}
      />
    )
  }
)
H5.displayName = "H5"

export const H6 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, as: Component = "h6", truncate, balance = true, ...props }, ref) => {
    return (
      <Component
        ref={ref as any}
        className={cn(
          "text-h6", // 16px/24px/0/600
          "text-neutral-900 dark:text-neutral-100",
          balance && "text-balance",
          truncate === true && "truncate",
          typeof truncate === "number" && `truncate-${truncate}`,
          "mb-1.5", // 12px margin bottom
          className
        )}
        {...props}
      />
    )
  }
)
H6.displayName = "H6"

// Body Text Components
const textVariants = cva(
  "font-sans",
  {
    variants: {
      size: {
        "body-lg": "text-body-lg",     // 18px/28px/0/400
        body: "text-body",              // 16px/24px/0/400
        "body-sm": "text-body-sm",      // 14px/20px/0.01em/400
        caption: "text-caption",        // 12px/16px/0.02em/400
        overline: "text-overline uppercase", // 11px/16px/0.08em/600/UPPERCASE
      },
      color: {
        default: "text-neutral-800 dark:text-neutral-200",
        muted: "text-neutral-600 dark:text-neutral-400",
        subtle: "text-neutral-500 dark:text-neutral-500",
        primary: "text-primary",
        success: "text-success",
        warning: "text-warning",
        destructive: "text-destructive",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
    },
    defaultVariants: {
      size: "body",
      color: "default",
      weight: "normal",
    },
  }
)

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, 'color'>,
    VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div" | "label"
  truncate?: boolean | number
  balance?: boolean
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ 
    className, 
    size, 
    color, 
    weight, 
    as: Component = "p", 
    truncate,
    balance = false,
    ...props 
  }, ref) => {
    return (
      <Component
        ref={ref as any}
        className={cn(
          textVariants({ size, color, weight }),
          balance && "text-balance",
          truncate === true && "truncate",
          typeof truncate === "number" && `truncate-${truncate}`,
          Component === "p" && "mb-2", // 16px margin for paragraphs
          className
        )}
        {...(props as any)}
      />
    )
  }
)
Text.displayName = "Text"

// Financial Data Components (with tabular-nums)
const financialVariants = cva(
  [
    "font-sans font-semibold tabular-nums", // Tabular nums for alignment
    "text-neutral-900 dark:text-neutral-100",
    "tracking-tight", // Tighter tracking for numbers
  ],
  {
    variants: {
      size: {
        large: "text-value-lg",    // 32px/40px/-0.02em/700
        medium: "text-value-md",   // 24px/32px/-0.01em/600
        small: "text-value-sm",    // 18px/24px/0/600
        table: "text-table-data",  // 14px/20px/0/500
        micro: "text-value-micro", // 12px/16px/0/600
      },
      trend: {
        positive: "text-success",
        negative: "text-destructive",
        neutral: "text-neutral-600 dark:text-neutral-400",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
    },
    defaultVariants: {
      size: "medium",
      align: "right", // Numbers typically right-aligned
    },
  }
)

export interface FinancialValueProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof financialVariants> {
  value: number | string
  prefix?: string // $, €, etc.
  suffix?: string // %, k, M, etc.
  decimals?: number
  showTrend?: boolean
  trendValue?: number // For showing +/- change
  animate?: boolean // Animate number changes
}

export const FinancialValue = React.forwardRef<HTMLSpanElement, FinancialValueProps>(
  ({ 
    className, 
    size, 
    trend,
    align,
    value,
    prefix,
    suffix,
    decimals = 2,
    showTrend = false,
    trendValue,
    animate = false,
    ...props 
  }, ref) => {
    // Format number with proper decimals
    const formatValue = React.useCallback((val: number | string) => {
      if (typeof val === "string") return val
      return val.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    }, [decimals])

    // Determine trend from value or trendValue
    const determinedTrend = trend || (
      showTrend && trendValue !== undefined
        ? trendValue > 0 ? "positive" : trendValue < 0 ? "negative" : "neutral"
        : undefined
    )

    return (
      <span
        ref={ref as any}
        className={cn(
          financialVariants({ size, trend: determinedTrend, align }),
          animate && "transition-all duration-300 ease-out",
          className
        )}
        {...props}
      >
        {prefix && <span className="mr-0.5">{prefix}</span>}
        <span>{formatValue(value)}</span>
        {suffix && <span className="ml-0.5">{suffix}</span>}
        {showTrend && trendValue !== undefined && (
          <span className={cn(
            "ml-1 text-[0.85em]",
            trendValue > 0 && "text-success",
            trendValue < 0 && "text-destructive",
            trendValue === 0 && "text-neutral-500"
          )}>
            {trendValue > 0 && "+"}
            {formatValue(trendValue)}
            {suffix}
          </span>
        )}
      </span>
    )
  }
)
FinancialValue.displayName = "FinancialValue"

// Code/Monospace Component
export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean
}

export const Code = React.forwardRef<HTMLElement, CodeProps>(
  ({ className, inline = true, ...props }, ref) => {
    const Component = inline ? "code" : "pre"
    return (
      <Component
        ref={ref as any}
        className={cn(
          "font-mono text-sm",
          inline && [
            "px-1.5 py-0.5",
            "rounded-md",
            "bg-neutral-100 dark:bg-neutral-800",
            "text-neutral-900 dark:text-neutral-100",
          ],
          !inline && [
            "p-4",
            "rounded-lg",
            "bg-neutral-50 dark:bg-neutral-900",
            "text-neutral-900 dark:text-neutral-100",
            "overflow-x-auto",
          ],
          className
        )}
        {...props}
      />
    )
  }
)
Code.displayName = "Code"

// Semantic Text Components
export const Strong = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <strong
      ref={ref as any}
      className={cn("font-semibold", className)}
      {...props}
    />
  )
)
Strong.displayName = "Strong"

export const Em = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <em
      ref={ref as any}
      className={cn("italic", className)}
      {...props}
    />
  )
)
Em.displayName = "Em"

export const Small = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <small
      ref={ref as any}
      className={cn("text-sm text-neutral-600 dark:text-neutral-400", className)}
      {...props}
    />
  )
)
Small.displayName = "Small"

// Export all components
export const Typography = {
  Display,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Text,
  FinancialValue,
  Code,
  Strong,
  Em,
  Small,
}