/**
 * Email Service - PropertyChain
 * 
 * Email sending service with Resend integration
 * Following UpdatedUIPlan.md Step 63 specifications and CLAUDE.md principles
 */

import { Resend } from 'resend'
import { render } from '@react-email/render'
import { ReactElement } from 'react'

// Initialize Resend client with fallback for build time
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build')

/**
 * Email sending configuration
 */
export const EMAIL_CONFIG = {
  from: {
    default: 'PropertyChain <noreply@propertychain.com>',
    support: 'PropertyChain Support <support@propertychain.com>',
    sales: 'PropertyChain Sales <sales@propertychain.com>',
    notifications: 'PropertyChain <notifications@propertychain.com>',
  },
  replyTo: {
    support: 'support@propertychain.com',
    sales: 'sales@propertychain.com',
  },
  categories: {
    transactional: 'transactional',
    marketing: 'marketing',
    notification: 'notification',
    system: 'system',
  },
  priorities: {
    high: 1,
    normal: 3,
    low: 5,
  },
} as const

/**
 * Email sending options
 */
interface SendEmailOptions {
  to: string | string[]
  subject: string
  template: ReactElement
  from?: keyof typeof EMAIL_CONFIG.from
  replyTo?: string
  category?: keyof typeof EMAIL_CONFIG.categories
  priority?: keyof typeof EMAIL_CONFIG.priorities
  tags?: string[]
  attachments?: Array<{
    filename: string
    content: Buffer | string
  }>
  scheduledFor?: Date
}

/**
 * Send email using Resend
 */
export async function sendEmail({
  to,
  subject,
  template,
  from = 'default',
  replyTo,
  category = 'transactional',
  priority = 'normal',
  tags = [],
  attachments,
  scheduledFor,
}: SendEmailOptions) {
  try {
    // Render React email template to HTML
    const html = await render(template)
    
    // Prepare email data
    const emailData = {
      from: EMAIL_CONFIG.from[from],
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      react: template,
      replyTo: replyTo || EMAIL_CONFIG.replyTo.support,
      headers: {
        'X-Priority': EMAIL_CONFIG.priorities[priority].toString(),
        'X-Category': category,
      },
      tags: [...tags.map(tag => ({ name: tag, value: tag })), { name: category, value: category }],
      attachments,
      scheduledAt: scheduledFor?.toISOString(),
    }
    
    // Send email
    const result = await resend.emails.send(emailData)
    
    // Log success
    console.log(`Email sent successfully: ${result.data?.id}`)
    
    return {
      success: true,
      id: result.data?.id,
      to: emailData.to,
      subject,
    }
  } catch (error) {
    console.error('Failed to send email:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      to: Array.isArray(to) ? to : [to],
      subject,
    }
  }
}

/**
 * Send batch emails
 */
export async function sendBatchEmails(
  emails: Array<Omit<SendEmailOptions, 'scheduledFor'>>
) {
  const results = await Promise.allSettled(
    emails.map(email => sendEmail(email))
  )
  
  const successful = results.filter(r => r.status === 'fulfilled' && r.value.success)
  const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success))
  
  return {
    sent: successful.length,
    failed: failed.length,
    total: emails.length,
    results,
  }
}

/**
 * Email templates mapping
 */
export const EMAIL_TEMPLATES = {
  // Welcome emails
  welcome: async (data: any) => {
    const { WelcomeEmail } = await import('@/emails/templates/welcome')
    return <WelcomeEmail {...data} />
  },
  emailVerified: async (data: any) => {
    const { EmailVerifiedEmail } = await import('@/emails/templates/welcome')
    return <EmailVerifiedEmail {...data} />
  },
  kycApproved: async (data: any) => {
    const { KYCApprovedEmail } = await import('@/emails/templates/welcome')
    return <KYCApprovedEmail {...data} />
  },
  kycRejected: async (data: any) => {
    const { KYCRejectedEmail } = await import('@/emails/templates/welcome')
    return <KYCRejectedEmail {...data} />
  },
  
  // Transaction emails
  purchaseConfirmation: async (data: any) => {
    const { PurchaseConfirmationEmail } = await import('@/emails/templates/transaction-confirmation')
    return <PurchaseConfirmationEmail {...data} />
  },
  saleConfirmation: async (data: any) => {
    const { SaleConfirmationEmail } = await import('@/emails/templates/transaction-confirmation')
    return <SaleConfirmationEmail {...data} />
  },
  rentalDistribution: async (data: any) => {
    const { RentalDistributionEmail } = await import('@/emails/templates/transaction-confirmation')
    return <RentalDistributionEmail {...data} />
  },
  failedTransaction: async (data: any) => {
    const { FailedTransactionEmail } = await import('@/emails/templates/transaction-confirmation')
    return <FailedTransactionEmail {...data} />
  },
  escrowNotification: async (data: any) => {
    const { EscrowNotificationEmail } = await import('@/emails/templates/transaction-confirmation')
    return <EscrowNotificationEmail {...data} />
  },
  
  // Newsletter emails
  weeklyNewsletter: async (data: any) => {
    const { WeeklyNewsletterEmail } = await import('@/emails/templates/newsletter')
    return <WeeklyNewsletterEmail {...data} />
  },
  propertyAlert: async (data: any) => {
    const { PropertyAlertEmail } = await import('@/emails/templates/newsletter')
    return <PropertyAlertEmail {...data} />
  },
  investmentSummary: async (data: any) => {
    const { InvestmentSummaryEmail } = await import('@/emails/templates/newsletter')
    return <InvestmentSummaryEmail {...data} />
  },
} as const

