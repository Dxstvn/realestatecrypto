/**
 * Alert Service - PropertyChain
 * 
 * Comprehensive alerting system for monitoring thresholds and notifications
 * Following UpdatedUIPlan.md Step 65 specifications and CLAUDE.md principles
 */

import * as Sentry from '@sentry/nextjs'

/**
 * Alert severity levels
 */
export type AlertSeverity = 'info' | 'warning' | 'critical' | 'emergency'

/**
 * Alert rule configuration
 */
interface AlertRule {
  id: string
  name: string
  description: string
  severity: AlertSeverity
  condition: {
    metric: string
    operator: 'gt' | 'lt' | 'eq' | 'ne' | 'gte' | 'lte'
    threshold: number
    timeWindow: number // seconds
    consecutiveCount?: number
  }
  channels: string[]
  enabled: boolean
  tags?: Record<string, string>
}

/**
 * Alert event
 */
interface Alert {
  id: string
  ruleId: string
  ruleName: string
  severity: AlertSeverity
  message: string
  timestamp: number
  status: 'firing' | 'resolved'
  value?: number
  threshold?: number
  tags?: Record<string, string>
  metadata?: Record<string, any>
}

/**
 * Notification channel interface
 */
interface NotificationChannel {
  id: string
  name: string
  type: 'slack' | 'email' | 'webhook' | 'pagerduty' | 'discord'
  config: Record<string, any>
  enabled: boolean
}

/**
 * Alert service class
 */
export class AlertService {
  private static instance: AlertService
  private rules: Map<string, AlertRule> = new Map()
  private channels: Map<string, NotificationChannel> = new Map()
  private alerts: Map<string, Alert> = new Map()
  private metricHistory: Map<string, { value: number; timestamp: number }[]> = new Map()
  
  private constructor() {
    this.initializeDefaultRules()
    this.initializeDefaultChannels()
    this.startEvaluationLoop()
  }
  
  static getInstance(): AlertService {
    if (!AlertService.instance) {
      AlertService.instance = new AlertService()
    }
    return AlertService.instance
  }
  
  /**
   * Add or update alert rule
   */
  addRule(rule: AlertRule): void {
    this.rules.set(rule.id, rule)
    console.log(`Alert rule configured: ${rule.name}`)
  }
  
  /**
   * Remove alert rule
   */
  removeRule(ruleId: string): boolean {
    return this.rules.delete(ruleId)
  }
  
  /**
   * Add or update notification channel
   */
  addChannel(channel: NotificationChannel): void {
    this.channels.set(channel.id, channel)
    console.log(`Notification channel configured: ${channel.name}`)
  }
  
  /**
   * Submit metric for evaluation
   */
  submitMetric(metric: string, value: number, tags?: Record<string, string>): void {
    const timestamp = Date.now()
    
    // Store metric history
    if (!this.metricHistory.has(metric)) {
      this.metricHistory.set(metric, [])
    }
    
    const history = this.metricHistory.get(metric)!
    history.push({ value, timestamp })
    
    // Keep only last 1000 data points per metric
    if (history.length > 1000) {
      history.splice(0, history.length - 1000)
    }
    
    // Evaluate rules for this metric
    this.evaluateRulesForMetric(metric, value, timestamp, tags)
  }
  
  /**
   * Get all active alerts
   */
  getActiveAlerts(): Alert[] {
    return Array.from(this.alerts.values()).filter(alert => alert.status === 'firing')
  }
  
  /**
   * Get alert history
   */
  getAlertHistory(limit = 100): Alert[] {
    return Array.from(this.alerts.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)
  }
  
  /**
   * Resolve alert manually
   */
  resolveAlert(alertId: string): void {
    const alert = this.alerts.get(alertId)
    if (alert && alert.status === 'firing') {
      alert.status = 'resolved'
      alert.timestamp = Date.now()
      
      this.sendNotifications(alert, 'resolved')
      console.log(`Alert resolved: ${alert.ruleName}`)
    }
  }
  
