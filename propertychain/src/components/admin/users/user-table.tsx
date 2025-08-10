/**
 * User Management Table - PropertyChain Admin
 * 
 * Advanced user table with filtering, KYC status, and activity monitoring
 * Following UpdatedUIPlan.md Step 55.3 specifications
 */

'use client'

import { useState, useMemo } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Slider } from '@/components/ui/slider'
import {
  MoreHorizontal,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Ban,
  UserCheck,
  Mail,
  Shield,
  DollarSign,
  Activity,
  Calendar,
  MapPin,
  Phone,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
} from 'lucide-react'
import { formatCurrency, formatNumber, formatDate, formatTimeAgo } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import { toast } from 'sonner'
import { KYC_STATUS, USER_ROLES } from '@/lib/constants'

// User type definition
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: keyof typeof USER_ROLES
  kycStatus: keyof typeof KYC_STATUS
  investmentTotal: number
  propertiesOwned: number
  lastActive: Date
  accountCreated: Date
  status: 'active' | 'suspended' | 'banned'
  emailVerified: boolean
  twoFactorEnabled: boolean
  location?: {
    city: string
    country: string
  }
  investorType?: 'individual' | 'entity' | 'institutional'
  activityLevel: 'high' | 'medium' | 'low'
  riskScore: number // 0-100
  documents: {
    submitted: number
    verified: number
  }
}

