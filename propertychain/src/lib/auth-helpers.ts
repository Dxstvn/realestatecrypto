/**
 * Authentication Helpers - PropertyChain
 * 
 * Server-side authentication utilities for NextAuth.js
 * Following UpdatedUIPlan.md Step 53 and CLAUDE.md security standards
 */

import { getServerSession as getNextAuthSession } from 'next-auth/next'
import { authOptions, type PropertyChainSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { USER_ROLES, KYC_STATUS } from '@/lib/constants'

/**
 * Get the current session on the server
 */
export async function getServerSession(): Promise<PropertyChainSession | null> {
  const session = await getNextAuthSession(authOptions)
  return session as PropertyChainSession | null
}

/**
 * Get the current authenticated user
 * Throws an error if not authenticated
 */
export async function getCurrentUser() {
  const session = await getServerSession()
  
  if (!session?.user) {
    throw new Error('Not authenticated')
  }
  
  return session.user
}

/**
 * Require authentication for a server component or action
 * Redirects to login if not authenticated
 */
export async function requireAuth(returnUrl?: string) {
  const session = await getServerSession()
  
  if (!session?.user) {
    const loginUrl = new URL('/login', process.env.NEXTAUTH_URL || 'http://localhost:3000')
    if (returnUrl) {
      loginUrl.searchParams.set('from', returnUrl)
    }
    redirect(loginUrl.toString())
  }
  
  return session
}

/**
 * Require a specific role for access
 * Redirects to unauthorized page if role doesn't match
 */
export async function requireRole(
  role: keyof typeof USER_ROLES,
  options?: {
    redirectTo?: string
    allowAdmin?: boolean
  }
) {
  const session = await requireAuth()
  
  const hasRole = session.user.role === role || 
    (options?.allowAdmin && session.user.role === 'ADMIN')
  
  if (!hasRole) {
    redirect(options?.redirectTo || '/unauthorized')
  }
  
  return session
}

/**
 * Require admin role
 */
export async function requireAdmin() {
  return requireRole('ADMIN', {
    redirectTo: '/dashboard',
  })
}

/**
 * Require KYC verification
 * Redirects to KYC flow if not verified
 */
export async function requireKYC(returnUrl?: string) {
  const session = await requireAuth()
  
  if (session.user.kycStatus !== 'APPROVED') {
    const kycUrl = new URL('/onboarding/kyc', process.env.NEXTAUTH_URL || 'http://localhost:3000')
    if (returnUrl) {
      kycUrl.searchParams.set('from', returnUrl)
    }
    kycUrl.searchParams.set('reason', 'verification_required')
    redirect(kycUrl.toString())
  }
  
  return session
}

/**
 * Check if user has a specific permission
 */
export async function hasPermission(permission: string): Promise<boolean> {
  try {
    const session = await getServerSession()
    
    if (!session?.user) {
      return false
    }
    
    // Admin has all permissions
    if (session.user.role === 'ADMIN') {
      return true
    }
    
    // Define role-based permissions
    const rolePermissions: Record<string, string[]> = {
      INVESTOR: [
        'view_properties',
        'invest_in_properties',
        'view_portfolio',
        'trade_tokens',
        'view_documents',
      ],
      PROPERTY_OWNER: [
        'view_properties',
        'create_properties',
        'edit_own_properties',
        'view_investors',
        'view_analytics',
        'manage_documents',
      ],
      SUPER_ADMIN: ['*'], // All permissions
    }
    
    const userPermissions = rolePermissions[session.user.role] || []
    
    return userPermissions.includes('*') || userPermissions.includes(permission)
  } catch {
    return false
  }
}

/**
 * Get user's investment limit based on KYC status and investor type
 */
export async function getInvestmentLimit(): Promise<number> {
  const session = await getServerSession()
  
  if (!session?.user) {
    return 0
  }
  
  // Define investment limits based on KYC status
  const kycLimits: Record<keyof typeof KYC_STATUS, number> = {
    NOT_STARTED: 0,
    PENDING_REVIEW: 0,
    IN_PROGRESS: 0,
    APPROVED: 1000000, // $1M for approved users
    REJECTED: 0,
    EXPIRED: 0,
  }
  
  const baseLimit = kycLimits[session.user.kycStatus]
  
  // Adjust based on investor type
  if (session.user.investorType === 'institutional') {
    return baseLimit * 10 // 10x limit for institutional investors
  } else if (session.user.investorType === 'entity') {
    return baseLimit * 5 // 5x limit for entity investors
  }
  
  return baseLimit
}

/**
 * Check if user can perform an action
 */
export async function canPerformAction(action: string, resource?: any): Promise<boolean> {
  const session = await getServerSession()
  
  if (!session?.user) {
    return false
  }
  
  // Admin can do everything
  if (session.user.role === 'ADMIN') {
    return true
  }
  
  // Check specific action permissions
  switch (action) {
    case 'invest':
      return session.user.kycStatus === 'APPROVED' && 
             session.user.role === 'INVESTOR'
    
    case 'create_property':
      return session.user.role === 'PROPERTY_OWNER' &&
             session.user.kycStatus === 'APPROVED'
    
    case 'edit_property':
      return session.user.role === 'PROPERTY_OWNER' &&
             resource?.ownerId === session.user.id
    
    case 'view_admin_dashboard':
      return session.user.role === 'SUPER_ADMIN'
    
    case 'approve_kyc':
      return session.user.role === 'SUPER_ADMIN'
    
    case 'manage_users':
      return session.user.role === 'SUPER_ADMIN'
    
    default:
      return false
  }
}

/**
 * Rate limiting check for authenticated users
 */
export async function checkRateLimit(
  action: string,
  limit: number = 10,
  window: number = 60000 // 1 minute
): Promise<boolean> {
  const session = await getServerSession()
  
  if (!session?.user) {
    return false
  }
  
  // In production, implement with Redis
  // For MVP, we'll allow all requests from authenticated users
  return true
}

/**
 * Log security event
 */
export async function logSecurityEvent(
  event: string,
  details?: Record<string, any>
) {
  const session = await getServerSession()
  const headersList = headers()
  
  const logEntry = {
    event,
    userId: session?.user?.id,
    userEmail: session?.user?.email,
    timestamp: new Date().toISOString(),
    ip: headersList.get('x-forwarded-for') || 'unknown',
    userAgent: headersList.get('user-agent'),
    ...details,
  }
  
  // In production, send to logging service
  console.log('Security Event:', logEntry)
  
  // Critical events should trigger alerts
  const criticalEvents = [
    'failed_2fa',
    'suspicious_login',
    'kyc_fraud_detected',
    'unauthorized_access',
  ]
  
  if (criticalEvents.includes(event)) {
    // In production, send alert to security team
    console.error('CRITICAL SECURITY EVENT:', logEntry)
  }
}

/**
 * Validate CSRF token for mutations
 */
export async function validateCSRFToken(token: string): Promise<boolean> {
  const session = await getServerSession()
  
  if (!session) {
    return false
  }
  
  // In production, validate against stored CSRF token
  // For MVP, we'll check if token exists
  return !!token && token.length > 0
}

/**
 * Get user's permissions as an array
 */
export async function getUserPermissions(): Promise<string[]> {
  const session = await getServerSession()
  
  if (!session?.user) {
    return []
  }
  
  // Define all available permissions
  const allPermissions = [
    'view_properties',
    'invest_in_properties',
    'create_properties',
    'edit_properties',
    'delete_properties',
    'view_users',
    'manage_users',
    'approve_kyc',
    'view_analytics',
    'manage_contracts',
    'manage_payments',
    'view_admin_dashboard',
  ]
  
  // Admin gets all permissions
  if (session.user.role === 'ADMIN') {
    return allPermissions
  }
  
  // Role-based permissions
  const permissions: string[] = []
  
  if (session.user.role === 'INVESTOR') {
    permissions.push(
      'view_properties',
      'invest_in_properties',
    )
  }
  
  if (session.user.role === 'PROPERTY_OWNER') {
    permissions.push(
      'view_properties',
      'create_properties',
      'edit_properties',
      'view_analytics',
    )
  }
  
  return permissions
}