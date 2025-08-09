/**
 * WebSocket Provider - PropertyChain
 * 
 * Real-time updates via WebSocket connection
 * Following RECOVERY_PLAN.md Phase 4 - Ensure real-time updates work
 */

'use client'

import * as React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNotifications } from '@/contexts/notification-context'
import { queryKeys } from '@/hooks/use-api'

interface WebSocketMessage {
  type: 'property_update' | 'investment_update' | 'notification' | 'price_update' | 'system'
  data: any
  timestamp: string
}

interface WebSocketContextType {
  isConnected: boolean
  send: (message: any) => void
  subscribe: (type: string, handler: (data: any) => void) => () => void
  lastMessage: WebSocketMessage | null
}

const WebSocketContext = React.createContext<WebSocketContextType | undefined>(undefined)

export function useWebSocket() {
  const context = React.useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider')
  }
  return context
}

interface WebSocketProviderProps {
  children: React.ReactNode
  url?: string
  enabled?: boolean
}

export function WebSocketProvider({
  children,
  url = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
  enabled = true,
}: WebSocketProviderProps) {
  const [isConnected, setIsConnected] = React.useState(false)
  const [lastMessage, setLastMessage] = React.useState<WebSocketMessage | null>(null)
  
  const wsRef = React.useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = React.useRef<NodeJS.Timeout>()
  const subscribersRef = React.useRef<Map<string, Set<(data: any) => void>>>(new Map())
  
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  // Send message via WebSocket
  const send = React.useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected')
    }
  }, [])

  // Subscribe to specific message types
  const subscribe = React.useCallback((type: string, handler: (data: any) => void) => {
    if (!subscribersRef.current.has(type)) {
      subscribersRef.current.set(type, new Set())
    }
    subscribersRef.current.get(type)!.add(handler)
    
    // Return unsubscribe function
    return () => {
      subscribersRef.current.get(type)?.delete(handler)
    }
  }, [])

  // Handle incoming messages
  const handleMessage = React.useCallback((event: MessageEvent) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data)
      setLastMessage(message)
      
      // Notify subscribers
      const subscribers = subscribersRef.current.get(message.type)
      if (subscribers) {
        subscribers.forEach(handler => handler(message.data))
      }
      
      // Handle specific message types
      switch (message.type) {
        case 'property_update':
          // Invalidate property queries
          if (message.data.propertyId) {
            queryClient.invalidateQueries({ 
              queryKey: queryKeys.property(message.data.propertyId) 
            })
          }
          queryClient.invalidateQueries({ 
            queryKey: queryKeys.properties() 
          })
          break
          
        case 'investment_update':
          // Invalidate investment queries
          queryClient.invalidateQueries({ 
            queryKey: queryKeys.investments() 
          })
          
          // Show notification
          if (message.data.userId === getCurrentUserId()) {
            addNotification({
              type: 'INVESTMENT',
              title: 'Investment Update',
              description: message.data.description || 'Your investment status has been updated',
              priority: 'medium',
            })
          }
          break
          
        case 'notification':
          // Add to notification center
          addNotification(message.data)
          break
          
        case 'price_update':
          // Update specific property price in cache
          if (message.data.propertyId) {
            queryClient.setQueryData(
              queryKeys.property(message.data.propertyId),
              (old: any) => {
                if (!old) return old
                return {
                  ...old,
                  tokenPrice: message.data.tokenPrice,
                  price: message.data.price,
                }
              }
            )
          }
          break
          
        case 'system':
          // System messages (maintenance, etc.)
          console.log('[WebSocket] System message:', message.data)
          break
      }
    } catch (error) {
      console.error('[WebSocket] Failed to parse message:', error)
    }
  }, [queryClient, addNotification])

  // Connect to WebSocket
  const connect = React.useCallback(() => {
    if (!enabled || typeof window === 'undefined') return
    
    try {
      // Close existing connection
      if (wsRef.current) {
        wsRef.current.close()
      }
      
      // Create new WebSocket connection
      const ws = new WebSocket(url)
      wsRef.current = ws
      
      ws.onopen = () => {
        console.log('[WebSocket] Connected')
        setIsConnected(true)
        
        // Clear reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
        }
        
        // Send authentication if needed
        const token = localStorage.getItem('auth_token')
        if (token) {
          send({ type: 'auth', token })
        }
      }
      
      ws.onmessage = handleMessage
      
      ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error)
      }
      
      ws.onclose = () => {
        console.log('[WebSocket] Disconnected')
        setIsConnected(false)
        wsRef.current = null
        
        // Attempt to reconnect after delay
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('[WebSocket] Attempting to reconnect...')
          connect()
        }, 5000)
      }
    } catch (error) {
      console.error('[WebSocket] Failed to connect:', error)
      setIsConnected(false)
      
      // Retry connection
      reconnectTimeoutRef.current = setTimeout(connect, 5000)
    }
  }, [enabled, url, send, handleMessage])

  // Initialize connection
  React.useEffect(() => {
    connect()
    
    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [connect])

  // Handle visibility change (reconnect when tab becomes visible)
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isConnected) {
        connect()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isConnected, connect])

  const value = React.useMemo(
    () => ({
      isConnected,
      send,
      subscribe,
      lastMessage,
    }),
    [isConnected, send, subscribe, lastMessage]
  )

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  )
}

// Helper function to get current user ID (mock for MVP)
function getCurrentUserId(): string | null {
  // In production, get from auth context
  return 'user-1'
}

// Hook for subscribing to specific message types
export function useWebSocketSubscription(
  type: string,
  handler: (data: any) => void
) {
  const { subscribe } = useWebSocket()
  
  React.useEffect(() => {
    const unsubscribe = subscribe(type, handler)
    return unsubscribe
  }, [type, handler, subscribe])
}

// Hook for real-time property updates
export function useRealtimeProperty(propertyId: string) {
  const queryClient = useQueryClient()
  
  useWebSocketSubscription('property_update', (data) => {
    if (data.propertyId === propertyId) {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.property(propertyId) 
      })
    }
  })
}

// Hook for real-time investment updates
export function useRealtimeInvestments() {
  const queryClient = useQueryClient()
  
  useWebSocketSubscription('investment_update', (data) => {
    queryClient.invalidateQueries({ 
      queryKey: queryKeys.investments() 
    })
  })
}

// Mock WebSocket server for development
export function createMockWebSocketServer() {
  if (typeof window === 'undefined') return
  
  // Simulate server messages for development
  const mockMessages = [
    {
      type: 'property_update',
      data: {
        propertyId: '1',
        availableTokens: 14500,
        fundingProgress: 42,
      },
    },
    {
      type: 'notification',
      data: {
        type: 'PROPERTY',
        title: 'New Property Listed',
        description: 'Downtown Office Complex is now available for investment',
        priority: 'medium',
      },
    },
    {
      type: 'price_update',
      data: {
        propertyId: '2',
        tokenPrice: 255,
        price: 5100000,
      },
    },
  ]
  
  // Send mock messages periodically
  let index = 0
  setInterval(() => {
    if (window.mockWebSocketHandler) {
      const message = mockMessages[index % mockMessages.length]
      window.mockWebSocketHandler({
        data: JSON.stringify({
          ...message,
          timestamp: new Date().toISOString(),
        }),
      })
      index++
    }
  }, 30000) // Every 30 seconds
}

// Type for mock handler
declare global {
  interface Window {
    mockWebSocketHandler?: (event: { data: string }) => void
  }
}