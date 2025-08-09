/**
 * Authentication Context - PropertyChain
 * 
 * Global authentication state management
 * Following CLAUDE.md security and state management standards
 */

'use client'

import * as React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'

// ============================================================================
// Types
// ============================================================================

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'investor' | 'owner' | 'admin'
  investorType?: 'individual' | 'institutional' | 'accredited'
  kycStatus: 'pending' | 'verified' | 'rejected'
  walletAddress?: string
  createdAt: Date
  lastLogin: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface AuthContextValue extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  loginWithWallet: (address: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  checkAuth: () => Promise<void>
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  dateOfBirth: string
  investorType: 'individual' | 'institutional' | 'accredited'
  investmentGoal: 'growth' | 'income' | 'balanced'
  experienceLevel: 'beginner' | 'intermediate' | 'expert'
  termsAccepted: boolean
  privacyAccepted: boolean
  marketingOptIn: boolean
}

// ============================================================================
// Context
// ============================================================================

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

// ============================================================================
// Provider
// ============================================================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [state, setState] = React.useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  })

  // Check authentication on mount
  React.useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      // Check for stored token
      const token = localStorage.getItem('auth-token')
      
      if (token) {
        // In production, validate token with API
        // For now, simulate user retrieval
        const mockUser: User = {
          id: '1',
          email: 'user@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'investor',
          investorType: 'individual',
          kycStatus: 'verified',
          createdAt: new Date(),
          lastLogin: new Date(),
        }
        
        setState({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
        
        // Set cookie for middleware
        document.cookie = `auth-token=${token}; path=/`
        document.cookie = `user-role=${mockUser.role}; path=/`
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      }
    } catch (error) {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to authenticate',
      })
    }
  }

  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock successful login
      const mockUser: User = {
        id: '1',
        email,
        firstName: 'John',
        lastName: 'Doe',
        role: 'investor',
        investorType: 'individual',
        kycStatus: 'verified',
        createdAt: new Date(),
        lastLogin: new Date(),
      }
      
      // Store token
      const token = 'mock-jwt-token'
      if (rememberMe) {
        localStorage.setItem('auth-token', token)
      } else {
        sessionStorage.setItem('auth-token', token)
      }
      
      // Set cookies for middleware
      document.cookie = `auth-token=${token}; path=/`
      document.cookie = `user-role=${mockUser.role}; path=/`
      
      setState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
      
      // Redirect to intended destination or dashboard
      const searchParams = new URLSearchParams(window.location.search)
      const from = searchParams.get('from') || '/dashboard'
      router.push(from)
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Invalid email or password',
      }))
      throw error
    }
  }

  const loginWithWallet = async (address: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      // Simulate wallet authentication
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockUser: User = {
        id: '2',
        email: `${address.slice(0, 6)}...${address.slice(-4)}@wallet`,
        firstName: 'Wallet',
        lastName: 'User',
        role: 'investor',
        kycStatus: 'pending',
        walletAddress: address,
        createdAt: new Date(),
        lastLogin: new Date(),
      }
      
      const token = 'mock-wallet-token'
      localStorage.setItem('auth-token', token)
      
      document.cookie = `auth-token=${token}; path=/`
      document.cookie = `user-role=${mockUser.role}; path=/`
      
      setState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
      
      router.push('/dashboard')
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to connect wallet',
      }))
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockUser: User = {
        id: '3',
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'investor',
        investorType: data.investorType,
        kycStatus: 'pending',
        createdAt: new Date(),
        lastLogin: new Date(),
      }
      
      const token = 'mock-register-token'
      localStorage.setItem('auth-token', token)
      
      document.cookie = `auth-token=${token}; path=/`
      document.cookie = `user-role=${mockUser.role}; path=/`
      
      setState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
      
      router.push('/dashboard')
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Registration failed',
      }))
      throw error
    }
  }

  const logout = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }))
      
      // Clear storage
      localStorage.removeItem('auth-token')
      sessionStorage.removeItem('auth-token')
      
      // Clear cookies
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
      document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
      
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
      
      toast.success('Logged out successfully')
      router.push('/login')
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Logout failed',
      }))
    }
  }

  const resetPassword = async (email: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Password reset email sent', {
        description: `Check ${email} for reset instructions`,
      })
    } catch (error) {
      throw new Error('Failed to send reset email')
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }))
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...data } : null,
        isLoading: false,
      }))
      
      toast.success('Profile updated successfully')
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to update profile',
      }))
      throw error
    }
  }

  const value: AuthContextValue = {
    ...state,
    login,
    loginWithWallet,
    register,
    logout,
    resetPassword,
    updateProfile,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ============================================================================
// Hook
// ============================================================================

export function useAuth() {
  const context = React.useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

// ============================================================================
// HOC for protected pages
// ============================================================================

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requireKYC?: boolean
    requireRole?: User['role'][]
  }
) {
  return function ProtectedComponent(props: P) {
    const { user, isAuthenticated, isLoading } = useAuth()
    const router = useRouter()
    
    React.useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/login')
      }
      
      if (user && options?.requireKYC && user.kycStatus !== 'verified') {
        router.push('/kyc')
      }
      
      if (user && options?.requireRole && !options.requireRole.includes(user.role)) {
        router.push('/dashboard')
      }
    }, [user, isAuthenticated, isLoading, router])
    
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      )
    }
    
    if (!isAuthenticated) {
      return null
    }
    
    return <Component {...props} />
  }
}