/**
 * WebSocket Client for Real-time Updates
 * PropertyLend DeFi Platform
 * 
 * Handles real-time data streaming for:
 * - Pool TVL updates
 * - APY changes
 * - Transaction notifications
 * - Price feeds
 */

import { EventEmitter } from 'events'

export type WSMessage = {
  type: 'pool_update' | 'apy_change' | 'transaction' | 'price_feed' | 'notification' | 'ping' | 'pong'
  data: any
  timestamp: number
}

export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error'

class WebSocketClient extends EventEmitter {
  private ws: WebSocket | null = null
  private url: string
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectInterval = 1000
  private heartbeatInterval: NodeJS.Timeout | null = null
  private connectionState: ConnectionState = 'disconnected'
  private messageQueue: WSMessage[] = []
  private subscriptions: Set<string> = new Set()

  constructor(url?: string) {
    super()
    this.url = url || process.env.NEXT_PUBLIC_WS_URL || 'wss://api.propertylend.io/ws'
  }

  // Connection Management
  connect(): void {
    if (this.connectionState === 'connected' || this.connectionState === 'connecting') {
      return
    }

    this.connectionState = 'connecting'
    this.emit('state_change', this.connectionState)

    try {
      this.ws = new WebSocket(this.url)
      this.setupEventListeners()
    } catch (error) {
      console.error('WebSocket connection error:', error)
      this.handleError(error as Error)
    }
  }

  disconnect(): void {
    this.clearHeartbeat()
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect')
      this.ws = null
    }
    this.connectionState = 'disconnected'
    this.emit('state_change', this.connectionState)
  }

  private setupEventListeners(): void {
    if (!this.ws) return

    this.ws.onopen = () => {
      console.log('WebSocket connected')
      this.connectionState = 'connected'
      this.reconnectAttempts = 0
      this.emit('connected')
      this.emit('state_change', this.connectionState)
      this.startHeartbeat()
      this.flushMessageQueue()
      this.resubscribe()
    }

    this.ws.onmessage = (event) => {
      try {
        const message: WSMessage = JSON.parse(event.data)
        this.handleMessage(message)
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    }

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      this.handleError(new Error('WebSocket error'))
    }

    this.ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason)
      this.connectionState = 'disconnected'
      this.emit('disconnected', { code: event.code, reason: event.reason })
      this.emit('state_change', this.connectionState)
      this.clearHeartbeat()
      
      if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnect()
      }
    }
  }

  private handleMessage(message: WSMessage): void {
    // Emit specific event based on message type
    this.emit(message.type, message.data)
    
    // Emit general message event
    this.emit('message', message)

    // Handle specific message types
    switch (message.type) {
      case 'pool_update':
        this.emit('pool:update', message.data)
        break
      case 'apy_change':
        this.emit('apy:change', message.data)
        break
      case 'transaction':
        this.emit('tx:update', message.data)
        break
      case 'price_feed':
        this.emit('price:update', message.data)
        break
      case 'notification':
        this.emit('notification:new', message.data)
        break
    }
  }

  private handleError(error: Error): void {
    this.connectionState = 'error'
    this.emit('error', error)
    this.emit('state_change', this.connectionState)
  }

  private reconnect(): void {
    this.reconnectAttempts++
    const delay = Math.min(
      this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1),
      30000
    )

    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`)
    
    setTimeout(() => {
      this.connect()
    }, delay)
  }

  // Heartbeat to keep connection alive
  private startHeartbeat(): void {
    this.clearHeartbeat()
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping', data: null, timestamp: Date.now() })
      }
    }, 30000)
  }

  private clearHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  // Message Sending
  send(message: Partial<WSMessage>): void {
    const fullMessage: WSMessage = {
      type: message.type || 'notification',
      data: message.data,
      timestamp: message.timestamp || Date.now()
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(fullMessage))
    } else {
      // Queue message for later
      this.messageQueue.push(fullMessage)
    }
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
      const message = this.messageQueue.shift()
      if (message) {
        this.ws.send(JSON.stringify(message))
      }
    }
  }

  // Subscription Management
  subscribe(channel: string): void {
    this.subscriptions.add(channel)
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.send({
        type: 'notification',
        data: { action: 'subscribe', channel }
      })
    }
  }

  unsubscribe(channel: string): void {
    this.subscriptions.delete(channel)
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.send({
        type: 'notification',
        data: { action: 'unsubscribe', channel }
      })
    }
  }

  private resubscribe(): void {
    this.subscriptions.forEach(channel => {
      this.send({
        type: 'notification',
        data: { action: 'subscribe', channel }
      })
    })
  }

  // Getters
  getState(): ConnectionState {
    return this.connectionState
  }

  isConnected(): boolean {
    return this.connectionState === 'connected' && this.ws?.readyState === WebSocket.OPEN
  }
}

// Singleton instance
let wsClient: WebSocketClient | null = null

export function getWebSocketClient(): WebSocketClient {
  if (!wsClient) {
    wsClient = new WebSocketClient()
  }
  return wsClient
}

// React Hook for WebSocket
import { useEffect, useState, useCallback } from 'react'

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WSMessage | null>(null)
  const client = getWebSocketClient()

  useEffect(() => {
    const handleStateChange = (state: ConnectionState) => {
      setIsConnected(state === 'connected')
    }

    const handleMessage = (message: WSMessage) => {
      setLastMessage(message)
    }

    client.on('state_change', handleStateChange)
    client.on('message', handleMessage)

    // Auto-connect
    if (!client.isConnected()) {
      client.connect()
    }

    return () => {
      client.off('state_change', handleStateChange)
      client.off('message', handleMessage)
    }
  }, [client])

  const subscribe = useCallback((channel: string) => {
    client.subscribe(channel)
  }, [client])

  const unsubscribe = useCallback((channel: string) => {
    client.unsubscribe(channel)
  }, [client])

  const send = useCallback((message: Partial<WSMessage>) => {
    client.send(message)
  }, [client])

  return {
    isConnected,
    lastMessage,
    subscribe,
    unsubscribe,
    send,
    client
  }
}

// Pool-specific hook
export function usePoolUpdates(poolId?: string) {
  const [poolData, setPoolData] = useState<any>(null)
  const { client, isConnected } = useWebSocket()

  useEffect(() => {
    if (!isConnected || !poolId) return

    const handlePoolUpdate = (data: any) => {
      if (data.poolId === poolId) {
        setPoolData(data)
      }
    }

    client.on('pool:update', handlePoolUpdate)
    client.subscribe(`pool:${poolId}`)

    return () => {
      client.off('pool:update', handlePoolUpdate)
      client.unsubscribe(`pool:${poolId}`)
    }
  }, [client, isConnected, poolId])

  return poolData
}

// APY updates hook
export function useAPYUpdates() {
  const [apyData, setApyData] = useState<Record<string, number>>({})
  const { client, isConnected } = useWebSocket()

  useEffect(() => {
    if (!isConnected) return

    const handleAPYChange = (data: any) => {
      setApyData(prev => ({
        ...prev,
        [data.poolId]: data.apy
      }))
    }

    client.on('apy:change', handleAPYChange)
    client.subscribe('apy:all')

    return () => {
      client.off('apy:change', handleAPYChange)
      client.unsubscribe('apy:all')
    }
  }, [client, isConnected])

  return apyData
}

export default WebSocketClient