/**
 * Investment Type Definitions
 * Types for investment transactions and portfolio management
 */

export interface Investment {
  id: string
  userId: string
  propertyId: string
  transactionHash?: string // Blockchain transaction
  tokens: number
  amount: number
  pricePerToken: number
  type: InvestmentType
  status: InvestmentStatus
  createdAt: Date
  completedAt?: Date
}

export type InvestmentType = 
  | 'purchase'
  | 'sale'
  | 'transfer'
  | 'dividend'

export type InvestmentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'

export interface Portfolio {
  userId: string
  totalValue: number
  totalInvested: number
  totalReturns: number
  roi: number
  holdings: PropertyHolding[]
  transactions: Transaction[]
  performance: PortfolioPerformance
}

export interface PropertyHolding {
  propertyId: string
  tokens: number
  value: number
  purchasePrice: number
  currentPrice: number
  returns: number
  dividends: number
  ownership: number // Percentage
}

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  status: TransactionStatus
  hash?: string
  gasUsed?: number
  blockNumber?: number
  timestamp: Date
  details: Record<string, unknown>
}

export type TransactionType = 
  | 'deposit'
  | 'withdrawal'
  | 'purchase'
  | 'sale'
  | 'dividend'
  | 'fee'

export type TransactionStatus = 
  | 'pending'
  | 'confirmed'
  | 'failed'

export interface PortfolioPerformance {
  daily: PerformanceMetric
  weekly: PerformanceMetric
  monthly: PerformanceMetric
  yearly: PerformanceMetric
  allTime: PerformanceMetric
}

export interface PerformanceMetric {
  value: number
  change: number
  changePercent: number
  high: number
  low: number
}