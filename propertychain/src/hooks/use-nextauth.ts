/**
 * NextAuth Hook - PropertyChain
 * 
 * Enhanced authentication hook using NextAuth.js
 * Following UpdatedUIPlan.md Step 53 and CLAUDE.md security standards
 */

'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import type { PropertyChainSession } from '@/lib/auth'

interface UseNextAuthReturn {
  // State
  user: PropertyChainSession['user'] | null
  session: PropertyChainSession | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Auth methods
  login: (credentials: LoginCredentials) => Promise<void>
  loginWithProvider: (provider: OAuthProvider) => Promise<void>
  logout: () => Promise<void>
  register: (data: RegisterData) => Promise<void>
  
  // User management
  updateProfile: (data: UpdateProfileData) => Promise<void>
  changePassword: (data: ChangePasswordData) => Promise<void>
  enable2FA: () => Promise<void>
  disable2FA: (code: string) => Promise<void>
  
  // Session management
  refreshSession: () => Promise<void>
  checkSession: () => boolean
  
  // KYC methods
  startKYC: () => Promise<void>
  submitKYCDocuments: (documents: KYCDocuments) => Promise<void>
  getKYCStatus: () => string | undefined
  
  // Wallet connection
  connectWallet: (address: string) => Promise<void>
  disconnectWallet: () => Promise<void>
}

interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
  twoFactorCode?: string
}

interface RegisterData {
  email: string
  password: string
  name: string
  role?: 'INVESTOR' | 'PROPERTY_OWNER'
  acceptTerms: boolean
}

interface UpdateProfileData {
  name?: string
  email?: string
  phone?: string
  investorType?: 'individual' | 'entity' | 'institutional'
  preferences?: Record<string, any>
}

interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface KYCDocuments {
  idType: 'passport' | 'license' | 'national_id'
  idDocument: File
  proofOfAddress: File
  bankStatement?: File
  accreditationDoc?: File
}

type OAuthProvider = 'google' | 'github' | 'linkedin'

/**
 * Enhanced authentication hook with NextAuth.js integration
 */
