/**
 * Document Viewer Components - PropertyChain
 * 
 * Comprehensive document viewing system with PDF support, navigation, and annotation tools
 */

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
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
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  FileText,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Download,
  Print,
  Share,
  Bookmark,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  MoreVertical,
  Maximize2,
  Minimize2,
  Copy,
  Edit,
  Highlighter,
  MessageSquare,
  Pin,
  X,
  Plus,
  Minus,
  MousePointer,
  Square,
  Circle,
  Type,
  Pen,
  Eraser,
  Palette,
  Eye,
  EyeOff,
  Settings,
  Layers,
  Grid3X3,
  ScanLine,
  Target,
  Navigation,
  Move,
  Hand,
  Crosshair,
} from 'lucide-react'
import { formatDate, formatFileSize } from '@/lib/format'

// Document Types
export interface Document {
  id: string
  name: string
  type: 'pdf' | 'image' | 'word' | 'excel' | 'powerpoint' | 'text'
  size: number
  pages: number
  url: string
  uploadDate: Date
  category?: string
  tags?: string[]
  version?: string
  isConfidential?: boolean
  permissions?: DocumentPermissions
  metadata?: DocumentMetadata
}

export interface DocumentMetadata {
  title?: string
  author?: string
  subject?: string
  keywords?: string[]
  creationDate?: Date
  modificationDate?: Date
  creator?: string
  producer?: string
}

export interface DocumentPermissions {
  canView: boolean
  canDownload: boolean
  canPrint: boolean
  canAnnotate: boolean
  canShare: boolean
  canEdit: boolean
}

export interface Annotation {
  id: string
  type: 'highlight' | 'note' | 'stamp' | 'drawing' | 'text'
  page: number
  position: { x: number; y: number; width?: number; height?: number }
  content: string
  color: string
  author: string
  createdAt: Date
  replies?: AnnotationReply[]
  isResolved?: boolean
}

export interface AnnotationReply {
  id: string
  author: string
  content: string
  createdAt: Date
}

export interface ViewerConfig {
  theme: 'light' | 'dark' | 'sepia'
  fitMode: 'width' | 'height' | 'page' | 'auto'
  zoom: number
  rotation: number
  showThumbnails: boolean
  showAnnotations: boolean
  showOutline: boolean
  enableTextSelection: boolean
  enableAnnotations: boolean
  showGrid: boolean
  snapToGrid: boolean
}

// Main Document Viewer Component
interface DocumentViewerProps {
  document: Document
  initialPage?: number
  config?: Partial<ViewerConfig>
  annotations?: Annotation[]
  onPageChange?: (page: number) => void
  onZoomChange?: (zoom: number) => void
  onAnnotationAdd?: (annotation: Omit<Annotation, 'id' | 'createdAt'>) => void
  onAnnotationUpdate?: (annotation: Annotation) => void
  onAnnotationDelete?: (annotationId: string) => void
  onDownload?: () => void
  onPrint?: () => void
  onShare?: () => void
  className?: string
}