/**
 * Send templated email
 */
export async function sendTemplatedEmail(
  template: keyof typeof EMAIL_TEMPLATES,
  data: any,
  options: Omit<SendEmailOptions, 'template'>
) {
  const emailTemplate = await EMAIL_TEMPLATES[template](data)
  return sendEmail({
    ...options,
    template: emailTemplate,
  })
}

/**
 * Email queue for background processing
 */
export class EmailQueue {
  private queue: Array<{
    id: string
    email: SendEmailOptions
    retries: number
    createdAt: Date
  }> = []
  
  private processing = false
  private maxRetries = 3
  private retryDelay = 5000 // 5 seconds
  
  /**
   * Add email to queue
   */
  add(email: SendEmailOptions): string {
    const id = `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    this.queue.push({
      id,
      email,
      retries: 0,
      createdAt: new Date(),
    })
    
    if (!this.processing) {
      this.process()
    }
    
    return id
  }
  
  /**
   * Process email queue
   */
  private async process() {
    if (this.processing || this.queue.length === 0) {
      return
    }
    
    this.processing = true
    
    while (this.queue.length > 0) {
      const item = this.queue.shift()
      
      if (!item) continue
      
      try {
        const result = await sendEmail(item.email)
        
        if (!result.success && item.retries < this.maxRetries) {
          // Retry failed emails
          item.retries++
          this.queue.push(item)
          await new Promise(resolve => setTimeout(resolve, this.retryDelay))
        } else if (!result.success) {
          // Log permanently failed emails
          console.error(`Email permanently failed after ${this.maxRetries} retries:`, item.id)
        }
      } catch (error) {
        console.error('Email queue processing error:', error)
        
        if (item.retries < this.maxRetries) {
          item.retries++
          this.queue.push(item)
        }
      }
    }
    
    this.processing = false
  }
  
  /**
   * Get queue status
   */
  getStatus() {
    return {
      pending: this.queue.length,
      processing: this.processing,
    }
  }
}

/**
 * Email validation utilities
 */
export const EmailValidation = {
  /**
   * Validate email address format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },
  
  /**
   * Check if email domain is disposable
   */
  async isDisposableEmail(email: string): Promise<boolean> {
    // This would typically check against a disposable email database
    const disposableDomains = [
      'tempmail.com',
      'throwaway.email',
      'guerrillamail.com',
      '10minutemail.com',
    ]
    
    const domain = email.split('@')[1]
    return disposableDomains.includes(domain)
  },
  
  /**
   * Verify email exists (basic check)
   */
  async verifyEmail(email: string): Promise<boolean> {
    if (!this.isValidEmail(email)) {
      return false
    }
    
    const isDisposable = await this.isDisposableEmail(email)
    if (isDisposable) {
      return false
    }
    
    // Additional verification could be added here
    return true
  },
}

/**
 * Email tracking
 */
export const EmailTracking = {
  /**
   * Generate tracking pixel
   */
  generateTrackingPixel(emailId: string): string {
    const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/email/track/${emailId}`
    return `<img src="${trackingUrl}" width="1" height="1" style="display:none;" />`
  },
  
  /**
   * Generate click tracking URL
   */
  generateClickTrackingUrl(originalUrl: string, emailId: string, linkId: string): string {
    const params = new URLSearchParams({
      url: originalUrl,
      email: emailId,
      link: linkId,
    })
    return `${process.env.NEXT_PUBLIC_APP_URL}/api/email/click?${params.toString()}`
  },
}

// Create singleton instances
export const emailQueue = new EmailQueue()

// Export everything
export default {
  sendEmail,
  sendBatchEmails,
  sendTemplatedEmail,
  EmailQueue,
  emailQueue,
  EmailValidation,
  EmailTracking,
  EMAIL_CONFIG,
  EMAIL_TEMPLATES,
}