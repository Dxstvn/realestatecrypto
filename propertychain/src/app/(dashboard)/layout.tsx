/**
 * Dashboard Layout Component - PropertyChain
 * 
 * Main dashboard layout with resizable sidebar, breadcrumbs, and user menu
 * Responsive design with mobile sheet navigation
 * Following UpdatedUIPlan.md specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  Building,
  Calendar,
  ChevronDown,
  ChevronRight,
  CreditCard,
  FileText,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  MoreHorizontal,
  PanelLeft,
  Settings,
  TrendingUp,
  User,
  Users,
  Wallet,
  X,
  Bell,
  Search,
  Bookmark,
  PieChart,
  Activity,
  DollarSign,
  Shield,
} from 'lucide-react'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils/cn'
import { toast } from 'sonner'

/**
 * Navigation items configuration
 */
const navigationItems = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: Home,
    description: 'Dashboard overview and portfolio summary',
  },
  {
    title: 'Portfolio',
    href: '/dashboard/portfolio',
    icon: PieChart,
    description: 'Your investment portfolio',
    children: [
      { title: 'Holdings', href: '/dashboard/portfolio/holdings', icon: Wallet },
      { title: 'Performance', href: '/dashboard/portfolio/performance', icon: TrendingUp },
      { title: 'Dividends', href: '/dashboard/portfolio/dividends', icon: DollarSign },
    ],
  },
  {
    title: 'Properties',
    href: '/dashboard/properties',
    icon: Building,
    description: 'Browse and manage properties',
    children: [
      { title: 'My Investments', href: '/dashboard/properties/investments', icon: Building },
      { title: 'Watchlist', href: '/dashboard/properties/watchlist', icon: Bookmark },
      { title: 'Browse All', href: '/properties', icon: Search },
    ],
  },
  {
    title: 'Transactions',
    href: '/dashboard/transactions',
    icon: Activity,
    description: 'Transaction history and records',
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    description: 'Investment analytics and insights',
  },
  {
    title: 'Documents',
    href: '/dashboard/documents',
    icon: FileText,
    description: 'Legal documents and contracts',
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'Account and notification settings',
    children: [
      { title: 'Profile', href: '/dashboard/settings/profile', icon: User },
      { title: 'Security', href: '/dashboard/settings/security', icon: Shield },
      { title: 'Notifications', href: '/dashboard/settings/notifications', icon: Bell },
      { title: 'Billing', href: '/dashboard/settings/billing', icon: CreditCard },
    ],
  },
]

/**
 * Generate breadcrumb items from pathname
 */
function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs = []

  // Always start with Dashboard
  breadcrumbs.push({
    title: 'Dashboard',
    href: '/dashboard',
    isLast: segments.length === 1,
  })

  // Add subsequent segments
  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i]
    const href = '/' + segments.slice(0, i + 1).join('/')
    const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
    const isLast = i === segments.length - 1

    breadcrumbs.push({
      title,
      href,
      isLast,
    })
  }

  return breadcrumbs
}

/**
 * Sidebar Navigation Component
 */
function SidebarNavigation({ 
  className,
  onItemClick,
  collapsed = false,
}: {
  className?: string
  onItemClick?: () => void
  collapsed?: boolean
}) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  return (
    <ScrollArea className={cn('h-full', className)}>
      <div className="space-y-2 p-4">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const hasChildren = item.children && item.children.length > 0
          const isExpanded = expandedItems.includes(item.title)

          return (
            <div key={item.title}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      {hasChildren ? (
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start gap-3 h-11",
                            collapsed && "justify-center px-2",
                            isActive && "bg-[#007BFF] text-white hover:bg-[#0062CC]"
                          )}
                          onClick={() => toggleExpanded(item.title)}
                        >
                          <item.icon className={cn("h-4 w-4 flex-shrink-0")} />
                          {!collapsed && (
                            <>
                              <span className="flex-1 text-left">{item.title}</span>
                              <ChevronRight 
                                className={cn(
                                  "h-4 w-4 transition-transform",
                                  isExpanded && "rotate-90"
                                )} 
                              />
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start gap-3 h-11",
                            collapsed && "justify-center px-2",
                            isActive && "bg-[#007BFF] text-white hover:bg-[#0062CC]"
                          )}
                          asChild
                        >
                          <Link href={item.href} onClick={onItemClick}>
                            <item.icon className="h-4 w-4 flex-shrink-0" />
                            {!collapsed && <span className="flex-1 text-left">{item.title}</span>}
                          </Link>
                        </Button>
                      )}
                    </div>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">
                      <p>{item.title}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      )}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>

              {/* Child items */}
              {hasChildren && isExpanded && !collapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-7 mt-1 space-y-1"
                >
                  {item.children!.map((child) => {
                    const isChildActive = pathname === child.href

                    return (
                      <Button
                        key={child.title}
                        variant={isChildActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-3 h-9 text-sm",
                          isChildActive && "bg-[#E6F2FF] text-[#007BFF] font-medium"
                        )}
                        asChild
                      >
                        <Link href={child.href} onClick={onItemClick}>
                          <child.icon className="h-3 w-3" />
                          <span>{child.title}</span>
                        </Link>
                      </Button>
                    )
                  })}
                </motion.div>
              )}
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}

