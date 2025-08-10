/**
 * Security Audit Utilities - PropertyChain
 * 
 * Comprehensive security auditing and vulnerability scanning
 * Following UpdatedUIPlan.md Step 70 specifications and CLAUDE.md principles
 */

import { execSync } from 'child_process'
import * as fs from 'fs/promises'
import * as path from 'path'
import crypto from 'crypto'

/**
 * Security audit result interface
 */
export interface SecurityAuditResult {
  timestamp: number
  passed: boolean
  score: number
  vulnerabilities: Vulnerability[]
  recommendations: string[]
  checks: SecurityCheck[]
}

export interface Vulnerability {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  type: string
  description: string
  location?: string
  remediation: string
}

export interface SecurityCheck {
  name: string
  passed: boolean
  message: string
  severity: 'critical' | 'high' | 'medium' | 'low'
}

/**
 * Security headers configuration
 */
export const REQUIRED_SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
  'Content-Security-Policy': "default-src 'self'",
}

/**
 * Security audit class
 */
export class SecurityAuditor {
  private vulnerabilities: Vulnerability[] = []
  private checks: SecurityCheck[] = []
  private recommendations: string[] = []
  
  /**
   * Run complete security audit
   */
  async runAudit(): Promise<SecurityAuditResult> {
    console.log('🔒 Starting security audit...')
    
    // Reset state
    this.vulnerabilities = []
    this.checks = []
    this.recommendations = []
    
    // Run all security checks
    await this.checkDependencies()
    await this.checkEnvironmentVariables()
    await this.checkSecurityHeaders()
    await this.checkAuthentication()
    await this.checkCrypto()
    await this.checkFilePermissions()
    await this.checkNetworkSecurity()
    await this.checkInputValidation()
    await this.checkSmartContracts()
    await this.checkDataProtection()
    
    // Calculate score
    const score = this.calculateSecurityScore()
    
    // Generate recommendations
    this.generateRecommendations()
    
    return {
      timestamp: Date.now(),
      passed: score >= 80,
      score,
      vulnerabilities: this.vulnerabilities,
      recommendations: this.recommendations,
      checks: this.checks,
    }
  }
  
  /**
   * Check dependencies for known vulnerabilities
   */
  private async checkDependencies(): Promise<void> {
    try {
      // Run npm audit
      const auditResult = execSync('npm audit --json', { encoding: 'utf-8' })
      const audit = JSON.parse(auditResult)
      
      if (audit.metadata.vulnerabilities) {
        const vulns = audit.metadata.vulnerabilities
        
        if (vulns.critical > 0) {
          this.vulnerabilities.push({
            severity: 'critical',
            type: 'dependency',
            description: `${vulns.critical} critical vulnerabilities in dependencies`,
            remediation: 'Run npm audit fix --force to update vulnerable packages',
          })
        }
        
        if (vulns.high > 0) {
          this.vulnerabilities.push({
            severity: 'high',
            type: 'dependency',
            description: `${vulns.high} high severity vulnerabilities in dependencies`,
            remediation: 'Run npm audit fix to update vulnerable packages',
          })
        }
      }
      
      this.checks.push({
        name: 'Dependency Vulnerabilities',
        passed: audit.metadata.vulnerabilities.critical === 0,
        message: `Found ${audit.metadata.vulnerabilities.total} vulnerabilities`,
        severity: audit.metadata.vulnerabilities.critical > 0 ? 'critical' : 'medium',
      })
    } catch (error) {
      this.checks.push({
        name: 'Dependency Vulnerabilities',
        passed: false,
        message: 'Failed to run npm audit',
        severity: 'high',
      })
    }
  }
  
