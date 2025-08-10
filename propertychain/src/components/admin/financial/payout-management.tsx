/**
 * Payout Management Component - PropertyChain Admin
 * 
 * Manage investor payouts, property owner distributions, and commission payments
 * Following UpdatedUIPlan.md Step 55.4 specifications and CLAUDE.md principles
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
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
  DollarSign, Send, Clock, CheckCircle, XCircle, AlertTriangle,
  TrendingUp, Users, Building2, Wallet, Calculator, FileText,
  Download, Upload, RefreshCw, Info, ArrowRight, Calendar,
  CreditCard, PiggyBank, Shield, Zap, ChevronRight, Hash, Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Payout types
export interface Payout {
  id: string
  type: 'dividend' | 'rental' | 'sale_proceeds' | 'commission' | 'refund'
  status: 'scheduled' | 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  recipient: {
    id: string
    name: string
    email: string
    wallet: string
    type: 'investor' | 'property_owner' | 'agent' | 'platform'
  }
  property?: {
    id: string
    name: string
    tokenId: string
  }
  amount: number
  currency: 'USD' | 'ETH' | 'USDC'
  scheduledDate: Date
  processedDate?: Date
  transactionHash?: string
  method: 'crypto' | 'bank_transfer' | 'check'
  notes?: string
  metadata?: {
    period?: string
    shares?: number
    rate?: number
    deductions?: Array<{ type: string; amount: number }>
  }
}

// Payout batch
interface PayoutBatch {
  id: string
  name: string
  type: 'monthly_dividends' | 'quarterly_distribution' | 'sale_proceeds' | 'custom'
  status: 'draft' | 'approved' | 'processing' | 'completed'
  totalAmount: number
  recipientCount: number
  payouts: Payout[]
  createdAt: Date
  scheduledFor: Date
  approvedBy?: string
  processedAt?: Date
}

// Payout statistics
interface PayoutStats {
  totalPending: number
  totalProcessing: number
  totalCompleted: number
  totalFailed: number
  pendingAmount: number
  completedAmount: number
  averageProcessingTime: number
  successRate: number
}

export function PayoutManagement() {
  const [selectedBatch, setSelectedBatch] = useState<PayoutBatch | null>(null)
  const [selectedPayouts, setSelectedPayouts] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState({
    type: 'all',
    status: 'all',
    search: ''
  })
  const [isCreatingBatch, setIsCreatingBatch] = useState(false)
  const [newBatch, setNewBatch] = useState({
    name: '',
    type: 'monthly_dividends',
    scheduledFor: '',
    notes: ''
  })

  // Sample payout data
  const generatePayouts = (): Payout[] => {
    const recipients = [
      { id: 'usr-1', name: 'John Smith', email: 'john@example.com', wallet: '0x123...abc', type: 'investor' as const },
      { id: 'usr-2', name: 'Emily Chen', email: 'emily@example.com', wallet: '0x456...def', type: 'property_owner' as const },
      { id: 'usr-3', name: 'Michael Brown', email: 'michael@example.com', wallet: '0x789...ghi', type: 'investor' as const },
      { id: 'usr-4', name: 'Sarah Wilson', email: 'sarah@example.com', wallet: '0xabc...jkl', type: 'agent' as const }
    ]
    
    const properties = [
      { id: 'prop-1', name: 'Marina Bay Towers #2501', tokenId: '0x123' },
      { id: 'prop-2', name: 'Sunset Plaza #1203', tokenId: '0x456' },
      { id: 'prop-3', name: 'The Grand Estate', tokenId: '0x789' }
    ]
    
    return Array.from({ length: 50 }, (_, i) => ({
      id: `payout-${i + 1}`,
      type: ['dividend', 'rental', 'sale_proceeds', 'commission'][Math.floor(Math.random() * 4)] as any,
      status: ['scheduled', 'pending', 'processing', 'completed', 'failed'][Math.floor(Math.random() * 5)] as any,
      recipient: recipients[Math.floor(Math.random() * recipients.length)],
      property: Math.random() > 0.3 ? properties[Math.floor(Math.random() * properties.length)] : undefined,
      amount: Math.floor(1000 + Math.random() * 50000),
      currency: ['USD', 'ETH', 'USDC'][Math.floor(Math.random() * 3)] as any,
      scheduledDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
      processedDate: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined,
      transactionHash: Math.random() > 0.5 ? `0x${Math.random().toString(36).substr(2, 64)}` : undefined,
      method: ['crypto', 'bank_transfer'][Math.floor(Math.random() * 2)] as any,
      metadata: {
        period: 'Q4 2024',
        shares: Math.floor(10 + Math.random() * 100),
        rate: 5 + Math.random() * 10,
        deductions: [
          { type: 'Management Fee', amount: Math.floor(50 + Math.random() * 200) },
          { type: 'Tax Withholding', amount: Math.floor(100 + Math.random() * 500) }
        ]
      }
    }))
  }

  const [payouts] = useState<Payout[]>(generatePayouts())

  // Sample batch data
  const batches: PayoutBatch[] = [
    {
      id: 'batch-1',
      name: 'December 2024 Dividends',
      type: 'monthly_dividends',
      status: 'approved',
      totalAmount: 285000,
      recipientCount: 127,
      payouts: payouts.slice(0, 10),
      createdAt: new Date('2024-12-01'),
      scheduledFor: new Date('2024-12-15'),
      approvedBy: 'admin@propertychain.com'
    },
    {
      id: 'batch-2',
      name: 'Q4 2024 Property Returns',
      type: 'quarterly_distribution',
      status: 'processing',
      totalAmount: 1250000,
      recipientCount: 342,
      payouts: payouts.slice(10, 25),
      createdAt: new Date('2024-12-10'),
      scheduledFor: new Date('2024-12-20')
    },
    {
      id: 'batch-3',
      name: 'Marina Bay Sale Distribution',
      type: 'sale_proceeds',
      status: 'draft',
      totalAmount: 3500000,
      recipientCount: 85,
      payouts: payouts.slice(25, 35),
      createdAt: new Date('2024-12-12'),
      scheduledFor: new Date('2024-12-25')
    }
  ]

  // Calculate statistics
  const stats: PayoutStats = {
    totalPending: payouts.filter(p => p.status === 'pending').length,
    totalProcessing: payouts.filter(p => p.status === 'processing').length,
    totalCompleted: payouts.filter(p => p.status === 'completed').length,
    totalFailed: payouts.filter(p => p.status === 'failed').length,
    pendingAmount: payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    completedAmount: payouts.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    averageProcessingTime: 2.4, // hours
    successRate: 96.5
  }

  // Filter payouts
  const filteredPayouts = payouts.filter(payout => {
    if (filter.type !== 'all' && payout.type !== filter.type) return false
    if (filter.status !== 'all' && payout.status !== filter.status) return false
    if (filter.search) {
      const search = filter.search.toLowerCase()
      return payout.recipient.name.toLowerCase().includes(search) ||
             payout.recipient.email.toLowerCase().includes(search) ||
             payout.property?.name.toLowerCase().includes(search)
    }
    return true
  })

  // Get status color
  const getStatusColor = (status: Payout['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-50 text-green-700 border-green-200'
      case 'processing': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'scheduled': return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'failed': return 'bg-red-50 text-red-700 border-red-200'
      case 'cancelled': return 'bg-gray-50 text-gray-500 border-gray-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  // Get type icon
  const getTypeIcon = (type: Payout['type']) => {
    switch (type) {
      case 'dividend': return TrendingUp
      case 'rental': return Building2
      case 'sale_proceeds': return DollarSign
      case 'commission': return Users
      case 'refund': return RefreshCw
      default: return DollarSign
    }
  }

  // Process batch
  const processBatch = (batch: PayoutBatch) => {
    console.log('Processing batch:', batch)
  }

  // Approve payout
  const approvePayout = (payoutId: string) => {
    console.log('Approving payout:', payoutId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payout Management</h2>
          <p className="text-gray-500">Manage and process all platform payouts</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Dialog open={isCreatingBatch} onOpenChange={setIsCreatingBatch}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Zap className="h-4 w-4" />
                Create Batch
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Payout Batch</DialogTitle>
                <DialogDescription>
                  Create a new batch of payouts for processing
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label>Batch Name</Label>
                  <Input
                    placeholder="e.g., December 2024 Dividends"
                    value={newBatch.name}
                    onChange={(e) => setNewBatch(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label>Type</Label>
                  <Select
                    value={newBatch.type}
                    onValueChange={(value) => setNewBatch(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly_dividends">Monthly Dividends</SelectItem>
                      <SelectItem value="quarterly_distribution">Quarterly Distribution</SelectItem>
                      <SelectItem value="sale_proceeds">Sale Proceeds</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Scheduled Date</Label>
                  <Input
                    type="date"
                    value={newBatch.scheduledFor}
                    onChange={(e) => setNewBatch(prev => ({ ...prev, scheduledFor: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Additional notes or instructions..."
                    value={newBatch.notes}
                    onChange={(e) => setNewBatch(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    After creating the batch, you can add individual payouts and submit for approval.
                  </AlertDescription>
                </Alert>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreatingBatch(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  console.log('Creating batch:', newBatch)
                  setIsCreatingBatch(false)
                }}>
                  Create Batch
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Amount</p>
                <p className="text-2xl font-bold">${(stats.pendingAmount / 1000).toFixed(1)}K</p>
                <p className="text-xs text-gray-500 mt-1">{stats.totalPending} payouts</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Processing</p>
                <p className="text-2xl font-bold">{stats.totalProcessing}</p>
                <p className="text-xs text-gray-500 mt-1">In progress</p>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-500 opacity-20 animate-spin" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold">${(stats.completedAmount / 1000000).toFixed(2)}M</p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Success Rate</p>
                <p className="text-2xl font-bold">{stats.successRate}%</p>
                <p className="text-xs text-gray-500 mt-1">Avg: {stats.averageProcessingTime}h</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {stats.totalFailed > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{stats.totalFailed} payouts failed</strong> in the last 24 hours. 
            Review and retry these transactions to ensure timely payments.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="batches" className="space-y-4">
        <TabsList>
          <TabsTrigger value="batches">Payout Batches</TabsTrigger>
          <TabsTrigger value="individual">Individual Payouts</TabsTrigger>
          <TabsTrigger value="schedule">Payment Schedule</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Batches Tab */}
        <TabsContent value="batches">
          <div className="grid grid-cols-3 gap-6">
            {/* Batch List */}
            <div className="col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Active Batches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {batches.map(batch => (
                      <div
                        key={batch.id}
                        className={cn(
                          "p-4 border rounded-lg cursor-pointer transition-all",
                          selectedBatch?.id === batch.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                        )}
                        onClick={() => setSelectedBatch(batch)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{batch.name}</h3>
                              <Badge className={cn(
                                batch.status === 'completed' && "bg-green-100 text-green-700",
                                batch.status === 'processing' && "bg-blue-100 text-blue-700",
                                batch.status === 'approved' && "bg-purple-100 text-purple-700",
                                batch.status === 'draft' && "bg-gray-100 text-gray-700"
                              )}>
                                {batch.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">
                              {batch.recipientCount} recipients • ${(batch.totalAmount / 1000).toFixed(0)}K total
                            </p>
                            <p className="text-xs text-gray-400">
                              Scheduled for {batch.scheduledFor.toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            {batch.status === 'draft' && (
                              <Button size="sm" variant="outline">
                                Submit for Approval
                              </Button>
                            )}
                            {batch.status === 'approved' && (
                              <Button size="sm" onClick={() => processBatch(batch)}>
                                Process Now
                              </Button>
                            )}
                            {batch.status === 'processing' && (
                              <div className="flex items-center gap-2">
                                <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                                <span className="text-sm text-blue-600">Processing...</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {batch.status === 'processing' && (
                          <Progress value={65} className="mt-3 h-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Batch Details */}
            <div>
              {selectedBatch ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Batch Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-2xl font-bold">
                        ${(selectedBatch.totalAmount / 1000).toFixed(0)}K
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Recipients</p>
                      <p className="text-lg font-semibold">{selectedBatch.recipientCount}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <Badge variant="outline" className="text-xs">
                        {selectedBatch.type.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="text-sm">{selectedBatch.createdAt.toLocaleDateString()}</p>
                    </div>
                    
                    {selectedBatch.approvedBy && (
                      <div>
                        <p className="text-sm text-gray-500">Approved By</p>
                        <p className="text-sm">{selectedBatch.approvedBy}</p>
                      </div>
                    )}
                    
                    <div className="pt-4 space-y-2">
                      <Button className="w-full gap-2">
                        <Eye className="h-4 w-4" />
                        View All Payouts
                      </Button>
                      <Button variant="outline" className="w-full gap-2">
                        <FileText className="h-4 w-4" />
                        Generate Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center text-gray-400">
                    <Calculator className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Select a batch to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Individual Payouts Tab */}
        <TabsContent value="individual">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Individual Payouts</CardTitle>
                <div className="flex items-center gap-2">
                  <Select
                    value={filter.type}
                    onValueChange={(value) => setFilter(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="dividend">Dividend</SelectItem>
                      <SelectItem value="rental">Rental</SelectItem>
                      <SelectItem value="sale_proceeds">Sale Proceeds</SelectItem>
                      <SelectItem value="commission">Commission</SelectItem>
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
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Scheduled</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayouts.map(payout => {
                      const TypeIcon = getTypeIcon(payout.type)
                      return (
                        <TableRow key={payout.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedPayouts.has(payout.id)}
                              onCheckedChange={(checked) => {
                                const newSelected = new Set(selectedPayouts)
                                if (checked) {
                                  newSelected.add(payout.id)
                                } else {
                                  newSelected.delete(payout.id)
                                }
                                setSelectedPayouts(newSelected)
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <TypeIcon className="h-4 w-4 text-gray-500" />
                              <span className="capitalize text-sm">
                                {payout.type.replace(/_/g, ' ')}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{payout.recipient.name}</p>
                              <p className="text-xs text-gray-500">{payout.recipient.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {payout.property ? (
                              <div>
                                <p className="text-sm">{payout.property.name}</p>
                                <p className="text-xs text-gray-500">{payout.property.tokenId}</p>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-semibold">
                                {payout.currency === 'USD' && '$'}
                                {payout.amount.toLocaleString()}
                                {payout.currency !== 'USD' && ` ${payout.currency}`}
                              </p>
                              {payout.metadata?.deductions && (
                                <p className="text-xs text-gray-500">
                                  After deductions
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {payout.method === 'crypto' ? (
                                <Wallet className="h-3 w-3 mr-1" />
                              ) : (
                                <CreditCard className="h-3 w-3 mr-1" />
                              )}
                              {payout.method.replace(/_/g, ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("text-xs", getStatusColor(payout.status))}>
                              {payout.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs">
                              <p>{payout.scheduledDate.toLocaleDateString()}</p>
                              <p className="text-gray-500">
                                {payout.scheduledDate.toLocaleTimeString()}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {payout.status === 'pending' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => approvePayout(payout.id)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Payment Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Calendar view placeholder */}
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 5
                    const date = new Date()
                    date.setDate(date.getDate() + day)
                    const hasPayouts = Math.random() > 0.7
                    
                    return (
                      <div
                        key={i}
                        className={cn(
                          "p-3 border rounded-lg text-center",
                          hasPayouts && "bg-blue-50 border-blue-200",
                          day === 0 && "ring-2 ring-blue-500"
                        )}
                      >
                        <p className="text-xs text-gray-500">
                          {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </p>
                        <p className="font-semibold">{date.getDate()}</p>
                        {hasPayouts && (
                          <div className="mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {Math.floor(5 + Math.random() * 20)}
                            </Badge>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                
                {/* Upcoming payouts */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Upcoming Payouts</h3>
                  <div className="space-y-2">
                    {batches.filter(b => b.status !== 'completed').map(batch => (
                      <div key={batch.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="font-medium">{batch.name}</p>
                            <p className="text-sm text-gray-500">
                              {batch.scheduledFor.toLocaleDateString()} • {batch.recipientCount} recipients
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${(batch.totalAmount / 1000).toFixed(0)}K</p>
                          <Badge variant="outline" className="text-xs">
                            {batch.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Summary stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Total Paid (YTD)</p>
                    <p className="text-xl font-bold">$12.5M</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Avg Processing Time</p>
                    <p className="text-xl font-bold">2.4h</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Success Rate</p>
                    <p className="text-xl font-bold">96.5%</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Total Recipients</p>
                    <p className="text-xl font-bold">3,247</p>
                  </div>
                </div>
                
                {/* Historical payouts table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {batches.map(batch => (
                      <TableRow key={batch.id}>
                        <TableCell>{batch.processedAt?.toLocaleDateString() || '-'}</TableCell>
                        <TableCell>{batch.name}</TableCell>
                        <TableCell>{batch.recipientCount}</TableCell>
                        <TableCell className="font-semibold">
                          ${(batch.totalAmount / 1000).toFixed(0)}K
                        </TableCell>
                        <TableCell>
                          <Badge className={cn(
                            batch.status === 'completed' && "bg-green-100 text-green-700"
                          )}>
                            {batch.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}