  /**
   * Initialize default alert rules
   */
  private initializeDefaultRules(): void {
    const defaultRules: AlertRule[] = [
      {
        id: 'high-api-response-time',
        name: 'High API Response Time',
        description: 'API response time exceeds acceptable threshold',
        severity: 'warning',
        condition: {
          metric: 'api_response_time',
          operator: 'gt',
          threshold: 2000, // 2 seconds
          timeWindow: 300, // 5 minutes
          consecutiveCount: 3,
        },
        channels: ['default-slack', 'ops-email'],
        enabled: true,
      },
      {
        id: 'error-rate-spike',
        name: 'Error Rate Spike',
        description: 'Application error rate is unusually high',
        severity: 'critical',
        condition: {
          metric: 'error_count',
          operator: 'gt',
          threshold: 10, // 10 errors
          timeWindow: 600, // 10 minutes
        },
        channels: ['default-slack', 'ops-email', 'pagerduty'],
        enabled: true,
      },
      {
        id: 'system-down',
        name: 'System Down',
        description: 'System health check indicates service is down',
        severity: 'emergency',
        condition: {
          metric: 'system_health',
          operator: 'eq',
          threshold: 0, // 0 = down
          timeWindow: 120, // 2 minutes
          consecutiveCount: 2,
        },
        channels: ['default-slack', 'ops-email', 'pagerduty'],
        enabled: true,
      },
      {
        id: 'low-web-vitals',
        name: 'Poor Web Vitals Score',
        description: 'Web Vitals score is below acceptable threshold',
        severity: 'warning',
        condition: {
          metric: 'web_vitals_score',
          operator: 'lt',
          threshold: 75,
          timeWindow: 1800, // 30 minutes
        },
        channels: ['default-slack'],
        enabled: true,
      },
      {
        id: 'blockchain-connectivity',
        name: 'Blockchain Connectivity Issues',
        description: 'Unable to connect to blockchain networks',
        severity: 'critical',
        condition: {
          metric: 'blockchain_health',
          operator: 'eq',
          threshold: 0,
          timeWindow: 300, // 5 minutes
          consecutiveCount: 2,
        },
        channels: ['default-slack', 'ops-email'],
        enabled: true,
      },
    ]
    
    defaultRules.forEach(rule => this.addRule(rule))
  }
  
  /**
   * Initialize default notification channels
   */
  private initializeDefaultChannels(): void {
    const defaultChannels: NotificationChannel[] = [
      {
        id: 'default-slack',
        name: 'Operations Slack',
        type: 'slack',
        config: {
          webhookUrl: process.env.SLACK_WEBHOOK_URL || '',
          channel: '#ops-alerts',
          username: 'PropertyChain Alerts',
        },
        enabled: !!process.env.SLACK_WEBHOOK_URL,
      },
      {
        id: 'ops-email',
        name: 'Operations Email',
        type: 'email',
        config: {
          to: process.env.ALERT_EMAIL_TO || 'ops@propertychain.com',
          from: process.env.ALERT_EMAIL_FROM || 'alerts@propertychain.com',
          subject: '[PropertyChain Alert]',
        },
        enabled: !!process.env.ALERT_EMAIL_TO,
      },
      {
        id: 'pagerduty',
        name: 'PagerDuty',
        type: 'pagerduty',
        config: {
          integrationKey: process.env.PAGERDUTY_INTEGRATION_KEY || '',
          severity: 'critical',
        },
        enabled: !!process.env.PAGERDUTY_INTEGRATION_KEY,
      },
      {
        id: 'webhook',
        name: 'Custom Webhook',
        type: 'webhook',
        config: {
          url: process.env.ALERT_WEBHOOK_URL || '',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.ALERT_WEBHOOK_AUTH || '',
          },
        },
        enabled: !!process.env.ALERT_WEBHOOK_URL,
      },
    ]
    
