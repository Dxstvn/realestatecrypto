/**
 * Property Wizard - PropertyChain Admin
 * 
 * Multi-step form for adding/editing properties
 * Following UpdatedUIPlan.md Step 55.2 specifications
 */

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Building,
  MapPin,
  DollarSign,
  Image,
  FileText,
  Coins,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Plus,
  AlertCircle,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

// Form schemas for each step
const basicInfoSchema = z.object({
  name: z.string().min(1, 'Property name is required'),
  type: z.enum(['residential', 'commercial', 'industrial', 'land']),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  features: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
})

const financialSchema = z.object({
  propertyValue: z.number().positive('Property value must be positive'),
  tokenPrice: z.number().positive('Token price must be positive'),
  totalTokens: z.number().int().positive('Total tokens must be positive'),
  minimumInvestment: z.number().positive('Minimum investment must be positive'),
  expectedROI: z.number().min(0).max(100),
  annualYield: z.number().min(0).max(100),
  fundingDeadline: z.date(),
  distributionFrequency: z.enum(['monthly', 'quarterly', 'annually']),
})

const documentsSchema = z.object({
  propertyDeed: z.any().optional(),
  insurancePolicy: z.any().optional(),
  inspectionReport: z.any().optional(),
  appraisalReport: z.any().optional(),
  taxRecords: z.any().optional(),
  legalDocuments: z.array(z.any()).optional(),
})

const tokenizationSchema = z.object({
  tokenSymbol: z.string().min(3).max(10),
  blockchainNetwork: z.enum(['ethereum', 'polygon', 'arbitrum']),
  smartContractAddress: z.string().optional(),
  distributionMethod: z.enum(['immediate', 'vesting', 'milestone']),
  vestingPeriod: z.number().optional(),
  transferRestrictions: z.boolean(),
  votingRights: z.boolean(),
})

interface PropertyWizardProps {
  initialData?: any
  onComplete?: (data: any) => void
  onCancel?: () => void
}

