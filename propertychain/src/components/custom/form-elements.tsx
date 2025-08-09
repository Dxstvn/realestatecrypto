/**
 * Form Elements Components - PropertyChain
 * 
 * Enhanced form components wrapping shadcn Form elements
 * Includes currency inputs, validation, and custom styling
 * Following Section 0 principles and Section 6 specifications
 */

'use client'

import * as React from 'react'
import { NumericFormat, PatternFormat } from 'react-number-format'
import { z } from 'zod'
import { Control, FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'
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
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import {
  DollarSign,
  CreditCard,
  Calendar,
  Phone,
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  Info,
  HelpCircle,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// Common Zod schemas
export const formSchemas = {
  email: z.string().email('Please enter a valid email address'),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'),
  
  currency: z.number()
    .min(0, 'Amount must be positive')
    .max(999999999, 'Amount exceeds maximum'),
  
  percentage: z.number()
    .min(0, 'Percentage must be between 0 and 100')
    .max(100, 'Percentage must be between 0 and 100'),
  
  walletAddress: z.string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Please enter a valid wallet address'),
  
  required: z.string().min(1, 'This field is required'),
  
  optional: z.string().optional(),
}

// Input size variants
export type InputSize = 'sm' | 'default' | 'lg'

const inputSizes = {
  sm: 'h-10', // 40px
  default: 'h-12', // 48px
  lg: 'h-14', // 56px
}

// Currency Input Component
interface CurrencyInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label?: string
  description?: string
  placeholder?: string
  min?: number
  max?: number
  size?: InputSize
  required?: boolean
  disabled?: boolean
  prefix?: string
  suffix?: string
  allowNegative?: boolean
  decimalScale?: number
  className?: string
}

export function CurrencyInput<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder = 'Enter amount',
  min = 0,
  max,
  size = 'default',
  required = false,
  disabled = false,
  prefix = '$',
  suffix,
  allowNegative = false,
  decimalScale = 2,
  className,
}: CurrencyInputProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              {prefix && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {prefix === '$' ? <DollarSign className="h-4 w-4" /> : prefix}
                </div>
              )}
              <NumericFormat
                customInput={Input}
                thousandSeparator=","
                decimalScale={decimalScale}
                allowNegative={allowNegative}
                placeholder={placeholder}
                className={cn(
                  inputSizes[size],
                  prefix && 'pl-10',
                  suffix && 'pr-12'
                )}
                disabled={disabled}
                value={field.value}
                onValueChange={(values) => {
                  field.onChange(values.floatValue)
                }}
                isAllowed={(values) => {
                  const { floatValue } = values
                  if (floatValue === undefined) return true
                  if (min !== undefined && floatValue < min) return false
                  if (max !== undefined && floatValue > max) return false
                  return true
                }}
              />
              {suffix && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  {suffix}
                </div>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// Phone Input Component
interface PhoneInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label?: string
  description?: string
  placeholder?: string
  size?: InputSize
  required?: boolean
  disabled?: boolean
  className?: string
}

export function PhoneInput<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder = '(555) 555-5555',
  size = 'default',
  required = false,
  disabled = false,
  className,
}: PhoneInputProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <PatternFormat
                customInput={Input}
                format="(###) ###-####"
                mask="_"
                placeholder={placeholder}
                className={cn(inputSizes[size], 'pl-10')}
                disabled={disabled}
                value={field.value}
                onValueChange={(values) => {
                  field.onChange(values.value)
                }}
              />
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// Credit Card Input Component
interface CreditCardInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label?: string
  description?: string
  placeholder?: string
  size?: InputSize
  required?: boolean
  disabled?: boolean
  className?: string
}

export function CreditCardInput<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder = '0000 0000 0000 0000',
  size = 'default',
  required = false,
  disabled = false,
  className,
}: CreditCardInputProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <PatternFormat
                customInput={Input}
                format="#### #### #### ####"
                mask="_"
                placeholder={placeholder}
                className={cn(inputSizes[size], 'pl-10')}
                disabled={disabled}
                value={field.value}
                onValueChange={(values) => {
                  field.onChange(values.value)
                }}
              />
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// Password Input Component with visibility toggle
interface PasswordInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label?: string
  description?: string
  placeholder?: string
  size?: InputSize
  required?: boolean
  disabled?: boolean
  showStrength?: boolean
  className?: string
}

