/**
 * App Header - PropertyLend
 * Phase 5.0: App Navigation for Authenticated Users
 * 
 * Header focused on functionality for logged-in users
 */

'use client'

import { useState, useEffect } from 'react'
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
  TrendingUp,
  Wallet,
  DollarSign,
  Circle,
  Shield,
  Zap,
  Award,
  Sun,
  Moon,
  BarChart3,
  Coins,
  Vote,
  PieChart,
  History,
  HelpCircle,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// App navigation structure - Focus on functionality
const appNavigation = [
  {
    title: 'Pools',
    href: '/pools',
    items: [
      { 
        title: 'All Pools', 
        href: '/pools',
        description: 'Browse all available lending pools',
        icon: <Award className="h-4 w-4 text-purple-400" />,
      },
      { 
        title: 'Senior Tranches', 
        href: '/pools?tranche=senior',
        description: '8% APY with priority protection',
        icon: <Shield className="h-4 w-4 text-blue-400" />,
      },
      { 
        title: 'Junior Tranches', 
        href: '/pools?tranche=junior',
        description: '20-30% APY with higher returns',
        icon: <Zap className="h-4 w-4 text-green-400" />,
      }
    ]
  },
  {
    title: 'Portfolio',
    href: '/portfolio',
    icon: <PieChart className="h-4 w-4" />,
  },
  {
    title: 'Earn',
    href: '/earn',
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    title: 'Staking',
    href: '/staking',
    icon: <Coins className="h-4 w-4" />,
  },
  {
    title: 'DAO',
    href: '/dao',
    icon: <Vote className="h-4 w-4" />,
  }
]

// User menu items
const userMenuItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    label: 'Transaction History',
    href: '/transactions',
    icon: <History className="h-4 w-4" />,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="h-4 w-4" />,
  },
  {
    label: 'Help & Support',
    href: '/support',
    icon: <HelpCircle className="h-4 w-4" />,
  },
  {
    label: 'Documentation',
    href: '/docs',
    icon: <FileText className="h-4 w-4" />,
  },
]

interface AppHeaderProps {
  className?: string
  user?: {
    name: string
    email: string
    avatar?: string
    walletAddress?: string
  }
}

export function AppHeader({ className, user }: AppHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notificationCount] = useState(3)
  const [currentAPY] = useState(14.75)
  const [tvl] = useState(125847293)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  // Default user if not provided
  const currentUser = user || {
    name: 'John Doe',
    email: 'john.doe@example.com',
    walletAddress: '0x742d...b48e',
  }

  // Track scroll for header background
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

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/'
    if (href.includes('?')) {
      const [path] = href.split('?')
      return pathname.startsWith(path)
    }
    return pathname.startsWith(href)
  }

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const formatTVL = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    return `$${(value / 1e3).toFixed(2)}K`
  }

  return (
    <>
      <header 
        className={cn(
          'fixed top-0 w-full z-50',
          'h-[60px] lg:h-[72px]',
          'transition-all duration-200',
          scrolled 
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800' 
            : 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800',
          className
        )}
      >
        <div className="container mx-auto max-w-[1440px] px-4 lg:px-12 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link 
              href="/dashboard"
              className="flex items-center gap-3 group transition-all duration-200"
            >
              <div className="relative w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-shadow">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              
              <div className="hidden sm:flex flex-col">
                <span className="text-lg font-bold leading-none text-gray-900 dark:text-white">
                  PropertyLend
                </span>
                <span className="text-xs leading-none mt-0.5 text-gray-600 dark:text-gray-400">
                  Portfolio Dashboard
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              <NavigationMenu>
                <NavigationMenuList>
                  {appNavigation.map((item) => (
                    <NavigationMenuItem key={item.title}>
                      {item.items ? (
                        <>
                          <NavigationMenuTrigger 
                            className={cn(
                              'h-auto px-4 py-2 text-[15px] font-medium',
                              'transition-colors duration-200',
                              isActiveLink(item.href || '') && 'text-purple-600 dark:text-purple-400'
                            )}
                          >
                            {item.icon && <span className="mr-2">{item.icon}</span>}
                            {item.title}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <div className="w-[400px] p-4">
                              <div className="space-y-2">
                                {item.items.map((subItem) => (
                                  <Link
                                    key={subItem.title}
                                    href={subItem.href}
                                    className={cn(
                                      'block rounded-lg p-3',
                                      'hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200',
                                      'no-underline group/item',
                                      isActiveLink(subItem.href) && 'bg-purple-50 dark:bg-purple-900/20'
                                    )}
                                  >
                                    <div className="flex items-start gap-3">
                                      {subItem.icon && (
                                        <div className="mt-0.5">
                                          {subItem.icon}
                                        </div>
                                      )}
                                      <div className="flex-1">
                                        <span className="font-medium text-sm text-gray-900 dark:text-white">
                                          {subItem.title}
                                        </span>
                                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                          {subItem.description}
                                        </div>
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
                              ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                          )}
                        >
                          {item.icon && <span className="mr-2">{item.icon}</span>}
                          {item.title}
                        </Link>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
              
              {/* Live Stats */}
              <div className="flex items-center gap-4 ml-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    APY: {currentAPY}%
                  </span>
                </div>
                
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                  <DollarSign className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    TVL: {formatTVL(tvl)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <Button 
                variant="ghost" 
                size="icon"
                className="hidden sm:inline-flex"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* Notifications */}
              <div className="relative">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
                      variant="destructive"
                    >
                      {notificationCount}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Wallet Connection */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                <Circle className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <Wallet className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                  {currentUser.walletAddress}
                </span>
              </div>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        {getUserInitials(currentUser.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {userMenuItems.map((item) => (
                    <DropdownMenuItem key={item.label} asChild>
                      <Link href={item.href} className="flex items-center">
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Toggle */}
              <div className="lg:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Open navigation menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                    <SheetHeader>
                      <SheetTitle className="text-left">Menu</SheetTitle>
                    </SheetHeader>
                    
                    {/* Mobile Navigation */}
                    <div className="mt-6 space-y-4">
                      {/* User Info */}
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                            {getUserInitials(currentUser.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{currentUser.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                            {currentUser.walletAddress}
                          </p>
                        </div>
                      </div>

                      {/* Navigation Items */}
                      <div className="space-y-1">
                        {appNavigation.map((item) => (
                          <Link
                            key={item.title}
                            href={item.href || '#'}
                            className={cn(
                              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                              isActiveLink(item.href || '')
                                ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                            )}
                            onClick={() => setIsOpen(false)}
                          >
                            {item.icon}
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="border-t pt-4 space-y-3">
                        <div className="flex items-center justify-between px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <span className="text-sm text-gray-600 dark:text-gray-400">APY</span>
                          <span className="text-sm font-bold text-green-600 dark:text-green-400">
                            {currentAPY}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between px-3 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <span className="text-sm text-gray-600 dark:text-gray-400">TVL</span>
                          <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                            {formatTVL(tvl)}
                          </span>
                        </div>
                      </div>

                      {/* User Menu Items */}
                      <div className="border-t pt-4 space-y-1">
                        {userMenuItems.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </Link>
                        ))}
                        
                        <button
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
                          onClick={() => {
                            // Handle sign out
                            setIsOpen(false)
                          }}
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-[60px] lg:h-[72px]" aria-hidden="true" />
    </>
  )
}