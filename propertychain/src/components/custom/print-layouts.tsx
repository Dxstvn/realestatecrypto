/**
 * Print Layouts - PropertyChain
 * 
 * Print-optimized layouts with PDF export capabilities
 */

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import {
  Printer,
  Download,
  Eye,
  FileText,
  Image,
  Settings,
  Share,
  Mail,
  Copy,
  Save,
  FileDown,
  PaperclipIcon,
  Layout,
  Maximize2,
  Minimize2,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Grid,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Type,
  Palette,
  Ruler,
  Layers,
  Home,
  Building,
  DollarSign,
  MapPin,
  Calendar,
  Users,
  Camera,
  Star,
  CheckCircle,
  Info,
  Phone,
  Globe,
  Award,
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
} from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { formatCurrency, formatDate, formatNumber } from '@/lib/format'

// Print Layout Types
export interface PrintLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  orientation?: 'portrait' | 'landscape'
  paperSize?: 'a4' | 'letter' | 'legal' | 'a3'
  margin?: 'none' | 'minimal' | 'standard' | 'large'
  showHeader?: boolean
  showFooter?: boolean
  showPageNumbers?: boolean
  watermark?: string
  className?: string
}

export interface PrintPreviewProps {
  content: React.ReactNode
  title?: string
  onPrint?: () => void
  onDownloadPDF?: () => void
  onClose?: () => void
  options?: PrintOptions
}

export interface PrintOptions {
  orientation: 'portrait' | 'landscape'
  paperSize: 'a4' | 'letter' | 'legal' | 'a3'
  margin: 'none' | 'minimal' | 'standard' | 'large'
  scale: number
  showHeader: boolean
  showFooter: boolean
  showPageNumbers: boolean
  colorMode: 'color' | 'grayscale' | 'black-white'
  quality: 'draft' | 'normal' | 'high'
}

export interface PrintableDocument {
  id: string
  title: string
  content: React.ReactNode
  type: 'property' | 'transaction' | 'report' | 'contract' | 'invoice' | 'statement'
  createdAt: Date
  updatedAt: Date
  author?: string
  version?: string
  status?: 'draft' | 'final' | 'archived'
  metadata?: Record<string, any>
}