export function PasswordInput<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder = 'Enter password',
  size = 'default',
  required = false,
  disabled = false,
  showStrength = false,
  className,
}: PasswordInputProps<TFieldValues>) {
  const [showPassword, setShowPassword] = React.useState(false)

  const calculateStrength = (password: string): number => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (password.length >= 12) strength += 10
    if (/[A-Z]/.test(password)) strength += 20
    if (/[a-z]/.test(password)) strength += 20
    if (/[0-9]/.test(password)) strength += 20
    if (/[^A-Za-z0-9]/.test(password)) strength += 15
    return Math.min(strength, 100)
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const strength = showStrength ? calculateStrength(field.value || '') : 0
        const strengthColor = 
          strength < 40 ? 'bg-red-500' :
          strength < 70 ? 'bg-yellow-500' :
          'bg-green-500'

        return (
          <FormItem className={className}>
            {label && (
              <FormLabel>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={placeholder}
                  className={cn(inputSizes[size], 'pl-10 pr-10')}
                  disabled={disabled}
                  {...field}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 h-full px-3"
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
            {showStrength && field.value && (
              <div className="space-y-2">
                <Progress value={strength} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Password strength</span>
                  <span className={cn(
                    'font-medium',
                    strength < 40 && 'text-red-500',
                    strength >= 40 && strength < 70 && 'text-yellow-500',
                    strength >= 70 && 'text-green-500'
                  )}>
                    {strength < 40 ? 'Weak' : strength < 70 ? 'Medium' : 'Strong'}
                  </span>
                </div>
              </div>
            )}
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

// Range Slider with value display
interface RangeSliderProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label?: string
  description?: string
  min?: number
  max?: number
  step?: number
  prefix?: string
  suffix?: string
  showValue?: boolean
  marks?: Array<{ value: number; label: string }>
  className?: string
}

export function RangeSlider<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  min = 0,
  max = 100,
  step = 1,
  prefix = '',
  suffix = '',
  showValue = true,
  marks,
  className,
}: RangeSliderProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <div className="flex justify-between items-center mb-2">
              <FormLabel>{label}</FormLabel>
              {showValue && (
                <span className="text-sm font-medium">
                  {prefix}{field.value || min}{suffix}
                </span>
              )}
            </div>
          )}
          <FormControl>
            <div className="space-y-3">
              <Slider
                min={min}
                max={max}
                step={step}
                value={[field.value || min]}
                onValueChange={(value) => field.onChange(value[0])}
                className="w-full"
              />
              {marks && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  {marks.map((mark) => (
                    <span key={mark.value}>{mark.label}</span>
                  ))}
                </div>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// Enhanced Select with search
interface SelectWithSearchProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label?: string
  description?: string
  placeholder?: string
  options: Array<{ value: string; label: string; icon?: React.ReactNode }>
  required?: boolean
  disabled?: boolean
  className?: string
}

export function SelectWithSearch<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder = 'Select an option',
  options,
  required = false,
  disabled = false,
  className,
}: SelectWithSearchProps<TFieldValues>) {
  const [searchQuery, setSearchQuery] = React.useState('')
  
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className={inputSizes.default}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <div className="px-2 py-2">
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9"
                />
              </div>
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      {option.icon}
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// Checkbox Group Component
interface CheckboxGroupProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label?: string
  description?: string
  options: Array<{ value: string; label: string; description?: string }>
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function CheckboxGroup<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  options,
  orientation = 'vertical',
  className,
}: CheckboxGroupProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div className={cn(
              'space-y-3',
              orientation === 'horizontal' && 'flex flex-wrap gap-6 space-y-0'
            )}>
              {options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-start space-x-3 cursor-pointer"
                >
                  <Checkbox
                    checked={field.value?.includes(option.value)}
                    onCheckedChange={(checked) => {
                      const currentValue = field.value || []
                      if (checked) {
                        field.onChange([...currentValue, option.value])
                      } else {
                        field.onChange(
                          currentValue.filter((v: string) => v !== option.value)
                        )
                      }
                    }}
                  />
                  <div className="space-y-1 leading-none">
                    <Label className="font-normal cursor-pointer">
                      {option.label}
                    </Label>
                    {option.description && (
                      <p className="text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// Form Section Component for organization
export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('space-y-6', className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

// Form validation feedback component
export function FormValidationSummary({
  errors,
  className,
}: {
  errors: Record<string, any>
  className?: string
}) {
  const errorMessages = Object.entries(errors)
    .filter(([_, error]) => error?.message)
    .map(([field, error]) => ({
      field,
      message: error.message,
    }))

  if (errorMessages.length === 0) return null

  return (
    <div className={cn(
      'rounded-lg border border-destructive/50 bg-destructive/10 p-4',
      className
    )}>
      <div className="flex items-start gap-2">
        <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
        <div className="space-y-2">
          <p className="text-sm font-medium text-destructive">
            Please fix the following errors:
          </p>
          <ul className="list-disc list-inside space-y-1">
            {errorMessages.map(({ field, message }) => (
              <li key={field} className="text-sm text-destructive">
                {message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}