export function useNextAuth(): UseNextAuthReturn {
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const typedSession = session as PropertyChainSession | null
  const isAuthenticated = status === 'authenticated'
  const isSessionLoading = status === 'loading'
  
  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])
  
  /**
   * Login with email and password
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      })
      
      if (result?.error) {
        setError(result.error)
        toast.error(result.error)
        return
      }
      
      if (result?.ok) {
        toast.success('Welcome back!')
        
        // Handle remember me
        if (credentials.rememberMe) {
          // Set longer session duration
          await update({ rememberMe: true })
        }
        
        // Redirect to dashboard or return URL
        const returnUrl = new URLSearchParams(window.location.search).get('from')
        router.push(returnUrl || '/dashboard')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [router, update])
  
  /**
   * Login with OAuth provider
   */
  const loginWithProvider = useCallback(async (provider: OAuthProvider) => {
    setIsLoading(true)
    setError(null)
    
    try {
      await signIn(provider, {
        callbackUrl: '/dashboard',
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : `${provider} login failed`
      setError(message)
      toast.error(message)
      setIsLoading(false)
    }
  }, [])
  
  /**
   * Logout
   */
  const logout = useCallback(async () => {
    setIsLoading(true)
    
    try {
      await signOut({
        redirect: false,
      })
      
      toast.success('Logged out successfully')
      router.push('/')
    } catch (err) {
      console.error('Logout error:', err)
      toast.error('Logout failed')
    } finally {
      setIsLoading(false)
    }
  }, [router])
  
  /**
   * Register new account
   */
  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Call registration API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Registration failed')
      }
      
      // Auto-login after successful registration
      await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })
      
      toast.success('Account created successfully!')
      router.push('/onboarding')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [router])
  
  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    if (!typedSession?.user?.id) {
      setError('Not authenticated')
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/users/${typedSession.user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Profile update failed')
      }
      
      // Refresh session to get updated user data
      await update()
      
      toast.success('Profile updated successfully')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Update failed'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [typedSession, update])
  
  /**
   * Change password
   */
  const changePassword = useCallback(async (data: ChangePasswordData) => {
    if (!typedSession?.user?.id) {
      setError('Not authenticated')
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Password change failed')
      }
      
      toast.success('Password changed successfully')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password change failed'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [typedSession])
  
  /**
   * Enable two-factor authentication
   */
  const enable2FA = useCallback(async () => {
    if (!typedSession?.user?.id) {
      setError('Not authenticated')
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/2fa/enable', {
        method: 'POST',
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || '2FA setup failed')
      }
      
      // Update session
      await update({ twoFactorEnabled: true })
      
      toast.success('Two-factor authentication enabled')
      
      // Return QR code for authenticator app
      return result.qrCode
    } catch (err) {
      const message = err instanceof Error ? err.message : '2FA setup failed'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [typedSession, update])
  
  /**
   * Disable two-factor authentication
   */
  const disable2FA = useCallback(async (code: string) => {
    if (!typedSession?.user?.id) {
      setError('Not authenticated')
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      
      if (!response.ok) {
        throw new Error('Invalid 2FA code')
      }
      
      // Update session
      await update({ twoFactorEnabled: false })
      
      toast.success('Two-factor authentication disabled')
    } catch (err) {
      const message = err instanceof Error ? err.message : '2FA disable failed'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [typedSession, update])
  
  /**
   * Refresh session
   */
  const refreshSession = useCallback(async () => {
    await update()
  }, [update])
  
  /**
   * Check if session is valid
   */
  const checkSession = useCallback(() => {
    return isAuthenticated && !!typedSession?.user
  }, [isAuthenticated, typedSession])
  
  /**
   * Start KYC process
   */
  const startKYC = useCallback(async () => {
    if (!typedSession?.user?.id) {
      setError('Not authenticated')
      return
    }
    
    router.push('/onboarding/kyc')
  }, [typedSession, router])
  
  /**
   * Submit KYC documents
   */
  const submitKYCDocuments = useCallback(async (documents: KYCDocuments) => {
    if (!typedSession?.user?.id) {
      setError('Not authenticated')
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('idType', documents.idType)
      formData.append('idDocument', documents.idDocument)
      formData.append('proofOfAddress', documents.proofOfAddress)
      
      if (documents.bankStatement) {
        formData.append('bankStatement', documents.bankStatement)
      }
      
      if (documents.accreditationDoc) {
        formData.append('accreditationDoc', documents.accreditationDoc)
      }
      
      const response = await fetch('/api/kyc/submit', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('KYC submission failed')
      }
      
      // Update session with new KYC status
      await update({ kycStatus: 'PENDING' })
      
      toast.success('KYC documents submitted for review')
      router.push('/dashboard')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'KYC submission failed'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [typedSession, router, update])
  
  /**
   * Get KYC status
   */
  const getKYCStatus = useCallback(() => {
    return typedSession?.user?.kycStatus
  }, [typedSession])
  
  /**
   * Connect wallet
   */
  const connectWallet = useCallback(async (address: string) => {
    if (!typedSession?.user?.id) {
      setError('Not authenticated')
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/wallet/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      })
      
      if (!response.ok) {
        throw new Error('Wallet connection failed')
      }
      
      // Update session with wallet address
      await update({ walletAddress: address })
      
      toast.success('Wallet connected successfully')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Wallet connection failed'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [typedSession, update])
  
  /**
   * Disconnect wallet
   */
  const disconnectWallet = useCallback(async () => {
    if (!typedSession?.user?.id) {
      setError('Not authenticated')
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/wallet/disconnect', {
        method: 'POST',
      })
      
      if (!response.ok) {
        throw new Error('Wallet disconnection failed')
      }
      
      // Update session
      await update({ walletAddress: null })
      
      toast.success('Wallet disconnected')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Wallet disconnection failed'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [typedSession, update])
  
  return {
    // State
    user: typedSession?.user || null,
    session: typedSession,
    isAuthenticated,
    isLoading: isLoading || isSessionLoading,
    error,
    
    // Auth methods
    login,
    loginWithProvider,
    logout,
    register,
    
    // User management
    updateProfile,
    changePassword,
    enable2FA,
    disable2FA,
    
    // Session management
    refreshSession,
    checkSession,
    
    // KYC methods
    startKYC,
    submitKYCDocuments,
    getKYCStatus,
    
    // Wallet connection
    connectWallet,
    disconnectWallet,
  }
}