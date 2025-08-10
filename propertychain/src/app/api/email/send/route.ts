/**
 * Email Send API Route - PropertyChain
 * 
 * API endpoint for sending emails
 * Following UpdatedUIPlan.md Step 63 specifications and CLAUDE.md principles
 */

import { NextRequest, NextResponse } from 'next/server'
import { sendTemplatedEmail, EmailValidation } from '@/lib/email/service'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

// Request validation schema
const sendEmailSchema = z.object({
  template: z.enum([
    'welcome',
    'emailVerified',
    'kycApproved',
    'kycRejected',
    'purchaseConfirmation',
    'saleConfirmation',
    'rentalDistribution',
    'failedTransaction',
    'escrowNotification',
    'weeklyNewsletter',
    'propertyAlert',
    'investmentSummary',
  ]),
  to: z.union([z.string().email(), z.array(z.string().email())]),
  subject: z.string().min(1).max(200),
  data: z.record(z.string(), z.any()),
  options: z.object({
    from: z.enum(['default', 'support', 'sales', 'notifications']).optional(),
    category: z.enum(['transactional', 'marketing', 'notification', 'system']).optional(),
    priority: z.enum(['high', 'normal', 'low']).optional(),
    tags: z.array(z.string()).optional(),
    scheduledFor: z.string().datetime().optional(),
  }).optional(),
})

/**
 * POST /api/email/send
 * Send an email using a template
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Parse and validate request body
    const body = await request.json()
    const validation = sendEmailSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request',
          details: validation.error.issues 
        },
        { status: 400 }
      )
    }
    
    const { template, to, subject, data, options = {} } = validation.data
    
    // Validate email addresses
    const emails = Array.isArray(to) ? to : [to]
    for (const email of emails) {
      const isValid = await EmailValidation.verifyEmail(email)
      if (!isValid) {
        return NextResponse.json(
          { 
            error: 'Invalid email address',
            email 
          },
          { status: 400 }
        )
      }
    }
    
    // Send email
    const result = await sendTemplatedEmail(
      template as any,
      data,
      {
        to,
        subject,
        ...options,
        scheduledFor: options.scheduledFor ? new Date(options.scheduledFor) : undefined,
      }
    )
    
    if (!result.success) {
      return NextResponse.json(
        { 
          error: 'Failed to send email',
          details: result.error 
        },
        { status: 500 }
      )
    }
    
    // Log email sent
    console.log(`Email sent: ${template} to ${emails.join(', ')}`)
    
    return NextResponse.json({
      success: true,
      id: result.id,
      to: result.to,
      subject: result.subject,
      template,
    })
  } catch (error) {
    console.error('Email send error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/email/send
 * Get email service status
 */
export async function GET(request: NextRequest) {
  // Check authentication
  const session = await getServerSession()
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  return NextResponse.json({
    status: 'operational',
    service: 'email',
    provider: 'resend',
    configured: Boolean(process.env.RESEND_API_KEY),
    templates: [
      'welcome',
      'emailVerified',
      'kycApproved',
      'kycRejected',
      'purchaseConfirmation',
      'saleConfirmation',
      'rentalDistribution',
      'failedTransaction',
      'escrowNotification',
      'weeklyNewsletter',
      'propertyAlert',
      'investmentSummary',
    ],
  })
}