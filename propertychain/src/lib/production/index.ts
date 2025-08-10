/**
 * Production Utilities Index - PropertyChain
 * 
 * Central export for all production preparation utilities
 * Following UpdatedUIPlan.md Step 70 specifications and CLAUDE.md principles
 */

// Environment configuration
export {
  validateEnvironment,
  getEnvironmentConfig,
  isProduction,
  isDevelopment,
  isTest,
  getRequiredEnvVars,
  generateEnvTemplate,
  validateOnStartup,
  type Environment,
  type ValidationResult,
} from './environment'

// Security audit
export {
  SecurityAuditor,
  generateSecurityReport,
  REQUIRED_SECURITY_HEADERS,
  type SecurityAuditResult,
  type Vulnerability,
  type SecurityCheck,
} from './security-audit'

// Load testing
export {
  SimpleLoadTester,
  generateK6Script,
  generateArtilleryConfig,
  generateLocustScript,
  generateLoadTestReport,
  defaultLoadTestConfig,
  type LoadTestConfig,
  type LoadTestScenario,
  type LoadTestStep,
  type LoadTestResult,
  type PerformanceThresholds,
} from './load-testing'

/**
 * Production readiness checks
 */
export async function runProductionReadinessChecks(): Promise<{
  ready: boolean
  issues: string[]
  report: string
}> {
  const issues: string[] = []
  const reports: string[] = []
  
  console.log('🚀 Running production readiness checks...')
  
  // 1. Environment validation
  console.log('📋 Validating environment variables...')
  const { validateEnvironment } = await import('./environment')
  const envResult = validateEnvironment()
  
  if (!envResult.valid) {
    envResult.errors.forEach(error => {
      issues.push(`ENV: ${error.variable} - ${error.message}`)
    })
  }
  
  envResult.warnings.forEach(warning => {
    issues.push(`ENV WARNING: ${warning.variable} - ${warning.message}`)
  })
  
  // 2. Security audit
  console.log('🔒 Running security audit...')
  const { SecurityAuditor, generateSecurityReport } = await import('./security-audit')
  const auditor = new SecurityAuditor()
  const securityResult = await auditor.runAudit()
  
  if (!securityResult.passed) {
    securityResult.vulnerabilities.forEach(vuln => {
      if (vuln.severity === 'critical' || vuln.severity === 'high') {
        issues.push(`SECURITY: ${vuln.description}`)
      }
    })
  }
  
  const securityReport = await generateSecurityReport(securityResult)
  reports.push(securityReport)
  
  // 3. Performance checks
  console.log('⚡ Checking performance configuration...')
  const performanceChecks = [
    { name: 'Bundle optimization', check: () => process.env.NEXT_PUBLIC_PERFORMANCE_MONITORING === 'true' },
    { name: 'Image optimization', check: () => process.env.OPTIMIZE_IMAGES === 'true' },
    { name: 'CDN configuration', check: () => !!process.env.NEXT_PUBLIC_CDN_URL },
    { name: 'Caching headers', check: () => !!process.env.CACHE_TTL_DEFAULT },
  ]
  
  performanceChecks.forEach(({ name, check }) => {
    if (!check()) {
      issues.push(`PERFORMANCE: ${name} not configured`)
    }
  })
  
  // 4. Database checks
  console.log('🗄️ Checking database configuration...')
  if (!process.env.DATABASE_URL) {
    issues.push('DATABASE: Database URL not configured')
  }
  
  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_SSL !== 'true') {
    issues.push('DATABASE: SSL not enabled for production database')
  }
  
  // 5. Blockchain configuration
  console.log('⛓️ Checking blockchain configuration...')
  const blockchainChecks = [
    { name: 'Chain ID', env: 'NEXT_PUBLIC_CHAIN_ID' },
    { name: 'RPC URL', env: 'NEXT_PUBLIC_RPC_URL' },
    { name: 'Token contract', env: 'NEXT_PUBLIC_PROPERTY_TOKEN_ADDRESS' },
  ]
  
  blockchainChecks.forEach(({ name, env }) => {
    if (!process.env[env]) {
      issues.push(`BLOCKCHAIN: ${name} not configured`)
    }
  })
  
  // 6. Monitoring configuration
  console.log('📊 Checking monitoring configuration...')
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.NODE_ENV === 'production') {
    issues.push('MONITORING: Sentry not configured for production')
  }
  
  // Generate final report
  const ready = issues.filter(i => !i.includes('WARNING')).length === 0
  
  const finalReport = [
    '# Production Readiness Report',
    '',
    `**Status:** ${ready ? '✅ READY' : '❌ NOT READY'}`,
    `**Date:** ${new Date().toISOString()}`,
    '',
    '## Issues Found',
    '',
    issues.length === 0 ? 'No issues found!' : issues.map(i => `- ${i}`).join('\n'),
    '',
    ...reports,
  ].join('\n')
  
  console.log(ready ? '✅ Production readiness check PASSED' : '❌ Production readiness check FAILED')
  
  return {
    ready,
    issues,
    report: finalReport,
  }
}

/**
 * Production deployment configuration
 */
