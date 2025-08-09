/**
 * Dashboard Sidebar Component - PropertyChain
 * 
 * Fixed 240px sidebar for desktop, Sheet drawer for mobile
 * Used in all dashboard pages for navigation
 * Following Section 0 principles and Section 5 specifications
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Home,
  Building2,
  DollarSign,
  TrendingUp,
  FileText,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Wallet,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  Bell,
  Briefcase,
  Calendar,
  CreditCard,
  Key,
  Lock,
  Mail,
  MessageSquare,
  Target,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Navigation items structure
interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
  children?: NavItem[]
  separator?: boolean
}

// Main navigation items
const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'My Properties',
    href: '/dashboard/properties',
    icon: Building2,
    badge: '3',
    badgeVariant: 'secondary',
  },
  {
    title: 'Portfolio',
    href: '/dashboard/portfolio',
    icon: Briefcase,
    children: [
      {
        title: 'Overview',
        href: '/dashboard/portfolio/overview',
        icon: PieChart,
      },
      {
        title: 'Performance',
        href: '/dashboard/portfolio/performance',
        icon: TrendingUp,
      },
      {
        title: 'Transactions',
        href: '/dashboard/portfolio/transactions',
        icon: Activity,
      },
    ],
  },
  {
    title: 'Investments',
    href: '/dashboard/investments',
    icon: DollarSign,
    children: [
      {
        title: 'Active',
        href: '/dashboard/investments/active',
        icon: Zap,
        badge: '5',
      },
      {
        title: 'Pending',
        href: '/dashboard/investments/pending',
        icon: Calendar,
        badge: '2',
        badgeVariant: 'destructive',
      },
      {
        title: 'History',
        href: '/dashboard/investments/history',
        icon: FileText,
      },
    ],
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    title: 'Documents',
    href: '/dashboard/documents',
    icon: FileText,
    badge: 'New',
    badgeVariant: 'destructive',
  },
  {
    title: 'Wallet',
    href: '/dashboard/wallet',
    icon: Wallet,
  },
]

// Settings navigation items
const settingsNavItems: NavItem[] = [
  {
    title: 'Notifications',
    href: '/dashboard/notifications',
    icon: Bell,
    badge: '3',
    badgeVariant: 'destructive',
    separator: true,
  },
  {
    title: 'Messages',
    href: '/dashboard/messages',
    icon: MessageSquare,
    badge: '1',
  },
  {
    title: 'Account Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
  {
    title: 'Security',
    href: '/dashboard/security',
    icon: Shield,
  },
  {
    title: 'Help & Support',
    href: '/dashboard/help',
    icon: HelpCircle,
  },
]

interface DashboardSidebarProps {
  className?: string
  collapsible?: boolean
  defaultCollapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
}

export function DashboardSidebar({
  className,
  collapsible = true,
  defaultCollapsed = false,
  onCollapse,
}: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle collapse
  const handleCollapse = () => {
    const newState = !collapsed
    setCollapsed(newState)
    onCollapse?.(newState)
    // Close all expanded items when collapsing
    if (newState) {
      setExpandedItems([])
    }
  }

  // Toggle expanded state
  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  // Check if link is active
  const isActiveLink = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  // Check if parent has active child
  const hasActiveChild = (item: NavItem): boolean => {
    if (!item.children) return false
    return item.children.some(child => isActiveLink(child.href))
  }

  // Render navigation item
  const renderNavItem = (item: NavItem, depth = 0) => {
    const isActive = isActiveLink(item.href) || hasActiveChild(item)
    const isExpanded = expandedItems.includes(item.title)
    const hasChildren = item.children && item.children.length > 0

    return (
      <div key={item.title}>
        {item.separator && <Separator className="my-2" />}
        
        {hasChildren ? (
          <Collapsible
            open={isExpanded}
            onOpenChange={() => toggleExpanded(item.title)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-3 h-10 px-3',
                  'hover:bg-accent hover:text-accent-foreground',
                  'transition-all duration-200',
                  isActive && 'bg-primary/10 text-primary hover:bg-primary/20',
                  collapsed && 'px-2 justify-center',
                  depth > 0 && 'pl-9'
                )}
              >
                <item.icon className={cn(
                  'h-4 w-4 shrink-0',
                  collapsed && 'h-5 w-5'
                )} />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.title}</span>
                    {item.badge && (
                      <Badge 
                        variant={item.badgeVariant || 'default'}
                        className="h-5 px-1.5 text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform duration-200',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            {!collapsed && (
              <CollapsibleContent className="pl-4">
                {item.children?.map(child => renderNavItem(child, depth + 1))}
              </CollapsibleContent>
            )}
          </Collapsible>
        ) : (
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      'w-full justify-start gap-3 h-10 px-3',
                      'hover:bg-accent hover:text-accent-foreground',
                      'transition-all duration-200',
                      isActive && 'bg-primary/10 text-primary hover:bg-primary/20',
                      collapsed && 'px-2 justify-center',
                      depth > 0 && 'pl-9'
                    )}
                  >
                    <item.icon className={cn(
                      'h-4 w-4 shrink-0',
                      collapsed && 'h-5 w-5'
                    )} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.title}</span>
                        {item.badge && (
                          <Badge 
                            variant={item.badgeVariant || 'default'}
                            className="h-5 px-1.5 text-xs"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Button>
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  <p>{item.title}</p>
                  {item.badge && (
                    <Badge 
                      variant={item.badgeVariant || 'default'}
                      className="ml-2"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    )
  }

  // Sidebar content
  const sidebarContent = (
    <>
      {/* Logo Section */}
      <div className={cn(
        'flex items-center gap-3 px-3 py-4',
        collapsed && 'justify-center px-2'
      )}>
        <Link 
          href="/dashboard" 
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <div className="font-bold text-foreground">PropertyChain</div>
              <div className="text-xs text-muted-foreground">Investor Portal</div>
            </div>
          )}
        </Link>
      </div>

      <Separator />

      {/* Main Navigation */}
      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-1">
          {mainNavItems.map(item => renderNavItem(item))}
        </div>

        {/* Settings Section */}
        <div className="mt-6 space-y-1">
          {settingsNavItems.map(item => renderNavItem(item))}
        </div>
      </ScrollArea>

      {/* User Section */}
      <div className="mt-auto border-t border-border">
        <div className={cn(
          'flex items-center gap-3 p-3',
          collapsed && 'justify-center p-2'
        )}>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Users className="h-4 w-4 text-primary" />
          </div>
          {!collapsed && (
            <div className="flex-1">
              <div className="text-sm font-medium">John Doe</div>
              <div className="text-xs text-muted-foreground">Investor</div>
            </div>
          )}
          {!collapsed && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => console.log('Logout')}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sign out</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Collapse Toggle (Desktop Only) */}
      {collapsible && !isMobile && (
        <div className="border-t border-border p-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'w-full h-8',
                    collapsed && 'h-10'
                  )}
                  onClick={handleCollapse}
                >
                  {collapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side={collapsed ? 'right' : 'left'}>
                <p>{collapsed ? 'Expand sidebar' : 'Collapse sidebar'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </>
  )

  // Mobile Sheet
  if (isMobile) {
    return (
      <>
        {/* Mobile Trigger Button */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-40 lg:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Mobile Sheet Drawer */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-[280px] p-0">
            <div className="h-full flex flex-col">
              {sidebarContent}
            </div>
          </SheetContent>
        </Sheet>
      </>
    )
  }

  // Desktop Sidebar
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'fixed left-0 top-0 z-30 h-full',
        'bg-background border-r border-border',
        'flex flex-col',
        className
      )}
    >
      {sidebarContent}
    </motion.aside>
  )
}

// Export a layout wrapper for easy integration
export function DashboardLayout({ 
  children,
  sidebarProps,
}: { 
  children: React.ReactNode
  sidebarProps?: DashboardSidebarProps
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar 
        onCollapse={setSidebarCollapsed}
        {...sidebarProps}
      />
      <main 
        className={cn(
          'flex-1 transition-all duration-200',
          'lg:ml-[240px]',
          sidebarCollapsed && 'lg:ml-[64px]'
        )}
      >
        {children}
      </main>
    </div>
  )
}