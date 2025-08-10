/**
 * AdminWrapper Component - PropertyChain Admin
 * 
 * Role-based access control and security wrapper for admin panel
 * Following UpdatedUIPlan.md Step 55.7 specifications and CLAUDE.md principles
 */

'use client'

import { useEffect, useState, createContext, useContext, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import {
  Shield, Lock, Key, AlertTriangle, CheckCircle, XCircle,
  User, Users, Settings, LogOut, Activity, Clock, Globe,
  Smartphone, Mail, FileText, Eye, EyeOff, RefreshCw,
  AlertCircle, Info, Fingerprint, ShieldCheck, UserCheck,
  Monitor, MapPin, Calendar, Hash, Terminal, Database
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

// Admin roles
export type AdminRole = 'SUPER_ADMIN' | 'PROPERTY_MANAGER' | 'SUPPORT_STAFF' | 'FINANCE_MANAGER'

// Permission types
export type Permission = 
  | 'VIEW_DASHBOARD'
  | 'VIEW_PROPERTIES' | 'MANAGE_PROPERTIES'
  | 'VIEW_USERS' | 'MANAGE_USERS'
  | 'VIEW_FINANCES' | 'MANAGE_FINANCES'
  | 'VIEW_BLOCKCHAIN' | 'MANAGE_BLOCKCHAIN'
  | 'VIEW_SUPPORT' | 'MANAGE_SUPPORT'
  | 'VIEW_AUDIT_LOGS' | 'MANAGE_SETTINGS'
  | 'MANAGE_ADMINS'

// Role permissions mapping
const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  SUPER_ADMIN: [
    'VIEW_DASHBOARD', 'VIEW_PROPERTIES', 'MANAGE_PROPERTIES',
    'VIEW_USERS', 'MANAGE_USERS', 'VIEW_FINANCES', 'MANAGE_FINANCES',
    'VIEW_BLOCKCHAIN', 'MANAGE_BLOCKCHAIN', 'VIEW_SUPPORT', 'MANAGE_SUPPORT',
    'VIEW_AUDIT_LOGS', 'MANAGE_SETTINGS', 'MANAGE_ADMINS'
  ],
  PROPERTY_MANAGER: [
    'VIEW_DASHBOARD', 'VIEW_PROPERTIES', 'MANAGE_PROPERTIES',
    'VIEW_USERS', 'VIEW_SUPPORT'
  ],
  SUPPORT_STAFF: [
    'VIEW_DASHBOARD', 'VIEW_USERS', 'VIEW_SUPPORT', 'MANAGE_SUPPORT'
  ],
  FINANCE_MANAGER: [
    'VIEW_DASHBOARD', 'VIEW_FINANCES', 'MANAGE_FINANCES',
    'VIEW_PROPERTIES', 'VIEW_USERS'
  ]
}

// Route permissions mapping
const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  '/admin': ['VIEW_DASHBOARD'],
  '/admin/properties': ['VIEW_PROPERTIES'],
  '/admin/users': ['VIEW_USERS'],
  '/admin/financial': ['VIEW_FINANCES'],
  '/admin/blockchain': ['VIEW_BLOCKCHAIN'],
  '/admin/support': ['VIEW_SUPPORT'],
  '/admin/audit': ['VIEW_AUDIT_LOGS'],
  '/admin/settings': ['MANAGE_SETTINGS']
}

// Security context
interface SecurityContext {
  user: AdminUser | null
  role: AdminRole | null
  permissions: Permission[]
  hasPermission: (permission: Permission) => boolean
  isSessionValid: boolean
  requireTwoFactor: boolean
  activityLog: ActivityLog[]
  logActivity: (action: string, details?: any) => void
}

// Admin user interface
interface AdminUser {
  id: string
  email: string
  name: string
  role: AdminRole
  avatar?: string
  twoFactorEnabled: boolean
  lastLogin: Date
  ipAddress: string
  sessionId: string
  allowedIPs?: string[]
  department?: string
  phone?: string
}

// Activity log interface
interface ActivityLog {
  id: string
  userId: string
  action: string
  details?: any
  ipAddress: string
  userAgent: string
  timestamp: Date
  risk: 'low' | 'medium' | 'high'
}

// Session info interface
interface SessionInfo {
  id: string
  userId: string
  device: string
  browser: string
  ipAddress: string
  location?: string
  createdAt: Date
  lastActivity: Date
  isActive: boolean
}

// Create security context
const SecurityContextProvider = createContext<SecurityContext | undefined>(undefined)

export function useAdminSecurity() {
  const context = useContext(SecurityContextProvider)
  if (!context) {
    throw new Error('useAdminSecurity must be used within AdminWrapper')
  }
  return context
}

