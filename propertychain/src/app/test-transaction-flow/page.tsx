/**
 * Test Page for Transaction Flow Components
 * 
 * Tests all features of the transaction flow system:
 * - Multi-step transaction modal with tabs
 * - Investment review and amount selection
 * - Gas estimation with network status
 * - Confirmation with agreements and validation
 * - Progress tracking during processing
 * - Success celebration with confetti animation
 * - Mobile-optimized responsive design
 */

'use client'

import { useState, useEffect } from 'react'
import {
  TransactionModal,
  InvestmentButton,
  type PropertyInvestment,
  TRANSACTION_STEPS,
} from '@/components/web3/transaction-modal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Building,
  DollarSign,
  TrendingUp,
  MapPin,
  Wallet,
  Fuel,
  Shield,
  Clock,
  CheckCircle,
  Info,
  Eye,
  Settings,
  BarChart3,
  Users,
  Star,
  Award,
  Zap,
  RefreshCw,
  PlayCircle,
  StopCircle,
  Activity,
  Target,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useWeb3Context } from '@/components/providers/web3-provider'

// Mock property investment data
const SAMPLE_PROPERTIES: PropertyInvestment[] = [
  {
    id: 'prop-1',
    name: 'Marina Bay Towers',
    address: '123 Marina Bay, Singapore',
    image: '/properties/marina-bay.jpg',
    tokenPrice: 100,
    totalTokens: 50000,
    availableTokens: 15000,
    minimumInvestment: 1000,
    expectedReturn: '12.5% APY',
    propertyValue: 5000000,
    investmentAmount: 5000,
    tokensToReceive: 50,
    description: 'Luxury waterfront property with premium amenities and high rental yield',
    features: ['Waterfront', 'Pool', 'Gym', 'Concierge', 'Parking'],
  },
  {
    id: 'prop-2',
    name: 'Downtown Office Complex',
    address: '456 Business District, NYC',
    image: '/properties/downtown-office.jpg',
    tokenPrice: 250,
    totalTokens: 20000,
    availableTokens: 8000,
    minimumInvestment: 2500,
    expectedReturn: '15.2% APY',
    propertyValue: 8000000,
    investmentAmount: 10000,
    tokensToReceive: 40,
    description: 'Prime commercial real estate in the heart of Manhattan',
    features: ['Central Location', 'High Occupancy', 'Modern', 'Transit Access'],
  },
  {
    id: 'prop-3',
    name: 'Suburban Retail Plaza',
    address: '789 Suburban Ave, Austin, TX',
    image: '/properties/retail-plaza.jpg',
    tokenPrice: 50,
    totalTokens: 80000,
    availableTokens: 25000,
    minimumInvestment: 500,
    expectedReturn: '9.8% APY',
    propertyValue: 3200000,
    investmentAmount: 2500,
    tokensToReceive: 50,
    description: 'Well-established retail center with stable long-term tenants',
    features: ['Anchor Tenants', 'Parking', 'Growing Area', 'Stable Income'],
  },
]

