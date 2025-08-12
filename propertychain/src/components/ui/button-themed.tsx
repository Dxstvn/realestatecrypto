/**
 * Theme-Aware Button Component
 * PropertyLend DeFi Platform
 * 
 * Phase 2.1: Component Theming
 * Button with automatic theme adaptation
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        // Primary - adapts to theme
        primary: cn(
          "text-white shadow-lg",
          "dark:bg-gradient-to-r dark:from-primary-500 dark:to-primary-600",
          "dark:hover:from-primary-600 dark:hover:to-primary-700",
          "dark:shadow-primary-500/25",
          "light:bg-primary-500 light:hover:bg-primary-600",
          "light:shadow-primary-500/30"
        ),
        
        // Secondary - adapts to theme
        secondary: cn(
          "dark:bg-gray-800/50 dark:text-gray-100 dark:border dark:border-gray-700",
          "dark:hover:bg-gray-700/50 dark:hover:border-gray-600",
          "light:bg-gray-100 light:text-gray-900 light:border light:border-gray-200",
          "light:hover:bg-gray-200"
        ),
        
        // Outline - adapts to theme
        outline: cn(
          "border-2",
          "dark:border-primary-500/50 dark:text-primary-400",
          "dark:hover:bg-primary-500/10 dark:hover:border-primary-500",
          "light:border-primary-500 light:text-primary-600",
          "light:hover:bg-primary-50 light:hover:border-primary-600"
        ),
        
        // Ghost - adapts to theme
        ghost: cn(
          "dark:text-gray-300 dark:hover:bg-gray-800/50 dark:hover:text-white",
          "light:text-gray-700 light:hover:bg-gray-100 light:hover:text-gray-900"
        ),
        
        // Danger - consistent across themes
        danger: cn(
          "bg-danger-500 text-white",
          "hover:bg-danger-600",
          "shadow-danger-500/25"
        ),
        
        // Success - consistent across themes
        success: cn(
          "bg-success-500 text-white",
          "hover:bg-success-600",
          "shadow-success-500/25"
        ),
        
        // Glass - dark theme only
        glass: cn(
          "bg-white/5 backdrop-blur-md border border-white/10",
          "text-white hover:bg-white/10",
          "shadow-lg shadow-black/10"
        ),
        
        // Neon - dark theme special effect
        neon: cn(
          "relative overflow-hidden",
          "bg-gradient-to-r from-neon-purple to-neon-blue",
          "text-white font-semibold",
          "before:absolute before:inset-0",
          "before:bg-gradient-to-r before:from-neon-purple before:to-neon-blue",
          "before:blur-xl before:opacity-50",
          "hover:shadow-neon-purple/50",
          "animate-glow-pulse"
        )
      },
      
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10"
      },
      
      fullWidth: {
        true: "w-full",
        false: ""
      }
    },
    
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const ButtonThemed = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth,
    asChild = false, 
    loading = false,
    disabled,
    leftIcon,
    rightIcon,
    children,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, fullWidth, className }),
          loading && "cursor-wait"
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {children}
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </Comp>
    )
  }
)

ButtonThemed.displayName = "ButtonThemed"

export { ButtonThemed, buttonVariants }