/**
 * Enhanced Loading States Components - PropertyLend
 * Phase 4.2: Content Improvements
 * 
 * Meaningful loading states with contextual messages
 */

'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Loader2, RefreshCw, Database, Wallet, TrendingUp, Shield, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'

// Loading message configurations
const LOADING_MESSAGES = {
  // Data Loading
  fetchingPools: [
    'Loading investment opportunities...',
    'Fetching latest pool data...',
    'Analyzing yield rates...',
  ],
  fetchingTransactions: [
    'Loading transaction history...',
    'Fetching blockchain data...',
    'Organizing your activity...',
  ],
  fetchingPortfolio: [
    'Calculating your returns...',
    'Loading portfolio positions...',
    'Updating latest values...',
  ],
  fetchingStatistics: [
    'Gathering platform metrics...',
    'Calculating current APY...',
    'Loading real-time data...',
  ],
  
  // Transaction Processing
  connectingWallet: [
    'Connecting to your wallet...',
    'Establishing secure connection...',
    'Verifying wallet signature...',
  ],
  submittingTransaction: [
    'Preparing transaction...',
    'Waiting for wallet confirmation...',
    'Broadcasting to network...',
  ],
  processingDeposit: [
    'Processing your deposit...',
    'Allocating to lending pool...',
    'Confirming on blockchain...',
  ],
  processingWithdrawal: [
    'Processing withdrawal request...',
    'Calculating final returns...',
    'Preparing funds transfer...',
  ],
  
  // Authentication
  signingIn: [
    'Verifying credentials...',
    'Setting up secure session...',
    'Loading your profile...',
  ],
  verifyingKYC: [
    'Verifying identity documents...',
    'Running compliance checks...',
    'Finalizing verification...',
  ],
  
  // Smart Contract
  deployingContract: [
    'Deploying smart contract...',
    'Waiting for network confirmation...',
    'Verifying contract code...',
  ],
  interactingContract: [
    'Calling smart contract...',
    'Waiting for execution...',
    'Processing response...',
  ],
}

// Get random loading message
function getLoadingMessage(type: keyof typeof LOADING_MESSAGES): string {
  const messages = LOADING_MESSAGES[type] || ['Loading...']
  return messages[Math.floor(Math.random() * messages.length)]
}

// Loading spinner component
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  }
  
  return (
    <Loader2 className={cn('animate-spin text-purple-500', sizeClasses[size], className)} />
  )
}

// Inline loading state
interface InlineLoadingProps {
  message?: string
  className?: string
}

export function InlineLoading({ message = 'Loading...', className }: InlineLoadingProps) {
  return (
    <div className={cn('flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400', className)}>
      <LoadingSpinner size="sm" />
      <span>{message}</span>
    </div>
  )
}

// Full page loading
interface PageLoadingProps {
  message?: string
  type?: keyof typeof LOADING_MESSAGES
  icon?: ReactNode
}

export function PageLoading({ message, type, icon }: PageLoadingProps) {
  const displayMessage = message || (type && getLoadingMessage(type)) || 'Loading...'
  
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        {icon || <LoadingSpinner size="xl" />}
        <p className="text-lg text-gray-600 dark:text-gray-400">{displayMessage}</p>
      </div>
    </div>
  )
}

// Card loading skeleton with message
interface CardLoadingProps {
  message?: string
  type?: keyof typeof LOADING_MESSAGES
  className?: string
}

export function CardLoading({ message, type, className }: CardLoadingProps) {
  const displayMessage = message || (type && getLoadingMessage(type)) || 'Loading...'
  
  return (
    <Card className={cn('p-8', className)}>
      <div className="flex flex-col items-center justify-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-gray-600 dark:text-gray-400">{displayMessage}</p>
      </div>
    </Card>
  )
}

// Transaction loading with steps
interface TransactionLoadingProps {
  step: 'preparing' | 'signing' | 'submitting' | 'confirming' | 'complete'
  txHash?: string
  className?: string
}

export function TransactionLoading({ step, txHash, className }: TransactionLoadingProps) {
  const steps = {
    preparing: { icon: Database, message: 'Preparing transaction...', active: true },
    signing: { icon: Wallet, message: 'Please sign in your wallet...', active: true },
    submitting: { icon: RefreshCw, message: 'Submitting to blockchain...', active: true },
    confirming: { icon: Clock, message: 'Waiting for confirmation...', active: true },
    complete: { icon: Shield, message: 'Transaction complete!', active: false },
  }
  
  const currentStep = steps[step]
  const Icon = currentStep.icon
  
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-center">
        <div className="relative">
          <Icon className={cn(
            'h-12 w-12',
            currentStep.active ? 'text-purple-500 animate-pulse' : 'text-green-500'
          )} />
          {currentStep.active && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-4 border-purple-200 dark:border-purple-900 animate-ping" />
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-gray-900 dark:text-white">
          {currentStep.message}
        </p>
        {txHash && (
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono break-all">
            TX: {txHash}
          </p>
        )}
      </div>
      
      {step === 'signing' && (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Check your wallet for the signature request
        </p>
      )}
      
      {step === 'confirming' && (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          This usually takes 15-30 seconds
        </p>
      )}
    </div>
  )
}

// Data table loading
interface TableLoadingProps {
  rows?: number
  columns?: number
  className?: string
}

export function TableLoading({ rows = 5, columns = 4, className }: TableLoadingProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {/* Header */}
      <div className="grid gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-t-lg" 
           style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div 
          key={rowIndex}
          className="grid gap-4 p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  )
}

// Button loading state
interface ButtonLoadingProps {
  children: ReactNode
  loading?: boolean
  loadingText?: string
  className?: string
}

export function ButtonLoading({ 
  children, 
  loading = false, 
  loadingText = 'Processing...',
  className 
}: ButtonLoadingProps) {
  if (!loading) return <>{children}</>
  
  return (
    <span className={cn('flex items-center justify-center gap-2', className)}>
      <LoadingSpinner size="sm" />
      <span>{loadingText}</span>
    </span>
  )
}

// Lazy loading wrapper
interface LazyLoadingProps {
  loading: boolean
  error?: Error | null
  children: ReactNode
  fallback?: ReactNode
  errorFallback?: ReactNode
  className?: string
}

export function LazyLoading({ 
  loading, 
  error, 
  children, 
  fallback,
  errorFallback,
  className 
}: LazyLoadingProps) {
  if (error) {
    return (
      <div className={cn('text-center py-8', className)}>
        {errorFallback || (
          <>
            <p className="text-red-600 dark:text-red-400 mb-2">Failed to load content</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{error.message}</p>
          </>
        )}
      </div>
    )
  }
  
  if (loading) {
    return <>{fallback || <PageLoading />}</>
  }
  
  return <>{children}</>
}

// Progress loading with percentage
interface ProgressLoadingProps {
  progress: number
  message?: string
  className?: string
}

export function ProgressLoading({ progress, message = 'Loading...', className }: ProgressLoadingProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">{message}</span>
        <span className="font-medium text-gray-900 dark:text-white">{progress}%</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

// Export all loading components
export const Loading = {
  Spinner: LoadingSpinner,
  Inline: InlineLoading,
  Page: PageLoading,
  Card: CardLoading,
  Transaction: TransactionLoading,
  Table: TableLoading,
  Button: ButtonLoading,
  Lazy: LazyLoading,
  Progress: ProgressLoading,
}