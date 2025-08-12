/**
 * Transparent Adaptive Header - PropertyLend
 * 
 * Enhanced navigation header with transparent background
 * Text colors adapt based on scroll position for optimal visibility
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

interface HeaderTransparentProps {
  className?: string
  forceLight?: boolean // Force light text (for dark backgrounds)
  forceDark?: boolean  // Force dark text (for light backgrounds)
}

export function HeaderTransparent({ 
  className,
  forceLight = false,
  forceDark = false 
}: HeaderTransparentProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notificationCount] = useState(3)
  const [isAuthenticated] = useState(false)
  const [currentAPY] = useState(12.4)
  const [currentNetwork] = useState('Polygon')
  const [isNetworkConnected] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const [textStyle, setTextStyle] = useState<'light' | 'dark'>('light')
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  // Determine text color based on scroll position and page content
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      
      // Determine if we're over a dark or light section
      // For now, we'll use scroll position as a heuristic
      // In production, you might want to check the actual background color
      if (forceLight) {
        setTextStyle('light')
      } else if (forceDark) {
        setTextStyle('dark')
      } else {
        // Auto-detect based on scroll position
        // When at top (hero section is usually dark), use light text
        // When scrolled (over content sections), adapt based on theme
        if (currentScrollY < 100) {
          setTextStyle('light') // Hero sections are usually dark
        } else {
          setTextStyle(theme === 'dark' ? 'light' : 'dark')
        }
      }
    }
    
    handleScroll() // Initial check
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [theme, forceLight, forceDark])

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
    if (textStyle === 'light') {
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
      {/* Main Header - Fully Transparent */}
      <header 
        className={cn(
          // Fixed positioning with proper z-index
          'fixed top-0 w-full z-50',
          // Height responsive to screen size
          'h-[60px] lg:h-[72px]',
          // Fully transparent background
          'bg-transparent',
          // Smooth transition for text colors
          'transition-all duration-300 ease-out',
          // Optional subtle backdrop blur for readability
          scrollY > 50 && 'backdrop-blur-sm',
          className
        )}
      >
        <div className="container mx-auto max-w-[1440px] px-4 lg:px-12 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo Section */}
            <Link 
              href={ROUTES.HOME}
              className={cn(
                "flex items-center gap-3 group transition-all duration-200 rounded-lg p-1",
                colors.hover
              )}
            >
              <div className={cn(
                "relative w-10 h-10 rounded-lg flex items-center justify-center shadow-sm transition-all duration-200 group-hover:scale-105",
                textStyle === 'light' 
                  ? "bg-white/20 backdrop-blur-md border border-white/30"
                  : "bg-gray-900/20 backdrop-blur-md border border-gray-900/30"
              )}>
                <TrendingUp className={cn("w-6 h-6", colors.primary)} />
              </div>
              
              <div className="flex flex-col">
                <span className={cn("text-lg font-bold leading-none", colors.primary)}>
                  PropertyLend
                </span>
                <span className={cn("text-xs leading-none mt-0.5 hidden sm:block", colors.muted)}>
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
                              colors.hover
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
                              : cn(colors.secondary, colors.hover)
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
                textStyle === 'light'
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
                textStyle === 'light'
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
              {/* Theme Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className={cn(
                      "hidden sm:inline-flex",
                      colors.hover,
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

              {isAuthenticated ? (
                <>
                  {/* Notification Bell */}
                  <div className="hidden lg:block relative">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className={cn(
                        "relative w-10 h-10",
                        colors.hover,
                        colors.secondary
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
                      <Button 
                        variant="ghost" 
                        className={cn(
                          "relative h-10 w-10 rounded-full",
                          colors.hover
                        )}
                      >
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
                        colors.hover,
                        colors.secondary
                      )}
                    >
                      Docs
                    </Button>
                  </Link>
                  <Button 
                    className={cn(
                      "font-semibold",
                      textStyle === 'light'
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
                      className={cn(colors.hover, colors.primary)}
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