export default function TestTransactionFlow() {
  const { connected, address } = useWeb3Context()
  const [selectedProperty, setSelectedProperty] = useState<PropertyInvestment>(SAMPLE_PROPERTIES[0])
  const [modalOpen, setModalOpen] = useState(false)
  const [completedTransactions, setCompletedTransactions] = useState<Array<{
    property: string
    amount: number
    txHash: string
    timestamp: Date
  }>>([])
  
  const [transactionStats, setTransactionStats] = useState({
    totalInvestments: 0,
    totalValue: 0,
    successRate: 100,
    avgGasFee: 0.003,
  })

  const features = [
    {
      title: 'Multi-Step Flow',
      description: 'Review → Gas → Confirm → Process → Success',
      icon: Target,
      status: 'implemented',
      testAction: () => setModalOpen(true),
    },
    {
      title: 'Gas Estimation',
      description: 'Real-time network fees and congestion monitoring',
      icon: Fuel,
      status: 'implemented',
      testAction: () => toast.info('Gas estimation updates automatically during transaction'),
    },
    {
      title: 'Smart Validation',
      description: 'Multi-level confirmation with agreements and codes',
      icon: Shield,
      status: 'implemented',
      testAction: () => toast.info('Confirmation step includes multiple safety checks'),
    },
    {
      title: 'Progress Tracking',
      description: 'Real-time transaction status with block confirmations',
      icon: Activity,
      status: 'implemented',
      testAction: () => toast.info('Transaction progress tracked through all network steps'),
    },
    {
      title: 'Success Animation',
      description: 'Confetti celebration with transaction details',
      icon: Award,
      status: 'implemented',
      testAction: () => toast.info('Complete a transaction to see the celebration animation!'),
    },
    {
      title: 'Mobile Optimized',
      description: 'Responsive design with touch-friendly controls',
      icon: Eye,
      status: 'implemented',
      testAction: () => {
        const isMobile = window.innerWidth < 768
        toast.info(`Current view: ${isMobile ? 'Mobile' : 'Desktop'} - Resize to test`)
      },
    },
  ]

  const handleTransactionComplete = (investment: PropertyInvestment, txHash: string) => {
    setCompletedTransactions(prev => [
      {
        property: investment.name,
        amount: investment.investmentAmount,
        txHash,
        timestamp: new Date(),
      },
      ...prev.slice(0, 9) // Keep only last 10
    ])

    setTransactionStats(prev => ({
      totalInvestments: prev.totalInvestments + 1,
      totalValue: prev.totalValue + investment.investmentAmount,
      successRate: 100, // Mock - in production this would be calculated
      avgGasFee: prev.avgGasFee, // Mock - would be updated with real data
    }))

    toast.success(`Successfully invested $${investment.investmentAmount.toLocaleString()} in ${investment.name}!`)
  }

  const updatePropertyAmount = (amount: number) => {
    setSelectedProperty(prev => ({
      ...prev,
      investmentAmount: amount,
      tokensToReceive: Math.floor(amount / prev.tokenPrice),
    }))
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Transaction Flow Test</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Testing comprehensive transaction flow with multi-step confirmation,
          gas estimation, progress tracking, and success celebration
        </p>
        {!connected && (
          <Alert className="max-w-md mx-auto">
            <Wallet className="h-4 w-4" />
            <AlertDescription>
              Connect your wallet to test the transaction flow with real Web3 integration.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Transaction Statistics */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Transaction Statistics (Demo Session)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{transactionStats.totalInvestments}</div>
              <div className="text-sm text-muted-foreground">Investments</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">${transactionStats.totalValue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Value</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">{transactionStats.successRate}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">{transactionStats.avgGasFee.toFixed(4)} ETH</div>
              <div className="text-sm text-muted-foreground">Avg Gas Fee</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Test Interface */}
      <Tabs defaultValue="live-demo" className="max-w-6xl mx-auto">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="live-demo">Live Demo</TabsTrigger>
          <TabsTrigger value="properties">Test Properties</TabsTrigger>
          <TabsTrigger value="features">Feature Tests</TabsTrigger>
          <TabsTrigger value="flow-steps">Flow Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="live-demo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Transaction Flow</CardTitle>
              <p className="text-sm text-muted-foreground">
                Complete transaction flow from property selection to success celebration
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Property Selection */}
              <div>
                <h3 className="font-medium mb-3">Select Property for Investment</h3>
                <div className="grid gap-4">
                  {SAMPLE_PROPERTIES.map((property) => (
                    <div
                      key={property.id}
                      className={cn(
                        "p-4 border rounded-lg cursor-pointer transition-all",
                        selectedProperty.id === property.id 
                          ? "border-blue-500 bg-blue-50" 
                          : "hover:border-gray-300"
                      )}
                      onClick={() => setSelectedProperty(property)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                          <Building className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{property.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {property.address}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">{property.expectedReturn}</div>
                          <div className="text-sm text-muted-foreground">${property.tokenPrice}/token</div>
                        </div>
                        {selectedProperty.id === property.id && (
                          <CheckCircle className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investment Amount Customization */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="investment-amount">Investment Amount ($)</Label>
                    <Input
                      id="investment-amount"
                      type="number"
                      value={selectedProperty.investmentAmount}
                      onChange={(e) => updatePropertyAmount(parseInt(e.target.value) || 0)}
                      min={selectedProperty.minimumInvestment}
                      max={selectedProperty.availableTokens * selectedProperty.tokenPrice}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Min: ${selectedProperty.minimumInvestment.toLocaleString()} | 
                      Max: ${(selectedProperty.availableTokens * selectedProperty.tokenPrice).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label>Tokens to Receive</Label>
                    <div className="h-10 px-3 py-2 bg-gray-100 border rounded-md flex items-center justify-between">
                      <span className="font-medium">{selectedProperty.tokensToReceive.toLocaleString()}</span>
                      <Badge variant="secondary">
                        {((selectedProperty.tokensToReceive / selectedProperty.totalTokens) * 100).toFixed(4)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Trigger */}
              <div className="flex flex-col items-center gap-4">
                <Button
                  onClick={() => setModalOpen(true)}
                  className="bg-[#007BFF] hover:bg-[#0062CC] h-12 px-8 text-lg font-semibold"
                  disabled={!connected}
                >
                  <DollarSign className="h-5 w-5 mr-2" />
                  Start Investment Flow
                </Button>
                {!connected && (
                  <p className="text-sm text-muted-foreground text-center">
                    Connect your wallet first to enable the investment flow
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Test Properties</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Each property has different investment parameters for testing various scenarios
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {SAMPLE_PROPERTIES.map((property) => (
                    <Card key={property.id} className="p-4">
                      <div className="space-y-3">
                        <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                          <Building className="h-12 w-12 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{property.name}</h3>
                          <p className="text-sm text-muted-foreground">{property.address}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Token Price:</span>
                            <div className="font-semibold">${property.tokenPrice}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Min Investment:</span>
                            <div className="font-semibold">${property.minimumInvestment.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Expected Return:</span>
                            <div className="font-semibold text-green-600">{property.expectedReturn}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Available:</span>
                            <div className="font-semibold">{property.availableTokens.toLocaleString()}</div>
                          </div>
                        </div>
                        <InvestmentButton 
                          investment={property}
                          className="w-full h-8 text-sm"
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Implementation Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-3 p-4 border rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-2">{feature.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          ✓ Complete
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-6"
                          onClick={feature.testAction}
                        >
                          Test Feature
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flow-steps" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Flow Analysis</CardTitle>
              <p className="text-sm text-muted-foreground">
                Step-by-step breakdown of the transaction process
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(TRANSACTION_STEPS).map(([key, step], index) => {
                  const Icon = step.icon
                  return (
                    <div key={key} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold">{step.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {key}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                        
                        {/* Step-specific details */}
                        <div className="mt-2 text-xs text-muted-foreground">
                          {key === 'review' && '• Property details • Investment amount • Token calculation • Ownership percentage'}
                          {key === 'gas' && '• Network congestion • Gas estimation • Fee breakdown • Refresh capability'}
                          {key === 'confirm' && '• Terms agreement • Risk acknowledgment • Confirmation code • Final review'}
                          {key === 'processing' && '• Progress tracking • Transaction hash • Block confirmations • Real-time updates'}
                          {key === 'success' && '• Confetti animation • Transaction details • Portfolio update • Next steps'}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Transactions Log */}
      {completedTransactions.length > 0 && (
        <Card className="max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Test Transactions
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Successfully completed transactions during this test session
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {completedTransactions.map((tx, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{tx.property}</div>
                    <div className="text-xs text-muted-foreground">
                      ${tx.amount.toLocaleString()} • {tx.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="text-xs font-mono bg-white px-2 py-1 rounded border">
                    {tx.txHash.slice(0, 10)}...
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Instructions */}
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Basic Transaction Flow</h4>
              <ol className="text-sm space-y-2 list-decimal list-inside">
                <li>Select a test property from the available options</li>
                <li>Customize investment amount (respect min/max limits)</li>
                <li>Click "Start Investment Flow" to open modal</li>
                <li>Navigate through each step using tabs or Next button</li>
                <li>Complete all requirements in confirmation step</li>
                <li>Watch progress tracking during processing</li>
                <li>Enjoy the confetti celebration on success!</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium mb-3">Advanced Features</h4>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li>Test gas estimation refresh functionality</li>
                <li>Try different investment amounts and properties</li>
                <li>Test mobile responsiveness and touch controls</li>
                <li>Verify all validation and safety checks</li>
                <li>Check progress tracking and transaction details</li>
                <li>Test error handling and edge cases</li>
                <li>Validate confetti animation and success flow</li>
              </ul>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-3">Technical Implementation</h4>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div>
                <strong>Modal:</strong> shadcn Dialog with multi-step tabs
              </div>
              <div>
                <strong>Animation:</strong> Framer Motion + React Confetti
              </div>
              <div>
                <strong>Validation:</strong> Multi-level confirmations
              </div>
              <div>
                <strong>Progress:</strong> Real-time transaction tracking
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Modal */}
      <TransactionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        investment={selectedProperty}
        onComplete={handleTransactionComplete}
      />
    </div>
  )
}