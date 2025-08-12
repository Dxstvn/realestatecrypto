/**
 * Statistics Content & Labels - PropertyLend
 * Phase 4.2: Content Improvements
 * 
 * Clear, consistent labels for all statistics across the platform
 */

export interface StatisticLabel {
  key: string
  label: string
  shortLabel?: string
  description: string
  tooltip?: string
  format?: 'currency' | 'percentage' | 'number' | 'compact'
  suffix?: string
  prefix?: string
}

// Platform-wide statistics labels
export const STATISTICS_LABELS: Record<string, StatisticLabel> = {
  // Financial Metrics
  tvl: {
    key: 'tvl',
    label: 'Total Value Locked',
    shortLabel: 'TVL',
    description: 'Total amount of capital currently invested in all lending pools',
    tooltip: 'TVL represents the total USD value of all stablecoins deposited across all active lending pools on the platform',
    format: 'currency',
    prefix: '$',
  },
  totalDeposits: {
    key: 'totalDeposits',
    label: 'Total Deposits',
    shortLabel: 'Deposits',
    description: 'Cumulative deposits made to the platform',
    tooltip: 'The total amount of stablecoins that have been deposited into PropertyLend pools since inception',
    format: 'currency',
    prefix: '$',
  },
  totalLoans: {
    key: 'totalLoans',
    label: 'Total Loans Funded',
    shortLabel: 'Loans Funded',
    description: 'Total value of real estate loans funded',
    tooltip: 'The cumulative value of all bridge loans that have been funded through the platform',
    format: 'currency',
    prefix: '$',
  },
  totalYield: {
    key: 'totalYield',
    label: 'Total Yield Generated',
    shortLabel: 'Yield Generated',
    description: 'Total returns generated for lenders',
    tooltip: 'The cumulative interest and returns generated for all lenders on the platform',
    format: 'currency',
    prefix: '$',
  },

  // APY & Returns
  averageApy: {
    key: 'averageApy',
    label: 'Average APY',
    shortLabel: 'Avg APY',
    description: 'Platform-wide average annual percentage yield',
    tooltip: 'The weighted average APY across all active lending pools, including both senior and junior tranches',
    format: 'percentage',
    suffix: '%',
  },
  seniorApy: {
    key: 'seniorApy',
    label: 'Senior Tranche APY',
    shortLabel: 'Senior APY',
    description: 'Fixed annual yield for senior tranche investors',
    tooltip: 'Senior tranches offer stable, fixed returns with priority payment protection. Currently offering 8% APY',
    format: 'percentage',
    suffix: '%',
  },
  juniorApy: {
    key: 'juniorApy',
    label: 'Junior Tranche APY',
    shortLabel: 'Junior APY',
    description: 'Variable yield range for junior tranche investors',
    tooltip: 'Junior tranches offer higher, variable returns (20-30% APY) with subordinated payment priority',
    format: 'percentage',
    suffix: '%',
  },
  historicalApy: {
    key: 'historicalApy',
    label: 'Historical Average APY',
    shortLabel: 'Historical APY',
    description: 'Average returns since platform launch',
    tooltip: 'The all-time average APY achieved across all completed lending pools',
    format: 'percentage',
    suffix: '%',
  },

  // User Metrics
  activeUsers: {
    key: 'activeUsers',
    label: 'Active Users',
    shortLabel: 'Users',
    description: 'Number of users with active positions',
    tooltip: 'Total number of unique wallets currently holding positions in one or more lending pools',
    format: 'number',
  },
  totalUsers: {
    key: 'totalUsers',
    label: 'Total Users',
    shortLabel: 'All Users',
    description: 'Total registered platform users',
    tooltip: 'The total number of unique wallets that have ever interacted with the platform',
    format: 'number',
  },
  activeLenders: {
    key: 'activeLenders',
    label: 'Active Lenders',
    shortLabel: 'Lenders',
    description: 'Lenders with current investments',
    tooltip: 'Number of lenders currently providing capital to one or more lending pools',
    format: 'number',
  },
  activeBorrowers: {
    key: 'activeBorrowers',
    label: 'Active Borrowers',
    shortLabel: 'Borrowers',
    description: 'Borrowers with outstanding loans',
    tooltip: 'Number of real estate developers currently with active bridge loans',
    format: 'number',
  },

  // Pool Metrics
  activePools: {
    key: 'activePools',
    label: 'Active Lending Pools',
    shortLabel: 'Active Pools',
    description: 'Currently open investment opportunities',
    tooltip: 'Number of lending pools currently accepting deposits or with active loans',
    format: 'number',
  },
  completedPools: {
    key: 'completedPools',
    label: 'Completed Pools',
    shortLabel: 'Completed',
    description: 'Successfully closed lending pools',
    tooltip: 'Total number of lending pools that have been fully repaid and closed',
    format: 'number',
  },
  fundingProgress: {
    key: 'fundingProgress',
    label: 'Average Funding Progress',
    shortLabel: 'Funding',
    description: 'Average pool funding completion',
    tooltip: 'The average percentage of target funding achieved across all active pools',
    format: 'percentage',
    suffix: '%',
  },
  poolUtilization: {
    key: 'poolUtilization',
    label: 'Pool Utilization Rate',
    shortLabel: 'Utilization',
    description: 'Percentage of available capital deployed',
    tooltip: 'The percentage of total deposited capital that is currently deployed in active loans',
    format: 'percentage',
    suffix: '%',
  },

  // Risk Metrics
  defaultRate: {
    key: 'defaultRate',
    label: 'Default Rate',
    shortLabel: 'Defaults',
    description: 'Historical loan default rate',
    tooltip: 'The percentage of loans that have defaulted relative to total loans issued. PropertyLend maintains industry-leading low default rates',
    format: 'percentage',
    suffix: '%',
  },
  ltv: {
    key: 'ltv',
    label: 'Average Loan-to-Value',
    shortLabel: 'Avg LTV',
    description: 'Average LTV ratio across all loans',
    tooltip: 'The average loan amount as a percentage of property value. Lower LTV means better collateralization',
    format: 'percentage',
    suffix: '%',
  },
  collateralValue: {
    key: 'collateralValue',
    label: 'Total Collateral Value',
    shortLabel: 'Collateral',
    description: 'Total value of real estate backing loans',
    tooltip: 'The combined appraised value of all real estate properties securing active loans',
    format: 'currency',
    prefix: '$',
  },
  recoveryRate: {
    key: 'recoveryRate',
    label: 'Recovery Rate',
    shortLabel: 'Recovery',
    description: 'Average recovery on defaulted loans',
    tooltip: 'The average percentage of principal recovered through collateral liquidation in default scenarios',
    format: 'percentage',
    suffix: '%',
  },

  // Transaction Metrics
  dailyVolume: {
    key: 'dailyVolume',
    label: '24h Transaction Volume',
    shortLabel: '24h Volume',
    description: 'Total transaction volume in last 24 hours',
    tooltip: 'The total value of deposits, withdrawals, and loan transactions in the past 24 hours',
    format: 'currency',
    prefix: '$',
  },
  weeklyVolume: {
    key: 'weeklyVolume',
    label: '7-Day Volume',
    shortLabel: '7d Volume',
    description: 'Total transaction volume in last 7 days',
    tooltip: 'The total value of all platform transactions in the past week',
    format: 'currency',
    prefix: '$',
  },
  transactionCount: {
    key: 'transactionCount',
    label: 'Total Transactions',
    shortLabel: 'Transactions',
    description: 'Total number of platform transactions',
    tooltip: 'The cumulative number of all deposits, withdrawals, and loan transactions',
    format: 'compact',
  },
  averageTransaction: {
    key: 'averageTransaction',
    label: 'Average Transaction Size',
    shortLabel: 'Avg Transaction',
    description: 'Average value per transaction',
    tooltip: 'The average USD value of transactions on the platform',
    format: 'currency',
    prefix: '$',
  },

  // Time Metrics
  averageLoanDuration: {
    key: 'averageLoanDuration',
    label: 'Average Loan Duration',
    shortLabel: 'Loan Duration',
    description: 'Average bridge loan term length',
    tooltip: 'The average duration of bridge loans, typically 6-18 months',
    format: 'number',
    suffix: ' months',
  },
  timeToFund: {
    key: 'timeToFund',
    label: 'Average Time to Fund',
    shortLabel: 'Funding Time',
    description: 'Average time for pools to reach target',
    tooltip: 'The average time it takes for a lending pool to reach its funding target',
    format: 'number',
    suffix: ' days',
  },
  platformUptime: {
    key: 'platformUptime',
    label: 'Platform Uptime',
    shortLabel: 'Uptime',
    description: 'System availability percentage',
    tooltip: 'The percentage of time the platform has been operational without interruption',
    format: 'percentage',
    suffix: '%',
  },
}

