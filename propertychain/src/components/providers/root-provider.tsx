/**
 * Root Provider
 * Combines all providers in correct order for the application
 */

'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from './theme-provider'
import { QueryProvider } from './query-provider'
import { AuthProvider } from './auth-provider'
import { Web3Provider } from './web3-provider'
import { ToastProvider } from './toast-provider'

interface RootProviderProps {
  children: ReactNode
}

export function RootProvider({ children }: RootProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <AuthProvider>
          <Web3Provider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </Web3Provider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}