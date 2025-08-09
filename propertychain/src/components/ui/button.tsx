import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Spinner } from "./spinner"

/**
 * Button Component - Compliant with Section 0 Principles
 * 
 * Principles Applied:
 * 1. Clarity Over Cleverness - Obvious clickable appearance
 * 2. Consistency - Same patterns across all variants
 * 3. Progressive Disclosure - Tooltip support for complex actions
 * 4. Respect The Grid - All sizes on 8px grid
 * 5. Purposeful Motion - 200ms transitions with meaning
 * 6. Obvious Interactions - Clear hover/active/focus states
 * 7. Generous Whitespace - Proper padding for touch targets
 * 8. Performance - Optimistic feedback before async operations
 * 9. Accessibility - WCAG AA compliant with full keyboard support
 */

const buttonVariants = cva(
  // Base styles with Section 0 compliance
  [
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap font-semibold", // Visual weight rule: semibold for buttons
    "ring-offset-background", // For focus states
    "transition-all duration-200 ease-out", // 200ms standard from Section 0
    "relative overflow-hidden", // For ripple effect
    "select-none", // Prevent text selection
    // Disabled state
    "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    // Focus state (Accessibility)
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    // Icon sizing
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    // Touch target minimum 44px on mobile
    "min-h-[44px] sm:min-h-0",
  ],
  {
    variants: {
      variant: {
        // Primary button - highest visual hierarchy
        default: [
          "bg-primary text-primary-foreground",
          "shadow-sm",
          // Hover state: lift up with shadow
          "hover:bg-primary-600 hover:-translate-y-0.5 hover:shadow-md",
          // Active state: press down
          "active:bg-primary-700 active:translate-y-0 active:shadow-xs",
          // Loading state maintains primary color
          "data-[loading=true]:bg-primary",
        ],
        
        // Secondary - 0.83x visual weight of primary
        secondary: [
          "bg-secondary text-secondary-foreground",
          "shadow-xs",
          "hover:bg-secondary/80 hover:-translate-y-0.5 hover:shadow-sm",
          "active:bg-secondary/90 active:translate-y-0 active:shadow-none",
        ],
        
        // Destructive for dangerous actions
        destructive: [
          "bg-destructive text-destructive-foreground",
          "shadow-sm",
          "hover:bg-destructive-600 hover:-translate-y-0.5 hover:shadow-md",
          "active:bg-destructive-700 active:translate-y-0 active:shadow-xs",
        ],
        
        // Outline for secondary actions
        outline: [
          "border-2 border-input bg-background",
          "hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20",
          "hover:-translate-y-0.5 hover:shadow-sm",
          "active:translate-y-0 active:shadow-none",
        ],
        
        // Ghost for tertiary actions
        ghost: [
          "hover:bg-accent hover:text-accent-foreground",
          "hover:shadow-sm",
          "active:bg-accent/80",
        ],
        
        // Link style
        link: [
          "text-primary underline-offset-4",
          "hover:underline hover:text-primary-600",
          "active:text-primary-700",
        ],
        
        // Success for positive actions
        success: [
          "bg-success text-success-foreground",
          "shadow-sm",
          "hover:bg-success-600 hover:-translate-y-0.5 hover:shadow-md",
          "active:bg-success-700 active:translate-y-0 active:shadow-xs",
        ],
        
        // Warning for cautionary actions
        warning: [
          "bg-warning text-warning-foreground",
          "shadow-sm",
          "hover:bg-warning/90 hover:-translate-y-0.5 hover:shadow-md",
          "active:bg-warning/80 active:translate-y-0 active:shadow-xs",
        ],
        
        // Error state variant
        error: [
          "bg-destructive-50 text-destructive border-2 border-destructive",
          "hover:bg-destructive-100",
          "active:bg-destructive-200",
        ],
      },
      
      size: {
        // Size hierarchy follows 1.2x ratio rule
        sm: "h-10 px-4 py-2 text-sm rounded-md",           // 40px height
        default: "h-12 px-5 py-2.5 text-sm rounded-md",    // 48px height (1.2x of sm)
        lg: "h-14 px-8 py-3.5 text-base rounded-lg",       // 56px height (1.17x of default)
        
        // Icon buttons with proper touch targets
        "icon-sm": "h-10 w-10 rounded-md p-0",             // 40px
        icon: "h-12 w-12 rounded-md p-0",                  // 48px
        "icon-lg": "h-14 w-14 rounded-lg p-0",             // 56px
      },
      
      rounded: {
        none: "rounded-none",       // 0px
        sm: "rounded",              // 4px - subtle
        default: "rounded-md",      // 8px - default from Section 0
        lg: "rounded-lg",           // 16px
        xl: "rounded-xl",           // 20px
        pill: "rounded-full",       // 9999px
      },
      
      // Visual feedback for loading
      loading: {
        true: [
          "cursor-wait",
          "relative",
          "text-transparent",
          // Maintain button shape during loading
          "[&>*:not(.spinner-container)]:invisible",
        ],
        false: [],
      }
    },
    
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
      loading: false,
    },
  }
)

