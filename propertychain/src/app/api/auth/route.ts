/**
 * Authentication API Routes - PropertyChain
 * 
 * Authentication and authorization endpoints
 * Following CLAUDE.md security standards
 */

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { 
  successResponse, 
  errorResponse, 
  validateRequest,
  checkRateLimit,
  handleApiError,
  sanitizeInput,
  logApiRequest
} from '@/lib/api-utils'
import { db, generateId, type User } from '@/lib/db'
import { KYC_STATUS, USER_ROLES } from '@/lib/constants'

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  name: z.string().min(2).max(100),
  role: z.enum(['INVESTOR', 'PROPERTY_OWNER']).optional(),
})

const refreshTokenSchema = z.object({
  refreshToken: z.string(),
})

// Mock password hashing (use bcrypt in production)
function hashPassword(password: string): string {
  // In production, use bcrypt or argon2
  return Buffer.from(password).toString('base64')
}

function verifyPassword(password: string, hash: string): boolean {
  // In production, use bcrypt or argon2
  return Buffer.from(password).toString('base64') === hash
}

// Mock JWT generation (use jsonwebtoken in production)
function generateTokens(userId: string): {
  accessToken: string
  refreshToken: string
  expiresIn: number
} {
  // In production, use proper JWT library
  const accessToken = `mock-access-token-${userId}-${Date.now()}`
  const refreshToken = `mock-refresh-token-${userId}-${Date.now()}`
  
  return {
    accessToken,
    refreshToken,
    expiresIn: 3600, // 1 hour
  }
}

// POST /api/auth/login - User login
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const path = new URL(request.url).pathname
  
  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimit = checkRateLimit(`auth-${clientIp}`, 10, 60000) // 10 attempts per minute
    
    if (!rateLimit.allowed) {
      return errorResponse('Too many login attempts. Please try again later.', 429)
    }
    
    if (path.endsWith('/login')) {
      // Login endpoint
      const { data, error: validationError } = await validateRequest(request, loginSchema)
      
      if (validationError || !data) {
        return errorResponse(validationError || 'Invalid credentials', 400)
      }
      
      // Sanitize input
      const { email, password } = sanitizeInput(data)
      
      // Find user by email
      const users = await db.findAll(db.usersCollection)
      const user = users.find(u => u.email === email)
      
      if (!user) {
        // Don't reveal if email exists
        return errorResponse('Invalid credentials', 401)
      }
      
      // Verify password (mock verification for MVP)
      const passwordHash = hashPassword(password)
      const storedHash = hashPassword('password123') // Mock stored password
      
      if (!verifyPassword(password, storedHash)) {
        return errorResponse('Invalid credentials', 401)
      }
      
      // Generate tokens
      const tokens = generateTokens(user.id)
      
      // Create session response
      const sessionData = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          kycStatus: user.kycStatus,
          emailVerified: user.emailVerified,
        },
        ...tokens,
      }
      
      // Log request
      logApiRequest('POST', '/api/auth/login', user.id, Date.now() - startTime)
      
      return successResponse(sessionData, 'Login successful')
      
    } else if (path.endsWith('/register')) {
      // Register endpoint
      const { data, error: validationError } = await validateRequest(request, registerSchema)
      
      if (validationError || !data) {
        return errorResponse(validationError || 'Invalid registration data', 400)
      }
      
      // Sanitize input
      const sanitizedData = sanitizeInput(data)
      
      // Check if email already exists
      const users = await db.findAll(db.usersCollection)
      const existingUser = users.find(u => u.email === sanitizedData.email)
      
      if (existingUser) {
        return errorResponse('Email already registered', 409)
      }
      
      // Create new user
      const newUser: User = {
        id: await generateId('user'),
        email: sanitizedData.email,
        name: sanitizedData.name,
        role: (sanitizedData.role || 'INVESTOR') as keyof typeof USER_ROLES,
        kycStatus: 'NOT_STARTED' as keyof typeof KYC_STATUS,
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: false,
        twoFactorEnabled: false,
      }
      
      await db.create(db.usersCollection, newUser)
      
      // Generate tokens
      const tokens = generateTokens(newUser.id)
      
      // Create session response
      const sessionData = {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          kycStatus: newUser.kycStatus,
          emailVerified: newUser.emailVerified,
        },
        ...tokens,
      }
      
      // Log request
      logApiRequest('POST', '/api/auth/register', newUser.id, Date.now() - startTime)
      
      return successResponse(sessionData, 'Registration successful')
      
    } else if (path.endsWith('/refresh')) {
      // Refresh token endpoint
      const { data, error: validationError } = await validateRequest(request, refreshTokenSchema)
      
      if (validationError || !data) {
        return errorResponse(validationError || 'Invalid refresh token', 400)
      }
      
      // Mock token refresh (in production, verify refresh token)
      const userId = data.refreshToken.split('-')[3] // Extract userId from mock token
      
      if (!userId) {
        return errorResponse('Invalid refresh token', 401)
      }
      
      const user = await db.findById(db.usersCollection, userId)
      
      if (!user) {
        return errorResponse('Invalid refresh token', 401)
      }
      
      // Generate new tokens
      const tokens = generateTokens(user.id)
      
      // Log request
      logApiRequest('POST', '/api/auth/refresh', user.id, Date.now() - startTime)
      
      return successResponse(tokens, 'Token refreshed successfully')
      
    } else if (path.endsWith('/logout')) {
      // Logout endpoint
      // In production, invalidate tokens/session
      
      // Log request
      logApiRequest('POST', '/api/auth/logout', undefined, Date.now() - startTime)
      
      return successResponse(null, 'Logout successful')
    }
    
    return errorResponse('Not found', 404)
    
  } catch (error) {
    return handleApiError(error)
  }
}