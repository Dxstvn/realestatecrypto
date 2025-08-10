/**
 * Network Manager Component - PropertyChain
 * 
 * Blockchain network management and switching functionality
 * Following UpdatedUIPlan.md Step 47 specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Globe,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Info,
  Settings,
  RefreshCw,
  Zap,
  Activity,
  Shield,
  Link,
  Unlink,
  ChevronRight,
  ExternalLink,
  Copy,
  Plus,
  Edit,
  Trash,
  Database,
  Server,
  Cloud,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  TrendingUp,
  TrendingDown,
  Clock,
  Hash,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useToast } from '@/hooks/use-toast'
import { useWeb3 } from './web3-provider-enhanced'

// Types
interface NetworkConfig {
  chainId: number
  name: string
  symbol: string
  rpcUrl: string
  blockExplorer: string
  isTestnet: boolean
  isCustom?: boolean
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  stats?: {
    blockHeight: number
    gasPrice: string
    blockTime: number
    tps: number
  }
}

interface NetworkStats {
  latency: number
  blockHeight: number
  gasPrice: string
  congestion: 'low' | 'medium' | 'high'
  status: 'online' | 'degraded' | 'offline'
}

// Default networks
const DEFAULT_NETWORKS: NetworkConfig[] = [
  {
    chainId: 1,
    name: 'Ethereum Mainnet',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    blockExplorer: 'https://etherscan.io',
    isTestnet: false,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  {
    chainId: 137,
    name: 'Polygon',
    symbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    isTestnet: false,
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
  {
    chainId: 42161,
    name: 'Arbitrum One',
    symbol: 'ETH',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io',
    isTestnet: false,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  {
    chainId: 10,
    name: 'Optimism',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.optimism.io',
    blockExplorer: 'https://optimistic.etherscan.io',
    isTestnet: false,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    symbol: 'ETH',
    rpcUrl: 'https://sepolia.infura.io/v3/',
    blockExplorer: 'https://sepolia.etherscan.io',
    isTestnet: true,
    nativeCurrency: {
      name: 'Sepolia ETH',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  {
    chainId: 80001,
    name: 'Mumbai Testnet',
    symbol: 'MATIC',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    blockExplorer: 'https://mumbai.polygonscan.com',
    isTestnet: true,
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
]

export function NetworkManager() {
  const { 
    chainId, 
    network, 
    switchNetwork, 
    isCorrectNetwork,
    isConnected 
  } = useWeb3()
  const { toast } = useToast()
  
  const [showNetworkModal, setShowNetworkModal] = useState(false)
  const [showTestnets, setShowTestnets] = useState(false)
  const [customNetworks, setCustomNetworks] = useState<NetworkConfig[]>([])
  const [networkStats, setNetworkStats] = useState<Record<number, NetworkStats>>({})
  const [isAddingCustom, setIsAddingCustom] = useState(false)
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkConfig | null>(null)
  const [isSwitching, setIsSwitching] = useState(false)

  // Fetch network stats
  useEffect(() => {
    const fetchStats = async () => {
      // Mock network stats
      const stats: Record<number, NetworkStats> = {}
      
      DEFAULT_NETWORKS.forEach(net => {
        stats[net.chainId] = {
          latency: Math.floor(Math.random() * 100) + 50,
          blockHeight: Math.floor(Math.random() * 1000000) + 15000000,
          gasPrice: (Math.random() * 50 + 20).toFixed(2),
          congestion: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
          status: 'online',
        }
      })
      
      setNetworkStats(stats)
    }

    fetchStats()
    const interval = setInterval(fetchStats, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  // All available networks
  const allNetworks = [...DEFAULT_NETWORKS, ...customNetworks]
  const displayNetworks = showTestnets 
    ? allNetworks 
    : allNetworks.filter(n => !n.isTestnet)

  // Handle network switch
  const handleNetworkSwitch = async (targetNetwork: NetworkConfig) => {
    if (targetNetwork.chainId === chainId) {
      toast({
        title: 'Already connected',
        description: `You are already on ${targetNetwork.name}`,
      })
      return
    }

    setIsSwitching(true)
    try {
      await switchNetwork(targetNetwork.chainId)
      setShowNetworkModal(false)
      toast({
        title: 'Network switched',
        description: `Successfully switched to ${targetNetwork.name}`,
      })
    } catch (error) {
      toast({
        title: 'Switch failed',
        description: 'Could not switch to the selected network',
        variant: 'destructive',
      })
    } finally {
      setIsSwitching(false)
    }
  }

  // Get congestion color
  const getCongestionColor = (congestion: string) => {
    switch (congestion) {
      case 'low':
        return 'text-[#4CAF50]'
      case 'medium':
        return 'text-[#FF6347]'
      case 'high':
        return 'text-[#DC3545]'
      default:
        return 'text-[#9E9E9E]'
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-[#4CAF50]'
      case 'degraded':
        return 'bg-[#FF6347]'
      case 'offline':
        return 'bg-[#DC3545]'
      default:
        return 'bg-[#9E9E9E]'
    }
  }

  if (!isConnected) {
    return null
  }

  return (
    <>
      {/* Network Status Banner */}
      {!isCorrectNetwork && (
        <Alert className="mb-4 border-[#FFCC80] bg-[#FFF3E0]">
          <AlertTriangle className="h-4 w-4 text-[#FF6347]" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-[#F57C00]">
              You are connected to an unsupported network. Please switch to a supported network.
            </span>
            <Button 
              size="sm" 
              onClick={() => setShowNetworkModal(true)}
              className="bg-[#007BFF] hover:bg-[#0062CC]"
            >
              Switch Network
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Network Selector Button */}
      <Button
        variant="outline"
        onClick={() => setShowNetworkModal(true)}
        className={cn(
          "h-10",
          !isCorrectNetwork && "border-[#FF6347] text-[#FF6347]"
        )}
      >
        <div className="flex items-center gap-2">
          {network ? (
            <>
              <div className={cn("w-2 h-2 rounded-full", getStatusColor('online'))} />
              <span className="font-medium">{network.name}</span>
              {network.isTestnet && (
                <Badge variant="outline" className="text-xs">Testnet</Badge>
              )}
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              <span>Unknown Network</span>
            </>
          )}
        </div>
      </Button>

      {/* Network Selection Modal */}
      <Dialog open={showNetworkModal} onOpenChange={setShowNetworkModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Network</DialogTitle>
            <DialogDescription>
              Choose a blockchain network to connect to
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Testnet Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#F5F5F5]">
              <Label htmlFor="testnet-toggle" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#757575]" />
                  <span>Show Testnets</span>
                </div>
              </Label>
              <Switch
                id="testnet-toggle"
                checked={showTestnets}
                onCheckedChange={setShowTestnets}
              />
            </div>

            {/* Network List */}
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {displayNetworks.map((net) => {
                  const stats = networkStats[net.chainId]
                  const isActive = net.chainId === chainId
                  
                  return (
                    <button
                      key={net.chainId}
                      onClick={() => handleNetworkSwitch(net)}
                      disabled={isSwitching || isActive}
                      className={cn(
                        "w-full p-4 rounded-lg border transition-all text-left",
                        isActive 
                          ? "border-[#007BFF] bg-[#E6F2FF]" 
                          : "hover:bg-[#F5F5F5] border-[#E0E0E0]",
                        isSwitching && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            isActive ? "bg-[#007BFF]" : "bg-[#F5F5F5]"
                          )}>
                            <Globe className={cn(
                              "h-5 w-5",
                              isActive ? "text-white" : "text-[#757575]"
                            )} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{net.name}</p>
                              {net.isTestnet && (
                                <Badge variant="outline" className="text-xs">Testnet</Badge>
                              )}
                              {net.isCustom && (
                                <Badge variant="outline" className="text-xs">Custom</Badge>
                              )}
                              {isActive && (
                                <Badge className="text-xs bg-[#007BFF]">Connected</Badge>
                              )}
                            </div>
                            <p className="text-sm text-[#9E9E9E] mt-1">
                              Chain ID: {net.chainId} • {net.symbol}
                            </p>
                            {stats && (
                              <div className="flex items-center gap-4 mt-2 text-xs">
                                <div className="flex items-center gap-1">
                                  <Activity className="h-3 w-3 text-[#9E9E9E]" />
                                  <span>{stats.latency}ms</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Zap className="h-3 w-3 text-[#9E9E9E]" />
                                  <span>{stats.gasPrice} Gwei</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Server className="h-3 w-3 text-[#9E9E9E]" />
                                  <span className={getCongestionColor(stats.congestion)}>
                                    {stats.congestion} congestion
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        {!isActive && (
                          <ChevronRight className="h-5 w-5 text-[#9E9E9E] mt-2" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </ScrollArea>

            {/* Add Custom Network */}
            <Button
              variant="outline"
              onClick={() => setIsAddingCustom(true)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Network
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Custom Network Dialog */}
      <Dialog open={isAddingCustom} onOpenChange={setIsAddingCustom}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Network</DialogTitle>
            <DialogDescription>
              Add a custom RPC network configuration
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert className="border-[#99C2FF] bg-[#E6F2FF]">
              <Info className="h-4 w-4 text-[#007BFF]" />
              <AlertDescription className="text-[#003166]">
                Only add custom networks from trusted sources. Malicious networks can steal your funds.
              </AlertDescription>
            </Alert>

            {/* Custom network form would go here */}
            <p className="text-sm text-[#9E9E9E] text-center py-8">
              Custom network configuration form
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingCustom(false)}>
              Cancel
            </Button>
            <Button className="bg-[#007BFF] hover:bg-[#0062CC]">
              Add Network
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Network Status Widget
export function NetworkStatusWidget() {
  const { network, chainId, isCorrectNetwork } = useWeb3()
  const [blockHeight, setBlockHeight] = useState<number>(0)
  const [gasPrice, setGasPrice] = useState<string>('0')
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    // Mock block height updates
    const interval = setInterval(() => {
      setBlockHeight(prev => prev + 1)
      setGasPrice((Math.random() * 50 + 20).toFixed(2))
    }, 12000) // Update every 12 seconds (Ethereum block time)

    // Initial values
    setBlockHeight(Math.floor(Math.random() * 1000000) + 15000000)
    setGasPrice((Math.random() * 50 + 20).toFixed(2))

    return () => clearInterval(interval)
  }, [chainId])

  if (!network) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-[#616161]">Network Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#9E9E9E]">Network</span>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isCorrectNetwork ? "bg-[#4CAF50]" : "bg-[#FF6347]"
            )} />
            <span className="text-sm font-medium">{network.name}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[#9E9E9E]">Block Height</span>
          <div className="flex items-center gap-1">
            <Hash className="h-3 w-3 text-[#9E9E9E]" />
            <span className="text-sm font-mono">{blockHeight.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[#9E9E9E]">Gas Price</span>
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3 text-[#9E9E9E]" />
            <span className="text-sm font-medium">{gasPrice} Gwei</span>
          </div>
        </div>

        <Separator />

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => window.open(network.blockExplorer, '_blank')}
        >
          <ExternalLink className="h-3 w-3 mr-2" />
          View Explorer
        </Button>
      </CardContent>
    </Card>
  )
}