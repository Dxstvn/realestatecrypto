/**
 * Adaptive Transparent Header - PropertyLend
 * 
 * Enhanced header with advanced text color adaptation
 * Uses CSS mix-blend-mode with Intersection Observer fallback
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu-fixed'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Bell,
  Menu,
  User,
  Settings,
  LogOut,
  Home,
  TrendingUp,
  Wallet,
  DollarSign,
  Circle,
  ChevronRight,
  Shield,
  Zap,
  Award,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'

// Navigation items structure
interface NavItem {
  title: string
  href?: string
  description?: string
  icon?: React.ReactNode
  badge?: string
  items?: NavItem[]
}

const navigation: NavItem[] = [
  {
    title: 'Earn',
    items: [
      {
        title: 'Senior Tranches',
        href: '/earn/senior',
        description: 'Stable 8% APY with priority payment protection',
        icon: <Shield className="h-4 w-4 text-blue-400" />,
        badge: 'Low Risk'
      },
      {
        title: 'Junior Tranches',
        href: '/earn/junior',
        description: 'Higher yields 20-30% APY with enhanced returns',
        icon: <Zap className="h-4 w-4 text-green-400" />,
        badge: 'High Yield'
      },
      {
        title: 'Pool Overview',
        href: '/earn/pools',
        description: 'Explore all available lending pools and performance',
        icon: <Award className="h-4 w-4 text-purple-400" />
      }
    ]
  },
  {
    title: 'Positions',
    items: [
      {
        title: 'My Investments',
        href: '/positions',
        description: 'Track your lending positions and earned yields',
        icon: <TrendingUp className="h-4 w-4 text-primary" />
      },
      {
        title: 'Transaction History',
        href: '/positions/history',
        description: 'Complete record of deposits, withdrawals, and earnings',
        icon: <DollarSign className="h-4 w-4 text-yellow-500" />
      }
    ]
  },
  {
    title: 'Loans',
    items: [
      {
        title: 'Active Loans',
        href: '/loans',
        description: 'Monitor funded real estate loans and their performance',
        icon: <Home className="h-4 w-4 text-orange-400" />
      },
      {
        title: 'Apply for Loan',
        href: '/loans/apply',
        description: 'Submit your real estate for bridge lending consideration',
        icon: <ChevronRight className="h-4 w-4 text-gray-400" />
      }
    ]
  },
  {
    title: 'DAO',
    href: '/dao',
  },
]

// Navbar height constants
export const NAVBAR_HEIGHT = {
  mobile: 60,
  desktop: 72,
}

// Calculate brightness using YIQ formula
const calculateBrightness = (color: string): number => {
  // Parse RGB values from color string
  const rgb = color.match(/\d+/g)
  if (!rgb) return 255 // Default to light background
  
  const [r, g, b] = rgb.map(Number)
  // YIQ formula for perceived brightness
  return ((r * 299) + (g * 587) + (b * 114)) / 1000
}

// Get the dominant background color at a given position
const getBackgroundAtPosition = (element: HTMLElement): string => {
  const rect = element.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2
  
  // Find all elements at this position
  const elements = document.elementsFromPoint(x, y)
  
  // Find the first element with a background color
  for (const el of elements) {
    if (el === element || element.contains(el)) continue
    
    const style = window.getComputedStyle(el)
    const bgColor = style.backgroundColor
    
    if (bgColor && bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)') {
      return bgColor
    }
  }
  
  return 'rgb(255, 255, 255)' // Default to white
}

interface HeaderAdaptiveProps {
  className?: string
  mode?: 'mix-blend' | 'intersection' | 'auto'
}

export function HeaderAdaptive({ 
  className,
  mode = 'auto'
}: HeaderAdaptiveProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notificationCount] = useState(3)
  const [isAuthenticated] = useState(false)
  const [currentAPY] = useState(12.4)
  const [currentNetwork] = useState('Polygon')
  const [isNetworkConnected] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const [textStyle, setTextStyle] = useState<'light' | 'dark' | 'auto'>('auto')
  const [useMixBlend, setUseMixBlend] = useState(mode === 'mix-blend')
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const headerRef = useRef<HTMLElement>(null)

  // Intersection Observer for precise background detection
  useEffect(() => {
    if (mode === 'mix-blend' || !headerRef.current) return

    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const bgColor = getBackgroundAtPosition(entry.target as HTMLElement)
          const brightness = calculateBrightness(bgColor)
          
          // Set text style based on background brightness
          setTextStyle(brightness > 128 ? 'dark' : 'light')
        }
      })
    }, observerOptions)

    // Observe all main sections
    const sections = document.querySelectorAll('section, main > div')
    sections.forEach(section => observer.observe(section))

    return () => observer.disconnect()
  }, [mode])

  // Scroll position tracking
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      
      // Simple heuristic for scroll-based adaptation
      if (mode === 'auto' && textStyle === 'auto') {
        if (currentScrollY < 100) {
          setTextStyle('light') // Hero sections are usually dark
        } else {
          setTextStyle(theme === 'dark' ? 'light' : 'dark')
        }
      }
    }
    
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [theme, mode, textStyle])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/avatars/user.jpg',
    initials: 'JD'
  }

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  // Determine text color classes based on current style
  const getTextColorClass = () => {
    if (useMixBlend) {
      // For mix-blend mode, always use white text
      return {
        primary: 'text-white',
        secondary: 'text-white/90',
        muted: 'text-white/70',
        hover: 'hover:bg-white/10',
        active: 'bg-white/20',
        border: 'border-white/20'
      }
    }
    
    if (textStyle === 'light' || textStyle === 'auto') {
      return {
        primary: 'text-white hover:text-gray-200',
        secondary: 'text-gray-300 hover:text-white',
        muted: 'text-gray-400',
        hover: 'hover:bg-white/10',
        active: 'bg-white/20',
        border: 'border-white/20'
      }
    } else {
      return {
        primary: 'text-gray-900 hover:text-gray-700',
        secondary: 'text-gray-700 hover:text-gray-900',
        muted: 'text-gray-600',
        hover: 'hover:bg-gray-900/10',
        active: 'bg-gray-900/20',
        border: 'border-gray-900/20'
      }
    }
  }

  const colors = getTextColorClass()

  return (
    <>
      {/* Main Header */}
      <header 
        ref={headerRef}
        className={cn(
          'fixed top-0 w-full z-50',
          'h-[60px] lg:h-[72px]',
          'bg-transparent',
          'transition-all duration-300 ease-out',
          // Apply mix-blend-mode if enabled
          useMixBlend && 'mix-blend-difference',
          // Optional subtle backdrop blur
          scrollY > 50 && !useMixBlend && 'backdrop-blur-sm',
          className
        )}
        style={{
          // Ensure mix-blend-mode works properly
          ...(useMixBlend && {
            isolation: 'isolate',
          })
        }}
      >
        <div className="container mx-auto max-w-[1440px] px-4 lg:px-12 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo Section */}
            <Link 
              href={ROUTES.HOME}
              className={cn(
                "flex items-center gap-3 group transition-all duration-200 rounded-lg p-1",
                !useMixBlend && colors.hover
              )}
            >
              <div className={cn(
                "relative w-10 h-10 rounded-lg flex items-center justify-center shadow-sm transition-all duration-200 group-hover:scale-105",
                useMixBlend
                  ? "bg-white"
                  : textStyle === 'light' || textStyle === 'auto'
                    ? "bg-white/20 backdrop-blur-md border border-white/30"
                    : "bg-gray-900/20 backdrop-blur-md border border-gray-900/30"
              )}>
                <TrendingUp className={cn(
                  "w-6 h-6",
                  useMixBlend ? "text-black" : colors.primary
                )} />
              </div>
              
              <div className="flex flex-col">
                <span className={cn(
                  "text-lg font-bold leading-none",
                  colors.primary
                )}>
                  PropertyLend
                </span>
                <span className={cn(
                  "text-xs leading-none mt-0.5 hidden sm:block",
                  colors.muted
                )}>
                  DeFi Bridge Lending
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              <NavigationMenu>
                <NavigationMenuList>
                  {navigation.map((item) => (
                    <NavigationMenuItem key={item.title}>
                      {item.items ? (
                        <>
                          <NavigationMenuTrigger 
                            className={cn(
                              'h-auto px-4 py-2 text-[15px] font-medium',
                              'transition-colors duration-200',
                              'bg-transparent',
                              colors.secondary,
                              !useMixBlend && colors.hover
                            )}
                          >
                            {item.title}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <div className="w-[400px] p-4">
                              <div className="space-y-2">
                                {item.items.map((subItem) => (
                                  <Link
                                    key={subItem.title}
                                    href={subItem.href || '#'}
                                    className={cn(
                                      'block rounded-lg p-3',
                                      'hover:bg-accent/50 transition-all duration-200',
                                      'no-underline group/item',
                                      isActiveLink(subItem.href || '') && 'bg-accent'
                                    )}
                                  >
                                    <div className="flex items-start gap-3">
                                      {subItem.icon && (
                                        <div className="mt-0.5 opacity-80 group-hover/item:opacity-100 transition-opacity">
                                          {subItem.icon}
                                        </div>
                                      )}
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium text-sm text-foreground group-hover/item:text-primary transition-colors">
                                            {subItem.title}
                                          </span>
                                          {subItem.badge && (
                                            <Badge 
                                              variant="secondary" 
                                              className="text-[10px] px-1.5 py-0 h-4"
                                            >
                                              {subItem.badge}
                                            </Badge>
                                          )}
                                        </div>
                                        {subItem.description && (
                                          <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                            {subItem.description}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <Link
                          href={item.href || '#'}
                          className={cn(
                            'inline-flex items-center px-4 py-2 text-[15px] font-medium rounded-lg',
                            'transition-all duration-200',
                            isActiveLink(item.href || '')
                              ? colors.active
                              : cn(colors.secondary, !useMixBlend && colors.hover)
                          )}
                        >
                          {item.title}
                        </Link>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
              
              {/* APY Ticker */}
              <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300",
                useMixBlend
                  ? "bg-white text-black"
                  : textStyle === 'light' || textStyle === 'auto'
                    ? "bg-green-400/20 border border-green-400/30 text-green-400"
                    : "bg-green-600/20 border border-green-600/30 text-green-600"
              )}>
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-medium">
                  APY: {currentAPY}%
                </span>
              </div>
              
              {/* Network Indicator */}
              <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300",
                useMixBlend
                  ? "bg-white text-black"
                  : textStyle === 'light' || textStyle === 'auto'
                    ? "bg-blue-400/20 border border-blue-400/30 text-blue-400"
                    : "bg-blue-600/20 border border-blue-600/30 text-blue-600"
              )}>
                <Circle className={cn(
                  "w-2 h-2 rounded-full",
                  isNetworkConnected 
                    ? "bg-green-500 animate-pulse" 
                    : "bg-red-500"
                )} />
                <span className="text-sm font-medium">
                  {currentNetwork}
                </span>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Mode Toggle (for testing) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className={cn(
                      "hidden sm:inline-flex",
                      !useMixBlend && colors.hover,
                      colors.primary
                    )}
                  >
                    <span className="sr-only">Toggle adaptation mode</span>
                    <div className="text-[10px] font-bold">
                      {useMixBlend ? 'MIX' : 'OBS'}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setUseMixBlend(true)}>
                    Mix Blend Mode
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setUseMixBlend(false)}>
                    Intersection Observer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className={cn(
                      "hidden sm:inline-flex",
                      !useMixBlend && colors.hover,
                      colors.primary
                    )}
                  >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 h-4 w-4" />
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {!isAuthenticated && (
                <>
                  <Link href="/docs">
                    <Button 
                      variant="ghost" 
                      className={cn(
                        "hidden sm:inline-flex",
                        !useMixBlend && colors.hover,
                        colors.secondary
                      )}
                    >
                      Docs
                    </Button>
                  </Link>
                  <Button 
                    className={cn(
                      "font-semibold",
                      useMixBlend
                        ? "bg-white text-black hover:bg-gray-100"
                        : textStyle === 'light' || textStyle === 'auto'
                          ? "bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30"
                          : "bg-gray-900/20 hover:bg-gray-900/30 text-gray-900 backdrop-blur-md border border-gray-900/30"
                    )}
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </Button>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <div className="lg:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className={cn(!useMixBlend && colors.hover, colors.primary)}
                    >
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Open navigation menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[280px] sm:w-[300px]">
                    <SheetHeader>
                      <SheetTitle className="text-left">
                        Navigation
                      </SheetTitle>
                    </SheetHeader>
                    
                    {/* Mobile Navigation Content */}
                    <div className="mt-6 space-y-4">
                      <div className="space-y-2">
                        {navigation.map((item) => (
                          <div key={item.title} className="space-y-1">
                            {item.items ? (
                              <>
                                <div className="px-3 py-2 text-sm font-medium text-foreground">
                                  {item.title}
                                </div>
                                <div className="space-y-1 pl-4">
                                  {item.items.map((subItem) => (
                                    <Link
                                      key={subItem.title}
                                      href={subItem.href || '#'}
                                      className={cn(
                                        'block rounded-lg px-3 py-2 text-sm transition-colors',
                                        isActiveLink(subItem.href || '')
                                          ? 'bg-accent text-primary font-medium'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                                      )}
                                      onClick={() => setIsOpen(false)}
                                    >
                                      <div className="flex items-center gap-2">
                                        {subItem.icon}
                                        {subItem.title}
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <Link
                                href={item.href || '#'}
                                className={cn(
                                  'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                  isActiveLink(item.href || '')
                                    ? 'bg-accent text-primary'
                                    : 'text-foreground hover:bg-accent'
                                )}
                                onClick={() => setIsOpen(false)}
                              >
                                {item.title}
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Invisible spacer to prevent content overlap */}
      <div 
        className={cn(
          "w-full",
          "h-[60px] lg:h-[72px]"
        )}
        aria-hidden="true"
      />
    </>
  )
}