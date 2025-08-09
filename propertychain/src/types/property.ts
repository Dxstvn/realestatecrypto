/**
 * Property Type Definitions
 * Core types for real estate assets on the platform
 */

export interface Property {
  id: string
  tokenId?: string // Blockchain token ID
  address: {
    street: string
    city: string
    state: string
    country: string
    postalCode: string
  }
  details: {
    type: PropertyType
    bedrooms: number
    bathrooms: number
    squareFeet: number
    yearBuilt: number
    description: string
  }
  financials: {
    totalValue: number
    tokenPrice: number
    totalTokens: number
    availableTokens: number
    minimumInvestment: number
    expectedYield: number
    monthlyRent: number
    expenses: MonthlyExpenses
  }
  images: PropertyImage[]
  documents: PropertyDocument[]
  status: PropertyStatus
  createdAt: Date
  updatedAt: Date
}

export type PropertyType = 
  | 'single-family'
  | 'multi-family'
  | 'condo'
  | 'townhouse'
  | 'commercial'
  | 'mixed-use'
  | 'land'

export type PropertyStatus = 
  | 'pending'
  | 'active'
  | 'funded'
  | 'sold'
  | 'inactive'

export interface PropertyImage {
  id: string
  url: string
  alt: string
  isPrimary: boolean
  order: number
}

export interface PropertyDocument {
  id: string
  name: string
  type: DocumentType
  url: string
  uploadedAt: Date
  verified: boolean
}

export type DocumentType = 
  | 'deed'
  | 'inspection'
  | 'appraisal'
  | 'insurance'
  | 'tax'
  | 'legal'
  | 'other'

export interface MonthlyExpenses {
  propertyTax: number
  insurance: number
  hoa?: number
  maintenance: number
  management: number
  utilities?: number
  other?: number
}