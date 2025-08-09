/**
 * Print Layouts Test Page - PropertyChain
 * Tests all print layout components and features
 */

'use client'

import { useState, useCallback, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  PrintLayout,
  PrintPreview,
  PrintManager,
  PrintButton,
  createMockPrintableDocument,
  type PrintableDocument,
  type PrintOptions,
} from '@/components/custom/print-layouts'
import {
  PropertyListingPrint,
  TransactionReportPrint,
  MarketReportPrint,
  createMockPropertyListingData,
  createMockTransactionData,
  createMockMarketReportData,
  type PropertyListingPrintData,
  type TransactionReportData,
  type MarketReportData,
} from '@/components/custom/property-print-layouts'
import {
  Print,
  Download,
  Eye,
  FileText,
  Image,
  Settings,
  Share,
  Mail,
  Copy,
  Save,
  Printer,
  FileDown,
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
  Receipt,
  BookOpen,
  Target,
  Zap,
  Clock,
  AlertTriangle,
  Layers,
  Navigation,
  PaperclipIcon,
  Palette,
  Ruler,
  PageBreak,
} from 'lucide-react'
import { addDays, subDays, subHours, subMinutes } from 'date-fns'
import { toastSuccess, toastInfo, toastError, toastWarning } from '@/lib/toast'

// Mock data
const mockPropertyData = createMockPropertyListingData()
const mockTransactionData = createMockTransactionData()
const mockMarketData = createMockMarketReportData()