// Main Print Layout Component
export function PrintLayout({
  children,
  title,
  subtitle,
  orientation = 'portrait',
  paperSize = 'a4',
  margin = 'standard',
  showHeader = true,
  showFooter = true,
  showPageNumbers = true,
  watermark,
  className,
}: PrintLayoutProps) {
  const printRef = React.useRef<HTMLDivElement>(null)
  
  const paperSizes = {
    a4: { width: '210mm', height: '297mm' },
    letter: { width: '8.5in', height: '11in' },
    legal: { width: '8.5in', height: '14in' },
    a3: { width: '297mm', height: '420mm' },
  }

  const margins = {
    none: '0',
    minimal: '10mm',
    standard: '20mm',
    large: '30mm',
  }

  const pageStyle = {
    width: orientation === 'portrait' ? paperSizes[paperSize].width : paperSizes[paperSize].height,
    height: orientation === 'portrait' ? paperSizes[paperSize].height : paperSizes[paperSize].width,
    margin: margins[margin],
    padding: margins[margin],
  }

  return (
    <div 
      ref={printRef}
      className={cn(
        "print-layout bg-white text-black",
        "print:shadow-none print:border-none",
        className
      )}
      style={pageStyle}
    >
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          @page {
            size: ${paperSize} ${orientation};
            margin: ${margins[margin]};
          }
          
          .print-layout {
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          
          .no-print {
            display: none !important;
          }
          
          .page-break {
            page-break-before: always;
          }
          
          .page-break-avoid {
            page-break-inside: avoid;
          }
          
          body {
            background: white !important;
            color: black !important;
          }
          
          * {
            color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }
        }
        
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 6rem;
          opacity: 0.1;
          z-index: -1;
          pointer-events: none;
        }
      `}</style>

      {/* Watermark */}
      {watermark && (
        <div className="watermark font-bold text-gray-500">
          {watermark}
        </div>
      )}

      {/* Header */}
      {showHeader && (
        <header className="print-header border-b pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              {title && <h1 className="text-2xl font-bold">{title}</h1>}
              {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <div>{formatDate(new Date())}</div>
              <div>PropertyChain</div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="print-content">
        {children}
      </main>

      {/* Footer */}
      {showFooter && (
        <footer className="print-footer border-t pt-4 mt-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Generated by PropertyChain • {formatDate(new Date())}
            </div>
            {showPageNumbers && (
              <div>
                Page <span className="page-number"></span>
              </div>
            )}
          </div>
        </footer>
      )}
    </div>
  )
}

// Print Preview Component
export function PrintPreview({
  content,
  title = "Document Preview",
  onPrint,
  onDownloadPDF,
  onClose,
  options: initialOptions,
}: PrintPreviewProps) {
  const [options, setOptions] = React.useState<PrintOptions>({
    orientation: 'portrait',
    paperSize: 'a4',
    margin: 'standard',
    scale: 100,
    showHeader: true,
    showFooter: true,
    showPageNumbers: true,
    colorMode: 'color',
    quality: 'normal',
    ...initialOptions,
  })

  const previewRef = React.useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: title,
    onAfterPrint: onPrint,
  })

  const handleDownloadPDF = React.useCallback(async () => {
    if (!previewRef.current) return

    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: options.quality === 'high' ? 2 : options.quality === 'normal' ? 1.5 : 1,
        useCORS: true,
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: options.orientation,
        unit: 'mm',
        format: options.paperSize,
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 0

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      pdf.save(`${title}.pdf`)
      
      onDownloadPDF?.()
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }, [options, title, onDownloadPDF])

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Print Preview</DialogTitle>
              <DialogDescription>{title}</DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" onClick={handleDownloadPDF}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Options Panel */}
          <div className="w-64 flex-shrink-0 overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Print Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Orientation</label>
                  <Select
                    value={options.orientation}
                    onValueChange={(value) => setOptions(prev => ({ 
                      ...prev, 
                      orientation: value as PrintOptions['orientation']
                    }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Paper Size</label>
                  <Select
                    value={options.paperSize}
                    onValueChange={(value) => setOptions(prev => ({ 
                      ...prev, 
                      paperSize: value as PrintOptions['paperSize']
                    }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a4">A4</SelectItem>
                      <SelectItem value="letter">Letter</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                      <SelectItem value="a3">A3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Margins</label>
                  <Select
                    value={options.margin}
                    onValueChange={(value) => setOptions(prev => ({ 
                      ...prev, 
                      margin: value as PrintOptions['margin']
                    }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Scale ({options.scale}%)</label>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    step="10"
                    value={options.scale}
                    onChange={(e) => setOptions(prev => ({ 
                      ...prev, 
                      scale: parseInt(e.target.value)
                    }))}
                    className="w-full mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Color Mode</label>
                  <Select
                    value={options.colorMode}
                    onValueChange={(value) => setOptions(prev => ({ 
                      ...prev, 
                      colorMode: value as PrintOptions['colorMode']
                    }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="color">Color</SelectItem>
                      <SelectItem value="grayscale">Grayscale</SelectItem>
                      <SelectItem value="black-white">Black & White</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={options.showHeader}
                      onChange={(e) => setOptions(prev => ({ 
                        ...prev, 
                        showHeader: e.target.checked
                      }))}
                    />
                    <span className="text-sm">Show header</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={options.showFooter}
                      onChange={(e) => setOptions(prev => ({ 
                        ...prev, 
                        showFooter: e.target.checked
                      }))}
                    />
                    <span className="text-sm">Show footer</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={options.showPageNumbers}
                      onChange={(e) => setOptions(prev => ({ 
                        ...prev, 
                        showPageNumbers: e.target.checked
                      }))}
                    />
                    <span className="text-sm">Page numbers</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="flex-1 overflow-auto bg-gray-100 p-4">
            <div 
              ref={previewRef}
              className="mx-auto bg-white shadow-lg"
              style={{
                transform: `scale(${options.scale / 100})`,
                transformOrigin: 'top center',
                filter: options.colorMode === 'grayscale' 
                  ? 'grayscale(100%)' 
                  : options.colorMode === 'black-white' 
                  ? 'grayscale(100%) contrast(1000%)' 
                  : 'none',
              }}
            >
              <PrintLayout
                title={title}
                orientation={options.orientation}
                paperSize={options.paperSize}
                margin={options.margin}
                showHeader={options.showHeader}
                showFooter={options.showFooter}
                showPageNumbers={options.showPageNumbers}
              >
                {content}
              </PrintLayout>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Print Manager Component
interface PrintManagerProps {
  documents: PrintableDocument[]
  selectedDocuments?: string[]
  onDocumentSelect?: (documentIds: string[]) => void
  onPrint?: (documentIds: string[]) => void
  onPreview?: (document: PrintableDocument) => void
  className?: string
}

export function PrintManager({
  documents,
  selectedDocuments = [],
  onDocumentSelect,
  onPrint,
  onPreview,
  className,
}: PrintManagerProps) {
  const [viewMode, setViewMode] = React.useState<'list' | 'grid'>('list')
  const [filter, setFilter] = React.useState<{
    type?: string
    status?: string
    search?: string
  }>({})

  const filteredDocuments = React.useMemo(() => {
    let filtered = documents

    if (filter.type && filter.type !== 'all') {
      filtered = filtered.filter(doc => doc.type === filter.type)
    }
    if (filter.status && filter.status !== 'all') {
      filtered = filtered.filter(doc => doc.status === filter.status)
    }
    if (filter.search) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(filter.search!.toLowerCase())
      )
    }

    return filtered
  }, [documents, filter])

  const handleSelectAll = React.useCallback(() => {
    const allIds = filteredDocuments.map(doc => doc.id)
    onDocumentSelect?.(allIds)
  }, [filteredDocuments, onDocumentSelect])

  const handleSelectNone = React.useCallback(() => {
    onDocumentSelect?.([])
  }, [onDocumentSelect])

  const handleDocumentToggle = React.useCallback((documentId: string) => {
    const newSelection = selectedDocuments.includes(documentId)
      ? selectedDocuments.filter(id => id !== documentId)
      : [...selectedDocuments, documentId]
    onDocumentSelect?.(newSelection)
  }, [selectedDocuments, onDocumentSelect])

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'property': return <Home className="h-4 w-4 text-blue-500" />
      case 'transaction': return <DollarSign className="h-4 w-4 text-green-500" />
      case 'report': return <BarChart3 className="h-4 w-4 text-purple-500" />
      case 'contract': return <FileText className="h-4 w-4 text-orange-500" />
      case 'invoice': return <Receipt className="h-4 w-4 text-red-500" />
      case 'statement': return <PieChart className="h-4 w-4 text-teal-500" />
      default: return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'final': return 'text-green-600'
      case 'draft': return 'text-yellow-600'
      case 'archived': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Print Manager</h2>
          <p className="text-muted-foreground">
            Manage and print your documents
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedDocuments.length > 0 && (
            <Button onClick={() => onPrint?.(selectedDocuments)}>
              <Printer className="mr-2 h-4 w-4" />
              Print Selected ({selectedDocuments.length})
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSelectAll}>
                Select All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSelectNone}>
                Select None
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export Selected
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share className="mr-2 h-4 w-4" />
                Share Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search documents..."
                value={filter.search || ''}
                onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            
            <Select
              value={filter.type || 'all'}
              onValueChange={(value) => setFilter(prev => ({ 
                ...prev, 
                type: value === 'all' ? undefined : value 
              }))}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="property">Property</SelectItem>
                <SelectItem value="transaction">Transaction</SelectItem>
                <SelectItem value="report">Report</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="statement">Statement</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filter.status || 'all'}
              onValueChange={(value) => setFilter(prev => ({ 
                ...prev, 
                status: value === 'all' ? undefined : value 
              }))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="final">Final</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center border rounded-lg">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List/Grid */}
      <div className={cn(
        viewMode === 'grid' 
          ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "space-y-2"
      )}>
        {filteredDocuments.map(doc => (
          <Card 
            key={doc.id} 
            className={cn(
              "cursor-pointer transition-colors",
              selectedDocuments.includes(doc.id) ? "border-primary bg-primary/5" : "hover:bg-muted/50"
            )}
            onClick={() => handleDocumentToggle(doc.id)}
          >
            <CardContent className="p-4">
              <div className={cn(
                "flex items-start gap-3",
                viewMode === 'grid' && "flex-col"
              )}>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedDocuments.includes(doc.id)}
                    onChange={() => handleDocumentToggle(doc.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  {getDocumentIcon(doc.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{doc.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {doc.type}
                    </Badge>
                    {doc.status && (
                      <span className={cn("text-xs", getStatusColor(doc.status))}>
                        {doc.status}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDate(doc.updatedAt)}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onPreview?.(doc)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onPrint?.([doc.id])}>
                      <Printer className="mr-2 h-4 w-4" />
                      Print
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No documents found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  )
}

// Print Button Component
interface PrintButtonProps {
  content?: React.ReactNode
  title?: string
  options?: Partial<PrintOptions>
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  showPreview?: boolean
  onPrint?: () => void
  onPreview?: () => void
  className?: string
}

export function PrintButton({
  content,
  title = "Document",
  options,
  variant = 'default',
  size = 'default',
  showPreview = true,
  onPrint,
  onPreview,
  className,
}: PrintButtonProps) {
  const [showPreviewDialog, setShowPreviewDialog] = React.useState(false)

  const printRef = React.useRef<HTMLElement | null>(null)
  React.useEffect(() => {
    printRef.current = document.getElementById('printable-content')
  }, [])
  
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: title,
    onAfterPrint: onPrint,
  })

  const handlePreview = React.useCallback(() => {
    if (showPreview && content) {
      setShowPreviewDialog(true)
      onPreview?.()
    } else {
      handlePrint()
    }
  }, [showPreview, content, handlePrint, onPreview])

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} className={className}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Print Preview
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print Directly
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => {}}>
            <FileDown className="mr-2 h-4 w-4" />
            Export to PDF
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Mail className="mr-2 h-4 w-4" />
            Email Document
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Hidden printable content */}
      {content && (
        <div id="printable-content" className="hidden">
          <PrintLayout title={title} {...options}>
            {content}
          </PrintLayout>
        </div>
      )}

      {/* Print Preview Dialog */}
      {showPreviewDialog && content && (
        <PrintPreview
          content={content}
          title={title}
          options={options as PrintOptions | undefined}
          onPrint={() => {
            setShowPreviewDialog(false)
            onPrint?.()
          }}
          onDownloadPDF={() => {
            setShowPreviewDialog(false)
          }}
          onClose={() => setShowPreviewDialog(false)}
        />
      )}
    </>
  )
}

// Utility functions for creating mock printable documents
export function createMockPrintableDocument(type: PrintableDocument['type']): PrintableDocument {
  const titles = {
    property: 'Property Listing Report',
    transaction: 'Transaction Summary',
    report: 'Market Analysis Report',
    contract: 'Purchase Agreement',
    invoice: 'Service Invoice',
    statement: 'Financial Statement',
  }

  return {
    id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: titles[type],
    type,
    content: <div>Mock content for {type}</div>,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: 'PropertyChain System',
    version: '1.0',
    status: 'final',
  }
}

// Import missing components
import { MoreVertical } from 'lucide-react'
import { Receipt } from 'lucide-react'