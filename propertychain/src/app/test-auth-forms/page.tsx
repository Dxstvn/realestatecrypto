/**
 * Test Page for Authentication Forms Component
 * 
 * Tests all features of the Authentication Forms:
 * - Login form with validation
 * - Multi-step registration flow
 * - Social login buttons
 * - Password strength indicator
 * - Two-factor authentication
 * - Forgot password flow
 */

'use client'

import { useState } from 'react'
import {
  LoginForm,
  RegistrationForm,
  TwoFactorForm,
  ForgotPasswordForm,
  type LoginFormValues,
  type TwoFactorFormValues,
} from '@/components/auth/auth-forms'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { 
  LogIn, 
  UserPlus, 
  Smartphone, 
  KeyRound,
  Shield,
  CheckCircle,
  Info
} from 'lucide-react'

type AuthFlow = 'login' | 'register' | 'forgot-password' | 'reset-password' | '2fa' | 'success'

export default function TestAuthForms() {
  const [currentFlow, setCurrentFlow] = useState<AuthFlow>('login')
  const [userEmail, setUserEmail] = useState('')
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [twoFactorRequired, setTwoFactorRequired] = useState(false)

  const handleLoginSuccess = (data: LoginFormValues) => {
    console.log('Login successful:', data)
    setUserEmail(data.email)
    setLoginAttempts(prev => prev + 1)
    
    // Simulate 2FA requirement for demo
    if (loginAttempts >= 1) {
      setTwoFactorRequired(true)
      setCurrentFlow('2fa')
      toast.info('Two-factor authentication required')
    } else {
      setCurrentFlow('success')
      toast.success('Login successful!')
    }
  }

  const handleRegistrationSuccess = () => {
    console.log('Registration completed')
    setRegistrationComplete(true)
    setCurrentFlow('success')
    toast.success('Registration completed successfully!')
  }

  const handleTwoFactorSuccess = (data: TwoFactorFormValues) => {
    console.log('2FA successful:', data)
    setCurrentFlow('success')
    toast.success('Two-factor authentication successful!')
  }

  const handleForgotPasswordSuccess = (email: string) => {
    console.log('Password reset requested for:', email)
    setUserEmail(email)
    toast.success(`Password reset link sent to ${email}`)
    setCurrentFlow('login')
  }

  const resetDemo = () => {
    setCurrentFlow('login')
    setUserEmail('')
    setRegistrationComplete(false)
    setLoginAttempts(0)
    setTwoFactorRequired(false)
    toast.info('Demo reset')
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Authentication Forms Test</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Testing comprehensive authentication system with login, multi-step registration, 
          social login, password security, and two-factor authentication
        </p>
        <Button onClick={resetDemo} variant="outline">
          Reset Demo
        </Button>
      </div>

      {/* Current Flow Indicator */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Current Flow Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant={currentFlow === 'login' ? 'default' : 'secondary'}>
              Login Form
            </Badge>
            <Badge variant={currentFlow === 'register' ? 'default' : 'secondary'}>
              Registration
            </Badge>
            <Badge variant={currentFlow === 'forgot-password' ? 'default' : 'secondary'}>
              Forgot Password
            </Badge>
            <Badge variant={currentFlow === '2fa' ? 'default' : 'secondary'}>
              Two-Factor Auth
            </Badge>
            <Badge variant={currentFlow === 'success' ? 'default' : 'secondary'}>
              Success
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>Login Attempts:</strong> {loginAttempts}
            </div>
            <div>
              <strong>2FA Required:</strong> {twoFactorRequired ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>User Email:</strong> {userEmail || 'Not set'}
            </div>
          </div>

          {registrationComplete && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Registration completed! User would now be redirected to dashboard.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Authentication Flow Tabs */}
      <Tabs defaultValue="live-demo" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="live-demo">Live Demo</TabsTrigger>
          <TabsTrigger value="all-forms">All Forms</TabsTrigger>
          <TabsTrigger value="features">Feature Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="live-demo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Authentication Flow</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              {currentFlow === 'login' && (
                <LoginForm
                  onSuccess={handleLoginSuccess}
                  onForgotPassword={() => setCurrentFlow('forgot-password')}
                  onRegister={() => setCurrentFlow('register')}
                />
              )}

              {currentFlow === 'register' && (
                <RegistrationForm
                  onSuccess={handleRegistrationSuccess}
                  onLogin={() => setCurrentFlow('login')}
                />
              )}

              {currentFlow === 'forgot-password' && (
                <ForgotPasswordForm
                  onSuccess={handleForgotPasswordSuccess}
                  onBack={() => setCurrentFlow('login')}
                />
              )}

              {currentFlow === '2fa' && (
                <TwoFactorForm
                  onSuccess={handleTwoFactorSuccess}
                  onBack={() => setCurrentFlow('login')}
                />
              )}

              {currentFlow === 'success' && (
                <Card className="w-full max-w-md">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-green-600">
                      Authentication Successful!
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p className="text-gray-600">
                      {registrationComplete 
                        ? "Welcome to PropertyChain! Your account has been created successfully."
                        : `Welcome back${userEmail ? `, ${userEmail.split('@')[0]}` : ''}! You have successfully logged in.`
                      }
                    </p>
                    <div className="space-y-2">
                      <Button onClick={() => setCurrentFlow('login')} className="w-full">
                        Try Another Login
                      </Button>
                      <Button onClick={resetDemo} variant="outline" className="w-full">
                        Reset Demo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all-forms" className="space-y-6">
          <div className="grid gap-8">
            {/* Login Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Login Form
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <LoginForm
                  onSuccess={(data) => toast.success(`Login: ${data.email}`)}
                  onForgotPassword={() => toast.info('Forgot password clicked')}
                  onRegister={() => toast.info('Register clicked')}
                />
              </CardContent>
            </Card>

            {/* Registration Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Multi-Step Registration
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <RegistrationForm
                  onSuccess={() => toast.success('Registration completed!')}
                  onLogin={() => toast.info('Login clicked')}
                />
              </CardContent>
            </Card>

            {/* Two-Factor Auth */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Two-Factor Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <TwoFactorForm
                  onSuccess={(data) => toast.success(`2FA Code: ${data.code}`)}
                  onBack={() => toast.info('Back clicked')}
                />
              </CardContent>
            </Card>

            {/* Forgot Password */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5" />
                  Forgot Password
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ForgotPasswordForm
                  onSuccess={(email) => toast.success(`Reset sent to: ${email}`)}
                  onBack={() => toast.info('Back clicked')}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Password Strength */}
            <Card>
              <CardHeader>
                <CardTitle>Password Strength Indicator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The password strength indicator evaluates:
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Minimum 8 characters</li>
                  <li>• Lowercase letters</li>
                  <li>• Uppercase letters</li>
                  <li>• Numbers</li>
                  <li>• Special characters</li>
                </ul>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">
                    Try typing different passwords in the registration form to see the strength indicator in action.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Social Login */}
            <Card>
              <CardHeader>
                <CardTitle>Social Login Integration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Social login buttons for:
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Google OAuth</li>
                  <li>• GitHub OAuth</li>
                  <li>• LinkedIn OAuth</li>
                </ul>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">
                    Social login buttons are fully functional and styled. Integration with actual OAuth providers would be implemented in production.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Multi-Step Flow */}
            <Card>
              <CardHeader>
                <CardTitle>Multi-Step Registration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Three-step registration process:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Step 1</Badge>
                    <span>Personal Information</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Step 2</Badge>
                    <span>Investor Profile</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Step 3</Badge>
                    <span>Document Verification</span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">
                    Each step includes progress tracking, validation, and the ability to navigate back and forth.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Security Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Implemented security measures:
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Form validation with Zod</li>
                  <li>• Password strength checking</li>
                  <li>• CSRF protection ready</li>
                  <li>• Input sanitization</li>
                  <li>• Two-factor authentication</li>
                  <li>• Rate limiting ready</li>
                </ul>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">
                    All forms include comprehensive validation and security best practices following CLAUDE.md guidelines.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Test Instructions */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Test Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Live Demo Flow</h4>
              <ol className="text-sm space-y-2 list-decimal list-inside">
                <li>Start with login form</li>
                <li>Click "Forgot password?" to test reset flow</li>
                <li>Click "Sign up" to test registration</li>
                <li>Complete registration steps</li>
                <li>Login again to trigger 2FA (after first login)</li>
                <li>Complete 2FA to finish authentication</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium mb-3">Features to Test</h4>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li>Password strength indicator in registration</li>
                <li>Form validation on all inputs</li>
                <li>Social login button interactions</li>
                <li>Multi-step progress tracking</li>
                <li>File upload placeholders</li>
                <li>Back/forward navigation in registration</li>
                <li>6-digit OTP input for 2FA</li>
              </ul>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-3">Test Credentials (Demo)</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Valid Email:</strong> Any valid email format
              </div>
              <div>
                <strong>Password:</strong> Any 8+ character password
              </div>
              <div>
                <strong>2FA Code:</strong> Any 6-digit code
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}