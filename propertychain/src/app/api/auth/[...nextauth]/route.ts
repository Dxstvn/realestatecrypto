/**
 * NextAuth API Route Handler - PropertyChain
 * 
 * Handles all authentication endpoints through NextAuth.js
 * Following UpdatedUIPlan.md Step 53 and CLAUDE.md security standards
 */

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Create and export the NextAuth handlers for Next.js App Router
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

// Also export OPTIONS for CORS preflight requests
export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}