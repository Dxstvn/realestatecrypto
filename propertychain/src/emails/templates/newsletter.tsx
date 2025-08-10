/**
 * Newsletter Email Templates - PropertyChain
 * 
 * Marketing and newsletter emails
 * Following UpdatedUIPlan.md Step 63 specifications and CLAUDE.md principles
 */

import * as React from 'react'
import { Text, Hr, Link, Section, Img, Column, Row } from '@react-email/components'
import { BaseEmailTemplate, Button, PropertyCard } from '../components/base-template'

/**
 * Weekly Newsletter Email
 */
interface WeeklyNewsletterProps {
  userName: string
  weekNumber: string
  featuredProperties: Array<{
    id: string
    title: string
    image: string
    price: string
    location: string
    roi: string
    url: string
  }>
  marketInsights: {
    totalVolume: string
    activeInvestors: string
    averageROI: string
    trendDirection: 'up' | 'down' | 'stable'
  }
  educationalContent: {
    title: string
    description: string
    url: string
  }
  unsubscribeUrl: string
}

export function WeeklyNewsletterEmail({
  userName,
  weekNumber,
  featuredProperties,
  marketInsights,
  educationalContent,
  unsubscribeUrl,
}: WeeklyNewsletterProps) {
  return (
    <BaseEmailTemplate
      preview={`PropertyChain Weekly: New investment opportunities and market insights`}
      heading={`Weekly Digest - Week ${weekNumber}`}
      unsubscribeUrl={unsubscribeUrl}
    >
      <Text className="text-gray-700 mb-6">
        Hi {userName},
      </Text>

      <Text className="text-gray-700 mb-6">
        Here's your weekly roundup of the best investment opportunities and market insights from PropertyChain.
      </Text>

      {/* Market Overview */}
      <Section className="mb-8">
        <Text className="text-xl font-bold text-gray-900 mb-4">📊 Market Overview</Text>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <Row>
            <Column className="text-center">
              <Text className="text-sm text-gray-600 mb-1">Total Volume</Text>
              <Text className="text-lg font-bold text-gray-900">{marketInsights.totalVolume}</Text>
            </Column>
            <Column className="text-center">
              <Text className="text-sm text-gray-600 mb-1">Active Investors</Text>
              <Text className="text-lg font-bold text-gray-900">{marketInsights.activeInvestors}</Text>
            </Column>
            <Column className="text-center">
              <Text className="text-sm text-gray-600 mb-1">Avg. ROI</Text>
              <Text className={`text-lg font-bold ${
                marketInsights.trendDirection === 'up' ? 'text-green-600' : 
                marketInsights.trendDirection === 'down' ? 'text-red-600' : 'text-gray-900'
              }`}>
                {marketInsights.trendDirection === 'up' && '↑'}
                {marketInsights.trendDirection === 'down' && '↓'}
                {marketInsights.averageROI}
              </Text>
            </Column>
          </Row>
        </div>
      </Section>

      {/* Featured Properties */}
      <Section className="mb-8">
        <Text className="text-xl font-bold text-gray-900 mb-4">🏡 Featured Properties</Text>
        
        <div className="space-y-4">
          {featuredProperties.slice(0, 3).map((property) => (
            <div key={property.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <Row>
                <Column width="200">
                  <Img
                    src={property.image}
                    alt={property.title}
                    width="200"
                    height="150"
                    className="object-cover"
                  />
                </Column>
                <Column className="p-4">
                  <Link href={property.url} className="no-underline">
                    <Text className="font-semibold text-gray-900 mb-1">{property.title}</Text>
                  </Link>
                  <Text className="text-sm text-gray-600 mb-2">{property.location}</Text>
                  <div className="flex items-center justify-between">
                    <Text className="text-brand-primary font-bold">{property.price}</Text>
                    <Text className="text-sm text-green-600 font-medium">ROI: {property.roi}</Text>
                  </div>
                  <Link href={property.url} className="text-sm text-brand-primary hover:underline mt-2 inline-block">
                    View Details →
                  </Link>
                </Column>
              </Row>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <Button href="https://propertychain.com/properties" variant="primary">
            Browse All Properties
          </Button>
        </div>
      </Section>

      {/* Educational Content */}
      <Section className="mb-8">
        <Text className="text-xl font-bold text-gray-900 mb-4">📚 Learn & Grow</Text>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <Text className="font-semibold text-gray-900 mb-2">{educationalContent.title}</Text>
          <Text className="text-gray-700 mb-4">{educationalContent.description}</Text>
          <Link href={educationalContent.url} className="text-brand-primary hover:underline">
            Read More →
          </Link>
        </div>
      </Section>

      <Hr className="my-6" />

      <Text className="text-xs text-gray-600 text-center">
        Stay connected with us on social media for daily updates and exclusive content.
      </Text>
    </BaseEmailTemplate>
  )
}

/**
 * New Property Alert Email
 */
interface PropertyAlertProps {
  userName: string
  alertPreferences: {
    location?: string
    priceRange?: string
    propertyType?: string
  }
  property: {
    title: string
    description: string
    image: string
    price: string
    location: string
    bedrooms: number
    bathrooms: number
    squareFeet: number
    expectedROI: string
    availableTokens: string
    url: string
  }
  similarProperties: Array<{
    title: string
    price: string
    url: string
  }>
  manageAlertsUrl: string
}

export function PropertyAlertEmail({
  userName,
  alertPreferences,
  property,
  similarProperties,
  manageAlertsUrl,
}: PropertyAlertProps) {
  return (
    <BaseEmailTemplate
      preview={`New property matching your criteria: ${property.title}`}
      heading="New Property Match! 🎯"
    >
      <Text className="text-gray-700 mb-4">
        Hi {userName},
      </Text>

      <Text className="text-gray-700 mb-6">
        A new property matching your investment criteria has just been listed on PropertyChain!
      </Text>

      {/* Alert Criteria */}
      {alertPreferences && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <Text className="text-sm font-semibold text-blue-900 mb-2">Your Alert Criteria:</Text>
          <div className="text-sm text-blue-800">
            {alertPreferences.location && <div>📍 Location: {alertPreferences.location}</div>}
            {alertPreferences.priceRange && <div>💰 Price Range: {alertPreferences.priceRange}</div>}
            {alertPreferences.propertyType && <div>🏠 Type: {alertPreferences.propertyType}</div>}
          </div>
        </div>
      )}

      {/* Property Details */}
      <Section className="mb-6">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Img
            src={property.image}
            alt={property.title}
            width="100%"
            height="300"
            className="object-cover"
          />
          
          <div className="p-6">
            <Text className="text-2xl font-bold text-gray-900 mb-2">{property.title}</Text>
            <Text className="text-lg text-brand-primary font-bold mb-4">{property.price}</Text>
            
            <Text className="text-gray-700 mb-4">{property.description}</Text>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <Row>
                <Column>
                  <Text className="text-sm text-gray-600">Location</Text>
                  <Text className="font-semibold">{property.location}</Text>
                </Column>
                <Column>
                  <Text className="text-sm text-gray-600">Size</Text>
                  <Text className="font-semibold">{property.squareFeet} sq ft</Text>
                </Column>
              </Row>
              <Row className="mt-3">
                <Column>
                  <Text className="text-sm text-gray-600">Bedrooms</Text>
                  <Text className="font-semibold">{property.bedrooms}</Text>
                </Column>
                <Column>
                  <Text className="text-sm text-gray-600">Bathrooms</Text>
                  <Text className="font-semibold">{property.bathrooms}</Text>
                </Column>
              </Row>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <Row>
                <Column>
                  <Text className="text-sm text-green-900">Expected ROI</Text>
                  <Text className="text-lg font-bold text-green-600">{property.expectedROI}</Text>
                </Column>
                <Column>
                  <Text className="text-sm text-green-900">Available Tokens</Text>
                  <Text className="text-lg font-bold text-green-600">{property.availableTokens}</Text>
                </Column>
              </Row>
            </div>
            
            <div className="text-center">
              <Button href={property.url} variant="primary">
                View Full Details
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <Section className="mb-6">
          <Text className="font-semibold text-gray-900 mb-3">Similar Properties You Might Like</Text>
          
          <div className="space-y-2">
            {similarProperties.map((prop, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                <Link href={prop.url} className="text-gray-900 hover:text-brand-primary no-underline">
                  {prop.title}
                </Link>
                <Text className="text-brand-primary font-semibold">{prop.price}</Text>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Hr className="my-6" />

      <Text className="text-xs text-gray-600 text-center">
        <Link href={manageAlertsUrl} className="text-brand-primary hover:underline">
          Manage your property alerts
        </Link>
        {' • '}
        You're receiving this because you set up property alerts for your criteria.
      </Text>
    </BaseEmailTemplate>
  )
}

/**
 * Investment Summary Email (Monthly)
 */
interface InvestmentSummaryProps {
  userName: string
  month: string
  portfolio: {
    totalValue: string
    monthlyChange: string
    changePercent: string
    isPositive: boolean
  }
  properties: Array<{
    title: string
    tokens: string
    currentValue: string
    monthlyIncome: string
    performance: string
  }>
  distributions: {
    total: string
    nextDate: string
  }
  recommendations: Array<{
    title: string
    reason: string
    url: string
  }>
  fullReportUrl: string
}

export function InvestmentSummaryEmail({
  userName,
  month,
  portfolio,
  properties,
  distributions,
  recommendations,
  fullReportUrl,
}: InvestmentSummaryProps) {
  return (
    <BaseEmailTemplate
      preview={`Your ${month} investment summary - Portfolio value: ${portfolio.totalValue}`}
      heading={`${month} Investment Summary 📈`}
    >
      <Text className="text-gray-700 mb-4">
        Hi {userName},
      </Text>

      <Text className="text-gray-700 mb-6">
        Here's your monthly investment summary for {month}. Your portfolio continues to grow with PropertyChain!
      </Text>

      {/* Portfolio Overview */}
      <Section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
        <Text className="font-semibold text-gray-900 mb-4">Portfolio Overview</Text>
        
        <div className="text-center mb-4">
          <Text className="text-3xl font-bold text-gray-900">{portfolio.totalValue}</Text>
          <Text className={`text-lg font-semibold ${portfolio.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {portfolio.isPositive ? '↑' : '↓'} {portfolio.monthlyChange} ({portfolio.changePercent})
          </Text>
        </div>
        
        <Hr className="my-4" />
        
        <Row>
          <Column>
            <Text className="text-sm text-gray-600">Total Distributions</Text>
            <Text className="font-bold text-gray-900">{distributions.total}</Text>
          </Column>
          <Column>
            <Text className="text-sm text-gray-600">Next Distribution</Text>
            <Text className="font-bold text-gray-900">{distributions.nextDate}</Text>
          </Column>
        </Row>
      </Section>

      {/* Property Performance */}
      <Section className="mb-6">
        <Text className="font-semibold text-gray-900 mb-4">Property Performance</Text>
        
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Property</th>
                <th className="text-right p-3 text-sm font-semibold text-gray-900">Value</th>
                <th className="text-right p-3 text-sm font-semibold text-gray-900">Income</th>
                <th className="text-right p-3 text-sm font-semibold text-gray-900">Performance</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="p-3">
                    <Text className="font-medium text-gray-900">{property.title}</Text>
                    <Text className="text-xs text-gray-600">{property.tokens} tokens</Text>
                  </td>
                  <td className="text-right p-3">
                    <Text className="text-gray-900">{property.currentValue}</Text>
                  </td>
                  <td className="text-right p-3">
                    <Text className="text-gray-900">{property.monthlyIncome}</Text>
                  </td>
                  <td className="text-right p-3">
                    <Text className={property.performance.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                      {property.performance}
                    </Text>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Section className="mb-6">
          <Text className="font-semibold text-gray-900 mb-4">Recommended for You</Text>
          
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <Link href={rec.url} className="font-medium text-gray-900 hover:text-brand-primary no-underline">
                  {rec.title}
                </Link>
                <Text className="text-sm text-gray-600 mt-1">{rec.reason}</Text>
              </div>
            ))}
          </div>
        </Section>
      )}

      <div className="text-center">
        <Button href={fullReportUrl} variant="primary">
          View Full Report
        </Button>
      </div>
    </BaseEmailTemplate>
  )
}