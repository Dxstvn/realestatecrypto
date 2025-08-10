/**
 * Mobile Optimizations - PropertyChain
 * 
 * Mobile-specific components and interactions
 * Following CLAUDE.md mobile-first design principles
 */

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Home,
  Search,
  Heart,
  User,
  Menu,
  X,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Building,
  DollarSign,
  TrendingUp,
  Bell,
  MessageSquare,
  MapPin,
  Filter,
  Grid,
  List,
  Map as MapIcon,
  Camera,
  Share2,
  Download,
  MoreVertical,
  Plus,
  RefreshCw,
  Loader2,
  ArrowUp,
  Smartphone,
  Monitor,
  Zap,
  Wifi,
  WifiOff,
} from 'lucide-react'
import { motion, AnimatePresence, PanInfo, useAnimation, useMotionValue, useTransform } from 'framer-motion'

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface BottomTabBarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  className?: string
}

export interface PullToRefreshProps {
  children: React.ReactNode
  onRefresh: () => Promise<void>
  threshold?: number
  className?: string
}

export interface SwipeableCardProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  className?: string
}

export interface TouchRippleProps {
  children: React.ReactNode
  color?: string
  duration?: number
  className?: string
}

export interface AppInstallPromptProps {
  appName?: string
  appIcon?: string
  onInstall?: () => void
  onDismiss?: () => void
}

export interface MobileDrawerProps {
  children: React.ReactNode
  trigger: React.ReactNode
  side?: 'left' | 'right' | 'top' | 'bottom'
  className?: string
}

export interface FloatingActionButtonProps {
  icon?: React.ReactNode
  onClick?: () => void
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center'
  className?: string
}

// ============================================================================
// Bottom Tab Bar Navigation
// ============================================================================

export function BottomTabBar({ activeTab, onTabChange, className }: BottomTabBarProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'favorites', label: 'Saved', icon: Heart },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 3 },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40',
        'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80',
        'border-t',
        'md:hidden', // Only show on mobile
        className
      )}
    >
      <nav className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center',
                'w-full h-full py-2',
                'relative group',
                'transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isActive && 'text-primary'
              )}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Touch ripple effect */}
              <TouchRipple className="absolute inset-0">
                <div className="relative">
                  <Icon
                    className={cn(
                      'h-5 w-5 transition-all duration-200',
                      isActive ? 'scale-110' : 'group-active:scale-95'
                    )}
                  />
                  {tab.badge && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                    >
                      {tab.badge}
                    </Badge>
                  )}
                </div>
              </TouchRipple>
              <span className={cn(
                'text-[10px] mt-1 transition-all duration-200',
                isActive ? 'font-medium' : 'text-muted-foreground'
              )}>
                {tab.label}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-full"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </nav>
      
      {/* Safe area for iOS */}
      <div className="h-safe-area-inset-bottom bg-background" />
    </div>
  )
}

// ============================================================================
// Pull to Refresh
// ============================================================================

