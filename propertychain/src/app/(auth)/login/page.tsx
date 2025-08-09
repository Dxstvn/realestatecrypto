/**
 * Login Page - PropertyChain
 * 
 * Authentication page following UpdatedUIPlan.md Section 7.1 specifications
 * Design specs: 400px max width, centered, card layout
 * Following CLAUDE.md security and authentication standards
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Icons } from '@/components/ui/icons'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Wallet, 
  Chrome, 
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Building,
} from 'lucide-react'

// ============================================================================
// Types & Validation
// ============================================================================

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().default(false),
})

type LoginFormData = z.infer<typeof loginSchema>

// ============================================================================
// Login Page Component
// ============================================================================

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [loginMethod, setLoginMethod] = React.useState<'email' | 'wallet'>('email')

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Store remember me preference
      if (data.rememberMe) {
        localStorage.setItem('rememberMe', 'true')
      }
      
      toast.success('Login successful!', {
        description: 'Redirecting to dashboard...',
        icon: <CheckCircle2 className="h-4 w-4" />,
      })
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
      
    } catch (error) {
      toast.error('Login failed', {
        description: 'Invalid email or password. Please try again.',
        icon: <AlertCircle className="h-4 w-4" />,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleWalletLogin = async () => {
    setIsLoading(true)
    
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Wallet connected!', {
        description: 'Verifying signature...',
        icon: <Wallet className="h-4 w-4" />,
      })
      
      // Additional verification step
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      router.push('/dashboard')
    } catch (error) {
      toast.error('Connection failed', {
        description: 'Could not connect to wallet. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    
    try {
      // Simulate Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Google authentication successful!', {
        description: 'Setting up your account...',
      })
      
      router.push('/dashboard')
    } catch (error) {
      toast.error('Google login failed', {
        description: 'Could not authenticate with Google.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-gray-100/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      {/* Logo and Brand */}
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2 text-primary">
          <Building className="h-8 w-8" />
          <span className="text-xl font-bold">PropertyChain</span>
        </Link>
      </div>

      {/* Login Card - 400px max width as per Section 7.1 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[400px]"
      >
        <Card className="border-gray-200 shadow-xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center text-gray-500">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Login Method Toggle */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
              <Button
                type="button"
                variant={loginMethod === 'email' ? 'default' : 'ghost'}
                className="flex-1 h-9"
                onClick={() => setLoginMethod('email')}
                disabled={isLoading}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button
                type="button"
                variant={loginMethod === 'wallet' ? 'default' : 'ghost'}
                className="flex-1 h-9"
                onClick={() => setLoginMethod('wallet')}
                disabled={isLoading}
              >
                <Wallet className="h-4 w-4 mr-2" />
                Wallet
              </Button>
            </div>

            {loginMethod === 'email' ? (
              <>
                {/* Email Login Form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email Field - 48px height as per spec */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                              <Input
                                {...field}
                                type="email"
                                placeholder="name@company.com"
                                className="h-12 pl-10 text-sm"
                                disabled={isLoading}
                                autoComplete="email"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Password Field - 48px height as per spec */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                              <Input
                                {...field}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                className="h-12 pl-10 pr-10 text-sm"
                                disabled={isLoading}
                                autoComplete="current-password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                                tabIndex={-1}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Remember Me & Forgot Password - aligned as per spec */}
                    <div className="flex items-center justify-between">
                      <FormField
                        control={form.control}
                        name="rememberMe"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              Remember me
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <Link
                        href="/forgot-password"
                        className="text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    {/* Submit Button - 48px height, full width, #007BFF as per spec */}
                    <Button
                      type="submit"
                      className="w-full h-12 bg-[#007BFF] hover:bg-[#0062CC] text-white font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Social Login - 44px height as per spec */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 font-medium"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <Chrome className="h-4 w-4 mr-2" />
                  Sign in with Google
                </Button>
              </>
            ) : (
              /* Wallet Login */
              <div className="space-y-4">
                <div className="text-center space-y-2 py-8">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Wallet className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">Connect Your Wallet</h3>
                  <p className="text-sm text-gray-500">
                    Sign in securely using your Web3 wallet
                  </p>
                </div>

                <Button
                  type="button"
                  className="w-full h-12 bg-[#007BFF] hover:bg-[#0062CC] text-white font-medium"
                  onClick={handleWalletLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="h-4 w-4 mr-2" />
                      Connect Wallet
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-gray-500">
                  We support MetaMask, WalletConnect, and Coinbase Wallet
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-6">
            <div className="text-sm text-center text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Security Notice */}
        <p className="text-xs text-center text-gray-500 mt-6">
          <Lock className="h-3 w-3 inline mr-1" />
          Secured with bank-level encryption
        </p>
      </motion.div>
    </div>
  )
}