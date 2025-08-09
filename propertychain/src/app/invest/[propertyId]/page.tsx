/**
 * Investment Transaction Flow - PropertyChain
 * 
 * Core investment process following RECOVERY_PLAN.md Step 2.3
 * Multi-step wizard for property investment with Web3 integration
 */

'use client'

import * as React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DollarSign,
  CreditCard,
  Wallet,
  Building,
  FileText,
  Shield,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowRight,
  ArrowLeft,
  Clock,
  TrendingUp,
  Lock,
  ExternalLink,
  Copy,
  Download,
  Zap,
  Timer,
  Calculator,
  PieChart,
  BarChart3,
  Activity,
  Banknote,
  Coins,
  Receipt,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/format'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

interface InvestmentData {
  // Investment Details
  propertyId: string
  investmentAmount: number
  tokenAmount: number
  tokenPrice: number
  
  // Payment Method
  paymentMethod: 'crypto' | 'wire' | 'ach' | 'credit'
  walletAddress?: string
  bankAccount?: string
  
  // Investment Terms
  investmentType: 'standard' | 'accredited' | 'institutional'
  holdingPeriod: number // in months
  autoReinvest: boolean
  
  // Legal Agreements
  termsAccepted: boolean
  riskDisclosureAccepted: boolean
  subscriptionAgreementAccepted: boolean
  
  // Transaction Details
  transactionHash?: string
  contractAddress?: string
  gasFee?: number
  platformFee: number
  totalAmount: number
}

interface PropertyData {
  id: string
  name: string
  address: string
  price: number
  tokenPrice: number
  availableTokens: number
  minInvestment: number
  maxInvestment: number
  expectedROI: number
  fundingDeadline: Date
  fundingProgress: number
  image: string
}

interface StepConfig {
  id: string
  title: string
  description: string
  icon: React.ElementType
}

interface TransactionStatus {
  stage: 'pending' | 'processing' | 'confirming' | 'completed' | 'failed'
  message: string
  txHash?: string
  blockNumber?: number
  timestamp?: Date
}

// ============================================================================
// Investment Transaction Component
// ============================================================================

