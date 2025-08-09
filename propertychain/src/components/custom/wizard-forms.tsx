/**
 * Wizard Forms - PropertyChain
 * 
 * Multi-step form components with progress indicators, validation, and navigation
 */

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert'
import {
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  Star,
  ArrowRight,
  ArrowLeft,
  Home,
  Building,
  DollarSign,
  FileText,
  Camera,
  MapPin,
  Calendar,
  Users,
  Settings,
  Shield,
  Zap,
  Target,
  BookOpen,
  Clipboard,
  Key,
  Search,
  Filter,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Save,
  Send,
} from 'lucide-react'
import { useForm, useFieldArray, type FieldValues, type Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Wizard Form Types
export interface WizardStep {
  id: string
  title: string
  description?: string
  icon?: React.ReactNode
  isRequired: boolean
  isCompleted: boolean
  isValid: boolean
  hasError: boolean
  errorMessage?: string
  component: React.ComponentType<WizardStepProps>
}

export interface WizardFormProps {
  steps: WizardStep[]
  currentStepIndex: number
  onStepChange: (stepIndex: number) => void
  onComplete: (data: any) => void
  onCancel?: () => void
  showProgress?: boolean
  allowSkipOptional?: boolean
  showSummary?: boolean
  className?: string
}

export interface WizardStepProps {
  data: any
  onDataChange: (data: any) => void
  onValidationChange: (isValid: boolean, error?: string) => void
  isActive: boolean
  onNext?: () => void
  onPrevious?: () => void
}

export interface WizardFormData {
  [key: string]: any
}

// Main Wizard Form Component
export function WizardForm({
  steps,
  currentStepIndex,
  onStepChange,
  onComplete,
  onCancel,
  showProgress = true,
  allowSkipOptional = true,
  showSummary = true,
  className,
}: WizardFormProps) {
  const [formData, setFormData] = React.useState<WizardFormData>({})
  const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(new Set())
  const [showCancelDialog, setShowCancelDialog] = React.useState(false)

  const currentStep = steps[currentStepIndex]
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1
  const canProceed = currentStep?.isValid || (allowSkipOptional && !currentStep?.isRequired)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleDataChange = React.useCallback((stepData: any) => {
    setFormData(prev => ({
      ...prev,
      [currentStep.id]: stepData,
    }))
  }, [currentStep.id])

  const handleValidationChange = React.useCallback((isValid: boolean, error?: string) => {
    // Update step validation in parent component would happen here
    // For now, we'll just track completed steps
    if (isValid) {
      setCompletedSteps(prev => new Set(prev).add(currentStepIndex))
    } else {
      setCompletedSteps(prev => {
        const newSet = new Set(prev)
        newSet.delete(currentStepIndex)
        return newSet
      })
    }
  }, [currentStepIndex])

  const handleNext = React.useCallback(() => {
    if (canProceed && !isLastStep) {
      onStepChange(currentStepIndex + 1)
    } else if (isLastStep && canProceed) {
      onComplete(formData)
    }
  }, [canProceed, isLastStep, currentStepIndex, onStepChange, onComplete, formData])

  const handlePrevious = React.useCallback(() => {
    if (!isFirstStep) {
      onStepChange(currentStepIndex - 1)
    }
  }, [isFirstStep, currentStepIndex, onStepChange])

  const handleStepClick = React.useCallback((stepIndex: number) => {
    // Allow navigation to previous steps or current step
    if (stepIndex <= currentStepIndex || completedSteps.has(stepIndex)) {
      onStepChange(stepIndex)
    }
  }, [currentStepIndex, completedSteps, onStepChange])

  const handleCancel = React.useCallback(() => {
    if (Object.keys(formData).length > 0) {
      setShowCancelDialog(true)
    } else {
      onCancel?.()
    }
  }, [formData, onCancel])

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      {/* Progress Header */}
      {showProgress && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Step {currentStepIndex + 1} of {steps.length}</span>
                  <span className="text-muted-foreground">{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Step Indicators */}
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => handleStepClick(index)}
                      disabled={index > currentStepIndex && !completedSteps.has(index)}
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                        index === currentStepIndex
                          ? "border-primary bg-primary text-primary-foreground"
                          : completedSteps.has(index)
                          ? "border-green-500 bg-green-500 text-white"
                          : index < currentStepIndex
                          ? "border-green-500 text-green-500 hover:bg-green-50"
                          : "border-muted-foreground text-muted-foreground cursor-not-allowed"
                      )}
                    >
                      {completedSteps.has(index) && index !== currentStepIndex ? (
                        <Check className="h-4 w-4" />
                      ) : step.hasError ? (
                        <X className="h-4 w-4" />
                      ) : (
                        <span className="text-xs font-medium">{index + 1}</span>
                      )}
                    </button>
                    {index < steps.length - 1 && (
                      <div className={cn(
                        "w-12 h-0.5 mx-2",
                        index < currentStepIndex ? "bg-green-500" : "bg-muted"
                      )} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step Titles */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 text-center">
                {steps.slice(0, 4).map((step, index) => (
                  <div
                    key={step.id}
                    className={cn(
                      "text-xs px-2 py-1 rounded",
                      index === currentStepIndex
                        ? "bg-primary/10 text-primary font-medium"
                        : completedSteps.has(index)
                        ? "text-green-600"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </div>
                ))}
                {steps.length > 4 && (
                  <div className="text-xs text-muted-foreground">
                    +{steps.length - 4} more
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Step */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            {currentStep?.icon}
            <div>
              <CardTitle className="flex items-center gap-2">
                {currentStep?.title}
                {currentStep?.isRequired && (
                  <Badge variant="secondary" className="text-xs">Required</Badge>
                )}
                {currentStep?.hasError && (
                  <Badge variant="destructive" className="text-xs">Error</Badge>
                )}
              </CardTitle>
              {currentStep?.description && (
                <CardDescription>{currentStep.description}</CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentStep?.hasError && currentStep.errorMessage && (
            <Alert className="mb-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{currentStep.errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Render Current Step Component */}
          {currentStep && (
            <currentStep.component
              data={formData[currentStep.id] || {}}
              onDataChange={handleDataChange}
              onValidationChange={handleValidationChange}
              isActive={true}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {onCancel && (
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
              {!isFirstStep && (
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!currentStep?.isRequired && !currentStep?.isValid && (
                <Button variant="ghost" onClick={handleNext}>
                  Skip
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              <Button 
                onClick={handleNext}
                disabled={!canProceed}
              >
                {isLastStep ? (
                  <>
                    Complete
                    <Check className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Step Summary */}
          {showSummary && (
            <div className="mt-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>
                    {completedSteps.size} of {steps.filter(s => s.isRequired).length} required steps completed
                  </span>
                  <span>
                    {completedSteps.size} of {steps.length} total steps completed
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Form?</DialogTitle>
            <DialogDescription>
              You have unsaved changes. Are you sure you want to cancel? All progress will be lost.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Continue Editing
            </Button>
            <Button variant="destructive" onClick={() => {
              setShowCancelDialog(false)
              onCancel?.()
            }}>
              Yes, Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Step Navigator Component
interface StepNavigatorProps {
  steps: WizardStep[]
  currentStepIndex: number
  completedSteps: Set<number>
  onStepClick: (index: number) => void
  orientation?: 'horizontal' | 'vertical'
  variant?: 'default' | 'compact' | 'detailed'
  className?: string
}

export function StepNavigator({
  steps,
  currentStepIndex,
  completedSteps,
  onStepClick,
  orientation = 'vertical',
  variant = 'default',
  className,
}: StepNavigatorProps) {
  if (variant === 'compact') {
    return (
      <div className={cn(
        "flex gap-1",
        orientation === 'vertical' ? "flex-col" : "flex-row",
        className
      )}>
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => onStepClick(index)}
            disabled={index > currentStepIndex && !completedSteps.has(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-colors",
              index === currentStepIndex
                ? "bg-primary"
                : completedSteps.has(index)
                ? "bg-green-500"
                : index < currentStepIndex
                ? "bg-green-300 hover:bg-green-400"
                : "bg-muted cursor-not-allowed"
            )}
            title={step.title}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={cn(
      "space-y-2",
      orientation === 'horizontal' && "flex space-y-0 space-x-4",
      className
    )}>
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={cn(
            "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
            index === currentStepIndex
              ? "border-primary bg-primary/5"
              : completedSteps.has(index)
              ? "border-green-200 bg-green-50"
              : index < currentStepIndex
              ? "border-muted hover:border-border"
              : "border-muted cursor-not-allowed opacity-50"
          )}
          onClick={() => onStepClick(index)}
        >
          {/* Step Icon */}
          <div className={cn(
            "flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium",
            index === currentStepIndex
              ? "bg-primary text-primary-foreground"
              : completedSteps.has(index)
              ? "bg-green-500 text-white"
              : "bg-muted text-muted-foreground"
          )}>
            {completedSteps.has(index) && index !== currentStepIndex ? (
              <Check className="h-3 w-3" />
            ) : step.hasError ? (
              <X className="h-3 w-3" />
            ) : (
              index + 1
            )}
          </div>

          {/* Step Content */}
          {variant === 'detailed' ? (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium">{step.title}</h4>
                {step.isRequired && (
                  <Badge variant="outline" className="text-xs">Required</Badge>
                )}
                {step.hasError && (
                  <Badge variant="destructive" className="text-xs">Error</Badge>
                )}
              </div>
              {step.description && (
                <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
              )}
              {step.hasError && step.errorMessage && (
                <p className="text-xs text-destructive mt-1">{step.errorMessage}</p>
              )}
            </div>
          ) : (
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium">{step.title}</h4>
            </div>
          )}

          {/* Step Status */}
          <div className="flex-shrink-0">
            {index === currentStepIndex ? (
              <Badge variant="default" className="text-xs">Current</Badge>
            ) : completedSteps.has(index) ? (
              <Badge variant="outline" className="text-xs text-green-600">Complete</Badge>
            ) : index < currentStepIndex ? (
              <Badge variant="secondary" className="text-xs">Visited</Badge>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}

// Form Step Wrapper Component
interface FormStepProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormStep({ title, description, children, className }: FormStepProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

// Multi-Step Form Hook
export function useWizardForm(initialSteps: Omit<WizardStep, 'isCompleted' | 'isValid' | 'hasError'>[]) {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0)
  const [steps, setSteps] = React.useState<WizardStep[]>(() =>
    initialSteps.map(step => ({
      ...step,
      isCompleted: false,
      isValid: false,
      hasError: false,
    }))
  )

  const updateStepValidation = React.useCallback((stepId: string, isValid: boolean, errorMessage?: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { 
            ...step, 
            isValid, 
            hasError: !isValid && step.isRequired,
            errorMessage: !isValid ? errorMessage : undefined,
            isCompleted: isValid,
          }
        : step
    ))
  }, [])

  const goToStep = React.useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStepIndex(stepIndex)
    }
  }, [steps.length])

  const nextStep = React.useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1)
    }
  }, [currentStepIndex, steps.length])

  const previousStep = React.useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1)
    }
  }, [currentStepIndex])

  const resetForm = React.useCallback(() => {
    setCurrentStepIndex(0)
    setSteps(prev => prev.map(step => ({
      ...step,
      isCompleted: false,
      isValid: false,
      hasError: false,
      errorMessage: undefined,
    })))
  }, [])

  return {
    steps,
    currentStepIndex,
    currentStep: steps[currentStepIndex],
    updateStepValidation,
    goToStep,
    nextStep,
    previousStep,
    resetForm,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    completedStepsCount: steps.filter(step => step.isCompleted).length,
    progress: ((currentStepIndex + 1) / steps.length) * 100,
  }
}

// Validation Schemas for Common Step Types
export const stepValidationSchemas = {
  basicInfo: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
  }),
  
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(5, 'Valid ZIP code is required'),
    country: z.string().min(1, 'Country is required'),
  }),

  preferences: z.object({
    notifications: z.boolean(),
    marketing: z.boolean(),
    newsletter: z.boolean(),
  }),
}

// Utility functions for creating mock wizard data
export function createMockWizardSteps(): Omit<WizardStep, 'isCompleted' | 'isValid' | 'hasError'>[] {
  return [
    {
      id: 'basic-info',
      title: 'Basic Information',
      description: 'Enter your personal details',
      icon: <User className="h-5 w-5" />,
      isRequired: true,
      component: ({ data, onDataChange, onValidationChange }) => (
        <BasicInfoStep 
          data={data} 
          onDataChange={onDataChange} 
          onValidationChange={onValidationChange}
        />
      ),
    },
    {
      id: 'address',
      title: 'Address',
      description: 'Provide your address information',
      icon: <MapPin className="h-5 w-5" />,
      isRequired: true,
      component: ({ data, onDataChange, onValidationChange }) => (
        <AddressStep 
          data={data} 
          onDataChange={onDataChange} 
          onValidationChange={onValidationChange}
        />
      ),
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Configure your settings',
      icon: <Settings className="h-5 w-5" />,
      isRequired: false,
      component: ({ data, onDataChange, onValidationChange }) => (
        <PreferencesStep 
          data={data} 
          onDataChange={onDataChange} 
          onValidationChange={onValidationChange}
        />
      ),
    },
    {
      id: 'review',
      title: 'Review',
      description: 'Review and confirm your information',
      icon: <CheckCircle className="h-5 w-5" />,
      isRequired: true,
      component: ({ data, onDataChange, onValidationChange }) => (
        <ReviewStep 
          data={data} 
          onDataChange={onDataChange} 
          onValidationChange={onValidationChange}
        />
      ),
    },
  ]
}

// Sample Step Components
function BasicInfoStep({ data, onDataChange, onValidationChange }: WizardStepProps) {
  const form = useForm({
    resolver: zodResolver(stepValidationSchemas.basicInfo),
    defaultValues: data,
  })

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      onDataChange(value)
      const isValid = form.formState.isValid
      onValidationChange(isValid, form.formState.errors.root?.message)
    })
    return () => subscription.unsubscribe()
  }, [form, onDataChange, onValidationChange])

  return (
    <FormStep title="Personal Information">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            {...form.register('name')}
            placeholder="Enter your full name"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            {...form.register('email')}
            placeholder="Enter your email"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            {...form.register('phone')}
            placeholder="Enter your phone number"
          />
        </div>
      </div>
    </FormStep>
  )
}

function AddressStep({ data, onDataChange, onValidationChange }: WizardStepProps) {
  const form = useForm({
    resolver: zodResolver(stepValidationSchemas.address),
    defaultValues: data,
  })

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      onDataChange(value)
      const isValid = form.formState.isValid
      onValidationChange(isValid, form.formState.errors.root?.message)
    })
    return () => subscription.unsubscribe()
  }, [form, onDataChange, onValidationChange])

  return (
    <FormStep title="Address Information">
      <div className="space-y-4">
        <div>
          <Label htmlFor="street">Street Address *</Label>
          <Input
            id="street"
            {...form.register('street')}
            placeholder="Enter street address"
          />
          {form.formState.errors.street && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.street.message}
            </p>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              {...form.register('city')}
              placeholder="Enter city"
            />
            {form.formState.errors.city && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.city.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              {...form.register('state')}
              placeholder="Enter state"
            />
            {form.formState.errors.state && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.state.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input
              id="zipCode"
              {...form.register('zipCode')}
              placeholder="Enter ZIP code"
            />
            {form.formState.errors.zipCode && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.zipCode.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </FormStep>
  )
}

function PreferencesStep({ data, onDataChange, onValidationChange }: WizardStepProps) {
  const form = useForm({
    resolver: zodResolver(stepValidationSchemas.preferences),
    defaultValues: data,
  })

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      onDataChange(value)
      onValidationChange(true) // Preferences are always valid since they're optional
    })
    return () => subscription.unsubscribe()
  }, [form, onDataChange, onValidationChange])

  return (
    <FormStep title="Communication Preferences">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="notifications"
            {...form.register('notifications')}
          />
          <Label htmlFor="notifications">Receive notifications</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="marketing"
            {...form.register('marketing')}
          />
          <Label htmlFor="marketing">Receive marketing emails</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="newsletter"
            {...form.register('newsletter')}
          />
          <Label htmlFor="newsletter">Subscribe to newsletter</Label>
        </div>
      </div>
    </FormStep>
  )
}

function ReviewStep({ data, onDataChange, onValidationChange }: WizardStepProps) {
  React.useEffect(() => {
    onValidationChange(true) // Review step is always valid
  }, [onValidationChange])

  return (
    <FormStep title="Review Your Information">
      <div className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Please review your information before submitting. You can go back to any step to make changes.
          </AlertDescription>
        </Alert>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><strong>Name:</strong> {data['basic-info']?.name || 'Not provided'}</div>
              <div><strong>Email:</strong> {data['basic-info']?.email || 'Not provided'}</div>
              <div><strong>Phone:</strong> {data['basic-info']?.phone || 'Not provided'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><strong>Street:</strong> {data['address']?.street || 'Not provided'}</div>
              <div><strong>City:</strong> {data['address']?.city || 'Not provided'}</div>
              <div><strong>State:</strong> {data['address']?.state || 'Not provided'}</div>
              <div><strong>ZIP:</strong> {data['address']?.zipCode || 'Not provided'}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </FormStep>
  )
}

// Import User icon that was missing
import { User } from 'lucide-react'