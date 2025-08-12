/**
 * Standardized Card Components - PropertyLend DeFi Platform
 * 
 * Phase 2.2: Card Component Standardization
 * - Consistent 16:9 image ratios
 * - Glassmorphic effects with proper backdrop-filter
 * - Clear visual hierarchy
 * - Accessible progress indicators with labels
 * - Standardized spacing and typography
 */

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { 
  Heart,
  Share2,
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Award,
  Info,
  CheckCircle,
  AlertCircle,
  DollarSign
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Standardized card variants
const cardVariants = cva(
  "group relative rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1",
  {
    variants: {
      variant: {
        // Default glass card with subtle effects
        default: cn(
          "bg-white/5 backdrop-blur-xl border border-white/10",
          "hover:bg-white/[0.07] hover:border-white/20",
          "shadow-xl shadow-black/10"
        ),
        
        // Property card with enhanced visuals
        property: cn(
          "bg-gradient-to-br from-gray-900/50 to-gray-950/50",
          "backdrop-blur-xl border border-gray-800/50",
          "hover:border-primary/30 hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]"
        ),
        
        // Pool card with DeFi styling
        pool: cn(
          "bg-gradient-to-br from-gray-950/90 via-gray-900/90 to-gray-950/90",
          "backdrop-blur-xl border border-gray-800",
          "hover:border-primary/50 hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]"
        ),
        
        // Featured card with special effects
        featured: cn(
          "bg-gradient-to-br from-primary/10 via-purple-900/10 to-primary/10",
          "backdrop-blur-xl border border-primary/30",
          "hover:border-primary/50 hover:shadow-[0_0_60px_rgba(99,102,241,0.25)]",
          "ring-2 ring-primary/20 ring-offset-2 ring-offset-gray-950"
        )
      },
      
      size: {
        sm: "min-h-[360px]",
        md: "min-h-[420px]", 
        lg: "min-h-[480px]",
        xl: "min-h-[540px]"
      }
    },
    
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
)

// Image container with consistent 16:9 ratio
const ImageContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    src?: string
    alt?: string
    priority?: boolean
    overlay?: React.ReactNode
  }
>(({ className, src, alt = "", priority = false, overlay, children, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn(
      "relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900",
      className
    )}
    {...props}
  >
    {src ? (
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-all duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority={priority}
      />
    ) : (
      <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 rounded-full bg-gray-700/50 flex items-center justify-center">
          <DollarSign className="h-8 w-8 text-gray-500" />
        </div>
      </div>
    )}
    
    {/* Glass overlay for better text readability */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    
    {overlay && (
      <div className="absolute inset-0">
        {overlay}
      </div>
    )}
    
    {children}
  </div>
))
ImageContainer.displayName = "ImageContainer"

// Badge container with consistent positioning
const BadgeContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  }
>(({ className, position = 'top-left', children, ...props }, ref) => {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  }
  
  return (
    <div 
      ref={ref}
      className={cn(
        'absolute z-10 flex flex-wrap gap-2',
        positionClasses[position],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
BadgeContainer.displayName = "BadgeContainer"

// Action buttons with glass effect
const ActionButtons = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    onFavorite?: () => void
    onShare?: () => void
    isFavorited?: boolean
  }
>(({ className, onFavorite, onShare, isFavorited = false, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn('absolute top-4 right-4 z-10 flex gap-2', className)}
    {...props}
  >
    {onFavorite && (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 bg-black/20 backdrop-blur-md border border-white/20 hover:bg-black/40"
              onClick={onFavorite}
            >
              <Heart
                className={cn(
                  'h-4 w-4 transition-colors',
                  isFavorited ? 'fill-red-500 text-red-500' : 'text-white'
                )}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )}
    
    {onShare && (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 bg-black/20 backdrop-blur-md border border-white/20 hover:bg-black/40"
              onClick={onShare}
            >
              <Share2 className="h-4 w-4 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Share
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )}
  </div>
))
ActionButtons.displayName = "ActionButtons"

// Accessible progress indicator with proper labels
const AccessibleProgress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: number
    max?: number
    label?: string
    showPercentage?: boolean
    variant?: 'default' | 'success' | 'warning' | 'danger'
    currentValue?: string
    targetValue?: string
  }
>(({ 
  className, 
  value, 
  max = 100, 
  label = "Progress", 
  showPercentage = true,
  variant = 'default',
  currentValue,
  targetValue,
  ...props 
}, ref) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100)
  
  const variantStyles = {
    default: "bg-primary-500",
    success: "bg-green-500",
    warning: "bg-yellow-500", 
    danger: "bg-red-500"
  }
  
  return (
    <div ref={ref} className={cn('space-y-2', className)} {...props}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-300">
          {label}
        </span>
        {showPercentage && (
          <span className="text-sm font-semibold text-white">
            {percentage}%
          </span>
        )}
      </div>
      
      <div className="relative">
        <Progress 
          value={percentage}
          className="h-2 bg-gray-800"
          indicatorClassName={cn(
            'transition-all duration-500',
            variantStyles[variant]
          )}
          aria-label={`${label}: ${percentage}% complete`}
        />
      </div>
      
      {(currentValue || targetValue) && (
        <div className="flex justify-between text-xs text-gray-500">
          {currentValue && <span>{currentValue}</span>}
          {targetValue && <span>of {targetValue}</span>}
        </div>
      )}
    </div>
  )
})
AccessibleProgress.displayName = "AccessibleProgress"

// Card header with standardized typography
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title: string
    subtitle?: string
    href?: string
    titleClassName?: string
    subtitleClassName?: string
  }
