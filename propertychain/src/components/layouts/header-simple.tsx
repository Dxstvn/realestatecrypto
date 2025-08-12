/**
 * Simple Transparent Header - PropertyLend
 * 
 * Transparent header with simple white/black text switching
 * Clean and minimal approach
 */

'use client'

import { useState, useEffect, useRef } from 'react'
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

// Navigation items
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

interface HeaderSimpleProps {
  className?: string
}

export function HeaderSimple({ className }: HeaderSimpleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notificationCount] = useState(3)
  const [isAuthenticated] = useState(false)
  const [currentAPY] = useState(12.4)
  const [currentNetwork] = useState('Polygon')
  const [isNetworkConnected] = useState(true)
  const [isDarkBackground, setIsDarkBackground] = useState(true)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const headerRef = useRef<HTMLElement>(null)

  // Simple background detection based on scroll position and sections
  useEffect(() => {
    const checkBackground = () => {
      if (!headerRef.current) return

      const scrollY = window.scrollY
      const headerRect = headerRef.current.getBoundingClientRect()
      const centerY = headerRect.top + headerRect.height / 2

      // Get all elements at the center of the navbar
      const elements = document.elementsFromPoint(window.innerWidth / 2, centerY)
      
      // Look for sections to determine background
      let backgroundIsDark = true // Default to dark (for hero sections)
      let foundBackground = false
      
      for (const element of elements) {
        // Skip the header itself
        if (headerRef.current.contains(element)) continue
        
        // Check for specific section classes or data attributes
        const classList = element.className
        if (typeof classList === 'string') {
          // Check for light background indicators
          if (classList.includes('bg-white') || 
              classList.includes('bg-gray-50') || 
              classList.includes('bg-blue-50') ||
              classList.includes('bg-purple-50') ||
              classList.includes('light-section')) {
            backgroundIsDark = false
            foundBackground = true
            break
          }
          // Check for dark background indicators (including gradients)
          if (classList.includes('bg-gray-900') || 
              classList.includes('bg-gray-950') || 
              classList.includes('bg-purple-950') ||
              classList.includes('bg-gradient') ||
              classList.includes('from-gray-9') ||
              classList.includes('from-purple-9') ||
              classList.includes('from-blue-9') ||
              classList.includes('to-gray-9') ||
              classList.includes('to-purple-9') ||
              classList.includes('dark-section')) {
            backgroundIsDark = true
            foundBackground = true
            break
          }
        }
        
        // Check computed styles as fallback
        const computedStyle = window.getComputedStyle(element)
        const bgImage = computedStyle.backgroundImage
        
        // Check if it's a gradient (gradients are usually dark in this app)
        if (bgImage && bgImage !== 'none' && bgImage.includes('gradient')) {
          backgroundIsDark = true
          foundBackground = true
          break
        }
        
        const bgColor = computedStyle.backgroundColor
        if (bgColor && bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)') {
          // Parse RGB values
          const rgb = bgColor.match(/\d+/g)
          if (rgb) {
            const [r, g, b] = rgb.map(Number)
            // Calculate brightness
            const brightness = (r * 299 + g * 587 + b * 114) / 1000
            backgroundIsDark = brightness < 128
            foundBackground = true
            break
          }
        }
      }
      
      // If we didn't find a definitive background, use scroll position heuristic
      if (!foundBackground) {
        // First 600px is usually dark (hero section)
        // Most light sections start after that
        backgroundIsDark = scrollY < 600
      }
      
      setIsDarkBackground(backgroundIsDark)
    }

    // Initial check
    checkBackground()
    
    // Check on scroll
    const handleScroll = () => {
      requestAnimationFrame(checkBackground)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  // Simple text color based on background
  const textColor = isDarkBackground ? 'white' : 'black'
  const textColorSecondary = isDarkBackground ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)'
  const textColorMuted = isDarkBackground ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'
  const hoverBg = isDarkBackground ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
  const activeBg = isDarkBackground ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'

  return (
    <>
      {/* Main Header - Completely Transparent */}
      <header 
        ref={headerRef}
        className={cn(
          'fixed top-0 w-full z-50',
          'h-[60px] lg:h-[72px]',
          'transition-colors duration-300',
          className
        )}
        style={{
          backgroundColor: 'transparent',
        }}
      >
        <div className="container mx-auto max-w-[1440px] px-4 lg:px-12 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo Section */}
            <Link 
              href={ROUTES.HOME}
              className="flex items-center gap-3 group transition-all duration-200 rounded-lg p-1"
              style={{ 
                backgroundColor: 'transparent',
                ':hover': { backgroundColor: hoverBg }
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverBg}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div 
                className="relative w-10 h-10 rounded-lg flex items-center justify-center shadow-sm transition-all duration-200 group-hover:scale-105"
                style={{
                  backgroundColor: isDarkBackground ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${isDarkBackground ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`
                }}
              >
                <TrendingUp className="w-6 h-6" style={{ color: textColor }} />
              </div>
              
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-none" style={{ color: textColor }}>
                  PropertyLend
                </span>
                <span className="text-xs leading-none mt-0.5 hidden sm:block" style={{ color: textColorMuted }}>
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
                            className="h-auto px-4 py-2 text-[15px] font-medium transition-colors duration-200 bg-transparent"
                            style={{ 
                              color: textColorSecondary,
                              ':hover': { color: textColor }
                            }}
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
                          className="inline-flex items-center px-4 py-2 text-[15px] font-medium rounded-lg transition-all duration-200"
                          style={{ 
                            color: textColorSecondary,
                            backgroundColor: isActiveLink(item.href || '') ? activeBg : 'transparent'
                          }}
                          onMouseEnter={(e) => {
                            if (!isActiveLink(item.href || '')) {
                              e.currentTarget.style.backgroundColor = hoverBg
                              e.currentTarget.style.color = textColor
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActiveLink(item.href || '')) {
                              e.currentTarget.style.backgroundColor = 'transparent'
                              e.currentTarget.style.color = textColorSecondary
                            }
                          }}
                        >
                          {item.title}
                        </Link>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
              
              {/* APY Ticker */}
              <div 
                className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: isDarkBackground ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.15)',
                  border: `1px solid ${isDarkBackground ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.25)'}`,
                  color: isDarkBackground ? '#86efac' : '#16a34a'
                }}
              >
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-medium">
                  APY: {currentAPY}%
                </span>
              </div>
              
              {/* Network Indicator */}
              <div 
                className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: isDarkBackground ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)',
                  border: `1px solid ${isDarkBackground ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.25)'}`,
                  color: isDarkBackground ? '#93c5fd' : '#2563eb'
                }}
              >
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
              {/* Theme Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="hidden sm:inline-flex"
                    style={{ 
                      color: textColor,
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverBg}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
                      className="hidden sm:inline-flex"
                      style={{ 
                        color: textColorSecondary,
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = hoverBg
                        e.currentTarget.style.color = textColor
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = textColorSecondary
                      }}
                    >
                      Docs
                    </Button>
                  </Link>
                  <Button 
                    className="font-semibold"
                    style={{
                      backgroundColor: isDarkBackground ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                      color: textColor,
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${isDarkBackground ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDarkBackground ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isDarkBackground ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'
                    }}
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
                      style={{ 
                        color: textColor,
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverBg}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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