export function PullToRefresh({
  children,
  onRefresh,
  threshold = 80,
  className,
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [pullDistance, setPullDistance] = React.useState(0)
  const [startY, setStartY] = React.useState(0)
  const [isPulling, setIsPulling] = React.useState(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY)
      setIsPulling(true)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling || isRefreshing) return
    
    const currentY = e.touches[0].clientY
    const distance = Math.max(0, currentY - startY)
    
    if (distance > 0) {
      e.preventDefault()
      setPullDistance(Math.min(distance, threshold * 1.5))
    }
  }

  const handleTouchEnd = async () => {
    if (!isPulling) return
    
    setIsPulling(false)
    
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true)
      await onRefresh()
      setIsRefreshing(false)
    }
    
    setPullDistance(0)
  }

  const progress = Math.min(pullDistance / threshold, 1)
  const rotation = progress * 360

  return (
    <div
      className={cn('relative', className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 flex items-center justify-center',
          'transition-all duration-200 z-30',
          'pointer-events-none'
        )}
        style={{
          height: `${pullDistance}px`,
          opacity: progress,
        }}
      >
        <div className="relative">
          {isRefreshing ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : (
            <RefreshCw
              className="h-6 w-6 text-primary transition-transform"
              style={{ transform: `rotate(${rotation}deg)` }}
            />
          )}
        </div>
      </div>
      
      {/* Content */}
      <div
        className="transition-transform duration-200"
        style={{
          transform: `translateY(${isRefreshing ? threshold : pullDistance}px)`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

// ============================================================================
// Swipeable Card
// ============================================================================

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 100,
  className,
}: SwipeableCardProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const controls = useAnimation()
  
  const rotateX = useTransform(y, [-100, 100], [10, -10])
  const rotateY = useTransform(x, [-100, 100], [-10, 10])
  const opacity = useTransform(
    x,
    [-200, -100, 0, 100, 200],
    [0.5, 1, 1, 1, 0.5]
  )

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const { offset, velocity } = info
    
    // Determine swipe direction
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      // Horizontal swipe
      if (offset.x > threshold) {
        await controls.start({ x: 300, opacity: 0 })
        onSwipeRight?.()
      } else if (offset.x < -threshold) {
        await controls.start({ x: -300, opacity: 0 })
        onSwipeLeft?.()
      } else {
        controls.start({ x: 0, y: 0, opacity: 1 })
      }
    } else {
      // Vertical swipe
      if (offset.y > threshold) {
        await controls.start({ y: 300, opacity: 0 })
        onSwipeDown?.()
      } else if (offset.y < -threshold) {
        await controls.start({ y: -300, opacity: 0 })
        onSwipeUp?.()
      } else {
        controls.start({ x: 0, y: 0, opacity: 1 })
      }
    }
  }

  return (
    <motion.div
      className={cn('cursor-grab active:cursor-grabbing', className)}
      style={{
        x,
        y,
        rotateX,
        rotateY,
        opacity,
      }}
      drag
      dragElastic={0.2}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// Touch Ripple Effect
// ============================================================================

export function TouchRipple({
  children,
  color = 'rgba(0, 0, 0, 0.1)',
  duration = 600,
  className,
}: TouchRippleProps) {
  const [ripples, setRipples] = React.useState<Array<{
    x: number
    y: number
    size: number
    id: number
  }>>([])

  const handleTouch = (e: React.TouchEvent | React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2
    
    let x: number, y: number
    
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left - size / 2
      y = e.touches[0].clientY - rect.top - size / 2
    } else {
      x = e.clientX - rect.left - size / 2
      y = e.clientY - rect.top - size / 2
    }

    const id = Date.now()
    setRipples(prev => [...prev, { x, y, size, id }])

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id))
    }, duration)
  }

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      onTouchStart={handleTouch}
      onMouseDown={handleTouch}
    >
      {children}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              backgroundColor: color,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration / 1000 }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// App Install Prompt (PWA)
// ============================================================================

export function AppInstallPrompt({
  appName = 'PropertyChain',
  appIcon = '/icon-192.png',
  onInstall,
  onDismiss,
}: AppInstallPromptProps) {
  const [showPrompt, setShowPrompt] = React.useState(false)
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null)
  const [isIOS, setIsIOS] = React.useState(false)

  React.useEffect(() => {
    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Show iOS install instructions
    if (isIOSDevice && !(window.navigator as any).standalone) {
      setTimeout(() => setShowPrompt(true), 3000)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        onInstall?.()
      }
      
      setDeferredPrompt(null)
    }
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    onDismiss?.()
    
    // Don't show again for 7 days
    localStorage.setItem('app-install-dismissed', Date.now().toString())
  }

  if (!showPrompt) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-20 left-4 right-4 z-50 md:hidden"
      >
        <Card className="border-primary/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <img
                src={appIcon}
                alt={appName}
                className="h-12 w-12 rounded-xl"
              />
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="font-semibold">Install {appName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {isIOS
                      ? 'Tap the share button and select "Add to Home Screen"'
                      : 'Install our app for a better experience'}
                  </p>
                </div>
                {!isIOS && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleInstall}>
                      Install
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleDismiss}>
                      Not now
                    </Button>
                  </div>
                )}
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={handleDismiss}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {isIOS && (
              <div className="mt-3 flex items-center justify-center text-primary">
                <Share2 className="h-5 w-5 mr-2" />
                <ArrowUp className="h-4 w-4 animate-bounce" />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

// ============================================================================
// Mobile Drawer
// ============================================================================

export function MobileDrawer({
  children,
  trigger,
  side = 'bottom',
  className,
}: MobileDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side={side}
        className={cn(
          'md:hidden', // Only show on mobile
          side === 'bottom' && 'h-[80vh] rounded-t-2xl',
          className
        )}
      >
        {/* Drag handle for bottom sheets */}
        {side === 'bottom' && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 h-1 w-12 bg-muted-foreground/20 rounded-full" />
        )}
        {children}
      </SheetContent>
    </Sheet>
  )
}

