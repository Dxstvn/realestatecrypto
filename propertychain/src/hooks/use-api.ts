/**
 * API Hooks - PropertyChain
 * 
 * React Query hooks for data fetching with caching and retry logic
 * Following RECOVERY_PLAN.md Phase 4 - Data fetching implementation
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { ERROR_MESSAGES } from '@/lib/constants'

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

// API Client with retry and error handling
class ApiClient {
  private baseURL: string
  private defaultHeaders: HeadersInit

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  private async getAuthToken(): Promise<string | null> {
    // Get token from storage or auth context
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken()
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    }

    const url = `${this.baseURL}${endpoint}`
    
    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({
          error: response.statusText || 'Request failed',
        }))
        
        throw new ApiError(
          error.error || error.message || 'Request failed',
          response.status,
          error
        )
      }
      
      const data = await response.json()
      
      if (!data.success && data.error) {
        throw new ApiError(data.error, response.status, data)
      }
      
      return data.data || data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new ApiError(ERROR_MESSAGES.NETWORK, 0, error)
      }
      
      throw new ApiError(ERROR_MESSAGES.GENERIC, 500, error)
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
    return this.request<T>(`${endpoint}${queryString}`, {
      method: 'GET',
    })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    })
  }
}

// Custom error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Create API client instance
const apiClient = new ApiClient()

// Query key factory
export const queryKeys = {
  all: ['api'] as const,
  auth: () => [...queryKeys.all, 'auth'] as const,
  properties: () => [...queryKeys.all, 'properties'] as const,
  property: (id: string) => [...queryKeys.properties(), id] as const,
  investments: () => [...queryKeys.all, 'investments'] as const,
  investment: (id: string) => [...queryKeys.investments(), id] as const,
  users: () => [...queryKeys.all, 'users'] as const,
  user: (id: string) => [...queryKeys.users(), id] as const,
  notifications: () => [...queryKeys.all, 'notifications'] as const,
  analytics: () => [...queryKeys.all, 'analytics'] as const,
  documents: () => [...queryKeys.all, 'documents'] as const,
}

// Default query options
const defaultQueryOptions: UseQueryOptions = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
}

// Properties Hooks
export function useProperties(params?: Record<string, any>) {
  return useQuery({
    queryKey: [...queryKeys.properties(), params],
    queryFn: () => apiClient.get('/api/properties', params),
    ...defaultQueryOptions,
  })
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: queryKeys.property(id),
    queryFn: () => apiClient.get(`/api/properties/${id}`),
    enabled: !!id,
    ...defaultQueryOptions,
  })
}

export function useCreateProperty() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: (data: any) => apiClient.post('/api/properties', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties() })
      toast({
        title: 'Success',
        description: 'Property created successfully',
      })
    },
    onError: (error: ApiError) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useUpdateProperty(id: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: (data: any) => apiClient.put(`/api/properties/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.property(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.properties() })
      toast({
        title: 'Success',
        description: 'Property updated successfully',
      })
    },
    onError: (error: ApiError) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

// Investment Hooks
export function useInvestments(params?: Record<string, any>) {
  return useQuery({
    queryKey: [...queryKeys.investments(), params],
    queryFn: () => apiClient.get('/api/investments', params),
    ...defaultQueryOptions,
  })
}

export function useCreateInvestment() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: (data: any) => apiClient.post('/api/investments', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.investments() })
      queryClient.invalidateQueries({ queryKey: queryKeys.properties() })
      toast({
        title: 'Success',
        description: 'Investment created successfully',
      })
    },
    onError: (error: ApiError) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

// Auth Hooks
export function useLogin() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) => 
      apiClient.post('/api/auth/login', credentials),
    onSuccess: (data: any) => {
      // Store token
      if (data.accessToken) {
        localStorage.setItem('auth_token', data.accessToken)
      }
      
      queryClient.invalidateQueries({ queryKey: queryKeys.auth() })
      toast({
        title: 'Success',
        description: 'Login successful',
      })
    },
    onError: (error: ApiError) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: (data: { email: string; password: string; name: string }) => 
      apiClient.post('/api/auth/register', data),
    onSuccess: (data: any) => {
      // Store token
      if (data.accessToken) {
        localStorage.setItem('auth_token', data.accessToken)
      }
      
      queryClient.invalidateQueries({ queryKey: queryKeys.auth() })
      toast({
        title: 'Success',
        description: 'Registration successful',
      })
    },
    onError: (error: ApiError) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: () => apiClient.post('/api/auth/logout'),
    onSuccess: () => {
      // Clear token
      localStorage.removeItem('auth_token')
      
      // Clear all queries
      queryClient.clear()
      
      toast({
        title: 'Success',
        description: 'Logged out successfully',
      })
    },
  })
}

// User Hooks
export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => apiClient.get(`/api/users/${id}`),
    enabled: !!id,
    ...defaultQueryOptions,
  })
}

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: (data: any) => apiClient.put(`/api/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user(id) })
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      })
    },
    onError: (error: ApiError) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

// Notifications Hooks
export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications(),
    queryFn: () => apiClient.get('/api/notifications'),
    ...defaultQueryOptions,
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => apiClient.patch(`/api/notifications/${id}`, { read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications() })
    },
  })
}

// Analytics Hooks
export function useAnalytics(type: string, params?: Record<string, any>) {
  return useQuery({
    queryKey: [...queryKeys.analytics(), type, params],
    queryFn: () => apiClient.get(`/api/analytics/${type}`, params),
    ...defaultQueryOptions,
    staleTime: 15 * 60 * 1000, // 15 minutes for analytics
  })
}

// Prefetch utilities
export async function prefetchProperties(queryClient: any, params?: Record<string, any>) {
  await queryClient.prefetchQuery({
    queryKey: [...queryKeys.properties(), params],
    queryFn: () => apiClient.get('/api/properties', params),
    staleTime: 5 * 60 * 1000,
  })
}

export async function prefetchProperty(queryClient: any, id: string) {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.property(id),
    queryFn: () => apiClient.get(`/api/properties/${id}`),
    staleTime: 5 * 60 * 1000,
  })
}

// Export API client for direct use
export { apiClient }