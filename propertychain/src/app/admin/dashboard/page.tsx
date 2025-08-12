/**
 * Admin Dashboard - PropertyLend DeFi Platform
 * 
 * Protocol management interface for administrators
 * Monitor pools, manage risk parameters, and oversee operations
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PriceTicker } from '@/components/real-time/price-ticker'
import { cn } from '@/lib/utils'
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Settings,
  Users,
  DollarSign,
  Activity,
  Lock,
  Unlock,
  TrendingUp,
  BarChart3,
  PieChart,
  AlertCircle,
  Database,
  Cpu,
  Globe,
  RefreshCw,
  Download,
  Upload,
  Pause,
  Play,
  Eye,
  EyeOff,
  Key,
  Terminal,
  FileText,
  Zap,
  Clock,
  Flame,
  Info,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from 'recharts'

// Mock admin data
const systemMetrics = {
  status: 'operational',
  uptime: 99.98,
  responseTime: 142,
  activeNodes: 12,
  pendingTransactions: 3,
  gasPrice: 25,
  blockHeight: 18234567,
}

const poolManagement = [
  {
    id: '1',
    name: 'Miami Beach Resort',
    status: 'active',
    tvl: 25000000,
    utilization: 80,
    healthScore: 95,
    riskLevel: 'low',
    autoRebalance: true,
    emergencyPause: false,
  },
  {
    id: '2',
    name: 'NYC Commercial Complex',
    status: 'active',
    tvl: 50000000,
    utilization: 75,
    healthScore: 88,
    riskLevel: 'medium',
    autoRebalance: true,
    emergencyPause: false,
  },
  {
    id: '3',
    name: 'Austin Tech Hub',
    status: 'paused',
    tvl: 30000000,
    utilization: 73,
    healthScore: 72,
    riskLevel: 'high',
    autoRebalance: false,
    emergencyPause: true,
  },
]

const riskParameters = {
  maxLTV: 80,
  liquidationThreshold: 85,
  liquidationPenalty: 5,
  minCollateralRatio: 150,
  maxUtilization: 95,
  reserveFactor: 10,
  protocolFee: 2,
  emergencyAdminFee: 1,
}

const recentAlerts = [
  { id: '1', type: 'warning', message: 'High utilization on Pool #3', time: '5 min ago', pool: 'Austin Tech Hub' },
  { id: '2', type: 'info', message: 'Automatic rebalancing completed', time: '1 hour ago', pool: 'NYC Commercial' },
  { id: '3', type: 'critical', message: 'Liquidation threshold approaching', time: '2 hours ago', pool: 'Miami Beach' },
  { id: '4', type: 'success', message: 'Smart contract audit completed', time: '1 day ago', pool: 'System' },
]

const performanceData = [
  { time: '00:00', tvl: 118000000, transactions: 45, gasUsed: 2100000 },
  { time: '04:00', tvl: 119500000, transactions: 38, gasUsed: 1800000 },
  { time: '08:00', tvl: 121000000, transactions: 52, gasUsed: 2400000 },
  { time: '12:00', tvl: 120000000, transactions: 68, gasUsed: 3200000 },
  { time: '16:00', tvl: 122500000, transactions: 73, gasUsed: 3400000 },
  { time: '20:00', tvl: 125000000, transactions: 61, gasUsed: 2900000 },
]

export default function AdminDashboard() {
  const [emergencyMode, setEmergencyMode] = useState(false)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [selectedPool, setSelectedPool] = useState<string | null>(null)
  const [showSensitive, setShowSensitive] = useState(false)

  const handleEmergencyPause = (poolId: string) => {
    console.log('Emergency pause triggered for pool:', poolId)
    // Implement emergency pause logic
  }

  const handleParameterUpdate = (param: string, value: number) => {
    console.log('Updating parameter:', param, 'to:', value)
    // Implement parameter update logic
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Admin Header */}
      <div className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-white">Protocol Administration</h1>
              <Badge 
                variant="outline"
                className={cn(
                  systemMetrics.status === 'operational' 
                    ? 'text-green-400 border-green-400/50' 
                    : 'text-red-400 border-red-400/50'
                )}
              >
                {systemMetrics.status === 'operational' ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <AlertCircle className="h-3 w-3 mr-1" />
                )}
                {systemMetrics.status}
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              {/* Emergency Controls */}
              <div className="flex items-center gap-2 p-2 rounded-lg bg-red-950/50 border border-red-800/50">
                <Label htmlFor="emergency" className="text-red-400 text-sm">Emergency Mode</Label>
                <Switch
                  id="emergency"
                  checked={emergencyMode}
                  onCheckedChange={setEmergencyMode}
                  className="data-[state=checked]:bg-red-600"
                />
              </div>
              
              <Button variant="ghost" size="sm" onClick={() => setShowSensitive(!showSensitive)}>
                {showSensitive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              
              <Button variant="outline" size="sm" className="border-gray-700">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* System Status Bar */}
      <div className="bg-gray-900/50 border-b border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { label: 'Uptime', value: `${systemMetrics.uptime}%`, icon: Activity },
              { label: 'Response', value: `${systemMetrics.responseTime}ms`, icon: Zap },
              { label: 'Nodes', value: systemMetrics.activeNodes, icon: Globe },
              { label: 'Pending TX', value: systemMetrics.pendingTransactions, icon: Clock },
              { label: 'Gas Price', value: `${systemMetrics.gasPrice} gwei`, icon: Flame },
              { label: 'Block', value: `#${systemMetrics.blockHeight.toLocaleString()}`, icon: Database },
              { label: 'TVL', value: '$125M', icon: DollarSign },
            ].map((metric) => (
              <div key={metric.label} className="flex items-center gap-2">
                <metric.icon className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">{metric.label}</p>
                  <p className="text-sm font-semibold text-white">{metric.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-900/50 border border-gray-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pools">Pool Management</TabsTrigger>
            <TabsTrigger value="risk">Risk Parameters</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="logs">System Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Alerts Section */}
            {recentAlerts.filter(a => a.type === 'critical').length > 0 && (
              <Alert className="bg-red-950/50 border-red-800">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Critical Alerts</AlertTitle>
                <AlertDescription>
                  {recentAlerts.filter(a => a.type === 'critical').map(alert => (
                    <div key={alert.id} className="mt-2">
                      {alert.message} - {alert.pool} ({alert.time})
                    </div>
                  ))}
                </AlertDescription>
              </Alert>
            )}

            {/* Performance Chart */}
            <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">System Performance (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="tvlGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: '#111827', 
                          border: '1px solid #374151',
                          borderRadius: '8px' 
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="tvl" 
                        stroke="#8b5cf6" 
                        fillOpacity={1} 
                        fill="url(#tvlGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Protocol Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenance" className="text-gray-300">Maintenance Mode</Label>
                    <Switch
                      id="maintenance"
                      checked={maintenanceMode}
                      onCheckedChange={setMaintenanceMode}
                    />
                  </div>
                  <Separator className="bg-gray-800" />
                  <Button className="w-full bg-yellow-950 hover:bg-yellow-900 text-yellow-400 border border-yellow-800">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause All Pools
                  </Button>
                  <Button className="w-full bg-green-950 hover:bg-green-900 text-green-400 border border-green-800">
                    <Play className="h-4 w-4 mr-2" />
                    Resume All Pools
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Treasury</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Protocol Revenue</p>
                    <p className="text-2xl font-bold text-white">$2.5M</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Insurance Fund</p>
                    <p className="text-2xl font-bold text-white">$8.3M</p>
                  </div>
                  <Button className="w-full" variant="outline">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Manage Treasury
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Live Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <PriceTicker variant="detailed" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pools" className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Active Pools</CardTitle>
                  <Button variant="outline" size="sm" className="border-gray-700">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead className="text-gray-400">Pool Name</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">TVL</TableHead>
                      <TableHead className="text-gray-400">Utilization</TableHead>
                      <TableHead className="text-gray-400">Health</TableHead>
                      <TableHead className="text-gray-400">Risk</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {poolManagement.map((pool) => (
                      <TableRow key={pool.id} className="border-gray-800">
                        <TableCell className="font-medium text-white">{pool.name}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={cn(
                              pool.status === 'active' 
                                ? 'text-green-400 border-green-400/50' 
                                : 'text-yellow-400 border-yellow-400/50'
                            )}
                          >
                            {pool.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">
                          ${(pool.tvl / 1000000).toFixed(1)}M
                        </TableCell>
                        <TableCell className="text-white">{pool.utilization}%</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              'w-2 h-2 rounded-full',
                              pool.healthScore > 90 ? 'bg-green-400' :
                              pool.healthScore > 75 ? 'bg-yellow-400' : 'bg-red-400'
                            )} />
                            <span className="text-white">{pool.healthScore}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={cn(
                              pool.riskLevel === 'low' && 'text-green-400 border-green-400/50',
                              pool.riskLevel === 'medium' && 'text-yellow-400 border-yellow-400/50',
                              pool.riskLevel === 'high' && 'text-red-400 border-red-400/50'
                            )}
                          >
                            {pool.riskLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedPool(pool.id)}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            {pool.emergencyPause ? (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-green-400 hover:text-green-300"
                                onClick={() => handleEmergencyPause(pool.id)}
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-400 hover:text-red-300"
                                onClick={() => handleEmergencyPause(pool.id)}
                              >
                                <Pause className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Risk Parameters</CardTitle>
                <CardDescription className="text-gray-400">
                  Adjust protocol-wide risk management settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(riskParameters).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={key} className="text-gray-300 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id={key}
                          type="number"
                          value={value}
                          onChange={(e) => handleParameterUpdate(key, Number(e.target.value))}
                          className="bg-gray-900/50 border-gray-700 text-white"
                        />
                        <span className="text-gray-500">%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" className="border-gray-700">
                    Reset to Defaults
                  </Button>
                  <Button className="bg-gradient-to-r from-primary to-purple-600">
                    Apply Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Recent Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentAlerts.map((alert) => (
                      <div 
                        key={alert.id}
                        className={cn(
                          'p-3 rounded-lg border',
                          alert.type === 'critical' && 'bg-red-950/50 border-red-800',
                          alert.type === 'warning' && 'bg-yellow-950/50 border-yellow-800',
                          alert.type === 'info' && 'bg-blue-950/50 border-blue-800',
                          alert.type === 'success' && 'bg-green-950/50 border-green-800'
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-2">
                            {alert.type === 'critical' && <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />}
                            {alert.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5" />}
                            {alert.type === 'info' && <Info className="h-4 w-4 text-blue-400 mt-0.5" />}
                            {alert.type === 'success' && <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />}
                            <div>
                              <p className="text-sm text-white">{alert.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{alert.pool} • {alert.time}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Node Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Primary', 'Secondary', 'Backup', 'Archive'].map((node, index) => (
                      <div key={node} className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-2 h-2 rounded-full',
                            index < 3 ? 'bg-green-400 animate-pulse' : 'bg-gray-600'
                          )} />
                          <span className="text-white">{node} Node</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-500">CPU: {85 - index * 10}%</span>
                          <span className="text-gray-500">Mem: {72 + index * 5}%</span>
                          <Badge variant="outline" className="text-green-400 border-green-400/50">
                            Online
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contracts" className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Smart Contracts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'LendingPool', address: '0x742d...bEb9', version: 'v2.1.0', verified: true },
                    { name: 'SeniorTranche', address: '0x8f3C...4aD2', version: 'v2.1.0', verified: true },
                    { name: 'JuniorTranche', address: '0x2a9B...7eF1', version: 'v2.1.0', verified: true },
                    { name: 'Treasury', address: '0x5c1D...9bC3', version: 'v1.5.0', verified: true },
                  ].map((contract) => (
                    <div key={contract.name} className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="font-medium text-white">{contract.name}</span>
                            <Badge className="bg-green-950 text-green-400 border-green-800">
                              {contract.version}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1 font-mono">
                            {showSensitive ? contract.address : '0x••••••••'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {contract.verified && (
                            <Badge variant="outline" className="text-green-400 border-green-400/50">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          <Button variant="ghost" size="sm">
                            <Terminal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">System Logs</CardTitle>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32 bg-gray-900/50 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Logs</SelectItem>
                      <SelectItem value="error">Errors</SelectItem>
                      <SelectItem value="warning">Warnings</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-black/50 rounded-lg p-4 font-mono text-xs space-y-1 max-h-96 overflow-y-auto">
                  <div className="text-green-400">[2024-01-15 14:32:18] INFO: Pool rebalancing initiated</div>
                  <div className="text-blue-400">[2024-01-15 14:32:15] DEBUG: Health check passed for all pools</div>
                  <div className="text-yellow-400">[2024-01-15 14:31:42] WARN: High gas price detected: 45 gwei</div>
                  <div className="text-green-400">[2024-01-15 14:31:12] INFO: New deposit received: 50,000 USDC</div>
                  <div className="text-red-400">[2024-01-15 14:30:55] ERROR: Transaction failed - insufficient liquidity</div>
                  <div className="text-green-400">[2024-01-15 14:30:22] INFO: Automatic compounding completed</div>
                  <div className="text-blue-400">[2024-01-15 14:29:18] DEBUG: Oracle price feed updated</div>
                  <div className="text-green-400">[2024-01-15 14:28:45] INFO: Smart contract audit report generated</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}