export function DocumentViewer({
  document: doc,
  initialPage = 1,
  config = {},
  annotations = [],
  onPageChange,
  onZoomChange,
  onAnnotationAdd,
  onAnnotationUpdate,
  onAnnotationDelete,
  onDownload,
  onPrint,
  onShare,
  className,
}: DocumentViewerProps) {
  const [currentPage, setCurrentPage] = React.useState(initialPage)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [searchResults, setSearchResults] = React.useState<Array<{ page: number; text: string }>>([])
  const [selectedTool, setSelectedTool] = React.useState<'select' | 'highlight' | 'note' | 'draw'>('select')
  const [showSidebar, setShowSidebar] = React.useState(true)
  const [sidebarTab, setSidebarTab] = React.useState<'thumbnails' | 'outline' | 'annotations' | 'search'>('thumbnails')

  const viewerConfig: ViewerConfig = {
    theme: 'light',
    fitMode: 'width',
    zoom: 100,
    rotation: 0,
    showThumbnails: true,
    showAnnotations: true,
    showOutline: true,
    enableTextSelection: true,
    enableAnnotations: true,
    showGrid: false,
    snapToGrid: false,
    ...config,
  }

  const [currentConfig, setCurrentConfig] = React.useState(viewerConfig)

  // Simulate document loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [doc.id])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= doc.pages) {
      setCurrentPage(page)
      onPageChange?.(page)
    }
  }

  const handleZoomChange = (zoom: number) => {
    const newZoom = Math.max(10, Math.min(500, zoom))
    setCurrentConfig(prev => ({ ...prev, zoom: newZoom }))
    onZoomChange?.(newZoom)
  }

  const handleConfigChange = (key: keyof ViewerConfig, value: any) => {
    setCurrentConfig(prev => ({ ...prev, [key]: value }))
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // Mock search results
    if (query.length > 2) {
      const mockResults = [
        { page: 1, text: `Found "${query}" on page 1` },
        { page: 3, text: `Found "${query}" on page 3` },
        { page: 7, text: `Found "${query}" on page 7` },
      ]
      setSearchResults(mockResults)
    } else {
      setSearchResults([])
    }
  }

  const getFileIcon = () => {
    switch (doc.type) {
      case 'pdf': return <FileText className="h-6 w-6 text-red-500" />
      case 'image': return <FileText className="h-6 w-6 text-blue-500" />
      case 'word': return <FileText className="h-6 w-6 text-blue-600" />
      case 'excel': return <FileText className="h-6 w-6 text-green-600" />
      default: return <FileText className="h-6 w-6 text-gray-500" />
    }
  }

  const pageAnnotations = annotations.filter(a => a.page === currentPage)

  if (error) {
    return (
      <Card className={cn("w-full h-96", className)}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Document</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("flex h-96 bg-background border rounded-lg overflow-hidden", className)}>
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-64 border-r bg-muted/20">
          <DocumentSidebar
            document={doc}
            currentPage={currentPage}
            annotations={annotations}
            searchQuery={searchQuery}
            searchResults={searchResults}
            activeTab={sidebarTab}
            onTabChange={setSidebarTab}
            onPageSelect={handlePageChange}
            onSearch={handleSearch}
            onAnnotationSelect={(annotation) => handlePageChange(annotation.page)}
          />
        </div>
      )}

      {/* Main Viewer */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <DocumentToolbar
          document={doc}
          currentPage={currentPage}
          totalPages={doc.pages}
          zoom={currentConfig.zoom}
          tool={selectedTool}
          config={currentConfig}
          onPageChange={handlePageChange}
          onZoomChange={handleZoomChange}
          onToolChange={setSelectedTool}
          onConfigChange={handleConfigChange}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
          onDownload={onDownload}
          onPrint={onPrint}
          onShare={onShare}
        />

        {/* Document Content */}
        <div className="flex-1 relative overflow-auto bg-gray-100 dark:bg-gray-900">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Loading document...</p>
              </div>
            </div>
          ) : (
            <DocumentCanvas
              document={doc}
              currentPage={currentPage}
              config={currentConfig}
              annotations={pageAnnotations}
              selectedTool={selectedTool}
              onAnnotationAdd={onAnnotationAdd}
            />
          )}
        </div>

        {/* Status Bar */}
        <div className="border-t px-4 py-2 bg-muted/50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span>Page {currentPage} of {doc.pages}</span>
              <span>{currentConfig.zoom}%</span>
              <span>{formatFileSize(doc.size)}</span>
            </div>
            <div className="flex items-center gap-2">
              {doc.isConfidential && (
                <Badge variant="destructive" className="text-xs">
                  Confidential
                </Badge>
              )}
              <span className="text-muted-foreground">
                {formatDate(doc.uploadDate)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Document Sidebar Component
interface DocumentSidebarProps {
  document: Document
  currentPage: number
  annotations: Annotation[]
  searchQuery: string
  searchResults: Array<{ page: number; text: string }>
  activeTab: 'thumbnails' | 'outline' | 'annotations' | 'search'
  onTabChange: (tab: 'thumbnails' | 'outline' | 'annotations' | 'search') => void
  onPageSelect: (page: number) => void
  onSearch: (query: string) => void
  onAnnotationSelect: (annotation: Annotation) => void
}

function DocumentSidebar({
  document: doc,
  currentPage,
  annotations,
  searchQuery,
  searchResults,
  activeTab,
  onTabChange,
  onPageSelect,
  onSearch,
  onAnnotationSelect,
}: DocumentSidebarProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Tab Headers */}
      <div className="border-b">
        <div className="grid grid-cols-4">
          {[
            { id: 'thumbnails', icon: <Grid3X3 className="h-4 w-4" />, label: 'Pages' },
            { id: 'outline', icon: <Layers className="h-4 w-4" />, label: 'Outline' },
            { id: 'annotations', icon: <MessageSquare className="h-4 w-4" />, label: 'Notes' },
            { id: 'search', icon: <Search className="h-4 w-4" />, label: 'Search' },
          ].map(tab => (
            <button
              key={tab.id}
              className={cn(
                "p-2 text-xs border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-transparent hover:bg-muted"
              )}
              onClick={() => onTabChange(tab.id as any)}
            >
              <div className="flex flex-col items-center gap-1">
                {tab.icon}
                <span className="hidden sm:block">{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          {activeTab === 'thumbnails' && (
            <div className="space-y-2">
              {Array.from({ length: doc.pages }, (_, i) => i + 1).map(page => (
                <div
                  key={page}
                  className={cn(
                    "p-2 rounded border cursor-pointer transition-colors",
                    currentPage === page
                      ? "border-primary bg-primary/10"
                      : "border-muted hover:border-border hover:bg-muted"
                  )}
                  onClick={() => onPageSelect(page)}
                >
                  <div className="aspect-[3/4] bg-white dark:bg-gray-800 rounded mb-2 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">Page {page}</span>
                  </div>
                  <div className="text-xs text-center">
                    {page}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'outline' && (
            <div className="space-y-1">
              {/* Mock outline */}
              <div className="space-y-1 text-sm">
                <button 
                  className="w-full text-left p-2 rounded hover:bg-muted"
                  onClick={() => onPageSelect(1)}
                >
                  1. Introduction
                </button>
                <button 
                  className="w-full text-left p-2 rounded hover:bg-muted pl-4"
                  onClick={() => onPageSelect(2)}
                >
                  1.1 Overview
                </button>
                <button 
                  className="w-full text-left p-2 rounded hover:bg-muted pl-4"
                  onClick={() => onPageSelect(3)}
                >
                  1.2 Purpose
                </button>
                <button 
                  className="w-full text-left p-2 rounded hover:bg-muted"
                  onClick={() => onPageSelect(4)}
                >
                  2. Details
                </button>
                <button 
                  className="w-full text-left p-2 rounded hover:bg-muted"
                  onClick={() => onPageSelect(8)}
                >
                  3. Conclusion
                </button>
              </div>
            </div>
          )}

          {activeTab === 'annotations' && (
            <div className="space-y-2">
              {annotations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No annotations yet</p>
                </div>
              ) : (
                annotations.map(annotation => (
                  <div
                    key={annotation.id}
                    className="p-3 border rounded cursor-pointer hover:bg-muted"
                    onClick={() => onAnnotationSelect(annotation)}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <Badge variant="outline" className="text-xs">
                        Page {annotation.page}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {annotation.author}
                      </span>
                    </div>
                    <p className="text-sm">{annotation.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: annotation.color }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {formatDate(annotation.createdAt)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'search' && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search document..."
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    {searchResults.length} results found
                  </div>
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="p-2 border rounded cursor-pointer hover:bg-muted"
                      onClick={() => onPageSelect(result.page)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <Badge variant="outline" className="text-xs">
                          Page {result.page}
                        </Badge>
                      </div>
                      <p className="text-sm">{result.text}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {searchQuery && searchResults.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No results found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

// Document Toolbar Component
interface DocumentToolbarProps {
  document: Document
  currentPage: number
  totalPages: number
  zoom: number
  tool: string
  config: ViewerConfig
  onPageChange: (page: number) => void
  onZoomChange: (zoom: number) => void
  onToolChange: (tool: 'select' | 'highlight' | 'note' | 'draw') => void
  onConfigChange: (key: keyof ViewerConfig, value: any) => void
  onToggleSidebar: () => void
  onDownload?: () => void
  onPrint?: () => void
  onShare?: () => void
}

function DocumentToolbar({
  document: doc,
  currentPage,
  totalPages,
  zoom,
  tool,
  config,
  onPageChange,
  onZoomChange,
  onToolChange,
  onConfigChange,
  onToggleSidebar,
  onDownload,
  onPrint,
  onShare,
}: DocumentToolbarProps) {
  const tools = [
    { id: 'select', icon: <MousePointer className="h-4 w-4" />, label: 'Select' },
    { id: 'highlight', icon: <Highlighter className="h-4 w-4" />, label: 'Highlight' },
    { id: 'note', icon: <MessageSquare className="h-4 w-4" />, label: 'Note' },
    { id: 'draw', icon: <Pen className="h-4 w-4" />, label: 'Draw' },
  ]

  return (
    <div className="border-b bg-background">
      <div className="flex items-center justify-between p-2">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onToggleSidebar}>
            <Layers className="h-4 w-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          {/* Page Navigation */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1 text-sm">
              <Input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => onPageChange(parseInt(e.target.value) || 1)}
                className="w-16 h-8 text-center"
              />
              <span>/ {totalPages}</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onZoomChange(zoom - 25)}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <Select value={zoom.toString()} onValueChange={(value) => onZoomChange(parseInt(value))}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50">50%</SelectItem>
                <SelectItem value="75">75%</SelectItem>
                <SelectItem value="100">100%</SelectItem>
                <SelectItem value="125">125%</SelectItem>
                <SelectItem value="150">150%</SelectItem>
                <SelectItem value="200">200%</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onZoomChange(zoom + 25)}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Center Section - Tools */}
        <div className="flex items-center gap-1">
          {tools.map(t => (
            <TooltipProvider key={t.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={tool === t.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => onToolChange(t.id as any)}
                  >
                    {t.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onPrint}>
            <Print className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="sm" onClick={onShare}>
            <Share className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>View Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={config.showGrid}
                onCheckedChange={(checked) => onConfigChange('showGrid', checked)}
              >
                Show Grid
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={config.showAnnotations}
                onCheckedChange={(checked) => onConfigChange('showAnnotations', checked)}
              >
                Show Annotations
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={config.enableTextSelection}
                onCheckedChange={(checked) => onConfigChange('enableTextSelection', checked)}
              >
                Text Selection
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

// Document Canvas Component
interface DocumentCanvasProps {
  document: Document
  currentPage: number
  config: ViewerConfig
  annotations: Annotation[]
  selectedTool: string
  onAnnotationAdd?: (annotation: Omit<Annotation, 'id' | 'createdAt'>) => void
}

function DocumentCanvas({
  document: doc,
  currentPage,
  config,
  annotations,
  selectedTool,
  onAnnotationAdd,
}: DocumentCanvasProps) {
  const canvasRef = React.useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragStart, setDragStart] = React.useState<{ x: number; y: number } | null>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (selectedTool === 'select') return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setIsDragging(true)
    setDragStart({ x, y })
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart || selectedTool === 'select') return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    // Create annotation based on tool
    if (selectedTool === 'highlight') {
      onAnnotationAdd?.({
        type: 'highlight',
        page: currentPage,
        position: { 
          x: Math.min(dragStart.x, x), 
          y: Math.min(dragStart.y, y),
          width: Math.abs(x - dragStart.x),
          height: Math.abs(y - dragStart.y)
        },
        content: 'Highlighted text',
        color: '#FFFF00',
        author: 'Current User',
      })
    } else if (selectedTool === 'note') {
      onAnnotationAdd?.({
        type: 'note',
        page: currentPage,
        position: { x: dragStart.x, y: dragStart.y },
        content: 'New note',
        color: '#FF6B6B',
        author: 'Current User',
      })
    }
    
    setIsDragging(false)
    setDragStart(null)
  }

  return (
    <div className="flex items-center justify-center h-full p-4">
      <div 
        ref={canvasRef}
        className="relative bg-white shadow-lg"
        style={{ 
          width: `${config.zoom}%`,
          aspectRatio: '8.5/11', // Standard letter size
          maxWidth: '100%',
          maxHeight: '100%',
          transform: `rotate(${config.rotation}deg)`,
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {/* Document Content Placeholder */}
        <div className="absolute inset-0 border">
          <div className="p-8 text-sm leading-relaxed">
            <h1 className="text-2xl font-bold mb-4">{doc.name}</h1>
            <p className="mb-4">
              This is a simulated document viewer showing page {currentPage} of {doc.pages}.
              In a real implementation, this would render the actual document content using
              a PDF rendering library like PDF.js or similar.
            </p>
            <p className="mb-4">
              The document viewer supports various annotation types, zoom controls,
              and navigation features. Click and drag with the highlight or note tools
              to add annotations to the document.
            </p>
            <p className="mb-4">
              Additional features include search functionality, outline navigation,
              and comprehensive document management capabilities.
            </p>
            {doc.type === 'pdf' && (
              <p className="text-xs text-gray-500 mt-8">
                PDF Document • {doc.pages} pages • {formatFileSize(doc.size)}
              </p>
            )}
          </div>
        </div>

        {/* Grid Overlay */}
        {config.showGrid && (
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        )}

        {/* Annotations */}
        {config.showAnnotations && annotations.map(annotation => (
          <div
            key={annotation.id}
            className="absolute cursor-pointer"
            style={{
              left: `${annotation.position.x}%`,
              top: `${annotation.position.y}%`,
              width: annotation.position.width ? `${annotation.position.width}%` : '20px',
              height: annotation.position.height ? `${annotation.position.height}%` : '20px',
            }}
          >
            {annotation.type === 'highlight' && (
              <div
                className="w-full h-full opacity-40"
                style={{ backgroundColor: annotation.color }}
              />
            )}
            {annotation.type === 'note' && (
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: annotation.color }}
              >
                <MessageSquare className="w-3 h-3" />
              </div>
            )}
          </div>
        ))}

        {/* Current Selection */}
        {isDragging && dragStart && (
          <div
            className="absolute border-2 border-primary opacity-50"
            style={{
              left: `${dragStart.x}%`,
              top: `${dragStart.y}%`,
              width: '100px',
              height: '20px',
              backgroundColor: selectedTool === 'highlight' ? '#FFFF00' : 'transparent',
            }}
          />
        )}
      </div>
    </div>
  )
}

// Utility function to create mock document
export function createMockDocument(): Document {
  return {
    id: 'doc-1',
    name: 'Property Purchase Agreement.pdf',
    type: 'pdf',
    size: 2048576, // 2MB
    pages: 12,
    url: '/documents/sample.pdf',
    uploadDate: new Date(),
    category: 'Legal',
    tags: ['contract', 'purchase', 'legal'],
    version: '1.0',
    isConfidential: true,
    permissions: {
      canView: true,
      canDownload: true,
      canPrint: true,
      canAnnotate: true,
      canShare: false,
      canEdit: false,
    },
    metadata: {
      title: 'Property Purchase Agreement',
      author: 'Legal Department',
      subject: 'Real Estate Purchase Contract',
      keywords: ['real estate', 'purchase', 'contract'],
      creationDate: new Date('2024-01-15'),
      modificationDate: new Date('2024-01-20'),
      creator: 'Adobe Acrobat',
      producer: 'Adobe PDF Library',
    },
  }
}