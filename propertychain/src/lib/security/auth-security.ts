/**
 * Authentication Security - PropertyChain
 * 
 * Advanced authentication security features including session management,
 * multi-factor authentication, and suspicious activity detection
 * Following UpdatedUIPlan.md Step 66 specifications and CLAUDE.md principles
 */

import { NextRequest } from 'next/server'
import crypto from 'crypto'
import { LRUCache } from 'lru-cache'

/**
 * Session security configuration
 */
interface SessionConfig {
  maxAge: number // Session duration in seconds
  renewThreshold: number // Renew session when this close to expiry (seconds)
  maxConcurrentSessions: number // Max concurrent sessions per user
  sessionTimeout: number // Idle timeout in seconds
  requireHttps: boolean // Require HTTPS for session cookies
  sameSite: 'strict' | 'lax' | 'none'
  secure: boolean
  httpOnly: boolean
}

/**
 * Authentication attempt tracking
 */
interface AuthAttempt {
  ip: string
  userAgent: string
  timestamp: number
  success: boolean
  userId?: string
  reason?: string
}

/**
 * Session metadata
 */
interface SessionMetadata {
  id: string
  userId: string
  createdAt: number
  lastActivity: number
  ipAddress: string
  userAgent: string
  deviceFingerprint?: string
  isSecure: boolean
  mfaVerified: boolean
  riskScore: number
  location?: {
    country: string
    city: string
    coordinates?: [number, number]
  }
}

/**
 * Suspicious activity types
 */
type SuspiciousActivityType = 
  | 'multiple_failed_logins'
  | 'login_from_new_location'
  | 'unusual_time_pattern'
  | 'concurrent_sessions_exceeded'
  | 'session_hijack_attempt'
  | 'rapid_requests'
  | 'anomalous_behavior'

/**
 * Risk assessment result
 */
interface RiskAssessment {
  score: number // 0-100, higher is more risky
  factors: string[]
  requireMFA: boolean
  requireReauth: boolean
  blockAccess: boolean
  recommendations: string[]
}

/**
 * Default session configuration
 */
const DEFAULT_SESSION_CONFIG: SessionConfig = {
  maxAge: 24 * 60 * 60, // 24 hours
  renewThreshold: 60 * 60, // 1 hour
  maxConcurrentSessions: 5,
  sessionTimeout: 30 * 60, // 30 minutes idle
  requireHttps: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
}

/**
 * Authentication Security Manager
 */
export class AuthSecurityManager {
  private static instance: AuthSecurityManager
  private config: SessionConfig
  private authAttempts = new LRUCache<string, AuthAttempt[]>({
    max: 10000,
    ttl: 60 * 60 * 1000, // 1 hour
  })
  private activeSessions = new LRUCache<string, SessionMetadata>({
    max: 50000,
    ttl: 24 * 60 * 60 * 1000, // 24 hours
  })
  private suspiciousIPs = new LRUCache<string, {
    score: number
    lastActivity: number
    activities: SuspiciousActivityType[]
  }>({
    max: 10000,
    ttl: 24 * 60 * 60 * 1000, // 24 hours
  })
  
  private constructor(config: Partial<SessionConfig> = {}) {
    this.config = { ...DEFAULT_SESSION_CONFIG, ...config }
  }
  
  static getInstance(config?: Partial<SessionConfig>): AuthSecurityManager {
    if (!AuthSecurityManager.instance) {
      AuthSecurityManager.instance = new AuthSecurityManager(config)
    }
    return AuthSecurityManager.instance
  }
  
