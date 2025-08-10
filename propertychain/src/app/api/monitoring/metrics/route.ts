/**
 * Monitoring Metrics API Route - PropertyChain
 * 
 * Metrics collection and summary endpoint
 * Following UpdatedUIPlan.md Step 65 specifications and CLAUDE.md principles
 */

import { NextRequest, NextResponse } from 'next/server'
import { monitoring } from '@/lib/monitoring/service'

/**
 * GET /api/monitoring/metrics
 * Get metrics summary
 */
export async function GET(request: NextRequest) {
  try {
    const metricsSummary = monitoring.getMetricsSummary()
    
    return NextResponse.json(metricsSummary, {
      headers: {
        'Cache-Control': 'no-cache, max-age=30',
      },
    })
  } catch (error) {
    console.error('Failed to get metrics summary:', error)
    
    return NextResponse.json(
      {
        error: 'Failed to get metrics summary',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/monitoring/metrics
 * Accept external metric submissions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, value, unit, tags } = body
    
    if (!name || typeof value !== 'number' || !unit) {
      return NextResponse.json(
        { error: 'Missing required fields: name, value, unit' },
        { status: 400 }
      )
    }
    
    monitoring.trackMetric({ name, value, unit, tags })
    
    return NextResponse.json({
      success: true,
      message: 'Metric tracked successfully',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to track metric:', error)
    
    return NextResponse.json(
      {
        error: 'Failed to track metric',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}