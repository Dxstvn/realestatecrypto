/**
 * Configuration Index
 * Central configuration management for PropertyChain
 */

export const config = {
  app: {
    name: 'PropertyChain',
    description: 'Tokenized Real Estate Investment Platform',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  },
  
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: 30000,
  },
  
  database: {
    url: process.env.DATABASE_URL || '',
    ssl: process.env.NODE_ENV === 'production',
  },
  
  auth: {
    secret: process.env.AUTH_SECRET || '',
    tokenExpiry: '7d',
    refreshTokenExpiry: '30d',
  },
  
  blockchain: {
    defaultNetwork: process.env.NEXT_PUBLIC_DEFAULT_NETWORK || 'testnet',
    rpcUrls: {
      mainnet: process.env.NEXT_PUBLIC_MAINNET_RPC_URL || '',
      polygon: process.env.NEXT_PUBLIC_POLYGON_RPC_URL || '',
      testnet: process.env.NEXT_PUBLIC_TESTNET_RPC_URL || '',
    },
    contracts: {
      propertyToken: process.env.NEXT_PUBLIC_PROPERTY_TOKEN_ADDRESS || '',
      marketplace: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || '',
    },
  },
  
  email: {
    provider: process.env.EMAIL_PROVIDER || 'sendgrid',
    apiKey: process.env.EMAIL_API_KEY || '',
    fromAddress: process.env.EMAIL_FROM_ADDRESS || 'noreply@propertychain.com',
  },
  
  storage: {
    provider: process.env.STORAGE_PROVIDER || 'aws',
    bucket: process.env.STORAGE_BUCKET || '',
    region: process.env.STORAGE_REGION || 'us-east-1',
  },
  
  features: {
    enableRegistration: process.env.ENABLE_REGISTRATION !== 'false',
    enableKYC: process.env.ENABLE_KYC !== 'false',
    enableTestMode: process.env.NODE_ENV !== 'production',
    maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
  },
  
  limits: {
    fileUploadSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    rateLimit: parseInt(process.env.RATE_LIMIT || '100'),
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5'),
  },
} as const