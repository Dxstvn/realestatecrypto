/**
 * Blockchain Health Check API Route - PropertyChain
 * 
 * Blockchain connectivity health monitoring
 * Following UpdatedUIPlan.md Step 65 specifications and CLAUDE.md principles
 */

import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/health/blockchain
 * Check blockchain connectivity and network status
 */
export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    // Check blockchain connectivity
    const blockchainCheck = await checkBlockchainHealth()
    const responseTime = Date.now() - startTime
    
    if (blockchainCheck.connected) {
      return NextResponse.json({
        status: 'healthy',
        service: 'blockchain',
        timestamp: new Date().toISOString(),
        responseTime,
        details: blockchainCheck.details,
      })
    } else {
      return NextResponse.json({
        status: blockchainCheck.degraded ? 'degraded' : 'unhealthy',
        service: 'blockchain',
        timestamp: new Date().toISOString(),
        responseTime,
        error: blockchainCheck.error,
        details: blockchainCheck.details,
      }, { status: blockchainCheck.degraded ? 200 : 503 })
    }
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      service: 'blockchain',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Blockchain health check failed',
    }, { status: 503 })
  }
}

/**
 * Check blockchain connectivity and status
 */
async function checkBlockchainHealth() {
  try {
    const networks = [
      { name: 'ethereum', rpc: process.env.ETHEREUM_RPC_URL },
      { name: 'polygon', rpc: process.env.POLYGON_RPC_URL },
    ]
    
    const results = await Promise.allSettled(
      networks.map(network => checkNetworkHealth(network))
    )
    
    const networkStatuses = results.map((result, index) => ({
      network: networks[index].name,
      status: result.status === 'fulfilled' ? result.value : { connected: false, error: 'Check failed' },
    }))
    
    const connectedNetworks = networkStatuses.filter(n => n.status.connected)
    const totalNetworks = networkStatuses.length
    
    const connected = connectedNetworks.length > 0
    const degraded = connectedNetworks.length < totalNetworks && connectedNetworks.length > 0
    
    return {
      connected,
      degraded,
      details: {
        networks: networkStatuses,
        connectedCount: connectedNetworks.length,
        totalCount: totalNetworks,
      },
      error: connected ? undefined : 'No blockchain networks available',
    }
  } catch (error) {
    return {
      connected: false,
      degraded: false,
      error: error instanceof Error ? error.message : 'Blockchain check failed',
      details: {},
    }
  }
}

/**
 * Check individual network health
 */
async function checkNetworkHealth(network: { name: string; rpc?: string }) {
  if (!network.rpc) {
    return {
      connected: false,
      error: 'RPC URL not configured',
    }
  }
  
  try {
    // Check RPC connectivity
    const response = await fetch(network.rpc, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1,
      }),
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })
    
    if (!response.ok) {
      return {
        connected: false,
        error: `HTTP ${response.status}`,
      }
    }
    
    const data = await response.json()
    
    if (data.error) {
      return {
        connected: false,
        error: data.error.message || 'RPC error',
      }
    }
    
    const blockNumber = parseInt(data.result, 16)
    
    return {
      connected: true,
      blockNumber,
      lastBlock: new Date().toISOString(),
      network: network.name,
    }
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Connection failed',
    }
  }
}