/**
 * Transaction Monitor Component - PropertyChain Admin
 * 
 * Real-time blockchain transaction monitoring and analysis
 * Following UpdatedUIPlan.md Step 55.4 specifications and CLAUDE.md principles
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  ArrowUpRight, ArrowDownRight, Clock, Shield, AlertTriangle,
  CheckCircle, XCircle, Info, Filter, Search, RefreshCw,
  Download, Eye, Copy, ExternalLink, Zap, Activity,
  TrendingUp, AlertCircle, Loader2, Hash, User, Wallet
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

// Transaction types
export interface Transaction {
  id: string
  hash: string
  type: 'transfer' | 'mint' | 'burn' | 'sale' | 'rental' | 'payment' | 'withdrawal'
  status: 'pending' | 'confirmed' | 'failed' | 'dropped'
  from: string
  to: string
  value: number
  fee: number
  gasUsed?: number
  gasPrice?: number
  blockNumber?: number
  timestamp: Date
  confirmations: number
  property?: {
    id: string
    name: string
    tokenId: string
  }
  metadata?: {
    method?: string
    contractAddress?: string
    network?: string
    nonce?: number
  }
  riskScore?: number
  flags?: string[]
}

// Transaction statistics
interface TransactionStats {
  total: number
  pending: number
  confirmed: number
  failed: number
  volume: number
  fees: number
  avgGasPrice: number
  avgConfirmationTime: number
}

// Risk indicators
interface RiskIndicator {
  id: string
  label: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  count: number
  transactions: string[]
}

export function TransactionMonitor() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [filter, setFilter] = useState({
    type: 'all',
    status: 'all',
    search: '',
    dateRange: '24h'
  })
  const [isLive, setIsLive] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTxs, setSelectedTxs] = useState<Set<string>>(new Set())
  const [stats, setStats] = useState<TransactionStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    failed: 0,
    volume: 0,
    fees: 0,
    avgGasPrice: 0,
    avgConfirmationTime: 0
  })

  // Generate sample transactions
  const generateTransaction = useCallback((): Transaction => {
    const types: Transaction['type'][] = ['transfer', 'mint', 'sale', 'rental', 'payment']
    const statuses: Transaction['status'][] = ['pending', 'confirmed', 'failed']
    const properties = [
      { id: 'prop-1', name: 'Marina Bay Towers #2501', tokenId: '0x123' },
      { id: 'prop-2', name: 'Sunset Plaza #1203', tokenId: '0x456' },
      { id: 'prop-3', name: 'The Grand Estate', tokenId: '0x789' }
    ]
    
    const type = types[Math.floor(Math.random() * types.length)]
    const status = Math.random() > 0.8 ? 'pending' : 
                  Math.random() > 0.1 ? 'confirmed' : 'failed'
    
    return {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      hash: `0x${Math.random().toString(36).substr(2, 64)}`,
      type,
      status,
      from: `0x${Math.random().toString(36).substr(2, 40)}`,
      to: `0x${Math.random().toString(36).substr(2, 40)}`,
      value: Math.floor(Math.random() * 1000000),
      fee: Math.floor(Math.random() * 10000),
      gasUsed: status === 'confirmed' ? Math.floor(21000 + Math.random() * 100000) : undefined,
      gasPrice: Math.floor(20 + Math.random() * 100),
      blockNumber: status === 'confirmed' ? Math.floor(15000000 + Math.random() * 1000) : undefined,
      timestamp: new Date(Date.now() - Math.random() * 3600000),
      confirmations: status === 'confirmed' ? Math.floor(1 + Math.random() * 100) : 0,
      property: Math.random() > 0.3 ? properties[Math.floor(Math.random() * properties.length)] : undefined,
      metadata: {
        method: type === 'sale' ? 'executeSale' : type === 'mint' ? 'mintToken' : 'transfer',
        contractAddress: `0x${Math.random().toString(36).substr(2, 40)}`,
        network: 'ethereum',
        nonce: Math.floor(Math.random() * 1000)
      },
      riskScore: Math.floor(Math.random() * 100),
      flags: Math.random() > 0.9 ? ['high-value', 'first-time-user'] : 
             Math.random() > 0.8 ? ['unusual-pattern'] : undefined
    }
  }, [])

  // Initialize with sample data
  useEffect(() => {
    const initialTxs = Array.from({ length: 50 }, generateTransaction)
    setTransactions(initialTxs)
    calculateStats(initialTxs)
  }, [generateTransaction])

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      const newTx = generateTransaction()
      setTransactions(prev => {
        const updated = [newTx, ...prev].slice(0, 100)
        calculateStats(updated)
        return updated
      })
      
      // Update pending transactions
      setTransactions(prev => prev.map(tx => {
        if (tx.status === 'pending' && Math.random() > 0.7) {
          return {
            ...tx,
            status: Math.random() > 0.1 ? 'confirmed' : 'failed',
            confirmations: Math.floor(1 + Math.random() * 10),
            blockNumber: Math.floor(15000000 + Math.random() * 1000),
            gasUsed: Math.floor(21000 + Math.random() * 100000)
          }
        }
        if (tx.status === 'confirmed' && tx.confirmations < 100) {
          return {
            ...tx,
            confirmations: Math.min(100, tx.confirmations + Math.floor(1 + Math.random() * 5))
          }
        }
        return tx
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [isLive, generateTransaction])

  // Calculate statistics
  const calculateStats = (txs: Transaction[]) => {
    const stats: TransactionStats = {
      total: txs.length,
      pending: txs.filter(tx => tx.status === 'pending').length,
      confirmed: txs.filter(tx => tx.status === 'confirmed').length,
      failed: txs.filter(tx => tx.status === 'failed').length,
      volume: txs.reduce((sum, tx) => sum + tx.value, 0),
      fees: txs.reduce((sum, tx) => sum + tx.fee, 0),
      avgGasPrice: txs.filter(tx => tx.gasPrice).reduce((sum, tx) => sum + (tx.gasPrice || 0), 0) / 
                   txs.filter(tx => tx.gasPrice).length || 0,
      avgConfirmationTime: 45 // seconds (mock)
    }
    setStats(stats)
  }

  // Filter transactions
  const filteredTransactions = transactions.filter(tx => {
    if (filter.type !== 'all' && tx.type !== filter.type) return false
    if (filter.status !== 'all' && tx.status !== filter.status) return false
    if (filter.search) {
      const search = filter.search.toLowerCase()
      return tx.hash.toLowerCase().includes(search) ||
             tx.from.toLowerCase().includes(search) ||
             tx.to.toLowerCase().includes(search) ||
             tx.property?.name.toLowerCase().includes(search)
    }
    return true
  })

  // Risk indicators
  const riskIndicators: RiskIndicator[] = [
    {
      id: 'high-value',
      label: 'High Value Transactions',
      severity: 'high',
      count: transactions.filter(tx => tx.value > 500000).length,
      transactions: transactions.filter(tx => tx.value > 500000).map(tx => tx.id)
    },
    {
      id: 'failed',
      label: 'Failed Transactions',
      severity: 'medium',
      count: stats.failed,
      transactions: transactions.filter(tx => tx.status === 'failed').map(tx => tx.id)
    },
    {
      id: 'suspicious',
      label: 'Suspicious Activity',
      severity: 'critical',
      count: transactions.filter(tx => tx.flags && tx.flags.length > 0).length,
      transactions: transactions.filter(tx => tx.flags && tx.flags.length > 0).map(tx => tx.id)
    },
    {
      id: 'high-gas',
      label: 'High Gas Usage',
      severity: 'low',
      count: transactions.filter(tx => tx.gasUsed && tx.gasUsed > 100000).length,
      transactions: transactions.filter(tx => tx.gasUsed && tx.gasUsed > 100000).map(tx => tx.id)
    }
  ]

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  // Format address
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Get status color
  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-50'
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      case 'failed': return 'text-red-600 bg-red-50'
      case 'dropped': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  // Get type icon
  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'transfer': return ArrowUpRight
      case 'mint': return Zap
      case 'sale': return TrendingUp
      case 'payment': return ArrowDownRight
      default: return Activity
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by hash, address, or property..."
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              className="pl-9 w-80"
            />
          </div>
          
          <Select
            value={filter.type}
            onValueChange={(value) => setFilter(prev => ({ ...prev, type: value }))}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
              <SelectItem value="mint">Mint</SelectItem>
              <SelectItem value="sale">Sale</SelectItem>
              <SelectItem value="rental">Rental</SelectItem>
              <SelectItem value="payment">Payment</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={filter.status}
            onValueChange={(value) => setFilter(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant={isLive ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="gap-2"
          >
            <Activity className={cn("h-4 w-4", isLive && "animate-pulse")} />
            {isLive ? 'Live' : 'Paused'}
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          {selectedTxs.size > 0 && (
            <Badge variant="secondary" className="gap-1">
              {selectedTxs.size} selected
            </Badge>
          )}
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Volume</p>
                <p className="text-2xl font-bold">${(stats.volume / 1000).toFixed(1)}K</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Gas Price</p>
                <p className="text-2xl font-bold">{stats.avgGasPrice.toFixed(0)} Gwei</p>
              </div>
              <Zap className="h-8 w-8 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Fees</p>
                <p className="text-2xl font-bold">${(stats.fees / 1000).toFixed(1)}K</p>
              </div>
              <Wallet className="h-8 w-8 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Indicators */}
      {riskIndicators.some(r => r.count > 0) && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span className="font-medium text-yellow-800">Risk Indicators Detected</span>
              <div className="flex items-center gap-4">
                {riskIndicators.filter(r => r.count > 0).map(indicator => (
                  <Badge
                    key={indicator.id}
                    variant={
                      indicator.severity === 'critical' ? 'destructive' :
                      indicator.severity === 'high' ? 'default' :
                      'secondary'
                    }
                    className="gap-1"
                  >
                    {indicator.count} {indicator.label}
                  </Badge>
                ))}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction Feed</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={isLive ? 'default' : 'secondary'} className="gap-1">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"
                )} />
                {isLive ? 'Live' : 'Paused'}
              </Badge>
              <Badge variant="outline">
                {filteredTransactions.length} transactions
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedTxs.size === filteredTransactions.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedTxs(new Set(filteredTransactions.map(tx => tx.id)))
                        } else {
                          setSelectedTxs(new Set())
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Hash</TableHead>
                  <TableHead>From → To</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {filteredTransactions.map((tx) => {
                    const TypeIcon = getTypeIcon(tx.type)
                    return (
                      <motion.tr
                        key={tx.id}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={cn(
                          "group hover:bg-gray-50",
                          selectedTxs.has(tx.id) && "bg-blue-50"
                        )}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedTxs.has(tx.id)}
                            onCheckedChange={(checked) => {
                              const newSelected = new Set(selectedTxs)
                              if (checked) {
                                newSelected.add(tx.id)
                              } else {
                                newSelected.delete(tx.id)
                              }
                              setSelectedTxs(newSelected)
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <TypeIcon className="h-4 w-4 text-gray-500" />
                            <span className="capitalize text-sm">{tx.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <code className="text-xs">{formatAddress(tx.hash)}</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                              onClick={() => copyToClipboard(tx.hash)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {formatAddress(tx.from)}
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <ArrowDownRight className="h-3 w-3" />
                              {formatAddress(tx.to)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {tx.property ? (
                            <div className="text-sm">
                              <p className="font-medium">{tx.property.name}</p>
                              <p className="text-xs text-gray-500">{tx.property.tokenId}</p>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">${tx.value.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Fee: ${tx.fee}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("gap-1", getStatusColor(tx.status))}>
                            {tx.status === 'pending' && <Loader2 className="h-3 w-3 animate-spin" />}
                            {tx.status === 'confirmed' && <CheckCircle className="h-3 w-3" />}
                            {tx.status === 'failed' && <XCircle className="h-3 w-3" />}
                            {tx.status}
                            {tx.confirmations > 0 && (
                              <span className="text-xs">({tx.confirmations})</span>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-gray-500">
                            <p>{new Date(tx.timestamp).toLocaleTimeString()}</p>
                            <p>{new Date(tx.timestamp).toLocaleDateString()}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => setSelectedTransaction(tx)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Transaction Details</DialogTitle>
                                  <DialogDescription>
                                    Complete transaction information and metadata
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedTransaction && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm text-gray-500">Transaction Hash</p>
                                        <div className="flex items-center gap-2">
                                          <code className="text-sm">{selectedTransaction.hash}</code>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0"
                                            onClick={() => copyToClipboard(selectedTransaction.hash)}
                                          >
                                            <Copy className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-500">Status</p>
                                        <Badge className={getStatusColor(selectedTransaction.status)}>
                                          {selectedTransaction.status}
                                        </Badge>
                                      </div>
                                    </div>
                                    
                                    {selectedTransaction.blockNumber && (
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm text-gray-500">Block Number</p>
                                          <p className="font-mono">{selectedTransaction.blockNumber}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">Confirmations</p>
                                          <p>{selectedTransaction.confirmations}</p>
                                        </div>
                                      </div>
                                    )}
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm text-gray-500">From</p>
                                        <code className="text-sm">{selectedTransaction.from}</code>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-500">To</p>
                                        <code className="text-sm">{selectedTransaction.to}</code>
                                      </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm text-gray-500">Value</p>
                                        <p className="text-xl font-bold">
                                          ${selectedTransaction.value.toLocaleString()}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-500">Transaction Fee</p>
                                        <p>${selectedTransaction.fee.toLocaleString()}</p>
                                      </div>
                                    </div>
                                    
                                    {selectedTransaction.gasUsed && (
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm text-gray-500">Gas Used</p>
                                          <p>{selectedTransaction.gasUsed.toLocaleString()}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">Gas Price</p>
                                          <p>{selectedTransaction.gasPrice} Gwei</p>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {selectedTransaction.property && (
                                      <div>
                                        <p className="text-sm text-gray-500">Property</p>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                          <p className="font-medium">{selectedTransaction.property.name}</p>
                                          <p className="text-sm text-gray-500">
                                            Token ID: {selectedTransaction.property.tokenId}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {selectedTransaction.metadata && (
                                      <div>
                                        <p className="text-sm text-gray-500 mb-2">Metadata</p>
                                        <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                                          <p className="text-sm">
                                            <span className="text-gray-500">Method:</span> {selectedTransaction.metadata.method}
                                          </p>
                                          <p className="text-sm">
                                            <span className="text-gray-500">Network:</span> {selectedTransaction.metadata.network}
                                          </p>
                                          <p className="text-sm">
                                            <span className="text-gray-500">Nonce:</span> {selectedTransaction.metadata.nonce}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {selectedTransaction.flags && selectedTransaction.flags.length > 0 && (
                                      <Alert className="border-yellow-200 bg-yellow-50">
                                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                                        <AlertDescription>
                                          <p className="font-medium text-yellow-800">Risk Flags</p>
                                          <div className="flex gap-2 mt-2">
                                            {selectedTransaction.flags.map(flag => (
                                              <Badge key={flag} variant="outline" className="text-yellow-700">
                                                {flag}
                                              </Badge>
                                            ))}
                                          </div>
                                        </AlertDescription>
                                      </Alert>
                                    )}
                                    
                                    <div className="flex justify-end gap-2">
                                      <Button variant="outline" className="gap-2">
                                        <ExternalLink className="h-4 w-4" />
                                        View on Explorer
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}