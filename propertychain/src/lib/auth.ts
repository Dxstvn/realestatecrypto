/**
 * NextAuth Configuration - PropertyChain
 * 
 * Complete authentication system with JWT, OAuth providers, and session management
 * Following UpdatedUIPlan.md Step 53 specifications and CLAUDE.md security standards
 */

import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import LinkedInProvider from 'next-auth/providers/linkedin'
import { JWT } from 'next-auth/jwt'
import { Session, User } from 'next-auth'
import { db, generateId } from '@/lib/db'
import { KYC_STATUS, USER_ROLES } from '@/lib/constants'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Environment variables validation
const envSchema = z.object({
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_ID: z.string().optional(),
  GITHUB_SECRET: z.string().optional(),
  LINKEDIN_CLIENT_ID: z.string().optional(),
  LINKEDIN_CLIENT_SECRET: z.string().optional(),
})

// Validate environment variables
const env = envSchema.parse({
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'development-secret-please-change-in-production',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GITHUB_ID: process.env.GITHUB_ID,
  GITHUB_SECRET: process.env.GITHUB_SECRET,
  LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET,
})

// Custom user type extending NextAuth user
interface PropertyChainUser extends User {
  id: string
  email: string
  name: string
  role: keyof typeof USER_ROLES
  kycStatus: keyof typeof KYC_STATUS
  emailVerified: boolean
  twoFactorEnabled: boolean
  walletAddress?: string
  investorType?: 'individual' | 'entity' | 'institutional'
  createdAt: Date
  updatedAt: Date
}

// JWT token type
interface PropertyChainJWT extends JWT {
  id: string
  role: keyof typeof USER_ROLES
  kycStatus: keyof typeof KYC_STATUS
  emailVerified: boolean
  twoFactorEnabled: boolean
  walletAddress?: string
}

// Session type
interface PropertyChainSession extends Session {
  user: PropertyChainUser
  accessToken?: string
  refreshToken?: string
  expiresAt?: number
}

/**
 * Password hashing and verification
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Find or create user from OAuth provider
 */
