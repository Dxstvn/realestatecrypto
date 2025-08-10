/**
 * Properties API Routes - PropertyChain
 * 
 * RESTful API for property management
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
  setCacheHeaders,
  handleApiError,
  sanitizeInput,
  logApiRequest
} from '@/lib/api-utils'
import { 
  db, 
  generateId, 
  paginate, 
  filterByQuery, 
  sortBy,
  type Property 
} from '@/lib/db'
import { PROPERTY_STATUS } from '@/lib/constants'

// Validation schemas
const createPropertySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(10).max(5000),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  postalCode: z.string().min(1),
  propertyType: z.enum(['residential', 'commercial', 'industrial', 'land']),
  price: z.number().positive(),
  tokenPrice: z.number().positive(),
  totalTokens: z.number().positive().int(),
  minimumInvestment: z.number().positive(),
  expectedROI: z.number().min(0).max(100),
  images: z.array(z.string().url()).min(1),
  features: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  metrics: z.object({
    size: z.number().positive(),
    bedrooms: z.number().int().optional(),
    bathrooms: z.number().optional(),
    yearBuilt: z.number().int().min(1800).max(new Date().getFullYear()),
    occupancyRate: z.number().min(0).max(100).optional(),
    rentPerMonth: z.number().positive().optional(),
  }),
  fundingDeadline: z.string().datetime(),
})

const updatePropertySchema = createPropertySchema.partial()

// GET /api/properties - List properties with filtering and pagination
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimit = checkRateLimit(`properties-get-${clientIp}`, 100, 60000)
    
    if (!rateLimit.allowed) {
      return errorResponse('Too many requests', 429)
    }
    
    // Parse query parameters
    const params = parseQueryParams(request)
    const { page, pageSize, sortBy: sortField, sortOrder } = getPaginationParams(request)
    
    // Get all properties
    let properties = await db.findAll(db.propertiesCollection)
    
    // Apply filters
    const filters: Record<string, any> = {}
    
    if (params.status) {
      filters.status = params.status
    }
    
    if (params.propertyType) {
      filters.propertyType = params.propertyType
    }
    
    if (params.city) {
      filters.city = params.city
    }
    
    if (params.minPrice !== undefined) {
      properties = properties.filter(p => p.price >= params.minPrice)
    }
    
    if (params.maxPrice !== undefined) {
      properties = properties.filter(p => p.price <= params.maxPrice)
    }
    
    if (params.search) {
      const search = params.search.toLowerCase()
      properties = properties.filter(p => 
        p.title.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.city.toLowerCase().includes(search)
      )
    }
    
    properties = filterByQuery(properties, filters)
    
    // Apply sorting
    if (sortField) {
      properties = sortBy(properties, sortField as keyof Property, sortOrder)
    }
    
    // Apply pagination
    const paginatedResult = paginate(properties, page, pageSize)
    
    // Log request
    logApiRequest('GET', '/api/properties', undefined, Date.now() - startTime)
    
    // Return response with cache headers
    const response = successResponse(
      paginatedResult.data,
      'Properties retrieved successfully',
      paginatedResult.pagination
    )
    
    return setCacheHeaders(response, 60, 300)
    
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/properties - Create a new property (requires authentication)
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Authenticate request
    const { userId, error: authError } = await authenticateRequest(request)
    
    if (authError || !userId) {
      return errorResponse(authError || 'Unauthorized', 401)
    }
    
    // Validate request body
    const { data, error: validationError } = await validateRequest(request, createPropertySchema)
    
    if (validationError || !data) {
      return errorResponse(validationError || 'Invalid request', 400)
    }
    
    // Sanitize input
    const sanitizedData = sanitizeInput(data)
    
    // Create property
    const property: Property = {
      id: await generateId('prop'),
      ...sanitizedData,
      status: 'PENDING_APPROVAL' as keyof typeof PROPERTY_STATUS,
      availableTokens: sanitizedData.totalTokens,
      documents: [],
      ownerId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      fundingDeadline: new Date(sanitizedData.fundingDeadline),
    }
    
    await db.create(db.propertiesCollection, property)
    
    // Log request
    logApiRequest('POST', '/api/properties', userId, Date.now() - startTime)
    
    return successResponse(property, 'Property created successfully')
    
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/properties - Update multiple properties (batch operation)
export async function PUT(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Authenticate request
    const { userId, error: authError } = await authenticateRequest(request)
    
    if (authError || !userId) {
      return errorResponse(authError || 'Unauthorized', 401)
    }
    
    // Check admin role (mock check for MVP)
    const user = await db.findById(db.usersCollection, userId)
    if (!user || user.role !== 'ADMIN') {
      return errorResponse('Forbidden', 403)
    }
    
    const body = await request.json()
    const { propertyIds, updates } = body
    
    if (!Array.isArray(propertyIds) || !updates) {
      return errorResponse('Invalid request body', 400)
    }
    
    // Validate updates
    const { data, error: validationError } = await validateRequest(
      { json: async () => updates } as NextRequest,
      updatePropertySchema
    )
    
    if (validationError || !data) {
      return errorResponse(validationError || 'Invalid updates', 400)
    }
    
    // Update properties
    const updatedProperties = []
    for (const propertyId of propertyIds) {
      const updateData: any = {
        ...data,
        updatedAt: new Date(),
      }
      
      // Convert fundingDeadline to Date if present
      if (data.fundingDeadline) {
        updateData.fundingDeadline = new Date(data.fundingDeadline)
      }
      
      const updated = await db.update(
        db.propertiesCollection,
        propertyId,
        updateData
      )
      
      if (updated) {
        updatedProperties.push(updated)
      }
    }
    
    // Log request
    logApiRequest('PUT', '/api/properties', userId, Date.now() - startTime)
    
    return successResponse(
      updatedProperties,
      `${updatedProperties.length} properties updated successfully`
    )
    
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/properties - Delete multiple properties (batch operation)
export async function DELETE(request: NextRequest) {
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
    const { propertyIds } = body
    
    if (!Array.isArray(propertyIds)) {
      return errorResponse('Invalid request body', 400)
    }
    
    // Delete properties
    let deletedCount = 0
    for (const propertyId of propertyIds) {
      const deleted = await db.delete(db.propertiesCollection, propertyId)
      if (deleted) {
        deletedCount++
      }
    }
    
    // Log request
    logApiRequest('DELETE', '/api/properties', userId, Date.now() - startTime)
    
    return successResponse(
      { deletedCount },
      `${deletedCount} properties deleted successfully`
    )
    
  } catch (error) {
    return handleApiError(error)
  }
}