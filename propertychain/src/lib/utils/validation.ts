/**
 * Validation Utilities - PropertyChain
 * 
 * Input validation and sanitization functions
 * Following Section 0 principles with security-first approach
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate wallet address format (Ethereum)
 */
export function isValidWalletAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)
}

/**
 * Validate phone number format
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(phone.replace(/[\s()-]/g, ''))
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>"'&]/g, '')
}

/**
 * Validate numeric input within range
 */
export function isValidNumber(value: number, min?: number, max?: number): boolean {
  if (isNaN(value)) return false
  if (min !== undefined && value < min) return false
  if (max !== undefined && value > max) return false
  return true
}

/**
 * Validate investment amount
 */
export function isValidInvestmentAmount(amount: number): boolean {
  return isValidNumber(amount, 100, 10000000) // $100 min, $10M max
}

/**
 * Validate property price
 */
export function isValidPropertyPrice(price: number): boolean {
  return isValidNumber(price, 50000, 100000000) // $50K min, $100M max
}

/**
 * Check if string is empty or whitespace only
 */
export function isEmpty(value: string): boolean {
  return !value || value.trim().length === 0
}