/**
 * Email Preview Page - PropertyChain
 * 
 * Development tool for previewing email templates
 * Following UpdatedUIPlan.md Step 63 specifications and CLAUDE.md principles
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Email template configurations
const EMAIL_TEMPLATES = {
  welcome: {
    name: 'Welcome Email',
    category: 'Onboarding',
    data: {
      userName: 'John Doe',
      userEmail: 'john@example.com',
      verificationUrl: 'https://propertychain.com/verify?token=abc123',
      dashboardUrl: 'https://propertychain.com/dashboard',
      helpUrl: 'https://propertychain.com/help',
    },
  },
  purchaseConfirmation: {
    name: 'Purchase Confirmation',
    category: 'Transactions',
    data: {
      userName: 'John Doe',
      propertyTitle: 'Luxury Apartment in Manhattan',
      propertyAddress: '123 5th Avenue, New York, NY 10001',
      transactionId: 'TXN-2024-001234',
      purchaseAmount: '$50,000',
      tokenAmount: '500',
      transactionHash: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7',
      purchaseDate: 'January 15, 2024',
      propertyUrl: 'https://propertychain.com/properties/123',
      receiptUrl: 'https://propertychain.com/receipts/TXN-2024-001234',
    },
  },
  rentalDistribution: {
    name: 'Rental Distribution',
    category: 'Transactions',
    data: {
      userName: 'John Doe',
      distributionPeriod: 'January 2024',
      properties: [
        {
          title: 'Manhattan Apartment',
          tokens: '500',
          distribution: '$250',
        },
        {
          title: 'Brooklyn Townhouse',
          tokens: '300',
          distribution: '$180',
        },
      ],
      totalDistribution: '$430',
      paymentMethod: 'Bank Transfer',
      paymentDate: 'February 1, 2024',
      nextDistributionDate: 'March 1, 2024',
      statementUrl: 'https://propertychain.com/statements/2024-01',
    },
  },
  weeklyNewsletter: {
    name: 'Weekly Newsletter',
    category: 'Marketing',
    data: {
      userName: 'John',
      weekNumber: '3',
      featuredProperties: [
        {
          id: '1',
          title: 'Modern Condo in Miami',
          image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
          price: '$350,000',
          location: 'Miami, FL',
          roi: '8.5%',
          url: 'https://propertychain.com/properties/1',
        },
        {
          id: '2',
          title: 'Beachfront Villa',
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
          price: '$750,000',
          location: 'Malibu, CA',
          roi: '7.2%',
          url: 'https://propertychain.com/properties/2',
        },
      ],
      marketInsights: {
        totalVolume: '$12.5M',
        activeInvestors: '2,847',
        averageROI: '7.8%',
        trendDirection: 'up' as const,
      },
      educationalContent: {
        title: 'Understanding Property Tokenization',
        description: 'Learn how blockchain technology is revolutionizing real estate investment...',
        url: 'https://propertychain.com/learn/tokenization',
      },
      unsubscribeUrl: 'https://propertychain.com/unsubscribe',
    },
  },
} as const

export default function EmailPreviewPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof EMAIL_TEMPLATES>('welcome')
  const [iframeKey, setIframeKey] = useState(0)

  const currentTemplate = EMAIL_TEMPLATES[selectedTemplate]

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value as keyof typeof EMAIL_TEMPLATES)
    // Force iframe refresh
    setIframeKey(prev => prev + 1)
  }

  const handleSendTest = async () => {
    // In development, this would send a test email
    console.log('Sending test email:', selectedTemplate)
    alert('Test email functionality not implemented in preview mode')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Email Template Preview</h1>
        <p className="text-gray-600">
          Preview and test email templates in development mode
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Template Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Email Template
                </label>
                <Select
                  value={selectedTemplate}
                  onValueChange={handleTemplateChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(EMAIL_TEMPLATES).map(([key, template]) => (
                      <SelectItem key={key} value={key}>
                        {template.name} ({template.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Template Info</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>{' '}
                    <span className="font-medium">{currentTemplate.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Category:</span>{' '}
                    <span className="font-medium">{currentTemplate.category}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Test Data</h3>
                <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-auto max-h-64">
                  {JSON.stringify(currentTemplate.data, null, 2)}
                </pre>
              </div>

              <Button
                onClick={handleSendTest}
                className="w-full"
                variant="outline"
              >
                Send Test Email
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Email Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="desktop" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="desktop">Desktop</TabsTrigger>
                  <TabsTrigger value="mobile">Mobile</TabsTrigger>
                </TabsList>
                
                <TabsContent value="desktop" className="mt-4">
                  <div className="border rounded-lg bg-gray-50 p-4">
                    <iframe
                      key={`desktop-${iframeKey}`}
                      src={`/api/email/preview?template=${selectedTemplate}`}
                      className="w-full h-[600px] bg-white rounded-lg shadow-sm"
                      title="Email Preview - Desktop"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="mobile" className="mt-4">
                  <div className="flex justify-center">
                    <div className="border-8 border-gray-800 rounded-3xl overflow-hidden shadow-xl">
                      <div className="bg-gray-800 h-6 flex items-center justify-center">
                        <div className="w-20 h-1 bg-gray-600 rounded-full" />
                      </div>
                      <iframe
                        key={`mobile-${iframeKey}`}
                        src={`/api/email/preview?template=${selectedTemplate}`}
                        className="w-[375px] h-[667px] bg-white"
                        title="Email Preview - Mobile"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}