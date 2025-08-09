/**
 * Transaction Flow Modal - PropertyChain
 * 
 * Multi-step transaction interface for real estate investments:
 * - Investment confirmation with property details
 * - Gas estimation and fee display
 * - Terms acceptance and confirmation
 * - Transaction progress tracking
 * - Success celebration with confetti animation
 * 
 * Following UpdatedUIPlan.md Step 34 specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import {
  ArrowLeft,
  ArrowRight,
  Wallet,
  Fuel,
  Shield,
  Clock,
  DollarSign,
  Building,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ExternalLink,
  Copy,
  Info,
  Zap,
  FileText,
  Users,
  Calculator,
  Target,
  Star,
  Award,
  Activity,
  BarChart3,
  PieChart,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils/cn'
import { useWeb3Context } from '@/components/providers/web3-provider'
import { BLOCKCHAIN } from '@/lib/constants/blockchain'
import { toast } from 'sonner'

/**
 * Transaction step definitions
 */
export const TRANSACTION_STEPS = {
  review: {
    id: 'review',
    title: 'Review Investment',
    description: 'Review property details and investment amount',
    icon: Eye,
  },
  gas: {
    id: 'gas',
    title: 'Gas & Fees',
    description: 'Estimate transaction costs and network fees',
    icon: Fuel,
  },
  confirm: {
    id: 'confirm',
    title: 'Confirm Transaction',
    description: 'Review and confirm your investment',
    icon: Shield,
  },
  processing: {
    id: 'processing',
    title: 'Processing',
    description: 'Transaction is being processed',
    icon: Clock,
  },
  success: {
    id: 'success',
    title: 'Success',
    description: 'Investment completed successfully',
    icon: CheckCircle,
  },
} as const

export type TransactionStep = keyof typeof TRANSACTION_STEPS

/**
 * Property investment data interface
 */
export interface PropertyInvestment {
  id: string
  name: string
  address: string
  image: string
  tokenPrice: number
  totalTokens: number
  availableTokens: number
  minimumInvestment: number
  expectedReturn: string
  propertyValue: number
  investmentAmount: number
  tokensToReceive: number
  description?: string
  features?: string[]
}

/**
 * Gas estimation interface
 */
export interface GasEstimation {
  gasLimit: string
  gasPrice: string
  gasCost: string
  totalCost: string
  estimatedTime: string
  networkCongestion: 'low' | 'medium' | 'high'
  isLoading: boolean
  error?: string
}

/**
 * Transaction progress interface
 */
export interface TransactionProgress {
  step: number
  total: number
  message: string
  txHash?: string
  blockNumber?: number
  confirmations?: number
  isComplete: boolean
  error?: string
}

/**
 * Investment Review Step Component
 */
