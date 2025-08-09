/**
 * Dashboard Type Definitions
 * Types for investor and admin dashboards
 */

export interface DashboardMetrics {
  overview: OverviewMetrics
  properties: PropertyMetrics
  investments: InvestmentMetrics
  users?: UserMetrics // Admin only
}

export interface OverviewMetrics {
  totalValue: number
  totalReturn: number
  monthlyIncome: number
  activeInvestments: number
  roi: number
  trending: TrendData
}

export interface PropertyMetrics {
  total: number
  active: number
  funded: number
  totalValue: number
  averageYield: number
  occupancyRate: number
}

export interface InvestmentMetrics {
  totalInvested: number
  totalReturns: number
  pendingReturns: number
  averageInvestment: number
  largestInvestment: number
  recentTransactions: number
}

export interface UserMetrics {
  totalUsers: number
  activeUsers: number
  newUsers: number
  verifiedUsers: number
  conversionRate: number
  averageInvestment: number
}

export interface TrendData {
  period: 'day' | 'week' | 'month' | 'year'
  current: number
  previous: number
  change: number
  changePercent: number
  data: DataPoint[]
}

export interface DataPoint {
  timestamp: Date
  value: number
  label?: string
}

export interface ChartData {
  labels: string[]
  datasets: Dataset[]
}

export interface Dataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  borderWidth?: number
  fill?: boolean
}

export interface AdminAction {
  id: string
  type: AdminActionType
  target: string
  targetType: 'property' | 'user' | 'investment'
  performedBy: string
  timestamp: Date
  details: Record<string, unknown>
}

export type AdminActionType = 
  | 'approve'
  | 'reject'
  | 'suspend'
  | 'activate'
  | 'update'
  | 'delete'
  | 'verify'