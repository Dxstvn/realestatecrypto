/**
 * Transaction Monitor Component - PropertyChain
 * 
 * Real-time blockchain transaction tracking and management
 * Following UpdatedUIPlan.md Step 47 specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Slider } from '@/components/ui/slider'
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  ArrowUpRight,
  ArrowDownLeft,
  ExternalLink,
  Copy,
  MoreVertical,
  Zap,
  TrendingUp,
  RefreshCw,
  X,
  ChevronRight,
  Hash,
  Timer,
  DollarSign,
  Fuel,
  Package,
  Send,
  Receipt,
  Shield,
  AlertTriangle,
  Info,
  CheckCircle2,
  Database,
  Gauge,
  Rocket,
  Turtle,
  Rabbit,
  Bird,
  Filter,
  Download,
  Bell,
  BellOff,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useToast } from '@/hooks/use-toast'
import { useWeb3 } from './web3-provider-enhanced'

// Types
interface Transaction {
  hash: string
  type: 'send' | 'receive' | 'contract' | 'swap' | 'approval'
  from: string
  to: string
  value: string
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled'
  confirmations: number
  requiredConfirmations: number
  timestamp: number
  gasPrice: string
  gasLimit: string
  gasUsed?: string
  effectiveGasPrice?: string
  nonce: number
  blockNumber?: number
  method?: string
  contractAddress?: string
  tokenSymbol?: string
  speedUpCount?: number
  replacementHash?: string
}

interface GasOptions {
  slow: { price: string; time: string }
  standard: { price: string; time: string }
  fast: { price: string; time: string }
  instant: { price: string; time: string }
}

interface TransactionMonitorProps {
  maxTransactions?: number
  autoRefresh?: boolean
  refreshInterval?: number
  onTransactionComplete?: (tx: Transaction) => void
}

export function TransactionMonitor({
  maxTransactions = 50,
  autoRefresh = true,
  refreshInterval = 5000,
  onTransactionComplete,
}: TransactionMonitorProps) {
  const { 
    transactions: allTransactions, 
    pendingTransactions,
    gasPrice,
    sendTransaction,
    network 
  } = useWeb3()
  const { toast } = useToast()

  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showSpeedUp, setShowSpeedUp] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all')
  const [notifications, setNotifications] = useState(true)
  const [batchMode, setBatchMode] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<Set<string>>(new Set())

  // Mock gas options
  const [gasOptions] = useState<GasOptions>({
    slow: { price: '20', time: '~10 min' },
    standard: { price: '30', time: '~3 min' },
    fast: { price: '50', time: '~30 sec' },
    instant: { price: '80', time: '~15 sec' },
  })

  // Filter transactions
  const filteredTransactions = React.useMemo(() => {
    let txs = [...(pendingTransactions as Transaction[]), ...(allTransactions as Transaction[])]
    
    switch (filter) {
      case 'pending':
        txs = txs.filter(tx => tx.status === 'pending')
        break
      case 'completed':
        txs = txs.filter(tx => tx.status === 'confirmed')
        break
      case 'failed':
        txs = txs.filter(tx => ['failed', 'cancelled'].includes(tx.status as string))
        break
    }
    
    return txs.slice(0, maxTransactions)
  }, [pendingTransactions, allTransactions, filter, maxTransactions])

  // Monitor pending transactions
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      // Check for status updates
      (pendingTransactions as Transaction[]).forEach(tx => {
        // Simulate confirmation progress
        if (tx.confirmations < tx.requiredConfirmations) {
          // Would check actual blockchain here
        }
      })
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [pendingTransactions, autoRefresh, refreshInterval])

  // Handle transaction completion notifications
  useEffect(() => {
    if (!notifications) return

    const completed = (allTransactions as Transaction[]).filter(tx => tx.status === 'confirmed')
    completed.forEach(tx => {
      if (onTransactionComplete) {
        onTransactionComplete(tx)
      }
    })
  }, [allTransactions, notifications, onTransactionComplete])

  // Copy transaction hash
  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
    toast({
      title: 'Copied',
      description: 'Transaction hash copied to clipboard',
    })
  }

  // Speed up transaction
  const speedUpTransaction = async (tx: Transaction, newGasPrice: string) => {
    try {
      // Create replacement transaction with higher gas
      const replacementTx = {
        to: tx.to,
        value: tx.value,
        gasPrice: newGasPrice,
        nonce: tx.nonce,
      }
      
      const newHash = await sendTransaction(replacementTx)
      
      toast({
        title: 'Transaction accelerated',
        description: 'Your transaction has been resubmitted with higher gas',
      })
      
      setShowSpeedUp(false)
    } catch (error) {
      toast({
        title: 'Speed up failed',
        description: 'Could not accelerate transaction',
        variant: 'destructive',
      })
    }
  }

  // Cancel transaction
  const cancelTransaction = async (tx: Transaction) => {
    try {
      // Send 0 value transaction to self with same nonce
      const cancelTx = {
        to: tx.from,
        value: '0',
        gasPrice: (parseFloat(tx.gasPrice) * 1.2).toString(),
        nonce: tx.nonce,
      }
      
      await sendTransaction(cancelTx)
      
      toast({
        title: 'Cancellation submitted',
        description: 'Transaction cancellation has been submitted',
      })
    } catch (error) {
      toast({
        title: 'Cancellation failed',
        description: 'Could not cancel transaction',
        variant: 'destructive',
      })
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin text-[#FF6347]" />
      case 'confirmed':
        return <CheckCircle2 className="h-4 w-4 text-[#4CAF50]" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-[#DC3545]" />
      case 'cancelled':
        return <X className="h-4 w-4 text-[#9E9E9E]" />
      default:
        return <AlertCircle className="h-4 w-4 text-[#9E9E9E]" />
    }
  }

  // Get transaction type icon
  const getTxTypeIcon = (type: string) => {
    switch (type) {
      case 'send':
        return <ArrowUpRight className="h-4 w-4 text-[#DC3545]" />
      case 'receive':
        return <ArrowDownLeft className="h-4 w-4 text-[#4CAF50]" />
      case 'contract':
        return <Package className="h-4 w-4 text-[#007BFF]" />
      case 'swap':
        return <RefreshCw className="h-4 w-4 text-[#9C27B0]" />
      case 'approval':
        return <Shield className="h-4 w-4 text-[#FF6347]" />
      default:
        return <Activity className="h-4 w-4 text-[#9E9E9E]" />
    }
  }

  // Format address
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Format value
  const formatValue = (value: string, decimals = 18) => {
    const val = parseFloat(value) / Math.pow(10, decimals)
    return val.toFixed(4)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Transaction Monitor</h3>
          <p className="text-sm text-[#9E9E9E]">
            {pendingTransactions.length} pending, {allTransactions.length} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Batch Operations */}
          {batchMode && selectedBatch.size > 0 && (
            <div className="flex items-center gap-2 mr-2">
              <Badge variant="outline">
                {selectedBatch.size} selected
              </Badge>
              <Button size="sm" variant="outline">
                Cancel Selected
              </Button>
            </div>
          )}
          
          {/* Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {filter === 'all' ? 'All' : filter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter Transactions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilter('all')}>
                All Transactions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('pending')}>
                Pending Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('completed')}>
                Completed Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('failed')}>
                Failed Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setNotifications(!notifications)}
          >
            {notifications ? (
              <Bell className="h-4 w-4" />
            ) : (
              <BellOff className="h-4 w-4" />
            )}
          </Button>

          {/* Batch Mode Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setBatchMode(!batchMode)
              setSelectedBatch(new Set())
            }}
          >
            Batch Mode
          </Button>
        </div>
      </div>

      {/* Pending Transactions Queue */}
      {pendingTransactions.length > 0 && (
        <Card className="border-[#FFCC80]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#616161]">
              Pending Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(pendingTransactions as Transaction[]).map((tx) => (
                <div
                  key={tx.hash}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#FFF3E0] border border-[#FFCC80]"
                >
                  <div className="flex items-center gap-3">
                    {batchMode && (
                      <input
                        type="checkbox"
                        checked={selectedBatch.has(tx.hash)}
                        onChange={(e) => {
                          const newBatch = new Set(selectedBatch)
                          if (e.target.checked) {
                            newBatch.add(tx.hash)
                          } else {
                            newBatch.delete(tx.hash)
                          }
                          setSelectedBatch(newBatch)
                        }}
                      />
                    )}
                    <Loader2 className="h-4 w-4 animate-spin text-[#FF6347]" />
                    <div>
                      <p className="text-sm font-medium">
                        {tx.type || 'Transaction'} to {formatAddress(tx.to)}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-[#9E9E9E]">
                        <span>{tx.confirmations}/{tx.requiredConfirmations} confirmations</span>
                        <span>•</span>
                        <span>{tx.gasPrice} Gwei</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={(tx.confirmations / tx.requiredConfirmations) * 100} 
                      className="w-20 h-1"
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedTx(tx)
                          setShowSpeedUp(true)
                        }}>
                          <Zap className="h-4 w-4 mr-2" />
                          Speed Up
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => cancelTransaction(tx)}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyHash(tx.hash)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Hash
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Recent blockchain transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <button
                    key={tx.hash}
                    onClick={() => {
                      setSelectedTx(tx)
                      setShowDetails(true)
                    }}
                    className="w-full p-3 rounded-lg border hover:bg-[#F5F5F5] transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getTxTypeIcon(tx.type)}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">
                              {tx.type === 'send' ? 'Sent' : 
                               tx.type === 'receive' ? 'Received' :
                               tx.type === 'contract' ? 'Contract Interaction' :
                               tx.type === 'swap' ? 'Token Swap' :
                               'Approval'}
                            </p>
                            {tx.tokenSymbol && (
                              <Badge variant="outline" className="text-xs">
                                {tx.tokenSymbol}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-[#9E9E9E]">
                            {tx.type === 'send' ? `To ${formatAddress(tx.to)}` :
                             tx.type === 'receive' ? `From ${formatAddress(tx.from)}` :
                             formatAddress(tx.contractAddress || tx.to)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-medium text-sm">
                            {formatValue(tx.value)} {network?.symbol}
                          </p>
                          <p className="text-xs text-[#9E9E9E]">
                            {new Date(tx.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        {getStatusIcon(tx.status)}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-12">
                  <Receipt className="h-12 w-12 text-[#BDBDBD] mx-auto mb-4" />
                  <p className="text-[#9E9E9E]">No transactions found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Transaction Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Complete information for this transaction
            </DialogDescription>
          </DialogHeader>
          
          {selectedTx && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#F5F5F5]">
                <span className="text-sm text-[#616161]">Status</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedTx.status)}
                  <span className="font-medium capitalize">{selectedTx.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#9E9E9E]">Transaction Hash</Label>
                  <div className="flex items-center gap-2">
                    <code className="text-xs">{formatAddress(selectedTx.hash)}</code>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyHash(selectedTx.hash)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-[#9E9E9E]">Block Number</Label>
                  <p className="font-medium">{selectedTx.blockNumber || 'Pending'}</p>
                </div>
                <div>
                  <Label className="text-[#9E9E9E]">From</Label>
                  <code className="text-xs">{formatAddress(selectedTx.from)}</code>
                </div>
                <div>
                  <Label className="text-[#9E9E9E]">To</Label>
                  <code className="text-xs">{formatAddress(selectedTx.to)}</code>
                </div>
                <div>
                  <Label className="text-[#9E9E9E]">Value</Label>
                  <p className="font-medium">{formatValue(selectedTx.value)} {network?.symbol}</p>
                </div>
                <div>
                  <Label className="text-[#9E9E9E]">Gas Used</Label>
                  <p className="font-medium">{selectedTx.gasUsed || 'Pending'}</p>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.open(`${network?.blockExplorer}/tx/${selectedTx.hash}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Explorer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Speed Up Dialog */}
      <Dialog open={showSpeedUp} onOpenChange={setShowSpeedUp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Speed Up Transaction</DialogTitle>
            <DialogDescription>
              Increase gas price to accelerate confirmation
            </DialogDescription>
          </DialogHeader>

          {selectedTx && (
            <div className="space-y-4">
              <Alert className="border-[#99C2FF] bg-[#E6F2FF]">
                <Info className="h-4 w-4 text-[#007BFF]" />
                <AlertDescription className="text-[#003166]">
                  Speeding up will replace your transaction with a higher gas price
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                {Object.entries(gasOptions).map(([speed, option]) => {
                  const icons = {
                    slow: Turtle,
                    standard: Rabbit,
                    fast: Bird,
                    instant: Rocket,
                  }
                  const Icon = icons[speed as keyof typeof icons]
                  
                  return (
                    <button
                      key={speed}
                      onClick={() => speedUpTransaction(selectedTx, option.price)}
                      className="w-full p-3 rounded-lg border hover:bg-[#F5F5F5] transition-colors text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-[#757575]" />
                          <div>
                            <p className="font-medium capitalize">{speed}</p>
                            <p className="text-xs text-[#9E9E9E]">{option.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{option.price} Gwei</p>
                          <p className="text-xs text-[#9E9E9E]">
                            ~${(parseFloat(option.price) * 0.002).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Gas Optimization Widget
export function GasOptimizationWidget() {
  const { gasPrice } = useWeb3()
  const [selectedSpeed, setSelectedSpeed] = useState<'slow' | 'standard' | 'fast' | 'instant'>('standard')
  const [customGas, setCustomGas] = useState(false)
  const [customPrice, setCustomPrice] = useState('30')

  const speeds = {
    slow: { label: 'Slow', icon: Turtle, color: 'text-[#9E9E9E]' },
    standard: { label: 'Standard', icon: Rabbit, color: 'text-[#007BFF]' },
    fast: { label: 'Fast', icon: Bird, color: 'text-[#FF6347]' },
    instant: { label: 'Instant', icon: Rocket, color: 'text-[#9C27B0]' },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Gas Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!customGas ? (
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(speeds).map(([speed, config]) => {
              const Icon = config.icon
              const isSelected = speed === selectedSpeed
              
              return (
                <button
                  key={speed}
                  onClick={() => setSelectedSpeed(speed as any)}
                  className={cn(
                    "p-3 rounded-lg border transition-all",
                    isSelected 
                      ? "border-[#007BFF] bg-[#E6F2FF]" 
                      : "hover:bg-[#F5F5F5]"
                  )}
                >
                  <Icon className={cn("h-5 w-5 mx-auto mb-1", config.color)} />
                  <p className="text-xs font-medium">{config.label}</p>
                  <p className="text-xs text-[#9E9E9E]">
                    {gasPrice?.[speed as keyof typeof gasPrice]} Gwei
                  </p>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <Label htmlFor="custom-gas">Custom Gas Price (Gwei)</Label>
              <div className="flex items-center gap-2 mt-2">
                <Slider
                  id="custom-gas"
                  min={1}
                  max={200}
                  value={[parseInt(customPrice)]}
                  onValueChange={(v) => setCustomPrice(v[0].toString())}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-12 text-right">
                  {customPrice}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Label htmlFor="custom-toggle" className="text-sm">
            Custom Gas
          </Label>
          <Switch
            id="custom-toggle"
            checked={customGas}
            onCheckedChange={setCustomGas}
          />
        </div>

        <Alert>
          <Fuel className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Estimated cost: ${((parseInt(customGas ? customPrice : gasPrice?.standard || '30') * 21000 * 0.000000001) * 2000).toFixed(2)}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}