  /**
   * Record authentication attempt
   */
  recordAuthAttempt(
    ip: string,
    userAgent: string,
    success: boolean,
    userId?: string,
    reason?: string
  ): void {
    const attempt: AuthAttempt = {
      ip,
      userAgent,
      timestamp: Date.now(),
      success,
      userId,
      reason,
    }
    
    const key = `${ip}:${userAgent.slice(0, 50)}`
    const attempts = this.authAttempts.get(key) || []
    attempts.push(attempt)
    
    // Keep only last 20 attempts
    if (attempts.length > 20) {
      attempts.splice(0, attempts.length - 20)
    }
    
    this.authAttempts.set(key, attempts)
    
    // Check for suspicious patterns
    this.analyzeSuspiciousActivity(ip, attempts)
  }
  
  /**
   * Check if IP is allowed to attempt authentication
   */
  isAuthAllowed(ip: string, userAgent: string): {
    allowed: boolean
    reason?: string
    retryAfter?: number
  } {
    const key = `${ip}:${userAgent.slice(0, 50)}`
    const attempts = this.authAttempts.get(key) || []
    const now = Date.now()
    
    // Check recent failed attempts (last 15 minutes)
    const recentFailed = attempts.filter(
      a => !a.success && now - a.timestamp < 15 * 60 * 1000
    )
    
    // Progressive delay based on failed attempts
    if (recentFailed.length >= 10) {
      return {
        allowed: false,
        reason: 'Too many failed attempts',
        retryAfter: 60 * 60, // 1 hour
      }
    }
    
    if (recentFailed.length >= 5) {
      return {
        allowed: false,
        reason: 'Multiple failed attempts',
        retryAfter: 15 * 60, // 15 minutes
      }
    }
    
    if (recentFailed.length >= 3) {
      const lastAttempt = recentFailed[recentFailed.length - 1]
      const timeSinceLastAttempt = now - lastAttempt.timestamp
      const requiredDelay = Math.min(300 * Math.pow(2, recentFailed.length - 3), 900) * 1000 // Exponential backoff, max 15 min
      
      if (timeSinceLastAttempt < requiredDelay) {
        return {
          allowed: false,
          reason: 'Rate limited',
          retryAfter: Math.ceil((requiredDelay - timeSinceLastAttempt) / 1000),
        }
      }
    }
    
    // Check if IP is marked as suspicious
    const suspiciousData = this.suspiciousIPs.get(ip)
    if (suspiciousData && suspiciousData.score > 80) {
      return {
        allowed: false,
        reason: 'IP marked as suspicious',
        retryAfter: 60 * 60, // 1 hour
      }
    }
    
    return { allowed: true }
  }
  
  /**
   * Create secure session
   */
  createSession(
    userId: string,
    request: NextRequest,
    additionalData: Partial<SessionMetadata> = {}
  ): SessionMetadata {
    const sessionId = this.generateSecureSessionId()
    const now = Date.now()
    const ip = this.extractClientIP(request)
    const userAgent = request.headers.get('user-agent') || ''
    
    const session: SessionMetadata = {
      id: sessionId,
      userId,
      createdAt: now,
      lastActivity: now,
      ipAddress: ip,
      userAgent,
      isSecure: request.url.startsWith('https://'),
      mfaVerified: false,
      riskScore: 0,
      ...additionalData,
    }
    
    // Calculate initial risk score
    session.riskScore = this.calculateRiskScore(session, request)
    
    this.activeSessions.set(sessionId, session)
    
    // Clean up old sessions for this user
    this.cleanupUserSessions(userId)
    
    return session
  }
  
