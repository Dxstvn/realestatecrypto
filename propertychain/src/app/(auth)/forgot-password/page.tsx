/**
 * Forgot Password Page - PropertyChain
 * 
 * Password reset flow with email verification
 * Following UpdatedUIPlan.md Section 7 form specifications
 * Following CLAUDE.md security standards
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  Lock, 
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Building,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react'

// ============================================================================
// Types & Validation
// ============================================================================

// Step 1: Email submission
const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
})

// Step 2: Code verification
const codeSchema = z.object({
  code: z
    .string()
    .min(1, 'Verification code is required')
    .length(6, 'Code must be 6 digits')
    .regex(/^\d+$/, 'Code must contain only numbers'),
})

// Step 3: New password
const passwordSchema = z.object({
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type EmailFormData = z.infer<typeof emailSchema>
type CodeFormData = z.infer<typeof codeSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

// ============================================================================
// Forgot Password Page Component
// ============================================================================

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = React.useState<'email' | 'code' | 'password'>('email')
  const [isLoading, setIsLoading] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [resendTimer, setResendTimer] = React.useState(0)

  // Email form
  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  })

  // Code verification form
  const codeForm = useForm<CodeFormData>({
    resolver: zodResolver(codeSchema),
    defaultValues: {
      code: '',
    },
  })

  // New password form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  // Resend timer effect
  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleEmailSubmit = async (data: EmailFormData) => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setEmail(data.email)
      setStep('code')
      setResendTimer(60) // 60 second timer
      
      toast.success('Verification code sent!', {
        description: `We've sent a code to ${data.email}`,
        icon: <Mail className="h-4 w-4" />,
      })
      
    } catch (error) {
      toast.error('Failed to send code', {
        description: 'Please check your email and try again.',
        icon: <AlertCircle className="h-4 w-4" />,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCodeSubmit = async (data: CodeFormData) => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setStep('password')
      
      toast.success('Code verified!', {
        description: 'You can now reset your password.',
        icon: <CheckCircle2 className="h-4 w-4" />,
      })
      
    } catch (error) {
      toast.error('Invalid code', {
        description: 'Please check the code and try again.',
        icon: <AlertCircle className="h-4 w-4" />,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (data: PasswordFormData) => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Password reset successful!', {
        description: 'You can now sign in with your new password.',
        icon: <CheckCircle2 className="h-4 w-4" />,
      })
      
      // Redirect to login
      setTimeout(() => {
        router.push('/login')
      }, 1000)
      
    } catch (error) {
      toast.error('Failed to reset password', {
        description: 'Something went wrong. Please try again.',
        icon: <AlertCircle className="h-4 w-4" />,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (resendTimer > 0) return
    
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setResendTimer(60)
      
      toast.success('Code resent!', {
        description: `New code sent to ${email}`,
        icon: <Mail className="h-4 w-4" />,
      })
    } catch (error) {
      toast.error('Failed to resend code', {
        description: 'Please try again later.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (password.match(/[a-z]/)) strength++
    if (password.match(/[A-Z]/)) strength++
    if (password.match(/[0-9]/)) strength++
    if (password.match(/[^A-Za-z0-9]/)) strength++
    
    return {
      score: strength,
      label: strength <= 2 ? 'Weak' : strength <= 3 ? 'Medium' : strength <= 4 ? 'Strong' : 'Very Strong',
      color: strength <= 2 ? 'bg-red-500' : strength <= 3 ? 'bg-yellow-500' : strength <= 4 ? 'bg-green-500' : 'bg-green-600',
    }
  }

  const passwordStrength = getPasswordStrength(passwordForm.watch('password') || '')

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

      {/* Reset Card - 400px max width as per spec */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[400px]"
      >
        <Card className="border-gray-200 shadow-xl">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold">
                  {step === 'email' && 'Reset your password'}
                  {step === 'code' && 'Enter verification code'}
                  {step === 'password' && 'Create new password'}
                </CardTitle>
              </div>
            </div>
            <CardDescription className="text-gray-500 pl-10">
              {step === 'email' && "Enter your email and we'll send you a verification code"}
              {step === 'code' && `We've sent a 6-digit code to ${email}`}
              {step === 'password' && 'Choose a strong password for your account'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              {/* Step 1: Email */}
              {step === 'email' && (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Form {...emailForm}>
                    <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
                      <FormField
                        control={emailForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="name@company.com"
                                  className="h-12 pl-10"
                                  disabled={isLoading}
                                  autoFocus
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full h-12 bg-[#007BFF] hover:bg-[#0062CC]"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Sending code...
                          </>
                        ) : (
                          <>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Verification Code
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </motion.div>
              )}

              {/* Step 2: Verification Code */}
              {step === 'code' && (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Form {...codeForm}>
                    <form onSubmit={codeForm.handleSubmit(handleCodeSubmit)} className="space-y-4">
                      <FormField
                        control={codeForm.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Verification Code</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="000000"
                                  maxLength={6}
                                  className="h-12 pl-10 text-center text-lg font-mono"
                                  disabled={isLoading}
                                  autoFocus
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Enter the 6-digit code sent to your email
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full h-12 bg-[#007BFF] hover:bg-[#0062CC]"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          'Verify Code'
                        )}
                      </Button>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={handleResendCode}
                          disabled={resendTimer > 0 || isLoading}
                          className={cn(
                            'text-sm',
                            resendTimer > 0 || isLoading
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-primary hover:text-primary/80'
                          )}
                        >
                          {resendTimer > 0
                            ? `Resend code in ${resendTimer}s`
                            : "Didn't receive the code? Resend"}
                        </button>
                      </div>
                    </form>
                  </Form>
                </motion.div>
              )}

              {/* Step 3: New Password */}
              {step === 'password' && (
                <motion.div
                  key="password"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                <Input
                                  {...field}
                                  type={showPassword ? 'text' : 'password'}
                                  placeholder="Create a strong password"
                                  className="h-12 pl-10 pr-10"
                                  disabled={isLoading}
                                  autoFocus
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                  tabIndex={-1}
                                >
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                            </FormControl>
                            {field.value && (
                              <div className="mt-2 space-y-1">
                                <div className="flex gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={cn(
                                        'h-1 flex-1 rounded-full bg-gray-200',
                                        i < passwordStrength.score && passwordStrength.color
                                      )}
                                    />
                                  ))}
                                </div>
                                <p className="text-xs text-gray-500">
                                  Password strength: <span className="font-medium">{passwordStrength.label}</span>
                                </p>
                              </div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                <Input
                                  {...field}
                                  type={showConfirmPassword ? 'text' : 'password'}
                                  placeholder="Confirm your password"
                                  className="h-12 pl-10 pr-10"
                                  disabled={isLoading}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                  tabIndex={-1}
                                >
                                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full h-12 bg-[#007BFF] hover:bg-[#0062CC]"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Resetting password...
                          </>
                        ) : (
                          'Reset Password'
                        )}
                      </Button>
                    </form>
                  </Form>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link
                href="/login"
                className="font-medium text-primary hover:text-primary/80"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}