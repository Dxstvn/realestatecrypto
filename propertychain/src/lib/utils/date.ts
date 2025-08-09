/**
 * Date Utilities - PropertyChain
 * 
 * Date formatting and manipulation functions using date-fns
 */

import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns'

/**
 * Format date for display
 */
export function formatDate(date: Date | string, pattern: string = 'MMM d, yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(dateObj)) return 'Invalid date'
  return format(dateObj, pattern)
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date | string): string {
  return formatDate(date, 'MMM d, yyyy h:mm a')
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(dateObj)) return 'Invalid date'
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

/**
 * Format date for financial reports
 */
export function formatFinancialDate(date: Date | string): string {
  return formatDate(date, 'yyyy-MM-dd')
}

/**
 * Format date for property listings
 */
export function formatListingDate(date: Date | string): string {
  return formatDate(date, 'MMMM d, yyyy')
}

/**
 * Get current timestamp
 */
export function getCurrentTimestamp(): number {
  return Date.now()
}

/**
 * Check if date is in the past
 */
export function isPastDate(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return isValid(dateObj) && dateObj < new Date()
}

/**
 * Format duration in minutes to readable format
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

/**
 * Get age from date of birth
 */
export function getAge(dateOfBirth: Date | string): number {
  const birthDate = typeof dateOfBirth === 'string' ? parseISO(dateOfBirth) : dateOfBirth
  if (!isValid(birthDate)) return 0
  
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}