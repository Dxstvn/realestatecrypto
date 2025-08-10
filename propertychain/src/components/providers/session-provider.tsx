/**
 * Session Provider - PropertyChain
 * 
 * NextAuth.js session provider wrapper
 * Following UpdatedUIPlan.md Step 53 and CLAUDE.md security standards
 */

'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

interface SessionProviderProps {
  children: ReactNode
}

/**
 * Session provider component that wraps the app with NextAuth session context
 */
export function SessionProvider({ children }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider
      // Re-fetch session every 5 minutes
      refetchInterval={5 * 60}
      // Re-fetch session on window focus
      refetchOnWindowFocus={true}
    >
      {children}
    </NextAuthSessionProvider>
  )
}