const mockPrintableDocuments: PrintableDocument[] = [
  {
    ...createMockPrintableDocument('property'),
    title: 'Property Listing - 123 Maple Street',
    content: <PropertyListingPrint data={mockPropertyData} variant="full" />,
    createdAt: subDays(new Date(), 2),
    updatedAt: subHours(new Date(), 3),
  },
  {
    ...createMockPrintableDocument('transaction'),
    title: 'Transaction Report - Sacramento Property',
    content: <TransactionReportPrint data={mockTransactionData} variant="detailed" />,
    createdAt: subDays(new Date(), 5),
    updatedAt: subHours(new Date(), 1),
  },
  {
    ...createMockPrintableDocument('report'),
    title: 'Market Analysis - Downtown Sacramento',
    content: <MarketReportPrint data={mockMarketData} />,
    createdAt: subDays(new Date(), 1),
    updatedAt: subMinutes(new Date(), 30),
  },
  {
    ...createMockPrintableDocument('contract'),
    title: 'Purchase Agreement - 123 Maple Street',
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">PURCHASE AGREEMENT</h1>
          <p className="text-muted-foreground">Real Estate Purchase Contract</p>
        </div>
        <div className="space-y-4">
          <p>This Purchase Agreement is entered into between the Buyer and Seller for the property located at 123 Maple Street, Sacramento, CA 95814.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold">Purchase Price</h3>
              <p>$750,000</p>
            </div>
            <div>
              <h3 className="font-semibold">Earnest Money</h3>
              <p>$7,500</p>
            </div>
            <div>
              <h3 className="font-semibold">Closing Date</h3>
              <p>{addDays(new Date(), 30).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-semibold">Possession Date</h3>
              <p>{addDays(new Date(), 30).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    ),
    createdAt: subDays(new Date(), 3),
    updatedAt: subDays(new Date(), 1),
    status: 'draft',
  },
  {
    ...createMockPrintableDocument('invoice'),
    title: 'Commission Invoice - PropertyChain Services',
    content: (
      <div className="space-y-6">
        <div className="text-center border-b pb-4">
          <h1 className="text-2xl font-bold">INVOICE</h1>
          <p className="text-muted-foreground">PropertyChain Realty Services</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-semibold mb-2">Bill To:</h3>
            <div className="text-sm">
              <div>John and Mary Smith</div>
              <div>123 Main Street</div>
              <div>Sacramento, CA 95814</div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Invoice Details:</h3>
            <div className="text-sm">
              <div>Invoice #: INV-2024-001</div>
              <div>Date: {new Date().toLocaleDateString()}</div>
              <div>Due Date: {addDays(new Date(), 30).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
              <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Real Estate Commission (3%)</td>
              <td className="border border-gray-300 px-4 py-2 text-right">$22,500.00</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Transaction Coordination</td>
              <td className="border border-gray-300 px-4 py-2 text-right">$500.00</td>
            </tr>
            <tr className="bg-gray-50 font-semibold">
              <td className="border border-gray-300 px-4 py-2">Total</td>
              <td className="border border-gray-300 px-4 py-2 text-right">$23,000.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
    createdAt: subDays(new Date(), 4),
    updatedAt: subHours(new Date(), 6),
  },
]

export default function TestPrintLayoutsPage() {
  const [selectedTab, setSelectedTab] = useState('basic')
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [previewContent, setPreviewContent] = useState<React.ReactNode>(null)
  const [previewTitle, setPreviewTitle] = useState('')
  const [printOptions, setPrintOptions] = useState<PrintOptions>({
    orientation: 'portrait',
    paperSize: 'a4',
    margin: 'standard',
    scale: 100,
    showHeader: true,
    showFooter: true,
    showPageNumbers: true,
    colorMode: 'color',
    quality: 'normal',
  })

  const handlePrintDocument = useCallback((documentIds: string[]) => {
    toastSuccess(`Printing ${documentIds.length} document(s)`)
    console.log('Print documents:', documentIds)
  }, [])

  const handlePreviewDocument = useCallback((document: PrintableDocument) => {
    setPreviewContent(document.content)
    setPreviewTitle(document.title)
    setShowPreview(true)
    toastInfo(`Previewing: ${document.title}`)
  }, [])

  const handleDownloadPDF = useCallback(() => {
    toastSuccess('PDF download started')
  }, [])

  const generateSamplePrint = useCallback(() => {
    const sampleContent = (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Sample Document</h2>
        <p>This is a sample document for testing print layouts and PDF generation.</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 border rounded">
            <h3 className="font-semibold">Section A</h3>
            <p>Content for section A goes here.</p>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-semibold">Section B</h3>
            <p>Content for section B goes here.</p>
          </div>
        </div>
      </div>
    )
    setPreviewContent(sampleContent)
    setPreviewTitle('Sample Print Document')
    setShowPreview(true)
    toastInfo('Generated sample print document')
  }, [])

  // Stats calculations
  const totalDocuments = mockPrintableDocuments.length
  const draftDocuments = mockPrintableDocuments.filter(d => d.status === 'draft').length
  const finalDocuments = mockPrintableDocuments.filter(d => d.status === 'final').length
  const selectedCount = selectedDocuments.length

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Print Layouts Test</h1>
            <p className="text-muted-foreground">
              Testing print-optimized layouts with PDF export and preview capabilities
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={generateSamplePrint}>
              <Eye className="mr-2 h-4 w-4" />
              Preview Sample
            </Button>
            <PrintButton
              content={
                <div className="p-8">
                  <h1 className="text-2xl font-bold mb-4">Test Print Document</h1>
                  <p>This is a test document to demonstrate the print functionality.</p>
                </div>
              }
              title="Test Document"
              options={printOptions}
            />
          </div>
        </div>
      </div>

      {/* Print Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold text-blue-500">{totalDocuments}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Draft Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-2xl font-bold text-yellow-500">{draftDocuments}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Final Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold text-green-500">{finalDocuments}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Selected for Print
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Print className="h-4 w-4 text-purple-500" />
              <span className="text-2xl font-bold text-purple-500">{selectedCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Print</TabsTrigger>
          <TabsTrigger value="property">Property Listings</TabsTrigger>
          <TabsTrigger value="transaction">Transactions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="manager">Print Manager</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        {/* Basic Print Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Basic Print Layouts</CardTitle>
                  <CardDescription>
                    Core print layout components with customizable options
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Print-Optimized</Badge>
                  <Badge variant="outline">PDF Export</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Print Options */}
                <div>
                  <h3 className="font-semibold mb-4">Print Options</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Paper Size</label>
                      <select 
                        className="w-full mt-1 p-2 border rounded"
                        value={printOptions.paperSize}
                        onChange={(e) => setPrintOptions(prev => ({ 
                          ...prev, 
                          paperSize: e.target.value as any 
                        }))}
                      >
                        <option value="a4">A4</option>
                        <option value="letter">Letter</option>
                        <option value="legal">Legal</option>
                        <option value="a3">A3</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Orientation</label>
                      <select 
                        className="w-full mt-1 p-2 border rounded"
                        value={printOptions.orientation}
                        onChange={(e) => setPrintOptions(prev => ({ 
                          ...prev, 
                          orientation: e.target.value as any 
                        }))}
                      >
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Margins</label>
                      <select 
                        className="w-full mt-1 p-2 border rounded"
                        value={printOptions.margin}
                        onChange={(e) => setPrintOptions(prev => ({ 
                          ...prev, 
                          margin: e.target.value as any 
                        }))}
                      >
                        <option value="none">None</option>
                        <option value="minimal">Minimal</option>
                        <option value="standard">Standard</option>
                        <option value="large">Large</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={printOptions.showHeader}
                          onChange={(e) => setPrintOptions(prev => ({ 
                            ...prev, 
                            showHeader: e.target.checked 
                          }))}
                        />
                        <span className="text-sm">Show header</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={printOptions.showFooter}
                          onChange={(e) => setPrintOptions(prev => ({ 
                            ...prev, 
                            showFooter: e.target.checked 
                          }))}
                        />
                        <span className="text-sm">Show footer</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={printOptions.showPageNumbers}
                          onChange={(e) => setPrintOptions(prev => ({ 
                            ...prev, 
                            showPageNumbers: e.target.checked 
                          }))}
                        />
                        <span className="text-sm">Page numbers</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Sample Documents */}
                <div className="lg:col-span-2">
                  <h3 className="font-semibold mb-4">Sample Documents</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      { 
                        title: 'Simple Document', 
                        icon: <FileText className="h-6 w-6 text-blue-500" />,
                        content: (
                          <div>
                            <h2 className="text-xl font-bold mb-4">Simple Document</h2>
                            <p>This is a basic document with minimal formatting.</p>
                          </div>
                        )
                      },
                      { 
                        title: 'Formatted Report', 
                        icon: <BarChart3 className="h-6 w-6 text-green-500" />,
                        content: (
                          <div className="space-y-4">
                            <h2 className="text-xl font-bold">Formatted Report</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="p-4 border rounded">
                                <h3 className="font-semibold">Section 1</h3>
                                <p>Content goes here.</p>
                              </div>
                              <div className="p-4 border rounded">
                                <h3 className="font-semibold">Section 2</h3>
                                <p>More content here.</p>
                              </div>
                            </div>
                          </div>
                        )
                      },
                      { 
                        title: 'Invoice Template', 
                        icon: <Receipt className="h-6 w-6 text-purple-500" />,
                        content: (
                          <div className="space-y-4">
                            <div className="text-center">
                              <h2 className="text-2xl font-bold">INVOICE</h2>
                              <p>Invoice #12345</p>
                            </div>
                            <div className="border-t pt-4">
                              <div className="flex justify-between">
                                <span>Service</span>
                                <span>$100.00</span>
                              </div>
                            </div>
                          </div>
                        )
                      },
                      { 
                        title: 'Contract Template', 
                        icon: <FileText className="h-6 w-6 text-orange-500" />,
                        content: (
                          <div className="space-y-4">
                            <div className="text-center">
                              <h2 className="text-2xl font-bold">CONTRACT</h2>
                              <p>Agreement Template</p>
                            </div>
                            <div>
                              <p>This contract is entered into between the parties...</p>
                            </div>
                          </div>
                        )
                      },
                    ].map((doc, index) => (
                      <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            {doc.icon}
                            <h4 className="font-medium">{doc.title}</h4>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setPreviewContent(doc.content)
                                setPreviewTitle(doc.title)
                                setShowPreview(true)
                              }}
                            >
                              <Eye className="mr-1 h-3 w-3" />
                              Preview
                            </Button>
                            <PrintButton
                              content={doc.content}
                              title={doc.title}
                              options={printOptions}
                              size="sm"
                              variant="outline"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <Printer className="h-4 w-4" />
            <AlertDescription>
              Print layouts are optimized for paper output with proper margins, page breaks, and print-specific CSS. 
              The preview shows how documents will appear when printed or exported to PDF.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Property Listings Tab */}
        <TabsContent value="property" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Property Listing Prints
                  </CardTitle>
                  <CardDescription>
                    Professional property listing layouts for marketing and documentation
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    <MapPin className="mr-1 h-3 w-3" />
                    Real Estate
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  {
                    title: 'Full Property Listing',
                    description: 'Complete listing with all details, features, and agent info',
                    variant: 'full' as const,
                    icon: <Building className="h-6 w-6 text-blue-500" />,
                  },
                  {
                    title: 'Property Summary',
                    description: 'Condensed listing with key information only',
                    variant: 'summary' as const,
                    icon: <FileText className="h-6 w-6 text-green-500" />,
                  },
                  {
                    title: 'Property Flyer',
                    description: 'Marketing flyer format for open houses and advertising',
                    variant: 'flyer' as const,
                    icon: <Star className="h-6 w-6 text-purple-500" />,
                  },
                ].map((layout, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {layout.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{layout.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {layout.description}
                          </p>
                          <div className="flex gap-2">
                            <Button 
                              size="sm"
                              onClick={() => {
                                const content = (
                                  <PropertyListingPrint 
                                    data={mockPropertyData} 
                                    variant={layout.variant}
                                  />
                                )
                                setPreviewContent(content)
                                setPreviewTitle(`Property Listing - ${layout.title}`)
                                setShowPreview(true)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </Button>
                            <PrintButton
                              content={
                                <PropertyListingPrint 
                                  data={mockPropertyData} 
                                  variant={layout.variant}
                                />
                              }
                              title={`Property Listing - ${layout.title}`}
                              variant="outline"
                              size="sm"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="font-semibold mb-4">Property Information</h3>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center p-4 border rounded">
                    <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold">${mockPropertyData.price.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">List Price</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <Home className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold">{mockPropertyData.bedrooms}/{mockPropertyData.bathrooms}</div>
                    <div className="text-sm text-muted-foreground">Bed/Bath</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <Building className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold">{mockPropertyData.squareFeet.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Sq Ft</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                    <div className="text-2xl font-bold">{mockPropertyData.listing.daysOnMarket}</div>
                    <div className="text-sm text-muted-foreground">Days on Market</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transaction Tab */}
        <TabsContent value="transaction" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Transaction Reports
                  </CardTitle>
                  <CardDescription>
                    Comprehensive transaction documentation and progress tracking
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Progress Tracking
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {[
                  {
                    title: 'Transaction Summary',
                    description: 'High-level overview of transaction progress and key details',
                    variant: 'summary' as const,
                    icon: <BarChart3 className="h-6 w-6 text-blue-500" />,
                  },
                  {
                    title: 'Detailed Transaction Report',
                    description: 'Complete transaction report with all parties, milestones, and documents',
                    variant: 'detailed' as const,
                    icon: <FileText className="h-6 w-6 text-green-500" />,
                  },
                ].map((layout, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {layout.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{layout.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {layout.description}
                          </p>
                          <div className="flex gap-2">
                            <Button 
                              size="sm"
                              onClick={() => {
                                const content = (
                                  <TransactionReportPrint 
                                    data={mockTransactionData} 
                                    variant={layout.variant}
                                  />
                                )
                                setPreviewContent(content)
                                setPreviewTitle(`Transaction Report - ${layout.title}`)
                                setShowPreview(true)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </Button>
                            <PrintButton
                              content={
                                <TransactionReportPrint 
                                  data={mockTransactionData} 
                                  variant={layout.variant}
                                />
                              }
                              title={`Transaction Report - ${layout.title}`}
                              variant="outline"
                              size="sm"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="font-semibold mb-4">Transaction Progress</h3>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center p-4 border rounded">
                    <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold">${mockTransactionData.financial.purchasePrice.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Purchase Price</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold">{mockTransactionData.financial.interestRate}%</div>
                    <div className="text-sm text-muted-foreground">Interest Rate</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <Activity className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold">
                      {Math.round((mockTransactionData.milestones.filter(m => m.completed).length / mockTransactionData.milestones.length) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Complete</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                    <div className="text-2xl font-bold">
                      {Math.ceil((mockTransactionData.timeline.closingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-sm text-muted-foreground">Days to Close</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Market Reports
                  </CardTitle>
                  <CardDescription>
                    Professional market analysis and comparative reports
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    Market Analysis
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-1">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <PieChart className="h-8 w-8 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">Market Analysis Report</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Comprehensive market report with sales data, trends, comparables, and forecasts
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            onClick={() => {
                              const content = <MarketReportPrint data={mockMarketData} />
                              setPreviewContent(content)
                              setPreviewTitle('Market Analysis Report')
                              setShowPreview(true)
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Preview Report
                          </Button>
                          <PrintButton
                            content={<MarketReportPrint data={mockMarketData} />}
                            title="Market Analysis Report"
                            variant="outline"
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="font-semibold mb-4">Market Summary</h3>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center p-4 border rounded">
                    <Activity className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold">{mockMarketData.summary.totalSales}</div>
                    <div className="text-sm text-muted-foreground">Total Sales</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold">${(mockMarketData.summary.averagePrice / 1000).toFixed(0)}K</div>
                    <div className="text-sm text-muted-foreground">Average Price</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <TrendingUp className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold text-green-600">+{mockMarketData.summary.priceChange}%</div>
                    <div className="text-sm text-muted-foreground">Price Change</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                    <div className="text-2xl font-bold">{mockMarketData.summary.daysOnMarket}</div>
                    <div className="text-sm text-muted-foreground">Days on Market</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Print Manager Tab */}
        <TabsContent value="manager" className="space-y-6">
          <PrintManager
            documents={mockPrintableDocuments}
            selectedDocuments={selectedDocuments}
            onDocumentSelect={setSelectedDocuments}
            onPrint={handlePrintDocument}
            onPreview={handlePreviewDocument}
          />
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Print Features</CardTitle>
                <CardDescription>
                  Core printing and layout capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Print className="h-4 w-4" />
                    <span>Browser print integration</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileDown className="h-4 w-4" />
                    <span>PDF export with jsPDF</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="h-4 w-4" />
                    <span>Print preview with live updates</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Settings className="h-4 w-4" />
                    <span>Customizable print options</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Layout className="h-4 w-4" />
                    <span>Multiple paper sizes and orientations</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Palette className="h-4 w-4" />
                    <span>Color, grayscale, and B&W modes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>PropertyChain Specific</CardTitle>
                <CardDescription>
                  Real estate focused print layouts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Home className="h-4 w-4" />
                    <span>Property listing layouts (full, summary, flyer)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4" />
                    <span>Transaction reports with progress tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BarChart3 className="h-4 w-4" />
                    <span>Market analysis reports</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4" />
                    <span>Contract and legal document templates</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Receipt className="h-4 w-4" />
                    <span>Commission invoices and statements</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Camera className="h-4 w-4" />
                    <span>Property marketing materials</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Layout Options</CardTitle>
                <CardDescription>
                  Flexible layout and formatting options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Ruler className="h-4 w-4" />
                    <span>Customizable margins (none, minimal, standard, large)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <RotateCw className="h-4 w-4" />
                    <span>Portrait and landscape orientations</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ZoomIn className="h-4 w-4" />
                    <span>Scalable content (50% - 200%)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Layers className="h-4 w-4" />
                    <span>Headers, footers, and page numbers</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <PageBreak className="h-4 w-4" />
                    <span>Automatic page breaks and flow</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Type className="h-4 w-4" />
                    <span>Print-optimized typography</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Document Management</CardTitle>
                <CardDescription>
                  Organize and manage printable documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Layers className="h-4 w-4" />
                    <span>Document library with search and filters</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>Bulk selection and batch printing</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span>Document sharing and collaboration</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Version tracking and history</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4" />
                    <span>Access control and permissions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Archive className="h-4 w-4" />
                    <span>Document archiving and organization</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              The print system is designed to work seamlessly across different browsers and operating systems, 
              providing consistent output quality for both screen preview and physical printing. All layouts 
              are optimized for professional real estate documentation needs.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

      {/* Print Preview Dialog */}
      {showPreview && previewContent && (
        <PrintPreview
          content={previewContent}
          title={previewTitle}
          options={printOptions}
          onPrint={() => {
            setShowPreview(false)
            toastSuccess('Document sent to printer')
          }}
          onDownloadPDF={() => {
            setShowPreview(false)
            handleDownloadPDF()
          }}
          onClose={() => setShowPreview(false)}
        />
      )}

      {/* Features Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Print Layouts System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="font-semibold mb-2">Core Components</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ PrintLayout with customizable options</li>
                <li>✅ PrintPreview with live preview and options</li>
                <li>✅ PrintManager for document organization</li>
                <li>✅ PrintButton for easy print/PDF actions</li>
                <li>✅ Print-optimized CSS and styles</li>
                <li>✅ PDF export with jsPDF integration</li>
                <li>✅ Responsive print layouts</li>
                <li>✅ Browser print dialog integration</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">PropertyChain Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Property listing prints (full, summary, flyer)</li>
                <li>✅ Transaction reports with progress tracking</li>
                <li>✅ Market analysis and comparative reports</li>
                <li>✅ Contract and legal document templates</li>
                <li>✅ Commission invoices and statements</li>
                <li>✅ Property marketing materials</li>
                <li>✅ Agent and brokerage branding</li>
                <li>✅ Real estate specific data formatting</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Advanced Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Multiple paper sizes (A4, Letter, Legal, A3)</li>
                <li>✅ Portrait and landscape orientations</li>
                <li>✅ Customizable margins and spacing</li>
                <li>✅ Color, grayscale, and B&W printing modes</li>
                <li>✅ Headers, footers, and page numbering</li>
                <li>✅ Document watermarks and branding</li>
                <li>✅ Batch printing and bulk operations</li>
                <li>✅ Print quality optimization</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Import missing components 
import { Archive } from 'lucide-react'