>(({ 
  className, 
  title, 
  subtitle, 
  href,
  titleClassName,
  subtitleClassName,
  children,
  ...props 
}, ref) => {
  const titleElement = (
    <h3 className={cn(
      "text-lg font-semibold leading-tight text-white line-clamp-2 group-hover:text-primary-300 transition-colors",
      titleClassName
    )}>
      {title}
    </h3>
  )
  
  return (
    <div ref={ref} className={cn('space-y-2', className)} {...props}>
      {href ? (
        <Link href={href} className="block">
          {titleElement}
        </Link>
      ) : titleElement}
      
      {subtitle && (
        <div className="flex items-center gap-1 text-sm text-gray-400">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className={cn("line-clamp-1", subtitleClassName)}>
            {subtitle}
          </span>
        </div>
      )}
      
      {children}
    </div>
  )
})
CardHeader.displayName = "CardHeader"

// Card content with standardized padding
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn('px-6 py-4 flex-1 space-y-4', className)} 
    {...props} 
  />
))
CardContent.displayName = "CardContent"

// Card footer with standardized actions
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    primaryAction?: {
      label: string
      href?: string
      onClick?: () => void
      variant?: 'default' | 'secondary' | 'outline' | 'ghost'
      disabled?: boolean
    }
    secondaryAction?: {
      label: string
      href?: string
      onClick?: () => void
      icon?: React.ReactNode
    }
    minInvestment?: string
  }
>(({ 
  className, 
  primaryAction,
  secondaryAction,
  minInvestment,
  children,
  ...props 
}, ref) => (
  <div ref={ref} className={cn('px-6 py-4 pt-0', className)} {...props}>
    <div className="space-y-3">
      <Separator className="bg-gray-800" />
      
      <div className="flex gap-2">
        {primaryAction && (
          primaryAction.href ? (
            <Link href={primaryAction.href} className="flex-1">
              <Button 
                className="w-full" 
                variant={primaryAction.variant || 'default'}
                disabled={primaryAction.disabled}
              >
                {primaryAction.label}
              </Button>
            </Link>
          ) : (
            <Button 
              className="flex-1" 
              variant={primaryAction.variant || 'default'}
              onClick={primaryAction.onClick}
              disabled={primaryAction.disabled}
            >
              {primaryAction.label}
            </Button>
          )
        )}
        
        {secondaryAction && (
          secondaryAction.href ? (
            <Link href={secondaryAction.href}>
              <Button variant="outline" className="border-primary/50 hover:bg-primary/10">
                {secondaryAction.icon}
                {secondaryAction.label}
              </Button>
            </Link>
          ) : (
            <Button 
              variant="outline" 
              className="border-primary/50 hover:bg-primary/10"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.icon}
              {secondaryAction.label}
            </Button>
          )
        )}
      </div>
      
      {minInvestment && (
        <p className="text-xs text-center text-gray-500">
          Min. investment: {minInvestment}
        </p>
      )}
      
      {children}
    </div>
  </div>
))
CardFooter.displayName = "CardFooter"

