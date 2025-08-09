# API Documentation - PropertyChain

## Overview
Complete API implementation following RECOVERY_PLAN.md Phase 4 Step 4.2 with proper data fetching, caching, real-time updates, error handling, and retry logic.

## Base Configuration

### API Base URL
- Development: `http://localhost:3000/api`
- Production: Set via `NEXT_PUBLIC_API_URL` environment variable

### WebSocket URL
- Development: `ws://localhost:3001`
- Production: Set via `NEXT_PUBLIC_WS_URL` environment variable

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## API Endpoints

### Health Check
```
GET /api/health
```
Returns system health status and metrics.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-08-08T18:31:38.713Z",
  "uptime": 41786.696055333,
  "version": "0.1.0",
  "services": {
    "database": { "status": "up", "latency": 0 },
    "blockchain": { "status": "up", "latency": 3 },
    "storage": { "status": "up", "latency": 29 },
    "cache": { "status": "up", "latency": 5 }
  },
  "metrics": {
    "totalUsers": 2,
    "totalProperties": 2,
    "totalInvestments": 0,
    "activeConnections": 42
  }
}
```

### Authentication

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "INVESTOR" // or "PROPERTY_OWNER"
}
```

#### Refresh Token
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "<refresh_token>"
}
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <token>
```

### Properties

#### List Properties
```
GET /api/properties?page=1&pageSize=20&status=ACTIVE&propertyType=residential
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 20, max: 100)
- `status`: Filter by status
- `propertyType`: Filter by type (residential, commercial, industrial, land)
- `city`: Filter by city
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `search`: Search in title, description, city
- `sortBy`: Sort field
- `sortOrder`: asc or desc

#### Get Single Property
```
GET /api/properties/{id}
```

#### Create Property
```
POST /api/properties
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Property Title",
  "description": "Property description",
  "address": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "country": "USA",
  "postalCode": "94123",
  "propertyType": "residential",
  "price": 2500000,
  "tokenPrice": 100,
  "totalTokens": 25000,
  "minimumInvestment": 100,
  "expectedROI": 12.5,
  "images": ["https://..."],
  "features": ["Pool", "Gym"],
  "amenities": ["24/7 Security"],
  "coordinates": { "lat": 37.8058, "lng": -122.4325 },
  "metrics": {
    "size": 2500,
    "bedrooms": 3,
    "bathrooms": 2,
    "yearBuilt": 2022
  },
  "fundingDeadline": "2024-12-31T00:00:00Z"
}
```

#### Update Property
```
PUT /api/properties/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "FUNDED"
}
```

#### Delete Property
```
DELETE /api/properties/{id}
Authorization: Bearer <token>
```

### Investments

#### List Investments
```
GET /api/investments?page=1&pageSize=20&status=CONFIRMED
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`: Page number
- `pageSize`: Items per page
- `propertyId`: Filter by property
- `status`: Filter by status
- `userId`: Filter by user (admin only)

#### Create Investment
```
POST /api/investments
Authorization: Bearer <token>
Content-Type: application/json

{
  "propertyId": "prop_123",
  "amount": 10000,
  "paymentMethod": "CRYPTO", // CRYPTO, WIRE, ACH, CREDIT_CARD
  "tokens": 100 // optional, calculated if not provided
}
```

#### Update Investment Status
```
PUT /api/investments
Authorization: Bearer <token> (Admin only)
Content-Type: application/json

{
  "investmentIds": ["inv_123", "inv_456"],
  "updates": {
    "status": "CONFIRMED"
  }
}
```

## React Query Hooks

### Installation
```typescript
import { useProperties, useProperty, useCreateProperty } from '@/hooks/use-api'
```

### Usage Examples

#### Fetch Properties
```typescript
const { data, isLoading, error } = useProperties({
  page: 1,
  pageSize: 20,
  status: 'ACTIVE'
})
```

#### Fetch Single Property
```typescript
const { data: property, isLoading } = useProperty(propertyId)
```

