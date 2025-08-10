/**
 * Escrow Dashboard Component - PropertyChain
 * 
 * Comprehensive escrow management and balance tracking
 * Following UpdatedUIPlan.md Step 45 specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Lock,
  Unlock,
  Shield,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Calendar,
  Receipt,
  FileText,
  Download,
  Upload,
  Send,
  RefreshCw,
  MoreVertical,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Building,
  User,
  Scale,
  Gavel,
  Activity,
  PieChart,
  BarChart3,
  LineChart,
  Calculator,
  CreditCard,
  Percent,
  Hash,
  Timer,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  Filter,
  Search,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useToast } from '@/hooks/use-toast'

// Types
interface EscrowAccount {
  id: string
  propertyId: string
  propertyTitle: string
  balance: number
  lockedAmount: number
  availableAmount: number
  currency: string
  status: 'active' | 'pending' | 'closed' | 'disputed'
  createdAt: string
  lastActivity: string
  parties: {
    buyer: string
    seller: string
    escrowAgent?: string
  }
  releaseConditions: ReleaseCondition[]
  transactions: EscrowTransaction[]
  interestRate?: number
  accruedInterest?: number
}

interface ReleaseCondition {
  id: string
  type: 'inspection' | 'appraisal' | 'financing' | 'title' | 'custom'
  description: string
  status: 'pending' | 'met' | 'waived' | 'failed'
  deadline?: string
  verifiedBy?: string
  verifiedAt?: string
  documents?: string[]
}

interface EscrowTransaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'release' | 'refund' | 'interest' | 'fee'
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  initiatedBy: string
  approvedBy?: string
  description: string
  timestamp: string
  transactionHash?: string
  fees?: number
}

interface DisputeCase {
  id: string
  escrowId: string
  type: 'payment' | 'condition' | 'documentation' | 'other'
  status: 'open' | 'under_review' | 'resolved' | 'escalated'
  raisedBy: string
  description: string
  createdAt: string
  resolution?: string
  resolvedAt?: string
}

interface EscrowDashboardProps {
  accounts?: EscrowAccount[]
  onDeposit?: (accountId: string, amount: number) => void
  onRelease?: (accountId: string, amount: number) => void
  onDispute?: (accountId: string, dispute: Partial<DisputeCase>) => void
  onRefresh?: () => void
}

// Mock data for demonstration
const mockAccounts: EscrowAccount[] = [
  {
    id: 'esc-001',
    propertyId: 'prop-001',
    propertyTitle: '123 Main St, San Francisco',
    balance: 50000,
    lockedAmount: 45000,
    availableAmount: 5000,
    currency: 'USD',
    status: 'active',
    createdAt: '2024-01-15',
    lastActivity: '2024-01-20',
    parties: {
      buyer: 'John Doe',
      seller: 'Jane Smith',
      escrowAgent: 'PropertyChain Escrow',
    },
    releaseConditions: [
      {
        id: 'cond-001',
        type: 'inspection',
        description: 'Property inspection completed',
        status: 'met',
        deadline: '2024-01-25',
        verifiedBy: 'Inspector #123',
        verifiedAt: '2024-01-20',
      },
      {
        id: 'cond-002',
        type: 'financing',
        description: 'Loan approval received',
        status: 'pending',
        deadline: '2024-02-01',
      },
    ],
    transactions: [
      {
        id: 'tx-001',
        type: 'deposit',
        amount: 50000,
        currency: 'USD',
        status: 'completed',
        initiatedBy: 'John Doe',
        description: 'Initial earnest money deposit',
        timestamp: '2024-01-15T10:00:00Z',
        transactionHash: '0x123...',
      },
    ],
    interestRate: 2.5,
    accruedInterest: 125,
  },
]

export function EscrowDashboard({
  accounts = mockAccounts,
  onDeposit,
  onRelease,
  onDispute,
  onRefresh,
}: EscrowDashboardProps) {
  const { toast } = useToast()
  const [selectedAccount, setSelectedAccount] = useState<EscrowAccount | null>(accounts[0] || null)
  const [showReleaseDialog, setShowReleaseDialog] = useState(false)
  const [showDisputeDialog, setShowDisputeDialog] = useState(false)
  const [releaseAmount, setReleaseAmount] = useState('')
  const [disputeType, setDisputeType] = useState<DisputeCase['type']>('payment')
  const [disputeDescription, setDisputeDescription] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Calculate total balances
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
  const totalLocked = accounts.reduce((sum, acc) => sum + acc.lockedAmount, 0)
  const totalAvailable = accounts.reduce((sum, acc) => sum + acc.availableAmount, 0)
  const totalInterest = accounts.reduce((sum, acc) => sum + (acc.accruedInterest || 0), 0)

  // Filter accounts
  const filteredAccounts = accounts.filter(account => {
    if (filterStatus !== 'all' && account.status !== filterStatus) return false
    if (searchQuery && !account.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  // Handle release funds
  const handleRelease = () => {
    if (!selectedAccount || !releaseAmount) return

    const amount = parseFloat(releaseAmount)
    if (amount > selectedAccount.availableAmount) {
      toast({
        title: 'Insufficient funds',
        description: 'Release amount exceeds available balance',
        variant: 'destructive',
      })
      return
    }

    if (onRelease) {
      onRelease(selectedAccount.id, amount)
    }

    toast({
      title: 'Funds released',
      description: `$${amount.toLocaleString()} has been released from escrow`,
    })

    setShowReleaseDialog(false)
    setReleaseAmount('')
  }

  // Handle dispute
  const handleDispute = () => {
    if (!selectedAccount || !disputeDescription) return

    const dispute: Partial<DisputeCase> = {
      type: disputeType,
      description: disputeDescription,
      status: 'open',
      raisedBy: 'Current User', // Would come from auth context
      createdAt: new Date().toISOString(),
    }

    if (onDispute) {
      onDispute(selectedAccount.id, dispute)
    }

    toast({
      title: 'Dispute raised',
      description: 'Your dispute has been submitted for review',
    })

    setShowDisputeDialog(false)
    setDisputeDescription('')
  }

  // Get status color
  const getStatusColor = (status: EscrowAccount['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'disputed':
        return 'bg-red-100 text-red-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Get condition status icon
  const getConditionIcon = (status: ReleaseCondition['status']) => {
    switch (status) {
      case 'met':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'waived':
        return <AlertCircle className="h-4 w-4 text-blue-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Header with Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {accounts.length} escrow accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locked Funds</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalLocked.toLocaleString()}</div>
            <Progress value={(totalLocked / totalBalance) * 100} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Unlock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalAvailable.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Ready for release
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interest Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInterest.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600">+2.5%</span> APY average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Accounts List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Escrow Accounts</CardTitle>
                <Button variant="ghost" size="icon" onClick={onRefresh}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[100px] h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="disputed">Disputed</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-2 p-4">
                  {filteredAccounts.map((account) => (
                    <button
                      key={account.id}
                      onClick={() => setSelectedAccount(account)}
                      className={cn(
                        "w-full text-left p-4 rounded-lg border transition-all",
                        "hover:bg-muted/50",
                        selectedAccount?.id === account.id && "border-primary bg-primary/5"
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm line-clamp-1">
                            {account.propertyTitle}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            ID: {account.id}
                          </p>
                        </div>
                        <Badge className={cn("text-xs", getStatusColor(account.status))}>
                          {account.status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Balance</span>
                          <span className="font-medium">
                            ${account.balance.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Available</span>
                          <span className="text-green-600">
                            ${account.availableAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Last activity</span>
                          <span>{new Date(account.lastActivity).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Account Details */}
        <div className="lg:col-span-2">
          {selectedAccount ? (
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedAccount.propertyTitle}</CardTitle>
                    <CardDescription className="mt-2">
                      Escrow Account #{selectedAccount.id}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setShowReleaseDialog(true)}>
                        <Send className="h-4 w-4 mr-2" />
                        Release Funds
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowDisputeDialog(true)}>
                        <Gavel className="h-4 w-4 mr-2" />
                        Raise Dispute
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Export Statement
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="conditions">Conditions</TabsTrigger>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                    <TabsTrigger value="interest">Interest</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 mt-6">
                    {/* Balance Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Total Balance</p>
                              <p className="text-2xl font-bold">
                                ${selectedAccount.balance.toLocaleString()}
                              </p>
                            </div>
                            <Wallet className="h-8 w-8 text-primary/20" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Locked</p>
                              <p className="text-2xl font-bold text-orange-600">
                                ${selectedAccount.lockedAmount.toLocaleString()}
                              </p>
                            </div>
                            <Lock className="h-8 w-8 text-orange-600/20" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Available</p>
                              <p className="text-2xl font-bold text-green-600">
                                ${selectedAccount.availableAmount.toLocaleString()}
                              </p>
                            </div>
                            <Unlock className="h-8 w-8 text-green-600/20" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Parties */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Transaction Parties</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Buyer</p>
                              <p className="text-xs text-muted-foreground">
                                {selectedAccount.parties.buyer}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">Depositor</Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Seller</p>
                              <p className="text-xs text-muted-foreground">
                                {selectedAccount.parties.seller}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">Beneficiary</Badge>
                        </div>

                        {selectedAccount.parties.escrowAgent && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Shield className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">Escrow Agent</p>
                                <p className="text-xs text-muted-foreground">
                                  {selectedAccount.parties.escrowAgent}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline">Custodian</Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="conditions" className="space-y-4 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Release Conditions</CardTitle>
                        <CardDescription>
                          All conditions must be met before funds can be released
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedAccount.releaseConditions.map((condition) => (
                            <div
                              key={condition.id}
                              className="flex items-start gap-3 p-3 rounded-lg border"
                            >
                              {getConditionIcon(condition.status)}
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-sm">{condition.description}</p>
                                  <Badge
                                    variant={condition.status === 'met' ? 'default' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {condition.status}
                                  </Badge>
                                </div>
                                {condition.deadline && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Deadline: {new Date(condition.deadline).toLocaleDateString()}
                                  </p>
                                )}
                                {condition.verifiedBy && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Verified by {condition.verifiedBy} on{' '}
                                    {condition.verifiedAt && new Date(condition.verifiedAt).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="transactions" className="space-y-4 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Transaction History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Type</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedAccount.transactions.map((tx) => (
                              <TableRow key={tx.id}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {tx.type === 'deposit' ? (
                                      <ArrowDownLeft className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <ArrowUpRight className="h-4 w-4 text-red-600" />
                                    )}
                                    <span className="font-medium capitalize">{tx.type}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className={cn(
                                    "font-medium",
                                    tx.type === 'deposit' ? "text-green-600" : "text-red-600"
                                  )}>
                                    {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toLocaleString()}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={tx.status === 'completed' ? 'default' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {tx.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {new Date(tx.timestamp).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  {tx.transactionHash && (
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <ExternalLink className="h-4 w-4" />
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="interest" className="space-y-4 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Interest Accrual</CardTitle>
                        <CardDescription>
                          Earning {selectedAccount.interestRate || 0}% APY on escrow balance
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Interest Rate</p>
                            <p className="text-2xl font-bold">{selectedAccount.interestRate || 0}%</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Accrued Interest</p>
                            <p className="text-2xl font-bold text-green-600">
                              ${selectedAccount.accruedInterest?.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <Separator />

                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            Interest is calculated daily and compounds monthly. Interest earned will be
                            added to the available balance upon successful transaction completion.
                          </AlertDescription>
                        </Alert>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Daily Interest</span>
                            <span>
                              $
                              {(
                                (selectedAccount.balance * ((selectedAccount.interestRate || 0) / 100)) /
                                365
                              ).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Monthly Interest</span>
                            <span>
                              $
                              {(
                                (selectedAccount.balance * ((selectedAccount.interestRate || 0) / 100)) /
                                12
                              ).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Annual Interest</span>
                            <span>
                              $
                              {(
                                selectedAccount.balance * ((selectedAccount.interestRate || 0) / 100)
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <Shield className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">Select an escrow account to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Release Funds Dialog */}
      <Dialog open={showReleaseDialog} onOpenChange={setShowReleaseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Release Escrow Funds</DialogTitle>
            <DialogDescription>
              Release funds from escrow to the designated recipient
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="release-amount">Release Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="release-amount"
                  type="number"
                  placeholder="0.00"
                  value={releaseAmount}
                  onChange={(e) => setReleaseAmount(e.target.value)}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Available: ${selectedAccount?.availableAmount.toLocaleString()}
              </p>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Funds will be released to the seller's designated account. This action requires
                verification and cannot be reversed.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReleaseDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRelease}>Release Funds</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dispute Dialog */}
      <Dialog open={showDisputeDialog} onOpenChange={setShowDisputeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Raise a Dispute</DialogTitle>
            <DialogDescription>
              Submit a dispute for this escrow account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dispute-type">Dispute Type</Label>
              <Select value={disputeType} onValueChange={(value) => setDisputeType(value as DisputeCase['type'])}>
                <SelectTrigger id="dispute-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payment">Payment Issue</SelectItem>
                  <SelectItem value="condition">Condition Dispute</SelectItem>
                  <SelectItem value="documentation">Documentation Problem</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dispute-description">Description</Label>
              <Textarea
                id="dispute-description"
                placeholder="Describe the issue in detail..."
                value={disputeDescription}
                onChange={(e) => setDisputeDescription(e.target.value)}
                rows={4}
              />
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Your dispute will be reviewed by our resolution team within 24-48 hours.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisputeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDispute}>Submit Dispute</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}