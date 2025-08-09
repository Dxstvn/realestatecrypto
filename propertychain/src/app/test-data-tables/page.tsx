/**
 * Data Tables Test Page - PropertyChain
 * Tests all data table features and specialized variants
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/custom/data-table'
import {
  PropertyInvestmentTable,
  TransactionTable,
  InvestorTable,
  PropertyListingTable,
  type PropertyInvestment,
  type Transaction,
  type Investor,
  type PropertyListing,
} from '@/components/custom/property-tables'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/custom/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Building2, 
  DollarSign, 
  Users, 
  TrendingUp,
  BarChart3,
  FileText,
  Download,
  Plus,
  Filter,
  Settings,
} from 'lucide-react'
import { toastSuccess, toastInfo } from '@/lib/toast'

// Sample data generation
const generatePropertyInvestments = (): PropertyInvestment[] => [
  {
    id: '1',
    propertyName: 'Marina Bay Towers',
    propertyType: 'residential',
    location: 'San Francisco, CA',
    investmentAmount: 50000,
    currentValue: 62000,
    roi: 24,
    purchaseDate: new Date('2023-01-15'),
    status: 'active',
    tokenCount: 500,
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=tower1',
  },
  {
    id: '2',
    propertyName: 'Downtown Office Complex',
    propertyType: 'commercial',
    location: 'New York, NY',
    investmentAmount: 125000,
    currentValue: 118000,
    roi: -5.6,
    purchaseDate: new Date('2023-03-20'),
    status: 'active',
    tokenCount: 1250,
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=office1',
  },
  {
    id: '3',
    propertyName: 'Sunset Villa',
    propertyType: 'residential',
    location: 'Miami, FL',
    investmentAmount: 75000,
    currentValue: 82500,
    roi: 10,
    purchaseDate: new Date('2023-05-10'),
    status: 'pending',
    tokenCount: 750,
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=villa1',
  },
  {
    id: '4',
    propertyName: 'Industrial Park A',
    propertyType: 'industrial',
    location: 'Houston, TX',
    investmentAmount: 200000,
    currentValue: 245000,
    roi: 22.5,
    purchaseDate: new Date('2022-11-01'),
    status: 'active',
    tokenCount: 2000,
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=industrial1',
  },
  {
    id: '5',
    propertyName: 'Green Acres',
    propertyType: 'land',
    location: 'Austin, TX',
    investmentAmount: 35000,
    currentValue: 35000,
    roi: 0,
    purchaseDate: new Date('2024-01-05'),
    status: 'sold',
    tokenCount: 350,
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=land1',
  },
]

const generateTransactions = (): Transaction[] => [
  {
    id: '1',
    hash: '0x1234567890abcdef1234567890abcdef12345678',
    type: 'buy',
    property: 'Marina Bay Towers',
    amount: 50000,
    tokens: 500,
    status: 'confirmed',
    date: new Date('2024-01-15'),
    gasUsed: 0.0025,
  },
  {
    id: '2',
    hash: '0xabcdef1234567890abcdef1234567890abcdef12',
    type: 'sell',
    property: 'Green Acres',
    amount: 35000,
    tokens: 350,
    status: 'confirmed',
    date: new Date('2024-01-10'),
    gasUsed: 0.0023,
  },
  {
    id: '3',
    hash: '0x9876543210fedcba9876543210fedcba98765432',
    type: 'dividend',
    property: 'Downtown Office Complex',
    amount: 2500,
    status: 'confirmed',
    date: new Date('2024-01-01'),
  },
  {
    id: '4',
    hash: '0xfedcba9876543210fedcba9876543210fedcba98',
    type: 'transfer',
    property: 'Sunset Villa',
    amount: 0,
    tokens: 100,
    status: 'pending',
    date: new Date('2024-01-20'),
    from: '0x123...abc',
    to: '0x456...def',
  },
  {
    id: '5',
    hash: '0x1111222233334444555566667777888899990000',
    type: 'buy',
    property: 'Industrial Park A',
    amount: 10000,
    tokens: 100,
    status: 'failed',
    date: new Date('2024-01-18'),
    gasUsed: 0.0021,
  },
]

const generateInvestors = (): Investor[] => [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    totalInvested: 250000,
    propertyCount: 5,
    joinDate: new Date('2022-06-15'),
    status: 'active',
    kycStatus: 'verified',
    lastActive: new Date('2024-01-20'),
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    totalInvested: 125000,
    propertyCount: 3,
    joinDate: new Date('2023-01-10'),
    status: 'active',
    kycStatus: 'verified',
    lastActive: new Date('2024-01-19'),
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'mchen@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
    totalInvested: 75000,
    propertyCount: 2,
    joinDate: new Date('2023-08-20'),
    status: 'pending',
    kycStatus: 'pending',
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma.w@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    totalInvested: 500000,
    propertyCount: 12,
    joinDate: new Date('2021-11-05'),
    status: 'active',
    kycStatus: 'verified',
    lastActive: new Date('2024-01-20'),
  },
  {
    id: '5',
    name: 'Robert Taylor',
    email: 'rtaylor@example.com',
    totalInvested: 0,
    propertyCount: 0,
    joinDate: new Date('2024-01-15'),
    status: 'suspended',
    kycStatus: 'rejected',
  },
]

const generatePropertyListings = (): PropertyListing[] => [
  {
    id: '1',
    title: 'Ocean View Condos',
    type: 'Residential',
    location: 'Santa Monica, CA',
    price: 5000000,
    tokenPrice: 100,
    availableTokens: 25000,
    totalTokens: 50000,
    fundingProgress: 50,
    expectedReturn: 8.5,
    closingDate: new Date('2024-02-15'),
    status: 'funding',
    featured: true,
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=ocean',
  },
  {
    id: '2',
    title: 'Tech Hub Plaza',
    type: 'Commercial',
    location: 'Seattle, WA',
    price: 12000000,
    tokenPrice: 500,
    availableTokens: 5000,
    totalTokens: 24000,
    fundingProgress: 79,
    expectedReturn: 10.2,
    closingDate: new Date('2024-02-01'),
    status: 'funding',
    featured: false,
  },
  {
    id: '3',
    title: 'Green Energy Center',
    type: 'Industrial',
    location: 'Phoenix, AZ',
    price: 8000000,
    tokenPrice: 200,
    availableTokens: 0,
    totalTokens: 40000,
    fundingProgress: 100,
    expectedReturn: 12.5,
    closingDate: new Date('2024-01-10'),
    status: 'funded',
    featured: true,
  },
  {
    id: '4',
    title: 'Historic Downtown Lofts',
    type: 'Residential',
    location: 'Boston, MA',
    price: 3500000,
    tokenPrice: 75,
    availableTokens: 30000,
    totalTokens: 46667,
    fundingProgress: 35.7,
    expectedReturn: 7.8,
    closingDate: new Date('2024-03-01'),
    status: 'funding',
    featured: false,
  },
  {
    id: '5',
    title: 'Lakefront Resort',
    type: 'Commercial',
    location: 'Lake Tahoe, NV',
    price: 15000000,
    tokenPrice: 1000,
    availableTokens: 0,
    totalTokens: 15000,
    fundingProgress: 100,
    expectedReturn: 15.0,
    closingDate: new Date('2023-12-15'),
    status: 'closed',
    featured: false,
  },
]

// Simple table for basic demo
interface Person {
  id: string
  name: string
  email: string
  role: string
  department: string
  salary: number
  startDate: Date
}

const simpleData: Person[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Manager', department: 'Engineering', salary: 120000, startDate: new Date('2020-01-15') },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Developer', department: 'Engineering', salary: 95000, startDate: new Date('2021-03-20') },
  { id: '3', name: 'Carol White', email: 'carol@example.com', role: 'Designer', department: 'Design', salary: 85000, startDate: new Date('2021-06-10') },
  { id: '4', name: 'David Brown', email: 'david@example.com', role: 'Analyst', department: 'Finance', salary: 75000, startDate: new Date('2022-01-05') },
  { id: '5', name: 'Eve Davis', email: 'eve@example.com', role: 'Director', department: 'Sales', salary: 150000, startDate: new Date('2019-08-12') },
]

const simpleColumns: ColumnDef<Person>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue('role')}</Badge>
    ),
  },
  {
    accessorKey: 'department',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
  },
  {
    accessorKey: 'salary',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Salary" />
    ),
    cell: ({ row }) => {
      const salary = row.getValue('salary') as number
      return `$${salary.toLocaleString()}`
    },
  },
]

export default function TestDataTablesPage() {
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('basic')

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Data Tables Test</h1>
        <p className="text-muted-foreground">
          Testing TanStack Table implementation with sorting, filtering, and pagination
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">15</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Investment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">$485K</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Investors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">324</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. ROI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold text-green-500">+12.4%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Table</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="investors">Investors</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Data Table</CardTitle>
              <CardDescription>
                Simple table with sorting, filtering, selection, and export
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={simpleColumns}
                data={simpleData}
                showSelection
                showPagination
                showColumnVisibility
                pageSize={5}
                onRowsSelected={setSelectedRows}
                actions={[
                  {
                    label: 'Delete Selected',
                    onClick: (rows) => {
                      toastInfo(`Would delete ${rows.length} rows`)
                    },
                    icon: <FileText className="mr-2 h-4 w-4" />,
                    variant: 'destructive',
                  },
                ]}
              />
              {selectedRows.length > 0 && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Selected Rows:</p>
                  <pre className="text-xs">{JSON.stringify(selectedRows, null, 2)}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Property Investments</CardTitle>
                  <CardDescription>
                    Your real estate investment portfolio
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Investment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <PropertyInvestmentTable
                data={generatePropertyInvestments()}
                actions={[
                  {
                    label: 'Export',
                    onClick: (rows) => toastSuccess(`Exported ${rows.length} investments`),
                    icon: <Download className="mr-2 h-4 w-4" />,
                  },
                  {
                    label: 'Analyze',
                    onClick: (rows) => toastInfo(`Analyzing ${rows.length} investments`),
                    icon: <BarChart3 className="mr-2 h-4 w-4" />,
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    All blockchain transactions
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <TransactionTable data={generateTransactions()} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investors" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Investor Management</CardTitle>
                  <CardDescription>
                    Manage platform investors and KYC status
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Investor
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <InvestorTable
                data={generateInvestors()}
                actions={[
                  {
                    label: 'Send Email',
                    onClick: (rows) => toastInfo(`Sending email to ${rows.length} investors`),
                    icon: <FileText className="mr-2 h-4 w-4" />,
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listings" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Property Listings</CardTitle>
                  <CardDescription>
                    Available investment opportunities
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  List Property
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <PropertyListingTable data={generatePropertyListings()} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Features Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Data Table Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Core Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Column sorting (click headers)</li>
                <li>✅ Global search filtering</li>
                <li>✅ Column-specific filtering</li>
                <li>✅ Pagination with size options</li>
                <li>✅ Row selection (single/multi)</li>
                <li>✅ Column visibility toggle</li>
                <li>✅ CSV export functionality</li>
                <li>✅ Loading states</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Advanced Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Fuzzy search with match-sorter</li>
                <li>✅ Custom cell renderers</li>
                <li>✅ Row actions menu</li>
                <li>✅ Bulk actions on selection</li>
                <li>✅ Responsive design</li>
                <li>✅ Variant styles (compact/spacious)</li>
                <li>✅ TypeScript support</li>
                <li>✅ Specialized property tables</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}