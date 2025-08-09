/**
 * Property-Specific Table Components - PropertyChain
 * 
 * Specialized data tables for various property-related data
 */

'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable, DataTableColumnHeader, DataTableRowActions } from './data-table'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Building2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Download,
  Share2,
  Heart,
  BarChart3,
  FileText,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import { formatCurrency, formatPercentage, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils/cn'

// Property Investment Table Types
export interface PropertyInvestment {
  id: string
  propertyName: string
  propertyType: 'residential' | 'commercial' | 'industrial' | 'land'
  location: string
  investmentAmount: number
  currentValue: number
  roi: number
  purchaseDate: Date
  status: 'active' | 'pending' | 'sold'
  tokenCount: number
  image?: string
}

// Transaction Table Types
export interface Transaction {
  id: string
  hash: string
  type: 'buy' | 'sell' | 'dividend' | 'transfer'
  property: string
  amount: number
  tokens?: number
  status: 'pending' | 'confirmed' | 'failed'
  date: Date
  gasUsed?: number
  from?: string
  to?: string
}

// Investor Table Types
export interface Investor {
  id: string
  name: string
  email: string
  avatar?: string
  totalInvested: number
  propertyCount: number
  joinDate: Date
  status: 'active' | 'pending' | 'suspended'
  kycStatus: 'verified' | 'pending' | 'rejected'
  lastActive?: Date
}

// Property Listing Types
export interface PropertyListing {
  id: string
  title: string
  type: string
  location: string
  price: number
  tokenPrice: number
  availableTokens: number
  totalTokens: number
  fundingProgress: number
  expectedReturn: number
  closingDate: Date
  status: 'funding' | 'funded' | 'closed'
  featured: boolean
  image?: string
}

// Helper function for status badges
const getStatusBadge = (status: string) => {
  const variants: Record<string, { className: string; icon?: React.ReactNode }> = {
    active: { className: 'bg-green-500/10 text-green-500 border-green-500/20', icon: <CheckCircle className="w-3 h-3" /> },
    pending: { className: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: <Clock className="w-3 h-3" /> },
    sold: { className: 'bg-gray-500/10 text-gray-500 border-gray-500/20' },
    confirmed: { className: 'bg-green-500/10 text-green-500 border-green-500/20', icon: <CheckCircle className="w-3 h-3" /> },
    failed: { className: 'bg-red-500/10 text-red-500 border-red-500/20', icon: <XCircle className="w-3 h-3" /> },
    verified: { className: 'bg-green-500/10 text-green-500 border-green-500/20', icon: <Shield className="w-3 h-3" /> },
    rejected: { className: 'bg-red-500/10 text-red-500 border-red-500/20', icon: <XCircle className="w-3 h-3" /> },
    suspended: { className: 'bg-red-500/10 text-red-500 border-red-500/20', icon: <AlertCircle className="w-3 h-3" /> },
    funding: { className: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: <Clock className="w-3 h-3" /> },
    funded: { className: 'bg-green-500/10 text-green-500 border-green-500/20', icon: <CheckCircle className="w-3 h-3" /> },
    closed: { className: 'bg-gray-500/10 text-gray-500 border-gray-500/20' },
  }

  const variant = variants[status] || { className: '' }

  return (
    <Badge className={cn('gap-1', variant.className)}>
      {variant.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

// Property Investment Table Columns
export const propertyInvestmentColumns: ColumnDef<PropertyInvestment>[] = [
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
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'propertyName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Property" />
    ),
    cell: ({ row }) => {
      const property = row.original
      return (
        <div className="flex items-center gap-3">
          {property.image && (
            <Avatar className="h-10 w-10">
              <AvatarImage src={property.image} alt={property.propertyName} />
              <AvatarFallback>
                <Building2 className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          )}
          <div>
            <p className="font-medium">{property.propertyName}</p>
            <p className="text-sm text-muted-foreground">{property.propertyType}</p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'location',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <MapPin className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm">{row.getValue('location')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'investmentAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Investment" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {formatCurrency(row.getValue('investmentAmount'))}
      </div>
    ),
  },
  {
    accessorKey: 'currentValue',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Current Value" />
    ),
    cell: ({ row }) => {
      const current = row.getValue('currentValue') as number
      const investment = row.original.investmentAmount
      const change = ((current - investment) / investment) * 100
      
      return (
        <div>
          <p className="font-medium">{formatCurrency(current)}</p>
          <p className={cn(
            'text-sm flex items-center gap-1',
            change >= 0 ? 'text-green-500' : 'text-red-500'
          )}>
            {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {formatPercentage(Math.abs(change))}
          </p>
        </div>
      )
    },
  },
  {
    accessorKey: 'roi',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ROI" />
    ),
    cell: ({ row }) => {
      const roi = row.getValue('roi') as number
      return (
        <div className={cn(
          'font-medium',
          roi >= 0 ? 'text-green-500' : 'text-red-500'
        )}>
          {roi >= 0 ? '+' : ''}{formatPercentage(roi)}
        </div>
      )
    },
  },
  {
    accessorKey: 'tokenCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tokens" />
    ),
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.getValue('tokenCount')} tokens
      </Badge>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => getStatusBadge(row.getValue('status')),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        actions={[
          {
            label: 'View Details',
            onClick: () => console.log('View', row.original.id),
            icon: <Eye className="mr-2 h-4 w-4" />,
          },
          {
            label: 'Trade',
            onClick: () => console.log('Trade', row.original.id),
            icon: <BarChart3 className="mr-2 h-4 w-4" />,
          },
          {
            label: 'Documents',
            onClick: () => console.log('Documents', row.original.id),
            icon: <FileText className="mr-2 h-4 w-4" />,
          },
        ]}
      />
    ),
  },
]

