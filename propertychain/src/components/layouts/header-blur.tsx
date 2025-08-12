/**
 * Backdrop Blur Header - PropertyLend
 * 
 * Refined navbar with subtle backdrop blur
 * Maintains design cohesiveness with the rest of the site
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

interface HeaderBlurProps {
  className?: string
}

export function HeaderBlur({ className }: HeaderBlurProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notificationCount] = useState(3)
  const [isAuthenticated] = useState(false)
  const [currentAPY] = useState(12.4)
  const [currentNetwork] = useState('Polygon')
  const [isNetworkConnected] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  // Track scroll for progressive blur
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    
    handleScroll()
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

  return (
    <>
      {/* Main Header with Backdrop Blur */}
      <header 
        className={cn(
          'fixed top-0 w-full z-50',
          'h-[60px] lg:h-[72px]',
          'transition-all duration-200',
          className
        )}
        style={{
          // Progressive background and blur based on scroll
          backgroundColor: scrolled 
            ? theme === 'dark'
              ? 'rgba(17, 24, 39, 0.8)' // gray-900 with opacity
              : 'rgba(255, 255, 255, 0.8)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled 
            ? theme === 'dark'
              ? '1px solid rgba(75, 85, 99, 0.3)' // gray-600 with opacity
              : '1px solid rgba(229, 231, 235, 0.5)' // gray-200 with opacity
            : '1px solid transparent',
        }}
      >
        <div className="container mx-auto max-w-[1440px] px-4 lg:px-12 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo Section */}
            <Link 
              href={ROUTES.HOME}
              className="flex items-center gap-3 group transition-all duration-200 rounded-lg p-1 hover:bg-gray-100/10 dark:hover:bg-white/10"
            >
              <div className="relative w-10 h-10 rounded-lg flex items-center justify-center shadow-sm transition-all duration-200 group-hover:scale-105 bg-gradient-to-br from-purple-500 to-purple-600">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-none text-gray-900 dark:text-white">
                  PropertyLend
                </span>
                <span className="text-xs leading-none mt-0.5 hidden sm:block text-gray-600 dark:text-gray-400">
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
                              'text-gray-700 hover:text-gray-900',
                              'dark:text-gray-300 dark:hover:text-white',
                              'data-[state=open]:text-gray-900 dark:data-[state=open]:text-white'
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
                            'text-gray-700 hover:text-gray-900',
                            'dark:text-gray-300 dark:hover:text-white',
                            isActiveLink(item.href || '')
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                              : 'hover:bg-gray-100/50 dark:hover:bg-white/10'
                          )}
                        >
                          {item.title}
                        </Link>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
              
              {/* APY Ticker - matches site's glassmorphic style */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 backdrop-blur-sm">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-medium">
                  APY: {currentAPY}%
                </span>
              </div>
              
              {/* Network Indicator - matches site's glassmorphic style */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 backdrop-blur-sm">
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
                      className="relative w-10 h-10"
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
                        className="relative h-10 w-10 rounded-full"
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
                      className="hidden sm:inline-flex"
                    >
                      Docs
                    </Button>
                  </Link>
                  <Button 
                    className="font-semibold bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0"
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
                      {!isAuthenticated && (
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