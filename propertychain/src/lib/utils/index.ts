/**
 * Utility Functions Index
 * Central export for all utility functions
 */

// Keep existing shadcn cn function
export { cn } from './cn'

// Export format utilities
export {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatCompactNumber,
  formatAddress,
  formatTokenAmount,
  formatTimeAgo
} from './format'

// Export date utilities with renamed formatDate
export {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatFinancialDate,
  formatListingDate,
  getCurrentTimestamp,
  isPastDate,
  formatDuration,
  getAge
} from './date'

// Export other utilities
export * from './validation'
export * from './crypto'
export * from './api'