/**
 * Auto Breadcrumb Component - PropertyChain
 * 
 * Automatic breadcrumb generation based on current route
 * Following RECOVERY_PLAN.md Phase 4 - Connect All Systems
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { cn } from '@/lib/utils'

interface BreadcrumbMapping {
  [key: string]: string
}

// Custom label mappings for better display
const labelMappings: BreadcrumbMapping = {
  'properties': 'Properties',
  'explore': 'Explore Map',
  'compare': 'Compare',
  'dashboard': 'Dashboard',
  'investor': 'Investor Portal',
  'owner': 'Owner Portal',
  'admin': 'Admin Panel',
  'kyc': 'KYC Verification',
  'invest': 'Investment',
  'settings': 'Settings',
  'profile': 'Profile',
  'portfolio': 'Portfolio',
  'transactions': 'Transactions',
  'documents': 'Documents',
  'login': 'Sign In',
  'register': 'Sign Up',
  'forgot-password': 'Reset Password',
}

interface AutoBreadcrumbProps {
  className?: string
  showHome?: boolean
  maxItems?: number
}

export function AutoBreadcrumb({
  className,
  showHome = true,
  maxItems = 5,
}: AutoBreadcrumbProps) {
  const pathname = usePathname()
  
  // Generate breadcrumb items from pathname
  const items = React.useMemo(() => {
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs: Array<{ label: string; href: string; current: boolean }> = []
    
    paths.forEach((path, index) => {
      // Skip ID segments (assuming they're numeric or UUID-like)
      if (/^\d+$/.test(path) || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(path)) {
        return
      }
      
      const href = '/' + paths.slice(0, index + 1).join('/')
      const label = labelMappings[path.toLowerCase()] || 
        path.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      
      breadcrumbs.push({
        label,
        href,
        current: index === paths.length - 1,
      })
    })
    
    // Limit items if needed
    if (breadcrumbs.length > maxItems) {
      const first = breadcrumbs[0]
      const last = breadcrumbs.slice(-2)
      return [first, { label: '...', href: '', current: false }, ...last]
    }
    
    return breadcrumbs
  }, [pathname, maxItems])
  
  // Don't show breadcrumb on homepage
  if (pathname === '/' && !showHome) return null
  
  return (
    <div className={cn('py-3 border-b bg-muted/30', className)}>
      <div className="container mx-auto max-w-[1440px] px-4 lg:px-12">
        <Breadcrumb>
          <BreadcrumbList>
            {showHome && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/" className="flex items-center gap-1.5">
                      <Home className="h-4 w-4" />
                      <span className="sr-only">Home</span>
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {items.length > 0 && <BreadcrumbSeparator />}
              </>
            )}
            
            {items.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {item.current ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : item.label === '...' ? (
                    <span className="text-muted-foreground">...</span>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < items.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  )
}

// Page header with breadcrumb
export function PageHeader({
  title,
  description,
  children,
  className,
  showBreadcrumb = true,
}: {
  title?: string
  description?: string
  children?: React.ReactNode
  className?: string
  showBreadcrumb?: boolean
}) {
  return (
    <>
      {showBreadcrumb && <AutoBreadcrumb />}
      <div className={cn('border-b', className)}>
        <div className="container mx-auto max-w-[1440px] px-4 lg:px-12 py-6 lg:py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1.5">
              {title && (
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            {children && (
              <div className="flex items-center gap-2">
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}