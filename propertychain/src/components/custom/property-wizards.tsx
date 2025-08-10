/**
 * Property Wizards - PropertyChain
 * 
 * Specialized wizard forms for real estate transactions and property management
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
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert'
import {
  WizardForm,
  FormStep,
  useWizardForm,
  type WizardStep,
  type WizardStepProps,
} from './wizard-forms'
import {
  Home,
  Building,
  DollarSign,
  Camera,
  FileText,
  MapPin,
  Calendar,
  Users,
  Key,
  Shield,
  Star,
  CheckCircle,
  Info,
  AlertTriangle,
  Upload,
  Search,
  Filter,
  Settings,
  Briefcase,
  Target,
  TrendingUp,
  Zap,
  Clock,
  Eye,
  Edit,
  Save,
  Send,
  Paperclip,
  Image,
  Video,
  Phone,
  Mail,
  Globe,
  Wifi,
  Car,
  Trees,
  Utensils,
  GraduationCap,
  ShoppingCart,
  Activity,
  Heart,
} from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { formatCurrency } from '@/lib/format'

// PropertyChain Wizard Types
export interface PropertyListingData {
  basicInfo: {
    title: string
    description: string
    propertyType: 'residential' | 'commercial' | 'land' | 'mixed'
    listingType: 'sale' | 'rent' | 'lease'
    price: number
    priceType: 'fixed' | 'negotiable' | 'auction'
  }
  location: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    neighborhood?: string
    coordinates?: { lat: number; lng: number }
  }
  details: {
    bedrooms?: number
    bathrooms?: number
    squareFeet: number
    lotSize?: number
    yearBuilt?: number
    propertyCondition: 'excellent' | 'good' | 'fair' | 'needs_work'
    parkingSpaces?: number
    stories?: number
  }
  features: {
    amenities: string[]
    appliances: string[]
    utilities: string[]
    accessibility: string[]
    outdoorFeatures: string[]
    communityFeatures: string[]
  }
  media: {
    photos: Array<{ url: string; caption?: string; isPrimary: boolean }>
    videos: Array<{ url: string; title?: string; type: 'tour' | 'walkthrough' | 'drone' }>
    documents: Array<{ url: string; name: string; type: string }>
    virtualTour?: string
  }
  financial: {
    price: number
    monthlyRent?: number
    securityDeposit?: number
    hoaFees?: number
    propertyTaxes?: number
    insurance?: number
    utilities?: number
    maintenance?: number
  }
  legal: {
    ownershipType: 'individual' | 'corporation' | 'trust' | 'partnership'
    titleStatus: 'clear' | 'pending' | 'disputed'
    zoning: string
    restrictions?: string[]
    easements?: string[]
    liens?: boolean
  }
  marketing: {
    showingInstructions: string
    availableFrom?: Date
    keyBoxCode?: string
    contactPreference: 'phone' | 'email' | 'text' | 'app'
    showOnMLS: boolean
    showOnWebsite: boolean
    featuredListing: boolean
    marketingBudget?: number
  }
}

export interface TransactionData {
  parties: {
    buyer: {
      name: string
      email: string
      phone: string
      address: string
      agentId?: string
      preApprovalAmount?: number
      financingType: 'cash' | 'conventional' | 'fha' | 'va' | 'usda' | 'other'
    }
    seller: {
      name: string
      email: string
      phone: string
      address: string
      agentId?: string
    }
    agents: Array<{
      id: string
      name: string
      role: 'buyer_agent' | 'seller_agent' | 'dual_agent'
      licenseNumber: string
      brokerage: string
    }>
    lender?: {
      name: string
      contact: string
      loanOfficer: string
    }
  }
  property: {
    address: string
    mlsNumber?: string
    propertyType: string
    squareFeet: number
    lotSize?: number
    yearBuilt?: number
  }
  financial: {
    purchasePrice: number
    downPayment: number
    loanAmount: number
    interestRate?: number
    loanTerm?: number
    closingCosts?: number
    earnestMoney: number
    inspectionContingency: boolean
    appraisalContingency: boolean
    financingContingency: boolean
  }
  timeline: {
    offerDate: Date
    acceptanceDate?: Date
    inspectionDate?: Date
    appraisalDate?: Date
    closingDate: Date
    possessionDate?: Date
  }
  contingencies: {
    inspection: {
      enabled: boolean
      period?: number
      cost?: number
      items?: string[]
    }
    appraisal: {
      enabled: boolean
      period?: number
      cost?: number
    }
    financing: {
      enabled: boolean
      period?: number
      preApprovalRequired: boolean
    }
    saleOfBuyerHome: {
      enabled: boolean
      address?: string
      timeline?: number
    }
  }
  disclosures: {
    propertyCondition: Array<{
      type: string
      description: string
      resolved: boolean
    }>
    environmental: Array<{
      type: string
      description: string
      mitigation?: string
    }>
    legal: Array<{
      type: string
      description: string
      documentation?: string[]
    }>
  }
}

// Property Listing Wizard
export function PropertyListingWizard({
  onComplete,
  onCancel,
  initialData,
  className,
}: {
  onComplete: (data: PropertyListingData) => void
  onCancel?: () => void
  initialData?: Partial<PropertyListingData>
  className?: string
}) {
  const wizardSteps: Omit<WizardStep, 'isCompleted' | 'isValid' | 'hasError'>[] = [
    {
      id: 'basic-info',
      title: 'Basic Information',
      description: 'Property type, price, and basic details',
      icon: <Home className="h-5 w-5" />,
      isRequired: true,
      component: PropertyBasicInfoStep,
    },
    {
      id: 'location',
      title: 'Location',
      description: 'Address and location details',
      icon: <MapPin className="h-5 w-5" />,
      isRequired: true,
      component: PropertyLocationStep,
    },
    {
      id: 'details',
      title: 'Property Details',
      description: 'Bedrooms, bathrooms, and specifications',
      icon: <Building className="h-5 w-5" />,
      isRequired: true,
      component: PropertyDetailsStep,
    },
    {
      id: 'features',
      title: 'Features & Amenities',
      description: 'Property features and amenities',
      icon: <Star className="h-5 w-5" />,
      isRequired: false,
      component: PropertyFeaturesStep,
    },
    {
      id: 'media',
      title: 'Photos & Media',
      description: 'Upload photos, videos, and documents',
      icon: <Camera className="h-5 w-5" />,
      isRequired: false,
      component: PropertyMediaStep,
    },
    {
      id: 'financial',
      title: 'Financial Details',
      description: 'Pricing, taxes, and financial information',
      icon: <DollarSign className="h-5 w-5" />,
      isRequired: true,
      component: PropertyFinancialStep,
    },
    {
      id: 'legal',
      title: 'Legal Information',
      description: 'Ownership, zoning, and legal details',
      icon: <Shield className="h-5 w-5" />,
      isRequired: true,
      component: PropertyLegalStep,
    },
    {
      id: 'marketing',
      title: 'Marketing & Showings',
      description: 'Listing settings and showing preferences',
      icon: <Target className="h-5 w-5" />,
      isRequired: false,
      component: PropertyMarketingStep,
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Review all information before submitting',
      icon: <CheckCircle className="h-5 w-5" />,
      isRequired: true,
      component: PropertyReviewStep,
    },
  ]

  const {
    steps,
    currentStepIndex,
    updateStepValidation,
    goToStep,
  } = useWizardForm(wizardSteps)

  return (
    <div className={className}>
      <WizardForm
        steps={steps}
        currentStepIndex={currentStepIndex}
        onStepChange={goToStep}
        onComplete={(data) => onComplete(data as PropertyListingData)}
        onCancel={onCancel}
        showProgress={true}
        allowSkipOptional={true}
        showSummary={true}
      />
    </div>
  )
}

// Transaction Processing Wizard
export function TransactionWizard({
  onComplete,
  onCancel,
  initialData,
  className,
}: {
  onComplete: (data: TransactionData) => void
  onCancel?: () => void
  initialData?: Partial<TransactionData>
  className?: string
}) {
  const wizardSteps: Omit<WizardStep, 'isCompleted' | 'isValid' | 'hasError'>[] = [
    {
      id: 'parties',
      title: 'Parties Involved',
      description: 'Buyer, seller, and agent information',
      icon: <Users className="h-5 w-5" />,
      isRequired: true,
      component: TransactionPartiesStep,
    },
    {
      id: 'property',
      title: 'Property Information',
      description: 'Details about the property being transacted',
      icon: <Home className="h-5 w-5" />,
      isRequired: true,
      component: TransactionPropertyStep,
    },
    {
      id: 'financial',
      title: 'Financial Terms',
      description: 'Purchase price, financing, and costs',
      icon: <DollarSign className="h-5 w-5" />,
      isRequired: true,
      component: TransactionFinancialStep,
    },
    {
      id: 'timeline',
      title: 'Important Dates',
      description: 'Key dates and deadlines',
      icon: <Calendar className="h-5 w-5" />,
      isRequired: true,
      component: TransactionTimelineStep,
    },
    {
      id: 'contingencies',
      title: 'Contingencies',
      description: 'Inspection, appraisal, and financing contingencies',
      icon: <Shield className="h-5 w-5" />,
      isRequired: false,
      component: TransactionContingenciesStep,
    },
    {
      id: 'disclosures',
      title: 'Disclosures',
      description: 'Property condition and legal disclosures',
      icon: <FileText className="h-5 w-5" />,
      isRequired: true,
      component: TransactionDisclosuresStep,
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Review transaction details before proceeding',
      icon: <CheckCircle className="h-5 w-5" />,
      isRequired: true,
      component: TransactionReviewStep,
    },
  ]

  const {
    steps,
    currentStepIndex,
    updateStepValidation,
    goToStep,
  } = useWizardForm(wizardSteps)

  return (
    <div className={className}>
      <WizardForm
        steps={steps}
        currentStepIndex={currentStepIndex}
        onStepChange={goToStep}
        onComplete={(data) => onComplete(data as TransactionData)}
        onCancel={onCancel}
        showProgress={true}
        allowSkipOptional={false}
        showSummary={true}
      />
    </div>
  )
}

// Property Listing Wizard Steps
function PropertyBasicInfoStep({ data, onDataChange, onValidationChange }: WizardStepProps) {
  const schema = z.object({
    title: z.string().min(1, 'Property title is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    propertyType: z.enum(['residential', 'commercial', 'land', 'mixed']),
    listingType: z.enum(['sale', 'rent', 'lease']),
    price: z.number().min(1, 'Price is required'),
    priceType: z.enum(['fixed', 'negotiable', 'auction']),
  })

  const form = useForm({
    resolver: zodResolver(schema),
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
    <FormStep title="Basic Property Information">
      <div className="space-y-6">
        <div>
          <Label htmlFor="title">Property Title *</Label>
          <Input
            id="title"
            {...form.register('title')}
            placeholder="e.g., Beautiful 3BR Home with Pool"
          />
          {form.formState.errors.title && (
            <p className="text-sm text-destructive mt-1">
              {String(form.formState.errors.title?.message || '')}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Property Description *</Label>
          <Textarea
            id="description"
            {...form.register('description')}
            placeholder="Describe the property, its features, and what makes it special..."
            rows={4}
          />
          {form.formState.errors.description && (
            <p className="text-sm text-destructive mt-1">
              {String(form.formState.errors.description?.message || '')}
            </p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label>Property Type *</Label>
            <Select onValueChange={(value) => form.setValue('propertyType', value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="land">Land</SelectItem>
                <SelectItem value="mixed">Mixed Use</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Listing Type *</Label>
            <Select onValueChange={(value) => form.setValue('listingType', value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="For sale or rent?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">For Sale</SelectItem>
                <SelectItem value="rent">For Rent</SelectItem>
                <SelectItem value="lease">For Lease</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Price Type *</Label>
            <Select onValueChange={(value) => form.setValue('priceType', value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Price type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed Price</SelectItem>
                <SelectItem value="negotiable">Negotiable</SelectItem>
                <SelectItem value="auction">Auction</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="price">Price *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="price"
              type="number"
              {...form.register('price', { valueAsNumber: true })}
              placeholder="Enter price"
              className="pl-7"
            />
          </div>
          {form.formState.errors.price && (
            <p className="text-sm text-destructive mt-1">
              {String(form.formState.errors.price?.message || '')}
            </p>
          )}
        </div>
      </div>
    </FormStep>
  )
}

function PropertyLocationStep({ data, onDataChange, onValidationChange }: WizardStepProps) {
  const schema = z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(5, 'Valid ZIP code is required'),
    country: z.string().min(1, 'Country is required'),
    neighborhood: z.string().optional(),
  })

  const form = useForm({
    resolver: zodResolver(schema),
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
    <FormStep title="Property Location">
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
              {String(form.formState.errors.street?.message || '')}
            </p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              {...form.register('city')}
              placeholder="Enter city"
            />
            {form.formState.errors.city && (
              <p className="text-sm text-destructive mt-1">
                {String(form.formState.errors.city?.message || '')}
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
                {String(form.formState.errors.state?.message || '')}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input
              id="zipCode"
              {...form.register('zipCode')}
              placeholder="Enter ZIP code"
            />
            {form.formState.errors.zipCode && (
              <p className="text-sm text-destructive mt-1">
                {String(form.formState.errors.zipCode?.message || '')}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="country">Country *</Label>
            <Input
              id="country"
              {...form.register('country')}
              placeholder="Enter country"
              defaultValue="United States"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="neighborhood">Neighborhood</Label>
          <Input
            id="neighborhood"
            {...form.register('neighborhood')}
            placeholder="Enter neighborhood name"
          />
        </div>
      </div>
    </FormStep>
  )
}

function PropertyDetailsStep({ data, onDataChange, onValidationChange }: WizardStepProps) {
  const schema = z.object({
    squareFeet: z.number().min(1, 'Square footage is required'),
    bedrooms: z.number().optional(),
    bathrooms: z.number().optional(),
    lotSize: z.number().optional(),
    yearBuilt: z.number().optional(),
    propertyCondition: z.enum(['excellent', 'good', 'fair', 'needs_work']),
    parkingSpaces: z.number().optional(),
    stories: z.number().optional(),
  })

  const form = useForm({
    resolver: zodResolver(schema),
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
    <FormStep title="Property Details">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="squareFeet">Square Feet *</Label>
            <Input
              id="squareFeet"
              type="number"
              {...form.register('squareFeet', { valueAsNumber: true })}
              placeholder="Enter square feet"
            />
            {form.formState.errors.squareFeet && (
              <p className="text-sm text-destructive mt-1">
                {String(form.formState.errors.squareFeet?.message || '')}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              type="number"
              {...form.register('bedrooms', { valueAsNumber: true })}
              placeholder="Number of bedrooms"
            />
          </div>

          <div>
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
              id="bathrooms"
              type="number"
              step="0.5"
              {...form.register('bathrooms', { valueAsNumber: true })}
              placeholder="Number of bathrooms"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="lotSize">Lot Size (sq ft)</Label>
            <Input
              id="lotSize"
              type="number"
              {...form.register('lotSize', { valueAsNumber: true })}
              placeholder="Lot size in square feet"
            />
          </div>

          <div>
            <Label htmlFor="yearBuilt">Year Built</Label>
            <Input
              id="yearBuilt"
              type="number"
              {...form.register('yearBuilt', { valueAsNumber: true })}
              placeholder="Year property was built"
            />
          </div>

          <div>
            <Label htmlFor="stories">Stories</Label>
            <Input
              id="stories"
              type="number"
              {...form.register('stories', { valueAsNumber: true })}
              placeholder="Number of stories"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Property Condition *</Label>
            <Select onValueChange={(value) => form.setValue('propertyCondition', value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="needs_work">Needs Work</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="parkingSpaces">Parking Spaces</Label>
            <Input
              id="parkingSpaces"
              type="number"
              {...form.register('parkingSpaces', { valueAsNumber: true })}
              placeholder="Number of parking spaces"
            />
          </div>
        </div>
      </div>
    </FormStep>
  )
}

function PropertyFeaturesStep({ data, onDataChange, onValidationChange }: WizardStepProps) {
  React.useEffect(() => {
    onValidationChange(true) // Features are optional
  }, [onValidationChange])

  const [selectedFeatures, setSelectedFeatures] = React.useState({
    amenities: data.amenities || [],
    appliances: data.appliances || [],
    utilities: data.utilities || [],
  })

  React.useEffect(() => {
    onDataChange(selectedFeatures)
  }, [selectedFeatures, onDataChange])

  const featureCategories = {
    amenities: [
      'Swimming Pool', 'Hot Tub', 'Gym/Fitness Center', 'Tennis Court',
      'Basketball Court', 'Playground', 'Clubhouse', 'Business Center',
      'Concierge', 'Doorman', 'Elevator', 'Balcony/Patio', 'Fireplace',
      'Walk-in Closet', 'Storage Unit', 'Laundry Room'
    ],
    appliances: [
      'Refrigerator', 'Dishwasher', 'Microwave', 'Oven/Range',
      'Garbage Disposal', 'Washer/Dryer', 'Air Conditioning',
      'Central Heating', 'Ceiling Fans', 'Water Heater'
    ],
    utilities: [
      'Electricity', 'Gas', 'Water', 'Sewer', 'Trash', 'Internet',
      'Cable TV', 'Security System', 'Sprinkler System'
    ],
  }

  const toggleFeature = (category: keyof typeof selectedFeatures, feature: string) => {
    setSelectedFeatures(prev => ({
      ...prev,
      [category]: prev[category].includes(feature)
        ? prev[category].filter((f: string) => f !== feature)
        : [...prev[category], feature]
    }))
  }

  return (
    <FormStep title="Features & Amenities">
      <div className="space-y-6">
        {Object.entries(featureCategories).map(([category, features]) => (
          <div key={category}>
            <h4 className="font-medium mb-3 capitalize">{category}</h4>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {features.map(feature => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${category}-${feature}`}
                    checked={selectedFeatures[category as keyof typeof selectedFeatures].includes(feature)}
                    onCheckedChange={() => toggleFeature(category as keyof typeof selectedFeatures, feature)}
                  />
                  <Label
                    htmlFor={`${category}-${feature}`}
                    className="text-sm cursor-pointer"
                  >
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </FormStep>
  )
}

function PropertyMediaStep({ data, onDataChange, onValidationChange }: WizardStepProps) {
  React.useEffect(() => {
    onValidationChange(true) // Media is optional but recommended
  }, [onValidationChange])

  const [media, setMedia] = React.useState({
    photos: data.photos || [],
    videos: data.videos || [],
    documents: data.documents || [],
    virtualTour: data.virtualTour || '',
  })

  React.useEffect(() => {
    onDataChange(media)
  }, [media, onDataChange])

  return (
    <FormStep title="Photos & Media">
      <div className="space-y-6">
        <Alert>
          <Camera className="h-4 w-4" />
          <AlertDescription>
            High-quality photos significantly increase listing interest. Upload at least 5 photos for best results.
          </AlertDescription>
        </Alert>

        <div>
          <Label>Property Photos</Label>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop photos here, or click to select
            </p>
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Upload Photos
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Supported formats: JPG, PNG, WebP. Max 20 photos, 10MB each.
          </p>
        </div>

        <div>
          <Label>Property Videos</Label>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <Video className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Upload walkthrough videos or virtual tours
            </p>
            <Button variant="outline" size="sm">
              <Video className="mr-2 h-4 w-4" />
              Upload Videos
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="virtualTour">Virtual Tour URL</Label>
          <Input
            id="virtualTour"
            value={media.virtualTour}
            onChange={(e) => setMedia(prev => ({ ...prev, virtualTour: e.target.value }))}
            placeholder="Enter virtual tour link (Matterport, etc.)"
          />
        </div>

        <div>
          <Label>Property Documents</Label>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <FileText className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Upload floor plans, disclosures, and other documents
            </p>
            <Button variant="outline" size="sm">
              <Paperclip className="mr-2 h-4 w-4" />
              Upload Documents
            </Button>
          </div>
        </div>
      </div>
    </FormStep>
  )
}

function PropertyFinancialStep({ data, onDataChange, onValidationChange }: WizardStepProps) {
  const schema = z.object({
    price: z.number().min(1, 'Price is required'),
    monthlyRent: z.number().optional(),
    hoaFees: z.number().optional(),
    propertyTaxes: z.number().optional(),
    insurance: z.number().optional(),
  })

  const form = useForm({
    resolver: zodResolver(schema),
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
    <FormStep title="Financial Information">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="price">List Price *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="price"
                type="number"
                {...form.register('price', { valueAsNumber: true })}
                placeholder="Enter list price"
                className="pl-7"
              />
            </div>
            {form.formState.errors.price && (
              <p className="text-sm text-destructive mt-1">
                {String(form.formState.errors.price?.message || '')}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="monthlyRent">Monthly Rent (if applicable)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="monthlyRent"
                type="number"
                {...form.register('monthlyRent', { valueAsNumber: true })}
                placeholder="Monthly rent amount"
                className="pl-7"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label htmlFor="hoaFees">HOA Fees (monthly)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="hoaFees"
                type="number"
                {...form.register('hoaFees', { valueAsNumber: true })}
                placeholder="Monthly HOA fees"
                className="pl-7"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="propertyTaxes">Property Taxes (annual)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="propertyTaxes"
                type="number"
                {...form.register('propertyTaxes', { valueAsNumber: true })}
                placeholder="Annual property taxes"
                className="pl-7"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="insurance">Insurance (annual)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="insurance"
                type="number"
                {...form.register('insurance', { valueAsNumber: true })}
                placeholder="Annual insurance cost"
                className="pl-7"
              />
            </div>
          </div>
        </div>
      </div>
    </FormStep>
  )
}

function PropertyLegalStep({ data, onDataChange, onValidationChange }: WizardStepProps) {
  const schema = z.object({
    ownershipType: z.enum(['individual', 'corporation', 'trust', 'partnership']),
    titleStatus: z.enum(['clear', 'pending', 'disputed']),
    zoning: z.string().min(1, 'Zoning information is required'),
  })

  const form = useForm({
    resolver: zodResolver(schema),
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
    <FormStep title="Legal Information">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Ownership Type *</Label>
            <Select onValueChange={(value) => form.setValue('ownershipType', value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select ownership type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="corporation">Corporation</SelectItem>
                <SelectItem value="trust">Trust</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Title Status *</Label>
            <Select onValueChange={(value) => form.setValue('titleStatus', value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select title status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clear">Clear Title</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="zoning">Zoning *</Label>
          <Input
            id="zoning"
            {...form.register('zoning')}
            placeholder="e.g., R-1, C-2, Mixed Use"
          />
          {form.formState.errors.zoning && (
            <p className="text-sm text-destructive mt-1">
              {String(form.formState.errors.zoning?.message || '')}
            </p>
          )}
        </div>
      </div>
    </FormStep>
  )
}

function PropertyMarketingStep({ data, onDataChange, onValidationChange }: WizardStepProps) {
  React.useEffect(() => {
    onValidationChange(true) // Marketing settings are optional
  }, [onValidationChange])

  const [marketing, setMarketing] = React.useState({
    showingInstructions: data.showingInstructions || '',
    contactPreference: data.contactPreference || 'phone',
    showOnMLS: data.showOnMLS !== false,
    showOnWebsite: data.showOnWebsite !== false,
    featuredListing: data.featuredListing || false,
  })

  React.useEffect(() => {
    onDataChange(marketing)
  }, [marketing, onDataChange])

  return (
    <FormStep title="Marketing & Showings">
      <div className="space-y-6">
        <div>
          <Label htmlFor="showingInstructions">Showing Instructions</Label>
          <Textarea
            id="showingInstructions"
            value={marketing.showingInstructions}
            onChange={(e) => setMarketing(prev => ({ ...prev, showingInstructions: e.target.value }))}
            placeholder="Special instructions for showing the property..."
            rows={3}
          />
        </div>

        <div>
          <Label>Contact Preference</Label>
          <RadioGroup 
            value={marketing.contactPreference} 
            onValueChange={(value) => setMarketing(prev => ({ ...prev, contactPreference: value }))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="phone" id="phone" />
              <Label htmlFor="phone">Phone</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="email" id="email" />
              <Label htmlFor="email">Email</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="text" id="text" />
              <Label htmlFor="text">Text Message</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="app" id="app" />
              <Label htmlFor="app">PropertyChain App</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="showOnMLS"
              checked={marketing.showOnMLS}
              onCheckedChange={(checked) => setMarketing(prev => ({ ...prev, showOnMLS: checked }))}
            />
            <Label htmlFor="showOnMLS">List on MLS</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="showOnWebsite"
              checked={marketing.showOnWebsite}
              onCheckedChange={(checked) => setMarketing(prev => ({ ...prev, showOnWebsite: checked }))}
            />
            <Label htmlFor="showOnWebsite">Show on PropertyChain website</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featuredListing"
              checked={marketing.featuredListing}
              onCheckedChange={(checked) => setMarketing(prev => ({ ...prev, featuredListing: checked }))}
            />
            <Label htmlFor="featuredListing">Featured listing (additional fee)</Label>
          </div>
        </div>
      </div>
    </FormStep>
  )
}

function PropertyReviewStep({ data, onDataChange, onValidationChange }: WizardStepProps) {
  React.useEffect(() => {
    onValidationChange(true) // Review step is always valid
  }, [onValidationChange])

  return (
    <FormStep title="Review Property Listing">
      <div className="space-y-6">
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Please review all information carefully before submitting your property listing.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><strong>Title:</strong> {data['basic-info']?.title || 'Not provided'}</div>
              <div><strong>Type:</strong> {data['basic-info']?.propertyType || 'Not provided'}</div>
              <div><strong>Price:</strong> {data['basic-info']?.price ? formatCurrency(data['basic-info'].price) : 'Not provided'}</div>
              <div><strong>Listing Type:</strong> {data['basic-info']?.listingType || 'Not provided'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><strong>Address:</strong> {data['location']?.street || 'Not provided'}</div>
              <div><strong>City:</strong> {data['location']?.city || 'Not provided'}</div>
              <div><strong>State:</strong> {data['location']?.state || 'Not provided'}</div>
              <div><strong>ZIP:</strong> {data['location']?.zipCode || 'Not provided'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><strong>Square Feet:</strong> {data['details']?.squareFeet?.toLocaleString() || 'Not provided'}</div>
              <div><strong>Bedrooms:</strong> {data['details']?.bedrooms || 'Not provided'}</div>
              <div><strong>Bathrooms:</strong> {data['details']?.bathrooms || 'Not provided'}</div>
              <div><strong>Condition:</strong> {data['details']?.propertyCondition || 'Not provided'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Financial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><strong>List Price:</strong> {data['financial']?.price ? formatCurrency(data['financial'].price) : 'Not provided'}</div>
              <div><strong>HOA Fees:</strong> {data['financial']?.hoaFees ? `$${data['financial'].hoaFees}/month` : 'None'}</div>
              <div><strong>Property Taxes:</strong> {data['financial']?.propertyTaxes ? `$${data['financial'].propertyTaxes}/year` : 'Not provided'}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </FormStep>
  )
}

// Transaction Wizard Steps (simplified versions)
function TransactionPartiesStep({ data, onDataChange, onValidationChange }: WizardStepProps) {
  React.useEffect(() => {
    onValidationChange(true) // Simplified for demo
  }, [onValidationChange])

  return (
    <FormStep title="Transaction Parties">
      <div className="space-y-4">
        <Alert>
          <Users className="h-4 w-4" />
          <AlertDescription>
            This step would collect detailed information about all parties involved in the transaction.
          </AlertDescription>
        </Alert>
      </div>
    </FormStep>
  )
}

function TransactionPropertyStep({ data, onDataChange, onValidationChange }: WizardStepProps) {
  React.useEffect(() => {
    onValidationChange(true) // Simplified for demo
  }, [onValidationChange])

  return (
    <FormStep title="Property Information">
      <div className="space-y-4">
        <Alert>
          <Home className="h-4 w-4" />
          <AlertDescription>
            This step would collect property details for the transaction.
          </AlertDescription>
        </Alert>
      </div>
    </FormStep>
  )
}

function TransactionFinancialStep({ data, onDataChange, onValidationChange }: WizardStepProps) {
  React.useEffect(() => {
    onValidationChange(true) // Simplified for demo
  }, [onValidationChange])

  return (
    <FormStep title="Financial Terms">
      <div className="space-y-4">
        <Alert>
          <DollarSign className="h-4 w-4" />
          <AlertDescription>
            This step would collect financial terms and loan information.
          </AlertDescription>
        </Alert>
      </div>
    </FormStep>
  )
}

function TransactionTimelineStep({ data, onDataChange, onValidationChange }: WizardStepProps) {
  React.useEffect(() => {
    onValidationChange(true) // Simplified for demo
  }, [onValidationChange])

  return (
    <FormStep title="Important Dates">
      <div className="space-y-4">
        <Alert>
          <Calendar className="h-4 w-4" />
          <AlertDescription>
            This step would set up key dates and deadlines for the transaction.
          </AlertDescription>
        </Alert>
      </div>
    </FormStep>
  )
}

function TransactionContingenciesStep({ data, onDataChange, onValidationChange }: WizardStepProps) {
  React.useEffect(() => {
    onValidationChange(true) // Simplified for demo
  }, [onValidationChange])

  return (
    <FormStep title="Contingencies">
      <div className="space-y-4">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            This step would configure inspection, appraisal, and financing contingencies.
          </AlertDescription>
        </Alert>
      </div>
    </FormStep>
  )
}

function TransactionDisclosuresStep({ data, onDataChange, onValidationChange }: WizardStepProps) {
  React.useEffect(() => {
    onValidationChange(true) // Simplified for demo
  }, [onValidationChange])

  return (
    <FormStep title="Disclosures">
      <div className="space-y-4">
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertDescription>
            This step would handle property condition and legal disclosures.
          </AlertDescription>
        </Alert>
      </div>
    </FormStep>
  )
}

function TransactionReviewStep({ data, onDataChange, onValidationChange }: WizardStepProps) {
  React.useEffect(() => {
    onValidationChange(true) // Review step is always valid
  }, [onValidationChange])

  return (
    <FormStep title="Review Transaction">
      <div className="space-y-4">
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            This step would show a comprehensive review of all transaction details.
          </AlertDescription>
        </Alert>
      </div>
    </FormStep>
  )
}