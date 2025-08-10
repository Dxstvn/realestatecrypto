/**
 * Example API Route with Caching - PropertyChain
 * 
 * Demonstrates how to implement caching in API routes
 * Following UpdatedUIPlan.md Step 62 specifications and CLAUDE.md principles
 */

import { NextRequest, NextResponse } from 'next/server'
import { withAPICache, cachedResponse } from '@/lib/cache/api-cache'
import { generateCacheTags } from '@/lib/cache/cdn-config'

/**
 * GET /api/properties
 * Fetch properties with caching
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  
  // Parse query parameters
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const featured = searchParams.get('featured') === 'true'
  const sort = searchParams.get('sort') || 'recent'
  
  // Use API cache wrapper
  const data = await withAPICache(
    request,
    async () => {
      // Your actual database/API logic here
      const properties = await fetchPropertiesFromDatabase({
        page,
        limit,
        featured,
        sort
      })
      
      return properties
    },
    {
      // Cache for 5 minutes
      ttl: 300,
      // Add cache tags for invalidation
      tags: [
        ...generateCacheTags('properties'),
        featured ? 'featured' : 'all',
        `sort:${sort}`
      ]
    }
  )
  
  // Return response with CDN cache headers
  return cachedResponse(data, {
    maxAge: 60, // Browser cache for 1 minute
    sMaxAge: 300, // CDN cache for 5 minutes
    staleWhileRevalidate: 3600 // Serve stale for 1 hour while revalidating
  })
}

/**
 * POST /api/properties
 * Create a new property (invalidates cache)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Create property in database
    const newProperty = await createPropertyInDatabase(body)
    
    // Invalidate related caches
    const { cacheManager } = await import('@/lib/cache')
    await cacheManager.invalidateResource('property', newProperty.id)
    
    return NextResponse.json(
      { success: true, property: newProperty },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    )
  }
}

// Mock database functions (replace with actual implementation)
async function fetchPropertiesFromDatabase(params: any) {
  // Simulate database query
  return {
    properties: [],
    total: 0,
    page: params.page,
    limit: params.limit
  }
}

async function createPropertyInDatabase(data: any) {
  // Simulate database insert
  return {
    id: 'new-property-id',
    ...data
  }
}