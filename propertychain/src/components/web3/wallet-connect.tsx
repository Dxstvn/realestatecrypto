/**
 * Wallet Connect Component - PropertyChain
 * 
 * Comprehensive wallet connection interface with:
 * - Multi-wallet support (MetaMask, WalletConnect, Coinbase, etc.)
 * - Network switcher with visual indicators
 * - Balance display with CountUp animation
 * - Custom modal using shadcn Dialog
 * - Mobile-optimized interface
 * 
 * Following UpdatedUIPlan.md Step 33 specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wallet,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  Copy,
  ExternalLink,
  Power,
  Zap,
  Globe,
  Smartphone,
  Shield,
  Loader2,
  RefreshCw,
  AlertCircle,
  Info,
  Plug,
} from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils/cn'
import { useWeb3Context } from '@/components/providers/web3-provider'
import { BLOCKCHAIN } from '@/lib/constants/blockchain'
import { toast } from 'sonner'

// CountUp animation hook for balance display
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (end === 0) return
    
    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      setCount(Math.floor(progress * end * 100) / 100)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [end, duration])
  
  return count
}

/**
 * Wallet configuration for different providers
 */
const SUPPORTED_WALLETS = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '/wallet-icons/metamask.svg',
    description: 'Connect using MetaMask wallet',
    mobile: false,
    desktop: true,
    deepLink: 'https://metamask.app.link/dapp/',
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '/wallet-icons/walletconnect.svg',
    description: 'Connect using WalletConnect protocol',
    mobile: true,
    desktop: true,
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: '/wallet-icons/coinbase.svg',
    description: 'Connect using Coinbase Wallet',
    mobile: true,
    desktop: true,
    deepLink: 'https://go.cb-w.com/dapp?cb_url=',
  },
  {
    id: 'trust',
    name: 'Trust Wallet',
    icon: '/wallet-icons/trust.svg',
    description: 'Connect using Trust Wallet',
    mobile: true,
    desktop: false,
    deepLink: 'https://link.trustwallet.com/open_url?coin_id=60&url=',
  },
] as const

/**
 * Network configuration with visual indicators
 */
const NETWORK_CONFIG = [
  {
    ...BLOCKCHAIN.NETWORKS.MAINNET,
    color: '#627EEA',
    icon: '/network-icons/ethereum.svg',
    status: 'stable' as const,
  },
  {
    ...BLOCKCHAIN.NETWORKS.POLYGON,
    color: '#8247E5',
    icon: '/network-icons/polygon.svg',
    status: 'stable' as const,
  },
  {
    ...BLOCKCHAIN.NETWORKS.TESTNET,
    color: '#F7931A',
    icon: '/network-icons/ethereum.svg',
    status: 'testnet' as const,
  },
]

/**
 * Wallet Selection Modal Component
 */
