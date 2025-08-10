/**
 * Alerts API Route - PropertyChain
 * 
 * API endpoints for managing alerts and notifications
 * Following UpdatedUIPlan.md Step 65 specifications and CLAUDE.md principles
 */

import { NextRequest, NextResponse } from 'next/server'
import { alertService } from '@/lib/alerts/service'

/**
 * GET /api/alerts
 * Get active alerts and alert history
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'active'
    const limit = parseInt(searchParams.get('limit') || '100')
    
    let alerts
    if (type === 'active') {
      alerts = alertService.getActiveAlerts()
    } else if (type === 'history') {
      alerts = alertService.getAlertHistory(limit)
    } else {
      return NextResponse.json(
        { error: 'Invalid type parameter. Use "active" or "history"' },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      alerts,
      count: alerts.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to fetch alerts:', error)
    
    return NextResponse.json(
      {
        error: 'Failed to fetch alerts',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/alerts
 * Submit metric for alert evaluation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { metric, value, tags } = body
    
    if (!metric || typeof value !== 'number') {
      return NextResponse.json(
        { error: 'Missing or invalid required fields: metric, value' },
        { status: 400 }
      )
    }
    
    alertService.submitMetric(metric, value, tags)
    
    return NextResponse.json({
      success: true,
      message: 'Metric submitted for evaluation',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to submit metric:', error)
    
    return NextResponse.json(
      {
        error: 'Failed to submit metric',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/alerts/{id}/resolve
 * Resolve a specific alert
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { alertId, action } = body
    
    if (!alertId || action !== 'resolve') {
      return NextResponse.json(
        { error: 'Missing or invalid required fields: alertId, action' },
        { status: 400 }
      )
    }
    
    alertService.resolveAlert(alertId)
    
    return NextResponse.json({
      success: true,
      message: 'Alert resolved successfully',
      alertId,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to resolve alert:', error)
    
    return NextResponse.json(
      {
        error: 'Failed to resolve alert',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}