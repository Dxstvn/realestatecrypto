/**
 * Admin Sidebar - PropertyChain
 * 
 * Navigation sidebar for admin dashboard
 * Following UpdatedUIPlan.md specifications
 */

'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import {
  LayoutDashboard,
  Building,
  Users,
  FileCheck,
  DollarSign,
  TrendingUp,
  Settings,
  Shield,
  Activity,
  FileText,
  Bell,
  HelpCircle,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'

interface NavItem {
  title: string
  href?: string
  icon: React.ElementType
  badge?: string | number
  children?: NavItem[]
}

const navigation: NavItem[] = [
  {
    title: 'Overview',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Properties',
    icon: Building,
    children: [
      { title: 'All Properties', href: '/admin/properties', icon: Building },
      { title: 'Pending Approval', href: '/admin/properties/pending', icon: FileCheck, badge: '12' },
      { title: 'Featured', href: '/admin/properties/featured', icon: TrendingUp },
    ],
  },
  {
    title: 'Users',
    icon: Users,
    children: [
      { title: 'All Users', href: '/admin/users', icon: Users },
      { title: 'KYC Queue', href: '/admin/users/kyc', icon: FileCheck, badge: '8' },
      { title: 'Investors', href: '/admin/users/investors', icon: DollarSign },
      { title: 'Property Owners', href: '/admin/users/owners', icon: Building },
    ],
  },
  {
    title: 'Transactions',
    href: '/admin/transactions',
    icon: DollarSign,
    badge: 'Live',
  },
  {
    title: 'Analytics',
    icon: TrendingUp,
    children: [
      { title: 'Revenue', href: '/admin/analytics/revenue', icon: DollarSign },
      { title: 'User Metrics', href: '/admin/analytics/users', icon: Users },
      { title: 'Property Performance', href: '/admin/analytics/properties', icon: Building },
      { title: 'Reports', href: '/admin/analytics/reports', icon: FileText },
    ],
  },
  {
    title: 'Security',
    icon: Shield,
    children: [
      { title: 'Activity Logs', href: '/admin/security/logs', icon: Activity },
      { title: 'Access Control', href: '/admin/security/access', icon: Shield },
      { title: 'API Keys', href: '/admin/security/api-keys', icon: FileText },
    ],
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
  {
    title: 'Notifications',
    href: '/admin/notifications',
    icon: Bell,
    badge: '3',
  },
  {
    title: 'Support',
    href: '/admin/support',
    icon: HelpCircle,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(['Properties', 'Users'])
  
  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }
  
  const isActive = (href?: string) => {
    if (!href) return false
    return pathname === href || pathname.startsWith(href + '/')
  }
  
  const renderNavItem = (item: NavItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.title)
    const active = isActive(item.href)
    
    return (
      <div key={item.title}>
        {item.href ? (
          <Link
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
              "hover:bg-gray-100",
              active && "bg-primary text-white hover:bg-primary/90",
              depth > 0 && "pl-11"
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1">{item.title}</span>
            {item.badge && (
              <Badge 
                variant={active ? "secondary" : "default"}
                className={cn(
                  "ml-auto",
                  item.badge === 'Live' && "bg-green-500 text-white animate-pulse"
                )}
              >
                {item.badge}
              </Badge>
            )}
          </Link>
        ) : (
          <button
            onClick={() => toggleExpanded(item.title)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
              "hover:bg-gray-100",
              depth > 0 && "pl-11"
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1 text-left">{item.title}</span>
            {item.badge && (
              <Badge variant="default" className="ml-auto">
                {item.badge}
              </Badge>
            )}
            {hasChildren && (
              isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )
            )}
          </button>
        )}
        
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }
  
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        {/* Admin Badge */}
        <div className="mb-6 p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
          <p className="text-xs font-medium text-primary mb-1">ADMIN ACCESS</p>
          <p className="text-sm text-gray-700">Full Platform Control</p>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-1">
          {navigation.map(item => renderNavItem(item))}
        </nav>
        
        {/* System Status */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-gray-700">System Status</span>
          </div>
          <p className="text-xs text-gray-600">All services operational</p>
          <p className="text-xs text-gray-500 mt-1">Uptime: 99.98%</p>
        </div>
      </div>
    </aside>
  )
}