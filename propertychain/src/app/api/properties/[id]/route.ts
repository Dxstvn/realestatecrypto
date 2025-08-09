/**
 * Individual Property API Routes - PropertyChain
 * 
 * API routes for individual property operations
 * Following CLAUDE.md standards
 */

import { NextRequest } from 'next/server'
import { 
  successResponse, 
  errorResponse, 
  validateRequest,
  authenticateRequest,
  checkRateLimit,
  setCacheHeaders,
  handleApiError,
  sanitizeInput,
  logApiRequest
} from '@/lib/api-utils'
import { db } from '@/lib/db'
import { z } from 'zod'

// Update property schema
const updatePropertySchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(10).max(5000).optional(),
  address: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  postalCode: z.string().min(1).optional(),
  propertyType: z.enum(['residential', 'commercial', 'industrial', 'land']).optional(),
  price: z.number().positive().optional(),
  tokenPrice: z.number().positive().optional(),
  totalTokens: z.number().positive().int().optional(),
  minimumInvestment: z.number().positive().optional(),
  expectedROI: z.number().min(0).max(100).optional(),
  images: z.array(z.string().url()).optional(),
  features: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'FUNDED', 'SOLD', 'INACTIVE']).optional(),
})

// GET /api/properties/[id] - Get single property
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now()
  
  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimit = checkRateLimit(`property-get-${clientIp}`, 100, 60000)
    
    if (!rateLimit.allowed) {
      return errorResponse('Too many requests', 429)
    }
    
    // Get property
    const property = await db.findById(db.propertiesCollection, params.id)
    
    if (!property) {
      return errorResponse('Property not found', 404)
    }
    
    // Get related data (investments count, etc.)
    const investments = await db.findAll(db.investmentsCollection)
    const propertyInvestments = investments.filter(i => i.propertyId === params.id)
    
    const enrichedProperty = {
      ...property,
      investorsCount: new Set(propertyInvestments.map(i => i.userId)).size,
      totalInvested: propertyInvestments.reduce((sum, i) => sum + i.amount, 0),
      fundingProgress: ((property.totalTokens - property.availableTokens) / property.totalTokens) * 100,
    }
    
    // Log request
    logApiRequest('GET', `/api/properties/${params.id}`, undefined, Date.now() - startTime)
    
    // Return response with cache headers
    const response = successResponse(enrichedProperty, 'Property retrieved successfully')
    return setCacheHeaders(response, 300, 600)
    
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/properties/[id] - Update single property
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now()
  
  try {
    // Authenticate request
    const { userId, error: authError } = await authenticateRequest(request)
    
    if (authError || !userId) {
      return errorResponse(authError || 'Unauthorized', 401)
    }
    
    // Get property to check ownership
    const property = await db.findById(db.propertiesCollection, params.id)
    
    if (!property) {
      return errorResponse('Property not found', 404)
    }
    
    // Check if user is owner or admin
    const user = await db.findById(db.usersCollection, userId)
    if (!user || (property.ownerId !== userId && user.role !== 'ADMIN')) {
      return errorResponse('Forbidden', 403)
    }
    
    // Validate request body
    const { data, error: validationError } = await validateRequest(request, updatePropertySchema)
    
    if (validationError || !data) {
      return errorResponse(validationError || 'Invalid request', 400)
    }
    
    // Sanitize input
    const sanitizedData = sanitizeInput(data)
    
    // Update property
    const updated = await db.update(
      db.propertiesCollection,
      params.id,
      {
        ...sanitizedData,
        updatedAt: new Date(),
      }
    )
    
    if (!updated) {
      return errorResponse('Failed to update property', 500)
    }
    
    // Log request
    logApiRequest('PUT', `/api/properties/${params.id}`, userId, Date.now() - startTime)
    
    return successResponse(updated, 'Property updated successfully')
    
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/properties/[id] - Delete single property
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now()
  
  try {
    // Authenticate request
    const { userId, error: authError } = await authenticateRequest(request)
    
    if (authError || !userId) {
      return errorResponse(authError || 'Unauthorized', 401)
    }
    
    // Get property to check ownership
    const property = await db.findById(db.propertiesCollection, params.id)
    
    if (!property) {
      return errorResponse('Property not found', 404)
    }
    
    // Check if user is owner or admin
    const user = await db.findById(db.usersCollection, userId)
    if (!user || (property.ownerId !== userId && user.role !== 'ADMIN')) {
      return errorResponse('Forbidden', 403)
    }
    
    // Check if property has investments
    const investments = await db.findAll(db.investmentsCollection)
    const hasInvestments = investments.some(i => i.propertyId === params.id)
    
    if (hasInvestments) {
      return errorResponse('Cannot delete property with active investments', 409)
    }
    
    // Delete property
    const deleted = await db.delete(db.propertiesCollection, params.id)
    
    if (!deleted) {
      return errorResponse('Failed to delete property', 500)
    }
    
    // Log request
    logApiRequest('DELETE', `/api/properties/${params.id}`, userId, Date.now() - startTime)
    
    return successResponse({ id: params.id }, 'Property deleted successfully')
    
  } catch (error) {
    return handleApiError(error)
  }
}

// PATCH /api/properties/[id] - Partial update
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Delegate to PUT for partial updates
  return PUT(request, { params })
}