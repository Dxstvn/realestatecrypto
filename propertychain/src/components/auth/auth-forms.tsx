/**
 * Authentication Forms Component - PropertyChain
 * 
 * Comprehensive authentication system with login, registration, and security features
 * Multi-step registration flow with KYC, social login, 2FA, and password security
 * Following UpdatedUIPlan.md specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Shield,
  Smartphone,
  Key,
  Building,
  MapPin,
  Calendar,
  Upload,
  Chrome,
  Github,
  Linkedin,
  Facebook,
} from 'lucide-react'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/cn'

/**
 * Schema definitions for different forms
 */
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().default(false),
})

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

const resetPasswordSchema = z.object({
  token: z.string().min(6, 'Please enter the verification code'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

const registrationStep1Schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine((val) => val, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

const registrationStep2Schema = z.object({
  investorType: z.enum(['individual', 'entity', 'institutional']),
  countryOfResidence: z.string().min(1, 'Please select your country'),
  dateOfBirth: z.string().min(1, 'Please enter your date of birth'),
  occupation: z.string().min(2, 'Please enter your occupation'),
  annualIncome: z.enum(['<50k', '50k-100k', '100k-250k', '250k-500k', '500k+']),
  investmentExperience: z.enum(['beginner', 'intermediate', 'advanced']),
  investmentGoals: z.array(z.string()).min(1, 'Please select at least one goal'),
})

const registrationStep3Schema = z.object({
  idDocumentType: z.enum(['passport', 'license', 'national_id']),
  idDocument: z.any().optional(),
  proofOfAddress: z.any().optional(),
  bankStatement: z.any().optional(),
  accreditationDoc: z.any().optional(),
})

const twoFactorSchema = z.object({
  code: z.string().length(6, 'Please enter the 6-digit code'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
export type RegistrationStep1Values = z.infer<typeof registrationStep1Schema>
export type RegistrationStep2Values = z.infer<typeof registrationStep2Schema>
export type RegistrationStep3Values = z.infer<typeof registrationStep3Schema>
export type TwoFactorFormValues = z.infer<typeof twoFactorSchema>

/**
 * Password strength checker
 */
function PasswordStrengthIndicator({ password }: { password: string }) {
  const getPasswordStrength = (pwd: string) => {
    let score = 0
    const checks = {
      length: pwd.length >= 8,
      lowercase: /[a-z]/.test(pwd),
      uppercase: /[A-Z]/.test(pwd),
      numbers: /\d/.test(pwd),
      symbols: /[^a-zA-Z0-9]/.test(pwd),
    }

    Object.values(checks).forEach((check) => {
      if (check) score += 1
    })

    return { score, checks }
  }

  const { score, checks } = getPasswordStrength(password)
  
  const strength = score === 0 ? 'none' 
    : score <= 2 ? 'weak' 
    : score <= 3 ? 'fair' 
    : score <= 4 ? 'good' 
    : 'strong'

  const colors = {
    none: 'bg-gray-200',
    weak: 'bg-red-500',
    fair: 'bg-orange-500',
    good: 'bg-yellow-500',
    strong: 'bg-green-500',
  }

  const labels = {
    none: '',
    weak: 'Weak',
    fair: 'Fair',
    good: 'Good',
    strong: 'Strong',
  }

  if (!password) return null

  return (
    <div className="space-y-2 mt-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Password strength</span>
        <span className={cn(
          'text-xs font-medium',
          strength === 'weak' && 'text-red-600',
          strength === 'fair' && 'text-orange-600',
          strength === 'good' && 'text-yellow-600',
          strength === 'strong' && 'text-green-600'
        )}>
          {labels[strength]}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1">
        <div 
          className={cn('h-1 rounded-full transition-all duration-300', colors[strength])}
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
      <div className="grid grid-cols-2 gap-1 text-xs">
        {Object.entries(checks).map(([key, passed]) => (
          <div key={key} className={cn(
            'flex items-center gap-1',
            passed ? 'text-green-600' : 'text-gray-400'
          )}>
            {passed ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
            <span className="capitalize">{key === 'symbols' ? 'special chars' : key}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Social login buttons
 */
function SocialLoginButtons({ onSocialLogin }: { onSocialLogin: (provider: string) => void }) {
  const providers = [
    { id: 'google', name: 'Google', icon: Chrome, color: 'border-red-200 hover:bg-red-50' },
    { id: 'github', name: 'GitHub', icon: Github, color: 'border-gray-200 hover:bg-gray-50' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'border-blue-200 hover:bg-blue-50' },
  ]

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {providers.map((provider) => (
          <Button
            key={provider.id}
            variant="outline"
            onClick={() => onSocialLogin(provider.id)}
            className={cn('h-11', provider.color)}
          >
            <provider.icon className="h-5 w-5" />
          </Button>
        ))}
      </div>
    </div>
  )
}

/**
 * Login Form Component
 */
export function LoginForm({ onSuccess, onForgotPassword, onRegister }: {
  onSuccess?: (data: LoginFormValues) => void
  onForgotPassword?: () => void
  onRegister?: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast.success('Login successful!')
      onSuccess?.(data)
    } catch (error) {
      toast.error('Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} login would be implemented here`)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>Sign in to your PropertyChain account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-normal">
                        Remember me
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <Button
                variant="link"
                className="px-0 font-normal"
                onClick={onForgotPassword}
                type="button"
              >
                Forgot password?
              </Button>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </Form>

        <SocialLoginButtons onSocialLogin={handleSocialLogin} />

        <div className="text-center text-sm">
          Don't have an account?{' '}
          <Button variant="link" className="px-0 font-normal" onClick={onRegister}>
            Sign up
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Two-Factor Authentication Form
 */
export function TwoFactorForm({ onSuccess, onBack }: {
  onSuccess?: (data: TwoFactorFormValues) => void
  onBack?: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<TwoFactorFormValues>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: '',
    },
  })

  const onSubmit = async (data: TwoFactorFormValues) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast.success('Two-factor authentication successful!')
      onSuccess?.(data)
    } catch (error) {
      toast.error('Invalid verification code.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Smartphone className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Two-Factor Authentication</CardTitle>
        <CardDescription>
          Enter the 6-digit code from your authenticator app
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Authentication Code</FormLabel>
                  <FormControl>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onBack}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify'}
              </Button>
            </div>
          </form>
        </Form>

        <div className="text-center">
          <Button variant="link" className="text-sm">
            Didn't receive a code? Resend
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Multi-Step Registration Form
 */
export function RegistrationForm({ onSuccess, onLogin }: {
  onSuccess?: () => void
  onLogin?: () => void
}) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const totalSteps = 3

  // Step 1: Personal Information
  const step1Form = useForm<RegistrationStep1Values>({
    resolver: zodResolver(registrationStep1Schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
  })

  // Step 2: Investor Profile
  const step2Form = useForm<RegistrationStep2Values>({
    resolver: zodResolver(registrationStep2Schema),
    defaultValues: {
      investorType: 'individual',
      countryOfResidence: '',
      dateOfBirth: '',
      occupation: '',
      annualIncome: '<50k',
      investmentExperience: 'beginner',
      investmentGoals: [],
    },
  })

  // Step 3: Document Verification
  const step3Form = useForm<RegistrationStep3Values>({
    resolver: zodResolver(registrationStep3Schema),
    defaultValues: {
      idDocumentType: 'passport',
    },
  })

  const onStep1Submit = async (data: RegistrationStep1Values) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCurrentStep(2)
      toast.success('Personal information saved!')
    } catch (error) {
      toast.error('Failed to save information.')
    } finally {
      setIsLoading(false)
    }
  }

  const onStep2Submit = async (data: RegistrationStep2Values) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCurrentStep(3)
      toast.success('Investor profile completed!')
    } catch (error) {
      toast.error('Failed to save profile.')
    } finally {
      setIsLoading(false)
    }
  }

  const onStep3Submit = async (data: RegistrationStep3Values) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast.success('Registration completed! Welcome to PropertyChain!')
      onSuccess?.()
    } catch (error) {
      toast.error('Registration failed.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} registration would be implemented here`)
  }

  const investmentGoalOptions = [
    { id: 'passive-income', label: 'Generate Passive Income' },
    { id: 'capital-growth', label: 'Capital Appreciation' },
    { id: 'diversification', label: 'Portfolio Diversification' },
    { id: 'inflation-hedge', label: 'Inflation Hedge' },
    { id: 'retirement', label: 'Retirement Planning' },
  ]

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
    'France', 'Japan', 'Singapore', 'Switzerland', 'Netherlands'
  ]

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="space-y-4">
        <div className="text-center">
          <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
          <CardDescription>
            Join PropertyChain and start investing in real estate
          </CardDescription>
        </div>
        
        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>
        
        {/* Step indicators */}
        <div className="flex justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center space-y-2">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                step < currentStep ? 'bg-green-500 text-white' :
                step === currentStep ? 'bg-primary text-white' :
                'bg-gray-200 text-gray-500'
              )}>
                {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
              </div>
              <span className="text-xs text-center">
                {step === 1 ? 'Personal Info' : step === 2 ? 'Investor Profile' : 'Verification'}
              </span>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Form {...step1Form}>
                <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={step1Form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="John" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={step1Form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Doe" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={step1Form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              type="email"
                              placeholder="john@example.com"
                              className="pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step1Form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              placeholder="+1 (555) 123-4567"
                              className="pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step1Form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Create a strong password"
                          />
                        </FormControl>
                        <PasswordStrengthIndicator password={field.value} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step1Form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Confirm your password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step1Form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm">
                            I agree to the{' '}
                            <Button variant="link" className="p-0 h-auto font-normal text-primary">
                              Terms of Service
                            </Button>{' '}
                            and{' '}
                            <Button variant="link" className="p-0 h-auto font-normal text-primary">
                              Privacy Policy
                            </Button>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Continue'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>

              <SocialLoginButtons onSocialLogin={handleSocialLogin} />
              
              <div className="text-center text-sm">
                Already have an account?{' '}
                <Button variant="link" className="px-0 font-normal" onClick={onLogin}>
                  Sign in
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Investor Profile */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Form {...step2Form}>
                <form onSubmit={step2Form.handleSubmit(onStep2Submit)} className="space-y-4">
                  <FormField
                    control={step2Form.control}
                    name="investorType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Investor Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-3 gap-4"
                          >
                            <div className="flex items-center space-x-2 border rounded-lg p-4">
                              <RadioGroupItem value="individual" id="individual" />
                              <Label htmlFor="individual" className="font-normal">Individual</Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-lg p-4">
                              <RadioGroupItem value="entity" id="entity" />
                              <Label htmlFor="entity" className="font-normal">Entity</Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-lg p-4">
                              <RadioGroupItem value="institutional" id="institutional" />
                              <Label htmlFor="institutional" className="font-normal">Institutional</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={step2Form.control}
                      name="countryOfResidence"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country of Residence</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country} value={country.toLowerCase().replace(/\s+/g, '-')}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={step2Form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={step2Form.control}
                    name="occupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Occupation</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Software Engineer" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={step2Form.control}
                      name="annualIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Annual Income</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="<50k">Less than $50k</SelectItem>
                              <SelectItem value="50k-100k">$50k - $100k</SelectItem>
                              <SelectItem value="100k-250k">$100k - $250k</SelectItem>
                              <SelectItem value="250k-500k">$250k - $500k</SelectItem>
                              <SelectItem value="500k+">$500k+</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={step2Form.control}
                      name="investmentExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Investment Experience</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={step2Form.control}
                    name="investmentGoals"
                    render={() => (
                      <FormItem>
                        <FormLabel>Investment Goals</FormLabel>
                        <div className="space-y-2">
                          {investmentGoalOptions.map((goal) => (
                            <FormField
                              key={goal.id}
                              control={step2Form.control}
                              name="investmentGoals"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={goal.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(goal.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, goal.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== goal.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {goal.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setCurrentStep(1)}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button type="submit" className="flex-1" disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Continue'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </motion.div>
          )}

          {/* Step 3: Document Verification */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    To comply with regulations, we need to verify your identity. 
                    All documents are securely encrypted and used solely for verification purposes.
                  </AlertDescription>
                </Alert>

                <Form {...step3Form}>
                  <form onSubmit={step3Form.handleSubmit(onStep3Submit)} className="space-y-4">
                    <FormField
                      control={step3Form.control}
                      name="idDocumentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID Document Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="passport">Passport</SelectItem>
                              <SelectItem value="license">Driver's License</SelectItem>
                              <SelectItem value="national_id">National ID</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>ID Document</Label>
                          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                            <Upload className="mx-auto h-8 w-8 text-gray-400" />
                            <div className="mt-2">
                              <Button variant="ghost" className="text-sm">
                                Upload Document
                              </Button>
                              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label>Proof of Address</Label>
                          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                            <Upload className="mx-auto h-8 w-8 text-gray-400" />
                            <div className="mt-2">
                              <Button variant="ghost" className="text-sm">
                                Upload Document
                              </Button>
                              <p className="text-xs text-gray-500 mt-1">Utility bill or bank statement</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label>Bank Statement (Optional)</Label>
                        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          <Upload className="mx-auto h-8 w-8 text-gray-400" />
                          <div className="mt-2">
                            <Button variant="ghost" className="text-sm">
                              Upload Statement
                            </Button>
                            <p className="text-xs text-gray-500 mt-1">For income verification</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setCurrentStep(2)}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button type="submit" className="flex-1" disabled={isLoading}>
                        {isLoading ? 'Submitting...' : 'Complete Registration'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

/**
 * Forgot Password Form
 */
export function ForgotPasswordForm({ onSuccess, onBack }: {
  onSuccess?: (email: string) => void
  onBack?: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast.success('Password reset email sent!')
      onSuccess?.(data.email)
    } catch (error) {
      toast.error('Failed to send reset email.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Key className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <Button variant="link" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}