/**
 * Enhanced Navigation Header - PropertyLend
 * 
 * Phase 2.4: Navigation & Header Improvements
 * - Full scroll-aware navbar with adaptive styling
 * - Proper content overlap prevention
 * - Glassmorphic effects with theme adaptation
 * - Mobile responsive padding
 * - Smooth transitions for all properties
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
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

// Navigation items structure with enhanced descriptions
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

// Custom hook for scroll-aware navbar
const useScrollNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isAtTop, setIsAtTop] = useState(true)

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    setScrollY(currentScrollY)
    setIsScrolled(currentScrollY > 20)
    setIsAtTop(currentScrollY < 5)
  }, [])

  useEffect(() => {
    handleScroll() // Check initial state
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return { isScrolled, scrollY, isAtTop }
}

interface HeaderEnhancedProps {
  className?: string
}

// Navbar height constants for consistent spacing
export const NAVBAR_HEIGHT = {
  mobile: 60,
  desktop: 72,
}

export function HeaderEnhanced({ className }: HeaderEnhancedProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notificationCount] = useState(3)
  const [isAuthenticated] = useState(false)
  const [currentAPY] = useState(12.4)
  const [currentNetwork] = useState('Polygon')
  const [isNetworkConnected] = useState(true)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { isScrolled, isAtTop } = useScrollNavbar()

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

  return (
    <>
      {/* Main Header */}
      <header 
        className={cn(
          // Fixed positioning with proper z-index
          'fixed top-0 w-full z-50',
          // Height responsive to screen size
          'h-[60px] lg:h-[72px]',
          // Smooth transition for all properties (300ms as per spec)
          'transition-all duration-300 ease-out',
          // Scroll-aware styling
          isAtTop ? [
            // At top of page - transparent background
            'bg-transparent',
            'border-b border-transparent',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          ] : isScrolled ? [
            // Scrolled state - solid background with glassmorphism
            theme === 'dark' ? [
              'bg-gray-950/95', // Dark bg with 95% opacity as per spec
              'backdrop-blur-xl', // Enhanced blur (12px as per spec)
              'border-b border-white/10',
              'shadow-lg shadow-black/30'
            ] : [
              'bg-white/95', // Light theme adjustments
              'backdrop-blur-xl',
              'border-b border-gray-200/50',
              'shadow-lg shadow-black/5'
            ]
          ] : [
            // Transitioning state
            theme === 'dark' ? [
              'bg-gray-950/80',
              'backdrop-blur-md',
              'border-b border-white/5'
            ] : [
              'bg-white/80',
              'backdrop-blur-md',
              'border-b border-gray-200/30'
            ]
          ],
          className
        )}
      >
        <div className="container mx-auto max-w-[1440px] px-4 lg:px-12 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo Section */}
            <Link 
              href={ROUTES.HOME}
              className="flex items-center gap-3 group transition-all duration-200 hover:glow-primary rounded-lg p-1"
            >
              <div className="relative w-10 h-10 gradient-primary rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-105">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-none">
                  PropertyLend
                </span>
                <span className="text-xs text-muted-foreground leading-none mt-0.5 hidden sm:block">
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
                              isAtTop && theme === 'dark' 
                                ? 'text-gray-300 hover:text-white data-[state=open]:text-white'
                                : 'text-muted-foreground hover:text-primary data-[state=open]:text-primary'
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
                              ? 'text-primary bg-accent'
                              : isAtTop && theme === 'dark'
                              ? 'text-gray-300 hover:text-white hover:bg-white/10'
                              : 'text-muted-foreground hover:text-primary hover:bg-accent/50'
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
                isScrolled 
                  ? "bg-gradient-success/10 border border-success/20"
                  : "bg-gradient-success/20 border border-success/30"
              )}>
                <DollarSign className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">
                  APY: {currentAPY}%
                </span>
              </div>
              
              {/* Network Indicator */}
              <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300",
                isScrolled
                  ? "bg-primary/10 border border-primary/20"
                  : "bg-primary/20 border border-primary/30"
              )}>
                <Circle className={cn(
                  "w-2 h-2 rounded-full",
                  isNetworkConnected ? "bg-success animate-pulse" : "bg-destructive"
                )} />
                <span className="text-sm font-medium text-primary">
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
                    className={cn(
                      "hidden sm:inline-flex",
                      isAtTop && theme === 'dark' && "hover:bg-white/10"
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

              {isAuthenticated ? (
                <>
                  {/* Notification Bell */}
                  <div className="hidden lg:block relative">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className={cn(
                        "relative w-10 h-10",
                        isAtTop && theme === 'dark' 
                          ? "text-gray-300 hover:text-white hover:bg-white/10"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Bell className="w-5 h-5" />
                      {notificationCount > 0 && (
                        <Badge 
                          className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs bg-destructive text-destructive-foreground border-2 border-background"
                        >
                          {notificationCount}
                        </Badge>
                      )}
                    </Button>
                  </div>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.initials}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      className="w-56" 
                      align="end" 
                      forceMount
                      sideOffset={8}
                    >
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.name}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={ROUTES.INVESTOR_DASHBOARD}>
                          <User className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={ROUTES.SETTINGS}>
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link href="/docs">
                    <Button 
                      variant="ghost" 
                      className={cn(
                        "hidden sm:inline-flex",
                        isAtTop && theme === 'dark' && "text-gray-300 hover:text-white hover:bg-white/10"
                      )}
                    >
                      Docs
                    </Button>
                  </Link>
                  <Button className="gradient-primary animate-shimmer-web3 font-semibold">
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
                      className={cn(
                        isAtTop && theme === 'dark' && "hover:bg-white/10"
                      )}
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

                      {/* Theme Toggle for Mobile */}
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between px-3 py-2">
                          <span className="text-sm font-medium">Theme</span>
                          <div className="flex gap-1">
                            <Button
                              variant={theme === 'light' ? 'default' : 'ghost'}
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setTheme('light')}
                            >
                              <Sun className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={theme === 'dark' ? 'default' : 'ghost'}
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setTheme('dark')}
                            >
                              <Moon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={theme === 'system' ? 'default' : 'ghost'}
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setTheme('system')}
                            >
                              <Monitor className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Auth Section */}
                      {!isAuthenticated ? (
                        <div className="border-t pt-4 space-y-2">
                          <Link href={ROUTES.LOGIN} onClick={() => setIsOpen(false)}>
                            <Button 
                              variant="outline" 
                              className="w-full justify-start"
                            >
                              <User className="mr-2 h-4 w-4" />
                              Sign In
                            </Button>
                          </Link>
                          <Link href={ROUTES.REGISTER} onClick={() => setIsOpen(false)}>
                            <Button 
                              className="w-full justify-start"
                            >
                              Get Started
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="border-t pt-4 space-y-2">
                          <div className="px-3 py-2">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="text-xs">{user.initials}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">{user.name}</div>
                                <div className="text-xs text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </div>
                          
                          <Link
                            href={ROUTES.INVESTOR_DASHBOARD}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            <Home className="h-4 w-4" />
                            Dashboard
                          </Link>
                          
                          {notificationCount > 0 && (
                            <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors cursor-pointer">
                              <Bell className="h-4 w-4" />
                              Notifications
                              <Badge className="ml-auto text-xs bg-destructive text-destructive-foreground">
                                {notificationCount}
                              </Badge>
                            </div>
                          )}
                          
                          <Link
                            href={ROUTES.SETTINGS}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            <Settings className="h-4 w-4" />
                            Settings
                          </Link>
                          
                          <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors cursor-pointer text-destructive">
                            <LogOut className="h-4 w-4" />
                            Log out
                          </div>
                        </div>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Invisible spacer to prevent content overlap */}
      {/* This is rendered as part of the header component to ensure consistent spacing */}
      <div 
        className={cn(
          "w-full",
          "h-[60px] lg:h-[72px]" // Match header height exactly
        )}
        aria-hidden="true"
      />
    </>
  )
}