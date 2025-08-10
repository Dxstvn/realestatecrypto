/**
 * Query Provider - PropertyChain
 * 
 * React Query configuration for server state management
 * Optimized for PropertyChain's real estate and blockchain data
 */

'use client'

import { ReactNode, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

interface QueryProviderProps {
  children: ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Create query client with PropertyChain-optimized defaults
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Real estate data doesn't change frequently
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
            
            // Retry configuration for blockchain calls
            retry: (failureCount, error: any) => {
              // Don't retry on authentication errors
              if (error?.status === 401 || error?.status === 403) {
                return false
              }
              
              // Retry up to 3 times for network/server errors
              return failureCount < 3
            },
            
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            
            // Refetch on window focus for real-time price updates
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
          },
          
          mutations: {
            // Longer timeout for blockchain transactions
            retry: 1,
            retryDelay: 2000,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position={"bottom" as any}
        />
      )}
    </QueryClientProvider>
  )
}