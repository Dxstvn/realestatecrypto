/**
 * Welcome Email Templates - PropertyChain
 * 
 * Onboarding and welcome emails for new users
 * Following UpdatedUIPlan.md Step 63 specifications and CLAUDE.md principles
 */

import * as React from 'react'
import { Text, Hr, Link, Section, Img } from '@react-email/components'
import { BaseEmailTemplate, Button, Alert } from '../components/base-template'

/**
 * Welcome Email for New Users
 */
interface WelcomeEmailProps {
  userName: string
  userEmail: string
  verificationUrl: string
  dashboardUrl: string
  helpUrl: string
}

export function WelcomeEmail({
  userName,
  userEmail,
  verificationUrl,
  dashboardUrl,
  helpUrl,
}: WelcomeEmailProps) {
  return (
    <BaseEmailTemplate
      preview="Welcome to PropertyChain - Start investing in real estate today"
      heading="Welcome to PropertyChain! 🏡"
    >
      <Text className="text-gray-700 mb-4">
        Hi {userName},
      </Text>

      <Text className="text-gray-700 mb-6">
        Welcome to PropertyChain! We're thrilled to have you join our community of modern real estate investors.
        You're now part of a revolutionary platform that makes property investment accessible to everyone through blockchain technology.
      </Text>

      <Alert type="info">
        <Text className="font-semibold mb-2">Verify Your Email</Text>
        <Text className="text-sm">
          Please verify your email address to unlock all features and start investing.
        </Text>
      </Alert>

      <div className="text-center my-6">
        <Button href={verificationUrl} variant="primary">
          Verify Email Address
        </Button>
      </div>

      <Section className="mb-6">
        <Text className="font-semibold text-gray-900 mb-4">Get Started in 3 Simple Steps</Text>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-brand-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">
              1
            </div>
            <div>
              <Text className="font-medium text-gray-900 mb-1">Complete Your Profile</Text>
              <Text className="text-sm text-gray-600">
                Add your personal information and complete KYC verification to enable investments.
              </Text>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-brand-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">
              2
            </div>
            <div>
              <Text className="font-medium text-gray-900 mb-1">Browse Properties</Text>
              <Text className="text-sm text-gray-600">
                Explore our curated selection of tokenized properties from around the world.
              </Text>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-brand-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">
              3
            </div>
            <div>
              <Text className="font-medium text-gray-900 mb-1">Start Investing</Text>
              <Text className="text-sm text-gray-600">
                Purchase property tokens and start earning rental income from your investments.
              </Text>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-gray-50 rounded-lg p-6 mb-6">
        <Text className="font-semibold text-gray-900 mb-3">Why PropertyChain?</Text>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>✓ Start investing with as little as $100</li>
          <li>✓ Earn monthly rental income</li>
          <li>✓ Full transparency with blockchain technology</li>
          <li>✓ Trade tokens 24/7 on our marketplace</li>
          <li>✓ No hidden fees or complicated contracts</li>
        </ul>
      </Section>

      <div className="text-center space-y-3">
        <Button href={dashboardUrl} variant="secondary">
          Go to Dashboard
        </Button>
        <br />
        <Link href={helpUrl} className="text-sm text-brand-primary hover:underline">
          Visit Help Center
        </Link>
      </div>

      <Hr className="my-6" />

      <Text className="text-xs text-gray-600 text-center">
        You're receiving this email because you signed up for PropertyChain with {userEmail}.
        If you didn't create this account, please contact our support team immediately.
      </Text>
    </BaseEmailTemplate>
  )
}

/**
 * Email Verification Confirmation
 */
interface EmailVerifiedProps {
  userName: string
  dashboardUrl: string
  kycUrl: string
}

