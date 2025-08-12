/**
 * Theme-Aware Input Components
 * PropertyLend DeFi Platform
 * 
 * Phase 2.1: Component Theming
 * Form inputs with automatic theme adaptation
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { Search, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"

const inputVariants = cva(
  "flex w-full rounded-lg text-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        // Default input - adapts to theme
        default: cn(
          "dark:bg-gray-900/50 dark:border dark:border-gray-800",
          "dark:text-white dark:placeholder-gray-500",
          "dark:focus-visible:border-primary-500 dark:focus-visible:ring-primary-500/20",
          "light:bg-white light:border light:border-gray-300",
          "light:text-gray-900 light:placeholder-gray-400",
          "light:focus-visible:border-primary-500 light:focus-visible:ring-primary-500/20"
        ),
        
        // Glass input - primarily for dark theme
        glass: cn(
          "bg-white/5 backdrop-blur-md",
          "border border-white/10",
          "text-white placeholder-gray-400",
          "focus-visible:border-white/30 focus-visible:ring-white/20"
        ),
        
        // Outline input
        outline: cn(
          "bg-transparent",
          "dark:border-2 dark:border-gray-700",
          "dark:text-white dark:placeholder-gray-500",
          "dark:focus-visible:border-primary-500",
          "light:border-2 light:border-gray-300",
          "light:text-gray-900 light:placeholder-gray-400",
          "light:focus-visible:border-primary-500"
        ),
        
        // Filled input
        filled: cn(
          "border-0",
          "dark:bg-gray-800 dark:text-white dark:placeholder-gray-500",
          "dark:focus-visible:bg-gray-700",
          "light:bg-gray-100 light:text-gray-900 light:placeholder-gray-500",
          "light:focus-visible:bg-gray-50"
        )
      },
      
      inputSize: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-5 text-base",
        xl: "h-14 px-6 text-lg"
      },
      
      state: {
        default: "",
        error: cn(
          "dark:border-danger-500 dark:focus-visible:ring-danger-500/20",
          "light:border-danger-500 light:focus-visible:ring-danger-500/20"
        ),
        success: cn(
          "dark:border-success-500 dark:focus-visible:ring-success-500/20",
          "light:border-success-500 light:focus-visible:ring-success-500/20"
        )
      }
    },
    
    defaultVariants: {
      variant: "default",
      inputSize: "md",
      state: "default"
    }
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  error?: string
  success?: string
  label?: string
  helperText?: string
}

const InputThemed = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = "text",
    variant,
    inputSize,
    state: stateProp,
    leftIcon,
    rightIcon,
    error,
    success,
    label,
    helperText,
    ...props 
  }, ref) => {
    // Determine state based on error/success props
    const state = error ? "error" : success ? "success" : stateProp || "default"
    
    const inputElement = (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {leftIcon}
          </div>
        )}
        
        <input
          type={type}
          className={cn(
            inputVariants({ variant, inputSize, state }),
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {rightIcon}
          </div>
        )}
        
        {state === "error" && !rightIcon && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-danger-500" />
        )}
        
        {state === "success" && !rightIcon && (
          <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-success-500" />
        )}
      </div>
    )
    
    if (label || error || success || helperText) {
      return (
        <div className="space-y-2">
          {label && (
            <label className="text-sm font-medium dark:text-gray-200 light:text-gray-700">
              {label}
              {props.required && <span className="text-danger-500 ml-1">*</span>}
            </label>
          )}
          
          {inputElement}
          
          {(error || success || helperText) && (
            <p className={cn(
              "text-xs",
              error && "text-danger-500",
              success && "text-success-500",
              !error && !success && "dark:text-gray-400 light:text-gray-600"
            )}>
              {error || success || helperText}
            </p>
          )}
        </div>
      )
    }
    
    return inputElement
  }
)
InputThemed.displayName = "InputThemed"

// Search Input Component
export interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
  onSearch?: (value: string) => void
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch(e.currentTarget.value)
      }
    }
    
    return (
      <InputThemed
        ref={ref}
        type="search"
        leftIcon={<Search className="h-4 w-4" />}
        onKeyDown={handleKeyDown}
        {...props}
      />
    )
  }
)
SearchInput.displayName = "SearchInput"

// Password Input Component
export interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightIcon'> {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    
    return (
      <InputThemed
        ref={ref}
        type={showPassword ? "text" : "password"}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="focus:outline-none hover:text-gray-300"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        }
        {...props}
      />
    )
  }
)
PasswordInput.displayName = "PasswordInput"

// Textarea Component
const textareaVariants = cva(
  "flex min-h-[80px] w-full rounded-lg text-sm transition-all resize-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: cn(
          "dark:bg-gray-900/50 dark:border dark:border-gray-800",
          "dark:text-white dark:placeholder-gray-500",
          "dark:focus-visible:border-primary-500 dark:focus-visible:ring-primary-500/20",
          "light:bg-white light:border light:border-gray-300",
          "light:text-gray-900 light:placeholder-gray-400",
          "light:focus-visible:border-primary-500 light:focus-visible:ring-primary-500/20"
        ),
        glass: cn(
          "bg-white/5 backdrop-blur-md",
          "border border-white/10",
          "text-white placeholder-gray-400",
          "focus-visible:border-white/30 focus-visible:ring-white/20"
        )
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  error?: string
  success?: string
  label?: string
  helperText?: string
}

const TextareaThemed = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    variant,
    error,
    success,
    label,
    helperText,
    ...props 
  }, ref) => {
    const textareaElement = (
      <textarea
        className={cn(
          textareaVariants({ variant }),
          error && "dark:border-danger-500 light:border-danger-500",
          success && "dark:border-success-500 light:border-success-500",
          "p-3",
          className
        )}
        ref={ref}
        {...props}
      />
    )
    
    if (label || error || success || helperText) {
      return (
        <div className="space-y-2">
          {label && (
            <label className="text-sm font-medium dark:text-gray-200 light:text-gray-700">
              {label}
              {props.required && <span className="text-danger-500 ml-1">*</span>}
            </label>
          )}
          
          {textareaElement}
          
          {(error || success || helperText) && (
            <p className={cn(
              "text-xs",
              error && "text-danger-500",
              success && "text-success-500",
              !error && !success && "dark:text-gray-400 light:text-gray-600"
            )}>
              {error || success || helperText}
            </p>
          )}
        </div>
      )
    }
    
    return textareaElement
  }
)
TextareaThemed.displayName = "TextareaThemed"

export { 
  InputThemed, 
  SearchInput, 
  PasswordInput, 
  TextareaThemed,
  inputVariants,
  textareaVariants
}