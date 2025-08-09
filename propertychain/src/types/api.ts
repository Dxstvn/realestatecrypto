/**
 * API Type Definitions
 * Request/Response types and API utilities
 */

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: ApiError
  meta?: ResponseMeta
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: Date
}

export interface ResponseMeta {
  page?: number
  limit?: number
  total?: number
  hasMore?: boolean
  timestamp: Date
}

export interface PaginatedRequest {
  page: number
  limit: number
  sort?: string
  order?: 'asc' | 'desc'
  filters?: Record<string, any>
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface SearchParams {
  query: string
  filters?: SearchFilters
  sort?: SortOptions
  pagination?: PaginationOptions
}

export interface SearchFilters {
  propertyType?: string[]
  priceRange?: [number, number]
  yieldRange?: [number, number]
  location?: string[]
  status?: string[]
}

export interface SortOptions {
  field: string
  order: 'asc' | 'desc'
}

export interface PaginationOptions {
  page: number
  limit: number
}

export interface WebSocketMessage {
  type: WSMessageType
  payload: any
  timestamp: Date
}

export type WSMessageType = 
  | 'price-update'
  | 'transaction'
  | 'notification'
  | 'portfolio-update'
  | 'property-update'