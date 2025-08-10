/**
 * Health Check API Route - PropertyChain
 * 
 * System health monitoring endpoint
 * Following UpdatedUIPlan.md Step 65 specifications and CLAUDE.md principles
 */

import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/health
 * Basic health check endpoint
 */
export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    // Check basic system health
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      responseTime: Date.now() - startTime,
    }
    
    return NextResponse.json(health, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Check': 'ok',
      },
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Health-Check': 'failed',
        },
      }
    )
  }
}

/**
 * HEAD /api/health
 * Lightweight health check for uptime monitoring
 */
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'X-Health-Check': 'ok',
      'Cache-Control': 'no-cache',
    },
  })
}