// KYC Status configuration
const kycStatusConfig = {
  NOT_STARTED: { label: 'Not Started', icon: XCircle, color: 'bg-gray-100 text-gray-700' },
  PENDING: { label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
  VERIFIED: { label: 'Verified', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  REJECTED: { label: 'Rejected', icon: XCircle, color: 'bg-red-100 text-red-700' },
  EXPIRED: { label: 'Expired', icon: AlertTriangle, color: 'bg-orange-100 text-orange-700' },
}

// Activity level colors
const activityColors = {
  high: 'text-green-600',
  medium: 'text-yellow-600',
  low: 'text-red-600',
}

interface UserTableProps {
  users: User[]
  onUserUpdate?: (user: User) => void
  onBulkAction?: (action: string, userIds: string[]) => void
}

export function UserTable({ 
  users, 
  onUserUpdate,
  onBulkAction
}: UserTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [globalFilter, setGlobalFilter] = useState('')
  
  // Advanced filters
  const [kycFilter, setKycFilter] = useState<string>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [investmentRange, setInvestmentRange] = useState<[number, number]>([0, 10000000])
  const [activityFilter, setActivityFilter] = useState<string>('all')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Define columns
  const columns: ColumnDef<User>[] = useMemo(() => [
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
      accessorKey: 'user',
      header: 'User',
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
              <div className="flex items-center gap-2 mt-1">
                {user.emailVerified && (
                  <Badge variant="secondary" className="text-xs">
                    <Mail className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {user.twoFactorEnabled && (
                  <Badge variant="secondary" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    2FA
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue('role') as string
        return (
          <Badge variant="outline" className="capitalize">
            {role.toLowerCase().replace('_', ' ')}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        if (value === 'all') return true
        return row.getValue(id) === value
      },
    },
    {
      accessorKey: 'kycStatus',
      header: 'KYC Status',
      cell: ({ row }) => {
        const status = row.getValue('kycStatus') as keyof typeof kycStatusConfig
        const config = kycStatusConfig[status]
        const Icon = config.icon
        
        return (
          <div className="flex items-center gap-2">
            <Badge className={cn('gap-1', config.color)}>
              <Icon className="h-3 w-3" />
              {config.label}
            </Badge>
            {row.original.documents && (
              <span className="text-xs text-gray-500">
                {row.original.documents.verified}/{row.original.documents.submitted} docs
              </span>
            )}
          </div>
        )
      },
      filterFn: (row, id, value) => {
        if (value === 'all') return true
        return row.getValue(id) === value
      },
    },
    {
      accessorKey: 'investmentTotal',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4"
        >
          Investment Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = row.getValue('investmentTotal') as number
        const prevAmount = amount * 0.9 // Mock previous value
        const change = ((amount - prevAmount) / prevAmount) * 100
        
        return (
          <div>
            <div className="font-medium">{formatCurrency(amount)}</div>
            <div className={cn(
              'text-xs flex items-center gap-1',
              change >= 0 ? 'text-green-600' : 'text-red-600'
            )}>
              {change >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(change).toFixed(1)}%
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'propertiesOwned',
      header: 'Properties',
      cell: ({ row }) => (
        <div className="text-center">{row.getValue('propertiesOwned')}</div>
      ),
    },
    {
      accessorKey: 'activityLevel',
      header: 'Activity',
      cell: ({ row }) => {
        const level = row.getValue('activityLevel') as string
        const lastActive = row.original.lastActive
        
        return (
          <div>
            <div className={cn('font-medium capitalize', activityColors[level as keyof typeof activityColors])}>
              {level}
            </div>
            <div className="text-xs text-gray-500">
              {formatTimeAgo(lastActive)}
            </div>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        if (value === 'all') return true
        return row.getValue(id) === value
      },
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => {
        const location = row.original.location
        if (!location) return <span className="text-gray-400">N/A</span>
        
        return (
          <div className="flex items-center gap-1 text-sm">
            <MapPin className="h-3 w-3 text-gray-400" />
            <span>{location.city}, {location.country}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'accountCreated',
      header: 'Member Since',
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">
          {formatDate(row.getValue('accountCreated'))}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        const colors = {
          active: 'bg-green-100 text-green-700',
          suspended: 'bg-yellow-100 text-yellow-700',
          banned: 'bg-red-100 text-red-700',
        }
        
        return (
          <Badge className={colors[status as keyof typeof colors]}>
            {status}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const user = row.original
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => window.open(`/admin/users/${user.id}`, '_blank')}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => window.location.href = `/admin/users/${user.id}/edit`}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSendMessage(user.id)}
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Message
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {user.kycStatus === 'PENDING_REVIEW' && (
                <DropdownMenuItem
                  onClick={() => window.location.href = `/admin/users/kyc/${user.id}`}
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Review KYC
                </DropdownMenuItem>
              )}
              {user.status === 'active' ? (
                <>
                  <DropdownMenuItem
                    onClick={() => handleSuspend(user.id)}
                    className="text-yellow-600"
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Suspend User
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleBan(user.id)}
                    className="text-red-600"
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Ban User
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem
                  onClick={() => handleActivate(user.id)}
                  className="text-green-600"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Activate User
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ], [])

  // Handlers
  const handleSuspend = (userId: string) => {
    if (confirm('Are you sure you want to suspend this user?')) {
      toast.success('User suspended')
      // Call API to suspend user
    }
  }

  const handleBan = (userId: string) => {
    if (confirm('Are you sure you want to ban this user? This action cannot be undone.')) {
      toast.success('User banned')
      // Call API to ban user
    }
  }

  const handleActivate = (userId: string) => {
    toast.success('User activated')
    // Call API to activate user
  }

  const handleSendMessage = (userId: string) => {
    // Open message modal
    toast.info('Opening message composer...')
  }

  const handleBulkEmail = () => {
    const selectedIds = Object.keys(rowSelection).filter(key => rowSelection[key])
    if (selectedIds.length === 0) {
      toast.error('No users selected')
      return
    }
    onBulkAction?.('email', selectedIds)
    toast.success(`Email campaign started for ${selectedIds.length} users`)
  }

  const handleBulkExport = () => {
    const selectedIds = Object.keys(rowSelection).filter(key => rowSelection[key])
    if (selectedIds.length === 0) {
      toast.error('No users selected')
      return
    }
    onBulkAction?.('export', selectedIds)
    toast.success('Export started')
  }

  // Filter users based on advanced filters
  const filteredUsers = useMemo(() => {
    let filtered = [...users]
    
    if (kycFilter !== 'all') {
      filtered = filtered.filter(u => u.kycStatus === kycFilter)
    }
    
    if (roleFilter !== 'all') {
      filtered = filtered.filter(u => u.role === roleFilter)
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(u => u.status === statusFilter)
    }
    
    if (activityFilter !== 'all') {
      filtered = filtered.filter(u => u.activityLevel === activityFilter)
    }
    
    // Investment range filter
    filtered = filtered.filter(u => 
      u.investmentTotal >= investmentRange[0] && 
      u.investmentTotal <= investmentRange[1]
    )
    
    return filtered
  }, [users, kycFilter, roleFilter, statusFilter, activityFilter, investmentRange])

  // Create table instance
  const table = useReactTable({
    data: filteredUsers,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  })

  const selectedCount = Object.keys(rowSelection).filter(key => rowSelection[key]).length

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={kycFilter} onValueChange={setKycFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="KYC Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All KYC Status</SelectItem>
              <SelectItem value="NOT_STARTED">Not Started</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="VERIFIED">Verified</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="INVESTOR">Investor</SelectItem>
              <SelectItem value="PROPERTY_OWNER">Property Owner</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm">Investment Range</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{formatCurrency(investmentRange[0])}</span>
                      <span>{formatCurrency(investmentRange[1])}</span>
                    </div>
                    <Slider
                      value={investmentRange}
                      onValueChange={(value) => setInvestmentRange(value as [number, number])}
                      max={10000000}
                      step={100000}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm">Activity Level</Label>
                  <Select value={activityFilter} onValueChange={setActivityFilter}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Activity</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm">Account Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setKycFilter('all')
                    setRoleFilter('all')
                    setStatusFilter('all')
                    setActivityFilter('all')
                    setInvestmentRange([0, 10000000])
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Bulk Actions Bar */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium">
            {selectedCount} {selectedCount === 1 ? 'user' : 'users'} selected
          </span>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleBulkEmail}>
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            <Button variant="outline" size="sm" onClick={handleBulkExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRowSelection({})}
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{' '}
          of {table.getFilteredRowModel().rows.length} users
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

// Import statements for missing components
import { Label } from '@/components/ui/label'