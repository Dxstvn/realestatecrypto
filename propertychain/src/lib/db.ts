/**
 * Database Utilities - PropertyChain
 * 
 * Database connection and utilities following CLAUDE.md standards
 * Mock implementation for MVP, ready for real database integration
 */

import { 
  PROPERTY_STATUS, 
  INVESTMENT_STATUS, 
  KYC_STATUS, 
  USER_ROLES,
  TRANSACTION_TYPES,
  PAYMENT_METHODS 
} from '@/lib/constants'

// Database Types
export interface User {
  id: string
  email: string
  name: string
  role: keyof typeof USER_ROLES
  kycStatus: keyof typeof KYC_STATUS
  walletAddress?: string
  createdAt: Date
  updatedAt: Date
  emailVerified: boolean
  twoFactorEnabled: boolean
  avatar?: string
  bio?: string
  phoneNumber?: string
  address?: {
    street: string
    city: string
    state: string
    country: string
    postalCode: string
  }
}

export interface Property {
  id: string
  title: string
  description: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  propertyType: 'residential' | 'commercial' | 'industrial' | 'land'
  status: keyof typeof PROPERTY_STATUS
  price: number
  tokenPrice: number
  totalTokens: number
  availableTokens: number
  minimumInvestment: number
  expectedROI: number
  images: string[]
  documents: string[]
  features: string[]
  amenities: string[]
  coordinates: {
    lat: number
    lng: number
  }
  metrics: {
    size: number
    bedrooms?: number
    bathrooms?: number
    yearBuilt: number
    occupancyRate?: number
    rentPerMonth?: number
  }
  ownerId: string
  createdAt: Date
  updatedAt: Date
  fundingDeadline: Date
  contractAddress?: string
  chainId?: number
}

export interface Investment {
  id: string
  userId: string
  propertyId: string
  amount: number
  tokens: number
  status: keyof typeof INVESTMENT_STATUS
  paymentMethod: keyof typeof PAYMENT_METHODS
  transactionHash?: string
  createdAt: Date
  updatedAt: Date
  returnOnInvestment: number
  dividendsPaid: number
  lastDividendDate?: Date
}

export interface Transaction {
  id: string
  userId: string
  type: keyof typeof TRANSACTION_TYPES
  amount: number
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  description: string
  relatedId?: string // propertyId or investmentId
  paymentMethod?: keyof typeof PAYMENT_METHODS
  transactionHash?: string
  createdAt: Date
  updatedAt: Date
  fee?: number
  netAmount?: number
}

export interface Document {
  id: string
  name: string
  type: 'legal' | 'financial' | 'property' | 'kyc' | 'other'
  url: string
  size: number
  mimeType: string
  uploadedBy: string
  relatedId?: string // userId, propertyId, or investmentId
  relatedType?: 'user' | 'property' | 'investment'
  createdAt: Date
  expiresAt?: Date
  verified: boolean
  metadata?: Record<string, any>
}

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  description?: string
  read: boolean
  actionUrl?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: Date
  expiresAt?: Date
  metadata?: Record<string, any>
}

export interface Analytics {
  id: string
  type: 'platform' | 'property' | 'user' | 'investment'
  entityId?: string
  metrics: Record<string, any>
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  date: Date
  createdAt: Date
}

// Mock Database Class (for MVP)
class MockDatabase {
  private users: Map<string, User> = new Map()
  private properties: Map<string, Property> = new Map()
  private investments: Map<string, Investment> = new Map()
  private transactions: Map<string, Transaction> = new Map()
  private documents: Map<string, Document> = new Map()
  private notifications: Map<string, Notification> = new Map()
  private analytics: Map<string, Analytics> = new Map()

  constructor() {
    this.seedData()
  }