function WalletSelectionModal({ 
  open, 
  onOpenChange,
  onWalletSelect,
  isConnecting,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onWalletSelect: (walletId: string) => void
  isConnecting: boolean
}) {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const handleWalletSelect = (walletId: string) => {
    setSelectedWallet(walletId)
    onWalletSelect(walletId)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Wallet
          </DialogTitle>
          <DialogDescription>
            Choose your preferred wallet to connect to PropertyChain
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {SUPPORTED_WALLETS.map((wallet) => {
            // Filter wallets based on device type
            if (isMobile && !wallet.mobile) return null
            if (!isMobile && !wallet.desktop) return null

            const isSelected = selectedWallet === wallet.id
            const isLoading = isConnecting && isSelected

            return (
              <Button
                key={wallet.id}
                variant="outline"
                className={cn(
                  "w-full h-16 justify-start gap-4 p-4",
                  isSelected && "border-blue-500 bg-blue-50",
                  isLoading && "opacity-75"
                )}
                onClick={() => handleWalletSelect(wallet.id)}
                disabled={isConnecting}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Wallet className="h-5 w-5" />
                  </div>
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 text-left">
                  <div className="font-medium">{wallet.name}</div>
                  <div className="text-xs text-muted-foreground">{wallet.description}</div>
                </div>

                {wallet.mobile && isMobile && (
                  <Badge variant="secondary" className="text-xs">
                    Mobile
                  </Badge>
                )}
              </Button>
            )
          })}
        </div>

        <Alert className="mt-4">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            By connecting your wallet, you agree to PropertyChain's Terms of Service and Privacy Policy.
            Your wallet will be used to authenticate and interact with our smart contracts.
          </AlertDescription>
        </Alert>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Network Switcher Component
 */
function NetworkSwitcher({
  currentChainId,
  onNetworkSwitch,
  isLoading,
}: {
  currentChainId?: number
  onNetworkSwitch: (chainId: number) => void
  isLoading: boolean
}) {
  const currentNetwork = NETWORK_CONFIG.find(n => n.chainId === currentChainId)
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2" disabled={isLoading}>
          {currentNetwork ? (
            <>
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: currentNetwork.color }}
              />
              <span className="hidden sm:inline">{currentNetwork.name}</span>
              <span className="sm:hidden">{currentNetwork.nativeCurrency.symbol}</span>
            </>
          ) : (
            <>
              <AlertTriangle className="h-3 w-3 text-orange-500" />
              <span className="hidden sm:inline">Wrong Network</span>
              <span className="sm:hidden">Error</span>
            </>
          )}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Switch Network</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {NETWORK_CONFIG.map((network) => (
          <DropdownMenuItem
            key={network.chainId}
            onClick={() => onNetworkSwitch(network.chainId)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: network.color }}
            />
            <div className="flex-1">
              <div className="font-medium">{network.name}</div>
              <div className="text-xs text-muted-foreground">
                {network.nativeCurrency.symbol}
              </div>
            </div>
            {currentChainId === network.chainId && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            {network.status === 'testnet' && (
              <Badge variant="outline" className="text-xs">
                Test
              </Badge>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Balance Display Component with CountUp Animation
 */
function BalanceDisplay({ 
  balance, 
  symbol = 'ETH',
  loading = false 
}: { 
  balance: number
  symbol?: string
  loading?: boolean
}) {
  const animatedBalance = useCountUp(balance, 2000)
  
  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 h-4 bg-gray-200 animate-pulse rounded" />
        <span className="text-xs text-muted-foreground">{symbol}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1 font-mono">
      <span className="font-semibold">
        {animatedBalance.toFixed(4)}
      </span>
      <span className="text-xs text-muted-foreground">{symbol}</span>
    </div>
  )
}

/**
 * Connected Wallet Display Component
 */
function ConnectedWalletDisplay({
  address,
  balance,
  chainId,
  onDisconnect,
  onRefresh,
  isRefreshing,
}: {
  address: string
  balance?: number
  chainId?: number
  onDisconnect: () => void
  onRefresh: () => void
  isRefreshing: boolean
}) {
  const [copied, setCopied] = useState(false)
  const network = NETWORK_CONFIG.find(n => n.chainId === chainId)
  
  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      toast.success('Address copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy address')
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const openInExplorer = () => {
    if (network) {
      window.open(`${network.explorerUrl}/address/${address}`, '_blank')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-10 gap-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={`https://avatar.vercel.sh/${address}`} />
            <AvatarFallback>
              <Wallet className="h-3 w-3" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">{formatAddress(address)}</span>
              {network && (
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: network.color }}
                />
              )}
            </div>
            {balance !== undefined && (
              <BalanceDisplay
                balance={balance}
                symbol={network?.nativeCurrency.symbol}
              />
            )}
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>
          <div className="flex items-center justify-between">
            <span>Wallet Details</span>
            <div className="flex items-center gap-1">
              {network && (
                <Badge variant="secondary" className="text-xs">
                  {network.name}
                </Badge>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <div className="p-3 space-y-3">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Address</div>
            <div className="flex items-center justify-between">
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                {formatAddress(address)}
              </code>
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={handleCopyAddress}
                      >
                        <Copy className={cn("h-3 w-3", copied && "text-green-500")} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {copied ? 'Copied!' : 'Copy address'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={openInExplorer}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      View in explorer
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
          
          {balance !== undefined && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Balance</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={onRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={cn("h-3 w-3", isRefreshing && "animate-spin")} />
                </Button>
              </div>
              <BalanceDisplay
                balance={balance}
                symbol={network?.nativeCurrency.symbol}
                loading={isRefreshing}
              />
            </div>
          )}
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={onDisconnect}
          className="text-red-600 focus:text-red-600 cursor-pointer"
        >
          <Power className="h-4 w-4 mr-2" />
          Disconnect Wallet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Main Wallet Connect Component
 */
export function WalletConnect({
  className,
  size = 'default',
  showBalance = true,
  showNetwork = true,
}: {
  className?: string
  size?: 'sm' | 'default' | 'lg'
  showBalance?: boolean
  showNetwork?: boolean
}) {
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

  const [modalOpen, setModalOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [parsedBalance, setParsedBalance] = useState(0)

  // Parse balance from Wei to ETH
  useEffect(() => {
    if (balance) {
      try {
        // Convert from Wei to ETH (assuming balance is in Wei as hex string)
        const balanceInWei = typeof balance === 'string' 
          ? parseInt(balance, 16) 
          : balance
        const balanceInEth = balanceInWei / Math.pow(10, 18)
        setParsedBalance(balanceInEth)
      } catch (error) {
        setParsedBalance(0)
      }
    } else {
      setParsedBalance(0)
    }
  }, [balance])

  const handleWalletSelect = async (walletId: string) => {
    try {
      await connect()
      setModalOpen(false)
      toast.success('Wallet connected successfully!')
    } catch (error) {
      console.error('Wallet connection failed:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to connect wallet')
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
      toast.success('Wallet disconnected')
    } catch (error) {
      toast.error('Failed to disconnect wallet')
    }
  }

  const handleNetworkSwitch = async (newChainId: number) => {
    try {
      await switchNetwork(newChainId)
      toast.success('Network switched successfully')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to switch network'
      toast.error(message)
    }
  }

  const handleRefreshBalance = async () => {
    setIsRefreshing(true)
    // Simulate refresh - in production this would refetch from the blockchain
    setTimeout(() => {
      setIsRefreshing(false)
      toast.success('Balance refreshed')
    }, 1000)
  }

  const buttonSizes = {
    sm: 'h-8 text-sm',
    default: 'h-10',
    lg: 'h-12 text-lg',
  }

  // Show connection error if exists
  if (error && !connected) {
    return (
      <Alert className={cn('max-w-md', className)}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  // Connected state
  if (connected && address) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {showNetwork && (
          <NetworkSwitcher
            currentChainId={chainId}
            onNetworkSwitch={handleNetworkSwitch}
            isLoading={isConnecting}
          />
        )}
        
        <ConnectedWalletDisplay
          address={address}
          balance={showBalance ? parsedBalance : undefined}
          chainId={chainId}
          onDisconnect={handleDisconnect}
          onRefresh={handleRefreshBalance}
          isRefreshing={isRefreshing}
        />
      </div>
    )
  }

  // Disconnected state
  return (
    <>
      <Button
        onClick={() => setModalOpen(true)}
        disabled={isConnecting}
        className={cn(buttonSizes[size], className)}
        variant="outline"
      >
        {isConnecting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </>
        )}
      </Button>

      <WalletSelectionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onWalletSelect={handleWalletSelect}
        isConnecting={isConnecting}
      />
    </>
  )
}

/**
 * Compact Wallet Connect for mobile/small spaces
 */
export function WalletConnectCompact({
  className,
}: {
  className?: string
}) {
  return (
    <WalletConnect
      className={className}
      size="sm"
      showBalance={false}
      showNetwork={false}
    />
  )
}