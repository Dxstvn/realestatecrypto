/**
 * Payment Schedule Component - PropertyChain
 * 
 * Installment plans and payment scheduling management
 * Following UpdatedUIPlan.md Step 45 specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DollarSign,
  Calendar,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Calculator,
  Receipt,
  CreditCard,
  Bell,
  BellOff,
  Settings,
  Download,
  Upload,
  Send,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Percent,
  Hash,
  Timer,
  AlertCircle,
  CheckCircle2,
  Edit,
  Trash,
  Plus,
  Copy,
  ExternalLink,
  BarChart3,
  LineChart,
  PieChart,
  Wallet,
  Zap,
  Shield,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useToast } from '@/hooks/use-toast'

// Types
interface Payment {
  id: string
  number: number
  dueDate: string
  amount: number
  principal: number
  interest: number
  escrow?: number
  lateFee?: number
  status: 'scheduled' | 'pending' | 'paid' | 'late' | 'overdue'
  paidDate?: string
  paidAmount?: number
  transactionId?: string
  balance: number
  note?: string
}

interface PaymentScheduleData {
  propertyId: string
  propertyTitle: string
  loanAmount: number
  downPayment: number
  interestRate: number
  loanTerm: number // in months
  startDate: string
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly'
  payments: Payment[]
  totalPaid: number
  totalRemaining: number
  nextPayment?: Payment
  autoPayEnabled: boolean
  reminderSettings: ReminderSettings
  lateFeePolicy: LateFeePolicy
}

interface ReminderSettings {
  enabled: boolean
  daysBefore: number[]
  methods: ('email' | 'sms' | 'push')[]
}

interface LateFeePolicy {
  enabled: boolean
  gracePeriodDays: number
  feeType: 'fixed' | 'percentage'
  feeAmount: number
  maxFee?: number
}

interface PaymentScheduleProps {
  scheduleData?: PaymentScheduleData
  onPayment?: (paymentId: string, amount: number) => void
  onScheduleUpdate?: (schedule: PaymentScheduleData) => void
  onAutoPayToggle?: (enabled: boolean) => void
  onReminderUpdate?: (settings: ReminderSettings) => void
  editable?: boolean
}

// Helper functions
const calculateAmortization = (
  principal: number,
  rate: number,
  term: number,
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' = 'monthly'
): Payment[] => {
  const payments: Payment[] = []
  const periodsPerYear = frequency === 'weekly' ? 52 : frequency === 'biweekly' ? 26 : frequency === 'quarterly' ? 4 : 12
  const periodRate = rate / 100 / periodsPerYear
  const totalPeriods = frequency === 'weekly' ? term * 52 / 12 : frequency === 'biweekly' ? term * 26 / 12 : frequency === 'quarterly' ? term / 3 : term
  
  const monthlyPayment = principal * (periodRate * Math.pow(1 + periodRate, totalPeriods)) / 
                         (Math.pow(1 + periodRate, totalPeriods) - 1)
  
  let balance = principal
  const startDate = new Date()
  
  for (let i = 0; i < totalPeriods; i++) {
    const interestPayment = balance * periodRate
    const principalPayment = monthlyPayment - interestPayment
    balance -= principalPayment
    
    const dueDate = new Date(startDate)
    if (frequency === 'monthly') {
      dueDate.setMonth(dueDate.getMonth() + i)
    } else if (frequency === 'biweekly') {
      dueDate.setDate(dueDate.getDate() + (i * 14))
    } else if (frequency === 'weekly') {
      dueDate.setDate(dueDate.getDate() + (i * 7))
    } else if (frequency === 'quarterly') {
      dueDate.setMonth(dueDate.getMonth() + (i * 3))
    }
    
    payments.push({
      id: `payment-${i + 1}`,
      number: i + 1,
      dueDate: dueDate.toISOString(),
      amount: Math.round(monthlyPayment * 100) / 100,
      principal: Math.round(principalPayment * 100) / 100,
      interest: Math.round(interestPayment * 100) / 100,
      status: i === 0 ? 'pending' : 'scheduled',
      balance: Math.round(balance * 100) / 100,
    })
  }
  
  return payments
}

const getPaymentStatusColor = (status: Payment['status']) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'late':
      return 'bg-orange-100 text-orange-800'
    case 'overdue':
      return 'bg-red-100 text-red-800'
    case 'scheduled':
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getPaymentStatusIcon = (status: Payment['status']) => {
  switch (status) {
    case 'paid':
      return <CheckCircle2 className="h-4 w-4 text-green-600" />
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-600" />
    case 'late':
      return <AlertCircle className="h-4 w-4 text-orange-600" />
    case 'overdue':
      return <XCircle className="h-4 w-4 text-red-600" />
    case 'scheduled':
    default:
      return <Timer className="h-4 w-4 text-gray-600" />
  }
}

export function PaymentSchedule({
  scheduleData,
  onPayment,
  onScheduleUpdate,
  onAutoPayToggle,
  onReminderUpdate,
  editable = false,
}: PaymentScheduleProps) {
  const { toast } = useToast()
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  
  // Calculate schedule if not provided
  const [schedule, setSchedule] = useState<PaymentScheduleData>(() => {
    if (scheduleData) return scheduleData
    
    // Default schedule for demonstration
    const loanAmount = 400000
    const downPayment = 80000
    const principal = loanAmount - downPayment
    const interestRate = 5.5
    const loanTerm = 360 // 30 years in months
    
    return {
      propertyId: 'prop-001',
      propertyTitle: '123 Main St, San Francisco',
      loanAmount,
      downPayment,
      interestRate,
      loanTerm,
      startDate: new Date().toISOString(),
      frequency: 'monthly',
      payments: calculateAmortization(principal, interestRate, loanTerm),
      totalPaid: 0,
      totalRemaining: principal,
      nextPayment: undefined,
      autoPayEnabled: false,
      reminderSettings: {
        enabled: true,
        daysBefore: [7, 3, 1],
        methods: ['email', 'push'],
      },
      lateFeePolicy: {
        enabled: true,
        gracePeriodDays: 5,
        feeType: 'fixed',
        feeAmount: 50,
      },
    }
  })

  // Update next payment
  useEffect(() => {
    const nextPayment = schedule.payments.find(p => p.status === 'pending' || p.status === 'scheduled')
    setSchedule(prev => ({ ...prev, nextPayment }))
  }, [schedule.payments])

  // Calculate summary statistics
  const stats = useMemo(() => {
    const paidPayments = schedule.payments.filter(p => p.status === 'paid')
    const totalPaid = paidPayments.reduce((sum, p) => sum + (p.paidAmount || p.amount), 0)
    const totalInterestPaid = paidPayments.reduce((sum, p) => sum + p.interest, 0)
    const totalPrincipalPaid = paidPayments.reduce((sum, p) => sum + p.principal, 0)
    const remainingBalance = schedule.loanAmount - schedule.downPayment - totalPrincipalPaid
    const totalInterestRemaining = schedule.payments
      .filter(p => p.status !== 'paid')
      .reduce((sum, p) => sum + p.interest, 0)
    
    const onTimePayments = paidPayments.filter(p => !p.lateFee).length
    const latePayments = paidPayments.filter(p => p.lateFee).length
    const paymentPerformance = paidPayments.length > 0 
      ? (onTimePayments / paidPayments.length) * 100 
      : 100
    
    return {
      totalPaid,
      totalInterestPaid,
      totalPrincipalPaid,
      remainingBalance,
      totalInterestRemaining,
      onTimePayments,
      latePayments,
      paymentPerformance,
      paymentsCompleted: paidPayments.length,
      paymentsRemaining: schedule.payments.filter(p => p.status !== 'paid').length,
    }
  }, [schedule])

  // Handle payment
  const handlePayment = () => {
    if (!selectedPayment || !paymentAmount) return
    
    const amount = parseFloat(paymentAmount)
    if (amount <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid payment amount',
        variant: 'destructive',
      })
      return
    }
    
    // Update payment status
    const updatedPayments = schedule.payments.map(p => {
      if (p.id === selectedPayment.id) {
        return {
          ...p,
          status: 'paid' as const,
          paidDate: new Date().toISOString(),
          paidAmount: amount,
          transactionId: `tx-${Date.now()}`,
        }
      }
      return p
    })
    
    setSchedule(prev => ({ ...prev, payments: updatedPayments }))
    
    if (onPayment) {
      onPayment(selectedPayment.id, amount)
    }
    
    toast({
      title: 'Payment processed',
      description: `Payment of $${amount.toLocaleString()} has been recorded`,
    })
    
    setShowPaymentDialog(false)
    setPaymentAmount('')
    setSelectedPayment(null)
  }

  // Toggle row expansion
  const toggleRowExpansion = (paymentId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(paymentId)) {
        newSet.delete(paymentId)
      } else {
        newSet.add(paymentId)
      }
      return newSet
    })
  }

  return (
    <div className="w-full space-y-6">
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${schedule.nextPayment?.amount.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Due {schedule.nextPayment ? new Date(schedule.nextPayment.dueDate).toLocaleDateString() : 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalPaid.toLocaleString()}</div>
            <Progress value={(stats.totalPaid / (schedule.loanAmount - schedule.downPayment)) * 100} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.remainingBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.paymentsRemaining} payments left
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Performance</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.paymentPerformance.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.onTimePayments} on-time, {stats.latePayments} late
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Schedule</CardTitle>
              <CardDescription className="mt-2">
                {schedule.propertyTitle} • {schedule.frequency} payments
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowSettingsDialog(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="schedule" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
              <TabsTrigger value="settings">Auto-Pay</TabsTrigger>
            </TabsList>

            <TabsContent value="schedule" className="mt-6">
              {/* Quick Actions */}
              {schedule.nextPayment && (
                <Alert className="mb-6 border-primary/20 bg-primary/5">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Next payment due {new Date(schedule.nextPayment.dueDate).toLocaleDateString()}</p>
                        <p className="text-sm mt-1">
                          Amount: ${schedule.nextPayment.amount.toLocaleString()} 
                          (Principal: ${schedule.nextPayment.principal.toLocaleString()}, 
                          Interest: ${schedule.nextPayment.interest.toLocaleString()})
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedPayment(schedule.nextPayment!)
                          setPaymentAmount(schedule.nextPayment!.amount.toString())
                          setShowPaymentDialog(true)
                        }}
                      >
                        Pay Now
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Payment Table */}
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Principal</TableHead>
                      <TableHead>Interest</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedule.payments.slice(0, 12).map((payment) => (
                      <React.Fragment key={payment.id}>
                        <TableRow 
                          className={cn(
                            "cursor-pointer hover:bg-muted/50",
                            expandedRows.has(payment.id) && "bg-muted/30"
                          )}
                          onClick={() => toggleRowExpansion(payment.id)}
                        >
                          <TableCell className="font-medium">{payment.number}</TableCell>
                          <TableCell>
                            {new Date(payment.dueDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-medium">
                            ${payment.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>${payment.principal.toLocaleString()}</TableCell>
                          <TableCell>${payment.interest.toLocaleString()}</TableCell>
                          <TableCell>${payment.balance.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getPaymentStatusIcon(payment.status)}
                              <Badge 
                                variant="secondary" 
                                className={cn("text-xs", getPaymentStatusColor(payment.status))}
                              >
                                {payment.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {payment.status !== 'paid' && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedPayment(payment)
                                    setPaymentAmount(payment.amount.toString())
                                    setShowPaymentDialog(true)
                                  }}
                                >
                                  <CreditCard className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleRowExpansion(payment.id)
                                }}
                              >
                                {expandedRows.has(payment.id) ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        {expandedRows.has(payment.id) && (
                          <TableRow>
                            <TableCell colSpan={8} className="bg-muted/20">
                              <div className="p-4 space-y-3">
                                {payment.status === 'paid' && (
                                  <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <p className="text-muted-foreground">Paid Date</p>
                                      <p className="font-medium">
                                        {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : 'N/A'}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">Paid Amount</p>
                                      <p className="font-medium">
                                        ${payment.paidAmount?.toLocaleString() || payment.amount.toLocaleString()}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">Transaction ID</p>
                                      <p className="font-medium font-mono text-xs">
                                        {payment.transactionId || 'N/A'}
                                      </p>
                                    </div>
                                  </div>
                                )}
                                {payment.lateFee && (
                                  <Alert className="border-orange-200 bg-orange-50">
                                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                                    <AlertDescription className="text-orange-800">
                                      Late fee of ${payment.lateFee} applied
                                    </AlertDescription>
                                  </Alert>
                                )}
                                {payment.note && (
                                  <div className="text-sm">
                                    <p className="text-muted-foreground mb-1">Note</p>
                                    <p>{payment.note}</p>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {schedule.payments.length > 12 && (
                <div className="mt-4 text-center">
                  <Button variant="outline">
                    View All {schedule.payments.length} Payments
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="breakdown" className="mt-6 space-y-6">
              {/* Loan Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Loan Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Original Loan Amount</span>
                    <span className="font-medium">${(schedule.loanAmount - schedule.downPayment).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Interest Rate</span>
                    <span className="font-medium">{schedule.interestRate}% APR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Loan Term</span>
                    <span className="font-medium">{schedule.loanTerm} months ({schedule.loanTerm / 12} years)</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Interest</span>
                    <span className="font-medium">
                      ${(stats.totalInterestPaid + stats.totalInterestRemaining).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Cost</span>
                    <span className="font-medium text-lg">
                      ${(schedule.loanAmount - schedule.downPayment + stats.totalInterestPaid + stats.totalInterestRemaining).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Payment Distribution</CardTitle>
                  <CardDescription>Principal vs Interest over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Principal Paid</span>
                        <span className="font-medium">${stats.totalPrincipalPaid.toLocaleString()}</span>
                      </div>
                      <Progress value={(stats.totalPrincipalPaid / (schedule.loanAmount - schedule.downPayment)) * 100} className="h-2 bg-blue-100">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(stats.totalPrincipalPaid / (schedule.loanAmount - schedule.downPayment)) * 100}%` }} />
                      </Progress>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Interest Paid</span>
                        <span className="font-medium">${stats.totalInterestPaid.toLocaleString()}</span>
                      </div>
                      <Progress value={30} className="h-2 bg-orange-100">
                        <div className="h-full bg-orange-600 rounded-full" style={{ width: '30%' }} />
                      </Progress>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6 space-y-6">
              {/* Auto-Pay Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Automatic Payments</CardTitle>
                  <CardDescription>
                    Set up automatic payments to never miss a due date
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-pay">Enable Auto-Pay</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically process payments on due dates
                      </p>
                    </div>
                    <Switch
                      id="auto-pay"
                      checked={schedule.autoPayEnabled}
                      onCheckedChange={(checked) => {
                        setSchedule(prev => ({ ...prev, autoPayEnabled: checked }))
                        if (onAutoPayToggle) {
                          onAutoPayToggle(checked)
                        }
                        toast({
                          title: checked ? 'Auto-pay enabled' : 'Auto-pay disabled',
                          description: checked 
                            ? 'Payments will be automatically processed' 
                            : 'You will need to manually make payments',
                        })
                      }}
                    />
                  </div>

                  {schedule.autoPayEnabled && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label>Payment Source</Label>
                          <Select defaultValue="bank">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bank">Bank Account ****1234</SelectItem>
                              <SelectItem value="card">Credit Card ****5678</SelectItem>
                              <SelectItem value="crypto">Crypto Wallet 0x...abc</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Payment Amount</Label>
                          <RadioGroup defaultValue="full">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="full" id="full" />
                              <Label htmlFor="full">Full payment amount</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="minimum" id="minimum" />
                              <Label htmlFor="minimum">Minimum payment only</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="custom" id="custom" />
                              <Label htmlFor="custom">Custom amount</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Reminder Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Payment Reminders</CardTitle>
                  <CardDescription>
                    Configure when and how you receive payment reminders
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reminders">Enable Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified before payments are due
                      </p>
                    </div>
                    <Switch
                      id="reminders"
                      checked={schedule.reminderSettings.enabled}
                      onCheckedChange={(checked) => {
                        const newSettings = { ...schedule.reminderSettings, enabled: checked }
                        setSchedule(prev => ({ ...prev, reminderSettings: newSettings }))
                        if (onReminderUpdate) {
                          onReminderUpdate(newSettings)
                        }
                      }}
                    />
                  </div>

                  {schedule.reminderSettings.enabled && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label>Reminder Schedule</Label>
                          <div className="space-y-2">
                            {[7, 3, 1].map((days) => (
                              <div key={days} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`reminder-${days}`}
                                  checked={schedule.reminderSettings.daysBefore.includes(days)}
                                  onCheckedChange={(checked) => {
                                    const daysBefore = checked
                                      ? [...schedule.reminderSettings.daysBefore, days]
                                      : schedule.reminderSettings.daysBefore.filter(d => d !== days)
                                    const newSettings = { ...schedule.reminderSettings, daysBefore }
                                    setSchedule(prev => ({ ...prev, reminderSettings: newSettings }))
                                  }}
                                />
                                <Label htmlFor={`reminder-${days}`} className="font-normal">
                                  {days} {days === 1 ? 'day' : 'days'} before due date
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Notification Methods</Label>
                          <div className="space-y-2">
                            {(['email', 'sms', 'push'] as const).map((method) => (
                              <div key={method} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`method-${method}`}
                                  checked={schedule.reminderSettings.methods.includes(method)}
                                  onCheckedChange={(checked) => {
                                    const methods = checked
                                      ? [...schedule.reminderSettings.methods, method]
                                      : schedule.reminderSettings.methods.filter(m => m !== method)
                                    const newSettings = { ...schedule.reminderSettings, methods }
                                    setSchedule(prev => ({ ...prev, reminderSettings: newSettings }))
                                  }}
                                />
                                <Label htmlFor={`method-${method}`} className="font-normal capitalize">
                                  {method === 'sms' ? 'SMS' : method} notifications
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Late Fee Policy */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Late Fee Policy</CardTitle>
                  <CardDescription>
                    Fees applied when payments are made after the due date
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Grace Period</span>
                    <span className="font-medium">{schedule.lateFeePolicy.gracePeriodDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Late Fee</span>
                    <span className="font-medium">
                      {schedule.lateFeePolicy.feeType === 'fixed' 
                        ? `$${schedule.lateFeePolicy.feeAmount}` 
                        : `${schedule.lateFeePolicy.feeAmount}%`}
                    </span>
                  </div>
                  {schedule.lateFeePolicy.maxFee && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Maximum Fee</span>
                      <span className="font-medium">${schedule.lateFeePolicy.maxFee}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
            <DialogDescription>
              Process payment for {selectedPayment ? `Payment #${selectedPayment.number}` : 'selected payment'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Payment Details</Label>
              <div className="space-y-2 p-3 rounded-lg bg-muted/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Due Date</span>
                  <span>{selectedPayment && new Date(selectedPayment.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount Due</span>
                  <span className="font-medium">${selectedPayment?.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Principal</span>
                  <span>${selectedPayment?.principal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Interest</span>
                  <span>${selectedPayment?.interest.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-amount">Payment Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="payment-amount"
                  type="number"
                  placeholder="0.00"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Payment will be processed using your default payment method. You can change this in settings.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePayment}>
              Process Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}