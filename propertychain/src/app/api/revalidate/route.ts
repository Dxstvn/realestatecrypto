/**
 * On-Demand Revalidation API - PropertyChain
 * 
 * API endpoint for ISR cache revalidation
 * Following UpdatedUIPlan.md Step 62 specifications and CLAUDE.md principles
 */

import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { headers } from 'next/headers'

/**
 * POST /api/revalidate
 * Revalidate specific paths or tags
 */
export async function POST(request: NextRequest) {
  try {
    // Verify secret token
    const headersList = headers()
    const secret = headersList.get('x-revalidate-secret')
    
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      )
    }
    
    // Get revalidation parameters
    const { searchParams } = request.nextUrl
    const path = searchParams.get('path')
    const tag = searchParams.get('tag')
    const type = searchParams.get('type') || 'page'
    
    // Validate input
    if (!path && !tag) {
      return NextResponse.json(
        { error: 'Missing path or tag parameter' },
        { status: 400 }
      )
    }
    
    // Perform revalidation
    const revalidated: string[] = []
    
    if (path) {
      // Revalidate specific path
      revalidatePath(path, type as 'page' | 'layout')
      revalidated.push(`path:${path}`)
      
      // Also revalidate related paths
      if (path.startsWith('/properties/')) {
        revalidatePath('/properties', 'page')
        revalidatePath('/', 'page')
        revalidated.push('path:/properties', 'path:/')
      } else if (path.startsWith('/users/')) {
        revalidatePath('/users', 'page')
        revalidated.push('path:/users')
      } else if (path.startsWith('/blog/')) {
        revalidatePath('/blog', 'page')
        revalidated.push('path:/blog')
      }
    }
    
    if (tag) {
      // Revalidate by tag
      revalidateTag(tag)
      revalidated.push(`tag:${tag}`)
      
      // Also revalidate related tags
      if (tag === 'properties') {
        revalidateTag('featured')
        revalidateTag('recent')
        revalidated.push('tag:featured', 'tag:recent')
      } else if (tag === 'users') {
        revalidateTag('profiles')
        revalidated.push('tag:profiles')
      }
    }
    
    // Log revalidation
    console.log(`Revalidated: ${revalidated.join(', ')}`)
    
    return NextResponse.json({
      success: true,
      revalidated,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    
    return NextResponse.json(
      {
        error: 'Revalidation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/revalidate
 * Get revalidation status (health check)
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'healthy',
    service: 'revalidation',
    timestamp: new Date().toISOString(),
    config: {
      hasSecret: Boolean(process.env.REVALIDATE_SECRET),
      cacheEnabled: true
    }
  })
}