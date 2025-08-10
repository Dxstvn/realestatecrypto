/**
 * Financial Management Page - PropertyChain Admin
 * 
 * Main page for managing all financial operations
 * Following UpdatedUIPlan.md Step 55.4 specifications and CLAUDE.md principles
 */

import { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { RevenueDashboard } from '@/components/admin/financial/revenue-dashboard'
import { TransactionMonitor } from '@/components/admin/financial/transaction-monitor'
import { PayoutManagement } from '@/components/admin/financial/payout-management'
import { getServerSession } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import {
  DollarSign, TrendingUp, Activity, Send, CreditCard, PiggyBank,
  BarChart3, Download, Upload, Settings, AlertCircle, Shield,
  Zap, Clock, CheckCircle, Users, Building2, Wallet, ArrowUpRight,
  ArrowDownRight, RefreshCw, FileText, Calculator, Info
} from 'lucide-react'

// Loading components
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-96" />
    </div>
  )
}

// Financial metrics interface
interface FinancialMetrics {
  totalRevenue: number
  revenueGrowth: number
  totalTransactions: number
  transactionVolume: number
  pendingPayouts: number
  payoutVolume: number
  netProfit: number
  profitMargin: number
  avgTransactionValue: number
  activeProperties: number
  totalInvestors: number
  platformFees: number
}

