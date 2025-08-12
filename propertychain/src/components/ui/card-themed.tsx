/**
 * Theme-Aware Card Component
 * PropertyLend DeFi Platform
 * 
 * Phase 2.1: Component Theming
 * Card components with automatic theme adaptation
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const cardVariants = cva(
  "rounded-xl transition-all duration-200",
  {
    variants: {
      variant: {
        // Default card - adapts to theme
        default: cn(
          "dark:bg-gray-900/50 dark:border dark:border-gray-800",
          "dark:backdrop-blur-sm",
          "light:bg-white light:border light:border-gray-200",
          "light:shadow-sm"
        ),
        
        // Glass card - primarily for dark theme
        glass: cn(
          "bg-white/5 backdrop-blur-xl",
          "border border-white/10",
          "shadow-xl shadow-black/10",
          "dark:hover:bg-white/[0.07]",
          "light:bg-white/80 light:border-gray-200"
        ),
        
        // Elevated card - stronger shadow
        elevated: cn(
          "dark:bg-gray-900 dark:border dark:border-gray-800",
          "dark:shadow-2xl dark:shadow-black/50",
          "light:bg-white light:border light:border-gray-100",
          "light:shadow-xl light:shadow-gray-200/50"
        ),
        
        // Gradient card - special effect
        gradient: cn(
          "relative overflow-hidden",
          "dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-950",
          "dark:border dark:border-gray-800",
          "light:bg-gradient-to-br light:from-white light:to-gray-50",
          "light:border light:border-gray-200"
        ),
        
        // Interactive card - hover effects
        interactive: cn(
          "cursor-pointer",
          "dark:bg-gray-900/50 dark:border dark:border-gray-800",
          "dark:hover:bg-gray-800/50 dark:hover:border-gray-700",
          "dark:hover:shadow-xl dark:hover:shadow-primary-500/10",
          "dark:hover:-translate-y-0.5",
          "light:bg-white light:border light:border-gray-200",
          "light:hover:shadow-lg light:hover:border-primary-200",
          "light:hover:-translate-y-0.5"
        ),
        
        // Success variant
        success: cn(
          "dark:bg-success-500/10 dark:border dark:border-success-500/30",
          "light:bg-success-50 light:border light:border-success-200"
        ),
        
        // Warning variant
        warning: cn(
          "dark:bg-warning-500/10 dark:border dark:border-warning-500/30",
          "light:bg-warning-50 light:border light:border-warning-200"
        ),
        
        // Danger variant
        danger: cn(
          "dark:bg-danger-500/10 dark:border dark:border-danger-500/30",
          "light:bg-danger-50 light:border light:border-danger-200"
        )
      },
      
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-10"
      },
      
      hover: {
        true: "hover:shadow-lg hover:-translate-y-0.5",
        false: ""
      }
    },
    
    defaultVariants: {
      variant: "default",
      padding: "md",
      hover: false
    }
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const CardThemed = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, hover, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, hover }), className)}
      {...props}
    />
  )
)
CardThemed.displayName = "CardThemed"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5",
      "dark:text-white light:text-gray-900",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      "dark:text-white light:text-gray-900",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm",
      "dark:text-gray-400 light:text-gray-600",
      className
    )}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      "dark:text-gray-300 light:text-gray-700",
      className
    )} 
    {...props} 
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center",
      "dark:text-gray-400 light:text-gray-600",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Property/Pool Card Component
interface PropertyCardProps extends CardProps {
  image?: string
  title: string
  apy: number
  tvl: number
  progress?: number
  timeLeft?: string
  minInvestment?: number
  tranche?: 'senior' | 'junior'
}

const PropertyCard = React.forwardRef<HTMLDivElement, PropertyCardProps>(
  ({ 
    image,
    title,
    apy,
    tvl,
    progress = 0,
    timeLeft,
    minInvestment,
    tranche = 'senior',
    className,
    ...props 
  }, ref) => {
    const trancheColors = {
      senior: {
        badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        progress: "bg-blue-500",
        apy: "text-blue-400"
      },
      junior: {
        badge: "bg-green-500/20 text-green-400 border-green-500/30",
        progress: "bg-green-500",
        apy: "text-green-400"
      }
    }
    
    const colors = trancheColors[tranche]
    
    return (
      <CardThemed
        ref={ref}
        variant="interactive"
        padding="none"
        className={cn("overflow-hidden", className)}
        {...props}
      >
        {/* Image Section */}
        {image && (
          <div className="relative aspect-video overflow-hidden">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            {timeLeft && (
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-sm">
                {timeLeft}
              </div>
            )}
          </div>
        )}
        
        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Title and Badge */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold dark:text-white light:text-gray-900 line-clamp-2">
              {title}
            </h3>
            <span className={cn(
              "px-2 py-1 text-xs font-medium rounded-full border shrink-0",
              colors.badge
            )}>
              {tranche === 'senior' ? 'Senior' : 'Junior'}
            </span>
          </div>
          
          {/* APY and TVL */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm dark:text-gray-400 light:text-gray-600">APY</p>
              <p className={cn("text-2xl font-bold", colors.apy)}>
                {apy}%
              </p>
            </div>
            <div>
              <p className="text-sm dark:text-gray-400 light:text-gray-600">TVL</p>
              <p className="text-2xl font-bold dark:text-white light:text-gray-900">
                ${tvl.toLocaleString()}
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          {progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="dark:text-gray-400 light:text-gray-600">Progress</span>
                <span className="dark:text-gray-300 light:text-gray-700">{progress}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full transition-all duration-500", colors.progress)}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
          
          {/* Min Investment */}
          {minInvestment && (
            <div className="pt-2 border-t dark:border-gray-800 light:border-gray-200">
              <p className="text-sm dark:text-gray-400 light:text-gray-600">
                Min. Investment: <span className="font-medium dark:text-gray-300 light:text-gray-700">
                  ${minInvestment.toLocaleString()}
                </span>
              </p>
            </div>
          )}
        </div>
      </CardThemed>
    )
  }
)
PropertyCard.displayName = "PropertyCard"

export {
  CardThemed,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  PropertyCard,
  cardVariants
}