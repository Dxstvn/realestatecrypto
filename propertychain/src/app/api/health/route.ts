/**
 * Health Check API Route - PropertyChain
 * 
 * System health and status monitoring endpoint
 * Following CLAUDE.md monitoring standards
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, setCacheHeaders } from '@/lib/api-utils'

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  uptime: number
  version: string
  services: {
    database: ServiceStatus
    blockchain: ServiceStatus
    storage: ServiceStatus
    cache: ServiceStatus
  }
  metrics: {
    totalUsers: number
    totalProperties: number
    totalInvestments: number
    activeConnections: number
  }
}

interface ServiceStatus {
  status: 'up' | 'down' | 'degraded'
  latency: number
  lastCheck: string
  error?: string
}

// GET /api/health - System health check
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Check database health
    const dbStatus = await checkDatabaseHealth()
    
    // Check blockchain connection (mock for MVP)
    const blockchainStatus = await checkBlockchainHealth()
    
    // Check storage service (mock for MVP)
    const storageStatus = await checkStorageHealth()
    
    // Check cache service (mock for MVP)
    const cacheStatus = await checkCacheHealth()
    
    // Get system metrics
    const metrics = await getSystemMetrics()
    
    // Calculate overall status
    const services = {
      database: dbStatus,
      blockchain: blockchainStatus,
      storage: storageStatus,
      cache: cacheStatus,
    }
    
    const allServicesUp = Object.values(services).every(s => s.status === 'up')
    const anyServiceDown = Object.values(services).some(s => s.status === 'down')
    
    const health: HealthStatus = {
      status: anyServiceDown ? 'unhealthy' : allServicesUp ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      services,
      metrics,
    }
    
    // Set appropriate status code
    const statusCode = health.status === 'healthy' ? 200 : 
                       health.status === 'degraded' ? 200 : 503
    
    // Return response with short cache
    const response = NextResponse.json(health, { status: statusCode })
    return setCacheHeaders(response, 10, 30) // Cache for 10 seconds
    
  } catch (error) {
    // If health check itself fails, return unhealthy status
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        error: error instanceof Error ? error.message : 'Health check failed',
      },
      { status: 503 }
    )
  }
}

// Check database health
async function checkDatabaseHealth(): Promise<ServiceStatus> {
  const startTime = Date.now()
  
  try {
    // Try to fetch from database
    await db.findAll(db.propertiesCollection)
    
    return {
      status: 'up',
      latency: Date.now() - startTime,
      lastCheck: new Date().toISOString(),
    }
  } catch (error) {
    return {
      status: 'down',
      latency: Date.now() - startTime,
      lastCheck: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Database connection failed',
    }
  }
}

// Check blockchain health (mock for MVP)
async function checkBlockchainHealth(): Promise<ServiceStatus> {
  const startTime = Date.now()
  
  try {
    // In production, check actual blockchain connection
    // For MVP, simulate with random latency
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100))
    
    // Randomly simulate degraded state (5% chance)
    const isDegraded = Math.random() < 0.05
    
    return {
      status: isDegraded ? 'degraded' : 'up',
      latency: Date.now() - startTime,
      lastCheck: new Date().toISOString(),
    }
  } catch (error) {
    return {
      status: 'down',
      latency: Date.now() - startTime,
      lastCheck: new Date().toISOString(),
      error: 'Blockchain connection failed',
    }
  }
}

// Check storage health (mock for MVP)
async function checkStorageHealth(): Promise<ServiceStatus> {
  const startTime = Date.now()
  
  try {
    // In production, check IPFS or storage service
    await new Promise(resolve => setTimeout(resolve, Math.random() * 50))
    
    return {
      status: 'up',
      latency: Date.now() - startTime,
      lastCheck: new Date().toISOString(),
    }
  } catch (error) {
    return {
      status: 'down',
      latency: Date.now() - startTime,
      lastCheck: new Date().toISOString(),
      error: 'Storage service unavailable',
    }
  }
}

// Check cache health (mock for MVP)
async function checkCacheHealth(): Promise<ServiceStatus> {
  const startTime = Date.now()
  
  try {
    // In production, check Redis or cache service
    await new Promise(resolve => setTimeout(resolve, Math.random() * 20))
    
    return {
      status: 'up',
      latency: Date.now() - startTime,
      lastCheck: new Date().toISOString(),
    }
  } catch (error) {
    return {
      status: 'down',
      latency: Date.now() - startTime,
      lastCheck: new Date().toISOString(),
      error: 'Cache service unavailable',
    }
  }
}

// Get system metrics
async function getSystemMetrics() {
  try {
    const [users, properties, investments] = await Promise.all([
      db.findAll(db.usersCollection),
      db.findAll(db.propertiesCollection),
      db.findAll(db.investmentsCollection),
    ])
    
    return {
      totalUsers: users.length,
      totalProperties: properties.length,
      totalInvestments: investments.length,
      activeConnections: Math.floor(Math.random() * 100), // Mock active connections
    }
  } catch {
    return {
      totalUsers: 0,
      totalProperties: 0,
      totalInvestments: 0,
      activeConnections: 0,
    }
  }
}