export function PropertyWizard({ 
  initialData, 
  onComplete, 
  onCancel 
}: PropertyWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<any>({})
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([])
  const totalSteps = 6

  const steps = [
    { number: 1, title: 'Basic Information', icon: Building },
    { number: 2, title: 'Financial Details', icon: DollarSign },
    { number: 3, title: 'Images/Gallery', icon: Image },
    { number: 4, title: 'Documents', icon: FileText },
    { number: 5, title: 'Tokenization', icon: Coins },
    { number: 6, title: 'Review & Publish', icon: CheckCircle },
  ]

  // Form instances for each step
  const basicInfoForm = useForm({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: initialData?.basicInfo || {},
  })

  const financialForm = useForm({
    resolver: zodResolver(financialSchema),
    defaultValues: initialData?.financial || {},
  })

  const handleNextStep = async () => {
    let isValid = false
    let stepData = {}

    // Validate current step
    switch (currentStep) {
      case 1:
        isValid = await basicInfoForm.trigger()
        if (isValid) {
          stepData = basicInfoForm.getValues()
          setFormData({ ...formData, basicInfo: stepData })
        }
        break
      case 2:
        isValid = await financialForm.trigger()
        if (isValid) {
          stepData = financialForm.getValues()
          setFormData({ ...formData, financial: stepData })
        }
        break
      case 3:
        isValid = uploadedImages.length > 0
        if (!isValid) {
          toast.error('Please upload at least one image')
        } else {
          setFormData({ ...formData, images: uploadedImages })
        }
        break
      case 4:
        isValid = true // Documents are optional
        setFormData({ ...formData, documents: uploadedDocuments })
        break
      case 5:
        isValid = true // Will validate on submit
        break
      default:
        isValid = true
    }

    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    const completeData = {
      ...formData,
      status: 'draft',
      createdAt: new Date(),
    }
    
    onComplete?.(completeData)
    toast.success('Property saved successfully!')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      // In production, upload to S3/CDN
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setUploadedImages([...uploadedImages, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index))
  }

  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              {initialData ? 'Edit Property' : 'Add New Property'}
            </CardTitle>
            <Badge variant="outline">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <Progress value={progressPercentage} className="h-2" />
          
          {/* Step Indicators */}
          <div className="flex justify-between">
            {steps.map((step) => {
              const Icon = step.icon
              const isActive = step.number === currentStep
              const isCompleted = step.number < currentStep
              
              return (
                <div
                  key={step.number}
                  className={cn(
                    "flex flex-col items-center gap-2 cursor-pointer",
                    isActive && "opacity-100",
                    !isActive && !isCompleted && "opacity-50"
                  )}
                  onClick={() => {
                    if (isCompleted) {
                      setCurrentStep(step.number)
                    }
                  }}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    isActive && "bg-primary text-white",
                    isCompleted && "bg-green-500 text-white",
                    !isActive && !isCompleted && "bg-gray-200 text-gray-500"
                  )}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className={cn(
                    "text-xs text-center",
                    isActive && "font-medium text-primary",
                    !isActive && "text-gray-500"
                  )}>
                    {step.title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <Form {...basicInfoForm}>
                <form className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={basicInfoForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Sunset Villa" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={basicInfoForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="residential">Residential</SelectItem>
                              <SelectItem value="commercial">Commercial</SelectItem>
                              <SelectItem value="industrial">Industrial</SelectItem>
                              <SelectItem value="land">Land</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={basicInfoForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="123 Main Street" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={basicInfoForm.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="San Francisco" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={basicInfoForm.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="California" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={basicInfoForm.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="United States" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={basicInfoForm.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="94105" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={basicInfoForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Describe the property in detail..."
                            rows={6}
                          />
                        </FormControl>
                        <FormDescription>
                          Minimum 50 characters. Include key features and unique selling points.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            )}

            {/* Step 2: Financial Details */}
            {currentStep === 2 && (
              <Form {...financialForm}>
                <form className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={financialForm.control}
                      name="propertyValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Value ($)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              placeholder="1000000"
                              onChange={e => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={financialForm.control}
                      name="tokenPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Token Price ($)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              placeholder="100"
                              onChange={e => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={financialForm.control}
                      name="totalTokens"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Tokens</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              placeholder="10000"
                              onChange={e => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={financialForm.control}
                      name="minimumInvestment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Investment ($)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              placeholder="1000"
                              onChange={e => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={financialForm.control}
                      name="expectedROI"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expected ROI (%)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              placeholder="12"
                              onChange={e => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={financialForm.control}
                      name="annualYield"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Annual Yield (%)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              placeholder="8"
                              onChange={e => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={financialForm.control}
                    name="distributionFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Distribution Frequency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="annually">Annually</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            )}

            {/* Step 3: Images/Gallery */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label>Property Images</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Upload high-quality images of the property. First image will be the cover photo.
                  </p>
                </div>

                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF up to 10MB each
                    </p>
                  </label>
                </div>

                {/* Image Preview Grid */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={image} 
                            alt={`Property ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {index === 0 && (
                          <Badge className="absolute top-2 left-2 text-xs">
                            Cover
                          </Badge>
                        )}
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Documents */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label>Legal Documents</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Upload relevant legal documents and reports.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    'Property Deed',
                    'Insurance Policy',
                    'Inspection Report',
                    'Appraisal Report',
                    'Tax Records',
                    'Additional Documents'
                  ].map((docType) => (
                    <div key={docType} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{docType}</p>
                          <p className="text-sm text-gray-500">
                            {docType === 'Additional Documents' ? 'Optional' : 'Recommended'}
                          </p>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Tokenization Settings */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Configure how the property will be tokenized on the blockchain.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Token Symbol</Label>
                    <Input placeholder="PROP-001" className="mt-2" />
                  </div>
                  
                  <div>
                    <Label>Blockchain Network</Label>
                    <Select defaultValue="polygon">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ethereum">Ethereum</SelectItem>
                        <SelectItem value="polygon">Polygon</SelectItem>
                        <SelectItem value="arbitrum">Arbitrum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Distribution Method</Label>
                  <Select defaultValue="immediate">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate Distribution</SelectItem>
                      <SelectItem value="vesting">Vesting Schedule</SelectItem>
                      <SelectItem value="milestone">Milestone-Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Token Features</Label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Enable Transfer Restrictions</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Include Voting Rights</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Enable Automatic Distributions</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Review & Publish */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Review your property listing before publishing.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Basic Information</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Name: {formData.basicInfo?.name || 'Not set'}</p>
                      <p>Type: {formData.basicInfo?.type || 'Not set'}</p>
                      <p>Location: {formData.basicInfo?.city}, {formData.basicInfo?.state}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Financial Details</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Property Value: ${formData.financial?.propertyValue?.toLocaleString() || '0'}</p>
                      <p>Token Price: ${formData.financial?.tokenPrice || '0'}</p>
                      <p>Total Tokens: {formData.financial?.totalTokens?.toLocaleString() || '0'}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Media & Documents</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Images uploaded: {uploadedImages.length}</p>
                      <p>Documents uploaded: {uploadedDocuments.length}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleSubmit()}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      handleSubmit()
                      toast.success('Property published successfully!')
                    }}
                  >
                    Publish Property
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePreviousStep}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <Button
            variant="ghost"
            onClick={onCancel}
          >
            Cancel
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={handleNextStep}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}