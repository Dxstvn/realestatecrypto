/**
 * WebSocket Provider Component
 * PropertyLend DeFi Platform
 * 
 * Provides WebSocket context for real-time updates across the app
 */

'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { getWebSocketClient, type WSMessage, type ConnectionState } from '@/lib/websocket/client'
import { toast } from 'sonner'
import { Activity, WifiOff, Wifi } from 'lucide-react'

interface WebSocketContextType {
  isConnected: boolean
  connectionState: ConnectionState
  lastMessage: WSMessage | null
  subscribe: (channel: string) => void
  unsubscribe: (channel: string) => void
  send: (message: Partial<WSMessage>) => void
}

const WebSocketContext = createContext<WebSocketContextType | null>(null)

export function useWebSocketContext() {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocketContext must be used within WebSocketProvider')
  }
  return context
}

interface WebSocketProviderProps {
  children: React.ReactNode
  autoConnect?: boolean
  showConnectionStatus?: boolean
}

export function WebSocketProvider({ 
  children, 
  autoConnect = true,
  showConnectionStatus = true 
}: WebSocketProviderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected')
  const [lastMessage, setLastMessage] = useState<WSMessage | null>(null)
  const [client] = useState(() => getWebSocketClient())

  useEffect(() => {
    // Setup event listeners
    const handleStateChange = (state: ConnectionState) => {
      setConnectionState(state)
      setIsConnected(state === 'connected')

      // Show connection status toasts
      if (showConnectionStatus) {
        switch (state) {
          case 'connected':
            toast.success('Real-time updates connected', {
              icon: <Wifi className="h-4 w-4" />,
              duration: 2000,
            })
            break
          case 'disconnected':
            toast.error('Real-time updates disconnected', {
              icon: <WifiOff className="h-4 w-4" />,
              duration: 3000,
            })
            break
          case 'connecting':
            toast.loading('Connecting to real-time updates...', {
              icon: <Activity className="h-4 w-4 animate-pulse" />,
            })
            break
        }
      }
    }

    const handleMessage = (message: WSMessage) => {
      setLastMessage(message)
    }

    const handleError = (error: Error) => {
      console.error('WebSocket error:', error)
      if (showConnectionStatus) {
        toast.error('Connection error. Retrying...', {
          duration: 3000,
        })
      }
    }

    // Attach listeners
    client.on('state_change', handleStateChange)
    client.on('message', handleMessage)
    client.on('error', handleError)

    // Auto-connect if enabled
    if (autoConnect) {
      client.connect()
    }

    // Cleanup
    return () => {
      client.off('state_change', handleStateChange)
      client.off('message', handleMessage)
      client.off('error', handleError)
      
      // Don't disconnect on unmount to preserve connection across navigation
      // client.disconnect()
    }
  }, [client, autoConnect, showConnectionStatus])

  const contextValue: WebSocketContextType = {
    isConnected,
    connectionState,
    lastMessage,
    subscribe: (channel: string) => client.subscribe(channel),
    unsubscribe: (channel: string) => client.unsubscribe(channel),
    send: (message: Partial<WSMessage>) => client.send(message),
  }

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
      {showConnectionStatus && (
        <ConnectionIndicator 
          isConnected={isConnected} 
          connectionState={connectionState} 
        />
      )}
    </WebSocketContext.Provider>
  )
}

// Connection status indicator component
function ConnectionIndicator({ 
  isConnected, 
  connectionState 
}: { 
  isConnected: boolean
  connectionState: ConnectionState 
}) {
  if (connectionState === 'connected') return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`
        flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-sm
        ${connectionState === 'connecting' 
          ? 'bg-yellow-950/90 border border-yellow-800 text-yellow-400' 
          : 'bg-red-950/90 border border-red-800 text-red-400'
        }
      `}>
        {connectionState === 'connecting' ? (
          <>
            <Activity className="h-4 w-4 animate-pulse" />
            <span className="text-sm">Connecting...</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" />
            <span className="text-sm">Offline Mode</span>
          </>
        )}
      </div>
    </div>
  )
}