  /**
   * Check environment variables
   */
  private async checkEnvironmentVariables(): Promise<void> {
    const env = process.env
    
    // Check for sensitive data in public variables
    const publicVars = Object.keys(env).filter(key => key.startsWith('NEXT_PUBLIC_'))
    const sensitivePatterns = [/secret/i, /password/i, /private/i, /token/i]
    
    publicVars.forEach(key => {
      const value = env[key] || ''
      sensitivePatterns.forEach(pattern => {
        if (pattern.test(key) || pattern.test(value)) {
          this.vulnerabilities.push({
            severity: 'high',
            type: 'configuration',
            description: `Potential sensitive data in public variable: ${key}`,
            location: key,
            remediation: 'Move sensitive data to server-side only variables',
          })
        }
      })
    })
    
    // Check for required security variables
    const requiredVars = [
      'NEXTAUTH_SECRET',
      'JWT_SECRET',
      'DATABASE_SSL',
      'RATE_LIMIT_ENABLED',
      'CORS_ORIGIN',
    ]
    
    requiredVars.forEach(key => {
      if (!env[key]) {
        this.vulnerabilities.push({
          severity: 'high',
          type: 'configuration',
          description: `Missing required security variable: ${key}`,
          location: key,
          remediation: `Set ${key} in environment variables`,
        })
      }
    })
    
    // Check secret strength
    if (env.NEXTAUTH_SECRET && env.NEXTAUTH_SECRET.length < 32) {
      this.vulnerabilities.push({
        severity: 'critical',
        type: 'configuration',
        description: 'NEXTAUTH_SECRET is too short',
        remediation: 'Use a secret with at least 32 characters',
      })
    }
    
    this.checks.push({
      name: 'Environment Variables',
      passed: this.vulnerabilities.filter(v => v.type === 'configuration').length === 0,
      message: 'Environment variables security check',
      severity: 'high',
    })
  }
  
  /**
   * Check security headers
   */
  private async checkSecurityHeaders(): Promise<void> {
    const configPath = path.join(process.cwd(), 'next.config.js')
    
    try {
      const config = await fs.readFile(configPath, 'utf-8')
      
      Object.keys(REQUIRED_SECURITY_HEADERS).forEach(header => {
        if (!config.includes(header)) {
          this.vulnerabilities.push({
            severity: 'medium',
            type: 'headers',
            description: `Missing security header: ${header}`,
            location: 'next.config.js',
            remediation: `Add ${header} to security headers configuration`,
          })
        }
      })
      
      this.checks.push({
        name: 'Security Headers',
        passed: this.vulnerabilities.filter(v => v.type === 'headers').length === 0,
        message: 'Security headers configuration check',
        severity: 'medium',
      })
    } catch (error) {
      this.checks.push({
        name: 'Security Headers',
        passed: false,
        message: 'Could not check security headers',
        severity: 'medium',
      })
    }
  }
  
  /**
   * Check authentication configuration
   */
  private async checkAuthentication(): Promise<void> {
    const checks: boolean[] = []
    
    // Check for 2FA configuration
    if (!process.env.FEATURE_2FA_ENABLED || process.env.FEATURE_2FA_ENABLED !== 'true') {
      this.vulnerabilities.push({
        severity: 'medium',
        type: 'authentication',
        description: 'Two-factor authentication is not enabled',
        remediation: 'Enable 2FA for enhanced security',
      })
      checks.push(false)
    } else {
      checks.push(true)
    }
    
    // Check session configuration
    if (!process.env.SESSION_MAX_AGE) {
      this.vulnerabilities.push({
        severity: 'low',
        type: 'authentication',
        description: 'Session timeout not configured',
        remediation: 'Set SESSION_MAX_AGE to limit session duration',
      })
      checks.push(false)
    } else {
      checks.push(true)
    }
    
    // Check password policy
    const authPath = path.join(process.cwd(), 'src/lib/auth.ts')
    try {
      const authConfig = await fs.readFile(authPath, 'utf-8')
      if (!authConfig.includes('passwordStrength') && !authConfig.includes('minLength')) {
        this.vulnerabilities.push({
          severity: 'medium',
          type: 'authentication',
          description: 'Password strength requirements not enforced',
          location: 'src/lib/auth.ts',
          remediation: 'Implement password strength validation',
        })
        checks.push(false)
      } else {
        checks.push(true)
      }
    } catch {
      checks.push(false)
    }
    
    this.checks.push({
      name: 'Authentication Security',
      passed: checks.every(c => c),
      message: 'Authentication configuration check',
      severity: 'high',
    })
  }
  