// Helper function to get formatted label
export function getStatisticLabel(key: string, useShort = false): string {
  const stat = STATISTICS_LABELS[key]
  if (!stat) return key
  return useShort && stat.shortLabel ? stat.shortLabel : stat.label
}

// Helper function to format statistic value
export function formatStatisticValue(key: string, value: number): string {
  const stat = STATISTICS_LABELS[key]
  if (!stat) return value.toString()

  const prefix = stat.prefix || ''
  const suffix = stat.suffix || ''

  switch (stat.format) {
    case 'currency':
      if (value >= 1e9) {
        return `${prefix}${(value / 1e9).toFixed(2)}B`
      } else if (value >= 1e6) {
        return `${prefix}${(value / 1e6).toFixed(2)}M`
      } else if (value >= 1e3) {
        return `${prefix}${(value / 1e3).toFixed(2)}K`
      }
      return `${prefix}${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    
    case 'percentage':
      return `${value.toFixed(2)}${suffix}`
    
    case 'compact':
      if (value >= 1e9) {
        return `${(value / 1e9).toFixed(2)}B`
      } else if (value >= 1e6) {
        return `${(value / 1e6).toFixed(2)}M`
      } else if (value >= 1e3) {
        return `${(value / 1e3).toFixed(2)}K`
      }
      return value.toLocaleString('en-US')
    
    case 'number':
    default:
      return `${value.toLocaleString('en-US')}${suffix}`
  }
}

// Sample data for development/demo
export const SAMPLE_STATISTICS = {
  tvl: 125847293,
  totalDeposits: 458392847,
  totalLoans: 385729384,
  totalYield: 28473829,
  averageApy: 14.75,
  seniorApy: 8.0,
  juniorApy: 25.5,
  historicalApy: 13.2,
  activeUsers: 8439,
  totalUsers: 24893,
  activeLenders: 7234,
  activeBorrowers: 142,
  activePools: 42,
  completedPools: 128,
  fundingProgress: 78.5,
  poolUtilization: 92.3,
  defaultRate: 0.02,
  ltv: 65.0,
  collateralValue: 523948573,
  recoveryRate: 98.5,
  dailyVolume: 4829384,
  weeklyVolume: 28394857,
  transactionCount: 482938,
  averageTransaction: 15420,
  averageLoanDuration: 9.5,
  timeToFund: 3.2,
  platformUptime: 99.99,
}