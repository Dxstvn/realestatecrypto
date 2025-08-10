/**
 * Communication Center - PropertyChain Admin
 * 
 * Segment builder and email campaign management
 * Following UpdatedUIPlan.md Step 55.3 specifications
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import {
  Mail,
  Users,
  Send,
  Save,
  Plus,
  Filter,
  Edit,
  Trash,
  Copy,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  Target,
  Zap,
  MessageSquare,
  Bell,
  Smartphone,
  Globe,
  FileText,
  Eye,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatNumber, formatDate } from '@/lib/utils/format'
import { toast } from 'sonner'

interface Segment {
  id: string
  name: string
  description: string
  criteria: {
    field: string
    operator: string
    value: any
  }[]
  userCount: number
  createdAt: Date
  lastUsed?: Date
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  variables: string[]
  category: 'marketing' | 'transactional' | 'notification' | 'newsletter'
  createdAt: Date
  lastUsed?: Date
  performance?: {
    sent: number
    opened: number
    clicked: number
    converted: number
  }
}

interface Campaign {
  id: string
  name: string
  segment: Segment
  template: EmailTemplate
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'
  scheduledFor?: Date
  sentAt?: Date
  stats?: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    unsubscribed: number
    bounced: number
  }
}

export function CommunicationCenter() {
  const [activeTab, setActiveTab] = useState('segments')
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  
  // Segment Builder State
  const [segmentName, setSegmentName] = useState('')
  const [segmentDescription, setSegmentDescription] = useState('')
  const [segmentCriteria, setSegmentCriteria] = useState<any[]>([
    { field: 'kycStatus', operator: 'equals', value: 'VERIFIED' }
  ])
  
  // Email Template State
  const [templateName, setTemplateName] = useState('')
  const [templateSubject, setTemplateSubject] = useState('')
  const [templateContent, setTemplateContent] = useState('')
  const [templateCategory, setTemplateCategory] = useState<EmailTemplate['category']>('marketing')
  
  // Campaign State
  const [campaignName, setCampaignName] = useState('')
  const [scheduleType, setScheduleType] = useState<'now' | 'later'>('now')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  
  // Sample data
  const [segments] = useState<Segment[]>([
    {
      id: '1',
      name: 'Active Investors',
      description: 'Users who have made investments in the last 30 days',
      criteria: [
        { field: 'lastInvestment', operator: 'within', value: '30 days' },
        { field: 'kycStatus', operator: 'equals', value: 'VERIFIED' }
      ],
      userCount: 3456,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      name: 'High Value Users',
      description: 'Users with total investments over $100,000',
      criteria: [
        { field: 'investmentTotal', operator: 'greater_than', value: 100000 }
      ],
      userCount: 892,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      name: 'Pending KYC',
      description: 'Users who need to complete KYC verification',
      criteria: [
        { field: 'kycStatus', operator: 'equals', value: 'PENDING' }
      ],
      userCount: 156,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  ])
  
  const [templates] = useState<EmailTemplate[]>([
    {
      id: '1',
      name: 'Welcome Email',
      subject: 'Welcome to PropertyChain, {{firstName}}!',
      content: 'Dear {{firstName}},\n\nWelcome to PropertyChain...',
      variables: ['firstName', 'email'],
      category: 'transactional',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      performance: {
        sent: 5432,
        opened: 4123,
        clicked: 2341,
        converted: 892,
      }
    },
    {
      id: '2',
      name: 'New Property Alert',
      subject: 'New Investment Opportunity: {{propertyName}}',
      content: 'A new property matching your criteria is now available...',
      variables: ['propertyName', 'propertyLocation', 'roi'],
      category: 'marketing',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      performance: {
        sent: 8921,
        opened: 5234,
        clicked: 1892,
        converted: 423,
      }
    },
  ])
  
  const [campaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Q4 Investment Opportunities',
      segment: segments[0],
      template: templates[1],
      status: 'sent',
      sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      stats: {
        sent: 3456,
        delivered: 3398,
        opened: 2234,
        clicked: 892,
        unsubscribed: 12,
        bounced: 58,
      }
    },
    {
      id: '2',
      name: 'KYC Reminder',
      segment: segments[2],
      template: templates[0],
      status: 'scheduled',
      scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },
  ])
  
  // Handlers
  const handleAddCriteria = () => {
    setSegmentCriteria([...segmentCriteria, { field: '', operator: 'equals', value: '' }])
  }
  
  const handleRemoveCriteria = (index: number) => {
    setSegmentCriteria(segmentCriteria.filter((_, i) => i !== index))
  }
  
  const handleSaveSegment = () => {
    if (!segmentName) {
      toast.error('Please enter a segment name')
      return
    }
    toast.success('Segment saved successfully')
    // Save segment logic
  }
  
  const handleSaveTemplate = () => {
    if (!templateName || !templateSubject || !templateContent) {
      toast.error('Please fill in all template fields')
      return
    }
    toast.success('Template saved successfully')
    // Save template logic
  }
  
  const handleSendCampaign = () => {
    if (!campaignName || !selectedSegment || !selectedTemplate) {
      toast.error('Please complete all campaign settings')
      return
    }
    
    if (scheduleType === 'now') {
      toast.success('Campaign sent successfully')
    } else {
      toast.success('Campaign scheduled successfully')
    }
    // Send/schedule campaign logic
  }
  
  const handleTestEmail = () => {
    toast.success('Test email sent to your address')
  }
  
  // Calculate open rate
  const calculateRate = (numerator: number, denominator: number) => {
    if (denominator === 0) return 0
    return ((numerator / denominator) * 100).toFixed(1)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Communication Center</h2>
          <p className="text-gray-500 mt-1">
            Create segments, manage templates, and send targeted campaigns
          </p>
        </div>
        
        <Button className="gap-2">
          <Send className="h-4 w-4" />
          New Campaign
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        {/* Segments Tab */}
        <TabsContent value="segments" className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Segment Builder */}
            <div className="col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Segment Builder</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Segment Name</Label>
                      <Input
                        className="mt-2"
                        placeholder="e.g., High Value Investors"
                        value={segmentName}
                        onChange={(e) => setSegmentName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        className="mt-2"
                        placeholder="Brief description..."
                        value={segmentDescription}
                        onChange={(e) => setSegmentDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Criteria</Label>
                    <div className="space-y-2 mt-2">
                      {segmentCriteria.map((criteria, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Select
                            value={criteria.field}
                            onValueChange={(value) => {
                              const updated = [...segmentCriteria]
                              updated[index].field = value
                              setSegmentCriteria(updated)
                            }}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Field" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kycStatus">KYC Status</SelectItem>
                              <SelectItem value="investmentTotal">Investment Total</SelectItem>
                              <SelectItem value="lastActive">Last Active</SelectItem>
                              <SelectItem value="accountAge">Account Age</SelectItem>
                              <SelectItem value="location">Location</SelectItem>
                              <SelectItem value="role">User Role</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Select
                            value={criteria.operator}
                            onValueChange={(value) => {
                              const updated = [...segmentCriteria]
                              updated[index].operator = value
                              setSegmentCriteria(updated)
                            }}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="equals">Equals</SelectItem>
                              <SelectItem value="not_equals">Not Equals</SelectItem>
                              <SelectItem value="greater_than">Greater Than</SelectItem>
                              <SelectItem value="less_than">Less Than</SelectItem>
                              <SelectItem value="contains">Contains</SelectItem>
                              <SelectItem value="within">Within</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Input
                            className="flex-1"
                            placeholder="Value"
                            value={criteria.value}
                            onChange={(e) => {
                              const updated = [...segmentCriteria]
                              updated[index].value = e.target.value
                              setSegmentCriteria(updated)
                            }}
                          />
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCriteria(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddCriteria}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Criteria
                      </Button>
                    </div>
                  </div>
                  
                  <Alert>
                    <Users className="h-4 w-4" />
                    <AlertDescription>
                      This segment will include approximately <strong>1,234 users</strong> based on current criteria.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleSaveSegment}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Segment
                    </Button>
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Users
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Saved Segments */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Saved Segments</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {segments.map((segment) => (
                        <button
                          key={segment.id}
                          onClick={() => setSelectedSegment(segment)}
                          className={cn(
                            "w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors",
                            selectedSegment?.id === segment.id && "border-primary bg-primary/5"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{segment.name}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                {segment.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary">
                                  <Users className="h-3 w-3 mr-1" />
                                  {formatNumber(segment.userCount)}
                                </Badge>
                                {segment.lastUsed && (
                                  <span className="text-xs text-gray-500">
                                    Used {formatTimeAgo(segment.lastUsed)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Template Editor */}
            <div className="col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Email Template Editor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Template Name</Label>
                      <Input
                        className="mt-2"
                        placeholder="e.g., Monthly Newsletter"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select value={templateCategory} onValueChange={(v) => setTemplateCategory(v as any)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="transactional">Transactional</SelectItem>
                          <SelectItem value="notification">Notification</SelectItem>
                          <SelectItem value="newsletter">Newsletter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Subject Line</Label>
                    <Input
                      className="mt-2"
                      placeholder="e.g., {{firstName}}, check out these new properties!"
                      value={templateSubject}
                      onChange={(e) => setTemplateSubject(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>Email Content</Label>
                    <Textarea
                      className="mt-2 font-mono text-sm"
                      placeholder="Write your email content here. Use {{variable}} for dynamic content."
                      value={templateContent}
                      onChange={(e) => setTemplateContent(e.target.value)}
                      rows={12}
                    />
                  </div>
                  
                  <div>
                    <Label>Available Variables</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['firstName', 'lastName', 'email', 'investmentTotal', 'propertyCount'].map((variable) => (
                        <Badge
                          key={variable}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => {
                            setTemplateContent(templateContent + ` {{${variable}}}`)
                          }}
                        >
                          {`{{${variable}}}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleSaveTemplate}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Template
                    </Button>
                    <Button variant="outline" onClick={handleTestEmail}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Test
                    </Button>
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Template Library */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Template Library</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-2">
                      {templates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => setSelectedTemplate(template)}
                          className={cn(
                            "w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors",
                            selectedTemplate?.id === template.id && "border-primary bg-primary/5"
                          )}
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <p className="font-medium">{template.name}</p>
                              <Badge variant="outline" className="text-xs">
                                {template.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {template.subject}
                            </p>
                            {template.performance && (
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="text-gray-500">Open Rate:</span>
                                  <span className="ml-1 font-medium">
                                    {calculateRate(template.performance.opened, template.performance.sent)}%
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">CTR:</span>
                                  <span className="ml-1 font-medium">
                                    {calculateRate(template.performance.clicked, template.performance.opened)}%
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Campaign</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Campaign Name</Label>
                  <Input
                    className="mt-2"
                    placeholder="e.g., Black Friday Promotion"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label>Select Segment</Label>
                  <Select
                    value={selectedSegment?.id}
                    onValueChange={(value) => {
                      const segment = segments.find(s => s.id === value)
                      setSelectedSegment(segment || null)
                    }}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Choose segment" />
                    </SelectTrigger>
                    <SelectContent>
                      {segments.map((segment) => (
                        <SelectItem key={segment.id} value={segment.id}>
                          {segment.name} ({formatNumber(segment.userCount)} users)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Select Template</Label>
                  <Select
                    value={selectedTemplate?.id}
                    onValueChange={(value) => {
                      const template = templates.find(t => t.id === value)
                      setSelectedTemplate(template || null)
                    }}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Choose template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Schedule</Label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="schedule"
                      value="now"
                      checked={scheduleType === 'now'}
                      onChange={() => setScheduleType('now')}
                    />
                    <span>Send Now</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="schedule"
                      value="later"
                      checked={scheduleType === 'later'}
                      onChange={() => setScheduleType('later')}
                    />
                    <span>Schedule for Later</span>
                  </label>
                </div>
                
                {scheduleType === 'later' && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                    />
                    <Input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                    />
                  </div>
                )}
              </div>
              
              {selectedSegment && selectedTemplate && (
                <Alert>
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    This campaign will send <strong>{selectedTemplate.name}</strong> to{' '}
                    <strong>{formatNumber(selectedSegment.userCount)} users</strong> in the{' '}
                    <strong>{selectedSegment.name}</strong> segment.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex gap-2">
                <Button onClick={handleSendCampaign}>
                  <Send className="h-4 w-4 mr-2" />
                  {scheduleType === 'now' ? 'Send Campaign' : 'Schedule Campaign'}
                </Button>
                <Button variant="outline" onClick={handleTestEmail}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Test
                </Button>
                <Button variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Active Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{campaign.name}</p>
                          <Badge
                            className={cn(
                              campaign.status === 'sent' && 'bg-green-100 text-green-700',
                              campaign.status === 'scheduled' && 'bg-blue-100 text-blue-700',
                              campaign.status === 'sending' && 'bg-yellow-100 text-yellow-700',
                              campaign.status === 'failed' && 'bg-red-100 text-red-700'
                            )}
                          >
                            {campaign.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {campaign.segment.name} • {campaign.template.name}
                        </p>
                        {campaign.scheduledFor && (
                          <p className="text-sm text-gray-500 mt-1">
                            <Clock className="inline h-3 w-3 mr-1" />
                            Scheduled for {formatDate(campaign.scheduledFor)}
                          </p>
                        )}
                      </div>
                      
                      {campaign.stats && (
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-sm text-gray-500">Delivered</p>
                            <p className="text-lg font-bold">
                              {calculateRate(campaign.stats.delivered, campaign.stats.sent)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Opened</p>
                            <p className="text-lg font-bold">
                              {calculateRate(campaign.stats.opened, campaign.stats.delivered)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Clicked</p>
                            <p className="text-lg font-bold">
                              {calculateRate(campaign.stats.clicked, campaign.stats.opened)}%
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {campaigns.filter(c => c.status === 'sent').map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-sm text-gray-500">
                        Sent {campaign.sentAt && formatDate(campaign.sentAt)} to {formatNumber(campaign.segment.userCount)} users
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Report
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Import missing formatTimeAgo
import { formatTimeAgo } from '@/lib/utils/format'