  /**
   * Validate and update session
   */
  validateSession(sessionId: string, request: NextRequest): {
    valid: boolean
    session?: SessionMetadata
    requireReauth?: boolean
    reason?: string
  } {
    const session = this.activeSessions.get(sessionId)
    
    if (!session) {
      return { valid: false, reason: 'Session not found' }
    }
    
    const now = Date.now()
    const ip = this.extractClientIP(request)
    const userAgent = request.headers.get('user-agent') || ''
    
    // Check session expiry
    if (now - session.createdAt > this.config.maxAge * 1000) {
      this.activeSessions.delete(sessionId)
      return { valid: false, reason: 'Session expired' }
    }
    
    // Check idle timeout
    if (now - session.lastActivity > this.config.sessionTimeout * 1000) {
      this.activeSessions.delete(sessionId)
      return { valid: false, reason: 'Session timed out' }
    }
    
    // Check for session hijacking
    const hijackCheck = this.detectSessionHijacking(session, ip, userAgent)
    if (hijackCheck.detected) {
      this.activeSessions.delete(sessionId)
      this.recordSuspiciousActivity(ip, 'session_hijack_attempt')
      return { valid: false, reason: 'Potential session hijacking detected' }
    }
    
    // Update session activity
    session.lastActivity = now
    
    // Recalculate risk score
    const newRiskScore = this.calculateRiskScore(session, request)
    session.riskScore = newRiskScore
    
    // Check if reauthentication is required
    const requireReauth = newRiskScore > 70 || 
                         (now - session.createdAt > this.config.renewThreshold * 1000 && !session.mfaVerified)
    
    this.activeSessions.set(sessionId, session)
    
    return {
      valid: true,
      session,
      requireReauth,
    }
  }
  
  /**
   * Terminate session
   */
  terminateSession(sessionId: string): boolean {
    return this.activeSessions.delete(sessionId)
  }
  
  /**
   * Terminate all sessions for user
   */
  terminateAllUserSessions(userId: string): number {
    let count = 0
    
    for (const [sessionId, session] of Array.from(this.activeSessions.entries())) {
      if (session.userId === userId) {
        this.activeSessions.delete(sessionId)
        count++
      }
    }
    
    return count
  }
  
  /**
   * Get active sessions for user
   */
  getUserSessions(userId: string): SessionMetadata[] {
    const sessions: SessionMetadata[] = []
    
    for (const [sessionId, session] of Array.from(this.activeSessions.entries())) {
      if (session.userId === userId) {
        sessions.push(session)
      }
    }
    
    return sessions.sort((a, b) => b.lastActivity - a.lastActivity)
  }
  
  /**
   * Assess authentication risk
   */
  assessRisk(request: NextRequest, userId?: string): RiskAssessment {
    const ip = this.extractClientIP(request)
    const userAgent = request.headers.get('user-agent') || ''
    let score = 0
    const factors: string[] = []
    
    // Check IP reputation
    const suspiciousData = this.suspiciousIPs.get(ip)
    if (suspiciousData) {
      score += Math.min(suspiciousData.score, 30)
      factors.push('IP has suspicious history')
    }
    
    // Check for unusual time patterns
    const hour = new Date().getHours()
    if (hour < 6 || hour > 22) {
      score += 10
      factors.push('Unusual access time')
    }
    
    // Check concurrent sessions if user is known
    if (userId) {
      const userSessions = this.getUserSessions(userId)
      if (userSessions.length >= this.config.maxConcurrentSessions) {
        score += 20
        factors.push('Maximum concurrent sessions reached')
      }
      
      // Check for geographic anomalies (would need IP geolocation service)
      // This is a placeholder for actual geolocation checking
      const hasGeographicAnomaly = false // Implement with real service
      if (hasGeographicAnomaly) {
        score += 25
        factors.push('Login from unusual location')
      }
    }
    
    // Check user agent patterns
    if (this.isAutomatedUserAgent(userAgent)) {
      score += 30
      factors.push('Automated user agent detected')
    }
    
    // Check for rapid requests (would need request rate tracking)
    // This is a placeholder
    const hasRapidRequests = false
    if (hasRapidRequests) {
      score += 15
      factors.push('Rapid request pattern detected')
    }
    
    return {
      score: Math.min(score, 100),
      factors,
      requireMFA: score > 40,
      requireReauth: score > 60,
      blockAccess: score > 85,
      recommendations: this.generateSecurityRecommendations(score, factors),
    }
  }
  
