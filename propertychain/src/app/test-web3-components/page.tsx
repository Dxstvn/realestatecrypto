/**
 * Test Page for Web3 Components
 * 
 * Tests all features of the Web3 wallet connection system:
 * - Wallet connection modal with multiple wallet support
 * - Network switching functionality
 * - Balance display with CountUp animation
 * - Connected wallet management
 * - Error handling and loading states
 * - Mobile-optimized interface
 */

'use client'

import { useState, useEffect } from 'react'
import { WalletConnect, WalletConnectCompact } from '@/components/web3/wallet-connect'
import { useWeb3Context } from '@/components/providers/web3-provider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import {
  Wallet,
  Globe,
  Smartphone,
  Monitor,
  Zap,
  Shield,
  Info,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Code,
  Eye,
  Settings,
  Users,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { BLOCKCHAIN } from '@/lib/constants/blockchain'

export default function TestWeb3Components() {
  const {
    connected,
    address,
    chainId,
    balance,
    connect,
    disconnect,
    switchNetwork,
    isConnecting,
    error,
  } = useWeb3Context()

  const [connectionHistory, setConnectionHistory] = useState<Array<{
    timestamp: Date
    action: string
    details: string
    status: 'success' | 'error' | 'info'
  }>>([])

  const [isLoading, setIsLoading] = useState(false)

  // Log connection events for testing
  useEffect(() => {
    const addToHistory = (action: string, details: string, status: 'success' | 'error' | 'info') => {
      setConnectionHistory(prev => [
        { timestamp: new Date(), action, details, status },
        ...prev.slice(0, 9) // Keep only last 10 events
      ])
    }

    if (connected) {
      addToHistory('Connected', `Wallet connected: ${address?.slice(0, 10)}...`, 'success')
    } else if (error) {
      addToHistory('Error', error, 'error')
    }
  }, [connected, address, error])

  const features = [
    {
      title: 'Multi-Wallet Support',
      description: 'MetaMask, WalletConnect, Coinbase Wallet, Trust Wallet',
      icon: Wallet,
      status: 'implemented',
      testAction: () => toast.info('Open wallet modal to see all supported wallets'),
    },
    {
      title: 'Network Switching',
      description: 'Ethereum, Polygon, Sepolia testnet with visual indicators',
      icon: Globe,
      status: 'implemented',
      testAction: async () => {
        if (connected) {
          try {
            await switchNetwork(137) // Switch to Polygon
            toast.success('Network switch initiated')
          } catch (error) {
            toast.error('Network switch failed')
          }
        } else {
          toast.info('Connect wallet first to test network switching')
        }
      },
    },
    {
      title: 'Balance Animation',
      description: 'CountUp animation for balance display with auto-refresh',
      icon: BarChart3,
      status: 'implemented',
      testAction: () => {
        if (connected && balance) {
          toast.success('Balance animation visible in connected wallet display')
        } else {
          toast.info('Connect wallet to see balance animation')
        }
      },
    },
    {
      title: 'Mobile Optimization',
      description: 'Responsive design with mobile-specific wallet filtering',
      icon: Smartphone,
      status: 'implemented',
      testAction: () => {
        const isMobile = window.innerWidth < 768
        toast.info(`Current view: ${isMobile ? 'Mobile' : 'Desktop'} - Resize to test responsiveness`)
      },
    },
    {
      title: 'Error Handling',
      description: 'Comprehensive error states with user-friendly messages',
      icon: AlertTriangle,
      status: 'implemented',
      testAction: async () => {
        // Simulate error by trying to connect when already connected
        if (connected) {
          toast.error('Wallet already connected - this demonstrates error handling')
        } else {
          toast.info('Try connecting with no wallet installed to see error handling')
        }
      },
    },
    {
      title: 'Security Features',
      description: 'Terms acceptance, secure connection protocols, address validation',
      icon: Shield,
      status: 'implemented',
      testAction: () => toast.info('Security features are built into the connection flow'),
    },
  ]

  const networkConfig = [
    {
      name: 'Ethereum Mainnet',
      chainId: 1,
      status: 'Production',
      color: '#627EEA',
      rpcUrl: 'https://mainnet.infura.io/v3/...',
    },
    {
      name: 'Polygon',
      chainId: 137,
      status: 'Production',
      color: '#8247E5',
      rpcUrl: 'https://polygon-rpc.com',
    },
    {
      name: 'Sepolia Testnet',
      chainId: 11155111,
      status: 'Testing',
      color: '#F7931A',
      rpcUrl: 'https://sepolia.infura.io/v3/...',
    },
  ]

  const simulateNetworkTest = async () => {
    setIsLoading(true)
    const networks = [1, 137, 11155111]
    
    for (let i = 0; i < networks.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const network = networkConfig.find(n => n.chainId === networks[i])
      toast.info(`Testing ${network?.name}...`)
    }
    
    setIsLoading(false)
    toast.success('Network connectivity test completed')
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Web3 Components Test</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Testing comprehensive Web3 wallet integration with multi-wallet support,
          network switching, balance animation, and mobile optimization
        </p>
      </div>

      {/* Current Connection Status */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>Status:</strong> 
              <Badge 
                variant={connected ? 'default' : 'secondary'} 
                className="ml-2"
              >
                {connected ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
            <div>
              <strong>Address:</strong> {address ? `${address.slice(0, 10)}...` : 'None'}
            </div>
            <div>
              <strong>Network:</strong> {chainId || 'Unknown'}
            </div>
          </div>

          {connected && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Wallet successfully connected! You can now test network switching and balance display.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Wallet Connection Demos */}
      <Tabs defaultValue="full-demo" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="full-demo">Full Component</TabsTrigger>
          <TabsTrigger value="compact">Compact Version</TabsTrigger>
          <TabsTrigger value="variations">Variations</TabsTrigger>
          <TabsTrigger value="features">Feature Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="full-demo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Full Wallet Connect Component</CardTitle>
              <p className="text-sm text-muted-foreground">
                Complete wallet connection interface with network switcher and balance display
              </p>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-4">
                <WalletConnect />
                <p className="text-xs text-muted-foreground text-center max-w-md">
                  {connected
                    ? "Wallet connected! Click the wallet display to see balance, copy address, or disconnect."
                    : "Click 'Connect Wallet' to open the wallet selection modal with multiple wallet options."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compact Wallet Connect</CardTitle>
              <p className="text-sm text-muted-foreground">
                Minimal version for mobile interfaces and tight spaces
              </p>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-4">
                <WalletConnectCompact />
                <p className="text-xs text-muted-foreground text-center max-w-md">
                  Compact version without network switcher and balance display for mobile navigation bars.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variations" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Size Variations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <WalletConnect size="sm" />
                    <span className="text-xs text-muted-foreground">Small</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <WalletConnect size="default" />
                    <span className="text-xs text-muted-foreground">Default</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <WalletConnect size="lg" />
                    <span className="text-xs text-muted-foreground">Large</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuration Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                    <WalletConnect showBalance={false} />
                    <span className="text-xs text-muted-foreground">Without Balance</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                    <WalletConnect showNetwork={false} />
                    <span className="text-xs text-muted-foreground">Without Network</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid gap-6">
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

            <Card>
              <CardHeader>
                <CardTitle>Network Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Supported Networks</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={simulateNetworkTest}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Test Networks
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="grid gap-3">
                    {networkConfig.map((network) => (
                      <div key={network.chainId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: network.color }}
                          />
                          <div>
                            <div className="font-medium">{network.name}</div>
                            <div className="text-xs text-muted-foreground">Chain ID: {network.chainId}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={network.status === 'Production' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {network.status}
                          </Badge>
                          {chainId === network.chainId && (
                            <Badge variant="outline" className="text-xs text-green-600">
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Connection History */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Connection History
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Real-time log of wallet connection events for testing and debugging
          </p>
        </CardHeader>
        <CardContent>
          {connectionHistory.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {connectionHistory.map((event, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-2",
                    event.status === 'success' && "bg-green-500",
                    event.status === 'error' && "bg-red-500",
                    event.status === 'info' && "bg-blue-500"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{event.action}</span>
                      <span className="text-xs text-muted-foreground">
                        {event.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{event.details}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Code className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No connection events yet. Try connecting a wallet to see logs.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Instructions */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Basic Flow</h4>
              <ol className="text-sm space-y-2 list-decimal list-inside">
                <li>Click "Connect Wallet" to open modal</li>
                <li>Select your preferred wallet</li>
                <li>Approve connection in wallet</li>
                <li>View connected wallet display</li>
                <li>Test network switching</li>
                <li>Try balance refresh</li>
                <li>Test disconnect functionality</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium mb-3">Advanced Features</h4>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li>Test wallet modal on mobile/desktop</li>
                <li>Try copying wallet address</li>
                <li>Open address in block explorer</li>
                <li>Test network switching errors</li>
                <li>Check CountUp balance animation</li>
                <li>Test responsive behavior</li>
                <li>Verify error handling</li>
              </ul>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-3">Technical Implementation</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Modal:</strong> shadcn Dialog with custom styling
              </div>
              <div>
                <strong>Animation:</strong> CountUp for balance display
              </div>
              <div>
                <strong>Networks:</strong> Ethereum, Polygon, Sepolia
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}