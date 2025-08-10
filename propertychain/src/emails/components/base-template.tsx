/**
 * Base Email Template - PropertyChain
 * 
 * Reusable base template for all emails
 * Following UpdatedUIPlan.md Step 63 specifications and CLAUDE.md principles
 */

import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
  Button as EmailButton,
} from '@react-email/components'

interface BaseEmailTemplateProps {
  preview: string
  heading?: string
  children: React.ReactNode
  footerText?: string
  unsubscribeUrl?: string
}

export function BaseEmailTemplate({
  preview,
  heading,
  children,
  footerText = 'PropertyChain - Real Estate Tokenization Platform',
  unsubscribeUrl,
}: BaseEmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: {
                  primary: '#2563eb',
                  secondary: '#4f46e5',
                  accent: '#06b6d4',
                  dark: '#1e293b',
                  light: '#f8fafc',
                },
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
              },
              fontFamily: {
                sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
              },
            },
          },
        }}
      >
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto py-8 px-4 max-w-xl">
            {/* Header */}
            <Section className="bg-white rounded-t-lg px-8 py-6 border-b border-gray-200">
              <Img
                src="https://propertychain.com/logo.png"
                width="180"
                height="40"
                alt="PropertyChain"
                className="mx-auto"
              />
            </Section>

            {/* Main Content */}
            <Section className="bg-white px-8 py-8">
              {heading && (
                <Heading className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  {heading}
                </Heading>
              )}
              {children}
            </Section>

            {/* Footer */}
            <Section className="bg-gray-50 rounded-b-lg px-8 py-6 text-center">
              <Text className="text-sm text-gray-600 mb-4">{footerText}</Text>
              
              <div className="flex justify-center space-x-4 mb-4">
                <Link
                  href="https://propertychain.com/help"
                  className="text-sm text-brand-primary hover:underline"
                >
                  Help Center
                </Link>
                <Text className="text-sm text-gray-400">•</Text>
                <Link
                  href="https://propertychain.com/privacy"
                  className="text-sm text-brand-primary hover:underline"
                >
                  Privacy Policy
                </Link>
                <Text className="text-sm text-gray-400">•</Text>
                <Link
                  href="https://propertychain.com/terms"
                  className="text-sm text-brand-primary hover:underline"
                >
                  Terms of Service
                </Link>
              </div>

              <Text className="text-xs text-gray-500 mb-2">
                © {new Date().getFullYear()} PropertyChain. All rights reserved.
              </Text>

              {unsubscribeUrl && (
                <Link
                  href={unsubscribeUrl}
                  className="text-xs text-gray-500 hover:underline"
                >
                  Unsubscribe from these emails
                </Link>
              )}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

/**
 * Button component for emails
 */
export function Button({
  href,
  children,
  variant = 'primary',
}: {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
}) {
  const styles = {
    primary: 'bg-brand-primary text-white hover:bg-brand-secondary',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'bg-white text-brand-primary border-2 border-brand-primary hover:bg-brand-primary hover:text-white',
  }

  return (
    <EmailButton
      href={href}
      className={`inline-block px-6 py-3 rounded-lg font-medium text-center transition-colors ${styles[variant]}`}
    >
      {children}
    </EmailButton>
  )
}

/**
 * Property card component for emails
 */
export function PropertyCard({
  image,
  title,
  price,
  location,
  href,
}: {
  image: string
  title: string
  price: string
  location: string
  href: string
}) {
  return (
    <Link href={href} className="block no-underline">
      <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        <Img
          src={image}
          alt={title}
          width="100%"
          height="200"
          className="object-cover"
        />
        <div className="p-4">
          <Text className="font-semibold text-gray-900 mb-1">{title}</Text>
          <Text className="text-brand-primary font-bold text-lg mb-1">{price}</Text>
          <Text className="text-sm text-gray-600">{location}</Text>
        </div>
      </div>
    </Link>
  )
}

/**
 * Transaction detail row
 */
export function TransactionRow({
  label,
  value,
  highlighted = false,
}: {
  label: string
  value: string
  highlighted?: boolean
}) {
  return (
    <div className={`flex justify-between py-2 ${highlighted ? 'font-semibold' : ''}`}>
      <Text className="text-gray-600">{label}:</Text>
      <Text className={highlighted ? 'text-brand-primary' : 'text-gray-900'}>{value}</Text>
    </div>
  )
}

/**
 * Alert box component
 */
export function Alert({
  type = 'info',
  children,
}: {
  type?: 'success' | 'warning' | 'error' | 'info'
  children: React.ReactNode
}) {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  return (
    <div className={`p-4 rounded-lg border ${styles[type]} mb-4`}>
      {children}
    </div>
  )
}

export default BaseEmailTemplate