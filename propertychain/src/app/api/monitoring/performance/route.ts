/**
 * Monitoring Performance API Route - PropertyChain
 * 
 * Performance data endpoint for dashboard charts
 * Following UpdatedUIPlan.md Step 65 specifications and CLAUDE.md principles
 */

import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/monitoring/performance
 * Get performance data for charts
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hours = parseInt(searchParams.get('hours') || '24')
    const metric = searchParams.get('metric')
    
    // Generate sample performance data
    // In a real implementation, this would query your metrics database
    const now = Date.now()
    const interval = (hours * 60 * 60 * 1000) / 50 // 50 data points
    
    const data = Array.from({ length: 50 }, (_, i) => {
      const timestamp = new Date(now - (49 - i) * interval).toISOString()
      return {
        timestamp: timestamp.slice(11, 16), // HH:MM format
        responseTime: Math.random() * 1000 + 200 + Math.sin(i / 10) * 200,
        errorRate: Math.max(0, Math.random() * 5 + Math.sin(i / 8) * 2),
        throughput: Math.random() * 100 + 50 + Math.cos(i / 12) * 20,
        memoryUsage: Math.random() * 20 + 60 + Math.sin(i / 15) * 10,
      }
    })
    
    return NextResponse.json({
      data,
      metadata: {
        hours,
        metric,
        generated: new Date().toISOString(),
        dataPoints: data.length,
      },
    }, {
      headers: {
        'Cache-Control': 'public, max-age=60', // Cache for 1 minute
      },
    })
  } catch (error) {
    console.error('Failed to get performance data:', error)
    
    return NextResponse.json(
      {
        error: 'Failed to get performance data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}