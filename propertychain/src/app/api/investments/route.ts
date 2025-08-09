/**
 * Investments API Routes - PropertyChain
 * 
 * Investment management endpoints
 * Following CLAUDE.md security and architecture standards
 */

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { 
  successResponse, 
  errorResponse, 
  validateRequest,
  parseQueryParams,
  getPaginationParams,
  authenticateRequest,
  checkRateLimit,
  handleApiError,
  sanitizeInput,
  logApiRequest
} from '@/lib/api-utils'
import { 
  db, 
  generateId, 
  paginate, 
  filterByQuery,
  type Investment,
  type Transaction
} from '@/lib/db'
import { INVESTMENT_STATUS, PAYMENT_METHODS, TRANSACTION_TYPES } from '@/lib/constants'

// Validation schemas
const createInvestmentSchema = z.object({
  propertyId: z.string().min(1),
  amount: z.number().positive(),
  paymentMethod: z.enum(['CRYPTO', 'WIRE', 'ACH', 'CREDIT_CARD']),
  tokens: z.number().positive().int().optional(),
})

const updateInvestmentSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'CONFIRMED', 'FAILED', 'CANCELLED', 'REFUNDED']).optional(),
})

// GET /api/investments - List user investments
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Authenticate request
    const { userId, error: authError } = await authenticateRequest(request)
    
    if (authError || !userId) {
      return errorResponse(authError || 'Unauthorized', 401)
    }
    
    // Rate limiting
    const rateLimit = checkRateLimit(`investments-get-${userId}`, 100, 60000)
    
    if (!rateLimit.allowed) {
      return errorResponse('Too many requests', 429)
    }
    
    // Parse query parameters
    const params = parseQueryParams(request)
    const { page, pageSize, sortBy: sortField, sortOrder } = getPaginationParams(request)
    
    // Get user's investments
    let investments = await db.findAll(db.investmentsCollection)
    
    // Check if user is admin to see all investments
    const user = await db.findById(db.usersCollection, userId)
    const isAdmin = user?.role === 'ADMIN'
    
    if (!isAdmin) {
      // Filter to user's investments only
      investments = investments.filter(i => i.userId === userId)
    } else if (params.userId) {
      // Admin can filter by specific user
      investments = investments.filter(i => i.userId === params.userId)
    }
    
    // Apply filters
    if (params.propertyId) {
      investments = investments.filter(i => i.propertyId === params.propertyId)
    }
    
    if (params.status) {
      investments = investments.filter(i => i.status === params.status)
    }
    
    // Enrich with property data
    const enrichedInvestments = await Promise.all(
      investments.map(async (investment) => {
        const property = await db.findById(db.propertiesCollection, investment.propertyId)
        return {
          ...investment,
          property: property ? {
            id: property.id,
            title: property.title,
            city: property.city,
            tokenPrice: property.tokenPrice,
            expectedROI: property.expectedROI,
          } : null,
        }
      })
    )
    
    // Apply pagination
    const paginatedResult = paginate(enrichedInvestments, page, pageSize)
    
    // Calculate summary statistics
    const summary = {
      totalInvested: investments.reduce((sum, i) => sum + i.amount, 0),
      totalTokens: investments.reduce((sum, i) => sum + i.tokens, 0),
      totalReturns: investments.reduce((sum, i) => sum + i.returnOnInvestment, 0),
      activeInvestments: investments.filter(i => i.status === 'CONFIRMED').length,
    }
    
    // Log request
    logApiRequest('GET', '/api/investments', userId, Date.now() - startTime)
    
    return successResponse(
      {
        investments: paginatedResult.data,
        summary,
      },
      'Investments retrieved successfully',
      paginatedResult.pagination
    )
    
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/investments - Create new investment
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Authenticate request
    const { userId, error: authError } = await authenticateRequest(request)
    
    if (authError || !userId) {
      return errorResponse(authError || 'Unauthorized', 401)
    }
    
    // Validate request body
    const { data, error: validationError } = await validateRequest(request, createInvestmentSchema)
    
    if (validationError || !data) {
      return errorResponse(validationError || 'Invalid request', 400)
    }
    
    // Sanitize input
    const sanitizedData = sanitizeInput(data)
    
    // Check KYC status
    const user = await db.findById(db.usersCollection, userId)
    if (!user || user.kycStatus !== 'APPROVED') {
      return errorResponse('KYC verification required', 403)
    }
    
    // Get property
    const property = await db.findById(db.propertiesCollection, sanitizedData.propertyId)
    
    if (!property) {
      return errorResponse('Property not found', 404)
    }
    
    if (property.status !== 'ACTIVE') {
      return errorResponse('Property is not available for investment', 400)
    }
    
    // Check minimum investment
    if (sanitizedData.amount < property.minimumInvestment) {
      return errorResponse(`Minimum investment is $${property.minimumInvestment}`, 400)
    }
    
    // Calculate tokens
    const tokens = sanitizedData.tokens || Math.floor(sanitizedData.amount / property.tokenPrice)
    
    // Check available tokens
    if (tokens > property.availableTokens) {
      return errorResponse(`Only ${property.availableTokens} tokens available`, 400)
    }
    
    // Create investment
    const investment: Investment = {
      id: await generateId('inv'),
      userId,
      propertyId: sanitizedData.propertyId,
      amount: sanitizedData.amount,
      tokens,
      status: 'PENDING' as keyof typeof INVESTMENT_STATUS,
      paymentMethod: sanitizedData.paymentMethod as keyof typeof PAYMENT_METHODS,
      createdAt: new Date(),
      updatedAt: new Date(),
      returnOnInvestment: 0,
      dividendsPaid: 0,
    }
    
    await db.create(db.investmentsCollection, investment)
    
    // Create transaction record
    const transaction: Transaction = {
      id: await generateId('txn'),
      userId,
      type: 'INVESTMENT' as keyof typeof TRANSACTION_TYPES,
      amount: sanitizedData.amount,
      status: 'pending',
      description: `Investment in ${property.title}`,
      relatedId: investment.id,
      paymentMethod: sanitizedData.paymentMethod as keyof typeof PAYMENT_METHODS,
      createdAt: new Date(),
      updatedAt: new Date(),
      fee: sanitizedData.amount * 0.02, // 2% platform fee
      netAmount: sanitizedData.amount * 0.98,
    }
    
    await db.create(db.transactionsCollection, transaction)
    
    // Update property available tokens
    await db.update(db.propertiesCollection, property.id, {
      availableTokens: property.availableTokens - tokens,
      updatedAt: new Date(),
    })
    
    // Log request
    logApiRequest('POST', '/api/investments', userId, Date.now() - startTime)
    
    return successResponse(
      {
        investment,
        transaction,
      },
      'Investment created successfully'
    )
    
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/investments - Batch update investments
export async function PUT(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Authenticate request
    const { userId, error: authError } = await authenticateRequest(request)
    
    if (authError || !userId) {
      return errorResponse(authError || 'Unauthorized', 401)
    }
    
    // Check admin role
    const user = await db.findById(db.usersCollection, userId)
    if (!user || user.role !== 'ADMIN') {
      return errorResponse('Forbidden', 403)
    }
    
    const body = await request.json()
    const { investmentIds, updates } = body
    
    if (!Array.isArray(investmentIds) || !updates) {
      return errorResponse('Invalid request body', 400)
    }
    
    // Validate updates
    const { data, error: validationError } = await validateRequest(
      { json: async () => updates } as NextRequest,
      updateInvestmentSchema
    )
    
    if (validationError || !data) {
      return errorResponse(validationError || 'Invalid updates', 400)
    }
    
    // Update investments
    const updatedInvestments = []
    for (const investmentId of investmentIds) {
      const investment = await db.findById(db.investmentsCollection, investmentId)
      if (!investment) continue
      
      // Update investment
      const updated = await db.update(
        db.investmentsCollection,
        investmentId,
        {
          ...data,
          updatedAt: new Date(),
        }
      )
      
      if (updated) {
        updatedInvestments.push(updated)
        
        // Update related transaction if status changed
        if (data.status) {
          const transactions = await db.findAll(db.transactionsCollection)
          const relatedTransaction = transactions.find(t => t.relatedId === investmentId)
          
          if (relatedTransaction) {
            const txStatus = data.status === 'CONFIRMED' ? 'completed' :
                           data.status === 'FAILED' ? 'failed' :
                           data.status === 'CANCELLED' ? 'cancelled' : 'pending'
            
            await db.update(db.transactionsCollection, relatedTransaction.id, {
              status: txStatus as any,
              updatedAt: new Date(),
            })
          }
        }
      }
    }
    
    // Log request
    logApiRequest('PUT', '/api/investments', userId, Date.now() - startTime)
    
    return successResponse(
      updatedInvestments,
      `${updatedInvestments.length} investments updated successfully`
    )
    
  } catch (error) {
    return handleApiError(error)
  }
}