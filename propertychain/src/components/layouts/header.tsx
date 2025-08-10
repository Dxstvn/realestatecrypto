/**
 * Navigation Header - PropertyLend
 * 
 * DeFi lending platform header with Web3 glassmorphism design
 * Desktop: 72px height, mobile: 60px height with Sheet drawer
 * Following PropertyLend UI spec with gradient effects and network indicators
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
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
  Building2,
  TrendingUp,
  Wallet,
  DollarSign,
  Users,
  Circle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'
// import { useTheme } from '@/components/providers/theme-provider' // Reserved for theme toggle

// Navigation items structure
interface NavItem {
  title: string
  href?: string
  description?: string
  items?: NavItem[]
}

const navigation: NavItem[] = [
  {
    title: 'Earn',
    items: [
      {
        title: 'Senior Tranches',
        href: '/earn/senior',
        description: 'Stable 8% APY with priority payment protection'
      },
      {
        title: 'Junior Tranches',
        href: '/earn/junior',
        description: 'Higher yields 20-30% APY with enhanced returns'
      },
      {
        title: 'Pool Overview',
        href: '/earn/pools',
        description: 'Explore all available lending pools and performance'
      }
    ]
  },
  {
    title: 'Positions',
    items: [
      {
        title: 'My Investments',
        href: '/positions',
        description: 'Track your lending positions and earned yields'
      },
      {
        title: 'Transaction History',
        href: '/positions/history',
        description: 'Complete record of deposits, withdrawals, and earnings'
      }
    ]
  },
  {
    title: 'Loans',
    items: [
      {
        title: 'Active Loans',
        href: '/loans',
        description: 'Monitor funded real estate loans and their performance'
      },
      {
        title: 'Apply for Loan',
        href: '/loans/apply',
        description: 'Submit your real estate for bridge lending consideration'
      }
    ]
  },
  {
    title: 'DAO',
    href: '/dao',
  },
]

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notificationCount] = useState(3) // Mock notification count
  const [isAuthenticated] = useState(false) // Mock auth state - integrate with real auth later
  const [currentAPY] = useState(12.4) // Mock current APY - integrate with real data later
  const [currentNetwork] = useState('Polygon') // Mock network - integrate with Web3 provider later
  const [isNetworkConnected] = useState(true) // Mock network status
  const pathname = usePathname()
  // const { theme, setTheme } = useTheme() // Reserved for future theme toggle feature

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Mock user data - integrate with real auth later
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
        // Desktop: 72px height, Mobile: 60px height with glassmorphism
        'fixed top-0 w-full z-[1000] glass border-b border-border',
        'h-[60px] lg:h-[72px]',
        // Web3 styling with backdrop blur
        'backdrop-blur-md bg-background/80',
        className
      )}
    >
      <div className="container mx-auto max-w-[1440px] px-4 lg:px-12 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section (Left) */}
          <Link 
            href={ROUTES.HOME}
            className="flex items-center gap-3 group transition-all duration-200 hover:glow-primary rounded-lg p-1"
          >
            {/* Logo Icon - 40px × 40px with DeFi gradient background */}
            <div className="relative w-10 h-10 gradient-primary rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-105">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            
            {/* Logo Text */}
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground leading-none">
                PropertyLend
              </span>
              <span className="text-xs text-muted-foreground leading-none mt-0.5 hidden sm:block">
                DeFi Bridge Lending
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (Center) - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                {navigation.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    {item.items ? (
                      // Dropdown menu item
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
                        <NavigationMenuContent className="w-[280px] p-2">
                          <div className="space-y-1">
                            {item.items.map((subItem) => (
                              <Link
                                key={subItem.title}
                                href={subItem.href || '#'}
                                className={cn(
                                  'block rounded-lg p-3 hover:bg-accent transition-colors duration-200',
                                  'no-underline'
                                )}
                              >
                                <div className="font-medium text-sm text-foreground mb-1">
                                  {subItem.title}
                                </div>
                                {subItem.description && (
                                  <div className="text-xs text-muted-foreground line-clamp-2">
                                    {subItem.description}
                                  </div>
                                )}
                              </Link>
                            ))}
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
                            ? 'text-primary bg-accent border-b-2 border-primary'
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
            
            {/* APY Ticker - DeFi Element */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-success/10 border border-success/20">
              <DollarSign className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">
                APY: {currentAPY}% 🔥
              </span>
            </div>
            
            {/* Network Indicator - Web3 Element */}
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
              // Authenticated user menu
              <>
                {/* Notification Bell - Desktop only */}
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
                  <DropdownMenuContent className="w-56" align="end" forceMount>
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
              // Not authenticated - show Web3 wallet connect
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
                    {/* Main Navigation */}
                    <div className="space-y-2">
                      {navigation.map((item) => (
                        <div key={item.title} className="space-y-1">
                          {item.items ? (
                            // Dropdown section
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
                                    {subItem.title}
                                  </Link>
                                ))}
                              </div>
                            </>
                          ) : (
                            // Simple link
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

                    {/* Authentication Section */}
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
                      // Authenticated mobile menu
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