export default function InvestmentTransactionPage() {
  const router = useRouter()
  const params = useParams()
  const propertyId = params.propertyId as string
  
  const [currentStep, setCurrentStep] = React.useState(0)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [transactionStatus, setTransactionStatus] = React.useState<TransactionStatus | null>(null)
  const [showConfirmation, setShowConfirmation] = React.useState(false)
  
  // Mock property data (in production, fetch from API)
  const property: PropertyData = {
    id: propertyId,
    name: 'Luxury Downtown Apartment Complex',
    address: '123 Main Street, New York, NY 10001',
    price: 5000000,
    tokenPrice: 100,
    availableTokens: 25000,
    minInvestment: 100,
    maxInvestment: 100000,
    expectedROI: 12.5,
    fundingDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    fundingProgress: 68,
    image: 'https://images.unsplash.com/photo-1545324419-cc1a3fa10c00?w=800&h=600&fit=crop',
  }
  
  // Investment data state
  const [investmentData, setInvestmentData] = React.useState<InvestmentData>({
    propertyId: propertyId,
    investmentAmount: 1000,
    tokenAmount: 10,
    tokenPrice: property.tokenPrice,
    paymentMethod: 'crypto',
    investmentType: 'standard',
    holdingPeriod: 60,
    autoReinvest: true,
    termsAccepted: false,
    riskDisclosureAccepted: false,
    subscriptionAgreementAccepted: false,
    platformFee: 0,
    totalAmount: 1000,
  })
  
  // Calculate fees and totals
  React.useEffect(() => {
    const platformFee = investmentData.investmentAmount * 0.02 // 2% platform fee
    const totalAmount = investmentData.investmentAmount + platformFee
    const tokenAmount = Math.floor(investmentData.investmentAmount / property.tokenPrice)
    
    setInvestmentData(prev => ({
      ...prev,
      platformFee,
      totalAmount,
      tokenAmount,
    }))
  }, [investmentData.investmentAmount, property.tokenPrice])
  
  // Step configuration
  const steps: StepConfig[] = [
    {
      id: 'amount',
      title: 'Investment Amount',
      description: 'Choose how much you want to invest',
      icon: DollarSign,
    },
    {
      id: 'payment',
      title: 'Payment Method',
      description: 'Select your payment method',
      icon: CreditCard,
    },
    {
      id: 'terms',
      title: 'Investment Terms',
      description: 'Review and accept terms',
      icon: FileText,
    },
    {
      id: 'review',
      title: 'Review & Confirm',
      description: 'Final review before investment',
      icon: Shield,
    },
  ]
  
  const currentStepConfig = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100
  
  // Validate current step
  const validateStep = (): boolean => {
    switch (currentStep) {
      case 0: // Amount
        if (investmentData.investmentAmount < property.minInvestment) {
          toast.error(`Minimum investment is ${formatCurrency(property.minInvestment)}`)
          return false
        }
        if (investmentData.investmentAmount > property.maxInvestment) {
          toast.error(`Maximum investment is ${formatCurrency(property.maxInvestment)}`)
          return false
        }
        if (investmentData.tokenAmount > property.availableTokens) {
          toast.error('Not enough tokens available')
          return false
        }
        return true
        
      case 1: // Payment
        if (investmentData.paymentMethod === 'crypto' && !investmentData.walletAddress) {
          toast.error('Please connect your wallet')
          return false
        }
        return true
        
      case 2: // Terms
        if (!investmentData.termsAccepted || !investmentData.riskDisclosureAccepted || !investmentData.subscriptionAgreementAccepted) {
          toast.error('Please accept all agreements')
          return false
        }
        return true
        
      case 3: // Review
        return true
        
      default:
        return true
    }
  }
  
  // Handle next step
  const handleNext = () => {
    if (!validateStep()) return
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowConfirmation(true)
    }
  }
  
  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  // Process transaction
  const processTransaction = async () => {
    setIsProcessing(true)
    setShowConfirmation(false)
    
    try {
      // Stage 1: Initialize
      setTransactionStatus({
        stage: 'pending',
        message: 'Initializing transaction...',
      })
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Stage 2: Processing payment
      setTransactionStatus({
        stage: 'processing',
        message: 'Processing payment...',
      })
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Stage 3: Blockchain confirmation
      const mockTxHash = '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      setTransactionStatus({
        stage: 'confirming',
        message: 'Confirming on blockchain...',
        txHash: mockTxHash,
      })
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Stage 4: Complete
      setTransactionStatus({
        stage: 'completed',
        message: 'Investment successful!',
        txHash: mockTxHash,
        blockNumber: Math.floor(Math.random() * 1000000),
        timestamp: new Date(),
      })
      
      toast.success('Investment completed successfully!')
      
      // Generate certificate after delay
      setTimeout(() => {
        generateCertificate()
      }, 2000)
      
    } catch (error) {
      setTransactionStatus({
        stage: 'failed',
        message: 'Transaction failed. Please try again.',
      })
      toast.error('Transaction failed')
    } finally {
      setIsProcessing(false)
    }
  }
  
  // Generate investment certificate
  const generateCertificate = () => {
    toast.success('Investment certificate generated!')
    // In production, this would generate a PDF certificate
  }
  
  // Copy transaction hash
  const copyTxHash = () => {
    if (transactionStatus?.txHash) {
      navigator.clipboard.writeText(transactionStatus.txHash)
      toast.success('Transaction hash copied!')
    }
  }
  
  // Update investment data
  const updateInvestmentData = (field: keyof InvestmentData, value: any) => {
    setInvestmentData(prev => ({ ...prev, [field]: value }))
  }
  
  // Render transaction status
  if (transactionStatus) {
    return (
      <div className="container max-w-2xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Icon */}
            <div className="flex justify-center">
              {transactionStatus.stage === 'pending' && (
                <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-10 w-10 text-yellow-600 animate-pulse" />
                </div>
              )}
              {transactionStatus.stage === 'processing' && (
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <RefreshCw className="h-10 w-10 text-blue-600 animate-spin" />
                </div>
              )}
              {transactionStatus.stage === 'confirming' && (
                <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
                  <Activity className="h-10 w-10 text-purple-600 animate-pulse" />
                </div>
              )}
              {transactionStatus.stage === 'completed' && (
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
              )}
              {transactionStatus.stage === 'failed' && (
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="h-10 w-10 text-red-600" />
                </div>
              )}
            </div>
            
            {/* Status Message */}
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">{transactionStatus.message}</h3>
              {transactionStatus.stage === 'confirming' && (
                <p className="text-sm text-muted-foreground">
                  This may take a few minutes. Please don't close this window.
                </p>
              )}
            </div>
            
            {/* Transaction Details */}
            {transactionStatus.txHash && (
              <div className="space-y-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Transaction Hash</span>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-background px-2 py-1 rounded">
                      {transactionStatus.txHash.substring(0, 10)}...{transactionStatus.txHash.slice(-8)}
                    </code>
                    <Button size="sm" variant="ghost" onClick={copyTxHash}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {transactionStatus.blockNumber && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Block Number</span>
                    <span className="text-sm font-mono">{transactionStatus.blockNumber}</span>
                  </div>
                )}
                
                {transactionStatus.timestamp && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Timestamp</span>
                    <span className="text-sm">
                      {transactionStatus.timestamp.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}
            
            {/* Actions */}
            {transactionStatus.stage === 'completed' && (
              <div className="space-y-3">
                <Separator />
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={() => window.open(`https://etherscan.io/tx/${transactionStatus.txHash}`, '_blank')}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View on Etherscan
                  </Button>
                  <Button variant="outline" onClick={generateCertificate}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Certificate
                  </Button>
                </div>
                <Button className="w-full" onClick={() => router.push('/dashboard/portfolio')}>
                  Go to Portfolio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
            
            {transactionStatus.stage === 'failed' && (
              <div className="space-y-3">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Your transaction could not be completed. Please check your payment method and try again.
                  </AlertDescription>
                </Alert>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    setTransactionStatus(null)
                    setCurrentStep(1) // Go back to payment step
                  }}
                >
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-8">
      {/* Property Summary Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={property.image}
              alt={property.name}
              className="w-full md:w-32 h-24 md:h-32 object-cover rounded-lg"
            />
            <div className="flex-1 space-y-2">
              <h2 className="text-xl font-bold">{property.name}</h2>
              <p className="text-sm text-muted-foreground">{property.address}</p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div>
                  <p className="text-xs text-muted-foreground">Token Price</p>
                  <p className="font-semibold">{formatCurrency(property.tokenPrice)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Expected ROI</p>
                  <p className="font-semibold text-green-600">{formatPercentage(property.expectedROI / 100)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Available Tokens</p>
                  <p className="font-semibold">{formatNumber(property.availableTokens)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Funding Progress</p>
                  <div className="flex items-center gap-2">
                    <Progress value={property.fundingProgress} className="w-20 h-2" />
                    <span className="text-sm font-semibold">{property.fundingProgress}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Complete Your Investment</h1>
          <Badge variant="outline">
            Step {currentStep + 1} of {steps.length}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
        
        {/* Step Indicators */}
        <div className="flex justify-between mt-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isCompleted = index < currentStep
            
            return (
              <div
                key={step.id}
                className={cn(
                  'flex flex-col items-center gap-2',
                  index > currentStep && 'opacity-50'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors',
                  isActive && 'border-primary bg-primary text-white',
                  isCompleted && 'border-primary bg-primary/20 text-primary',
                  !isActive && !isCompleted && 'border-muted-foreground'
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={cn(
                  'text-xs hidden sm:block text-center',
                  isActive && 'font-medium'
                )}>
                  {step.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <currentStepConfig.icon className="h-5 w-5" />
            {currentStepConfig.title}
          </CardTitle>
          <CardDescription>
            {currentStepConfig.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Step 1: Investment Amount */}
          {currentStep === 0 && (
            <div className="space-y-6">
              {/* Quick Amount Selection */}
              <div className="space-y-2">
                <Label>Quick Select</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[100, 500, 1000, 5000].map(amount => (
                    <Button
                      key={amount}
                      variant={investmentData.investmentAmount === amount ? 'default' : 'outline'}
                      onClick={() => updateInvestmentData('investmentAmount', amount)}
                    >
                      {formatCurrency(amount)}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Custom Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount">Investment Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="amount"
                    type="number"
                    value={investmentData.investmentAmount}
                    onChange={(e) => updateInvestmentData('investmentAmount', parseInt(e.target.value) || 0)}
                    className="pl-8"
                    min={property.minInvestment}
                    max={property.maxInvestment}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Min: {formatCurrency(property.minInvestment)}</span>
                  <span>Max: {formatCurrency(property.maxInvestment)}</span>
                </div>
              </div>
              
              {/* Amount Slider */}
              <div className="space-y-2">
                <Label>Adjust Investment</Label>
                <Slider
                  value={[investmentData.investmentAmount]}
                  onValueChange={([value]) => updateInvestmentData('investmentAmount', value)}
                  min={property.minInvestment}
                  max={Math.min(property.maxInvestment, 10000)}
                  step={100}
                  className="w-full"
                />
              </div>
              
              {/* Token Calculation */}
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Number of Tokens</span>
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{formatNumber(investmentData.tokenAmount)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Ownership Percentage</span>
                  <span className="font-semibold">
                    {formatPercentage((investmentData.tokenAmount / 50000) * 100 / 100)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Platform Fee (2%)</span>
                  <span className="text-sm">{formatCurrency(investmentData.platformFee)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Amount</span>
                  <span className="font-bold text-lg">{formatCurrency(investmentData.totalAmount)}</span>
                </div>
              </div>
              
              {/* Investment Type */}
              <div className="space-y-2">
                <Label>Investment Type</Label>
                <RadioGroup
                  value={investmentData.investmentType}
                  onValueChange={(value: any) => updateInvestmentData('investmentType', value)}
                >
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="standard" id="standard" />
                    <div className="space-y-1">
                      <Label htmlFor="standard">Standard Investment</Label>
                      <p className="text-xs text-muted-foreground">For all investors</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="accredited" id="accredited" />
                    <div className="space-y-1">
                      <Label htmlFor="accredited">Accredited Investor</Label>
                      <p className="text-xs text-muted-foreground">Higher limits, exclusive opportunities</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="institutional" id="institutional" />
                    <div className="space-y-1">
                      <Label htmlFor="institutional">Institutional</Label>
                      <p className="text-xs text-muted-foreground">For organizations and funds</p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}
          
          {/* Step 2: Payment Method */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <Tabs value={investmentData.paymentMethod} onValueChange={(value: any) => updateInvestmentData('paymentMethod', value)}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="crypto">Crypto</TabsTrigger>
                  <TabsTrigger value="wire">Wire</TabsTrigger>
                  <TabsTrigger value="ach">ACH</TabsTrigger>
                  <TabsTrigger value="credit">Card</TabsTrigger>
                </TabsList>
                
                <TabsContent value="crypto" className="space-y-4 mt-6">
                  <Alert>
                    <Wallet className="h-4 w-4" />
                    <AlertDescription>
                      Connect your wallet to complete the transaction. Supported networks: Ethereum, Polygon, Arbitrum
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-4">
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => {
                        updateInvestmentData('walletAddress', '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0')
                        toast.success('Wallet connected successfully!')
                      }}
                    >
                      <Wallet className="mr-2 h-5 w-5" />
                      Connect Wallet
                    </Button>
                    
                    {investmentData.walletAddress && (
                      <div className="p-4 bg-muted rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Connected Wallet</span>
                          <Badge variant="outline" className="font-mono text-xs">
                            {investmentData.walletAddress.substring(0, 6)}...{investmentData.walletAddress.slice(-4)}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Network</span>
                          <span className="text-sm">Ethereum Mainnet</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Gas Fee (estimated)</span>
                          <span className="text-sm">~$12.50</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 border rounded-lg">
                      <Zap className="h-6 w-6 mx-auto mb-1 text-yellow-500" />
                      <p className="text-xs">Instant</p>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <Shield className="h-6 w-6 mx-auto mb-1 text-green-500" />
                      <p className="text-xs">Secure</p>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <Lock className="h-6 w-6 mx-auto mb-1 text-blue-500" />
                      <p className="text-xs">Decentralized</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="wire" className="space-y-4 mt-6">
                  <Alert>
                    <Banknote className="h-4 w-4" />
                    <AlertDescription>
                      Wire transfers typically take 1-3 business days to process. You'll receive wire instructions after confirmation.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bank-name">Bank Name</Label>
                      <Input id="bank-name" placeholder="Chase Bank" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account-name">Account Holder Name</Label>
                      <Input id="account-name" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account-number">Account Number</Label>
                      <Input id="account-number" type="password" placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="routing-number">Routing Number</Label>
                      <Input id="routing-number" placeholder="021000021" />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="ach" className="space-y-4 mt-6">
                  <Alert>
                    <Receipt className="h-4 w-4" />
                    <AlertDescription>
                      ACH transfers typically take 3-5 business days to process. Lower fees than wire transfers.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-4">
                    <Button className="w-full" variant="outline">
                      <Building className="mr-2 h-4 w-4" />
                      Connect Bank Account via Plaid
                    </Button>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or enter manually</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ach-routing">Routing Number</Label>
                      <Input id="ach-routing" placeholder="021000021" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ach-account">Account Number</Label>
                      <Input id="ach-account" type="password" placeholder="••••••••" />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="credit" className="space-y-4 mt-6">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Credit card payments include a 3.5% processing fee and have a $10,000 maximum limit.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input id="card-number" placeholder="4242 4242 4242 4242" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" type="password" placeholder="•••" maxLength={3} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-name">Cardholder Name</Label>
                      <Input id="card-name" placeholder="John Doe" />
                    </div>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Additional fee: {formatCurrency(investmentData.investmentAmount * 0.035)}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {/* Step 3: Terms & Agreements */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Investment Terms Summary */}
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <h3 className="font-medium">Investment Terms</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Holding Period</span>
                    <Select
                      value={investmentData.holdingPeriod.toString()}
                      onValueChange={(value) => updateInvestmentData('holdingPeriod', parseInt(value))}
                    >
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12 months</SelectItem>
                        <SelectItem value="24">24 months</SelectItem>
                        <SelectItem value="36">36 months</SelectItem>
                        <SelectItem value="60">60 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Auto-Reinvest Dividends</span>
                    <Checkbox
                      checked={investmentData.autoReinvest}
                      onCheckedChange={(checked) => updateInvestmentData('autoReinvest', checked)}
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Exit Fee</span>
                    <span>1% (after holding period)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Management Fee</span>
                    <span>1% annually</span>
                  </div>
                </div>
              </div>
              
              {/* Legal Documents */}
              <div className="space-y-4">
                <h3 className="font-medium">Legal Agreements</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id="terms"
                      checked={investmentData.termsAccepted}
                      onCheckedChange={(checked) => updateInvestmentData('termsAccepted', checked)}
                    />
                    <div className="space-y-1 flex-1">
                      <Label htmlFor="terms" className="font-normal cursor-pointer">
                        Subscription Agreement
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        I have read and agree to the subscription agreement governing this investment.
                      </p>
                      <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                        <FileText className="mr-1 h-3 w-3" />
                        View Document
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id="risk"
                      checked={investmentData.riskDisclosureAccepted}
                      onCheckedChange={(checked) => updateInvestmentData('riskDisclosureAccepted', checked)}
                    />
                    <div className="space-y-1 flex-1">
                      <Label htmlFor="risk" className="font-normal cursor-pointer">
                        Risk Disclosure Statement
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        I understand the risks associated with real estate investment and tokenization.
                      </p>
                      <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        View Risks
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id="subscription"
                      checked={investmentData.subscriptionAgreementAccepted}
                      onCheckedChange={(checked) => updateInvestmentData('subscriptionAgreementAccepted', checked)}
                    />
                    <div className="space-y-1 flex-1">
                      <Label htmlFor="subscription" className="font-normal cursor-pointer">
                        Platform Terms of Service
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        I agree to PropertyChain's terms of service and privacy policy.
                      </p>
                      <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                        <Shield className="mr-1 h-3 w-3" />
                        View Terms
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Risk Warning */}
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Investment Risk Warning:</strong> Real estate investments carry risks including but not limited to 
                  market volatility, liquidity constraints, and potential loss of principal. Past performance does not 
                  guarantee future results. Please invest responsibly.
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          {/* Step 4: Review & Confirm */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Investment Summary */}
              <div className="space-y-4">
                <h3 className="font-medium">Investment Summary</h3>
                
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{property.name}</p>
                      <p className="text-sm text-muted-foreground">{property.address}</p>
                    </div>
                    <Badge>{formatNumber(investmentData.tokenAmount)} tokens</Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Investment Amount</span>
                      <span className="font-medium">{formatCurrency(investmentData.investmentAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform Fee (2%)</span>
                      <span>{formatCurrency(investmentData.platformFee)}</span>
                    </div>
                    {investmentData.paymentMethod === 'credit' && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Card Processing Fee (3.5%)</span>
                        <span>{formatCurrency(investmentData.investmentAmount * 0.035)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total Amount</span>
                      <span className="text-lg">
                        {formatCurrency(
                          investmentData.totalAmount + 
                          (investmentData.paymentMethod === 'credit' ? investmentData.investmentAmount * 0.035 : 0)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Method Summary */}
              <div className="space-y-2">
                <h3 className="font-medium">Payment Method</h3>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    {investmentData.paymentMethod === 'crypto' && (
                      <>
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4" />
                          <span>Cryptocurrency</span>
                        </div>
                        {investmentData.walletAddress && (
                          <Badge variant="outline" className="font-mono text-xs">
                            {investmentData.walletAddress.substring(0, 6)}...{investmentData.walletAddress.slice(-4)}
                          </Badge>
                        )}
                      </>
                    )}
                    {investmentData.paymentMethod === 'wire' && (
                      <>
                        <div className="flex items-center gap-2">
                          <Banknote className="h-4 w-4" />
                          <span>Wire Transfer</span>
                        </div>
                        <span className="text-sm text-muted-foreground">1-3 business days</span>
                      </>
                    )}
                    {investmentData.paymentMethod === 'ach' && (
                      <>
                        <div className="flex items-center gap-2">
                          <Receipt className="h-4 w-4" />
                          <span>ACH Transfer</span>
                        </div>
                        <span className="text-sm text-muted-foreground">3-5 business days</span>
                      </>
                    )}
                    {investmentData.paymentMethod === 'credit' && (
                      <>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <span>Credit Card</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Instant</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Terms Summary */}
              <div className="space-y-2">
                <h3 className="font-medium">Investment Terms</h3>
                <div className="p-4 border rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Holding Period</span>
                    <span>{investmentData.holdingPeriod} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Auto-Reinvest</span>
                    <span>{investmentData.autoReinvest ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expected Annual ROI</span>
                    <span className="text-green-600 font-medium">{formatPercentage(property.expectedROI / 100)}</span>
                  </div>
                </div>
              </div>
              
              {/* Projected Returns */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
                <h4 className="font-medium text-green-900">Projected Returns</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-green-700">Monthly</p>
                    <p className="font-semibold text-green-900">
                      {formatCurrency((investmentData.investmentAmount * property.expectedROI / 100) / 12)}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-700">Annual</p>
                    <p className="font-semibold text-green-900">
                      {formatCurrency(investmentData.investmentAmount * property.expectedROI / 100)}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-700">5 Year Total</p>
                    <p className="font-semibold text-green-900">
                      {formatCurrency(investmentData.investmentAmount * property.expectedROI / 100 * 5)}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Final Confirmation */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  By clicking "Confirm Investment", you authorize PropertyChain to process this transaction 
                  according to the terms and conditions you've agreed to.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
        
        {/* Navigation */}
        <Separator />
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0 || isProcessing}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={isProcessing}
            >
              {currentStep === steps.length - 1 ? (
                <>
                  Review Investment
                  <Shield className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Your Investment</DialogTitle>
            <DialogDescription>
              Please review your investment details one more time before confirming.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">Investment Amount</span>
              <span className="font-bold">{formatCurrency(investmentData.totalAmount)}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">Number of Tokens</span>
              <span className="font-bold">{formatNumber(investmentData.tokenAmount)}</span>
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                This transaction is final and cannot be reversed. Tokens will be locked for the specified holding period.
              </AlertDescription>
            </Alert>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1"
              onClick={processTransaction}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm Investment
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}