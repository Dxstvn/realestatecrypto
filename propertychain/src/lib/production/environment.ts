/**
 * Environment Configuration Validator - PropertyChain
 * 
 * Production environment variables validation and management
 * Following UpdatedUIPlan.md Step 70 specifications and CLAUDE.md principles
 */

import { z } from 'zod'

/**
 * Environment variable schemas
 */
const AppConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  NEXT_PUBLIC_APP_NAME: z.string().min(1),
  NEXT_PUBLIC_APP_VERSION: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_CDN_URL: z.string().url().optional(),
})

const DatabaseConfigSchema = z.object({
  DATABASE_URL: z.string().min(1),
  DATABASE_POOL_MIN: z.string().transform(Number).pipe(z.number().min(1)),
  DATABASE_POOL_MAX: z.string().transform(Number).pipe(z.number().min(1)),
  DATABASE_SSL: z.string().transform(val => val === 'true'),
  REDIS_URL: z.string().min(1).optional(),
  REDIS_TLS: z.string().transform(val => val === 'true').optional(),
})

const AuthConfigSchema = z.object({
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  SESSION_SECRET: z.string().min(32).optional(),
  SESSION_MAX_AGE: z.string().transform(Number).optional(),
})

const BlockchainConfigSchema = z.object({
  NEXT_PUBLIC_CHAIN_ID: z.string().transform(Number),
  NEXT_PUBLIC_CHAIN_NAME: z.string().min(1),
  NEXT_PUBLIC_RPC_URL: z.string().url(),
  NEXT_PUBLIC_EXPLORER_URL: z.string().url(),
  NEXT_PUBLIC_PROPERTY_TOKEN_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: z.string().optional(),
})

const MonitoringConfigSchema = z.object({
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  SENTRY_ENVIRONMENT: z.string().optional(),
  DATADOG_API_KEY: z.string().optional(),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
})

const SecurityConfigSchema = z.object({
  RATE_LIMIT_ENABLED: z.string().default('true').transform(val => val === 'true'),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform(Number),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100').transform(Number),
  CORS_ORIGIN: z.string().min(1),
  CORS_CREDENTIALS: z.string().default('true').transform(val => val === 'true'),
  HSTS_MAX_AGE: z.string().default('63072000').transform(Number),
})

/**
 * Complete environment schema
 */
const EnvironmentSchema = z.object({
  ...AppConfigSchema.shape,
  ...DatabaseConfigSchema.shape,
  ...AuthConfigSchema.shape,
  ...BlockchainConfigSchema.shape,
  ...MonitoringConfigSchema.shape,
  ...SecurityConfigSchema.shape,
})

export type Environment = z.infer<typeof EnvironmentSchema>

/**
 * Environment validation result
 */
export interface ValidationResult {
  valid: boolean
  errors: Array<{
    variable: string
    message: string
    required: boolean
  }>
  warnings: Array<{
    variable: string
    message: string
  }>
}

/**
 * Validate environment variables
 */