  private seedData() {
    // Seed sample properties
    const sampleProperties: Property[] = [
      {
        id: '1',
        title: 'Marina Heights Luxury Condo',
        description: 'Premium waterfront property with stunning ocean views',
        address: '123 Marina Boulevard',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        postalCode: '94123',
        propertyType: 'residential',
        status: 'ACTIVE',
        price: 2500000,
        tokenPrice: 100,
        totalTokens: 25000,
        availableTokens: 15000,
        minimumInvestment: 100,
        expectedROI: 12.5,
        images: [
          'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop',
        ],
        documents: [],
        features: ['Ocean View', 'Gym', 'Pool', 'Parking'],
        amenities: ['24/7 Security', 'Concierge', 'Pet Friendly'],
        coordinates: { lat: 37.8058, lng: -122.4325 },
        metrics: {
          size: 2500,
          bedrooms: 3,
          bathrooms: 2,
          yearBuilt: 2022,
          occupancyRate: 95,
          rentPerMonth: 8500,
        },
        ownerId: 'owner-1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        fundingDeadline: new Date('2024-12-31'),
      },
      {
        id: '2',
        title: 'Tech Hub Plaza',
        description: 'Modern commercial space in the heart of Silicon Valley',
        address: '456 Innovation Drive',
        city: 'Palo Alto',
        state: 'CA',
        country: 'USA',
        postalCode: '94301',
        propertyType: 'commercial',
        status: 'ACTIVE',
        price: 5000000,
        tokenPrice: 250,
        totalTokens: 20000,
        availableTokens: 18000,
        minimumInvestment: 250,
        expectedROI: 15.2,
        images: [
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop',
        ],
        documents: [],
        features: ['High-Speed Internet', 'Conference Rooms', 'Parking Garage'],
        amenities: ['24/7 Access', 'Security', 'HVAC'],
        coordinates: { lat: 37.4419, lng: -122.1430 },
        metrics: {
          size: 10000,
          yearBuilt: 2021,
          occupancyRate: 88,
          rentPerMonth: 35000,
        },
        ownerId: 'owner-2',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        fundingDeadline: new Date('2024-11-30'),
      },
    ]

    sampleProperties.forEach(property => {
      this.properties.set(property.id, property)
    })

    // Seed sample users
    const sampleUsers: User[] = [
      {
        id: 'user-1',
        email: 'john.doe@example.com',
        name: 'John Doe',
        role: 'INVESTOR',
        kycStatus: 'APPROVED',
        walletAddress: '0x1234567890123456789012345678901234567890',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        emailVerified: true,
        twoFactorEnabled: false,
      },
      {
        id: 'admin-1',
        email: 'admin@propertychain.com',
        name: 'Admin User',
        role: 'ADMIN',
        kycStatus: 'APPROVED',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        emailVerified: true,
        twoFactorEnabled: true,
      },
    ]

    sampleUsers.forEach(user => {
      this.users.set(user.id, user)
    })
  }

  // Generic CRUD operations
  async findById<T>(collection: Map<string, T>, id: string): Promise<T | null> {
    return collection.get(id) || null
  }

  async findAll<T>(collection: Map<string, T>): Promise<T[]> {
    return Array.from(collection.values())
  }

  async create<T extends { id: string }>(collection: Map<string, T>, data: T): Promise<T> {
    collection.set(data.id, data)
    return data
  }

  async update<T extends { id: string }>(
    collection: Map<string, T>,
    id: string,
    data: Partial<T>
  ): Promise<T | null> {
    const existing = collection.get(id)
    if (!existing) return null
    
    const updated = { ...existing, ...data, id } as T
    collection.set(id, updated)
    return updated
  }

  async delete<T>(collection: Map<string, T>, id: string): Promise<boolean> {
    return collection.delete(id)
  }

  // Specific getters for collections
  get usersCollection() { return this.users }
  get propertiesCollection() { return this.properties }
  get investmentsCollection() { return this.investments }
  get transactionsCollection() { return this.transactions }
  get documentsCollection() { return this.documents }
  get notificationsCollection() { return this.notifications }
  get analyticsCollection() { return this.analytics }
}

// Export singleton instance
export const db = new MockDatabase()

// Database helper functions
export async function generateId(prefix: string = ''): Promise<string> {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 9)
  return prefix ? `${prefix}_${timestamp}${randomStr}` : `${timestamp}${randomStr}`
}

export function paginate<T>(
  items: T[],
  page: number = 1,
  pageSize: number = 20
): {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
} {
  const total = items.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const end = start + pageSize
  
  return {
    data: items.slice(start, end),
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}

export function filterByQuery<T extends Record<string, any>>(
  items: T[],
  query: Record<string, any>
): T[] {
  return items.filter(item => {
    return Object.entries(query).every(([key, value]) => {
      if (value === undefined || value === null) return true
      
      const itemValue = item[key]
      
      // Handle different comparison types
      if (typeof value === 'string' && typeof itemValue === 'string') {
        return itemValue.toLowerCase().includes(value.toLowerCase())
      }
      
      if (Array.isArray(value)) {
        return value.includes(itemValue)
      }
      
      return itemValue === value
    })
  })
}

export function sortBy<T extends Record<string, any>>(
  items: T[],
  field: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const aValue = a[field]
    const bValue = b[field]
    
    if (aValue < bValue) return order === 'asc' ? -1 : 1
    if (aValue > bValue) return order === 'asc' ? 1 : -1
    return 0
  })
}