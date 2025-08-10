/**
 * Monitoring Health API Route - PropertyChain
 * 
 * Comprehensive system health monitoring endpoint
 * Following UpdatedUIPlan.md Step 65 specifications and CLAUDE.md principles
 */

import { NextRequest, NextResponse } from 'next/server'
import { monitoring } from '@/lib/monitoring/service'

/**
 * GET /api/monitoring/health
 * Get comprehensive system health status
 */
export async function GET(request: NextRequest) {
  try {
    const healthStatus = await monitoring.getHealthStatus()
    
    return NextResponse.json(healthStatus, {
      status: healthStatus.status === 'down' ? 503 : 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Status': healthStatus.status,
      },
    })
  } catch (error) {
    console.error('Health status check failed:', error)
    
    return NextResponse.json(
      {
        status: 'down',
        services: {},
        timestamp: Date.now(),
        error: error instanceof Error ? error.message : 'Health check failed',
      },
      { 
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Health-Status': 'down',
        },
      }
    )
  }
}