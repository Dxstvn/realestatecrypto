/**
 * Transaction Timeline Component - PropertyChain
 * 
 * Visual timeline for tracking transaction/investment progress
 * Part of RECOVERY_PLAN.md Step 2.3
 */

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  CheckCircle,
  Circle,
  Clock,
  AlertCircle,
  XCircle,
  ArrowRight,
  FileText,
  DollarSign,
  Shield,
  Wallet,
  Building,
  Receipt,
  TrendingUp,
  Key,
  Users,
  Zap,
  Activity,
  Lock,
  Unlock,
  RefreshCw,
  ExternalLink,
  Info,
} from 'lucide-react'
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/format'

// ============================================================================
// Types
// ============================================================================

export interface TransactionStage {
  id: string
  title: string
  description: string
  icon: React.ElementType
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'skipped'
  timestamp?: Date
  details?: Record<string, any>
  txHash?: string
  error?: string
}

export interface TransactionTimelineProps {
  stages: TransactionStage[]
  currentStage?: number
  orientation?: 'vertical' | 'horizontal'
  variant?: 'default' | 'compact' | 'detailed'
  showProgress?: boolean
  className?: string
}

export interface InvestmentMilestone {
  id: string
  title: string
  date: Date
  amount?: number
  type: 'investment' | 'dividend' | 'exit' | 'reinvestment' | 'distribution'
  status: 'upcoming' | 'completed' | 'processing'
  description?: string
}

export interface InvestmentTimelineProps {
  propertyId: string
  investmentAmount: number
  milestones: InvestmentMilestone[]
  className?: string
}

// ============================================================================
// Transaction Timeline Component
// ============================================================================