// Transaction Table Columns
export const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'hash',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transaction Hash" />
    ),
    cell: ({ row }) => {
      const hash = row.getValue('hash') as string
      return (
        <div className="font-mono text-sm">
          {hash.slice(0, 8)}...{hash.slice(-6)}
        </div>
      )
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = row.getValue('type') as string
      const icons: Record<string, React.ReactNode> = {
        buy: <TrendingUp className="h-4 w-4 text-green-500" />,
        sell: <TrendingDown className="h-4 w-4 text-red-500" />,
        dividend: <DollarSign className="h-4 w-4 text-blue-500" />,
        transfer: <Share2 className="h-4 w-4 text-purple-500" />,
      }
      
      return (
        <div className="flex items-center gap-2">
          {icons[type]}
          <span className="capitalize">{type}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'property',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Property" />
    ),
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {formatCurrency(row.getValue('amount'))}
      </div>
    ),
  },
  {
    accessorKey: 'tokens',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tokens" />
    ),
    cell: ({ row }) => {
      const tokens = row.getValue('tokens')
      return tokens ? (
        <Badge variant="outline">{tokens as number}</Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => formatDate(row.getValue('date')),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => getStatusBadge(row.getValue('status')),
  },
]

// Investor Table Columns
export const investorColumns: ColumnDef<Investor>[] = [
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
      <DataTableColumnHeader column={column} title="Investor" />
    ),
    cell: ({ row }) => {
      const investor = row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={investor.avatar} alt={investor.name} />
            <AvatarFallback>{investor.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{investor.name}</p>
            <p className="text-sm text-muted-foreground">{investor.email}</p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'totalInvested',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Invested" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {formatCurrency(row.getValue('totalInvested'))}
      </div>
    ),
  },
  {
    accessorKey: 'propertyCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Properties" />
    ),
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.getValue('propertyCount')} properties
      </Badge>
    ),
  },
  {
    accessorKey: 'kycStatus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="KYC Status" />
    ),
    cell: ({ row }) => getStatusBadge(row.getValue('kycStatus')),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account Status" />
    ),
    cell: ({ row }) => getStatusBadge(row.getValue('status')),
  },
  {
    accessorKey: 'joinDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Join Date" />
    ),
    cell: ({ row }) => formatDate(row.getValue('joinDate')),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        actions={[
          {
            label: 'View Profile',
            onClick: () => console.log('View', row.original.id),
            icon: <Eye className="mr-2 h-4 w-4" />,
          },
          {
            label: 'Edit',
            onClick: () => console.log('Edit', row.original.id),
            icon: <Edit className="mr-2 h-4 w-4" />,
          },
        ]}
      />
    ),
  },
]

