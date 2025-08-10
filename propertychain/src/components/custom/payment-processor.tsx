/**
 * Payment Processor Component - PropertyChain
 * 
 * Multi-method payment processing for property transactions
 * Following UpdatedUIPlan.md Step 45 specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  DollarSign,
  CreditCard,
  Building,
  Wallet,
  Globe,
  Shield,
  Info,
  AlertTriangle,
  Check,
  X,
  Loader2,
  ArrowRight,
  Clock,
  TrendingUp,
  Lock,
  Zap,
  Receipt,
  Calculator,
  BanknoteIcon,
  Bitcoin,
  Building2,
  Landmark,
  Send,
  RefreshCw,
  FileText,
  Copy,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Timer,
  Percent,
  Hash,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useToast } from '@/hooks/use-toast'

// Payment method configurations
const PAYMENT_METHODS = {
  crypto: {
    id: 'crypto',
    name: 'Cryptocurrency',
    icon: Bitcoin,
    description: 'Pay with digital assets',
    currencies: [
      { symbol: 'ETH', name: 'Ethereum', network: 'Ethereum', gasEstimate: 0.003 },
      { symbol: 'USDC', name: 'USD Coin', network: 'Ethereum', gasEstimate: 0.002 },
      { symbol: 'DAI', name: 'DAI Stablecoin', network: 'Ethereum', gasEstimate: 0.002 },
      { symbol: 'MATIC', name: 'Polygon', network: 'Polygon', gasEstimate: 0.0001 },
    ],
    fees: {
      platform: 0.015, // 1.5%
      network: 'variable',
    },
    processingTime: 'instant',
    color: '#F7931A',
  },
  wire: {
    id: 'wire',
    name: 'Wire Transfer',
    icon: Building2,
    description: 'Bank wire transfer',
    types: [
      { id: 'domestic', name: 'US Domestic', fee: 25, time: '1-2 days' },
      { id: 'international', name: 'International', fee: 45, time: '3-5 days' },
    ],
    fees: {
      platform: 0,
      fixed: 25,
    },
    processingTime: '1-5 days',
    color: '#007BFF',
  },
  ach: {
    id: 'ach',
    name: 'ACH Transfer',
    icon: Landmark,
    description: 'Direct bank transfer',
    verification: 'Plaid',
    fees: {
      platform: 0.005, // 0.5%
      fixed: 0,
      max: 5,
    },
    processingTime: '2-3 days',
    color: '#4CAF50',
  },
  credit: {
    id: 'credit',
    name: 'Credit/Debit Card',
    icon: CreditCard,
    description: 'Visa, Mastercard, Amex',
    processor: 'Stripe',
    fees: {
      platform: 0.029, // 2.9%
      fixed: 0.30,
    },
    processingTime: 'instant',
    color: '#9C27B0',
  },
}

// Types
interface PaymentProcessorProps {
  amount: number
  propertyId: string
  propertyTitle: string
  transactionType: 'purchase' | 'deposit' | 'payment'
  onSuccess?: (paymentData: PaymentData) => void
  onCancel?: () => void
  allowedMethods?: string[]
  recipientAddress?: string
  scheduleOptions?: PaymentScheduleOptions
}

interface PaymentData {
  method: string
  amount: number
  fees: {
    platform: number
    network?: number
    fixed?: number
    total: number
  }
  currency?: string
  account?: string
  transactionHash?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  timestamp: string
  schedule?: PaymentSchedule
}

interface PaymentScheduleOptions {
  enabled: boolean
  minDownPayment: number
  maxInstallments: number
  interestRate: number
}

interface PaymentSchedule {
  type: 'immediate' | 'installment' | 'scheduled'
  downPayment?: number
  installments?: number
  frequency?: 'weekly' | 'biweekly' | 'monthly'
  startDate?: string
  payments?: ScheduledPayment[]
}

interface ScheduledPayment {
  id: string
  amount: number
  dueDate: string
  status: 'scheduled' | 'pending' | 'paid' | 'late'
  principal: number
  interest: number
  balance: number
}

export function PaymentProcessor({
  amount,
  propertyId,
  propertyTitle,
  transactionType,
  onSuccess,
  onCancel,
  allowedMethods = Object.keys(PAYMENT_METHODS),
  recipientAddress,
  scheduleOptions,
}: PaymentProcessorProps) {
  const { toast } = useToast()
  const [selectedMethod, setSelectedMethod] = useState<string>(allowedMethods[0])
  const [processing, setProcessing] = useState(false)
  const [paymentData, setPaymentData] = useState<Partial<PaymentData>>({})
  const [schedule, setSchedule] = useState<PaymentSchedule>({ type: 'immediate' })
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [cryptoCurrency, setCryptoCurrency] = useState('ETH')
  const [bankAccount, setBankAccount] = useState('')
  const [routingNumber, setRoutingNumber] = useState('')
  const [wireType, setWireType] = useState('domestic')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [walletAddress, setWalletAddress] = useState('')

  // Calculate fees based on payment method
  const calculateFees = useCallback(() => {
    const method = PAYMENT_METHODS[selectedMethod as keyof typeof PAYMENT_METHODS]
    if (!method) return { platform: 0, network: 0, fixed: 0, total: 0 }

    let platform = 0
    let network = 0
    let fixed = 0

    switch (selectedMethod) {
      case 'crypto':
        platform = amount * method.fees.platform
        const currencies = 'currencies' in method ? method.currencies : []
        const currency = currencies.find(c => c.symbol === cryptoCurrency)
        network = (currency?.gasEstimate || 0) * amount * 0.001 // Simplified gas calculation
        break
      case 'wire':
        const types = 'types' in method ? method.types : []
        const wireOption = types?.find(t => t.id === wireType)
        fixed = wireOption?.fee || 25
        break
      case 'ach':
        const maxFee = 'max' in method.fees ? method.fees.max : 5
        platform = Math.min(amount * method.fees.platform, maxFee)
        break
      case 'credit':
        platform = amount * method.fees.platform
        fixed = 'fixed' in method.fees ? method.fees.fixed : 0
        break
    }

    const total = platform + network + fixed

    return {
      platform: Math.round(platform * 100) / 100,
      network: Math.round(network * 100) / 100,
      fixed: Math.round(fixed * 100) / 100,
      total: Math.round(total * 100) / 100,
    }
  }, [selectedMethod, amount, cryptoCurrency, wireType])

  // Calculate payment schedule
  const calculateSchedule = useCallback(() => {
    if (schedule.type === 'immediate') return []

    const payments: ScheduledPayment[] = []
    const { downPayment = 0, installments = 1, frequency = 'monthly' } = schedule
    const financedAmount = amount - downPayment
    const monthlyRate = (scheduleOptions?.interestRate || 0) / 100 / 12
    const monthlyPayment = financedAmount * (monthlyRate * Math.pow(1 + monthlyRate, installments)) / 
                          (Math.pow(1 + monthlyRate, installments) - 1)

    let balance = financedAmount
    const startDate = new Date(schedule.startDate || new Date())

    for (let i = 0; i < installments; i++) {
      const dueDate = new Date(startDate)
      if (frequency === 'monthly') {
        dueDate.setMonth(dueDate.getMonth() + i)
      } else if (frequency === 'biweekly') {
        dueDate.setDate(dueDate.getDate() + (i * 14))
      } else if (frequency === 'weekly') {
        dueDate.setDate(dueDate.getDate() + (i * 7))
      }

      const interest = balance * monthlyRate
      const principal = monthlyPayment - interest
      balance -= principal

      payments.push({
        id: `payment-${i + 1}`,
        amount: Math.round(monthlyPayment * 100) / 100,
        dueDate: dueDate.toISOString(),
        status: 'scheduled',
        principal: Math.round(principal * 100) / 100,
        interest: Math.round(interest * 100) / 100,
        balance: Math.round(balance * 100) / 100,
      })
    }

    return payments
  }, [schedule, amount, scheduleOptions])

  // Process payment
  const processPayment = async () => {
    setProcessing(true)
    setShowConfirmation(false)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      const fees = calculateFees()
      const paymentResult: PaymentData = {
        method: selectedMethod,
        amount,
        fees,
        currency: selectedMethod === 'crypto' ? cryptoCurrency : 'USD',
        account: selectedMethod === 'crypto' ? walletAddress : bankAccount,
        transactionHash: selectedMethod === 'crypto' ? `0x${Math.random().toString(36).substr(2, 64)}` : undefined,
        status: 'completed',
        timestamp: new Date().toISOString(),
        schedule: schedule.type !== 'immediate' ? {
          ...schedule,
          payments: calculateSchedule(),
        } : undefined,
      }

      setPaymentData(paymentResult)
      
      toast({
        title: 'Payment successful',
        description: `Your payment of $${amount.toLocaleString()} has been processed.`,
      })

      if (onSuccess) {
        onSuccess(paymentResult)
      }
    } catch (error) {
      toast({
        title: 'Payment failed',
        description: 'There was an error processing your payment. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }

  // Render payment method content
  const renderPaymentMethodContent = () => {
    const method = PAYMENT_METHODS[selectedMethod as keyof typeof PAYMENT_METHODS]
    if (!method) return null

    switch (selectedMethod) {
      case 'crypto':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="crypto-currency">Select Cryptocurrency</Label>
              <Select value={cryptoCurrency} onValueChange={setCryptoCurrency}>
                <SelectTrigger id="crypto-currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {'currencies' in method ? method.currencies.map((currency) => (
                    <SelectItem key={currency.symbol} value={currency.symbol}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{currency.symbol}</span>
                        <span className="text-muted-foreground">- {currency.name}</span>
                        <Badge variant="outline" className="ml-auto text-xs">
                          {currency.network}
                        </Badge>
                      </div>
                    </SelectItem>
                  )) : null}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wallet-address">Your Wallet Address</Label>
              <div className="relative">
                <Wallet className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="wallet-address"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="pl-10 font-mono text-sm"
                />
              </div>
            </div>

            {recipientAddress && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Recipient Address:</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">
                        {recipientAddress}
                      </code>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                Cryptocurrency transactions are irreversible. Please verify all details before confirming.
              </AlertDescription>
            </Alert>
          </div>
        )

      case 'wire':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Wire Transfer Type</Label>
              <RadioGroup value={wireType} onValueChange={setWireType}>
                {'types' in method && method.types?.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={type.id} id={type.id} />
                    <Label htmlFor={type.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span>{type.name}</span>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>${type.fee} fee</span>
                          <span>•</span>
                          <span>{type.time}</span>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bank-account">Bank Account Number</Label>
                <Input
                  id="bank-account"
                  placeholder="Enter account number"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="routing-number">Routing Number</Label>
                <Input
                  id="routing-number"
                  placeholder="Enter routing number"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value)}
                />
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Wire transfer instructions will be sent to your email after confirmation.
              </AlertDescription>
            </Alert>
          </div>
        )

      case 'ach':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ach-account">Bank Account Number</Label>
                <Input
                  id="ach-account"
                  placeholder="Enter account number"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ach-routing">Routing Number</Label>
                <Input
                  id="ach-routing"
                  placeholder="Enter routing number"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value)}
                />
              </div>
            </div>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Bank Verification with Plaid</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your bank account will be securely verified through Plaid
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect Bank
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'credit':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="card-number">Card Number</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="pl-10"
                  maxLength={19}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="card-expiry">Expiry Date</Label>
                <Input
                  id="card-expiry"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-cvv">CVV</Label>
                <Input
                  id="card-cvv"
                  placeholder="123"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  maxLength={4}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Secured by Stripe. Your card details are encrypted.</span>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Get total amount including fees
  const fees = calculateFees()
  const totalAmount = amount + fees.total

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">Payment Processing</CardTitle>
              <CardDescription className="mt-2">
                Complete your {transactionType} for {propertyTitle}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1">
              ${amount.toLocaleString()}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Payment Schedule Options */}
      {scheduleOptions?.enabled && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Payment Schedule</CardTitle>
            <CardDescription>
              Choose how you'd like to structure your payment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={schedule.type}
              onValueChange={(value) => setSchedule({ ...schedule, type: value as PaymentSchedule['type'] })}
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value="immediate" id="immediate" />
                  <Label htmlFor="immediate" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Pay in Full</p>
                        <p className="text-sm text-muted-foreground">
                          Complete payment immediately
                        </p>
                      </div>
                      <span className="text-lg font-semibold">
                        ${amount.toLocaleString()}
                      </span>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value="installment" id="installment" />
                  <Label htmlFor="installment" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Installment Plan</p>
                        <p className="text-sm text-muted-foreground">
                          Split into monthly payments
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">from</p>
                        <span className="text-lg font-semibold">
                          ${Math.round((amount / 12) * 100) / 100}/mo
                        </span>
                      </div>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>

            {schedule.type === 'installment' && (
              <div className="mt-6 space-y-4 p-4 rounded-lg bg-muted/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="down-payment">Down Payment</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="down-payment"
                        type="number"
                        placeholder="0"
                        value={schedule.downPayment || ''}
                        onChange={(e) => setSchedule({ ...schedule, downPayment: parseInt(e.target.value) })}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Minimum: ${scheduleOptions.minDownPayment.toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="installments">Number of Installments</Label>
                    <Select
                      value={schedule.installments?.toString() || ''}
                      onValueChange={(value) => setSchedule({ ...schedule, installments: parseInt(value) })}
                    >
                      <SelectTrigger id="installments">
                        <SelectValue placeholder="Select term" />
                      </SelectTrigger>
                      <SelectContent>
                        {[3, 6, 12, 24, 36].map((months) => (
                          <SelectItem key={months} value={months.toString()}>
                            {months} months
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {schedule.installments && schedule.downPayment !== undefined && (
                  <Alert>
                    <Calculator className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <p className="font-medium">Payment Breakdown</p>
                        <p className="text-sm">
                          Monthly payment: $
                          {Math.round(((amount - (schedule.downPayment || 0)) / schedule.installments) * 100) / 100}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Interest rate: {scheduleOptions.interestRate}% APR
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Payment Methods */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Payment Method</CardTitle>
          <CardDescription>
            Select your preferred payment method
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {allowedMethods.map((methodId) => {
              const method = PAYMENT_METHODS[methodId as keyof typeof PAYMENT_METHODS]
              if (!method) return null

              const Icon = method.icon
              const isSelected = selectedMethod === methodId

              return (
                <button
                  key={methodId}
                  onClick={() => setSelectedMethod(methodId)}
                  className={cn(
                    "relative p-4 rounded-lg border-2 transition-all",
                    "hover:border-primary/50 hover:bg-muted/50",
                    isSelected ? "border-primary bg-primary/5" : "border-muted"
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <Icon className="h-8 w-8 mx-auto mb-2" style={{ color: method.color }} />
                  <p className="text-sm font-medium">{method.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {method.processingTime}
                  </p>
                </button>
              )
            })}
          </div>

          <Separator className="my-6" />

          {/* Method-specific content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMethod}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderPaymentMethodContent()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Fee Breakdown */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Fee Calculator</CardTitle>
          <CardDescription>
            Complete breakdown of all fees and charges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Base Amount</span>
              <span className="font-medium">${amount.toLocaleString()}</span>
            </div>

            {fees.platform > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Service fee for using our platform</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="font-medium">${fees.platform.toFixed(2)}</span>
              </div>
            )}

            {fees.network > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Network Fee</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Blockchain network gas fees</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="font-medium">${fees.network.toFixed(2)}</span>
              </div>
            )}

            {fees.fixed > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Processing Fee</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Fixed fee for this payment method</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="font-medium">${fees.fixed.toFixed(2)}</span>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total Amount</span>
              <span className="text-primary">${totalAmount.toLocaleString()}</span>
            </div>

            {schedule.type === 'installment' && schedule.installments && (
              <>
                <Separator />
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <p className="font-medium mb-1">Installment Summary</p>
                    <p className="text-sm">
                      Down payment: ${(schedule.downPayment || 0).toLocaleString()}
                    </p>
                    <p className="text-sm">
                      Monthly payment: $
                      {Math.round(((totalAmount - (schedule.downPayment || 0)) / schedule.installments) * 100) / 100}
                      × {schedule.installments}
                    </p>
                  </AlertDescription>
                </Alert>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={processing}
        >
          Cancel
        </Button>
        <Button
          onClick={() => setShowConfirmation(true)}
          disabled={processing || (!walletAddress && selectedMethod === 'crypto') || (!bankAccount && (selectedMethod === 'wire' || selectedMethod === 'ach'))}
          className="min-w-[150px]"
        >
          {processing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Confirm Payment</CardTitle>
                  <CardDescription>
                    Please review your payment details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-medium">${amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fees</span>
                      <span className="font-medium">${fees.total.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-primary">${totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      By confirming, you agree to process this payment. This action cannot be undone.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={processPayment}
                    className="flex-1"
                  >
                    Confirm Payment
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}