export function TransactionTimeline({
  stages,
  currentStage = 0,
  orientation = 'vertical',
  variant = 'default',
  showProgress = true,
  className,
}: TransactionTimelineProps) {
  const completedStages = stages.filter(s => s.status === 'completed').length
  const progressPercentage = (completedStages / stages.length) * 100
  
  // Get status icon
  const getStatusIcon = (status: TransactionStage['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'in-progress':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'skipped':
        return <Circle className="h-5 w-5 text-gray-300" />
      default:
        return <Circle className="h-5 w-5 text-gray-400" />
    }
  }
  
  // Get status color
  const getStatusColor = (status: TransactionStage['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'in-progress':
        return 'bg-blue-500'
      case 'failed':
        return 'bg-red-500'
      case 'skipped':
        return 'bg-gray-300'
      default:
        return 'bg-gray-400'
    }
  }
  
  if (orientation === 'horizontal') {
    return (
      <div className={cn('w-full', className)}>
        {showProgress && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Transaction Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}
        
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-8 left-8 right-8 h-0.5 bg-border" />
          
          {/* Stages */}
          <div className="relative flex justify-between">
            {stages.map((stage, index) => {
              const Icon = stage.icon
              const isActive = index === currentStage
              
              return (
                <div
                  key={stage.id}
                  className={cn(
                    'flex flex-col items-center',
                    variant === 'compact' ? 'w-16' : 'flex-1'
                  )}
                >
                  {/* Icon Circle */}
                  <div className={cn(
                    'relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-2 bg-background transition-all',
                    stage.status === 'completed' && 'border-green-500 bg-green-50',
                    stage.status === 'in-progress' && 'border-blue-500 bg-blue-50 animate-pulse',
                    stage.status === 'failed' && 'border-red-500 bg-red-50',
                    stage.status === 'pending' && 'border-gray-300',
                    isActive && 'ring-4 ring-primary/20'
                  )}>
                    {stage.status === 'completed' ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : stage.status === 'in-progress' ? (
                      <RefreshCw className="h-6 w-6 text-blue-500 animate-spin" />
                    ) : stage.status === 'failed' ? (
                      <XCircle className="h-6 w-6 text-red-500" />
                    ) : (
                      <Icon className={cn(
                        'h-6 w-6',
                        stage.status === 'pending' ? 'text-gray-400' : 'text-gray-300'
                      )} />
                    )}
                  </div>
                  
                  {/* Stage Info */}
                  {variant !== 'compact' && (
                    <div className="mt-3 text-center">
                      <p className={cn(
                        'text-sm font-medium',
                        stage.status === 'completed' && 'text-green-600',
                        stage.status === 'in-progress' && 'text-blue-600',
                        stage.status === 'failed' && 'text-red-600',
                        stage.status === 'pending' && 'text-muted-foreground'
                      )}>
                        {stage.title}
                      </p>
                      {variant === 'detailed' && (
                        <>
                          <p className="text-xs text-muted-foreground mt-1">
                            {stage.description}
                          </p>
                          {stage.timestamp && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {stage.timestamp.toLocaleTimeString()}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
  
  // Vertical orientation
  return (
    <div className={cn('space-y-4', className)}>
      {showProgress && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Transaction Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      )}
      
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-border" />
        
        {/* Stages */}
        <div className="space-y-6">
          {stages.map((stage, index) => {
            const Icon = stage.icon
            const isActive = index === currentStage
            const isLast = index === stages.length - 1
            
            return (
              <div key={stage.id} className="relative flex gap-4">
                {/* Icon Circle */}
                <div className={cn(
                  'relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-2 bg-background flex-shrink-0 transition-all',
                  stage.status === 'completed' && 'border-green-500 bg-green-50',
                  stage.status === 'in-progress' && 'border-blue-500 bg-blue-50 animate-pulse',
                  stage.status === 'failed' && 'border-red-500 bg-red-50',
                  stage.status === 'pending' && 'border-gray-300',
                  isActive && 'ring-4 ring-primary/20'
                )}>
                  {stage.status === 'completed' ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : stage.status === 'in-progress' ? (
                    <RefreshCw className="h-6 w-6 text-blue-500 animate-spin" />
                  ) : stage.status === 'failed' ? (
                    <XCircle className="h-6 w-6 text-red-500" />
                  ) : (
                    <Icon className={cn(
                      'h-6 w-6',
                      stage.status === 'pending' ? 'text-gray-400' : 'text-gray-300'
                    )} />
                  )}
                </div>
                
                {/* Content */}
                <div className={cn(
                  'flex-1 pb-6',
                  isLast && 'pb-0'
                )}>
                  <div className={cn(
                    'p-4 rounded-lg border transition-all',
                    stage.status === 'completed' && 'border-green-200 bg-green-50/50',
                    stage.status === 'in-progress' && 'border-blue-200 bg-blue-50/50',
                    stage.status === 'failed' && 'border-red-200 bg-red-50/50',
                    stage.status === 'pending' && 'border-gray-200',
                    isActive && 'shadow-md'
                  )}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className={cn(
                          'font-medium',
                          stage.status === 'completed' && 'text-green-900',
                          stage.status === 'in-progress' && 'text-blue-900',
                          stage.status === 'failed' && 'text-red-900'
                        )}>
                          {stage.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {stage.description}
                        </p>
                      </div>
                      <Badge variant={
                        stage.status === 'completed' ? 'default' :
                        stage.status === 'in-progress' ? 'secondary' :
                        stage.status === 'failed' ? 'destructive' :
                        'outline'
                      }>
                        {stage.status}
                      </Badge>
                    </div>
                    
                    {/* Details */}
                    {variant === 'detailed' && stage.details && (
                      <div className="mt-3 space-y-1 text-sm">
                        {Object.entries(stage.details).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-muted-foreground capitalize">
                              {key.replace(/_/g, ' ')}:
                            </span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Transaction Hash */}
                    {stage.txHash && (
                      <div className="mt-3 flex items-center gap-2">
                        <code className="text-xs bg-background px-2 py-1 rounded flex-1 truncate">
                          {stage.txHash}
                        </code>
                        <Button size="sm" variant="ghost" asChild>
                          <a href={`https://etherscan.io/tx/${stage.txHash}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    )}
                    
                    {/* Error Message */}
                    {stage.error && (
                      <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded text-sm text-red-700">
                        {stage.error}
                      </div>
                    )}
                    
                    {/* Timestamp */}
                    {stage.timestamp && (
                      <p className="text-xs text-muted-foreground mt-3">
                        {stage.timestamp.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Investment Timeline Component
// ============================================================================

export function InvestmentTimeline({
  propertyId,
  investmentAmount,
  milestones,
  className,
}: InvestmentTimelineProps) {
  const getMilestoneIcon = (type: InvestmentMilestone['type']) => {
    switch (type) {
      case 'investment':
        return DollarSign
      case 'dividend':
        return TrendingUp
      case 'exit':
        return Unlock
      case 'reinvestment':
        return RefreshCw
      case 'distribution':
        return Receipt
      default:
        return Circle
    }
  }
  
  const getMilestoneColor = (status: InvestmentMilestone['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'processing':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'upcoming':
        return 'text-gray-600 bg-gray-50 border-gray-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Investment Timeline</CardTitle>
        <CardDescription>
          Track your investment milestones and distributions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-border" />
          
          {/* Milestones */}
          <div className="space-y-6">
            {milestones.map((milestone, index) => {
              const Icon = getMilestoneIcon(milestone.type)
              const isLast = index === milestones.length - 1
              
              return (
                <div key={milestone.id} className="relative flex gap-4">
                  {/* Icon */}
                  <div className={cn(
                    'relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2',
                    getMilestoneColor(milestone.status)
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  {/* Content */}
                  <div className={cn('flex-1', !isLast && 'pb-6')}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{milestone.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {milestone.date.toLocaleDateString()}
                        </p>
                        {milestone.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {milestone.description}
                          </p>
                        )}
                      </div>
                      {milestone.amount && (
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(milestone.amount)}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatPercentage(milestone.amount / investmentAmount)}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Status Badge */}
                    <Badge 
                      variant={
                        milestone.status === 'completed' ? 'default' :
                        milestone.status === 'processing' ? 'secondary' :
                        'outline'
                      }
                      className="mt-2"
                    >
                      {milestone.status}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// Quick Transaction Status Component
// ============================================================================

export function TransactionStatus({
  status,
  txHash,
  message,
  className,
}: {
  status: 'pending' | 'processing' | 'completed' | 'failed'
  txHash?: string
  message?: string
  className?: string
}) {
  return (
    <div className={cn(
      'flex items-center gap-3 p-4 rounded-lg border',
      status === 'completed' && 'bg-green-50 border-green-200',
      status === 'processing' && 'bg-blue-50 border-blue-200',
      status === 'failed' && 'bg-red-50 border-red-200',
      status === 'pending' && 'bg-yellow-50 border-yellow-200',
      className
    )}>
      {status === 'completed' && <CheckCircle className="h-5 w-5 text-green-600" />}
      {status === 'processing' && <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />}
      {status === 'failed' && <XCircle className="h-5 w-5 text-red-600" />}
      {status === 'pending' && <Clock className="h-5 w-5 text-yellow-600" />}
      
      <div className="flex-1">
        <p className="font-medium">
          {status === 'completed' && 'Transaction Successful'}
          {status === 'processing' && 'Processing Transaction'}
          {status === 'failed' && 'Transaction Failed'}
          {status === 'pending' && 'Transaction Pending'}
        </p>
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
      </div>
      
      {txHash && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="ghost" asChild>
                <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View on Etherscan</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}