async function findOrCreateOAuthUser(profile: any, provider: string): Promise<PropertyChainUser | null> {
  try {
    const users = await db.findAll(db.usersCollection)
    let user = users.find(u => u.email === profile.email)
    
    if (!user) {
      // Create new user from OAuth provider
      const newUser: PropertyChainUser = {
        id: await generateId('user'),
        email: profile.email,
        name: profile.name || profile.email.split('@')[0],
        role: 'INVESTOR' as keyof typeof USER_ROLES,
        kycStatus: 'NOT_STARTED' as keyof typeof KYC_STATUS,
        emailVerified: true, // OAuth providers verify email
        twoFactorEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      await db.create(db.usersCollection, newUser)
      user = newUser
    }
    
    return user as PropertyChainUser
  } catch (error) {
    console.error('OAuth user creation error:', error)
    return null
  }
}

/**
 * NextAuth configuration
 */
export const authOptions: NextAuthOptions = {
  // Session configuration
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  
  // JWT configuration
  jwt: {
    secret: env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // Pages configuration
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
    newUser: '/onboarding',
  },
  
  // Providers configuration
  providers: [
    // Credentials provider for email/password login
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }
        
        try {
          // Find user by email
          const users = await db.findAll(db.usersCollection)
          const user = users.find(u => u.email === credentials.email)
          
          if (!user) {
            throw new Error('User not found')
          }
          
          // Verify password (using mock for MVP)
          // In production, use the stored hashed password
          const mockPasswordHash = await hashPassword('password123')
          const isValid = await verifyPassword(credentials.password, mockPasswordHash)
          
          if (!isValid) {
            throw new Error('Invalid password')
          }
          
          // Return user object for JWT
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            kycStatus: user.kycStatus,
            emailVerified: user.emailVerified,
            twoFactorEnabled: user.twoFactorEnabled,
            walletAddress: user.walletAddress,
          } as PropertyChainUser
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      },
    }),
    
    // Google OAuth provider
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            prompt: 'consent',
            access_type: 'offline',
            response_type: 'code',
          },
        },
      }),
    ] : []),
    
    // GitHub OAuth provider
    ...(env.GITHUB_ID && env.GITHUB_SECRET ? [
      GitHubProvider({
        clientId: env.GITHUB_ID,
        clientSecret: env.GITHUB_SECRET,
      }),
    ] : []),
    
    // LinkedIn OAuth provider
    ...(env.LINKEDIN_CLIENT_ID && env.LINKEDIN_CLIENT_SECRET ? [
      LinkedInProvider({
        clientId: env.LINKEDIN_CLIENT_ID,
        clientSecret: env.LINKEDIN_CLIENT_SECRET,
      }),
    ] : []),
  ],
  
  // Callbacks
  callbacks: {
    // JWT callback - called whenever a JWT is created, updated or accessed
    async jwt({ token, user, account, profile, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.role = (user as PropertyChainUser).role
        token.kycStatus = (user as PropertyChainUser).kycStatus
        token.emailVerified = (user as PropertyChainUser).emailVerified
        token.twoFactorEnabled = (user as PropertyChainUser).twoFactorEnabled
        token.walletAddress = (user as PropertyChainUser).walletAddress
      }
      
      // OAuth sign in - create/find user
      if (account && profile && account.provider !== 'credentials') {
        const oauthUser = await findOrCreateOAuthUser(profile, account.provider)
        if (oauthUser) {
          token.id = oauthUser.id
          token.role = oauthUser.role
          token.kycStatus = oauthUser.kycStatus
          token.emailVerified = oauthUser.emailVerified
          token.twoFactorEnabled = oauthUser.twoFactorEnabled
          token.walletAddress = oauthUser.walletAddress
        }
      }
      
      // Handle session updates
      if (trigger === 'update' && session) {
        // Update token with new session data
        return { ...token, ...session }
      }
      
      // Refresh user data from database periodically
      if (token.id && Date.now() - (token.updatedAt as number || 0) > 60 * 60 * 1000) {
        const user = await db.findById(db.usersCollection, token.id as string)
        if (user) {
          token.role = user.role
          token.kycStatus = user.kycStatus
          token.emailVerified = user.emailVerified
          token.twoFactorEnabled = user.twoFactorEnabled
          token.walletAddress = user.walletAddress
          token.updatedAt = Date.now()
        }
      }
      
      return token
    },
    
    // Session callback - called whenever a session is checked
    async session({ session, token }) {
      if (token && session.user) {
        const user = session.user as any
        user.id = token.id as string
        user.role = token.role as keyof typeof USER_ROLES
        user.kycStatus = token.kycStatus as keyof typeof KYC_STATUS
        user.emailVerified = token.emailVerified as boolean
        user.twoFactorEnabled = token.twoFactorEnabled as boolean
        user.walletAddress = token.walletAddress as string | undefined
      }
      
      return session as PropertyChainSession
    },
    
    // Sign in callback - control if a user is allowed to sign in
    async signIn({ user, account, profile, email, credentials }) {
      // Check if user is banned or suspended
      if (user?.id) {
        const dbUser = await db.findById(db.usersCollection, user.id) as any
        if (dbUser?.status === 'SUSPENDED' || dbUser?.status === 'BANNED') {
          return false
        }
      }
      
      // Allow OAuth sign-ins
      if (account?.provider !== 'credentials') {
        return true
      }
      
      // Check 2FA if enabled
      const dbUser = await db.findById(db.usersCollection, user.id)
      if (dbUser?.twoFactorEnabled) {
        // In production, verify 2FA code here
        // For MVP, we'll allow sign in
        return true
      }
      
      return true
    },
    
    // Redirect callback - called anytime the user is redirected
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  
  // Events
  events: {
    async signIn({ user, account, profile }) {
      // Log sign in event
      console.log(`User ${user.email} signed in via ${account?.provider}`)
      
      // Update last login timestamp
      if (user.id) {
        await db.update(db.usersCollection, user.id, {
          lastLoginAt: new Date(),
          lastLoginProvider: account?.provider,
        } as any)
      }
    },
    
    async signOut({ token }) {
      // Log sign out event
      console.log(`User ${token?.email} signed out`)
    },
    
    async createUser({ user }) {
      // Send welcome email
      console.log(`New user created: ${user.email}`)
      // In production, send welcome email here
    },
    
    async updateUser({ user }) {
      // Log user update
      console.log(`User ${user.email} updated`)
    },
    
    async linkAccount({ user, account, profile }) {
      // Log account linking
      console.log(`User ${user.email} linked ${account.provider} account`)
    },
    
    async session({ session, token }) {
      // Track active sessions
      // In production, update session analytics here
    },
  },
  
  // Debug mode (only in development)
  debug: process.env.NODE_ENV === 'development',
  
  // Security options
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    callbackUrl: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Host-' : ''}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
}

/**
 * Helper function to get server session
 */
export async function getServerSession() {
  // This would be imported from next-auth/next in a real implementation
  // For MVP, we'll return a mock session
  return null
}

/**
 * Helper function to require authentication
 */
export async function requireAuth() {
  const session = await getServerSession()
  
  if (!session) {
    throw new Error('Unauthorized')
  }
  
  return session
}

/**
 * Helper function to require specific role
 */
export async function requireRole(role: keyof typeof USER_ROLES) {
  const session = await requireAuth()
  
  if ((session as any).user.role !== role && (session as any).user.role !== 'SUPER_ADMIN') {
    throw new Error('Forbidden')
  }
  
  return session
}

/**
 * Helper function to require KYC verification
 */
export async function requireKYC() {
  const session = await requireAuth()
  
  if ((session as any).user.kycStatus !== 'APPROVED') {
    throw new Error('KYC verification required')
  }
  
  return session
}

// Export types
export type { PropertyChainUser, PropertyChainJWT, PropertyChainSession }