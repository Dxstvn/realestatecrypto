/**
 * Transaction Wizard Component - PropertyChain
 * 
 * Multi-step transaction wizard for property transactions
 * Following UpdatedUIPlan.md Step 45 specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  FileText,
  Users,
  DollarSign,
  FileSearch,
  CreditCard,
  Code,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Save,
  Clock,
  AlertTriangle,
  Info,
  Upload,
  Download,
  Eye,
  Edit,
  Trash,
  Plus,
  Calendar,
  MapPin,
  Building,
  User,
  Phone,
  Mail,
  Globe,
  Shield,
  Lock,
  Zap,
  RefreshCw,
  History,
  Activity,
  TrendingUp,
  PieChart,
  BarChart,
  Hash,
  Key,
  FileSignature,
  Briefcase,
  Home,
  Calculator,
  Receipt,
  Wallet,
  ArrowRight,
  ArrowUpRight,
  Check,
  X,
  Loader2,
  Copy,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useToast } from '@/hooks/use-toast'
import { PaymentProcessor } from './payment-processor'
import { EscrowDashboard } from './escrow-dashboard'
import { PaymentSchedule } from './payment-schedule'

// Transaction step definitions
const TRANSACTION_STEPS = [
  {
    id: 'offer',
    title: 'Offer Terms',
    description: 'Define purchase price and conditions',
    icon: FileText,
  },
  {
    id: 'parties',
    title: 'Parties',
    description: 'Identify buyer, seller, and agents',
    icon: Users,
  },
  {
    id: 'documentation',
    title: 'Documentation',
    description: 'Upload and verify required documents',
    icon: FileSearch,
  },
  {
    id: 'diligence',
    title: 'Due Diligence',
    description: 'Inspection and verification period',
    icon: Shield,
  },
  {
    id: 'financing',
    title: 'Financing',
    description: 'Payment method and schedule',
    icon: CreditCard,
  },
  {
    id: 'contract',
    title: 'Smart Contract',
    description: 'Deploy blockchain terms',
    icon: Code,
  },
  {
    id: 'closing',
    title: 'Closing',
    description: 'Final signatures and transfer',
    icon: CheckCircle,
  },
]

// Types
interface TransactionData {
  offer: {
    price: number
    earnestMoney: number
    closingDate: string
    contingencies: string[]
    specialTerms: string
  }
  parties: {
    buyer: {
      name: string
      email: string
      phone: string
      address: string
    }
    seller: {
      name: string
      email: string
      phone: string
      address: string
    }
    agents: {
      buyerAgent?: {
        name: string
        license: string
        commission: number
      }
      sellerAgent?: {
        name: string
        license: string
        commission: number
      }
    }
  }
  documents: {
    uploaded: Array<{
      id: string
      name: string
      type: string
      size: number
      uploadDate: string
      status: 'pending' | 'verified' | 'rejected'
    }>
    required: string[]
  }
  diligence: {
    inspectionPeriod: number
    inspectionContingency: boolean
    appraisalContingency: boolean
    financingContingency: boolean
    titleContingency: boolean
    inspectionResults?: string
    appraisalValue?: number
  }
  financing: {
    method: 'cash' | 'mortgage' | 'crypto' | 'seller_financing'
    downPayment?: number
    loanAmount?: number
    interestRate?: number
    loanTerm?: number
    cryptoCurrency?: string
    escrowAccount?: string
  }
  smartContract: {
    deployed: boolean
    contractAddress?: string
    blockNumber?: number
    gasUsed?: number
    multisigAddress?: string
    oracleIntegration?: boolean
  }
  closing: {
    finalWalkthrough: boolean
    fundsTransferred: boolean
    documentsSignedBuyer: boolean
    documentsSignedSeller: boolean
    keysTransferred: boolean
    recordedWithCounty: boolean
  }
}

interface TransactionWizardProps {
  propertyId: string
  propertyTitle: string
  propertyAddress: string
  listPrice: number
  onComplete?: (data: TransactionData) => void
  onSaveDraft?: (data: Partial<TransactionData>) => void
  initialData?: Partial<TransactionData>
  mode?: 'create' | 'edit' | 'view'
}

export function TransactionWizard({
  propertyId,
  propertyTitle,
  propertyAddress,
  listPrice,
  onComplete,
  onSaveDraft,
  initialData,
  mode = 'create',
}: TransactionWizardProps) {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [transactionData, setTransactionData] = useState<Partial<TransactionData>>(
    initialData || {}
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Auto-save functionality
  useEffect(() => {
    if (mode === 'view') return

    const autoSaveInterval = setInterval(() => {
      handleSaveDraft()
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [transactionData])

  // Save draft
  const handleSaveDraft = useCallback(async () => {
    if (!onSaveDraft) return

    setIsSaving(true)
    try {
      await onSaveDraft(transactionData)
      setLastSaved(new Date())
      toast({
        title: 'Draft saved',
        description: 'Your progress has been saved',
      })
    } catch (error) {
      toast({
        title: 'Save failed',
        description: 'Could not save draft. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }, [transactionData, onSaveDraft, toast])

  // Validate current step
  const validateStep = (stepIndex: number): boolean => {
    const step = TRANSACTION_STEPS[stepIndex]
    const newErrors: Record<string, string> = {}

    switch (step.id) {
      case 'offer':
        if (!transactionData.offer?.price) {
          newErrors.price = 'Offer price is required'
        }
        if (!transactionData.offer?.closingDate) {
          newErrors.closingDate = 'Closing date is required'
        }
        break
      case 'parties':
        if (!transactionData.parties?.buyer?.name) {
          newErrors.buyerName = 'Buyer name is required'
        }
        if (!transactionData.parties?.seller?.name) {
          newErrors.sellerName = 'Seller name is required'
        }
        break
      // Add more validation for other steps
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Navigate to next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < TRANSACTION_STEPS.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        handleComplete()
      }
    }
  }

  // Navigate to previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Complete transaction
  const handleComplete = async () => {
    if (!onComplete) return

    try {
      await onComplete(transactionData as TransactionData)
      toast({
        title: 'Transaction completed',
        description: 'The transaction has been successfully processed',
      })
    } catch (error) {
      toast({
        title: 'Transaction failed',
        description: 'Could not complete transaction. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Update transaction data
  const updateData = (stepId: string, data: any) => {
    setTransactionData(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId as keyof TransactionData],
        ...data,
      },
    }))
  }

  // Render step content
  const renderStepContent = () => {
    const step = TRANSACTION_STEPS[currentStep]

    switch (step.id) {
      case 'offer':
        return <OfferTermsStep data={transactionData.offer} onChange={(data) => updateData('offer', data)} errors={errors} />
      case 'parties':
        return <PartiesStep data={transactionData.parties} onChange={(data) => updateData('parties', data)} errors={errors} />
      case 'documentation':
        return <DocumentationStep data={transactionData.documents} onChange={(data) => updateData('documents', data)} />
      case 'diligence':
        return <DueDiligenceStep data={transactionData.diligence} onChange={(data) => updateData('diligence', data)} />
      case 'financing':
        return <FinancingStep data={transactionData.financing} onChange={(data) => updateData('financing', data)} listPrice={listPrice} />
      case 'contract':
        return <SmartContractStep data={transactionData.smartContract} onChange={(data) => updateData('smartContract', data)} />
      case 'closing':
        return <ClosingStep data={transactionData.closing} onChange={(data) => updateData('closing', data)} />
      default:
        return null
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Property Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{propertyTitle}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2">
                <MapPin className="h-4 w-4" />
                {propertyAddress}
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">List Price</p>
              <p className="text-2xl font-bold">${listPrice.toLocaleString()}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Transaction Progress</h3>
          {lastSaved && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Last saved {lastSaved.toLocaleTimeString()}
            </p>
          )}
        </div>
        <Progress value={((currentStep + 1) / TRANSACTION_STEPS.length) * 100} className="h-2" />
        
        {/* Step indicators */}
        <div className="flex justify-between mt-4">
          {TRANSACTION_STEPS.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isComplete = index < currentStep
            
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                disabled={mode === 'view' || index > currentStep}
                className={cn(
                  "flex flex-col items-center gap-2 p-2 rounded-lg transition-all",
                  isActive && "bg-primary/10",
                  isComplete && "text-primary",
                  !isActive && !isComplete && "text-muted-foreground",
                  index <= currentStep && mode !== 'view' && "hover:bg-muted cursor-pointer"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                  isActive && "bg-primary text-primary-foreground",
                  isComplete && "bg-primary/20 text-primary",
                  !isActive && !isComplete && "bg-muted"
                )}>
                  {isComplete ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span className="text-xs font-medium hidden md:block">{step.title}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            {React.createElement(TRANSACTION_STEPS[currentStep].icon, { className: "h-5 w-5 text-primary" })}
            <div>
              <CardTitle>{TRANSACTION_STEPS[currentStep].title}</CardTitle>
              <CardDescription>{TRANSACTION_STEPS[currentStep].description}</CardDescription>
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
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {mode !== 'view' && (
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Draft
            </Button>
          )}

          <Button
            onClick={handleNext}
            disabled={mode === 'view' && currentStep === TRANSACTION_STEPS.length - 1}
          >
            {currentStep === TRANSACTION_STEPS.length - 1 ? (
              <>
                Complete Transaction
                <Check className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Would you like to save them before leaving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Don't Save</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveDraft}>Save Draft</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Step Components
function OfferTermsStep({ 
  data, 
  onChange, 
  errors 
}: { 
  data: any
  onChange: (data: any) => void
  errors: Record<string, string>
}) {
  const contingencyOptions = [
    'Inspection Contingency',
    'Appraisal Contingency',
    'Financing Contingency',
    'Sale of Current Home',
    'Title Contingency',
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="price">Offer Price *</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="price"
              type="number"
              placeholder="0"
              value={data?.price || ''}
              onChange={(e) => onChange({ price: parseInt(e.target.value) })}
              className={cn("pl-10", errors.price && "border-red-500")}
            />
          </div>
          {errors.price && (
            <p className="text-sm text-red-500">{errors.price}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="earnestMoney">Earnest Money</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="earnestMoney"
              type="number"
              placeholder="0"
              value={data?.earnestMoney || ''}
              onChange={(e) => onChange({ earnestMoney: parseInt(e.target.value) })}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="closingDate">Proposed Closing Date *</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="closingDate"
              type="date"
              value={data?.closingDate || ''}
              onChange={(e) => onChange({ closingDate: e.target.value })}
              className={cn("pl-10", errors.closingDate && "border-red-500")}
            />
          </div>
          {errors.closingDate && (
            <p className="text-sm text-red-500">{errors.closingDate}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Contingencies</Label>
        <div className="space-y-3">
          {contingencyOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={option}
                checked={data?.contingencies?.includes(option) || false}
                onCheckedChange={(checked) => {
                  const contingencies = data?.contingencies || []
                  if (checked) {
                    onChange({ contingencies: [...contingencies, option] })
                  } else {
                    onChange({ contingencies: contingencies.filter((c: string) => c !== option) })
                  }
                }}
              />
              <Label htmlFor={option} className="font-normal cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialTerms">Special Terms & Conditions</Label>
        <Textarea
          id="specialTerms"
          placeholder="Enter any special terms or conditions..."
          value={data?.specialTerms || ''}
          onChange={(e) => onChange({ specialTerms: e.target.value })}
          rows={4}
        />
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          All offers are subject to seller acceptance. Contingencies protect your interests during the transaction.
        </AlertDescription>
      </Alert>
    </div>
  )
}

function PartiesStep({ 
  data, 
  onChange, 
  errors 
}: { 
  data: any
  onChange: (data: any) => void
  errors: Record<string, string>
}) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="buyer" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="buyer">Buyer</TabsTrigger>
          <TabsTrigger value="seller">Seller</TabsTrigger>
          <TabsTrigger value="buyer-agent">Buyer's Agent</TabsTrigger>
          <TabsTrigger value="seller-agent">Seller's Agent</TabsTrigger>
        </TabsList>

        <TabsContent value="buyer" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buyerName">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="buyerName"
                  placeholder="John Doe"
                  value={data?.buyer?.name || ''}
                  onChange={(e) => onChange({ 
                    buyer: { ...data?.buyer, name: e.target.value }
                  })}
                  className={cn("pl-10", errors.buyerName && "border-red-500")}
                />
              </div>
              {errors.buyerName && (
                <p className="text-sm text-red-500">{errors.buyerName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyerEmail">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="buyerEmail"
                  type="email"
                  placeholder="john@example.com"
                  value={data?.buyer?.email || ''}
                  onChange={(e) => onChange({ 
                    buyer: { ...data?.buyer, email: e.target.value }
                  })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyerPhone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="buyerPhone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={data?.buyer?.phone || ''}
                  onChange={(e) => onChange({ 
                    buyer: { ...data?.buyer, phone: e.target.value }
                  })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyerAddress">Address</Label>
              <div className="relative">
                <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="buyerAddress"
                  placeholder="123 Main St, City, State"
                  value={data?.buyer?.address || ''}
                  onChange={(e) => onChange({ 
                    buyer: { ...data?.buyer, address: e.target.value }
                  })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="seller" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sellerName">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="sellerName"
                  placeholder="Jane Smith"
                  value={data?.seller?.name || ''}
                  onChange={(e) => onChange({ 
                    seller: { ...data?.seller, name: e.target.value }
                  })}
                  className={cn("pl-10", errors.sellerName && "border-red-500")}
                />
              </div>
              {errors.sellerName && (
                <p className="text-sm text-red-500">{errors.sellerName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellerEmail">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="sellerEmail"
                  type="email"
                  placeholder="jane@example.com"
                  value={data?.seller?.email || ''}
                  onChange={(e) => onChange({ 
                    seller: { ...data?.seller, email: e.target.value }
                  })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellerPhone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="sellerPhone"
                  type="tel"
                  placeholder="(555) 987-6543"
                  value={data?.seller?.phone || ''}
                  onChange={(e) => onChange({ 
                    seller: { ...data?.seller, phone: e.target.value }
                  })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellerAddress">Address</Label>
              <div className="relative">
                <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="sellerAddress"
                  placeholder="456 Oak Ave, City, State"
                  value={data?.seller?.address || ''}
                  onChange={(e) => onChange({ 
                    seller: { ...data?.seller, address: e.target.value }
                  })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="buyer-agent" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buyerAgentName">Agent Name</Label>
              <Input
                id="buyerAgentName"
                placeholder="Agent name"
                value={data?.agents?.buyerAgent?.name || ''}
                onChange={(e) => onChange({ 
                  agents: { 
                    ...data?.agents, 
                    buyerAgent: { ...data?.agents?.buyerAgent, name: e.target.value }
                  }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyerAgentLicense">License Number</Label>
              <Input
                id="buyerAgentLicense"
                placeholder="RE123456"
                value={data?.agents?.buyerAgent?.license || ''}
                onChange={(e) => onChange({ 
                  agents: { 
                    ...data?.agents, 
                    buyerAgent: { ...data?.agents?.buyerAgent, license: e.target.value }
                  }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyerAgentCommission">Commission (%)</Label>
              <Input
                id="buyerAgentCommission"
                type="number"
                step="0.1"
                placeholder="2.5"
                value={data?.agents?.buyerAgent?.commission || ''}
                onChange={(e) => onChange({ 
                  agents: { 
                    ...data?.agents, 
                    buyerAgent: { ...data?.agents?.buyerAgent, commission: parseFloat(e.target.value) }
                  }
                })}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="seller-agent" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sellerAgentName">Agent Name</Label>
              <Input
                id="sellerAgentName"
                placeholder="Agent name"
                value={data?.agents?.sellerAgent?.name || ''}
                onChange={(e) => onChange({ 
                  agents: { 
                    ...data?.agents, 
                    sellerAgent: { ...data?.agents?.sellerAgent, name: e.target.value }
                  }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellerAgentLicense">License Number</Label>
              <Input
                id="sellerAgentLicense"
                placeholder="RE654321"
                value={data?.agents?.sellerAgent?.license || ''}
                onChange={(e) => onChange({ 
                  agents: { 
                    ...data?.agents, 
                    sellerAgent: { ...data?.agents?.sellerAgent, license: e.target.value }
                  }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellerAgentCommission">Commission (%)</Label>
              <Input
                id="sellerAgentCommission"
                type="number"
                step="0.1"
                placeholder="2.5"
                value={data?.agents?.sellerAgent?.commission || ''}
                onChange={(e) => onChange({ 
                  agents: { 
                    ...data?.agents, 
                    sellerAgent: { ...data?.agents?.sellerAgent, commission: parseFloat(e.target.value) }
                  }
                })}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DocumentationStep({ 
  data, 
  onChange 
}: { 
  data: any
  onChange: (data: any) => void
}) {
  const requiredDocuments = [
    'Purchase Agreement',
    'Property Disclosure',
    'Title Report',
    'Inspection Report',
    'Appraisal Report',
    'Proof of Funds',
    'Insurance Documents',
    'HOA Documents',
  ]

  const handleFileUpload = (files: FileList) => {
    const uploaded = data?.uploaded || []
    const newFiles = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date().toISOString(),
      status: 'pending' as const,
    }))
    
    onChange({ uploaded: [...uploaded, ...newFiles] })
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
        <div className="text-center">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Upload Documents</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop files here, or click to browse
          </p>
          <Input
            type="file"
            multiple
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="hidden"
            id="file-upload"
          />
          <Label htmlFor="file-upload">
            <Button variant="outline" asChild>
              <span>
                <Plus className="h-4 w-4 mr-2" />
                Select Files
              </span>
            </Button>
          </Label>
        </div>
      </div>

      {/* Required Documents Checklist */}
      <div>
        <h3 className="font-medium mb-4">Required Documents</h3>
        <div className="space-y-2">
          {requiredDocuments.map((doc) => {
            const isUploaded = data?.uploaded?.some((file: any) => 
              file.name.toLowerCase().includes(doc.toLowerCase())
            )
            
            return (
              <div key={doc} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  {isUploaded ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className={cn(
                    "font-medium",
                    isUploaded && "text-green-600"
                  )}>
                    {doc}
                  </span>
                </div>
                {isUploaded && (
                  <Badge variant="outline" className="text-green-600">
                    Uploaded
                  </Badge>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Uploaded Files */}
      {data?.uploaded?.length > 0 && (
        <div>
          <h3 className="font-medium mb-4">Uploaded Files</h3>
          <div className="space-y-2">
            {data.uploaded.map((file: any) => (
              <div key={file.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • Uploaded {new Date(file.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    file.status === 'verified' ? 'default' :
                    file.status === 'rejected' ? 'destructive' :
                    'secondary'
                  }>
                    {file.status}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function DueDiligenceStep({ 
  data, 
  onChange 
}: { 
  data: any
  onChange: (data: any) => void
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="inspectionPeriod">Inspection Period (days)</Label>
          <Input
            id="inspectionPeriod"
            type="number"
            placeholder="10"
            value={data?.inspectionPeriod || ''}
            onChange={(e) => onChange({ inspectionPeriod: parseInt(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="appraisalValue">Appraisal Value</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="appraisalValue"
              type="number"
              placeholder="0"
              value={data?.appraisalValue || ''}
              onChange={(e) => onChange({ appraisalValue: parseInt(e.target.value) })}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Contingencies</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <Label htmlFor="inspectionContingency" className="font-normal cursor-pointer">
              Inspection Contingency
            </Label>
            <Checkbox
              id="inspectionContingency"
              checked={data?.inspectionContingency || false}
              onCheckedChange={(checked) => onChange({ inspectionContingency: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <Label htmlFor="appraisalContingency" className="font-normal cursor-pointer">
              Appraisal Contingency
            </Label>
            <Checkbox
              id="appraisalContingency"
              checked={data?.appraisalContingency || false}
              onCheckedChange={(checked) => onChange({ appraisalContingency: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <Label htmlFor="financingContingency" className="font-normal cursor-pointer">
              Financing Contingency
            </Label>
            <Checkbox
              id="financingContingency"
              checked={data?.financingContingency || false}
              onCheckedChange={(checked) => onChange({ financingContingency: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <Label htmlFor="titleContingency" className="font-normal cursor-pointer">
              Title Contingency
            </Label>
            <Checkbox
              id="titleContingency"
              checked={data?.titleContingency || false}
              onCheckedChange={(checked) => onChange({ titleContingency: checked })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="inspectionResults">Inspection Results & Notes</Label>
        <Textarea
          id="inspectionResults"
          placeholder="Enter inspection findings and any concerns..."
          value={data?.inspectionResults || ''}
          onChange={(e) => onChange({ inspectionResults: e.target.value })}
          rows={4}
        />
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Due diligence protects your investment. Ensure all inspections and verifications are completed within the specified period.
        </AlertDescription>
      </Alert>
    </div>
  )
}

function FinancingStep({ 
  data, 
  onChange,
  listPrice 
}: { 
  data: any
  onChange: (data: any) => void
  listPrice: number
}) {
  const [showPaymentProcessor, setShowPaymentProcessor] = useState(false)
  const [showEscrowDashboard, setShowEscrowDashboard] = useState(false)
  const [showPaymentSchedule, setShowPaymentSchedule] = useState(false)

  const paymentMethods = [
    { value: 'cash', label: 'Cash', icon: DollarSign },
    { value: 'mortgage', label: 'Mortgage', icon: Building },
    { value: 'crypto', label: 'Cryptocurrency', icon: Wallet },
    { value: 'seller_financing', label: 'Seller Financing', icon: Receipt },
  ]

  const handlePaymentSuccess = (paymentData: any) => {
    onChange({ 
      ...data, 
      paymentProcessed: true,
      paymentData 
    })
    setShowPaymentProcessor(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <Label>Payment Method</Label>
        <RadioGroup
          value={data?.method || 'cash'}
          onValueChange={(value) => onChange({ method: value })}
          className="grid grid-cols-2 gap-4 mt-2"
        >
          {paymentMethods.map((method) => {
            const Icon = method.icon
            return (
              <div key={method.value}>
                <RadioGroupItem
                  value={method.value}
                  id={method.value}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={method.value}
                  className="flex items-center gap-3 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <Icon className="h-5 w-5" />
                  {method.label}
                </Label>
              </div>
            )
          })}
        </RadioGroup>
      </div>

      {data?.method === 'mortgage' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="downPayment">Down Payment</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="downPayment"
                type="number"
                placeholder="0"
                value={data?.downPayment || ''}
                onChange={(e) => onChange({ downPayment: parseInt(e.target.value) })}
                className="pl-10"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {data?.downPayment && listPrice ? 
                `${((data.downPayment / listPrice) * 100).toFixed(1)}% of list price` : 
                'Enter down payment amount'
              }
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="loanAmount">Loan Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="loanAmount"
                type="number"
                placeholder="0"
                value={data?.loanAmount || ''}
                onChange={(e) => onChange({ loanAmount: parseInt(e.target.value) })}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interestRate">Interest Rate (%)</Label>
            <Input
              id="interestRate"
              type="number"
              step="0.01"
              placeholder="5.5"
              value={data?.interestRate || ''}
              onChange={(e) => onChange({ interestRate: parseFloat(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loanTerm">Loan Term (years)</Label>
            <Select
              value={data?.loanTerm?.toString() || ''}
              onValueChange={(value) => onChange({ loanTerm: parseInt(value) })}
            >
              <SelectTrigger id="loanTerm">
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 years</SelectItem>
                <SelectItem value="20">20 years</SelectItem>
                <SelectItem value="30">30 years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {data?.method === 'crypto' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cryptoCurrency">Cryptocurrency</Label>
            <Select
              value={data?.cryptoCurrency || ''}
              onValueChange={(value) => onChange({ cryptoCurrency: value })}
            >
              <SelectTrigger id="cryptoCurrency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
                <SelectItem value="DAI">DAI</SelectItem>
                <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="escrowAccount">Escrow Wallet Address</Label>
            <div className="relative">
              <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="escrowAccount"
                placeholder="0x..."
                value={data?.escrowAccount || ''}
                onChange={(e) => onChange({ escrowAccount: e.target.value })}
                className="pl-10 font-mono text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">List Price</span>
              <span className="font-medium">${listPrice.toLocaleString()}</span>
            </div>
            {data?.downPayment && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Down Payment</span>
                <span className="font-medium">${data.downPayment.toLocaleString()}</span>
              </div>
            )}
            {data?.loanAmount && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loan Amount</span>
                <span className="font-medium">${data.loanAmount.toLocaleString()}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${listPrice.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowPaymentProcessor(true)}
            className="flex-1"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Process Payment
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowEscrowDashboard(true)}
            className="flex-1"
          >
            <Shield className="h-4 w-4 mr-2" />
            Escrow Details
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowPaymentSchedule(true)}
            className="flex-1"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Payment Schedule
          </Button>
        </CardFooter>
      </Card>

      {/* Payment Processor Modal */}
      {showPaymentProcessor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Payment Processing</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowPaymentProcessor(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <PaymentProcessor
                amount={data?.downPayment || listPrice}
                propertyId="prop-001"
                propertyTitle="Property Transaction"
                transactionType="deposit"
                onSuccess={handlePaymentSuccess}
                onCancel={() => setShowPaymentProcessor(false)}
                scheduleOptions={{
                  enabled: data?.method === 'mortgage',
                  minDownPayment: listPrice * 0.1,
                  maxInstallments: 360,
                  interestRate: data?.interestRate || 5.5,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Escrow Dashboard Modal */}
      {showEscrowDashboard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Escrow Management</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowEscrowDashboard(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <EscrowDashboard />
            </div>
          </div>
        </div>
      )}

      {/* Payment Schedule Modal */}
      {showPaymentSchedule && data?.method === 'mortgage' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Payment Schedule</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowPaymentSchedule(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <PaymentSchedule />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SmartContractStep({ 
  data, 
  onChange 
}: { 
  data: any
  onChange: (data: any) => void
}) {
  const [isDeploying, setIsDeploying] = useState(false)

  const handleDeploy = async () => {
    setIsDeploying(true)
    // Simulate deployment
    setTimeout(() => {
      onChange({
        deployed: true,
        contractAddress: '0x' + Math.random().toString(36).substr(2, 40),
        blockNumber: Math.floor(Math.random() * 1000000),
        gasUsed: Math.floor(Math.random() * 500000),
      })
      setIsDeploying(false)
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {!data?.deployed ? (
        <>
          <Alert>
            <Code className="h-4 w-4" />
            <AlertDescription>
              Smart contracts automate the transaction process and ensure transparency. Deploy the contract to proceed with blockchain-based settlement.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Contract Configuration</CardTitle>
              <CardDescription>
                Configure the smart contract parameters before deployment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Multi-signature Wallet</p>
                    <p className="text-sm text-muted-foreground">Require multiple parties to approve transactions</p>
                  </div>
                </div>
                <Checkbox
                  checked={data?.multisigRequired || false}
                  onCheckedChange={(checked) => onChange({ multisigRequired: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Oracle Integration</p>
                    <p className="text-sm text-muted-foreground">Connect to external data sources for verification</p>
                  </div>
                </div>
                <Checkbox
                  checked={data?.oracleIntegration || false}
                  onCheckedChange={(checked) => onChange({ oracleIntegration: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Escrow Automation</p>
                    <p className="text-sm text-muted-foreground">Automatically release funds on conditions</p>
                  </div>
                </div>
                <Checkbox
                  checked={true}
                  disabled
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleDeploy}
              disabled={isDeploying}
              className="min-w-[200px]"
            >
              {isDeploying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Deploy Contract
                </>
              )}
            </Button>
          </div>
        </>
      ) : (
        <>
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Smart contract successfully deployed to the blockchain!
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Contract Details</CardTitle>
              <CardDescription>
                Your transaction is now secured on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Contract Address</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {data.contractAddress?.slice(0, 10)}...{data.contractAddress?.slice(-8)}
                    </code>
                    <Button variant="ghost" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Block Number</p>
                  <p className="font-medium">#{data.blockNumber}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Gas Used</p>
                  <p className="font-medium">{data.gasUsed?.toLocaleString()} wei</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                </div>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View on Explorer
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download ABI
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

function ClosingStep({ 
  data, 
  onChange 
}: { 
  data: any
  onChange: (data: any) => void
}) {
  const closingChecklist = [
    { id: 'finalWalkthrough', label: 'Final Walkthrough Completed' },
    { id: 'fundsTransferred', label: 'Funds Transferred to Escrow' },
    { id: 'documentsSignedBuyer', label: 'Documents Signed by Buyer' },
    { id: 'documentsSignedSeller', label: 'Documents Signed by Seller' },
    { id: 'keysTransferred', label: 'Keys Transferred to Buyer' },
    { id: 'recordedWithCounty', label: 'Recorded with County' },
  ]

  const allCompleted = closingChecklist.every(item => data?.[item.id])

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Complete all closing requirements to finalize the transaction. Each party must sign the necessary documents.
        </AlertDescription>
      </Alert>

      <div className="space-y-3">
        <h3 className="font-medium mb-4">Closing Checklist</h3>
        {closingChecklist.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border">
            <Label htmlFor={item.id} className="font-normal cursor-pointer flex-1">
              {item.label}
            </Label>
            <Checkbox
              id={item.id}
              checked={data?.[item.id] || false}
              onCheckedChange={(checked) => onChange({ [item.id]: checked })}
            />
          </div>
        ))}
      </div>

      {allCompleted && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            All closing requirements have been met! The transaction is ready to be completed.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Digital Signatures</CardTitle>
          <CardDescription>
            All parties must sign to complete the transaction
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium">Buyer Signature</p>
                {data?.documentsSignedBuyer ? (
                  <Badge className="bg-green-100 text-green-800">Signed</Badge>
                ) : (
                  <Badge variant="secondary">Pending</Badge>
                )}
              </div>
              <Button 
                className="w-full" 
                variant={data?.documentsSignedBuyer ? "outline" : "default"}
                disabled={data?.documentsSignedBuyer}
              >
                <FileSignature className="h-4 w-4 mr-2" />
                {data?.documentsSignedBuyer ? 'View Signature' : 'Sign Documents'}
              </Button>
            </div>

            <div className="p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium">Seller Signature</p>
                {data?.documentsSignedSeller ? (
                  <Badge className="bg-green-100 text-green-800">Signed</Badge>
                ) : (
                  <Badge variant="secondary">Pending</Badge>
                )}
              </div>
              <Button 
                className="w-full" 
                variant={data?.documentsSignedSeller ? "outline" : "default"}
                disabled={data?.documentsSignedSeller}
              >
                <FileSignature className="h-4 w-4 mr-2" />
                {data?.documentsSignedSeller ? 'View Signature' : 'Sign Documents'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ready to Close!</h3>
            <p className="text-muted-foreground mb-4">
              Once all items are completed and signed, the transaction will be finalized.
            </p>
            <Button size="lg" disabled={!allCompleted}>
              Complete Transaction
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper component for step completion
function Circle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}