    defaultChannels.forEach(channel => this.addChannel(channel))
  }
  
  /**
   * Evaluate rules for a specific metric
   */
  private evaluateRulesForMetric(
    metric: string,
    value: number,
    timestamp: number,
    tags?: Record<string, string>
  ): void {
    const applicableRules = Array.from(this.rules.values()).filter(
      rule => rule.enabled && rule.condition.metric === metric
    )
    
    for (const rule of applicableRules) {
      this.evaluateRule(rule, value, timestamp, tags)
    }
  }
  
  /**
   * Evaluate a single rule
   */
  private evaluateRule(
    rule: AlertRule,
    value: number,
    timestamp: number,
    tags?: Record<string, string>
  ): void {
    const { condition } = rule
    let triggered = false
    
    // Check if condition is met
    switch (condition.operator) {
      case 'gt':
        triggered = value > condition.threshold
        break
      case 'lt':
        triggered = value < condition.threshold
        break
      case 'gte':
        triggered = value >= condition.threshold
        break
      case 'lte':
        triggered = value <= condition.threshold
        break
      case 'eq':
        triggered = value === condition.threshold
        break
      case 'ne':
        triggered = value !== condition.threshold
        break
    }
    
    if (!triggered) return
    
    // Check consecutive count if specified
    if (condition.consecutiveCount && condition.consecutiveCount > 1) {
      const history = this.metricHistory.get(condition.metric) || []
      const recentValues = history
        .filter(h => timestamp - h.timestamp <= condition.timeWindow * 1000)
        .slice(-condition.consecutiveCount)
      
      if (recentValues.length < condition.consecutiveCount) return
      
      const allTriggered = recentValues.every(h => {
        switch (condition.operator) {
          case 'gt': return h.value > condition.threshold
          case 'lt': return h.value < condition.threshold
          case 'gte': return h.value >= condition.threshold
          case 'lte': return h.value <= condition.threshold
          case 'eq': return h.value === condition.threshold
          case 'ne': return h.value !== condition.threshold
          default: return false
        }
      })
      
      if (!allTriggered) return
    }
    
    // Check if alert already exists and is firing
    const existingAlert = Array.from(this.alerts.values()).find(
      alert => alert.ruleId === rule.id && alert.status === 'firing'
    )
    
    if (existingAlert) return // Already alerting
    
    // Create new alert
    const alert: Alert = {
      id: `${rule.id}-${timestamp}`,
      ruleId: rule.id,
      ruleName: rule.name,
      severity: rule.severity,
      message: this.generateAlertMessage(rule, value, condition.threshold),
      timestamp,
      status: 'firing',
      value,
      threshold: condition.threshold,
      tags: { ...rule.tags, ...tags },
      metadata: {
        metric: condition.metric,
        operator: condition.operator,
        timeWindow: condition.timeWindow,
      },
    }
    
    this.alerts.set(alert.id, alert)
    this.sendNotifications(alert, 'triggered')
    
    console.log(`Alert triggered: ${rule.name} - ${alert.message}`)
    
    // Send to Sentry
    Sentry.captureMessage(`Alert: ${rule.name}`, {
      level: this.getSentryLevel(rule.severity),
      tags: alert.tags,
      extra: alert.metadata,
    })
  }
  
  /**
   * Generate alert message
   */
  private generateAlertMessage(rule: AlertRule, value: number, threshold: number): string {
    const { condition } = rule
    const operator = this.getOperatorText(condition.operator)
    
    return `${rule.description}. Current value: ${value}, Threshold: ${operator} ${threshold}`
  }
  
  /**
   * Get operator text for messages
   */
  private getOperatorText(operator: string): string {
    switch (operator) {
      case 'gt': return '>'
      case 'lt': return '<'
      case 'gte': return '>='
      case 'lte': return '<='
      case 'eq': return '='
      case 'ne': return '!='
      default: return operator
    }
  }
  
  /**
   * Send notifications for alert
   */
  private async sendNotifications(alert: Alert, action: 'triggered' | 'resolved'): Promise<void> {
    const rule = this.rules.get(alert.ruleId)
    if (!rule) return
    
    const enabledChannels = rule.channels
      .map(channelId => this.channels.get(channelId))
      .filter(channel => channel && channel.enabled)
    
    const promises = enabledChannels.map(channel => {
      if (!channel) return Promise.resolve()
      
      return this.sendToChannel(channel, alert, action).catch(error => {
        console.error(`Failed to send alert to ${channel.name}:`, error)
      })
    })
    
    await Promise.all(promises)
  }
  
  /**
   * Send alert to specific channel
   */
  private async sendToChannel(
    channel: NotificationChannel,
    alert: Alert,
    action: 'triggered' | 'resolved'
  ): Promise<void> {
    const message = this.formatAlertMessage(alert, action)
    
    switch (channel.type) {
      case 'slack':
        await this.sendSlackNotification(channel, alert, message)
        break
      case 'email':
        await this.sendEmailNotification(channel, alert, message)
        break
      case 'webhook':
        await this.sendWebhookNotification(channel, alert, message)
        break
      case 'pagerduty':
        await this.sendPagerDutyNotification(channel, alert, action)
        break
      case 'discord':
        await this.sendDiscordNotification(channel, alert, message)
        break
      default:
        console.warn(`Unsupported notification channel type: ${channel.type}`)
    }
  }
  
  /**
   * Format alert message for notifications
   */
  private formatAlertMessage(alert: Alert, action: 'triggered' | 'resolved'): string {
    const emoji = action === 'triggered' 
      ? this.getSeverityEmoji(alert.severity)
      : '✅'
    
    const status = action === 'triggered' ? 'TRIGGERED' : 'RESOLVED'
    
    return `${emoji} **ALERT ${status}**
**Rule:** ${alert.ruleName}
**Severity:** ${alert.severity.toUpperCase()}
**Message:** ${alert.message}
**Time:** ${new Date(alert.timestamp).toISOString()}
${alert.tags ? `**Tags:** ${Object.entries(alert.tags).map(([k, v]) => `${k}:${v}`).join(', ')}` : ''}`
  }
  
  /**
   * Get emoji for alert severity
   */
  private getSeverityEmoji(severity: AlertSeverity): string {
    switch (severity) {
      case 'info': return 'ℹ️'
      case 'warning': return '⚠️'
      case 'critical': return '🚨'
      case 'emergency': return '🔥'
      default: return '⚠️'
    }
  }
  
  /**
   * Get Sentry level for severity
   */
  private getSentryLevel(severity: AlertSeverity): 'info' | 'warning' | 'error' | 'fatal' {
    switch (severity) {
      case 'info': return 'info'
      case 'warning': return 'warning'
      case 'critical': return 'error'
      case 'emergency': return 'fatal'
      default: return 'warning'
    }
  }
  
  /**
   * Send Slack notification
   */
  private async sendSlackNotification(
    channel: NotificationChannel,
    alert: Alert,
    message: string
  ): Promise<void> {
    if (!channel.config.webhookUrl) return
    
    const color = alert.severity === 'emergency' ? 'danger' :
                  alert.severity === 'critical' ? 'danger' :
                  alert.severity === 'warning' ? 'warning' : 'good'
    
    await fetch(channel.config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel: channel.config.channel,
        username: channel.config.username || 'PropertyChain Alerts',
        attachments: [{
          color,
          title: `${alert.ruleName} - ${alert.severity.toUpperCase()}`,
          text: message,
          ts: Math.floor(alert.timestamp / 1000),
        }],
      }),
    })
  }
  
  /**
   * Send email notification
   */
  private async sendEmailNotification(
    channel: NotificationChannel,
    alert: Alert,
    message: string
  ): Promise<void> {
    // Implementation would depend on email service (SendGrid, AWS SES, etc.)
    console.log(`Would send email to ${channel.config.to}: ${message}`)
  }
  
  /**
   * Send webhook notification
   */
  private async sendWebhookNotification(
    channel: NotificationChannel,
    alert: Alert,
    message: string
  ): Promise<void> {
    if (!channel.config.url) return
    
    await fetch(channel.config.url, {
      method: channel.config.method || 'POST',
      headers: channel.config.headers || { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        alert,
        message,
        timestamp: new Date().toISOString(),
      }),
    })
  }
  
  /**
   * Send PagerDuty notification
   */
  private async sendPagerDutyNotification(
    channel: NotificationChannel,
    alert: Alert,
    action: 'triggered' | 'resolved'
  ): Promise<void> {
    if (!channel.config.integrationKey) return
    
    const eventAction = action === 'triggered' ? 'trigger' : 'resolve'
    
    await fetch('https://events.pagerduty.com/v2/enqueue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        routing_key: channel.config.integrationKey,
        event_action: eventAction,
        dedup_key: alert.ruleId,
        payload: {
          summary: alert.message,
          severity: channel.config.severity || alert.severity,
          source: 'PropertyChain',
          component: 'monitoring',
          group: 'alerts',
          class: alert.ruleId,
          custom_details: alert.metadata,
        },
      }),
    })
  }
  
  /**
   * Send Discord notification
   */
  private async sendDiscordNotification(
    channel: NotificationChannel,
    alert: Alert,
    message: string
  ): Promise<void> {
    if (!channel.config.webhookUrl) return
    
    const color = alert.severity === 'emergency' ? 0xff0000 :
                  alert.severity === 'critical' ? 0xff4444 :
                  alert.severity === 'warning' ? 0xffaa00 : 0x00ff00
    
    await fetch(channel.config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: alert.ruleName,
          description: message,
          color,
          timestamp: new Date(alert.timestamp).toISOString(),
        }],
      }),
    })
  }
  
  /**
   * Start evaluation loop
   */
  private startEvaluationLoop(): void {
    // Evaluate rules every 30 seconds
    setInterval(() => {
      this.cleanupOldAlerts()
    }, 30000)
  }
  
  /**
   * Cleanup old resolved alerts
   */
  private cleanupOldAlerts(): void {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
    
    for (const [alertId, alert] of Array.from(this.alerts.entries())) {
      if (alert.status === 'resolved' && alert.timestamp < oneDayAgo) {
        this.alerts.delete(alertId)
      }
    }
    
    // Cleanup old metric history
    for (const [metric, history] of Array.from(this.metricHistory.entries())) {
      const filtered = history.filter(h => Date.now() - h.timestamp < 60 * 60 * 1000) // Keep 1 hour
      this.metricHistory.set(metric, filtered)
    }
  }
}

// Global alert service instance
export const alertService = AlertService.getInstance()

// Export utility functions
export const addAlertRule = (rule: AlertRule) => alertService.addRule(rule)
export const submitMetric = (metric: string, value: number, tags?: Record<string, string>) => 
  alertService.submitMetric(metric, value, tags)
export const getActiveAlerts = () => alertService.getActiveAlerts()
export const getAlertHistory = (limit?: number) => alertService.getAlertHistory(limit)

export default alertService