interface AdminWrapperProps {
  children: ReactNode
}

export function AdminWrapper({ children }: AdminWrapperProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()
  
  const [user, setUser] = useState<AdminUser | null>(null)
  const [twoFactorVerified, setTwoFactorVerified] = useState(false)
  const [showTwoFactorDialog, setShowTwoFactorDialog] = useState(false)
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([])
  const [sessions, setSessions] = useState<SessionInfo[]>([])
  const [showSecurityAlert, setShowSecurityAlert] = useState(false)
  const [securityScore, setSecurityScore] = useState(85)
  
  // Initialize admin user
  useEffect(() => {
    if (session?.user) {
      const sessionUser = session.user as any // Type assertion for extended user properties
      const adminUser: AdminUser = {
        id: sessionUser.id || 'admin-1',
        email: sessionUser.email || 'admin@propertychain.com',
        name: sessionUser.name || 'Admin User',
        role: sessionUser.role || 'SUPER_ADMIN',
        avatar: sessionUser.image || undefined,
        twoFactorEnabled: true,
        lastLogin: new Date(),
        ipAddress: '192.168.1.1', // Would be fetched from request
        sessionId: 'session-' + Math.random().toString(36).substr(2, 9),
        allowedIPs: ['192.168.1.0/24', '10.0.0.0/8'],
        department: 'Operations',
        phone: '+1 555-0123'
      }
      setUser(adminUser)
      
      // Check if 2FA is required
      if (adminUser.twoFactorEnabled && !twoFactorVerified) {
        setShowTwoFactorDialog(true)
      }
      
      // Log login activity
      logActivity('Admin Login', { email: adminUser.email })
    }
  }, [session, twoFactorVerified])
  
  // Check IP restrictions
  useEffect(() => {
    if (user?.allowedIPs) {
      // In production, would check actual IP against allowed list
      const isAllowed = true // Placeholder
      if (!isAllowed) {
        setShowSecurityAlert(true)
        logActivity('Unauthorized IP Access Attempt', { 
          ip: user.ipAddress,
          risk: 'high' 
        })
      }
    }
  }, [user])
  
  // Initialize sessions
  useEffect(() => {
    const mockSessions: SessionInfo[] = [
      {
        id: 'session-1',
        userId: user?.id || '',
        device: 'Desktop',
        browser: 'Chrome 120',
        ipAddress: '192.168.1.1',
        location: 'San Francisco, CA',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        lastActivity: new Date(),
        isActive: true
      },
      {
        id: 'session-2',
        userId: user?.id || '',
        device: 'Mobile',
        browser: 'Safari',
        ipAddress: '192.168.1.2',
        location: 'San Francisco, CA',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - 60 * 60 * 1000),
        isActive: false
      }
    ]
    setSessions(mockSessions)
  }, [user])
  
  // Log activity
  const logActivity = (action: string, details?: any) => {
    const log: ActivityLog = {
      id: `log-${Date.now()}`,
      userId: user?.id || 'unknown',
      action,
      details,
      ipAddress: user?.ipAddress || 'unknown',
      userAgent: navigator.userAgent,
      timestamp: new Date(),
      risk: determineRiskLevel(action)
    }
    
    setActivityLog(prev => [log, ...prev].slice(0, 100))
    
    // Send to backend in production
    console.log('Activity logged:', log)
  }
  
  // Determine risk level
  const determineRiskLevel = (action: string): 'low' | 'medium' | 'high' => {
    if (action.includes('Delete') || action.includes('Modify')) return 'high'
    if (action.includes('Create') || action.includes('Update')) return 'medium'
    return 'low'
  }
  
  // Check permissions
  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false
    return ROLE_PERMISSIONS[user.role].includes(permission)
  }
  
  // Check route access
  const checkRouteAccess = (): boolean => {
    const requiredPermissions = ROUTE_PERMISSIONS[pathname]
    if (!requiredPermissions) return true
    return requiredPermissions.some(p => hasPermission(p))
  }
  
  // Verify two-factor code
  const verifyTwoFactor = () => {
    // In production, would verify against backend
    if (twoFactorCode === '123456') {
      setTwoFactorVerified(true)
      setShowTwoFactorDialog(false)
      logActivity('2FA Verification Success')
    } else {
      logActivity('2FA Verification Failed', { risk: 'high' })
    }
  }
  
  // Session timeout monitoring
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    let warningId: NodeJS.Timeout
    
    const resetTimeout = () => {
      clearTimeout(timeoutId)
      clearTimeout(warningId)
      
      // Warning after 25 minutes
      warningId = setTimeout(() => {
        setShowSecurityAlert(true)
      }, 25 * 60 * 1000)
      
      // Logout after 30 minutes
      timeoutId = setTimeout(() => {
        logActivity('Session Timeout')
        router.push('/login')
      }, 30 * 60 * 1000)
    }
    
    // Reset on activity
    const handleActivity = () => {
      resetTimeout()
      if (user) {
        setSessions(prev => prev.map(s => 
          s.id === user.sessionId 
            ? { ...s, lastActivity: new Date() }
            : s
        ))
      }
    }
    
    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('keypress', handleActivity)
    resetTimeout()
    
    return () => {
      clearTimeout(timeoutId)
      clearTimeout(warningId)
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keypress', handleActivity)
    }
  }, [user, router])
  
  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 animate-pulse text-blue-500" />
          <p className="text-gray-500">Verifying security credentials...</p>
        </div>
      </div>
    )
  }
  
  // Not authenticated
  if (!session?.user) {
    router.push('/login')
    return null
  }
  
  // Check route permissions
  if (!checkRouteAccess()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-500 mb-4">
              You don't have permission to access this area.
            </p>
            <Button onClick={() => router.push('/admin')}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  const securityContext: SecurityContext = {
    user,
    role: user?.role || null,
    permissions: user ? ROLE_PERMISSIONS[user.role] : [],
    hasPermission,
    isSessionValid: twoFactorVerified || !user?.twoFactorEnabled,
    requireTwoFactor: user?.twoFactorEnabled || false,
    activityLog,
    logActivity
  }
  
  return (
    <SecurityContextProvider.Provider value={securityContext}>
      <div className="min-h-screen bg-gray-50">
        {/* Security Header */}
        <div className="bg-white border-b px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Shield className="h-5 w-5 text-blue-500" />
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {user?.role.replace('_', ' ')}
                </Badge>
                <Badge 
                  variant={securityScore >= 80 ? 'default' : 'destructive'} 
                  className="text-xs"
                >
                  Security Score: {securityScore}%
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Session Info */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Globe className="h-4 w-4" />
                <span>{user?.ipAddress}</span>
                <span>•</span>
                <Clock className="h-4 w-4" />
                <span>Session: 28m</span>
              </div>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>{user?.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowSecuritySettings(true)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Security Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowActivityLog(true)}>
                    <Activity className="h-4 w-4 mr-2" />
                    Activity Log
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowSessions(true)}>
                    <Monitor className="h-4 w-4 mr-2" />
                    Active Sessions
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => {
                      logActivity('Admin Logout')
                      router.push('/logout')
                    }}
                    className="text-red-600"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        {/* Security Alerts */}
        {showSecurityAlert && (
          <Alert className="m-4 border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Security Notice:</strong> Your session will expire in 5 minutes due to inactivity.
              <Button 
                size="sm" 
                variant="outline" 
                className="ml-4"
                onClick={() => setShowSecurityAlert(false)}
              >
                Stay Active
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Main Content */}
        <main className="p-6">
          {children}
        </main>
        
        {/* 2FA Dialog */}
        <Dialog open={showTwoFactorDialog} onOpenChange={setShowTwoFactorDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Two-Factor Authentication</DialogTitle>
              <DialogDescription>
                Enter the 6-digit code from your authenticator app
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <Fingerprint className="h-16 w-16 text-blue-500" />
              </div>
              
              <div>
                <Label>Verification Code</Label>
                <Input
                  type="text"
                  placeholder="000000"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  maxLength={6}
                  className="text-center text-2xl font-mono"
                />
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  For demo purposes, use code: 123456
                </AlertDescription>
              </Alert>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => router.push('/login')}>
                Cancel
              </Button>
              <Button onClick={verifyTwoFactor}>
                Verify
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SecurityContextProvider.Provider>
  )
}

// Security Settings Dialog Component
const [showSecuritySettings, setShowSecuritySettings] = useState(false)
const [showActivityLog, setShowActivityLog] = useState(false)
const [showSessions, setShowSessions] = useState(false)

// Export security utilities
export function RequirePermission({ 
  permission, 
  children, 
  fallback 
}: { 
  permission: Permission
  children: ReactNode
  fallback?: ReactNode 
}) {
  const { hasPermission } = useAdminSecurity()
  
  if (!hasPermission(permission)) {
    return fallback ? <>{fallback}</> : null
  }
  
  return <>{children}</>
}

export function usePermission(permission: Permission): boolean {
  const { hasPermission } = useAdminSecurity()
  return hasPermission(permission)
}

export function useActivityLogger() {
  const { logActivity } = useAdminSecurity()
  return { logActivity }
}