/**
 * Form Components Test Page - PropertyChain
 * Tests enhanced form components with validation
 */

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  CurrencyInput,
  PhoneInput,
  CreditCardInput,
  PasswordInput,
  RangeSlider,
  SelectWithSearch,
  CheckboxGroup,
  FormSection,
  FormValidationSummary,
  formSchemas,
} from '@/components/custom/form-elements'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import {
  Building2,
  MapPin,
  DollarSign,
  Percent,
  Calendar,
  FileText,
  Shield,
  CheckCircle,
} from 'lucide-react'

// Investment form schema
const investmentFormSchema = z.object({
  amount: z.number()
    .min(100, 'Minimum investment is $100')
    .max(1000000, 'Maximum investment is $1,000,000'),
  percentage: z.number()
    .min(1, 'Must invest at least 1%')
    .max(100, 'Cannot exceed 100%'),
  duration: z.number()
    .min(6, 'Minimum duration is 6 months')
    .max(60, 'Maximum duration is 60 months'),
  propertyType: z.string().min(1, 'Please select a property type'),
  investmentGoals: z.array(z.string()).min(1, 'Please select at least one goal'),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
})

// Profile form schema
const profileFormSchema = z.object({
  email: formSchemas.email,
  phone: formSchemas.phone,
  password: formSchemas.password,
  confirmPassword: z.string(),
  firstName: formSchemas.required,
  lastName: formSchemas.required,
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  walletAddress: formSchemas.walletAddress,
  creditCard: z.string().optional(),
  notifications: z.boolean(),
  newsletter: z.boolean(),
  twoFactor: z.boolean(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Property types for select
const propertyTypes = [
  { value: 'residential', label: 'Residential', icon: <Building2 className="h-4 w-4" /> },
  { value: 'commercial', label: 'Commercial', icon: <Building2 className="h-4 w-4" /> },
  { value: 'industrial', label: 'Industrial', icon: <Building2 className="h-4 w-4" /> },
  { value: 'mixed', label: 'Mixed Use', icon: <Building2 className="h-4 w-4" /> },
  { value: 'land', label: 'Land', icon: <MapPin className="h-4 w-4" /> },
]

// Investment goals for checkboxes
const investmentGoals = [
  { value: 'income', label: 'Rental Income', description: 'Regular monthly payments' },
  { value: 'appreciation', label: 'Capital Appreciation', description: 'Long-term value growth' },
  { value: 'diversification', label: 'Portfolio Diversification', description: 'Reduce risk exposure' },
  { value: 'tax', label: 'Tax Benefits', description: 'Optimize tax strategy' },
]

export default function TestFormComponentsPage() {
  const [submittedData, setSubmittedData] = useState<any>(null)
  const { toast } = useToast()

  // Investment form
  const investmentForm = useForm<z.infer<typeof investmentFormSchema>>({
    resolver: zodResolver(investmentFormSchema),
    defaultValues: {
      amount: 5000,
      percentage: 25,
      duration: 12,
      propertyType: '',
      investmentGoals: [],
      agreeToTerms: false,
    },
  })

  // Profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      bio: '',
      walletAddress: '',
      creditCard: '',
      notifications: true,
      newsletter: false,
      twoFactor: false,
    },
  })

  const onInvestmentSubmit = (data: z.infer<typeof investmentFormSchema>) => {
    setSubmittedData(data)
    toast({
      title: 'Investment Form Submitted',
      description: 'Your investment details have been validated successfully.',
    })
  }

  const onProfileSubmit = (data: z.infer<typeof profileFormSchema>) => {
    setSubmittedData(data)
    toast({
      title: 'Profile Form Submitted',
      description: 'Your profile has been updated successfully.',
    })
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Form Components Test</h1>
        <p className="text-muted-foreground">
          Testing enhanced form components with React Hook Form and Zod validation
        </p>
      </div>

      <Tabs defaultValue="investment" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="investment">Investment Form</TabsTrigger>
          <TabsTrigger value="profile">Profile Form</TabsTrigger>
          <TabsTrigger value="components">Individual Components</TabsTrigger>
        </TabsList>

        {/* Investment Form Tab */}
        <TabsContent value="investment">
          <Card>
            <CardHeader>
              <CardTitle>Property Investment Form</CardTitle>
              <CardDescription>
                Complete investment form with custom inputs and validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...investmentForm}>
                <form onSubmit={investmentForm.handleSubmit(onInvestmentSubmit)} className="space-y-8">
                  {/* Show validation summary if there are errors */}
                  {Object.keys(investmentForm.formState.errors).length > 0 && (
                    <FormValidationSummary errors={investmentForm.formState.errors} />
                  )}

                  <FormSection
                    title="Investment Details"
                    description="Specify your investment amount and preferences"
                  >
                    <div className="grid gap-6 md:grid-cols-2">
                      <CurrencyInput
                        control={investmentForm.control}
                        name="amount"
                        label="Investment Amount"
                        description="Minimum investment: $100"
                        min={100}
                        max={1000000}
                        required
                      />

                      <FormField
                        control={investmentForm.control}
                        name="percentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Portfolio Percentage
                              <span className="text-destructive ml-1">*</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="number"
                                  placeholder="Enter percentage"
                                  className="h-12 pr-10"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                                <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Percentage of your portfolio
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <RangeSlider
                      control={investmentForm.control}
                      name="duration"
                      label="Investment Duration"
                      description="How long do you plan to hold this investment?"
                      min={6}
                      max={60}
                      step={6}
                      suffix=" months"
                      marks={[
                        { value: 6, label: '6mo' },
                        { value: 24, label: '2yr' },
                        { value: 60, label: '5yr' },
                      ]}
                    />

                    <SelectWithSearch
                      control={investmentForm.control}
                      name="propertyType"
                      label="Property Type"
                      placeholder="Select property type"
                      options={propertyTypes}
                      required
                    />

                    <CheckboxGroup
                      control={investmentForm.control}
                      name="investmentGoals"
                      label="Investment Goals"
                      description="Select all that apply"
                      options={investmentGoals}
                    />

                    <FormField
                      control={investmentForm.control}
                      name="agreeToTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Accept terms and conditions
                            </FormLabel>
                            <FormDescription>
                              You agree to our Terms of Service and Privacy Policy
                            </FormDescription>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </FormSection>

                  <div className="flex gap-4">
                    <Button type="submit" size="lg">
                      Submit Investment
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => investmentForm.reset()}
                    >
                      Reset Form
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Form Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>User Profile Form</CardTitle>
              <CardDescription>
                Complete profile form with various input types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-8">
                  {/* Show validation summary if there are errors */}
                  {Object.keys(profileForm.formState.errors).length > 0 && (
                    <FormValidationSummary errors={profileForm.formState.errors} />
                  )}

                  <FormSection
                    title="Personal Information"
                    description="Your basic profile details"
                  >
                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={profileForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              First Name
                              <span className="text-destructive ml-1">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input className="h-12" placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Last Name
                              <span className="text-destructive ml-1">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input className="h-12" placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Email Address
                            <span className="text-destructive ml-1">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              className="h-12"
                              placeholder="john.doe@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <PhoneInput
                      control={profileForm.control}
                      name="phone"
                      label="Phone Number"
                      required
                    />

                    <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about yourself..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Brief description for your profile (max 500 characters)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </FormSection>

                  <Separator />

                  <FormSection
                    title="Security & Payment"
                    description="Secure your account and payment methods"
                  >
                    <PasswordInput
                      control={profileForm.control}
                      name="password"
                      label="Password"
                      description="Must contain uppercase, lowercase, number and special character"
                      required
                      showStrength
                    />

                    <FormField
                      control={profileForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Confirm Password
                            <span className="text-destructive ml-1">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              className="h-12"
                              placeholder="Re-enter password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="walletAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Wallet Address
                            <span className="text-destructive ml-1">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="h-12 font-mono"
                              placeholder="0x..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Your Ethereum wallet address for transactions
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <CreditCardInput
                      control={profileForm.control}
                      name="creditCard"
                      label="Credit Card (Optional)"
                      description="For backup payment method"
                    />
                  </FormSection>

                  <Separator />

                  <FormSection
                    title="Preferences"
                    description="Customize your experience"
                  >
                    <div className="space-y-4">
                      <FormField
                        control={profileForm.control}
                        name="notifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Push Notifications
                              </FormLabel>
                              <FormDescription>
                                Receive notifications about your investments
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="newsletter"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Newsletter
                              </FormLabel>
                              <FormDescription>
                                Weekly updates and investment opportunities
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="twoFactor"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Two-Factor Authentication
                              </FormLabel>
                              <FormDescription>
                                Add an extra layer of security to your account
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </FormSection>

                  <div className="flex gap-4">
                    <Button type="submit" size="lg">
                      Save Profile
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => profileForm.reset()}
                    >
                      Reset Form
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Individual Components Tab */}
        <TabsContent value="components">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Input Size Variants</CardTitle>
                <CardDescription>
                  Three sizes following Section 6 specifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Small (40px height)</Label>
                  <Input className="h-10" placeholder="Small input" />
                </div>
                <div>
                  <Label>Default (48px height)</Label>
                  <Input className="h-12" placeholder="Default input" />
                </div>
                <div>
                  <Label>Large (56px height)</Label>
                  <Input className="h-14" placeholder="Large input" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Validation States</CardTitle>
                <CardDescription>
                  Different validation and feedback states
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Success State</Label>
                  <div className="relative">
                    <Input className="h-12 pr-10 border-green-500" placeholder="Valid input" />
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                  </div>
                  <p className="text-sm text-green-600">This field is valid</p>
                </div>

                <div className="space-y-2">
                  <Label>Error State</Label>
                  <Input className="h-12 border-destructive" placeholder="Invalid input" />
                  <p className="text-sm text-destructive">This field has an error</p>
                </div>

                <div className="space-y-2">
                  <Label>Disabled State</Label>
                  <Input className="h-12" placeholder="Disabled input" disabled />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Submitted Data Display */}
      {submittedData && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Submitted Form Data</CardTitle>
            <CardDescription>
              Successfully validated form submission
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-auto">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Feature Checklist */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Step 18 Features Implemented</CardTitle>
          <CardDescription>
            Form components with React Hook Form and Zod validation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-3">Custom Input Components</h3>
              <ul className="space-y-2 text-sm">
                <li>✅ CurrencyInput with formatting</li>
                <li>✅ PhoneInput with pattern mask</li>
                <li>✅ CreditCardInput with formatting</li>
                <li>✅ PasswordInput with visibility toggle</li>
                <li>✅ RangeSlider with value display</li>
                <li>✅ SelectWithSearch for long lists</li>
                <li>✅ CheckboxGroup for multiple selection</li>
                <li>✅ All inputs support React Hook Form</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Validation & Features</h3>
              <ul className="space-y-2 text-sm">
                <li>✅ Zod schema validation</li>
                <li>✅ Common validation schemas library</li>
                <li>✅ Password strength indicator</li>
                <li>✅ Real-time validation feedback</li>
                <li>✅ FormValidationSummary component</li>
                <li>✅ FormSection for organization</li>
                <li>✅ Three size variants (40px, 48px, 56px)</li>
                <li>✅ Required field indicators</li>
              </ul>
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="font-semibold mb-3">Section 6 Compliance</h3>
            <ul className="space-y-2 text-sm">
              <li>✅ shadcn Form components as base</li>
              <li>✅ React Hook Form integration</li>
              <li>✅ React Number Format for currency</li>
              <li>✅ Custom input heights (h-10, h-12, h-14)</li>
              <li>✅ Zod validation schemas</li>
              <li>✅ FormMessage for error display</li>
              <li>✅ FormDescription for help text</li>
              <li>✅ 8px grid system alignment</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}