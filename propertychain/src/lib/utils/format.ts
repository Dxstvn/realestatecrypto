/**
 * Formatting Utilities
 * Functions for formatting numbers, currency, dates, etc.
 */

export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  decimals: number = 2
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount)
}

export function formatNumber(
  value: number,
  decimals: number = 0
): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatPercentage(
  value: number,
  decimals: number = 2
): string {
  return `${value >= 0 ? '+' : ''}${formatNumber(value, decimals)}%`
}

export function formatCompactNumber(value: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  })
  return formatter.format(value)
}

export function formatAddress(address: string, startChars: number = 6, endChars: number = 4): string {
  if (address.length <= startChars + endChars) return address
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}

export function formatTokenAmount(
  amount: string | number,
  decimals: number = 18,
  displayDecimals: number = 4
): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  const divisor = Math.pow(10, decimals)
  const formatted = (num / divisor).toFixed(displayDecimals)
  return parseFloat(formatted).toString() // Remove trailing zeros
}

export function formatDate(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = date instanceof Date ? date : new Date(date)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(dateObj)
}

export function formatTimeAgo(date: Date | string | number): string {
  const dateObj = date instanceof Date ? date : new Date(date)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ]
  
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds)
    if (count >= 1) {
      return count === 1 
        ? `${count} ${interval.label} ago`
        : `${count} ${interval.label}s ago`
    }
  }
  
  return 'just now'
}

/**
 * Format a date/time as time only
 */
export function formatTime(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = new Date(date)
  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...options
  }
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj)
}