// ============================================================================
// Floating Action Button
// ============================================================================

export function FloatingActionButton({
  icon = <Plus className="h-6 w-6" />,
  onClick,
  position = 'bottom-right',
  className,
}: FloatingActionButtonProps) {
  const positionClasses = {
    'bottom-right': 'bottom-20 right-4',
    'bottom-left': 'bottom-20 left-4',
    'bottom-center': 'bottom-20 left-1/2 -translate-x-1/2',
  }

  return (
    <motion.button
      className={cn(
        'fixed z-40 md:hidden', // Only show on mobile
        'h-14 w-14 rounded-full',
        'bg-primary text-primary-foreground',
        'shadow-lg shadow-primary/25',
        'flex items-center justify-center',
        'active:scale-95 transition-transform',
        positionClasses[position],
        className
      )}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      <TouchRipple className="absolute inset-0 rounded-full overflow-hidden">
        {icon}
      </TouchRipple>
    </motion.button>
  )
}

// ============================================================================
// Mobile Property Card (Optimized)
// ============================================================================

export function MobilePropertyCard({
  property,
  onFavorite,
  onShare,
}: {
  property: {
    id: string
    title: string
    address: string
    price: number
    image: string
    beds: number
    baths: number
    sqft: number
    isFavorite?: boolean
  }
  onFavorite?: () => void
  onShare?: () => void
}) {
  return (
    <TouchRipple>
      <Card className="overflow-hidden">
        <div className="relative">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 rounded-full bg-background/80 backdrop-blur"
              onClick={(e) => {
                e.stopPropagation()
                onFavorite?.()
              }}
            >
              <Heart
                className={cn(
                  'h-4 w-4',
                  property.isFavorite && 'fill-current text-red-500'
                )}
              />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 rounded-full bg-background/80 backdrop-blur"
              onClick={(e) => {
                e.stopPropagation()
                onShare?.()
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg">{property.title}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3" />
            {property.address}
          </p>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xl font-bold">${property.price.toLocaleString()}</p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{property.beds} bed</span>
              <span>{property.baths} bath</span>
              <span>{property.sqft} sqft</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </TouchRipple>
  )
}

// ============================================================================
// Mobile Filter Bar
// ============================================================================

export function MobileFilterBar({
  onFilterClick,
  onSortChange,
  onViewChange,
  activeView = 'grid',
}: {
  onFilterClick?: () => void
  onSortChange?: (sort: string) => void
  onViewChange?: (view: 'grid' | 'list' | 'map') => void
  activeView?: 'grid' | 'list' | 'map'
}) {
  return (
    <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b md:hidden">
      <div className="flex items-center justify-between p-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onFilterClick}
          className="flex-1 mr-2"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
        
        <div className="flex items-center gap-1">
          <Button
            variant={activeView === 'grid' ? 'default' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onViewChange?.('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={activeView === 'list' ? 'default' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onViewChange?.('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={activeView === 'map' ? 'default' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onViewChange?.('map')}
          >
            <MapIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Offline Indicator
// ============================================================================

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = React.useState(true)

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
      className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground p-2 text-center text-sm md:hidden"
    >
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="h-4 w-4" />
        <span>You're offline. Some features may be limited.</span>
      </div>
    </motion.div>
  )
}

// ============================================================================
// All components are exported as named exports above
// ============================================================================