// Main standardized card component
export interface StandardizedCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  // Image props
  image?: {
    src: string
    alt: string
    priority?: boolean
  }
  
  // Header props
  title: string
  subtitle?: string
  titleHref?: string
  
  // Badges and status
  badges?: Array<{
    label: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
    icon?: React.ReactNode
  }>
  
  // Actions
  onFavorite?: () => void
  onShare?: () => void
  isFavorited?: boolean
  
  // Progress
  progress?: {
    label: string
    value: number
    max?: number
    currentValue?: string
    targetValue?: string
    variant?: 'default' | 'success' | 'warning' | 'danger'
  }
  
  // Footer actions
  primaryAction?: {
    label: string
    href?: string
    onClick?: () => void
    variant?: 'default' | 'secondary' | 'outline' | 'ghost'
    disabled?: boolean
  }
  secondaryAction?: {
    label: string
    href?: string
    onClick?: () => void
    icon?: React.ReactNode
  }
  minInvestment?: string
  
  // Animation
  animationDelay?: number
}

const StandardizedCard = React.forwardRef<HTMLDivElement, StandardizedCardProps>(({
  className,
  variant,
  size,
  image,
  title,
  subtitle,
  titleHref,
  badges = [],
  onFavorite,
  onShare,
  isFavorited = false,
  progress,
  primaryAction,
  secondaryAction,
  minInvestment,
  animationDelay = 0,
  children,
  ...props
}, ref) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: animationDelay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
      className="h-full"
    >
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, size }),
          'flex flex-col h-full',
          className
        )}
        {...props}
      >
        {/* Image Section */}
        {image && (
          <ImageContainer
            src={image.src}
            alt={image.alt}
            priority={image.priority}
          >
            {/* Badges */}
            {badges.length > 0 && (
              <BadgeContainer position="top-left">
                {badges.map((badge, index) => (
                  <Badge 
                    key={index}
                    variant={badge.variant || 'default'}
                    className="gap-1 bg-black/40 backdrop-blur-md border-white/20 text-white"
                  >
                    {badge.icon}
                    {badge.label}
                  </Badge>
                ))}
              </BadgeContainer>
            )}
            
            {/* Action buttons */}
            <ActionButtons
              onFavorite={onFavorite}
              onShare={onShare}
              isFavorited={isFavorited}
            />
          </ImageContainer>
        )}
        
        {/* Content */}
        <div className="flex flex-col flex-1">
          {/* Header */}
          <div className="px-6 py-4 pb-2">
            <CardHeader 
              title={title}
              subtitle={subtitle}
              href={titleHref}
            />
          </div>
          
          {/* Body Content */}
          <CardContent>
            {/* Progress */}
            {progress && (
              <AccessibleProgress
                label={progress.label}
                value={progress.value}
                max={progress.max}
                variant={progress.variant}
                currentValue={progress.currentValue}
                targetValue={progress.targetValue}
              />
            )}
            
            {children}
          </CardContent>
          
          {/* Footer */}
          <CardFooter
            primaryAction={primaryAction}
            secondaryAction={secondaryAction}
            minInvestment={minInvestment}
          />
        </div>
      </div>
    </motion.div>
  )
})
StandardizedCard.displayName = "StandardizedCard"

export {
  StandardizedCard,
  ImageContainer,
  BadgeContainer,
  ActionButtons,
  AccessibleProgress,
  CardHeader,
  CardContent,
  CardFooter,
  cardVariants
}