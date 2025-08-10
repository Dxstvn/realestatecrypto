/**
 * Format Utilities - PropertyChain
 * 
 * Centralized formatting functions for consistent display
 * Following Section 0 principles
 */

/**
 * Format currency values
 */
export function formatCurrency(
  amount: number,
  options?: {
    currency?: string
    locale?: string
    minimumFractionDigits?: number
    maximumFractionDigits?: number
    compact?: boolean
  }
): string {
  const {
    currency = 'USD',
    locale = 'en-US',
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    compact = false,
  } = options || {}

  if (compact && amount >= 1000000) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(amount / 1000000) + 'M'
  }

  if (compact && amount >= 1000) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount / 1000) + 'K'
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount)
}

/**
 * Format percentage values
 */
export function formatPercentage(
  value: number,
  options?: {
    minimumFractionDigits?: number
    maximumFractionDigits?: number
    includeSign?: boolean
  }
): string {
  const {
    minimumFractionDigits = 1,
    maximumFractionDigits = 1,
    includeSign = false,
  } = options || {}

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value / 100)

  if (includeSign && value > 0) {
    return '+' + formatted
  }

  return formatted
}

/**
 * Format number with commas
 */
export function formatNumber(
  value: number,
  options?: {
    minimumFractionDigits?: number
    maximumFractionDigits?: number
    locale?: string
  }
): string {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    locale = 'en-US',
  } = options || {}

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value)
}

/**
 * Format date
 */
export function formatDate(
  date: Date | string | number,
  options?: {
    format?: 'short' | 'medium' | 'long' | 'full'
    includeTime?: boolean
    locale?: string
  }
): string {
  const {
    format = 'medium',
    includeTime = false,
    locale = 'en-US',
  } = options || {}

  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? 'numeric' : format === 'medium' ? 'short' : 'long',
    day: 'numeric',
  }

  if (includeTime) {
    dateOptions.hour = 'numeric'
    dateOptions.minute = '2-digit'
  }

  return new Intl.DateTimeFormat(locale, dateOptions).format(dateObj)
}

/**
 * Format relative time (e.g., "2 days ago", "in 3 hours")
 */
export function formatRelativeTime(
  date: Date | string | number,
  baseDate: Date = new Date()
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date
  
  const diffInSeconds = Math.floor((dateObj.getTime() - baseDate.getTime()) / 1000)
  const absDiff = Math.abs(diffInSeconds)
  
  const units: Array<[number, Intl.RelativeTimeFormatUnit]> = [
    [60, 'second'],
    [60, 'minute'],
    [24, 'hour'],
    [30, 'day'],
    [12, 'month'],
    [Infinity, 'year'],
  ]
  
  let value = absDiff
  let unit: Intl.RelativeTimeFormatUnit = 'second'
  
  for (const [threshold, nextUnit] of units) {
    if (value < threshold) {
      unit = nextUnit
      break
    }
    value = Math.floor(value / threshold)
  }
  
  const rtf = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' })
  return rtf.format(diffInSeconds < 0 ? -value : value, unit)
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

/**
 * Format wallet address
 */
export function formatAddress(
  address: string,
  options?: {
    start?: number
    end?: number
  }
): string {
  const { start = 6, end = 4 } = options || {}
  
  if (address.length <= start + end) {
    return address
  }
  
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

/**
 * Format duration
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const parts = []
  
  if (hours > 0) {
    parts.push(`${hours}h`)
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`)
  }
  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs}s`)
  }

  return parts.join(' ')
}

/**
 * Format time only
 */
export function formatTime(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date
    
  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...options
  }
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj)
}

/**
 * Pluralize word based on count
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string
): string {
  if (count === 1) {
    return `${count} ${singular}`
  }
  return `${count} ${plural || singular + 's'}`
}