export function EmailVerifiedEmail({
  userName,
  dashboardUrl,
  kycUrl,
}: EmailVerifiedProps) {
  return (
    <BaseEmailTemplate
      preview="Your email has been verified - Complete KYC to start investing"
      heading="Email Verified Successfully! ✅"
    >
      <Text className="text-gray-700 mb-4">
        Hi {userName},
      </Text>

      <Text className="text-gray-700 mb-6">
        Great! Your email address has been successfully verified. You're one step closer to starting your real estate investment journey.
      </Text>

      <Alert type="success">
        <Text className="font-semibold">Email Verification Complete</Text>
      </Alert>

      <Section className="mb-6">
        <Text className="font-semibold text-gray-900 mb-4">Next Step: Complete KYC Verification</Text>
        
        <Text className="text-gray-700 mb-4">
          To comply with regulations and ensure the security of our platform, we need to verify your identity.
          The process is quick and secure.
        </Text>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <Text className="text-sm text-blue-900">
            <strong>What you'll need:</strong>
          </Text>
          <ul className="text-sm text-blue-800 mt-2 space-y-1">
            <li>• Government-issued ID (passport, driver's license, or national ID)</li>
            <li>• Proof of address (utility bill or bank statement)</li>
            <li>• A selfie for identity verification</li>
          </ul>
        </div>
      </Section>

      <div className="text-center mb-6">
        <Button href={kycUrl} variant="primary">
          Start KYC Verification
        </Button>
        <Text className="text-sm text-gray-600 mt-4">
          or{' '}
          <Link href={dashboardUrl} className="text-brand-primary hover:underline">
            explore the platform first
          </Link>
        </Text>
      </div>

      <Text className="text-xs text-gray-600 text-center">
        KYC verification typically takes 5-10 minutes and is processed within 24 hours.
      </Text>
    </BaseEmailTemplate>
  )
}

/**
 * KYC Approval Email
 */
interface KYCApprovedProps {
  userName: string
  approvalDate: string
  investmentLimit: string
  browseUrl: string
  dashboardUrl: string
}

export function KYCApprovedEmail({
  userName,
  approvalDate,
  investmentLimit,
  browseUrl,
  dashboardUrl,
}: KYCApprovedProps) {
  return (
    <BaseEmailTemplate
      preview="KYC approved - You can now start investing in properties"
      heading="KYC Approved - Start Investing! 🎉"
    >
      <Text className="text-gray-700 mb-4">
        Hi {userName},
      </Text>

      <Text className="text-gray-700 mb-6">
        Fantastic news! Your KYC verification has been approved. You now have full access to invest in properties on PropertyChain.
      </Text>

      <Alert type="success">
        <Text className="font-semibold mb-2">Verification Complete</Text>
        <Text className="text-sm">
          Approved on {approvalDate} • Investment Limit: {investmentLimit}
        </Text>
      </Alert>

      <Section className="mb-6">
        <Text className="font-semibold text-gray-900 mb-4">You Can Now:</Text>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <Text className="text-green-600 mr-2">✓</Text>
            <Text className="text-gray-700">Invest in any property on the platform</Text>
          </div>
          <div className="flex items-center">
            <Text className="text-green-600 mr-2">✓</Text>
            <Text className="text-gray-700">Receive monthly rental distributions</Text>
          </div>
          <div className="flex items-center">
            <Text className="text-green-600 mr-2">✓</Text>
            <Text className="text-gray-700">Trade tokens on the secondary market</Text>
          </div>
          <div className="flex items-center">
            <Text className="text-green-600 mr-2">✓</Text>
            <Text className="text-gray-700">Participate in property governance votes</Text>
          </div>
        </div>
      </Section>

      <Section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
        <Text className="font-semibold text-gray-900 mb-3">🎁 Welcome Bonus</Text>
        <Text className="text-gray-700 mb-3">
          As a verified member, you're eligible for:
        </Text>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 50% off transaction fees for your first investment</li>
          <li>• Priority access to new property listings</li>
          <li>• Exclusive investor webinars and reports</li>
        </ul>
      </Section>

      <div className="text-center space-y-3">
        <Button href={browseUrl} variant="primary">
          Browse Properties
        </Button>
        <br />
        <Link href={dashboardUrl} className="text-sm text-brand-primary hover:underline">
          Go to Dashboard
        </Link>
      </div>
    </BaseEmailTemplate>
  )
}

/**
 * KYC Rejection Email
 */
interface KYCRejectedProps {
  userName: string
  rejectionReason: string
  supportUrl: string
  retryUrl: string
}

export function KYCRejectedEmail({
  userName,
  rejectionReason,
  supportUrl,
  retryUrl,
}: KYCRejectedProps) {
  return (
    <BaseEmailTemplate
      preview="Additional information needed for KYC verification"
      heading="KYC Verification Requires Additional Information"
    >
      <Text className="text-gray-700 mb-4">
        Hi {userName},
      </Text>

      <Text className="text-gray-700 mb-6">
        Thank you for submitting your KYC verification. Unfortunately, we need additional information to complete the verification process.
      </Text>

      <Alert type="warning">
        <Text className="font-semibold mb-2">Verification Incomplete</Text>
        <Text className="text-sm">{rejectionReason}</Text>
      </Alert>

      <Section className="mb-6">
        <Text className="font-semibold text-gray-900 mb-4">Common Issues and Solutions:</Text>
        
        <div className="space-y-3">
          <div>
            <Text className="font-medium text-gray-900">Document Quality</Text>
            <Text className="text-sm text-gray-600">
              Ensure all documents are clear, unblurred, and all information is visible.
            </Text>
          </div>
          <div>
            <Text className="font-medium text-gray-900">Document Validity</Text>
            <Text className="text-sm text-gray-600">
              Make sure your ID hasn't expired and proof of address is from the last 3 months.
            </Text>
          </div>
          <div>
            <Text className="font-medium text-gray-900">Information Match</Text>
            <Text className="text-sm text-gray-600">
              Verify that the name and address on documents match your account information.
            </Text>
          </div>
        </div>
      </Section>

      <div className="text-center space-y-3">
        <Button href={retryUrl} variant="primary">
          Retry Verification
        </Button>
        <br />
        <Link href={supportUrl} className="text-sm text-brand-primary hover:underline">
          Contact Support for Help
        </Link>
      </div>

      <Hr className="my-6" />

      <Text className="text-xs text-gray-600 text-center">
        Our support team is available 24/7 to help you complete your verification.
      </Text>
    </BaseEmailTemplate>
  )
}

/**
 * Account Activation Email (after period of inactivity)
 */
interface AccountReactivationProps {
  userName: string
  lastActiveDate: string
  missedOpportunities: number
  featuredProperty?: {
    title: string
    image: string
    roi: string
    url: string
  }
  dashboardUrl: string
}

export function AccountReactivationEmail({
  userName,
  lastActiveDate,
  missedOpportunities,
  featuredProperty,
  dashboardUrl,
}: AccountReactivationProps) {
  return (
    <BaseEmailTemplate
      preview="We've missed you! Check out what's new on PropertyChain"
      heading="Welcome Back to PropertyChain! 👋"
    >
      <Text className="text-gray-700 mb-4">
        Hi {userName},
      </Text>

      <Text className="text-gray-700 mb-6">
        We've missed you! It's been a while since your last visit on {lastActiveDate}.
        Here's what you've missed and some exciting opportunities waiting for you.
      </Text>

      {missedOpportunities > 0 && (
        <Alert type="info">
          <Text className="font-semibold">
            {missedOpportunities} new investment opportunities since your last visit!
          </Text>
        </Alert>
      )}

      {featuredProperty && (
        <Section className="mb-6">
          <Text className="font-semibold text-gray-900 mb-4">Featured Opportunity</Text>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Img
              src={featuredProperty.image}
              alt={featuredProperty.title}
              width="100%"
              height="200"
              className="object-cover"
            />
            <div className="p-4">
              <Text className="font-semibold text-gray-900 mb-2">{featuredProperty.title}</Text>
              <Text className="text-brand-primary font-bold mb-3">
                Expected ROI: {featuredProperty.roi}
              </Text>
              <Button href={featuredProperty.url} variant="primary">
                View Property
              </Button>
            </div>
          </div>
        </Section>
      )}

      <Section className="bg-gray-50 rounded-lg p-6 mb-6">
        <Text className="font-semibold text-gray-900 mb-3">Platform Updates</Text>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>🆕 New properties added weekly</li>
          <li>📈 Average investor returns up 15% this quarter</li>
          <li>🔄 Instant token trading now available</li>
          <li>🎯 AI-powered investment recommendations</li>
        </ul>
      </Section>

      <div className="text-center">
        <Button href={dashboardUrl} variant="primary">
          Return to Dashboard
        </Button>
      </div>
    </BaseEmailTemplate>
  )
}