export default async function FinancialManagementPage() {
  // Verify admin access
  const session = await getServerSession()
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }
  
  // Fetch financial metrics (using sample data for now)
  const metrics: FinancialMetrics = {
    totalRevenue: 6841500,
    revenueGrowth: 15.3,
    totalTransactions: 3247,
    transactionVolume: 45780000,
    pendingPayouts: 127,
    payoutVolume: 285000,
    netProfit: 1823000,
    profitMargin: 26.6,
    avgTransactionValue: 14095,
    activeProperties: 342,
    totalInvestors: 1847,
    platformFees: 342075
  }
  
  // Calculate additional insights
  const insights = {
    revenuePerProperty: metrics.totalRevenue / metrics.activeProperties,
    revenuePerInvestor: metrics.totalRevenue / metrics.totalInvestors,
    payoutRatio: (metrics.payoutVolume / metrics.totalRevenue) * 100,
    operationalEfficiency: (metrics.netProfit / metrics.totalRevenue) * 100,
    transactionSuccessRate: 96.5,
    avgPayoutProcessingTime: 2.4, // hours
    monthlyRecurringRevenue: 345000,
    annualRunRate: metrics.totalRevenue * 12
  }
  
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial Management</h1>
          <p className="text-gray-500 mt-2">
            Monitor revenue, transactions, and manage payouts
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Import Data
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
      
      {/* Key Financial Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold">
                  ${(metrics.totalRevenue / 1000000).toFixed(2)}M
                </span>
              </div>
              <Badge variant="default" className="gap-1">
                <TrendingUp className="h-3 w-3" />
                {metrics.revenueGrowth}%
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              ${(insights.annualRunRate / 1000000).toFixed(1)}M annual run rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Transaction Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                <span className="text-2xl font-bold">
                  ${(metrics.transactionVolume / 1000000).toFixed(1)}M
                </span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {metrics.totalTransactions} txns
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Avg: ${(metrics.avgTransactionValue / 1000).toFixed(1)}K per txn
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Net Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PiggyBank className="h-4 w-4 text-purple-500" />
                <span className="text-2xl font-bold">
                  ${(metrics.netProfit / 1000000).toFixed(2)}M
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                {metrics.profitMargin}% margin
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {insights.operationalEfficiency.toFixed(1)}% efficiency
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Pending Payouts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4 text-yellow-500" />
                <span className="text-2xl font-bold">
                  ${(metrics.payoutVolume / 1000).toFixed(0)}K
                </span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {metrics.pendingPayouts} pending
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Avg processing: {insights.avgPayoutProcessingTime}h
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Secondary Metrics */}
      <div className="grid grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Platform Fees</p>
                <p className="text-lg font-bold">
                  ${(metrics.platformFees / 1000).toFixed(0)}K
                </p>
              </div>
              <CreditCard className="h-6 w-6 text-gray-400 opacity-50" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">MRR</p>
                <p className="text-lg font-bold">
                  ${(insights.monthlyRecurringRevenue / 1000).toFixed(0)}K
                </p>
              </div>
              <RefreshCw className="h-6 w-6 text-gray-400 opacity-50" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Properties</p>
                <p className="text-lg font-bold">{metrics.activeProperties}</p>
              </div>
              <Building2 className="h-6 w-6 text-gray-400 opacity-50" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Investors</p>
                <p className="text-lg font-bold">{metrics.totalInvestors}</p>
              </div>
              <Users className="h-6 w-6 text-gray-400 opacity-50" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Success Rate</p>
                <p className="text-lg font-bold">
                  {insights.transactionSuccessRate}%
                </p>
              </div>
              <CheckCircle className="h-6 w-6 text-gray-400 opacity-50" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Rev/Property</p>
                <p className="text-lg font-bold">
                  ${(insights.revenuePerProperty / 1000).toFixed(0)}K
                </p>
              </div>
              <BarChart3 className="h-6 w-6 text-gray-400 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Alerts and Notifications */}
      {metrics.pendingPayouts > 100 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>{metrics.pendingPayouts} payouts</strong> totaling ${(metrics.payoutVolume / 1000).toFixed(0)}K 
            are pending processing. Review and approve to maintain timely distributions.
          </AlertDescription>
        </Alert>
      )}
      
      {insights.transactionSuccessRate < 95 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Transaction success rate is below target at <strong>{insights.transactionSuccessRate}%</strong>. 
            Investigate failed transactions to improve platform reliability.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="revenue" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="transactions" className="gap-2">
            <Activity className="h-4 w-4" />
            Transactions
            <Badge variant="secondary" className="ml-1 text-xs">
              Live
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="payouts" className="gap-2">
            <Send className="h-4 w-4" />
            Payouts
            {metrics.pendingPayouts > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {metrics.pendingPayouts}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>
        
        {/* Revenue Tab */}
        <TabsContent value="revenue">
          <Suspense fallback={<DashboardSkeleton />}>
            <RevenueDashboard />
          </Suspense>
        </TabsContent>
        
        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Suspense fallback={<DashboardSkeleton />}>
            <TransactionMonitor />
          </Suspense>
        </TabsContent>
        
        {/* Payouts Tab */}
        <TabsContent value="payouts">
          <Suspense fallback={<DashboardSkeleton />}>
            <PayoutManagement />
          </Suspense>
        </TabsContent>
        
        {/* Reports Tab */}
        <TabsContent value="reports">
          <div className="grid grid-cols-2 gap-6">
            {/* Financial Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-between">
                  <span>Monthly Revenue Report</span>
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  <span>Transaction Analysis</span>
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  <span>Payout Summary</span>
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  <span>Tax Report</span>
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  <span>Investor Statements</span>
                  <Download className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            {/* Quick Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Best Performing Property</span>
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="font-semibold">Marina Bay Towers</p>
                  <p className="text-xs text-gray-500">$2.3M revenue • 127% ROI</p>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Top Revenue Stream</span>
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="font-semibold">Transaction Fees</p>
                  <p className="text-xs text-gray-500">42% of total • +18.5% growth</p>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Most Active Investor</span>
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <p className="font-semibold">Wellington Capital</p>
                  <p className="text-xs text-gray-500">$4.7M invested • 23 properties</p>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Pending Actions</span>
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </div>
                  <p className="font-semibold">15 Items Requiring Review</p>
                  <p className="text-xs text-gray-500">
                    7 payouts • 5 refunds • 3 disputes
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Compliance Status */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance & Audit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>AML/KYC Compliance</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Compliant
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Financial Audit</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Passed
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-yellow-500" />
                    <span>Tax Filing</span>
                  </div>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                    Due in 45 days
                  </Badge>
                </div>
                
                <Button className="w-full gap-2">
                  <FileText className="h-4 w-4" />
                  Generate Audit Report
                </Button>
              </CardContent>
            </Card>
            
            {/* Financial Calendar */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">DEC</p>
                      <p className="text-lg font-bold">15</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Monthly Dividends</p>
                      <p className="text-xs text-gray-500">127 recipients • $285K</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">DEC</p>
                      <p className="text-lg font-bold">20</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Q4 Distributions</p>
                      <p className="text-xs text-gray-500">342 recipients • $1.25M</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">DEC</p>
                      <p className="text-lg font-bold">31</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Year-End Close</p>
                      <p className="text-xs text-gray-500">Financial reconciliation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">JAN</p>
                      <p className="text-lg font-bold">15</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Tax Documents</p>
                      <p className="text-xs text-gray-500">1099 distribution</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}