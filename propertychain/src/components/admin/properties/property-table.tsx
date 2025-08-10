/**
 * Property Management Table - PropertyChain Admin
 * 
 * DataTable with filtering, sorting, and bulk actions for property management
 * Following UpdatedUIPlan.md Step 55.2 specifications
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
import { Progress } from '@/components/ui/progress'
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
  Building,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Pause,
  Play,
  Trash,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import { toast } from 'sonner'

// Property type definition
export interface Property {
  id: string
  name: string
  address: string
  status: 'draft' | 'pending' | 'active' | 'paused' | 'completed'
  fundingProgress: number
  targetAmount: number
  raisedAmount: number
  investorsCount: number
  roi: number
  yield: number
  createdDate: Date
  lastModified: Date
  owner: {
    id: string
    name: string
    email: string
  }
  type: 'residential' | 'commercial' | 'industrial' | 'land'
  featured: boolean
  verified: boolean
}

// Status configuration
const statusConfig = {
  draft: { label: 'Draft', icon: Edit, color: 'bg-gray-100 text-gray-700' },
  pending: { label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
  active: { label: 'Active', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  paused: { label: 'Paused', icon: Pause, color: 'bg-orange-100 text-orange-700' },
  completed: { label: 'Completed', icon: CheckCircle, color: 'bg-blue-100 text-blue-700' },
}

interface PropertyTableProps {
  properties: Property[]
  onPropertyUpdate?: (property: Property) => void
  onBulkAction?: (action: string, propertyIds: string[]) => void
}

export function PropertyTable({ 
  properties, 
  onPropertyUpdate,
  onBulkAction
}: PropertyTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  // Define columns
  const columns: ColumnDef<Property>[] = useMemo(() => [
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
      accessorKey: 'id',
      header: 'Property ID',
      cell: ({ row }) => (
        <div className="font-mono text-xs">{row.getValue('id')}</div>
      ),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4"
        >
          Name/Address
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-gray-500">{row.original.address}</div>
          <div className="flex items-center gap-2 mt-1">
            {row.original.featured && (
              <Badge variant="secondary" className="text-xs">Featured</Badge>
            )}
            {row.original.verified && (
              <Badge variant="secondary" className="text-xs">Verified</Badge>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as keyof typeof statusConfig
        const config = statusConfig[status]
        const Icon = config.icon
        
        return (
          <Badge className={cn('gap-1', config.color)}>
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        if (value === 'all') return true
        return row.getValue(id) === value
      },
    },
    {
      id: 'funding',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4"
        >
          Funding Progress
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      accessorFn: (row) => row.fundingProgress,
      cell: ({ row }) => {
        const progress = row.original.fundingProgress
        const raised = row.original.raisedAmount
        const target = row.original.targetAmount
        
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{progress.toFixed(1)}%</span>
              <span className="text-gray-500">
                {formatCurrency(raised)} / {formatCurrency(target)}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )
      },
    },
    {
      accessorKey: 'investorsCount',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4"
        >
          Investors
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">{formatNumber(row.getValue('investorsCount'))}</div>
      ),
    },
    {
      accessorKey: 'raisedAmount',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4"
        >
          Total Raised
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{formatCurrency(row.getValue('raisedAmount'))}</div>
      ),
    },
    {
      id: 'returns',
      header: 'ROI/Yield',
      cell: ({ row }) => (
        <div className="text-sm">
          <div>ROI: {row.original.roi}%</div>
          <div className="text-gray-500">Yield: {row.original.yield}%</div>
        </div>
      ),
    },
    {
      accessorKey: 'createdDate',
      header: 'Created',
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">
          {formatDate(row.getValue('createdDate'))}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const property = row.original
        
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
                onClick={() => window.open(`/admin/properties/${property.id}`, '_blank')}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => window.location.href = `/admin/properties/${property.id}/edit`}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Property
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {property.status === 'active' ? (
                <DropdownMenuItem
                  onClick={() => handleStatusChange(property.id, 'paused')}
                >
                  <Pause className="mr-2 h-4 w-4" />
                  Pause Listing
                </DropdownMenuItem>
              ) : property.status === 'paused' ? (
                <DropdownMenuItem
                  onClick={() => handleStatusChange(property.id, 'active')}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Resume Listing
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem
                onClick={() => handleFeatureToggle(property.id, !property.featured)}
              >
                {property.featured ? (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Unfeature
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Feature Property
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(property.id)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ], [])

  // Handlers
  const handleStatusChange = (propertyId: string, newStatus: string) => {
    toast.success(`Property status changed to ${newStatus}`)
    // Call API to update status
  }

  const handleFeatureToggle = (propertyId: string, featured: boolean) => {
    toast.success(featured ? 'Property featured' : 'Property unfeatured')
    // Call API to toggle featured status
  }

  const handleDelete = (propertyId: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      toast.success('Property deleted')
      // Call API to delete property
    }
  }

  const handleBulkApprove = () => {
    const selectedIds = Object.keys(rowSelection).filter(key => rowSelection[key])
    if (selectedIds.length === 0) {
      toast.error('No properties selected')
      return
    }
    onBulkAction?.('approve', selectedIds)
    toast.success(`${selectedIds.length} properties approved`)
    setRowSelection({})
  }

  const handleBulkFeature = () => {
    const selectedIds = Object.keys(rowSelection).filter(key => rowSelection[key])
    if (selectedIds.length === 0) {
      toast.error('No properties selected')
      return
    }
    onBulkAction?.('feature', selectedIds)
    toast.success(`${selectedIds.length} properties featured`)
    setRowSelection({})
  }

  const handleBulkExport = () => {
    const selectedIds = Object.keys(rowSelection).filter(key => rowSelection[key])
    if (selectedIds.length === 0) {
      toast.error('No properties selected')
      return
    }
    onBulkAction?.('export', selectedIds)
    toast.success('Export started')
  }

  // Filter properties based on status and type
  const filteredProperties = useMemo(() => {
    let filtered = [...properties]
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter)
    }
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(p => p.type === typeFilter)
    }
    
    return filtered
  }, [properties, statusFilter, typeFilter])

  // Create table instance
  const table = useReactTable({
    data: filteredProperties,
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
              placeholder="Search properties..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
              <SelectItem value="land">Land</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
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
            {selectedCount} {selectedCount === 1 ? 'property' : 'properties'} selected
          </span>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleBulkApprove}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Bulk Approve
            </Button>
            <Button variant="outline" size="sm" onClick={handleBulkFeature}>
              <Building className="h-4 w-4 mr-2" />
              Bulk Feature
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
                  No properties found.
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
          of {table.getFilteredRowModel().rows.length} properties
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