/**
 * User Menu Dropdown
 */
function UserMenu() {
  const router = useRouter()

  const handleLogout = () => {
    toast.success('Logged out successfully')
    router.push('/')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder-avatar.jpg" alt="User Avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">John Doe</p>
            <p className="text-xs leading-none text-muted-foreground">
              john.doe@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings/profile">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings/billing">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Dashboard Header Component
 */
function DashboardHeader({ 
  onToggleSidebar,
  collapsed,
}: { 
  onToggleSidebar?: () => void
  collapsed?: boolean
}) {
  const pathname = usePathname()
  const breadcrumbs = generateBreadcrumbs(pathname)

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {/* Mobile menu trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <SheetHeader className="p-6 border-b">
                <SheetTitle className="text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#007BFF] rounded-lg flex items-center justify-center">
                      <Building className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold">PropertyChain</span>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <SidebarNavigation />
            </SheetContent>
          </Sheet>

          {/* Desktop sidebar toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={onToggleSidebar}
          >
            <PanelLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
          </Button>

          {/* Breadcrumbs */}
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              {breadcrumbs.map((breadcrumb, index) => (
                <React.Fragment key={breadcrumb.href}>
                  <BreadcrumbItem>
                    {breadcrumb.isLast ? (
                      <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={breadcrumb.href}>{breadcrumb.title}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!breadcrumb.isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden sm:flex">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9 w-64"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500"
            >
              3
            </Badge>
          </Button>

          {/* User menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  )
}

/**
 * Main Dashboard Layout Component
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  if (!isMounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        onToggleSidebar={toggleSidebar}
        collapsed={sidebarCollapsed}
      />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar with Resizable Panels */}
        <div className="hidden md:block">
          <ResizablePanelGroup
            direction="horizontal"
            className="min-h-full"
          >
            <ResizablePanel
              defaultSize={sidebarCollapsed ? 5 : 20}
              minSize={5}
              maxSize={30}
              className="border-r"
            >
              <div className="flex flex-col h-full">
                {/* Logo */}
                <div className={cn(
                  "flex items-center border-b p-4",
                  sidebarCollapsed ? "justify-center" : "gap-2"
                )}>
                  <div className="w-8 h-8 bg-[#007BFF] rounded-lg flex items-center justify-center">
                    <Building className="h-5 w-5 text-white" />
                  </div>
                  {!sidebarCollapsed && (
                    <span className="font-bold text-lg">PropertyChain</span>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex-1">
                  <SidebarNavigation collapsed={sidebarCollapsed} />
                </div>

                {/* User section */}
                {!sidebarCollapsed && (
                  <div className="border-t p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">John Doe</p>
                        <p className="text-xs text-muted-foreground truncate">
                          Premium Member
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={80} minSize={70}>
              <ScrollArea className="h-full">
                <main className="flex-1 p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={usePathname()}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {children}
                    </motion.div>
                  </AnimatePresence>
                </main>
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 md:hidden">
          <ScrollArea className="h-full">
            <main className="flex-1 p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={usePathname()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </main>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}