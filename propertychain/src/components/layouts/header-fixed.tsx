/**
 * Fixed Navigation Header - PropertyLend
 * 
 * Phase 2.3: Navigation Dropdown Fix - CORRECTED VERSION
 * - Properly working dropdowns with Radix UI
 * - Visual connector arrows
 * - Scroll-aware background
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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

interface HeaderFixedProps {
  className?: string
}

export function HeaderFixed({ className }: HeaderFixedProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notificationCount] = useState(3)
  const [isAuthenticated] = useState(false)
  const [currentAPY] = useState(12.4)
  const [currentNetwork] = useState('Polygon')
  const [isNetworkConnected] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Handle scroll for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
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
    <header 
      className={cn(
        'fixed top-0 w-full z-[1000] transition-all duration-300',
        'h-[60px] lg:h-[72px]',
        // Scroll-aware background styling
        isScrolled ? [
          'backdrop-blur-xl bg-background/95',
          'border-b border-border/50',
          'shadow-lg shadow-black/5'
        ] : [
          'backdrop-blur-md bg-background/80',
          'border-b border-border/30'
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
              <span className="text-lg font-bold text-foreground leading-none">
                PropertyLend
              </span>
              <span className="text-xs text-muted-foreground leading-none mt-0.5 hidden sm:block">
                DeFi Bridge Lending
              </span>
            </div>
          </Link>

          {/* Desktop Navigation with Fixed Dropdowns */}
          <div className="hidden lg:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                {navigation.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    {item.items ? (
                      // Dropdown menu with proper alignment
                      <>
                        <NavigationMenuTrigger 
                          className={cn(
                            'h-auto px-4 py-2 text-[15px] font-medium',
                            'text-muted-foreground hover:text-primary',
                            'data-[state=open]:text-primary',
                            'transition-colors duration-200'
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
                      // Simple menu item
                      <Link
                        href={item.href || '#'}
                        className={cn(
                          'inline-flex items-center px-4 py-2 text-[15px] font-medium rounded-lg',
                          'transition-all duration-200',
                          isActiveLink(item.href || '')
                            ? 'text-primary bg-accent'
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
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-success/10 border border-success/20">
              <DollarSign className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">
                APY: {currentAPY}%
              </span>
            </div>
            
            {/* Network Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
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
            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <div className="hidden lg:block relative">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="relative w-10 h-10 text-muted-foreground hover:text-foreground"
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

                {/* User Menu with proper alignment */}
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
                  <Button variant="ghost" className="hidden sm:inline-flex">
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
                  <Button variant="ghost" size="icon">
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
  )
}