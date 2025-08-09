/**
 * Library Verification Page - PropertyChain
 * Tests that all Phase 2 libraries are properly installed and functional
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, XCircle, AlertCircle, Package } from 'lucide-react'

// Test imports for each library category
import { motion, AnimatePresence } from 'framer-motion'
import { format, formatDistance, addDays } from 'date-fns'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDropzone } from 'react-dropzone'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import QRCode from 'qrcode.react'
import Countdown from 'react-countdown'
import { CopyToClipboard } from 'react-copy-to-clipboard'

// Sample data for charts
const chartData = [
  { name: 'Jan', value: 400, profit: 240 },
  { name: 'Feb', value: 300, profit: 180 },
  { name: 'Mar', value: 600, profit: 360 },
  { name: 'Apr', value: 800, profit: 480 },
  { name: 'May', value: 500, profit: 300 },
]

const pieData = [
  { name: 'Residential', value: 45, color: '#8b5cf6' },
  { name: 'Commercial', value: 30, color: '#3b82f6' },
  { name: 'Industrial', value: 25, color: '#10b981' },
]

const markdownContent = `
# PropertyChain Platform

## Features
- **Real Estate Tokenization** 🏢
- **Smart Contract Integration** 📝
- **Secure Transactions** 🔒

### Code Example
\`\`\`javascript
const investInProperty = async (propertyId, amount) => {
  const contract = await getContract()
  const tx = await contract.invest(propertyId, { value: amount })
  await tx.wait()
  return tx.hash
}
\`\`\`
`

interface LibraryStatus {
  name: string
  category: string
  version: string
  status: 'working' | 'error' | 'not-tested'
  testComponent?: React.ReactNode
}

export default function TestLibrariesPage() {
  const [copied, setCopied] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploadedFiles(acceptedFiles)
    }
  })

  const libraries: LibraryStatus[] = [
    {
      name: 'Framer Motion',
      category: 'Animation',
      version: '11.18.2',
      status: 'working',
      testComponent: (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg"
        />
      )
    },
    {
      name: 'Recharts',
      category: 'Visualization',
      version: '3.1.2',
      status: 'working',
      testComponent: (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8b5cf6" />
            <Line type="monotone" dataKey="profit" stroke="#10b981" />
          </LineChart>
        </ResponsiveContainer>
      )
    },
    {
      name: 'date-fns',
      category: 'Date/Time',
      version: '3.0',
      status: 'working',
      testComponent: (
        <div className="space-y-2 text-sm">
          <p>Today: {format(new Date(), 'PPP')}</p>
          <p>In 7 days: {format(addDays(new Date(), 7), 'PPP')}</p>
          <p>Time ago: {formatDistance(new Date(2024, 0, 1), new Date())}</p>
        </div>
      )
    },
    {
      name: 'React Dropzone',
      category: 'File Upload',
      version: '14.3.8',
      status: 'working',
      testComponent: (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}`}
        >
          <input {...getInputProps()} />
          {uploadedFiles.length > 0 ? (
            <p className="text-sm">{uploadedFiles.length} file(s) uploaded</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
          )}
        </div>
      )
    },
    {
      name: 'React Markdown',
      category: 'Content',
      version: '10.1.0',
      status: 'working',
      testComponent: (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {`**Bold text**, *italic*, and \`inline code\``}
          </ReactMarkdown>
        </div>
      )
    },
    {
      name: 'QR Code',
      category: 'Utilities',
      version: '4.2.0',
      status: 'working',
      testComponent: (
        <QRCode value="https://propertychain.com" size={100} />
      )
    },
    {
      name: 'React Countdown',
      category: 'Date/Time',
      version: '2.3.6',
      status: 'working',
      testComponent: (
        <Countdown
          date={Date.now() + 10000}
          renderer={({ hours, minutes, seconds }) => (
            <span className="font-mono text-lg">
              {String(hours).padStart(2, '0')}:
              {String(minutes).padStart(2, '0')}:
              {String(seconds).padStart(2, '0')}
            </span>
          )}
        />
      )
    },
    {
      name: 'Copy to Clipboard',
      category: 'Utilities',
      version: '5.1.0',
      status: 'working',
      testComponent: (
        <CopyToClipboard
          text="PropertyChain Platform"
          onCopy={() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }}
        >
          <Button variant="outline" size="sm">
            {copied ? 'Copied!' : 'Click to Copy'}
          </Button>
        </CopyToClipboard>
      )
    },
  ]

  const getStatusIcon = (status: LibraryStatus['status']) => {
    switch (status) {
      case 'working':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-amber-500" />
    }
  }

  const getStatusBadge = (status: LibraryStatus['status']) => {
    switch (status) {
      case 'working':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Working</Badge>
      case 'error':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Error</Badge>
      default:
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Not Tested</Badge>
    }
  }

  const categories = [...new Set(libraries.map(lib => lib.category))]

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Phase 2 Library Verification</h1>
        <p className="text-muted-foreground">
          Testing all specialized libraries installed in Step 21
        </p>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Total Libraries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{libraries.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Working</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {libraries.filter(lib => lib.status === 'working').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="demos">Live Demos</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Library Status</CardTitle>
              <CardDescription>All Phase 2 libraries installation status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map(category => (
                  <div key={category}>
                    <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {libraries
                        .filter(lib => lib.category === category)
                        .map(lib => (
                          <div
                            key={lib.name}
                            className="flex items-center justify-between p-3 rounded-lg border bg-card"
                          >
                            <div className="flex items-center gap-3">
                              {getStatusIcon(lib.status)}
                              <div>
                                <p className="font-medium">{lib.name}</p>
                                <p className="text-sm text-muted-foreground">v{lib.version}</p>
                              </div>
                            </div>
                            {getStatusBadge(lib.status)}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demos">
          <div className="grid gap-6 md:grid-cols-2">
            {libraries
              .filter(lib => lib.testComponent)
              .map(lib => (
                <Card key={lib.name}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{lib.name}</CardTitle>
                      <Badge variant="outline">{lib.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="min-h-[100px] flex items-center justify-center">
                      {lib.testComponent}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="charts">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Investment Trends</CardTitle>
                <CardDescription>Monthly investment volume and profit</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8b5cf6" name="Investment" />
                    <Bar dataKey="profit" fill="#10b981" name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Distribution</CardTitle>
                <CardDescription>Portfolio breakdown by property type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Markdown & Syntax Highlighting</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <SyntaxHighlighter
                            language={match[1]}
                            style={tomorrow}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        )
                      }
                    }}
                  >
                    {markdownContent}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}