#### Create Property
```typescript
const createProperty = useCreateProperty()

const handleSubmit = async (data) => {
  await createProperty.mutateAsync(data)
  // Automatically invalidates cache and shows toast
}
```

#### Login
```typescript
const login = useLogin()

const handleLogin = async (credentials) => {
  await login.mutateAsync(credentials)
  // Token stored automatically, queries invalidated
}
```

## WebSocket Real-Time Updates

### Setup
```typescript
// In your app layout or root component
import { WebSocketProvider } from '@/providers/websocket-provider'

<WebSocketProvider>
  {children}
</WebSocketProvider>
```

### Usage
```typescript
import { useWebSocket, useRealtimeProperty } from '@/providers/websocket-provider'

// Subscribe to property updates
useRealtimeProperty(propertyId)

// Manual subscription
const { subscribe, send, isConnected } = useWebSocket()

useEffect(() => {
  const unsubscribe = subscribe('property_update', (data) => {
    console.log('Property updated:', data)
  })
  
  return unsubscribe
}, [])
```

### Message Types
- `property_update`: Property data changes
- `investment_update`: Investment status changes
- `notification`: New notifications
- `price_update`: Token price changes
- `system`: System messages

## Caching Strategy

### React Query Configuration
- **Stale Time**: 5 minutes (data considered fresh)
- **Cache Time**: 10 minutes (data kept in cache)
- **Retry**: 3 attempts with exponential backoff
- **Analytics**: 15 minutes stale time

### Cache Invalidation
- Automatic invalidation on mutations
- Real-time WebSocket updates trigger invalidation
- Manual invalidation via `queryClient.invalidateQueries()`

## Error Handling

### API Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2025-08-08T18:31:38.713Z"
}
```

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `429`: Too Many Requests
- `500`: Internal Server Error
- `503`: Service Unavailable

### Client-Side Error Handling
```typescript
try {
  const data = await apiClient.get('/api/properties')
} catch (error) {
  if (error instanceof ApiError) {
    console.log('Status:', error.status)
    console.log('Message:', error.message)
    console.log('Data:', error.data)
  }
}
```

## Rate Limiting

- **Default**: 100 requests per minute per IP
- **Auth endpoints**: 10 requests per minute per IP
- **Headers returned**:
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

## Security Features

1. **Input Sanitization**: All inputs sanitized to prevent XSS
2. **SQL Injection Prevention**: Parameterized queries (when using real DB)
3. **CORS**: Configured for allowed origins
4. **Rate Limiting**: Prevents abuse
5. **Authentication**: JWT-based (mock for MVP)
6. **Authorization**: Role-based access control
7. **HTTPS**: Required in production

## Testing

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Properties
```bash
# List properties
curl http://localhost:3000/api/properties

# Get single property
curl http://localhost:3000/api/properties/1

# With pagination
curl "http://localhost:3000/api/properties?page=1&pageSize=10"
```

### Authentication
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@example.com","password":"password123"}'
```

## Performance Optimizations

1. **Caching**: 
   - HTTP cache headers for GET requests
   - React Query client-side caching
   - Stale-while-revalidate pattern

2. **Pagination**: 
   - Default 20 items per page
   - Maximum 100 items per page

3. **Compression**: 
   - Gzip enabled for responses

4. **Database Queries**: 
   - Indexed fields for common queries
   - Optimized joins and aggregations

5. **WebSocket**: 
   - Automatic reconnection
   - Message batching
   - Binary protocol for large data

## Monitoring

- API request logging with duration
- Health endpoint for monitoring services
- Error tracking (integrate with Sentry in production)
- Performance metrics via OpenTelemetry

## Migration from Mock to Production

1. Replace mock database with PostgreSQL/MongoDB
2. Implement real JWT authentication
3. Connect to actual blockchain network
4. Set up Redis for caching
5. Configure IPFS for document storage
6. Set up WebSocket server
7. Implement proper rate limiting with Redis
8. Add monitoring and logging services