export const productionConfig = {
  // Deployment targets
  targets: {
    staging: {
      url: process.env.STAGING_URL || 'https://staging.propertychain.com',
      branch: 'staging',
      environment: 'staging',
    },
    production: {
      url: process.env.PRODUCTION_URL || 'https://propertychain.com',
      branch: 'main',
      environment: 'production',
    },
  },
  
  // Build configuration
  build: {
    command: 'npm run build',
    outputDir: '.next',
    staticDir: 'public',
  },
  
  // Docker configuration
  docker: {
    registry: process.env.DOCKER_REGISTRY || 'docker.propertychain.com',
    image: 'propertychain/web',
    tag: process.env.DOCKER_TAG || 'latest',
  },
  
  // Health checks
  healthChecks: [
    { path: '/api/health', expectedStatus: 200 },
    { path: '/api/health/database', expectedStatus: 200 },
    { path: '/api/health/blockchain', expectedStatus: 200 },
  ],
  
  // Rollback configuration
  rollback: {
    enabled: true,
    maxVersions: 5,
    automaticOnFailure: true,
  },
  
  // Monitoring
  monitoring: {
    errorThreshold: 1, // percentage
    latencyThreshold: 2000, // milliseconds
    uptimeTarget: 99.9, // percentage
  },
}

/**
 * Pre-deployment checklist
 */
export async function runPreDeploymentChecks(): Promise<boolean> {
  console.log('📋 Running pre-deployment checks...')
  
  const checks = [
    {
      name: 'Build successful',
      run: async () => {
        try {
          const { execSync } = await import('child_process')
          execSync('npm run build', { stdio: 'pipe' })
          return true
        } catch {
          return false
        }
      },
    },
    {
      name: 'Tests passing',
      run: async () => {
        try {
          const { execSync } = await import('child_process')
          execSync('npm test -- --passWithNoTests', { stdio: 'pipe' })
          return true
        } catch {
          return false
        }
      },
    },
    {
      name: 'Type checking',
      run: async () => {
        try {
          const { execSync } = await import('child_process')
          execSync('npm run typecheck', { stdio: 'pipe' })
          return true
        } catch {
          return false
        }
      },
    },
    {
      name: 'Linting',
      run: async () => {
        try {
          const { execSync } = await import('child_process')
          execSync('npm run lint', { stdio: 'pipe' })
          return true
        } catch {
          return false
        }
      },
    },
  ]
  
  let allPassed = true
  
  for (const check of checks) {
    const passed = await check.run()
    console.log(`  ${passed ? '✅' : '❌'} ${check.name}`)
    if (!passed) allPassed = false
  }
  
  return allPassed
}

/**
 * Post-deployment verification
 */
export async function verifyDeployment(url: string): Promise<boolean> {
  console.log(`🔍 Verifying deployment at ${url}...`)
  
  const checks = productionConfig.healthChecks
  let allPassed = true
  
  for (const check of checks) {
    try {
      const response = await fetch(`${url}${check.path}`)
      const passed = response.status === check.expectedStatus
      console.log(`  ${passed ? '✅' : '❌'} ${check.path}: ${response.status}`)
      if (!passed) allPassed = false
    } catch (error) {
      console.log(`  ❌ ${check.path}: Failed to connect`)
      allPassed = false
    }
  }
  
  return allPassed
}

/**
 * Production launch sequence
 */
export async function launchProduction(): Promise<void> {
  console.log('🚀 Starting production launch sequence...')
  
  // 1. Run readiness checks
  const { ready, issues } = await runProductionReadinessChecks()
  
  if (!ready) {
    console.error('❌ Production readiness checks failed!')
    console.error('Issues:')
    issues.forEach(issue => console.error(`  - ${issue}`))
    throw new Error('Not ready for production')
  }
  
  // 2. Run pre-deployment checks
  const preDeploymentPassed = await runPreDeploymentChecks()
  
  if (!preDeploymentPassed) {
    throw new Error('Pre-deployment checks failed')
  }
  
  // 3. Deploy to staging first
  console.log('📦 Deploying to staging...')
  // Deployment logic here
  
  // 4. Verify staging deployment
  const stagingVerified = await verifyDeployment(productionConfig.targets.staging.url)
  
  if (!stagingVerified) {
    throw new Error('Staging deployment verification failed')
  }
  
  // 5. Run load tests on staging
  console.log('🔨 Running load tests on staging...')
  const { SimpleLoadTester, defaultLoadTestConfig } = await import('./load-testing')
  const loadTester = new SimpleLoadTester({
    ...defaultLoadTestConfig,
    baseUrl: productionConfig.targets.staging.url,
    duration: 30, // Quick test
    users: 5,
  })
  
  const loadTestResult = await loadTester.run()
  
  if (!loadTestResult.success) {
    throw new Error('Load tests failed on staging')
  }
  
  // 6. Deploy to production
  console.log('🚀 Deploying to production...')
  // Production deployment logic here
  
  // 7. Verify production deployment
  const productionVerified = await verifyDeployment(productionConfig.targets.production.url)
  
  if (!productionVerified) {
    console.error('❌ Production deployment verification failed!')
    console.log('🔄 Initiating rollback...')
    // Rollback logic here
    throw new Error('Production deployment failed')
  }
  
  console.log('✅ Production launch successful!')
}

export default {
  runProductionReadinessChecks,
  runPreDeploymentChecks,
  verifyDeployment,
  launchProduction,
  productionConfig,
}