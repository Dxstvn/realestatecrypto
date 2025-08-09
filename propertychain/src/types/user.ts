/**
 * User Type Definitions
 * User authentication and profile types
 */

export interface User {
  id: string
  walletAddress?: string // Web3 wallet
  email: string
  profile: UserProfile
  kyc: KYCStatus
  role: UserRole
  preferences: UserPreferences
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile {
  firstName: string
  lastName: string
  phone?: string
  dateOfBirth?: Date
  address?: {
    street: string
    city: string
    state: string
    country: string
    postalCode: string
  }
  avatar?: string
}

export interface KYCStatus {
  status: 'pending' | 'verified' | 'rejected' | 'expired'
  level: 1 | 2 | 3 // Different verification levels
  verifiedAt?: Date
  expiresAt?: Date
  documents: KYCDocument[]
}

export interface KYCDocument {
  type: 'passport' | 'driver-license' | 'id-card' | 'proof-of-address' | 'bank-statement'
  status: 'pending' | 'approved' | 'rejected'
  uploadedAt: Date
  reviewedAt?: Date
  rejectionReason?: string
}

export type UserRole = 
  | 'investor'
  | 'admin'
  | 'property-owner'
  | 'moderator'

export interface UserPreferences {
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
    newsletter: boolean
  }
  investment: {
    minYield: number
    preferredTypes: string[]
    riskTolerance: 'conservative' | 'moderate' | 'aggressive'
  }
  display: {
    currency: string
    language: string
    timezone: string
  }
}