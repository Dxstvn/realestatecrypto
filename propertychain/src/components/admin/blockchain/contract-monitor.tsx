/**
 * Smart Contract Monitor Component - PropertyChain Admin
 * 
 * Monitor and manage deployed smart contracts
 * Following UpdatedUIPlan.md Step 55.5 specifications and CLAUDE.md principles
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Shield, Activity, AlertTriangle, CheckCircle, XCircle,
  Pause, Play, RefreshCw, Code, FileText, Clock,
  Zap, Database, Hash, ExternalLink, Copy, Eye,
  Settings, Download, Upload, Info, TrendingUp,
  AlertCircle, Lock, Unlock, Terminal, Box
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

// Contract interface
export interface SmartContract {
  id: string
  name: string
  address: string
  network: 'ethereum' | 'polygon' | 'arbitrum' | 'optimism'
  type: 'property' | 'mortgage' | 'token' | 'governance' | 'utility'
  status: 'active' | 'paused' | 'upgrading' | 'deprecated'
  version: string
  deployedAt: Date
  lastActivity: Date
  owner: string
  balance: number
  transactionCount: number
  isPaused: boolean
  isUpgradeable: boolean
  verificationStatus: 'verified' | 'unverified' | 'pending'
  abi?: any[]
  metrics?: {
    gasUsed: number
    avgGasPrice: number
    successRate: number
    errorCount: number
  }
}

// Function call interface
interface FunctionCall {
  id: string
  contractId: string
  function: string
  caller: string
  timestamp: Date
  status: 'success' | 'failed' | 'pending'
  gasUsed: number
  value: number
  args: any[]
  result?: any
  error?: string
  txHash: string
}

// Event log interface
interface EventLog {
  id: string
  contractId: string
  event: string
  timestamp: Date
  blockNumber: number
  transactionHash: string
  args: Record<string, any>
  topics: string[]
}

export function ContractMonitor() {
  const [contracts, setContracts] = useState<SmartContract[]>([])
  const [selectedContract, setSelectedContract] = useState<SmartContract | null>(null)
  const [functionCalls, setFunctionCalls] = useState<FunctionCall[]>([])
  const [eventLogs, setEventLogs] = useState<EventLog[]>([])
  const [isEmergencyMode, setIsEmergencyMode] = useState(false)
  const [filter, setFilter] = useState({
    network: 'all',
    type: 'all',
    status: 'all',
    search: ''
  })
  const [isLive, setIsLive] = useState(true)

  // Generate sample contracts
  useEffect(() => {
    const sampleContracts: SmartContract[] = [
      {
        id: 'contract-1',
        name: 'PropertyTokenFactory',
        address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7',
        network: 'ethereum',
        type: 'property',
        status: 'active',
        version: '2.1.0',
        deployedAt: new Date('2024-01-15'),
        lastActivity: new Date(Date.now() - 1000 * 60 * 5),
        owner: '0x5aAeb6053f3E94C9b9A09f33669435E7Ef1BeAed',
        balance: 5.234,
        transactionCount: 15234,
        isPaused: false,
        isUpgradeable: true,
        verificationStatus: 'verified',
        metrics: {
          gasUsed: 12500000,
          avgGasPrice: 35,
          successRate: 98.5,
          errorCount: 23
        }
      },
      {
        id: 'contract-2',
        name: 'MortgageManager',
        address: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
        network: 'polygon',
        type: 'mortgage',
        status: 'active',
        version: '1.8.2',
        deployedAt: new Date('2024-02-20'),
        lastActivity: new Date(Date.now() - 1000 * 60 * 15),
        owner: '0x5aAeb6053f3E94C9b9A09f33669435E7Ef1BeAed',
        balance: 125.45,
        transactionCount: 8921,
        isPaused: false,
        isUpgradeable: true,
        verificationStatus: 'verified',
        metrics: {
          gasUsed: 8900000,
          avgGasPrice: 25,
          successRate: 99.2,
          errorCount: 7
        }
      },
      {
        id: 'contract-3',
        name: 'GovernanceToken',
        address: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
        network: 'arbitrum',
        type: 'governance',
        status: 'paused',
        version: '1.0.0',
        deployedAt: new Date('2024-03-10'),
        lastActivity: new Date(Date.now() - 1000 * 60 * 60),
        owner: '0x5aAeb6053f3E94C9b9A09f33669435E7Ef1BeAed',
        balance: 0.5,
        transactionCount: 3456,
        isPaused: true,
        isUpgradeable: false,
        verificationStatus: 'verified',
        metrics: {
          gasUsed: 3400000,
          avgGasPrice: 15,
          successRate: 97.8,
          errorCount: 15
        }
      },
      {
        id: 'contract-4',
        name: 'PaymentProcessor',
        address: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
        network: 'optimism',
        type: 'utility',
        status: 'upgrading',
        version: '3.0.0-beta',
        deployedAt: new Date('2023-12-01'),
        lastActivity: new Date(),
        owner: '0x5aAeb6053f3E94C9b9A09f33669435E7Ef1BeAed',
        balance: 45.67,
        transactionCount: 28934,
        isPaused: true,
        isUpgradeable: true,
        verificationStatus: 'pending',
        metrics: {
          gasUsed: 25600000,
          avgGasPrice: 20,
          successRate: 96.5,
          errorCount: 89
        }
      }
    ]
    setContracts(sampleContracts)
  }, [])

  // Generate sample function calls
  useEffect(() => {
    const functions = ['mint', 'transfer', 'approve', 'burn', 'pause', 'unpause', 'upgrade']
    const calls: FunctionCall[] = Array.from({ length: 50 }, (_, i) => ({
      id: `call-${i}`,
      contractId: contracts[Math.floor(Math.random() * contracts.length)]?.id || 'contract-1',
      function: functions[Math.floor(Math.random() * functions.length)],
      caller: `0x${Math.random().toString(16).substr(2, 40)}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000),
      status: Math.random() > 0.1 ? 'success' : Math.random() > 0.5 ? 'failed' : 'pending',
      gasUsed: Math.floor(21000 + Math.random() * 100000),
      value: Math.random() * 10,
      args: [
        `0x${Math.random().toString(16).substr(2, 40)}`,
        Math.floor(Math.random() * 1000)
      ],
      result: Math.random() > 0.5 ? { success: true } : undefined,
      error: Math.random() > 0.9 ? 'Execution reverted' : undefined,
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`
    }))
    setFunctionCalls(calls)
  }, [contracts])

  // Generate sample event logs
  useEffect(() => {
    const events = ['Transfer', 'Approval', 'Mint', 'Burn', 'Paused', 'Unpaused', 'OwnershipTransferred']
    const logs: EventLog[] = Array.from({ length: 100 }, (_, i) => ({
      id: `event-${i}`,
      contractId: contracts[Math.floor(Math.random() * contracts.length)]?.id || 'contract-1',
      event: events[Math.floor(Math.random() * events.length)],
      timestamp: new Date(Date.now() - Math.random() * 86400000),
      blockNumber: 15000000 + Math.floor(Math.random() * 10000),
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      args: {
        from: `0x${Math.random().toString(16).substr(2, 40)}`,
        to: `0x${Math.random().toString(16).substr(2, 40)}`,
        value: Math.floor(Math.random() * 1000000)
      },
      topics: [
        `0x${Math.random().toString(16).substr(2, 64)}`,
        `0x${Math.random().toString(16).substr(2, 64)}`
      ]
    }))
    setEventLogs(logs)
  }, [contracts])

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      // Update contract metrics
      setContracts(prev => prev.map(contract => ({
        ...contract,
        lastActivity: new Date(),
        transactionCount: contract.transactionCount + Math.floor(Math.random() * 5),
        metrics: contract.metrics ? {
          ...contract.metrics,
          gasUsed: contract.metrics.gasUsed + Math.floor(Math.random() * 100000),
          errorCount: contract.metrics.errorCount + (Math.random() > 0.9 ? 1 : 0)
        } : undefined
      })))

      // Add new function call
      const newCall: FunctionCall = {
        id: `call-${Date.now()}`,
        contractId: contracts[Math.floor(Math.random() * contracts.length)]?.id || 'contract-1',
        function: ['mint', 'transfer', 'approve'][Math.floor(Math.random() * 3)],
        caller: `0x${Math.random().toString(16).substr(2, 40)}`,
        timestamp: new Date(),
        status: 'pending',
        gasUsed: 0,
        value: Math.random() * 10,
        args: [],
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`
      }
      setFunctionCalls(prev => [newCall, ...prev].slice(0, 100))

      // Add new event
      const newEvent: EventLog = {
        id: `event-${Date.now()}`,
        contractId: contracts[Math.floor(Math.random() * contracts.length)]?.id || 'contract-1',
        event: ['Transfer', 'Approval'][Math.floor(Math.random() * 2)],
        timestamp: new Date(),
        blockNumber: 15010000 + Math.floor(Math.random() * 100),
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        args: {},
        topics: []
      }
      setEventLogs(prev => [newEvent, ...prev].slice(0, 200))
    }, 3000)

    return () => clearInterval(interval)
  }, [isLive, contracts])

  // Filter contracts
  const filteredContracts = contracts.filter(contract => {
    if (filter.network !== 'all' && contract.network !== filter.network) return false
    if (filter.type !== 'all' && contract.type !== filter.type) return false
    if (filter.status !== 'all' && contract.status !== filter.status) return false
    if (filter.search) {
      const search = filter.search.toLowerCase()
      return contract.name.toLowerCase().includes(search) ||
             contract.address.toLowerCase().includes(search)
    }
    return true
  })

  // Get status color
  const getStatusColor = (status: SmartContract['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'paused': return 'bg-yellow-100 text-yellow-700'
      case 'upgrading': return 'bg-blue-100 text-blue-700'
      case 'deprecated': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  // Pause contract
  const pauseContract = (contract: SmartContract) => {
    console.log('Pausing contract:', contract.address)
    setContracts(prev => prev.map(c => 
      c.id === contract.id ? { ...c, status: 'paused', isPaused: true } : c
    ))
  }

  // Resume contract
  const resumeContract = (contract: SmartContract) => {
    console.log('Resuming contract:', contract.address)
    setContracts(prev => prev.map(c => 
      c.id === contract.id ? { ...c, status: 'active', isPaused: false } : c
    ))
  }

  // Calculate total metrics
  const totalMetrics = {
    totalContracts: contracts.length,
    activeContracts: contracts.filter(c => c.status === 'active').length,
    totalBalance: contracts.reduce((sum, c) => sum + c.balance, 0),
    totalTransactions: contracts.reduce((sum, c) => sum + c.transactionCount, 0),
    totalGasUsed: contracts.reduce((sum, c) => sum + (c.metrics?.gasUsed || 0), 0),
    avgSuccessRate: contracts.reduce((sum, c) => sum + (c.metrics?.successRate || 0), 0) / contracts.length
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={filter.network} onValueChange={v => setFilter(prev => ({ ...prev, network: v }))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Networks</SelectItem>
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="polygon">Polygon</SelectItem>
              <SelectItem value="arbitrum">Arbitrum</SelectItem>
              <SelectItem value="optimism">Optimism</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filter.type} onValueChange={v => setFilter(prev => ({ ...prev, type: v }))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="property">Property</SelectItem>
              <SelectItem value="mortgage">Mortgage</SelectItem>
              <SelectItem value="governance">Governance</SelectItem>
              <SelectItem value="utility">Utility</SelectItem>
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
          <Button
            variant={isEmergencyMode ? 'destructive' : 'outline'}
            onClick={() => setIsEmergencyMode(!isEmergencyMode)}
            className="gap-2"
          >
            <Shield className="h-4 w-4" />
            Emergency Mode
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Deploy Contract
          </Button>
        </div>
      </div>

      {/* Emergency Mode Alert */}
      {isEmergencyMode && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Emergency Mode Active:</strong> All contract functions are restricted. 
            Only emergency actions are available.
          </AlertDescription>
        </Alert>
      )}

      {/* Contract Metrics */}
      <div className="grid grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total Contracts</p>
                <p className="text-xl font-bold">{totalMetrics.totalContracts}</p>
              </div>
              <Box className="h-6 w-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Active</p>
                <p className="text-xl font-bold">{totalMetrics.activeContracts}</p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total Balance</p>
                <p className="text-xl font-bold">{totalMetrics.totalBalance.toFixed(2)} ETH</p>
              </div>
              <Database className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Transactions</p>
                <p className="text-xl font-bold">{(totalMetrics.totalTransactions / 1000).toFixed(1)}K</p>
              </div>
              <Activity className="h-6 w-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Gas Used</p>
                <p className="text-xl font-bold">{(totalMetrics.totalGasUsed / 1000000).toFixed(1)}M</p>
              </div>
              <Zap className="h-6 w-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Success Rate</p>
                <p className="text-xl font-bold">{totalMetrics.avgSuccessRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="contracts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="functions">Function Calls</TabsTrigger>
          <TabsTrigger value="events">Event Logs</TabsTrigger>
          <TabsTrigger value="controls">Emergency Controls</TabsTrigger>
        </TabsList>

        {/* Contracts Tab */}
        <TabsContent value="contracts">
          <Card>
            <CardHeader>
              <CardTitle>Deployed Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contract</TableHead>
                    <TableHead>Network</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.map(contract => (
                    <TableRow key={contract.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{contract.name}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <code className="text-xs text-gray-500">
                              {contract.address.slice(0, 10)}...{contract.address.slice(-8)}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0"
                              onClick={() => navigator.clipboard.writeText(contract.address)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {contract.network}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">{contract.type}</TableCell>
                      <TableCell>
                        <Badge className={cn("text-xs", getStatusColor(contract.status))}>
                          {contract.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-sm">v{contract.version}</span>
                          {contract.isUpgradeable && (
                            <Badge variant="secondary" className="text-xs">
                              Upgradeable
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{contract.balance.toFixed(3)} ETH</TableCell>
                      <TableCell>{contract.transactionCount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {contract.status === 'active' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => pauseContract(contract)}
                              disabled={!isEmergencyMode}
                            >
                              <Pause className="h-4 w-4" />
                            </Button>
                          ) : contract.status === 'paused' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => resumeContract(contract)}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          ) : null}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedContract(contract)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>{contract.name}</DialogTitle>
                                <DialogDescription>Contract Details and Metrics</DialogDescription>
                              </DialogHeader>
                              {selectedContract && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Address</Label>
                                      <div className="flex items-center gap-2">
                                        <code className="text-sm">{selectedContract.address}</code>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                          <Copy className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                    <div>
                                      <Label>Owner</Label>
                                      <code className="text-sm">{selectedContract.owner}</code>
                                    </div>
                                  </div>
                                  {selectedContract.metrics && (
                                    <div className="grid grid-cols-4 gap-4">
                                      <div>
                                        <p className="text-sm text-gray-500">Success Rate</p>
                                        <p className="text-lg font-bold">{selectedContract.metrics.successRate}%</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-500">Avg Gas Price</p>
                                        <p className="text-lg font-bold">{selectedContract.metrics.avgGasPrice} Gwei</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-500">Gas Used</p>
                                        <p className="text-lg font-bold">{(selectedContract.metrics.gasUsed / 1000000).toFixed(1)}M</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-500">Errors</p>
                                        <p className="text-lg font-bold">{selectedContract.metrics.errorCount}</p>
                                      </div>
                                    </div>
                                  )}
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline">View on Explorer</Button>
                                    <Button>Interact with Contract</Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Function Calls Tab */}
        <TabsContent value="functions">
          <Card>
            <CardHeader>
              <CardTitle>Function Call History</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Function</TableHead>
                      <TableHead>Contract</TableHead>
                      <TableHead>Caller</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Gas Used</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Tx Hash</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                      {functionCalls.slice(0, 50).map(call => (
                        <motion.tr
                          key={call.id}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Terminal className="h-4 w-4 text-gray-500" />
                              <span className="font-mono text-sm">{call.function}()</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {contracts.find(c => c.id === call.contractId)?.name || 'Unknown'}
                          </TableCell>
                          <TableCell>
                            <code className="text-xs">
                              {call.caller.slice(0, 8)}...{call.caller.slice(-6)}
                            </code>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn(
                              "text-xs",
                              call.status === 'success' && "bg-green-100 text-green-700",
                              call.status === 'failed' && "bg-red-100 text-red-700",
                              call.status === 'pending' && "bg-yellow-100 text-yellow-700"
                            )}>
                              {call.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{call.gasUsed.toLocaleString()}</TableCell>
                          <TableCell>{call.value.toFixed(4)} ETH</TableCell>
                          <TableCell>
                            <div className="text-xs">
                              {call.timestamp.toLocaleTimeString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <code className="text-xs">
                                {call.txHash.slice(0, 8)}...
                              </code>
                              <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Event Logs Tab */}
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Event Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {eventLogs.slice(0, 50).map(log => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {log.event}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                Block #{log.blockNumber}
                              </span>
                              <span className="text-xs text-gray-500">
                                {log.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-500">Contract: </span>
                              <span className="font-mono">
                                {contracts.find(c => c.id === log.contractId)?.name || 'Unknown'}
                              </span>
                            </div>
                            {Object.keys(log.args).length > 0 && (
                              <div className="text-xs text-gray-600">
                                Args: {JSON.stringify(log.args, null, 2).slice(0, 100)}...
                              </div>
                            )}
                          </div>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency Controls Tab */}
        <TabsContent value="controls">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Emergency actions will affect all contracts immediately. Use with caution.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Pause All Contracts</p>
                      <p className="text-sm text-gray-500">Stop all contract operations</p>
                    </div>
                    <Switch checked={isEmergencyMode} onCheckedChange={setIsEmergencyMode} />
                  </div>

                  <Button
                    variant="destructive"
                    className="w-full"
                    disabled={!isEmergencyMode}
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Pause All Contracts
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={!isEmergencyMode}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Lock All Withdrawals
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={!isEmergencyMode}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Enable Maintenance Mode
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recovery Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Restore from Backup
                  </Button>

                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upgrade Contracts
                  </Button>

                  <Button variant="outline" className="w-full">
                    <Database className="h-4 w-4 mr-2" />
                    Export State
                  </Button>

                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Audit Report
                  </Button>
                </div>

                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    Last backup: 2 hours ago. All contracts are verified on Etherscan.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}