/**
 * Enhanced Web3 Provider Component - PropertyChain
 * 
 * Comprehensive wallet connection and blockchain interaction management
 * Following UpdatedUIPlan.md Step 47 specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Wallet,
  ChevronDown,
  Copy,
  ExternalLink,
  LogOut,
  Settings,
  Shield,
  Globe,
  AlertTriangle,
  CheckCircle,
  Info,
  Loader2,
  WifiOff,
  Zap,
  Activity,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  DollarSign,
  Hash,
  Link,
  Unlink,
  Chrome,
  Smartphone,
  Key,
  UserPlus,
  Mail,
  Twitter,
  Github,
  MessageCircle,
  QrCode,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useToast } from '@/hooks/use-toast'

// Types
interface Web3ContextType {
  // Connection state
  isConnected: boolean
  isConnecting: boolean
  address: string | null
  chainId: number | null
  balance: string | null
  
  // Wallet info
  walletType: WalletType | null
  walletName: string | null
  ensName: string | null
  avatar: string | null
  
  // Network info
  network: NetworkInfo | null
  supportedNetworks: NetworkInfo[]
  isCorrectNetwork: boolean
  
  // Methods
  connect: (walletType: WalletType) => Promise<void>
  disconnect: () => void
  switchNetwork: (chainId: number) => Promise<void>
  
  // Transaction methods
  sendTransaction: (tx: TransactionRequest) => Promise<string>
  signMessage: (message: string) => Promise<string>
  
  // State
  transactions: Transaction[]
  pendingTransactions: Transaction[]
  gasPrice: GasPrice | null
}

type WalletType = 'metamask' | 'coinbase' | 'walletconnect' | 'trust' | 'social'

interface NetworkInfo {
  chainId: number
  name: string
  symbol: string
  rpcUrl: string
  blockExplorer: string
  isTestnet: boolean
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}

interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  status: 'pending' | 'confirmed' | 'failed'
  confirmations: number
  timestamp: number
  gasUsed?: string
  effectiveGasPrice?: string
  blockNumber?: number
  nonce: number
}

interface TransactionRequest {
  to: string
  value?: string
  data?: string
  gasLimit?: string
  gasPrice?: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
}

interface GasPrice {
  slow: string
  standard: string
  fast: string
  instant: string
}

// Supported Networks
const SUPPORTED_NETWORKS: NetworkInfo[] = [
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
    name: 'Arbitrum',
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
]

// Mock context for demonstration
const Web3Context = createContext<Web3ContextType | null>(null)

export function useWeb3() {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider')
  }
  return context
}

interface Web3ProviderProps {
  children: React.ReactNode
  projectId?: string
}

export function Web3Provider({ children, projectId }: Web3ProviderProps) {
  const { toast } = useToast()
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [walletType, setWalletType] = useState<WalletType | null>(null)
  const [walletName, setWalletName] = useState<string | null>(null)
  const [ensName, setEnsName] = useState<string | null>(null)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [network, setNetwork] = useState<NetworkInfo | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([])
  const [gasPrice, setGasPrice] = useState<GasPrice | null>(null)

  // Check if correct network
  const isCorrectNetwork = chainId ? SUPPORTED_NETWORKS.some(n => n.chainId === chainId) : false

  // Update network info when chainId changes
  useEffect(() => {
    if (chainId) {
      const networkInfo = SUPPORTED_NETWORKS.find(n => n.chainId === chainId)
      setNetwork(networkInfo || null)
    }
  }, [chainId])

  // Fetch gas prices
  useEffect(() => {
    const fetchGasPrice = async () => {
      // Mock gas prices
      setGasPrice({
        slow: '20',
        standard: '30',
        fast: '50',
        instant: '80',
      })
    }

    fetchGasPrice()
    const interval = setInterval(fetchGasPrice, 15000) // Update every 15 seconds
    return () => clearInterval(interval)
  }, [])

  // Connect wallet
  const connect = useCallback(async (type: WalletType) => {
    setIsConnecting(true)
    
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock connection data
      const mockAddress = '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')
      setAddress(mockAddress)
      setChainId(1) // Ethereum Mainnet
      setBalance('2.5')
      setWalletType(type)
      setWalletName(type === 'metamask' ? 'MetaMask' : type === 'coinbase' ? 'Coinbase Wallet' : 'WalletConnect')
      setIsConnected(true)
      
      // Mock ENS
      setEnsName('vitalik.eth')
      
      toast({
        title: 'Wallet connected',
        description: `Connected to ${walletName || type}`,
      })
    } catch (error) {
      toast({
        title: 'Connection failed',
        description: 'Could not connect to wallet',
        variant: 'destructive',
      })
    } finally {
      setIsConnecting(false)
    }
  }, [toast, walletName])

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setIsConnected(false)
    setAddress(null)
    setChainId(null)
    setBalance(null)
    setWalletType(null)
    setWalletName(null)
    setEnsName(null)
    setAvatar(null)
    setTransactions([])
    setPendingTransactions([])
    
    toast({
      title: 'Wallet disconnected',
      description: 'Your wallet has been disconnected',
    })
  }, [toast])

  // Switch network
  const switchNetwork = useCallback(async (targetChainId: number) => {
    try {
      // Simulate network switch
      await new Promise(resolve => setTimeout(resolve, 1000))
      setChainId(targetChainId)
      
      const network = SUPPORTED_NETWORKS.find(n => n.chainId === targetChainId)
      toast({
        title: 'Network switched',
        description: `Switched to ${network?.name}`,
      })
    } catch (error) {
      toast({
        title: 'Switch failed',
        description: 'Could not switch network',
        variant: 'destructive',
      })
    }
  }, [toast])

  // Send transaction
  const sendTransaction = useCallback(async (tx: TransactionRequest): Promise<string> => {
    // Mock transaction
    const hash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')
    
    const newTx: Transaction = {
      hash,
      from: address!,
      to: tx.to,
      value: tx.value || '0',
      status: 'pending',
      confirmations: 0,
      timestamp: Date.now(),
      nonce: transactions.length,
    }
    
    setPendingTransactions(prev => [...prev, newTx])
    
    // Simulate confirmation
    setTimeout(() => {
      setPendingTransactions(prev => prev.filter(t => t.hash !== hash))
      setTransactions(prev => [...prev, { ...newTx, status: 'confirmed', confirmations: 12 }])
    }, 5000)
    
    return hash
  }, [address, transactions])

  // Sign message
  const signMessage = useCallback(async (message: string): Promise<string> => {
    // Mock signature
    const signature = '0x' + Array(130).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')
    return signature
  }, [])

  const value: Web3ContextType = {
    isConnected,
    isConnecting,
    address,
    chainId,
    balance,
    walletType,
    walletName,
    ensName,
    avatar,
    network,
    supportedNetworks: SUPPORTED_NETWORKS,
    isCorrectNetwork,
    connect,
    disconnect,
    switchNetwork,
    sendTransaction,
    signMessage,
    transactions,
    pendingTransactions,
    gasPrice,
  }

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  )
}

// Wallet Connection Modal Component
export function WalletConnectionModal() {
  const { connect, isConnecting } = useWeb3()
  const [showModal, setShowModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<'injected' | 'walletconnect' | 'social'>('injected')

  const walletOptions = {
    injected: [
      { id: 'metamask', name: 'MetaMask', icon: '🦊', description: 'Connect using MetaMask wallet' },
      { id: 'coinbase', name: 'Coinbase Wallet', icon: '💙', description: 'Connect using Coinbase wallet' },
      { id: 'trust', name: 'Trust Wallet', icon: '🛡️', description: 'Connect using Trust wallet' },
    ],
    walletconnect: [
      { id: 'walletconnect', name: 'WalletConnect', icon: '🔗', description: 'Scan QR code to connect' },
    ],
    social: [
      { id: 'google', name: 'Google', icon: '🔍', description: 'Sign in with Google' },
      { id: 'twitter', name: 'Twitter', icon: '🐦', description: 'Sign in with Twitter' },
      { id: 'discord', name: 'Discord', icon: '💬', description: 'Sign in with Discord' },
    ],
  }

  return (
    <>
      <Button onClick={() => setShowModal(true)} className="bg-[#007BFF] hover:bg-[#0062CC]">
        <Wallet className="h-4 w-4 mr-2" />
        Connect Wallet
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Connect Your Wallet</DialogTitle>
            <DialogDescription>
              Choose your preferred method to connect to PropertyChain
            </DialogDescription>
          </DialogHeader>

          <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="injected">Browser Wallets</TabsTrigger>
              <TabsTrigger value="walletconnect">WalletConnect</TabsTrigger>
              <TabsTrigger value="social">Social Login</TabsTrigger>
            </TabsList>

            <TabsContent value="injected" className="mt-6">
              <div className="grid grid-cols-1 gap-3">
                {walletOptions.injected.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => {
                      connect(wallet.id as WalletType)
                      setShowModal(false)
                    }}
                    disabled={isConnecting}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:bg-[#F5F5F5] transition-colors text-left"
                  >
                    <span className="text-2xl">{wallet.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium">{wallet.name}</p>
                      <p className="text-sm text-[#9E9E9E]">{wallet.description}</p>
                    </div>
                    <ChevronDown className="h-5 w-5 text-[#9E9E9E] -rotate-90" />
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="walletconnect" className="mt-6">
              <div className="text-center py-8">
                <div className="w-48 h-48 mx-auto bg-[#F5F5F5] rounded-lg flex items-center justify-center mb-4">
                  <QrCode className="h-24 w-24 text-[#BDBDBD]" />
                </div>
                <p className="text-sm text-[#9E9E9E] mb-4">
                  Scan QR code with your wallet app
                </p>
                <Button 
                  onClick={() => {
                    connect('walletconnect')
                    setShowModal(false)
                  }}
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Link className="h-4 w-4 mr-2" />
                  )}
                  Connect with WalletConnect
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="social" className="mt-6">
              <div className="grid grid-cols-1 gap-3">
                {walletOptions.social.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      connect('social')
                      setShowModal(false)
                    }}
                    disabled={isConnecting}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:bg-[#F5F5F5] transition-colors text-left"
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium">{option.name}</p>
                      <p className="text-sm text-[#9E9E9E]">{option.description}</p>
                    </div>
                    <ChevronDown className="h-5 w-5 text-[#9E9E9E] -rotate-90" />
                  </button>
                ))}
              </div>

              <Alert className="mt-4 border-[#99C2FF] bg-[#E6F2FF]">
                <Info className="h-4 w-4 text-[#007BFF]" />
                <AlertDescription className="text-[#003166]">
                  Social login creates a secure wallet for you automatically. No crypto experience needed!
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <p className="text-xs text-[#9E9E9E] text-center w-full">
              By connecting, you agree to our Terms of Service and Privacy Policy
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Wallet Display Component
export function WalletDisplay() {
  const { 
    isConnected, 
    address, 
    balance, 
    network, 
    ensName,
    disconnect,
    walletName 
  } = useWeb3()
  const { toast } = useToast()

  if (!isConnected || !address) {
    return <WalletConnectionModal />
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
    toast({
      title: 'Address copied',
      description: 'Wallet address copied to clipboard',
    })
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-10">
          <div className="flex items-center gap-2">
            {network?.isTestnet && (
              <Badge variant="outline" className="text-xs bg-[#FFF3E0] text-[#F57C00] border-[#FFB74D]">
                Testnet
              </Badge>
            )}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#007BFF] to-[#004A99]" />
              <div className="text-left">
                <p className="text-sm font-medium">
                  {ensName || formatAddress(address)}
                </p>
                <p className="text-xs text-[#9E9E9E]">
                  {balance ? `${parseFloat(balance).toFixed(3)} ${network?.symbol}` : 'Loading...'}
                </p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-[#9E9E9E]" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px]">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#007BFF] to-[#004A99]" />
            <div className="flex-1">
              <p className="font-medium">{ensName || 'Wallet User'}</p>
              <p className="text-xs text-[#9E9E9E]">{walletName}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="p-2">
          <div className="flex items-center justify-between p-2 rounded bg-[#F5F5F5]">
            <code className="text-xs">{formatAddress(address)}</code>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyAddress}>
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem>
          <Activity className="h-4 w-4 mr-2" />
          Transaction History
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="h-4 w-4 mr-2" />
          Wallet Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ExternalLink className="h-4 w-4 mr-2" />
          View on Explorer
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={disconnect} className="text-red-600">
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}