  /**
   * Check cryptographic implementations
   */
  private async checkCrypto(): Promise<void> {
    const srcDir = path.join(process.cwd(), 'src')
    const issues: string[] = []
    
    try {
      // Check for weak crypto patterns
      const weakPatterns = [
        { pattern: /md5/gi, name: 'MD5' },
        { pattern: /sha1/gi, name: 'SHA1' },
        { pattern: /Math\.random/g, name: 'Math.random for crypto' },
        { pattern: /createCipher(?!iv)/g, name: 'Deprecated createCipher' },
      ]
      
      const files = await this.getTypeScriptFiles(srcDir)
      
      for (const file of files) {
        const content = await fs.readFile(file, 'utf-8')
        
        weakPatterns.forEach(({ pattern, name }) => {
          if (pattern.test(content)) {
            issues.push(`${name} usage in ${path.relative(process.cwd(), file)}`)
            this.vulnerabilities.push({
              severity: 'high',
              type: 'crypto',
              description: `Weak cryptography: ${name}`,
              location: path.relative(process.cwd(), file),
              remediation: `Replace ${name} with stronger alternatives`,
            })
          }
        })
      }
      
      this.checks.push({
        name: 'Cryptography',
        passed: issues.length === 0,
        message: issues.length > 0 ? `Found ${issues.length} crypto issues` : 'Crypto check passed',
        severity: 'high',
      })
    } catch (error) {
      this.checks.push({
        name: 'Cryptography',
        passed: false,
        message: 'Could not check cryptography',
        severity: 'high',
      })
    }
  }
  
  /**
   * Check file permissions
   */
  private async checkFilePermissions(): Promise<void> {
    const sensitiveFiles = [
      '.env',
      '.env.local',
      '.env.production',
      'private.key',
      'cert.pem',
    ]
    
    const issues: string[] = []
    
    for (const file of sensitiveFiles) {
      try {
        const stats = await fs.stat(file)
        const mode = (stats.mode & parseInt('777', 8)).toString(8)
        
        if (mode !== '600' && mode !== '400') {
          issues.push(file)
          this.vulnerabilities.push({
            severity: 'medium',
            type: 'permissions',
            description: `Insecure file permissions for ${file}`,
            location: file,
            remediation: `Run: chmod 600 ${file}`,
          })
        }
      } catch {
        // File doesn't exist, skip
      }
    }
    
    this.checks.push({
      name: 'File Permissions',
      passed: issues.length === 0,
      message: issues.length > 0 ? `Found ${issues.length} permission issues` : 'Permissions check passed',
      severity: 'medium',
    })
  }
  
  /**
   * Check network security
   */
  private async checkNetworkSecurity(): Promise<void> {
    const checks: boolean[] = []
    
    // Check HTTPS enforcement
    if (process.env.NODE_ENV === 'production') {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL
      if (appUrl && !appUrl.startsWith('https://')) {
        this.vulnerabilities.push({
          severity: 'critical',
          type: 'network',
          description: 'HTTPS not enforced in production',
          remediation: 'Use HTTPS for all production URLs',
        })
        checks.push(false)
      } else {
        checks.push(true)
      }
    }
    
    // Check CORS configuration
    if (!process.env.CORS_ORIGIN) {
      this.vulnerabilities.push({
        severity: 'high',
        type: 'network',
        description: 'CORS not configured',
        remediation: 'Set CORS_ORIGIN to restrict cross-origin requests',
      })
      checks.push(false)
    } else if (process.env.CORS_ORIGIN === '*') {
      this.vulnerabilities.push({
        severity: 'high',
        type: 'network',
        description: 'CORS allows all origins',
        remediation: 'Restrict CORS_ORIGIN to specific domains',
      })
      checks.push(false)
    } else {
      checks.push(true)
    }
    
    // Check rate limiting
    if (process.env.RATE_LIMIT_ENABLED !== 'true') {
      this.vulnerabilities.push({
        severity: 'high',
        type: 'network',
        description: 'Rate limiting is disabled',
        remediation: 'Enable rate limiting to prevent abuse',
      })
      checks.push(false)
    } else {
      checks.push(true)
    }
    
    this.checks.push({
      name: 'Network Security',
      passed: checks.every(c => c),
      message: 'Network security configuration check',
      severity: 'high',
    })
  }
  
