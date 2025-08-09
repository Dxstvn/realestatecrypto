/**
 * Authentication Test Page - PropertyChain
 * 
 * Tests all authentication flows and components
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, 
  Lock, 
  Mail, 
  Shield, 
  CheckCircle2, 
  XCircle,
  LogOut,
  Settings,
  Key,
  Wallet,
  ArrowRight,
} from 'lucide-react'

export default function TestAuthPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Authentication System Test</h1>
          <p className="text-gray-500 mt-2">Test all authentication flows and components</p>
        </div>

        {/* Authentication Status */}
        <Card>
          <CardHeader>
            <CardTitle>Current Authentication Status</CardTitle>
            <CardDescription>Your current session information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Status:</span>
                {isLoading ? (
                  <Badge variant="secondary">Loading...</Badge>
                ) : isAuthenticated ? (
                  <Badge className="bg-green-500">Authenticated</Badge>
                ) : (
                  <Badge variant="destructive">Not Authenticated</Badge>
                )}
              </div>

              {user && (
                <>
                  <div className="flex items-center gap-4">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">User:</span>
                    <span>{user.firstName} {user.lastName}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Email:</span>
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Role:</span>
                    <Badge variant="outline">{user.role}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <Key className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">KYC Status:</span>
                    <Badge variant={user.kycStatus === 'verified' ? 'default' : 'secondary'}>
                      {user.kycStatus}
                    </Badge>
                  </div>
                  {user.walletAddress && (
                    <div className="flex items-center gap-4">
                      <Wallet className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Wallet:</span>
                      <span className="font-mono text-sm">
                        {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                      </span>
                    </div>
                  )}
                </>
              )}

              {isAuthenticated && (
                <Button onClick={logout} variant="destructive" className="mt-4">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Test Authentication Flows */}
        <Card>
          <CardHeader>
            <CardTitle>Test Authentication Flows</CardTitle>
            <CardDescription>Navigate to different authentication pages</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
                <TabsTrigger value="reset">Reset</TabsTrigger>
                <TabsTrigger value="protected">Protected</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Login Flow</CardTitle>
                    <CardDescription>Test email and wallet login methods</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link href="/login">
                      <Button className="w-full" variant="outline">
                        <Mail className="h-4 w-4 mr-2" />
                        Go to Login Page
                        <ArrowRight className="h-4 w-4 ml-auto" />
                      </Button>
                    </Link>
                    <p className="text-sm text-gray-500">
                      Features: Email/password login, wallet connection, remember me, social login
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Registration Flow</CardTitle>
                    <CardDescription>Test multi-step registration wizard</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link href="/register">
                      <Button className="w-full" variant="outline">
                        <User className="h-4 w-4 mr-2" />
                        Go to Registration Page
                        <ArrowRight className="h-4 w-4 ml-auto" />
                      </Button>
                    </Link>
                    <p className="text-sm text-gray-500">
                      Features: 4-step wizard, password strength, investor type selection, terms acceptance
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reset" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Password Reset Flow</CardTitle>
                    <CardDescription>Test password recovery process</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link href="/forgot-password">
                      <Button className="w-full" variant="outline">
                        <Lock className="h-4 w-4 mr-2" />
                        Go to Password Reset Page
                        <ArrowRight className="h-4 w-4 ml-auto" />
                      </Button>
                    </Link>
                    <p className="text-sm text-gray-500">
                      Features: Email verification, 6-digit code, new password creation
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="protected" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Protected Routes</CardTitle>
                    <CardDescription>Test middleware protection</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link href="/dashboard">
                      <Button className="w-full" variant="outline">
                        <Shield className="h-4 w-4 mr-2" />
                        Go to Dashboard (Protected)
                        <ArrowRight className="h-4 w-4 ml-auto" />
                      </Button>
                    </Link>
                    <Link href="/settings">
                      <Button className="w-full" variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Go to Settings (Protected)
                        <ArrowRight className="h-4 w-4 ml-auto" />
                      </Button>
                    </Link>
                    <p className="text-sm text-gray-500">
                      These routes require authentication and will redirect to login if not authenticated
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Feature Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Features Checklist</CardTitle>
            <CardDescription>Implementation status of all auth features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { name: 'Login page with email/password', status: true },
                { name: 'Wallet authentication', status: true },
                { name: 'Multi-step registration wizard', status: true },
                { name: 'Password reset flow', status: true },
                { name: 'Protected route middleware', status: true },
                { name: 'Auth context provider', status: true },
                { name: 'Session management', status: true },
                { name: 'Remember me functionality', status: true },
                { name: 'Password strength indicator', status: true },
                { name: 'Form validation with Zod', status: true },
                { name: 'Loading states', status: true },
                { name: 'Error handling', status: true },
                { name: 'Toast notifications', status: true },
                { name: 'Mobile responsive', status: true },
                { name: 'Accessibility (WCAG AA)', status: true },
                { name: 'NextAuth.js integration', status: false },
                { name: '2FA setup', status: false },
                { name: 'Social login (Google)', status: false },
              ].map((feature) => (
                <div key={feature.name} className="flex items-center gap-2">
                  {feature.status ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-300" />
                  )}
                  <span className={feature.status ? '' : 'text-gray-400'}>
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}