  /**
   * Generate secure session ID
   */
  private generateSecureSessionId(): string {
    const randomBytes = crypto.randomBytes(32)
    const timestamp = Date.now().toString(36)
    const hash = crypto.createHash('sha256')
      .update(randomBytes)
      .update(timestamp)
      .update(process.env.SESSION_SECRET || 'default-secret')
      .digest('hex')
    
    return `${timestamp}.${hash}`
  }
  
  /**
   * Extract client IP address
   */
  private extractClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const real = request.headers.get('x-real-ip')
    const cf = request.headers.get('cf-connecting-ip')
    
    if (forwarded) {
      return forwarded.split(',')[0].trim()
    }
    
    return cf || real || request.ip || 'unknown'
  }
  
  /**
   * Calculate session risk score
   */
  private calculateRiskScore(session: SessionMetadata, request: NextRequest): number {
    let score = 0
    
    // Age of session
    const age = Date.now() - session.createdAt
    const ageHours = age / (1000 * 60 * 60)
    if (ageHours > 12) score += 10
    if (ageHours > 24) score += 20
    
    // IP change detection
    const currentIP = this.extractClientIP(request)
    if (session.ipAddress !== currentIP) {
      score += 30
    }
    
    // User agent change
    const currentUA = request.headers.get('user-agent') || ''
    if (session.userAgent !== currentUA) {
      score += 20
    }
    
    // MFA status
    if (!session.mfaVerified) {
      score += 15
    }
    
    // Suspicious IP
    const suspiciousData = this.suspiciousIPs.get(currentIP)
    if (suspiciousData) {
      score += Math.min(suspiciousData.score / 4, 25)
    }
    
    return Math.min(score, 100)
  }
  
  /**
   * Detect session hijacking attempts
   */
  private detectSessionHijacking(
    session: SessionMetadata,
    currentIP: string,
    currentUserAgent: string
  ): { detected: boolean; confidence: number } {
    let confidence = 0
    
    // IP address changed
    if (session.ipAddress !== currentIP) {
      confidence += 40
    }
    
    // User agent changed significantly
    const uaSimilarity = this.calculateUserAgentSimilarity(session.userAgent, currentUserAgent)
    if (uaSimilarity < 0.7) {
      confidence += 30
    }
    
    // Rapid IP changes (check recent history)
    // This would require tracking IP history - placeholder for now
    const hasRapidIPChanges = false
    if (hasRapidIPChanges) {
      confidence += 30
    }
    
    return {
      detected: confidence > 60,
      confidence,
    }
  }
  
  /**
   * Calculate user agent similarity
   */
  private calculateUserAgentSimilarity(ua1: string, ua2: string): number {
    if (ua1 === ua2) return 1
    
    // Simple similarity based on common tokens
    const tokens1 = new Set(ua1.toLowerCase().split(/[\s\/\(\)]+/))
    const tokens2 = new Set(ua2.toLowerCase().split(/[\s\/\(\)]+/))
    
    const intersection = new Set(Array.from(tokens1).filter(x => tokens2.has(x)))
    const union = new Set([...Array.from(tokens1), ...Array.from(tokens2)])
    
    return intersection.size / union.size
  }
  
  /**
   * Analyze suspicious activity patterns
   */
  private analyzeSuspiciousActivity(ip: string, attempts: AuthAttempt[]): void {
    const now = Date.now()
    const recentAttempts = attempts.filter(a => now - a.timestamp < 60 * 60 * 1000) // Last hour
    
    let suspiciousScore = this.suspiciousIPs.get(ip)?.score || 0
    const activities: SuspiciousActivityType[] = []
    
    // Multiple failed logins
    const failedCount = recentAttempts.filter(a => !a.success).length
    if (failedCount >= 5) {
      suspiciousScore += 20
      activities.push('multiple_failed_logins')
    }
    
    // Rapid attempts
    if (recentAttempts.length >= 10) {
      suspiciousScore += 15
      activities.push('rapid_requests')
    }
    
    // Different user agents from same IP
    const userAgents = new Set(recentAttempts.map(a => a.userAgent))
    if (userAgents.size > 3) {
      suspiciousScore += 10
      activities.push('anomalous_behavior')
    }
    
    if (suspiciousScore > 0) {
      this.suspiciousIPs.set(ip, {
        score: Math.min(suspiciousScore, 100),
        lastActivity: now,
        activities,
      })
    }
  }
  
  /**
   * Record suspicious activity
   */
  private recordSuspiciousActivity(ip: string, activity: SuspiciousActivityType): void {
    const current = this.suspiciousIPs.get(ip) || {
      score: 0,
      lastActivity: Date.now(),
      activities: [],
    }
    
    current.activities.push(activity)
    current.lastActivity = Date.now()
    
    // Increase score based on activity type
    switch (activity) {
      case 'session_hijack_attempt':
        current.score += 30
        break
      case 'concurrent_sessions_exceeded':
        current.score += 15
        break
      case 'login_from_new_location':
        current.score += 20
        break
      default:
        current.score += 10
    }
    
    current.score = Math.min(current.score, 100)
    this.suspiciousIPs.set(ip, current)
  }
  
  /**
   * Clean up old sessions for user
   */
  private cleanupUserSessions(userId: string): void {
    const userSessions = this.getUserSessions(userId)
    
    if (userSessions.length >= this.config.maxConcurrentSessions) {
      // Remove oldest sessions
      const sessionsToRemove = userSessions
        .slice(this.config.maxConcurrentSessions - 1)
        .map(s => s.id)
      
      for (const sessionId of sessionsToRemove) {
        this.activeSessions.delete(sessionId)
      }
    }
  }
  
  /**
   * Check if user agent appears to be automated
   */
  private isAutomatedUserAgent(userAgent: string): boolean {
    const automatedPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
      /python/i,
      /requests/i,
      /node/i,
      /axios/i,
    ]
    
    return automatedPatterns.some(pattern => pattern.test(userAgent))
  }
  
  /**
   * Generate security recommendations
   */
  private generateSecurityRecommendations(score: number, factors: string[]): string[] {
    const recommendations: string[] = []
    
    if (score > 70) {
      recommendations.push('Enable two-factor authentication immediately')
      recommendations.push('Review account for suspicious activity')
    }
    
    if (score > 50) {
      recommendations.push('Change password if not done recently')
      recommendations.push('Review active sessions and terminate unknown ones')
    }
    
    if (factors.includes('IP has suspicious history')) {
      recommendations.push('Consider accessing from a trusted network')
    }
    
    if (factors.includes('Unusual access time')) {
      recommendations.push('Verify this access time is expected')
    }
    
    if (factors.includes('Automated user agent detected')) {
      recommendations.push('Use a standard web browser for better security')
    }
    
    return recommendations
  }
}

/**
 * Multi-Factor Authentication helper
 */
export class MFAManager {
  /**
   * Generate TOTP secret
   */
  static generateTOTPSecret(): string {
    return crypto.randomBytes(20).toString('base64')
  }
  
  /**
   * Verify TOTP code
   */
  static verifyTOTP(secret: string, code: string, window = 1): boolean {
    // Implementation would use a TOTP library like 'otplib'
    // This is a placeholder
    console.log(`Verifying TOTP code ${code} with secret ${secret}`)
    return true // Placeholder
  }
  
  /**
   * Generate backup codes
   */
  static generateBackupCodes(count = 10): string[] {
    const codes: string[] = []
    
    for (let i = 0; i < count; i++) {
      const code = crypto.randomBytes(6).toString('hex').toUpperCase()
      codes.push(code.match(/.{2}/g)?.join('-') || code)
    }
    
    return codes
  }
}

/**
 * Default auth security instance
 */
export const authSecurity = AuthSecurityManager.getInstance()

export default AuthSecurityManager