function InvestmentReviewStep({ 
  investment,
  onAmountChange,
}: {
  investment: PropertyInvestment
  onAmountChange: (amount: number) => void
}) {
  const [customAmount, setCustomAmount] = useState(investment.investmentAmount)
  const [showDetails, setShowDetails] = useState(false)
  
  const handleAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0
    setCustomAmount(amount)
    onAmountChange(amount)
  }

  const tokensReceived = Math.floor(customAmount / investment.tokenPrice)

  return (
    <div className="space-y-6">
      {/* Property Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <Building className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-lg">{investment.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {investment.address}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span>${investment.tokenPrice.toLocaleString()} per token</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span>{investment.expectedReturn} expected return</span>
                </div>
              </div>
            </div>
            <Badge variant="secondary">
              {investment.availableTokens.toLocaleString()} tokens available
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Investment Amount */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Investment Amount
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[1000, 5000, 10000].map((amount) => (
              <Button
                key={amount}
                variant={customAmount === amount ? "default" : "outline"}
                className="h-12 flex flex-col gap-1"
                onClick={() => handleAmountChange(amount.toString())}
              >
                <span className="font-semibold">${amount.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">
                  {Math.floor(amount / investment.tokenPrice)} tokens
                </span>
              </Button>
            ))}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="custom-amount">Custom Amount</Label>
            <Input
              id="custom-amount"
              type="number"
              placeholder="Enter amount in USD"
              value={customAmount || ''}
              onChange={(e) => handleAmountChange(e.target.value)}
              min={investment.minimumInvestment}
              max={investment.availableTokens * investment.tokenPrice}
            />
            <p className="text-xs text-muted-foreground">
              Minimum: ${investment.minimumInvestment.toLocaleString()}
            </p>
          </div>

          {/* Investment Summary */}
          <div className="p-4 bg-blue-50 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Investment Amount:</span>
              <span className="font-semibold">${customAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Tokens to Receive:</span>
              <span className="font-semibold text-blue-600">{tokensReceived.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Ownership Percentage:</span>
              <span className="font-semibold text-green-600">
                {((tokensReceived / investment.totalTokens) * 100).toFixed(4)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Details Toggle */}
      <Card>
        <CardContent className="p-4">
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={() => setShowDetails(!showDetails)}
          >
            <span className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Property Details
            </span>
            <motion.div
              animate={{ rotate: showDetails ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </Button>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-3 border-t mt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Property Value:</span>
                      <div className="font-semibold">${investment.propertyValue.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Tokens:</span>
                      <div className="font-semibold">{investment.totalTokens.toLocaleString()}</div>
                    </div>
                  </div>
                  {investment.features && (
                    <div>
                      <span className="text-sm text-muted-foreground">Features:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {investment.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Gas Estimation Step Component
 */
function GasEstimationStep({
  gasEstimation,
  onRefreshGas,
}: {
  gasEstimation: GasEstimation
  onRefreshGas: () => void
}) {
  const getCongestionColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (gasEstimation.isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Estimating gas costs...</p>
        </CardContent>
      </Card>
    )
  }

  if (gasEstimation.error) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {gasEstimation.error}
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2"
                onClick={onRefreshGas}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Network Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Network Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Network Congestion:</span>
            <Badge className={cn('capitalize', getCongestionColor(gasEstimation.networkCongestion))}>
              {gasEstimation.networkCongestion}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Estimated Time:</span>
            <span className="font-semibold">{gasEstimation.estimatedTime}</span>
          </div>
        </CardContent>
      </Card>

      {/* Gas Details */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5" />
            Gas Estimation
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onRefreshGas}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Refresh gas estimate
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-muted-foreground">Gas Limit</div>
              <div className="font-mono font-semibold">{gasEstimation.gasLimit}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-muted-foreground">Gas Price (Gwei)</div>
              <div className="font-mono font-semibold">{gasEstimation.gasPrice}</div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Gas Cost:</span>
              <span className="font-mono">{gasEstimation.gasCost} ETH</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Cost:</span>
              <span className="font-mono font-semibold text-lg">{gasEstimation.totalCost} ETH</span>
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Gas fees are paid to network validators and may vary based on network congestion.
              This estimate may change before transaction confirmation.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Fee Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Fee Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span>Network Fee</span>
              <span>{gasEstimation.gasCost} ETH</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Platform Fee</span>
              <span>0.001 ETH</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Insurance Fee</span>
              <span>0.0005 ETH</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center font-semibold">
              <span>Total Fees</span>
              <span>{(parseFloat(gasEstimation.gasCost) + 0.0015).toFixed(6)} ETH</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Confirmation Step Component
 */
function ConfirmationStep({
  investment,
  gasEstimation,
  onConfirm,
}: {
  investment: PropertyInvestment
  gasEstimation: GasEstimation
  onConfirm: () => void
}) {
  const [agreements, setAgreements] = useState({
    terms: false,
    risks: false,
    fees: false,
    kyc: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [confirmationCode, setConfirmationCode] = useState('')
  
  const allAgreed = Object.values(agreements).every(Boolean)
  const canConfirm = allAgreed && confirmationCode === 'CONFIRM'

  const handleAgreementChange = (key: keyof typeof agreements) => {
    setAgreements(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6">
      {/* Transaction Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Transaction Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Property:</span>
              <span className="font-semibold">{investment.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Investment Amount:</span>
              <span className="font-semibold">${investment.investmentAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Tokens to Receive:</span>
              <span className="font-semibold text-blue-600">{investment.tokensToReceive.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Network Fees:</span>
              <span className="font-semibold">{gasEstimation.gasCost} ETH</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agreements and Confirmations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Confirmations Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {[
              {
                key: 'terms' as const,
                label: 'I agree to the Terms of Service and Property Investment Agreement',
                required: true,
              },
              {
                key: 'risks' as const,
                label: 'I understand the risks associated with real estate tokenization',
                required: true,
              },
              {
                key: 'fees' as const,
                label: 'I acknowledge all fees and costs associated with this transaction',
                required: true,
              },
              {
                key: 'kyc' as const,
                label: 'I confirm my KYC/AML compliance and legal eligibility',
                required: true,
              },
            ].map((agreement) => (
              <div key={agreement.key} className="flex items-start space-x-3">
                <Checkbox
                  id={agreement.key}
                  checked={agreements[agreement.key]}
                  onCheckedChange={() => handleAgreementChange(agreement.key)}
                  className="mt-1"
                />
                <Label
                  htmlFor={agreement.key}
                  className="text-sm leading-5 cursor-pointer"
                >
                  {agreement.label}
                  {agreement.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
              </div>
            ))}
          </div>

          <Separator />

          {/* Confirmation Code */}
          <div className="space-y-2">
            <Label htmlFor="confirmation">
              Type "CONFIRM" to proceed with the transaction
            </Label>
            <div className="relative">
              <Input
                id="confirmation"
                type={showPassword ? 'text' : 'password'}
                placeholder="Type CONFIRM"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value.toUpperCase())}
                className={cn(
                  "font-mono",
                  confirmationCode === 'CONFIRM' && "border-green-500 bg-green-50"
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              This action cannot be undone. Please review all details carefully before confirming.
              Ensure you have sufficient ETH balance to cover gas fees.
            </AlertDescription>
          </Alert>

          <Button
            onClick={onConfirm}
            disabled={!canConfirm}
            className="w-full h-12 text-lg font-semibold"
          >
            {canConfirm ? (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Confirm Investment
              </>
            ) : (
              <>
                <Shield className="h-5 w-5 mr-2" />
                Complete All Requirements
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Processing Step Component
 */
function ProcessingStep({
  progress,
}: {
  progress: TransactionProgress
}) {
  const progressPercentage = (progress.step / progress.total) * 100

  return (
    <Card>
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Processing Transaction</h3>
            <p className="text-muted-foreground">{progress.message}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress.step} of {progress.total}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {progress.txHash && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Transaction Hash</div>
              <div className="flex items-center gap-2 p-2 bg-gray-100 rounded font-mono text-xs">
                <span className="flex-1 truncate">{progress.txHash}</span>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Copy className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {progress.confirmations !== undefined && (
            <div className="text-sm text-muted-foreground">
              {progress.confirmations} / 12 confirmations
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Success Step Component
 */
function SuccessStep({
  investment,
  txHash,
  showConfetti = true,
}: {
  investment: PropertyInvestment
  txHash: string
  showConfetti?: boolean
}) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="space-y-6">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

      <Card>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h3 className="text-2xl font-bold text-green-600 mb-2">Investment Successful!</h3>
          <p className="text-muted-foreground mb-6">
            Your investment in {investment.name} has been completed successfully.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-muted-foreground">Tokens Received</div>
              <div className="font-semibold text-lg text-green-600">
                {investment.tokensToReceive.toLocaleString()}
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-muted-foreground">Investment Value</div>
              <div className="font-semibold text-lg text-blue-600">
                ${investment.investmentAmount.toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details */}
      <Card>
        <CardContent className="p-4">
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={() => setShowDetails(!showDetails)}
          >
            <span className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Transaction Details
            </span>
            <motion.div
              animate={{ rotate: showDetails ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </Button>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-3 border-t mt-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Transaction Hash</div>
                    <div className="flex items-center gap-2 p-2 bg-gray-100 rounded font-mono text-xs">
                      <span className="flex-1 truncate">{txHash}</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Block Number:</span>
                      <div className="font-mono">18,456,789</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Confirmations:</span>
                      <div className="font-mono">12/12</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            What's Next?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium">View Your Portfolio</div>
              <div className="text-sm text-muted-foreground">Track your investment performance</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <div className="font-medium">Receive Dividends</div>
              <div className="text-sm text-muted-foreground">Automatic monthly distributions</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <div className="font-medium">Join Community</div>
              <div className="text-sm text-muted-foreground">Connect with other investors</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Main Transaction Modal Component
 */
export function TransactionModal({
  open,
  onOpenChange,
  investment,
  onComplete,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  investment: PropertyInvestment
  onComplete?: (investment: PropertyInvestment, txHash: string) => void
}) {
  const { connected, address } = useWeb3Context()
  const [currentStep, setCurrentStep] = useState<TransactionStep>('review')
  const [gasEstimation, setGasEstimation] = useState<GasEstimation>({
    gasLimit: '150000',
    gasPrice: '25.5',
    gasCost: '0.003825',
    totalCost: '0.0053',
    estimatedTime: '2-3 minutes',
    networkCongestion: 'medium',
    isLoading: false,
  })
  const [progress, setProgress] = useState<TransactionProgress>({
    step: 1,
    total: 4,
    message: 'Preparing transaction...',
    isComplete: false,
  })
  const [txHash, setTxHash] = useState('')

  // Mock gas estimation
  const refreshGasEstimation = useCallback(() => {
    setGasEstimation(prev => ({ ...prev, isLoading: true }))
    setTimeout(() => {
      setGasEstimation({
        gasLimit: (Math.random() * 50000 + 120000).toFixed(0),
        gasPrice: (Math.random() * 20 + 15).toFixed(1),
        gasCost: (Math.random() * 0.002 + 0.003).toFixed(6),
        totalCost: (Math.random() * 0.003 + 0.004).toFixed(6),
        estimatedTime: Math.random() > 0.5 ? '1-2 minutes' : '2-3 minutes',
        networkCongestion: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
        isLoading: false,
      })
    }, 2000)
  }, [])

  // Mock transaction processing
  const processTransaction = useCallback(() => {
    setCurrentStep('processing')
    
    const steps = [
      'Preparing transaction...',
      'Signing transaction...',
      'Broadcasting to network...',
      'Confirming transaction...',
    ]

    let currentProgressStep = 0
    
    const updateProgress = () => {
      setProgress({
        step: currentProgressStep + 1,
        total: 4,
        message: steps[currentProgressStep],
        txHash: currentProgressStep > 1 ? '0x1234567890abcdef...' : undefined,
        confirmations: currentProgressStep > 2 ? Math.min(currentProgressStep * 3, 12) : undefined,
        isComplete: false,
      })
      
      currentProgressStep++
      
      if (currentProgressStep < steps.length) {
        setTimeout(updateProgress, 2000)
      } else {
        setTimeout(() => {
          const finalTxHash = '0x1234567890abcdef1234567890abcdef12345678'
          setTxHash(finalTxHash)
          setCurrentStep('success')
          onComplete?.(investment, finalTxHash)
        }, 2000)
      }
    }
    
    updateProgress()
  }, [investment, onComplete])

  const handleStepChange = (step: string) => {
    if (step === currentStep) return
    
    const stepOrder: TransactionStep[] = ['review', 'gas', 'confirm', 'processing', 'success']
    const currentIndex = stepOrder.indexOf(currentStep)
    const targetIndex = stepOrder.indexOf(step as TransactionStep)
    
    // Only allow moving to next step or going back
    if (targetIndex <= currentIndex + 1 && targetIndex >= 0) {
      setCurrentStep(step as TransactionStep)
      
      // Refresh gas estimation when entering gas step
      if (step === 'gas' && !gasEstimation.isLoading) {
        refreshGasEstimation()
      }
    }
  }

  const canProceed = (step: TransactionStep) => {
    switch (step) {
      case 'gas':
        return investment.investmentAmount > 0
      case 'confirm':
        return !gasEstimation.isLoading && !gasEstimation.error
      case 'processing':
        return false // No manual navigation to processing
      case 'success':
        return false // No manual navigation to success
      default:
        return true
    }
  }

  if (!connected) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Wallet Required</DialogTitle>
            <DialogDescription>
              Please connect your wallet to proceed with the investment.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 text-center">
            <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              You need to connect your wallet to make an investment.
            </p>
            <Button onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Investment Transaction
          </DialogTitle>
          <DialogDescription>
            Complete your investment in {investment.name}
          </DialogDescription>
        </DialogHeader>

        <Tabs 
          value={currentStep} 
          onValueChange={handleStepChange}
          className="flex-1 overflow-hidden"
        >
          <TabsList className="grid grid-cols-5 w-full">
            {Object.entries(TRANSACTION_STEPS).map(([key, step]) => {
              const Icon = step.icon
              const isActive = currentStep === key
              const stepOrder: TransactionStep[] = ['review', 'gas', 'confirm', 'processing', 'success']
              const isCompleted = stepOrder.indexOf(currentStep) > stepOrder.indexOf(key as TransactionStep)
              
              return (
                <TabsTrigger
                  key={key}
                  value={key}
                  disabled={!canProceed(key as TransactionStep)}
                  className={cn(
                    "flex flex-col gap-1 h-16 relative",
                    isCompleted && "text-green-600"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5",
                    isCompleted && "text-green-600"
                  )} />
                  <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1">
                      <CheckCircle className="h-4 w-4 text-green-600 bg-white rounded-full" />
                    </div>
                  )}
                </TabsTrigger>
              )
            })}
          </TabsList>

          <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-1">
            <TabsContent value="review" className="mt-6">
              <InvestmentReviewStep 
                investment={investment}
                onAmountChange={(amount) => {
                  // Update investment amount and tokens
                }}
              />
            </TabsContent>

            <TabsContent value="gas" className="mt-6">
              <GasEstimationStep 
                gasEstimation={gasEstimation}
                onRefreshGas={refreshGasEstimation}
              />
            </TabsContent>

            <TabsContent value="confirm" className="mt-6">
              <ConfirmationStep 
                investment={investment}
                gasEstimation={gasEstimation}
                onConfirm={processTransaction}
              />
            </TabsContent>

            <TabsContent value="processing" className="mt-6">
              <ProcessingStep progress={progress} />
            </TabsContent>

            <TabsContent value="success" className="mt-6">
              <SuccessStep 
                investment={investment}
                txHash={txHash}
              />
            </TabsContent>
          </div>
        </Tabs>

        {/* Navigation Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              const stepOrder: TransactionStep[] = ['review', 'gas', 'confirm', 'processing', 'success']
              const currentIndex = stepOrder.indexOf(currentStep)
              if (currentIndex > 0) {
                setCurrentStep(stepOrder[currentIndex - 1])
              }
            }}
            disabled={currentStep === 'review' || currentStep === 'processing'}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="text-sm text-muted-foreground">
            {connected ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Not connected'}
          </div>

          <Button
            onClick={() => {
              const stepOrder: TransactionStep[] = ['review', 'gas', 'confirm']
              const currentIndex = stepOrder.indexOf(currentStep)
              if (currentIndex < stepOrder.length - 1 && canProceed(stepOrder[currentIndex + 1])) {
                setCurrentStep(stepOrder[currentIndex + 1])
              } else if (currentStep === 'success') {
                onOpenChange(false)
              }
            }}
            disabled={
              currentStep === 'processing' || 
              (currentStep === 'confirm') ||
              !canProceed(currentStep)
            }
          >
            {currentStep === 'success' ? 'Close' : 'Next'}
            {currentStep !== 'success' && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Quick Investment Button with Modal
 */
export function InvestmentButton({
  investment,
  className,
}: {
  investment: PropertyInvestment
  className?: string
}) {
  const [modalOpen, setModalOpen] = useState(false)

  const handleComplete = (investment: PropertyInvestment, txHash: string) => {
    toast.success('Investment completed successfully!')
    console.log('Investment completed:', { investment, txHash })
  }

  return (
    <>
      <Button
        onClick={() => setModalOpen(true)}
        className={cn("bg-[#007BFF] hover:bg-[#0062CC]", className)}
      >
        <DollarSign className="h-4 w-4 mr-2" />
        Invest Now
      </Button>

      <TransactionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        investment={investment}
        onComplete={handleComplete}
      />
    </>
  )
}