export function validateEnvironment(
  env: NodeJS.ProcessEnv = process.env
): ValidationResult {
  const errors: ValidationResult['errors'] = []
  const warnings: ValidationResult['warnings'] = []
  
  try {
    // Validate required variables
    const result = EnvironmentSchema.safeParse(env)
    
    if (!result.success) {
      result.error.issues.forEach(error => {
        errors.push({
          variable: error.path.join('.'),
          message: error.message,
          required: true,
        })
      })
    }
  } catch (error) {
    errors.push({
      variable: 'GENERAL',
      message: error instanceof Error ? error.message : 'Unknown validation error',
      required: true,
    })
  }
  
  // Check for production-specific requirements
  if (env.NODE_ENV === 'production') {
    // Required in production
    const productionRequired = [
      'DATABASE_URL',
      'REDIS_URL',
      'NEXTAUTH_SECRET',
      'JWT_SECRET',
      'NEXT_PUBLIC_SENTRY_DSN',
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
    ]
    
    productionRequired.forEach(key => {
      if (!env[key]) {
        errors.push({
          variable: key,
          message: `Required in production environment`,
          required: true,
        })
      }
    })
    
    // Security checks
    if (env.NEXTAUTH_SECRET && env.NEXTAUTH_SECRET.length < 32) {
      errors.push({
        variable: 'NEXTAUTH_SECRET',
        message: 'Must be at least 32 characters in production',
        required: true,
      })
    }
    
    if (env.JWT_SECRET && env.JWT_SECRET.length < 32) {
      errors.push({
        variable: 'JWT_SECRET',
        message: 'Must be at least 32 characters in production',
        required: true,
      })
    }
    
    // SSL/TLS checks
    if (env.DATABASE_SSL !== 'true') {
      warnings.push({
        variable: 'DATABASE_SSL',
        message: 'SSL should be enabled for database in production',
      })
    }
    
    if (env.REDIS_TLS !== 'true') {
      warnings.push({
        variable: 'REDIS_TLS',
        message: 'TLS should be enabled for Redis in production',
      })
    }
    
    // URL checks
    if (env.NEXT_PUBLIC_APP_URL && !env.NEXT_PUBLIC_APP_URL.startsWith('https://')) {
      errors.push({
        variable: 'NEXT_PUBLIC_APP_URL',
        message: 'Must use HTTPS in production',
        required: true,
      })
    }
    
    if (env.NEXT_PUBLIC_API_URL && !env.NEXT_PUBLIC_API_URL.startsWith('https://')) {
      errors.push({
        variable: 'NEXT_PUBLIC_API_URL',
        message: 'Must use HTTPS in production',
        required: true,
      })
    }
  }
  
  // Check for sensitive data in public variables
  const publicVars = Object.keys(env).filter(key => key.startsWith('NEXT_PUBLIC_'))
  const sensitivePatterns = [
    /secret/i,
    /password/i,
    /token/i,
    /key/i,
    /credential/i,
  ]
  
  publicVars.forEach(key => {
    sensitivePatterns.forEach(pattern => {
      if (pattern.test(key) && !key.includes('PUBLISHABLE') && !key.includes('PUBLIC')) {
        warnings.push({
          variable: key,
          message: 'Public variable name suggests it might contain sensitive data',
        })
      }
    })
  })
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Get environment configuration
 */
export function getEnvironmentConfig(): Partial<Environment> {
  const env = process.env
  
  return {
    NODE_ENV: env.NODE_ENV as 'development' | 'test' | 'production',
    NEXT_PUBLIC_APP_NAME: env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_VERSION: env.NEXT_PUBLIC_APP_VERSION,
    NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_CDN_URL: env.NEXT_PUBLIC_CDN_URL,
    // Add other configurations as needed
  }
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

/**
 * Check if running in test
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === 'test'
}

/**
 * Get required environment variables for production
 */
export function getRequiredEnvVars(): string[] {
  return [
    // App
    'NODE_ENV',
    'NEXT_PUBLIC_APP_NAME',
    'NEXT_PUBLIC_APP_URL',
    'NEXT_PUBLIC_API_URL',
    
    // Database
    'DATABASE_URL',
    'DATABASE_SSL',
    
    // Auth
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'JWT_SECRET',
    
    // Blockchain
    'NEXT_PUBLIC_CHAIN_ID',
    'NEXT_PUBLIC_RPC_URL',
    'NEXT_PUBLIC_PROPERTY_TOKEN_ADDRESS',
    
    // Security
    'RATE_LIMIT_ENABLED',
    'CORS_ORIGIN',
    'HSTS_MAX_AGE',
  ]
}

/**
 * Generate environment variable template
 */
export function generateEnvTemplate(): string {
  const required = getRequiredEnvVars()
  const template: string[] = [
    '# PropertyChain Environment Variables',
    '# Generated template - Fill in with actual values',
    '',
  ]
  
  // Group by category
  const categories: Record<string, string[]> = {
    'Application': [],
    'Database': [],
    'Authentication': [],
    'Blockchain': [],
    'Monitoring': [],
    'Security': [],
  }
  
  required.forEach(key => {
    if (key.includes('DATABASE') || key.includes('REDIS')) {
      categories['Database'].push(key)
    } else if (key.includes('AUTH') || key.includes('JWT') || key.includes('SESSION')) {
      categories['Authentication'].push(key)
    } else if (key.includes('CHAIN') || key.includes('TOKEN') || key.includes('CONTRACT')) {
      categories['Blockchain'].push(key)
    } else if (key.includes('SENTRY') || key.includes('DATADOG') || key.includes('GA_')) {
      categories['Monitoring'].push(key)
    } else if (key.includes('RATE_LIMIT') || key.includes('CORS') || key.includes('HSTS')) {
      categories['Security'].push(key)
    } else {
      categories['Application'].push(key)
    }
  })
  
  Object.entries(categories).forEach(([category, vars]) => {
    if (vars.length > 0) {
      template.push(`# ${category}`)
      vars.forEach(key => {
        template.push(`${key}=`)
      })
      template.push('')
    }
  })
  
  return template.join('\n')
}

/**
 * Validate environment on startup
 */
export function validateOnStartup(): void {
  if (typeof window !== 'undefined') {
    // Don't validate in browser
    return
  }
  
  const result = validateEnvironment()
  
  if (!result.valid) {
    console.error('❌ Environment validation failed:')
    result.errors.forEach(error => {
      console.error(`  - ${error.variable}: ${error.message}`)
    })
    
    if (isProduction()) {
      throw new Error('Environment validation failed in production')
    }
  }
  
  if (result.warnings.length > 0) {
    console.warn('⚠️ Environment validation warnings:')
    result.warnings.forEach(warning => {
      console.warn(`  - ${warning.variable}: ${warning.message}`)
    })
  }
  
  if (result.valid && result.warnings.length === 0) {
    console.log('✅ Environment validation passed')
  }
}

export default {
  validateEnvironment,
  getEnvironmentConfig,
  isProduction,
  isDevelopment,
  isTest,
  getRequiredEnvVars,
  generateEnvTemplate,
  validateOnStartup,
}