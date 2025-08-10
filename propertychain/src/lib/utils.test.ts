/**
 * Utility Functions Tests - PropertyChain
 * 
 * Unit tests for utility functions
 * Following UpdatedUIPlan.md Step 59 specifications and CLAUDE.md principles
 */

import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('Utils', () => {
  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      const result = cn('base-class', 'additional-class')
      expect(result).toBe('base-class additional-class')
    })

    it('should handle conditional classes', () => {
      const isActive = true
      const isDisabled = false
      
      const result = cn(
        'base',
        isActive && 'active',
        isDisabled && 'disabled'
      )
      
      expect(result).toBe('base active')
    })

    it('should handle undefined and null values', () => {
      const result = cn('base', undefined, null, 'end')
      expect(result).toBe('base end')
    })

    it('should merge Tailwind classes correctly', () => {
      const result = cn('px-2 py-1', 'px-4')
      expect(result).toBe('py-1 px-4')
    })

    it('should handle arrays of classes', () => {
      const classes = ['class1', 'class2']
      const result = cn(...classes, 'class3')
      expect(result).toBe('class1 class2 class3')
    })

    it('should handle empty inputs', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('should handle objects with boolean values', () => {
      const result = cn({
        'base': true,
        'active': true,
        'disabled': false,
      })
      expect(result).toBe('base active')
    })
  })
})

// Format utilities tests
describe('Format Utilities', () => {
  describe('formatCurrency', () => {
    it('should format USD currency correctly', () => {
      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount)
      }

      expect(formatCurrency(1000)).toBe('$1,000.00')
      expect(formatCurrency(1234567.89)).toBe('$1,234,567.89')
      expect(formatCurrency(0)).toBe('$0.00')
    })
  })

  describe('formatDate', () => {
    it('should format dates correctly', () => {
      const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(date)
      }

      const testDate = new Date('2024-01-15')
      expect(formatDate(testDate)).toBe('January 15, 2024')
    })
  })

  describe('formatAddress', () => {
    it('should format property address correctly', () => {
      const formatAddress = (address: {
        street: string
        city: string
        state: string
        zipCode: string
      }) => {
        return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`
      }

      const address = {
        street: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
      }

      expect(formatAddress(address)).toBe('123 Main St, San Francisco, CA 94105')
    })
  })

  describe('formatPercentage', () => {
    it('should format percentages correctly', () => {
      const formatPercentage = (value: number, decimals = 2) => {
        return `${value.toFixed(decimals)}%`
      }

      expect(formatPercentage(25.5)).toBe('25.50%')
      expect(formatPercentage(100)).toBe('100.00%')
      expect(formatPercentage(0.5, 1)).toBe('0.5%')
    })
  })
})

// Validation utilities tests
describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('should validate email addresses', () => {
      const isValidEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
      }

      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('invalid.email')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
    })
  })

  describe('isValidWalletAddress', () => {
    it('should validate Ethereum wallet addresses', () => {
      const isValidWalletAddress = (address: string) => {
        return /^0x[a-fA-F0-9]{40}$/.test(address)
      }

      expect(isValidWalletAddress('0x1234567890123456789012345678901234567890')).toBe(true)
      expect(isValidWalletAddress('0x123')).toBe(false)
      expect(isValidWalletAddress('not-a-wallet')).toBe(false)
    })
  })

  describe('isValidPhoneNumber', () => {
    it('should validate US phone numbers', () => {
      const isValidPhoneNumber = (phone: string) => {
        const cleaned = phone.replace(/\D/g, '')
        return cleaned.length === 10 || cleaned.length === 11
      }

      expect(isValidPhoneNumber('(555) 123-4567')).toBe(true)
      expect(isValidPhoneNumber('15551234567')).toBe(true)
      expect(isValidPhoneNumber('555-1234')).toBe(false)
    })
  })
})

// Array utilities tests
describe('Array Utilities', () => {
  describe('chunk', () => {
    it('should split array into chunks', () => {
      const chunk = <T>(array: T[], size: number): T[][] => {
        const chunks: T[][] = []
        for (let i = 0; i < array.length; i += size) {
          chunks.push(array.slice(i, i + size))
        }
        return chunks
      }

      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
      expect(chunk(['a', 'b', 'c', 'd'], 3)).toEqual([['a', 'b', 'c'], ['d']])
      expect(chunk([], 2)).toEqual([])
    })
  })

  describe('unique', () => {
    it('should return unique values', () => {
      const unique = <T>(array: T[]): T[] => {
        return [...new Set(array)]
      }

      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
      expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c'])
    })
  })

  describe('sortBy', () => {
    it('should sort array by property', () => {
      const sortBy = <T>(array: T[], key: keyof T): T[] => {
        return [...array].sort((a, b) => {
          if (a[key] < b[key]) return -1
          if (a[key] > b[key]) return 1
          return 0
        })
      }

      const items = [
        { id: 3, name: 'Charlie' },
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ]

      expect(sortBy(items, 'id')).toEqual([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ])
    })
  })
})

// Object utilities tests
describe('Object Utilities', () => {
  describe('pick', () => {
    it('should pick specified properties', () => {
      const pick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
        const result = {} as Pick<T, K>
        keys.forEach(key => {
          if (key in obj) {
            result[key] = obj[key]
          }
        })
        return result
      }

      const obj = { a: 1, b: 2, c: 3, d: 4 }
      expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 })
    })
  })

  describe('omit', () => {
    it('should omit specified properties', () => {
      const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
        const result = { ...obj }
        keys.forEach(key => {
          delete result[key]
        })
        return result
      }

      const obj = { a: 1, b: 2, c: 3, d: 4 }
      expect(omit(obj, ['b', 'd'])).toEqual({ a: 1, c: 3 })
    })
  })

  describe('deepMerge', () => {
    it('should deep merge objects', () => {
      const deepMerge = (target: any, source: any): any => {
        const output = { ...target }
        
        Object.keys(source).forEach(key => {
          if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            if (!(key in target)) {
              output[key] = source[key]
            } else {
              output[key] = deepMerge(target[key], source[key])
            }
          } else {
            output[key] = source[key]
          }
        })
        
        return output
      }

      const obj1 = { a: 1, b: { c: 2, d: 3 } }
      const obj2 = { b: { c: 4, e: 5 }, f: 6 }
      
      expect(deepMerge(obj1, obj2)).toEqual({
        a: 1,
        b: { c: 4, d: 3, e: 5 },
        f: 6,
      })
    })
  })
})