// Property Listing Table Columns
export const propertyListingColumns: ColumnDef<PropertyListing>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Property" />
    ),
    cell: ({ row }) => {
      const property = row.original
      return (
        <div className="flex items-center gap-3">
          {property.image && (
            <Avatar className="h-12 w-12 rounded">
              <AvatarImage src={property.image} alt={property.title} />
              <AvatarFallback>
                <Building2 className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
          )}
          <div>
            <p className="font-medium">{property.title}</p>
            <p className="text-sm text-muted-foreground">{property.type}</p>
            {property.featured && (
              <Badge className="mt-1" variant="secondary">
                <Heart className="mr-1 h-3 w-3" />
                Featured
              </Badge>
            )}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'location',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <MapPin className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm">{row.getValue('location')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Price" />
    ),
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{formatCurrency(row.getValue('price'))}</p>
        <p className="text-sm text-muted-foreground">
          ${row.original.tokenPrice}/token
        </p>
      </div>
    ),
  },
  {
    accessorKey: 'fundingProgress',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Funding Progress" />
    ),
    cell: ({ row }) => {
      const progress = row.getValue('fundingProgress') as number
      const property = row.original
      
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>{formatPercentage(progress)}</span>
            <span className="text-muted-foreground">
              {property.availableTokens}/{property.totalTokens}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )
    },
  },
  {
    accessorKey: 'expectedReturn',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expected Return" />
    ),
    cell: ({ row }) => (
      <div className="font-medium text-green-500">
        {formatPercentage(row.getValue('expectedReturn'))} APY
      </div>
    ),
  },
  {
    accessorKey: 'closingDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Closing Date" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Calendar className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm">{formatDate(row.getValue('closingDate'))}</span>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => getStatusBadge(row.getValue('status')),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Button
        size="sm"
        onClick={() => console.log('Invest in', row.original.id)}
      >
        Invest Now
      </Button>
    ),
  },
]

// Export specialized table components
export function PropertyInvestmentTable({ data, ...props }: { data: PropertyInvestment[] } & Omit<React.ComponentProps<typeof DataTable>, 'data' | 'columns'>) {
  return (
    <DataTable
      columns={propertyInvestmentColumns}
      data={data}
      showSelection
      {...props}
    />
  )
}

export function TransactionTable({ data, ...props }: { data: Transaction[] } & Omit<React.ComponentProps<typeof DataTable>, 'data' | 'columns'>) {
  return (
    <DataTable
      columns={transactionColumns}
      data={data}
      showPagination
      showColumnVisibility
      {...props}
    />
  )
}

export function InvestorTable({ data, ...props }: { data: Investor[] } & Omit<React.ComponentProps<typeof DataTable>, 'data' | 'columns'>) {
  return (
    <DataTable
      columns={investorColumns}
      data={data}
      showSelection
      showPagination
      showColumnVisibility
      {...props}
    />
  )
}

export function PropertyListingTable({ data, ...props }: { data: PropertyListing[] } & Omit<React.ComponentProps<typeof DataTable>, 'data' | 'columns'>) {
  return (
    <DataTable
      columns={propertyListingColumns}
      data={data}
      showPagination
      showColumnVisibility
      searchKey="title"
      searchPlaceholder="Search properties..."
      {...props}
    />
  )
}