// Ripple effect for micro-interaction (Section 0.5)
const useRipple = () => {
  const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([])
  
  const addRipple = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const id = Date.now()
    
    setRipples(prev => [...prev, { x, y, id }])
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id))
    }, 600)
  }, [])
  
  return { ripples, addRipple }
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  tooltip?: string
  // For optimistic updates
  onOptimisticClick?: () => void
  // Error state
  error?: boolean
  errorMessage?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    rounded,
    asChild = false, 
    loading = false,
    loadingText,
    leftIcon,
    rightIcon,
    children,
    disabled,
    tooltip,
    onOptimisticClick,
    onClick,
    error = false,
    errorMessage,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    const { ripples, addRipple } = useRipple()
    
    // Determine spinner size based on button size (maintaining visual hierarchy)
    const spinnerSize = size === "sm" || size === "icon-sm" ? "xs" : 
                       size === "lg" || size === "icon-lg" ? "md" : "sm"
    
    // Check if button is icon-only
    const isIconButton = size?.includes("icon")
    
    // Handle click with optimistic feedback
    const handleClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      // Add ripple effect for micro-interaction
      addRipple(e)
      
      // Optimistic callback fires immediately
      if (onOptimisticClick && !disabled && !loading) {
        onOptimisticClick()
      }
      
      // Original onClick fires after
      if (onClick && !disabled && !loading) {
        onClick(e)
      }
    }, [onClick, onOptimisticClick, disabled, loading, addRipple])
    
    // Use error variant if error prop is true
    const finalVariant = error ? "error" : variant
    
    // Wrap with tooltip for progressive disclosure
    const buttonElement = (
      <Comp
        className={cn(
          buttonVariants({ 
            variant: finalVariant, 
            size, 
            rounded, 
            loading,
            className 
          })
        )}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-invalid={error}
        aria-describedby={errorMessage ? "button-error" : undefined}
        data-loading={loading}
        onClick={handleClick}
        {...props}
      >
        {/* Ripple effects container */}
        <span className="absolute inset-0 overflow-hidden rounded-inherit">
          {ripples.map(ripple => (
            <span
              key={ripple.id}
              className="absolute animate-ripple"
              style={{
                left: ripple.x,
                top: ripple.y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <span className="block h-2 w-2 rounded-full bg-current opacity-50 animate-ping" />
            </span>
          ))}
        </span>
        
        {/* Button content */}
        <span className="relative flex items-center justify-center gap-2">
          {loading ? (
            <>
              <span className="spinner-container absolute inset-0 flex items-center justify-center">
                <Spinner size={spinnerSize} className="text-current" />
              </span>
              {/* Maintain layout during loading */}
              <span className="invisible flex items-center gap-2">
                {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
                {!isIconButton && (loadingText || children)}
                {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
              </span>
            </>
          ) : (
            <>
              {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
              {!isIconButton && children}
              {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
            </>
          )}
        </span>
        
        {/* Error message for accessibility */}
        {errorMessage && (
          <span id="button-error" className="sr-only">
            {errorMessage}
          </span>
        )}
      </Comp>
    )
    
    // Add tooltip wrapper if provided (Progressive Disclosure)
    if (tooltip && !disabled) {
      return (
        <span className="inline-flex" title={tooltip}>
          {buttonElement}
        </span>
      )
    }
    
    return buttonElement
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }