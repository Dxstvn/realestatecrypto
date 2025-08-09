/**
 * API Utilities - PropertyChain
 * 
 * Common utilities for API routes following CLAUDE.md standards
 * Security, validation, and response helpers
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants'

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  timestamp: string
}

// Standard API Responses
export function successResponse<T>(
  data: T,
  message?: string,
  pagination?: ApiResponse['pagination']
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message: message || SUCCESS_MESSAGES.GENERIC,
    pagination,
    timestamp: new Date().toISOString(),
  })
}

export function errorResponse(
  error: string | Error,
  status: number = 400
): NextResponse<ApiResponse> {
  const message = error instanceof Error ? error.message : error
  
  return NextResponse.json(
    {
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    },
    { status }
  )
}

// Request Validation
export async function validateRequest<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<{ data: T | null; error: string | null }> {
  try {
    const body = await request.json()
    const validated = schema.parse(body)
    return { data: validated, error: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      return { data: null, error: errors.join(', ') }
    }
    return { data: null, error: 'Invalid request body' }
  }
}

// Query Parameter Parsing
export function parseQueryParams(request: NextRequest): Record<string, any> {
  const { searchParams } = new URL(request.url)
  const params: Record<string, any> = {}
  
  searchParams.forEach((value, key) => {
    // Handle array parameters (e.g., ?status[]=active&status[]=pending)
    if (key.endsWith('[]')) {
      const cleanKey = key.slice(0, -2)
      if (!params[cleanKey]) {
        params[cleanKey] = []
      }
      params[cleanKey].push(value)
    } else {
      // Try to parse as JSON for complex values
      try {
        params[key] = JSON.parse(value)
      } catch {
        // Parse as number if possible
        const num = Number(value)
        params[key] = isNaN(num) ? value : num
      }
    }
  })
  
  return params
}

// Pagination Helper
export function getPaginationParams(request: NextRequest): {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
} {
  const { searchParams } = new URL(request.url)
  
  return {
    page: Math.max(1, parseInt(searchParams.get('page') || '1')),
    pageSize: Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20'))),
    sortBy: searchParams.get('sortBy') || undefined,
    sortOrder: (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc',
  }
}

// Authentication Helpers (Mock for MVP)
export async function authenticateRequest(
  request: NextRequest
): Promise<{ userId: string | null; error: string | null }> {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { userId: null, error: 'Missing or invalid authorization header' }
  }
  
  const token = authHeader.substring(7)
  
  // Mock validation - in production, verify JWT token
  if (token === 'mock-user-token') {
    return { userId: 'user-1', error: null }
  }
  
  if (token === 'mock-admin-token') {
    return { userId: 'admin-1', error: null }
  }
  
  return { userId: null, error: 'Invalid token' }
}

// Rate Limiting (Mock for MVP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)
  
  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs
    rateLimitMap.set(identifier, { count: 1, resetTime })
    return { allowed: true, remaining: limit - 1, resetTime }
  }
  
  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime }
  }
  
  record.count++
  return { allowed: true, remaining: limit - record.count, resetTime: record.resetTime }
}

// CORS Headers
export function setCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Max-Age', '86400')
  return response
}

// Cache Headers
export function setCacheHeaders(
  response: NextResponse,
  maxAge: number = 60,
  sMaxAge: number = 120
): NextResponse {
  response.headers.set(
    'Cache-Control',
    `public, max-age=${maxAge}, s-maxage=${sMaxAge}, stale-while-revalidate=60`
  )
  return response
}

// Input Sanitization
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    // Remove potential XSS vectors
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .trim()
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput)
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: Record<string, any> = {}
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value)
    }
    return sanitized
  }
  
  return input
}

// API Error Handler
export function handleApiError(error: any): NextResponse {
  console.error('API Error:', error)
  
  if (error instanceof z.ZodError) {
    return errorResponse('Validation error: ' + error.errors.map(e => e.message).join(', '), 400)
  }
  
  if (error.name === 'UnauthorizedError') {
    return errorResponse('Unauthorized', 401)
  }
  
  if (error.name === 'ForbiddenError') {
    return errorResponse('Forbidden', 403)
  }
  
  if (error.name === 'NotFoundError') {
    return errorResponse('Not found', 404)
  }
  
  if (error.name === 'ConflictError') {
    return errorResponse(error.message || 'Conflict', 409)
  }
  
  if (error.name === 'RateLimitError') {
    return errorResponse('Too many requests', 429)
  }
  
  // Generic server error
  return errorResponse(ERROR_MESSAGES.GENERIC, 500)
}

// Webhook Signature Verification
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  // Mock implementation - in production, use proper HMAC verification
  const crypto = require('crypto')
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  
  return signature === expectedSignature
}

// API Logging
export function logApiRequest(
  method: string,
  path: string,
  userId?: string,
  duration?: number
): void {
  const log = {
    timestamp: new Date().toISOString(),
    method,
    path,
    userId,
    duration: duration ? `${duration}ms` : undefined,
  }
  
  // In production, send to logging service
  if (process.env.NODE_ENV === 'development') {
    console.log('[API]', log)
  }
}

// Schema Definitions for common validations
export const schemas = {
  pagination: z.object({
    page: z.number().min(1).optional(),
    pageSize: z.number().min(1).max(100).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
  
  id: z.string().min(1),
  
  email: z.string().email(),
  
  password: z.string().min(8).max(128),
  
  amount: z.number().positive(),
  
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    country: z.string().min(1),
    postalCode: z.string().min(1),
  }),
}