  /**
   * Check input validation
   */
  private async checkInputValidation(): Promise<void> {
    const srcDir = path.join(process.cwd(), 'src')
    const issues: string[] = []
    
    try {
      const files = await this.getTypeScriptFiles(srcDir)
      
      // Patterns that might indicate missing validation
      const dangerousPatterns = [
        { pattern: /dangerouslySetInnerHTML/g, name: 'dangerouslySetInnerHTML' },
        { pattern: /eval\(/g, name: 'eval()' },
        { pattern: /new Function\(/g, name: 'new Function()' },
        { pattern: /innerHTML\s*=/g, name: 'innerHTML assignment' },
        { pattern: /document\.write/g, name: 'document.write' },
      ]
      
      for (const file of files) {
        const content = await fs.readFile(file, 'utf-8')
        
        dangerousPatterns.forEach(({ pattern, name }) => {
          if (pattern.test(content)) {
            issues.push(`${name} in ${path.relative(process.cwd(), file)}`)
            this.vulnerabilities.push({
              severity: 'high',
              type: 'validation',
              description: `Potential XSS vulnerability: ${name}`,
              location: path.relative(process.cwd(), file),
              remediation: `Review and sanitize usage of ${name}`,
            })
          }
        })
      }
      
      this.checks.push({
        name: 'Input Validation',
        passed: issues.length === 0,
        message: issues.length > 0 ? `Found ${issues.length} validation issues` : 'Validation check passed',
        severity: 'high',
      })
    } catch (error) {
      this.checks.push({
        name: 'Input Validation',
        passed: false,
        message: 'Could not check input validation',
        severity: 'high',
      })
    }
  }
  
  /**
   * Check smart contract security
   */
  private async checkSmartContracts(): Promise<void> {
    const contractsDir = path.join(process.cwd(), 'contracts')
    
    try {
      const files = await fs.readdir(contractsDir)
      const solidityFiles = files.filter(f => f.endsWith('.sol'))
      
      if (solidityFiles.length > 0) {
        // Check for common smart contract vulnerabilities
        for (const file of solidityFiles) {
          const content = await fs.readFile(path.join(contractsDir, file), 'utf-8')
          
          // Check for reentrancy guards
          if (!content.includes('nonReentrant') && !content.includes('ReentrancyGuard')) {
            this.vulnerabilities.push({
              severity: 'critical',
              type: 'smart-contract',
              description: 'Missing reentrancy protection',
              location: `contracts/${file}`,
              remediation: 'Add ReentrancyGuard to prevent reentrancy attacks',
            })
          }
          
          // Check for access control
          if (!content.includes('onlyOwner') && !content.includes('AccessControl')) {
            this.vulnerabilities.push({
              severity: 'high',
              type: 'smart-contract',
              description: 'Missing access control',
              location: `contracts/${file}`,
              remediation: 'Implement proper access control mechanisms',
            })
          }
          
          // Check for SafeMath (for older Solidity versions)
          if (!content.includes('using SafeMath') && !content.includes('pragma solidity ^0.8')) {
            this.vulnerabilities.push({
              severity: 'high',
              type: 'smart-contract',
              description: 'Missing overflow protection',
              location: `contracts/${file}`,
              remediation: 'Use SafeMath or Solidity 0.8+ for overflow protection',
            })
          }
        }
      }
      
      this.checks.push({
        name: 'Smart Contract Security',
        passed: this.vulnerabilities.filter(v => v.type === 'smart-contract').length === 0,
        message: 'Smart contract security check',
        severity: 'critical',
      })
    } catch {
      // No contracts directory
      this.checks.push({
        name: 'Smart Contract Security',
        passed: true,
        message: 'No smart contracts found',
        severity: 'low',
      })
    }
  }
  
  /**
   * Check data protection
   */
  private async checkDataProtection(): Promise<void> {
    const checks: boolean[] = []
    
    // Check encryption at rest
    if (process.env.DATABASE_ENCRYPTION !== 'true') {
      this.vulnerabilities.push({
        severity: 'medium',
        type: 'data-protection',
        description: 'Database encryption at rest not enabled',
        remediation: 'Enable database encryption for sensitive data',
      })
      checks.push(false)
    } else {
      checks.push(true)
    }
    
    // Check backup encryption
    if (process.env.BACKUP_ENCRYPTION_KEY && process.env.BACKUP_ENCRYPTION_KEY.length < 32) {
      this.vulnerabilities.push({
        severity: 'medium',
        type: 'data-protection',
        description: 'Backup encryption key is too weak',
        remediation: 'Use a stronger encryption key for backups',
      })
      checks.push(false)
    } else {
      checks.push(true)
    }
    
    // Check GDPR compliance
    if (process.env.GDPR_ENABLED !== 'true') {
      this.recommendations.push('Enable GDPR compliance features for EU users')
    }
    
    this.checks.push({
      name: 'Data Protection',
      passed: checks.every(c => c),
      message: 'Data protection configuration check',
      severity: 'medium',
    })
  }
  
  /**
   * Calculate security score
   */
  private calculateSecurityScore(): number {
    const weights = {
      critical: 20,
      high: 10,
      medium: 5,
      low: 2,
      info: 1,
    }
    
    let totalDeductions = 0
    
    this.vulnerabilities.forEach(vuln => {
      totalDeductions += weights[vuln.severity]
    })
    
    const passedChecks = this.checks.filter(c => c.passed).length
    const totalChecks = this.checks.length
    const checkScore = (passedChecks / totalChecks) * 100
    
    const score = Math.max(0, checkScore - totalDeductions)
    
    return Math.round(score)
  }
  
  /**
   * Generate security recommendations
   */
  private generateRecommendations(): void {
    // Add specific recommendations based on vulnerabilities
    if (this.vulnerabilities.some(v => v.type === 'dependency')) {
      this.recommendations.push('Regularly update dependencies and run security audits')
    }
    
    if (this.vulnerabilities.some(v => v.type === 'authentication')) {
      this.recommendations.push('Implement comprehensive authentication security measures')
    }
    
    if (this.vulnerabilities.some(v => v.type === 'crypto')) {
      this.recommendations.push('Review and update cryptographic implementations')
    }
    
    // Add general recommendations
    this.recommendations.push(
      'Conduct regular security audits',
      'Implement security monitoring and alerting',
      'Maintain security documentation',
      'Train team on security best practices',
      'Implement incident response procedures'
    )
  }
  
  /**
   * Get TypeScript files recursively
   */
  private async getTypeScriptFiles(dir: string): Promise<string[]> {
    const files: string[] = []
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          const subFiles = await this.getTypeScriptFiles(fullPath)
          files.push(...subFiles)
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
          files.push(fullPath)
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${dir}:`, error)
    }
    
    return files
  }
}

/**
 * Generate security report
 */
export async function generateSecurityReport(
  result: SecurityAuditResult
): Promise<string> {
  const report: string[] = [
    '# Security Audit Report',
    '',
    `**Date:** ${new Date(result.timestamp).toISOString()}`,
    `**Score:** ${result.score}/100`,
    `**Status:** ${result.passed ? '✅ PASSED' : '❌ FAILED'}`,
    '',
  ]
  
  // Summary
  report.push('## Summary')
  report.push('')
  const severityCounts = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  }
  
  result.vulnerabilities.forEach(v => {
    severityCounts[v.severity]++
  })
  
  report.push('| Severity | Count |')
  report.push('|----------|-------|')
  Object.entries(severityCounts).forEach(([severity, count]) => {
    if (count > 0) {
      report.push(`| ${severity.toUpperCase()} | ${count} |`)
    }
  })
  report.push('')
  
  // Security Checks
  report.push('## Security Checks')
  report.push('')
  result.checks.forEach(check => {
    const icon = check.passed ? '✅' : '❌'
    report.push(`- ${icon} **${check.name}**: ${check.message}`)
  })
  report.push('')
  
  // Vulnerabilities
  if (result.vulnerabilities.length > 0) {
    report.push('## Vulnerabilities')
    report.push('')
    
    result.vulnerabilities.forEach((vuln, index) => {
      report.push(`### ${index + 1}. ${vuln.description}`)
      report.push(`- **Severity:** ${vuln.severity.toUpperCase()}`)
      report.push(`- **Type:** ${vuln.type}`)
      if (vuln.location) {
        report.push(`- **Location:** ${vuln.location}`)
      }
      report.push(`- **Remediation:** ${vuln.remediation}`)
      report.push('')
    })
  }
  
  // Recommendations
  if (result.recommendations.length > 0) {
    report.push('## Recommendations')
    report.push('')
    result.recommendations.forEach(rec => {
      report.push(`- ${rec}`)
    })
    report.push('')
  }
  
  return report.join('\n')
}

export default {
  SecurityAuditor,
  generateSecurityReport,
  REQUIRED_SECURITY_HEADERS,
}