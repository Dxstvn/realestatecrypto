/**
 * Registration Page - PropertyChain
 * 
 * Multi-step registration wizard following UpdatedUIPlan.md Section 7.2
 * 4 steps: Email & Password, Personal Info, Investor Type, Terms
 * Following CLAUDE.md KYC/AML and security standards
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User,
  Phone,
  Building,
  Briefcase,
  FileText,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Info,
  Shield,
  TrendingUp,
  Home,
  Users,
} from 'lucide-react'

// ============================================================================
// Types & Validation
// ============================================================================

// Step 1: Email & Password
const step1Schema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
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

// Step 2: Personal Information
const step2Schema = z.object({
  firstName: z.string().min(1, 'First name is required').min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(1, 'Last name is required').min(2, 'Last name must be at least 2 characters'),
  phone: z.string().min(1, 'Phone number is required').regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
})

// Step 3: Investor Type
const step3Schema = z.object({
  investorType: z.enum(['individual', 'institutional', 'accredited']).refine(
    (val) => val !== undefined,
    { message: 'Please select an investor type' }
  ),
  investmentGoal: z.enum(['growth', 'income', 'balanced']).refine(
    (val) => val !== undefined,
    { message: 'Please select your investment goal' }
  ),
  experienceLevel: z.enum(['beginner', 'intermediate', 'expert']).refine(
    (val) => val !== undefined,
    { message: 'Please select your experience level' }
  ),
})

// Step 4: Terms & Conditions
const step4Schema = z.object({
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
  privacyAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the privacy policy',
  }),
  marketingOptIn: z.boolean(),
})

// Combined schema
const registrationSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
  ...step4Schema.shape,
})

type RegistrationFormData = z.infer<typeof registrationSchema>

// ============================================================================
// Registration Page Component
// ============================================================================

export default function RegisterPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      dateOfBirth: '',
      investorType: undefined,
      investmentGoal: undefined,
      experienceLevel: undefined,
      termsAccepted: false,
      privacyAccepted: false,
      marketingOptIn: false,
    },
    mode: 'onChange',
  })

  const validateCurrentStep = async () => {
    let fieldsToValidate: (keyof RegistrationFormData)[] = []
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['email', 'password', 'confirmPassword']
        break
      case 2:
        fieldsToValidate = ['firstName', 'lastName', 'phone', 'dateOfBirth']
        break
      case 3:
        fieldsToValidate = ['investorType', 'investmentGoal', 'experienceLevel']
        break
      case 4:
        fieldsToValidate = ['termsAccepted', 'privacyAccepted']
        break
    }

    const result = await form.trigger(fieldsToValidate)
    return result
  }

  const handleNext = async () => {
    const isValid = await validateCurrentStep()
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const onSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Registration successful!', {
        description: 'Your account has been created. Redirecting to dashboard...',
        icon: <CheckCircle2 className="h-4 w-4" />,
      })
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
      
    } catch (error) {
      toast.error('Registration failed', {
        description: 'Something went wrong. Please try again.',
        icon: <AlertCircle className="h-4 w-4" />,
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

  const passwordStrength = getPasswordStrength(form.watch('password') || '')

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

      {/* Registration Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[480px]"
      >
        <Card className="border-gray-200 shadow-xl">
          <CardHeader className="space-y-4 pb-6">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Create your account
              </CardTitle>
              <CardDescription className="text-center text-gray-500">
                Join thousands of investors on PropertyChain
              </CardDescription>
            </div>

            {/* Progress Bar - 4 segments as per spec */}
            <div className="space-y-2">
              <Progress value={(currentStep / 4) * 100} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span className={cn(currentStep >= 1 && 'text-primary font-medium')}>Account</span>
                <span className={cn(currentStep >= 2 && 'text-primary font-medium')}>Personal</span>
                <span className={cn(currentStep >= 3 && 'text-primary font-medium')}>Investor</span>
                <span className={cn(currentStep >= 4 && 'text-primary font-medium')}>Terms</span>
              </div>
            </div>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="min-h-[400px]">
                <AnimatePresence mode="wait">
                  {/* Step 1: Email & Password */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
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
                                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                <Input
                                  {...field}
                                  type={showPassword ? 'text' : 'password'}
                                  placeholder="Create a strong password"
                                  className="h-12 pl-10 pr-10"
                                  disabled={isLoading}
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
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
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
                    </motion.div>
                  )}

                  {/* Step 2: Personal Information */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="John"
                                  className="h-12"
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Doe"
                                  className="h-12"
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                <Input
                                  {...field}
                                  type="tel"
                                  placeholder="+1 (555) 123-4567"
                                  className="h-12 pl-10"
                                  disabled={isLoading}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="date"
                                className="h-12"
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormDescription className="text-xs">
                              You must be 18 or older to invest
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  {/* Step 3: Investor Type */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="investorType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Investor Type</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="space-y-3"
                              >
                                <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                  <RadioGroupItem value="individual" id="individual" className="mt-1" />
                                  <label htmlFor="individual" className="flex-1 cursor-pointer">
                                    <div className="font-medium">Individual Investor</div>
                                    <div className="text-sm text-gray-500">Personal investment account</div>
                                  </label>
                                </div>
                                <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                  <RadioGroupItem value="institutional" id="institutional" className="mt-1" />
                                  <label htmlFor="institutional" className="flex-1 cursor-pointer">
                                    <div className="font-medium">Institutional Investor</div>
                                    <div className="text-sm text-gray-500">Company or organization account</div>
                                  </label>
                                </div>
                                <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                  <RadioGroupItem value="accredited" id="accredited" className="mt-1" />
                                  <label htmlFor="accredited" className="flex-1 cursor-pointer">
                                    <div className="font-medium">Accredited Investor</div>
                                    <div className="text-sm text-gray-500">Meets SEC accreditation requirements</div>
                                  </label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="investmentGoal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Investment Goal</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-3 gap-3"
                              >
                                <div className="text-center">
                                  <RadioGroupItem value="growth" id="growth" className="sr-only" />
                                  <label
                                    htmlFor="growth"
                                    className={cn(
                                      'flex flex-col items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50',
                                      field.value === 'growth' && 'border-primary bg-primary/5'
                                    )}
                                  >
                                    <TrendingUp className="h-6 w-6 mb-1" />
                                    <span className="text-sm font-medium">Growth</span>
                                  </label>
                                </div>
                                <div className="text-center">
                                  <RadioGroupItem value="income" id="income" className="sr-only" />
                                  <label
                                    htmlFor="income"
                                    className={cn(
                                      'flex flex-col items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50',
                                      field.value === 'income' && 'border-primary bg-primary/5'
                                    )}
                                  >
                                    <Home className="h-6 w-6 mb-1" />
                                    <span className="text-sm font-medium">Income</span>
                                  </label>
                                </div>
                                <div className="text-center">
                                  <RadioGroupItem value="balanced" id="balanced" className="sr-only" />
                                  <label
                                    htmlFor="balanced"
                                    className={cn(
                                      'flex flex-col items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50',
                                      field.value === 'balanced' && 'border-primary bg-primary/5'
                                    )}
                                  >
                                    <Users className="h-6 w-6 mb-1" />
                                    <span className="text-sm font-medium">Balanced</span>
                                  </label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="experienceLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Experience Level</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-3 gap-3"
                              >
                                <div>
                                  <RadioGroupItem value="beginner" id="beginner" className="sr-only" />
                                  <label
                                    htmlFor="beginner"
                                    className={cn(
                                      'block p-3 text-center border rounded-lg cursor-pointer hover:bg-gray-50',
                                      field.value === 'beginner' && 'border-primary bg-primary/5'
                                    )}
                                  >
                                    <span className="text-sm font-medium">Beginner</span>
                                  </label>
                                </div>
                                <div>
                                  <RadioGroupItem value="intermediate" id="intermediate" className="sr-only" />
                                  <label
                                    htmlFor="intermediate"
                                    className={cn(
                                      'block p-3 text-center border rounded-lg cursor-pointer hover:bg-gray-50',
                                      field.value === 'intermediate' && 'border-primary bg-primary/5'
                                    )}
                                  >
                                    <span className="text-sm font-medium">Intermediate</span>
                                  </label>
                                </div>
                                <div>
                                  <RadioGroupItem value="expert" id="expert" className="sr-only" />
                                  <label
                                    htmlFor="expert"
                                    className={cn(
                                      'block p-3 text-center border rounded-lg cursor-pointer hover:bg-gray-50',
                                      field.value === 'expert' && 'border-primary bg-primary/5'
                                    )}
                                  >
                                    <span className="text-sm font-medium">Expert</span>
                                  </label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  {/* Step 4: Terms & Conditions */}
                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-3">
                          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-blue-900">Your data is secure</p>
                            <p className="text-xs text-blue-700 mt-1">
                              We use bank-level encryption to protect your information and never share your data without your consent.
                            </p>
                          </div>
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="termsAccepted"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <div className="flex items-start space-x-3">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <div className="grid gap-1.5 leading-none">
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                  I accept the{' '}
                                  <Link href="/terms" className="text-primary hover:underline">
                                    Terms and Conditions
                                  </Link>
                                </FormLabel>
                                <FormDescription className="text-xs">
                                  By accepting, you agree to our terms of service and investment guidelines.
                                </FormDescription>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="privacyAccepted"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <div className="flex items-start space-x-3">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <div className="grid gap-1.5 leading-none">
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                  I accept the{' '}
                                  <Link href="/privacy" className="text-primary hover:underline">
                                    Privacy Policy
                                  </Link>
                                </FormLabel>
                                <FormDescription className="text-xs">
                                  Understand how we collect, use, and protect your personal information.
                                </FormDescription>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Separator />

                      <FormField
                        control={form.control}
                        name="marketingOptIn"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <div className="flex items-start space-x-3">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <div className="grid gap-1.5 leading-none">
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                  Send me investment opportunities and updates
                                </FormLabel>
                                <FormDescription className="text-xs">
                                  Get notified about new properties and exclusive investment opportunities. You can unsubscribe anytime.
                                </FormDescription>
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1 || isLoading}
                  className="h-12"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isLoading}
                    className="h-12 bg-[#007BFF] hover:bg-[#0062CC]"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 bg-[#007BFF] hover:bg-[#0062CC]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <Check className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </form>
          </Form>
        </Card>

        {/* Already have an account */}
        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:text-primary/80">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}