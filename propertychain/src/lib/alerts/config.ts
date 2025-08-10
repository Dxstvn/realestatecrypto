/**
 * Alert Configuration - PropertyChain
 * 
 * Default alert thresholds and notification settings
 * Following UpdatedUIPlan.md Step 65 specifications and CLAUDE.md principles
 */

/**
 * Default alert thresholds
 */
export const DEFAULT_THRESHOLDS = {
  // API Performance
  API_RESPONSE_TIME_WARNING: 1000, // 1 second
  API_RESPONSE_TIME_CRITICAL: 3000, // 3 seconds
  API_ERROR_RATE_WARNING: 5, // 5%
  API_ERROR_RATE_CRITICAL: 15, // 15%
  
  // System Health
  MEMORY_USAGE_WARNING: 80, // 80%
  MEMORY_USAGE_CRITICAL: 95, // 95%
  CPU_USAGE_WARNING: 75, // 75%
  CPU_USAGE_CRITICAL: 90, // 90%
  
  // Web Vitals
  LCP_WARNING: 2500, // 2.5 seconds
  LCP_CRITICAL: 4000, // 4 seconds
  FID_WARNING: 100, // 100ms
  FID_CRITICAL: 300, // 300ms
  CLS_WARNING: 0.1, // 0.1 score
  CLS_CRITICAL: 0.25, // 0.25 score
  
  // Business Metrics
  TRANSACTION_FAILURE_RATE: 5, // 5%
  USER_SESSION_ERROR_RATE: 10, // 10%
  
  // Blockchain
  BLOCKCHAIN_BLOCK_LAG: 10, // 10 blocks behind
  BLOCKCHAIN_CONNECTION_TIMEOUT: 5000, // 5 seconds
  
  // Database
  DB_CONNECTION_TIMEOUT: 3000, // 3 seconds
  DB_QUERY_SLOW_THRESHOLD: 1000, // 1 second
  
  // Security
  FAILED_LOGIN_ATTEMPTS: 10, // per 5 minutes
  SUSPICIOUS_ACTIVITY_THRESHOLD: 50, // events per minute
} as const

/**
 * Time windows for alert evaluation (in seconds)
 */
export const TIME_WINDOWS = {
  IMMEDIATE: 0,
  ONE_MINUTE: 60,
  FIVE_MINUTES: 300,
  FIFTEEN_MINUTES: 900,
  THIRTY_MINUTES: 1800,
  ONE_HOUR: 3600,
  TWO_HOURS: 7200,
  SIX_HOURS: 21600,
  TWELVE_HOURS: 43200,
  ONE_DAY: 86400,
} as const

/**
 * Notification channel templates
 */
export const NOTIFICATION_TEMPLATES = {
  slack: {
    critical: {
      color: 'danger',
      icon_emoji: ':fire:',
      pretext: '🚨 CRITICAL ALERT',
    },
    warning: {
      color: 'warning',
      icon_emoji: ':warning:',
      pretext: '⚠️ WARNING',
    },
    info: {
      color: 'good',
      icon_emoji: ':information_source:',
      pretext: 'ℹ️ INFO',
    },
  },
  email: {
    critical: {
      priority: 'high',
      subject: '[CRITICAL] PropertyChain Alert',
    },
    warning: {
      priority: 'normal',
      subject: '[WARNING] PropertyChain Alert',
    },
    info: {
      priority: 'low',
      subject: '[INFO] PropertyChain Notification',
    },
  },
} as const

/**
 * Alert rule categories
 */
export const ALERT_CATEGORIES = {
  PERFORMANCE: 'performance',
  SECURITY: 'security',
  BUSINESS: 'business',
  INFRASTRUCTURE: 'infrastructure',
  BLOCKCHAIN: 'blockchain',
} as const

/**
 * Default escalation policies
 */
export const ESCALATION_POLICIES = {
  immediate: {
    name: 'Immediate Response',
    levels: [
      { delay: 0, channels: ['slack', 'email'] },
    ],
  },
  standard: {
    name: 'Standard Escalation',
    levels: [
      { delay: 0, channels: ['slack'] },
      { delay: 300, channels: ['email'] }, // 5 minutes
      { delay: 900, channels: ['pagerduty'] }, // 15 minutes
    ],
  },
  critical: {
    name: 'Critical Escalation',
    levels: [
      { delay: 0, channels: ['slack', 'email', 'pagerduty'] },
      { delay: 120, channels: ['phone'] }, // 2 minutes
    ],
  },
} as const

/**
 * Silence periods for maintenance
 */
export const MAINTENANCE_WINDOWS = {
  daily: {
    start: '02:00',
    end: '06:00',
    timezone: 'UTC',
    description: 'Daily maintenance window',
  },
  weekly: {
    day: 'sunday',
    start: '01:00',
    end: '05:00',
    timezone: 'UTC',
    description: 'Weekly maintenance window',
  },
} as const

/**
 * Alert suppression rules
 */
export const SUPPRESSION_RULES = {
  // Don't alert on known issues during maintenance
  maintenance: {
    enabled: true,
    suppressAll: false,
    allowedSeverities: ['info'],
  },
  // Group similar alerts to prevent spam
  grouping: {
    enabled: true,
    timeWindow: 300, // 5 minutes
    maxAlerts: 5,
  },
  // Rate limiting for noisy alerts
  rateLimiting: {
    enabled: true,
    maxAlertsPerHour: 10,
    cooldownPeriod: 3600, // 1 hour
  },
} as const

/**
 * Integration settings
 */
export const INTEGRATIONS = {
  sentry: {
    enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
    projectName: 'propertychain',
    environment: process.env.NODE_ENV || 'development',
  },
  datadog: {
    enabled: !!process.env.DATADOG_API_KEY,
    service: 'propertychain',
    version: process.env.npm_package_version || '1.0.0',
  },
  newrelic: {
    enabled: !!process.env.NEW_RELIC_LICENSE_KEY,
    appName: 'PropertyChain',
  },
} as const

/**
 * Environment-specific overrides
 */
export const ENVIRONMENT_OVERRIDES = {
  development: {
    // More lenient thresholds for development
    API_RESPONSE_TIME_WARNING: 2000,
    API_RESPONSE_TIME_CRITICAL: 5000,
    // Disable PagerDuty in development
    disabledChannels: ['pagerduty'],
  },
  staging: {
    // Staging-specific settings
    // Prefix all alerts with [STAGING]
    alertPrefix: '[STAGING]',
    // Only send to staging channels
    allowedChannels: ['staging-slack', 'staging-email'],
  },
  production: {
    // Production uses default settings
    strictMode: true,
    allChannelsEnabled: true,
  },
} as const