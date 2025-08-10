/**
 * Ticket Management System Component - PropertyChain Admin
 * 
 * Support ticket management with priority queue and assignment workflow
 * Following UpdatedUIPlan.md Step 55.6 specifications and CLAUDE.md principles
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Inbox, Clock, AlertCircle, CheckCircle, XCircle, MessageSquare,
  User, Users, Tag, Filter, Search, ChevronRight, MoreVertical,
  Send, Paperclip, Star, Flag, ArrowUp, ArrowDown, Timer,
  RefreshCw, Download, Upload, Zap, AlertTriangle, Info,
  UserPlus, Mail, Phone, Calendar, History, Eye, Edit
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

// Ticket interface
export interface Ticket {
  id: string
  number: string
  subject: string
  description: string
  status: 'new' | 'open' | 'pending' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: 'technical' | 'billing' | 'account' | 'property' | 'kyc' | 'general'
  assignee?: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  customer: {
    id: string
    name: string
    email: string
    avatar?: string
    tier: 'basic' | 'premium' | 'vip'
  }
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
  responseTime?: number // minutes
  tags: string[]
  attachments: number
  messages: Message[]
  escalated: boolean
  satisfaction?: number // 1-5
}

// Message interface
interface Message {
  id: string
  ticketId: string
  sender: {
    id: string
    name: string
    email: string
    avatar?: string
    isSupport: boolean
  }
  content: string
  timestamp: Date
  attachments?: string[]
  internal?: boolean
}

// Response template interface
interface ResponseTemplate {
  id: string
  name: string
  category: string
  subject: string
  content: string
  tags: string[]
  useCount: number
}

// Escalation rule interface
interface EscalationRule {
  id: string
  name: string
  condition: 'time' | 'priority' | 'customer_tier' | 'category'
  threshold: number | string
  action: 'notify' | 'reassign' | 'escalate'
  target?: string
}

export function TicketManagement() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [filter, setFilter] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    assignee: 'all',
    search: ''
  })
  const [selectedTickets, setSelectedTickets] = useState<Set<string>>(new Set())
  const [isComposing, setIsComposing] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<ResponseTemplate | null>(null)

  // Generate sample tickets
  useEffect(() => {
    const sampleTickets: Ticket[] = Array.from({ length: 50 }, (_, i) => {
      const statuses: Ticket['status'][] = ['new', 'open', 'pending', 'resolved', 'closed']
      const priorities: Ticket['priority'][] = ['low', 'medium', 'high', 'urgent']
      const categories: Ticket['category'][] = ['technical', 'billing', 'account', 'property', 'kyc', 'general']
      
      const createdAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      
      return {
        id: `ticket-${i + 1}`,
        number: `#${10000 + i}`,
        subject: [
          'Cannot access my property dashboard',
          'Payment failed - need assistance',
          'KYC verification stuck',
          'Property tokenization question',
          'Unable to withdraw funds',
          'Account security concern',
          'Transaction not showing up',
          'Need help with mortgage application'
        ][Math.floor(Math.random() * 8)],
        description: 'Customer is experiencing issues with the platform and needs immediate assistance.',
        status,
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        assignee: Math.random() > 0.3 ? {
          id: `agent-${Math.floor(Math.random() * 5)}`,
          name: ['John Smith', 'Emily Chen', 'Michael Brown', 'Sarah Wilson', 'David Lee'][Math.floor(Math.random() * 5)],
          email: 'agent@propertychain.com',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
        } : undefined,
        customer: {
          id: `customer-${i}`,
          name: ['Alice Johnson', 'Bob Williams', 'Carol Davis', 'Daniel Martinez'][Math.floor(Math.random() * 4)],
          email: `customer${i}@example.com`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
          tier: ['basic', 'premium', 'vip'][Math.floor(Math.random() * 3)] as any
        },
        createdAt,
        updatedAt: new Date(createdAt.getTime() + Math.random() * 60 * 60 * 1000),
        resolvedAt: status === 'resolved' || status === 'closed' ? new Date() : undefined,
        responseTime: Math.floor(Math.random() * 120),
        tags: ['urgent', 'payment', 'bug', 'feature-request'][Math.floor(Math.random() * 4)].split(','),
        attachments: Math.floor(Math.random() * 3),
        messages: [],
        escalated: Math.random() > 0.8,
        satisfaction: status === 'resolved' || status === 'closed' ? Math.floor(3 + Math.random() * 3) : undefined
      }
    })
    
    setTickets(sampleTickets)
  }, [])

  // Response templates
  const responseTemplates: ResponseTemplate[] = [
    {
      id: '1',
      name: 'KYC Verification Help',
      category: 'kyc',
      subject: 'KYC Verification Assistance',
      content: 'Thank you for contacting us regarding your KYC verification. I can help you resolve this issue. Please ensure you have uploaded clear photos of your ID and proof of address. The verification typically takes 24-48 hours.',
      tags: ['kyc', 'verification'],
      useCount: 234
    },
    {
      id: '2',
      name: 'Payment Issue Resolution',
      category: 'billing',
      subject: 'Payment Processing Help',
      content: 'I understand you are experiencing payment issues. Let me investigate this for you. Can you please provide the transaction ID and the approximate time of the attempted payment?',
      tags: ['payment', 'billing'],
      useCount: 189
    },
    {
      id: '3',
      name: 'Technical Support',
      category: 'technical',
      subject: 'Technical Assistance',
      content: 'Thank you for reporting this technical issue. I will escalate this to our engineering team for immediate attention. In the meantime, please try clearing your browser cache and cookies.',
      tags: ['technical', 'bug'],
      useCount: 156
    }
  ]

  // Escalation rules
  const escalationRules: EscalationRule[] = [
    {
      id: '1',
      name: 'High Priority Auto-Escalate',
      condition: 'priority',
      threshold: 'urgent',
      action: 'escalate',
      target: 'senior-support'
    },
    {
      id: '2',
      name: 'VIP Customer Priority',
      condition: 'customer_tier',
      threshold: 'vip',
      action: 'reassign',
      target: 'vip-support'
    },
    {
      id: '3',
      name: 'Time-based Escalation',
      condition: 'time',
      threshold: 120, // minutes
      action: 'notify',
      target: 'supervisor'
    }
  ]

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    if (filter.status !== 'all' && ticket.status !== filter.status) return false
    if (filter.priority !== 'all' && ticket.priority !== filter.priority) return false
    if (filter.category !== 'all' && ticket.category !== filter.category) return false
    if (filter.assignee !== 'all') {
      if (filter.assignee === 'unassigned' && ticket.assignee) return false
      if (filter.assignee === 'assigned' && !ticket.assignee) return false
    }
    if (filter.search) {
      const search = filter.search.toLowerCase()
      return ticket.subject.toLowerCase().includes(search) ||
             ticket.number.toLowerCase().includes(search) ||
             ticket.customer.name.toLowerCase().includes(search)
    }
    return true
  })

  // Get priority color
  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-700 bg-red-100 border-red-200'
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-200'
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-200'
      case 'low': return 'text-blue-700 bg-blue-100 border-blue-200'
      default: return 'text-gray-700 bg-gray-100 border-gray-200'
    }
  }

  // Get status color
  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'new': return 'text-purple-700 bg-purple-100'
      case 'open': return 'text-blue-700 bg-blue-100'
      case 'pending': return 'text-yellow-700 bg-yellow-100'
      case 'resolved': return 'text-green-700 bg-green-100'
      case 'closed': return 'text-gray-700 bg-gray-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  // Get priority icon
  const getPriorityIcon = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'urgent': return AlertTriangle
      case 'high': return ArrowUp
      case 'medium': return ArrowDown
      case 'low': return Info
      default: return Info
    }
  }

  // Assign ticket
  const assignTicket = (ticketId: string, assigneeId: string) => {
    console.log('Assigning ticket:', ticketId, 'to:', assigneeId)
  }

  // Update ticket status
  const updateTicketStatus = (ticketId: string, status: Ticket['status']) => {
    setTickets(prev => prev.map(t => 
      t.id === ticketId ? { ...t, status, updatedAt: new Date() } : t
    ))
  }

  // Calculate statistics
  const stats = {
    new: tickets.filter(t => t.status === 'new').length,
    open: tickets.filter(t => t.status === 'open').length,
    pending: tickets.filter(t => t.status === 'pending').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    urgent: tickets.filter(t => t.priority === 'urgent').length,
    avgResponseTime: tickets.reduce((sum, t) => sum + (t.responseTime || 0), 0) / tickets.length,
    satisfaction: tickets.filter(t => t.satisfaction).reduce((sum, t) => sum + (t.satisfaction || 0), 0) / 
                  tickets.filter(t => t.satisfaction).length || 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tickets..."
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              className="pl-9 w-80"
            />
          </div>
          
          <Select value={filter.status} onValueChange={v => setFilter(prev => ({ ...prev, status: v }))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filter.priority} onValueChange={v => setFilter(prev => ({ ...prev, priority: v }))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          {selectedTickets.size > 0 && (
            <Badge variant="secondary" className="gap-1">
              {selectedTickets.size} selected
            </Badge>
          )}
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">New</p>
                <p className="text-2xl font-bold">{stats.new}</p>
              </div>
              <Inbox className="h-6 w-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Open</p>
                <p className="text-2xl font-bold">{stats.open}</p>
              </div>
              <MessageSquare className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Urgent</p>
                <p className="text-2xl font-bold">{stats.urgent}</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Avg Response</p>
                <p className="text-2xl font-bold">{Math.floor(stats.avgResponseTime)}m</p>
              </div>
              <Timer className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Satisfaction</p>
                <p className="text-2xl font-bold">{stats.satisfaction.toFixed(1)}/5</p>
              </div>
              <Star className="h-6 w-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Urgent tickets alert */}
      {stats.urgent > 5 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{stats.urgent} urgent tickets</strong> require immediate attention. 
            These tickets should be prioritized to maintain service quality.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Support Tickets</CardTitle>
                <Badge variant="outline">
                  {filteredTickets.length} tickets
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {filteredTickets.map(ticket => {
                    const PriorityIcon = getPriorityIcon(ticket.priority)
                    return (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md",
                          selectedTicket?.id === ticket.id && "border-blue-500 bg-blue-50"
                        )}
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={selectedTickets.has(ticket.id)}
                              onCheckedChange={(checked) => {
                                const newSelected = new Set(selectedTickets)
                                if (checked) {
                                  newSelected.add(ticket.id)
                                } else {
                                  newSelected.delete(ticket.id)
                                }
                                setSelectedTickets(newSelected)
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                            
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={ticket.customer.avatar} />
                              <AvatarFallback>{ticket.customer.name[0]}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{ticket.number}</span>
                                <Badge className={cn("text-xs", getPriorityColor(ticket.priority))}>
                                  <PriorityIcon className="h-3 w-3 mr-1" />
                                  {ticket.priority}
                                </Badge>
                                <Badge className={cn("text-xs", getStatusColor(ticket.status))}>
                                  {ticket.status}
                                </Badge>
                                {ticket.escalated && (
                                  <Badge variant="destructive" className="text-xs gap-1">
                                    <Flag className="h-3 w-3" />
                                    Escalated
                                  </Badge>
                                )}
                                {ticket.customer.tier === 'vip' && (
                                  <Badge variant="secondary" className="text-xs gap-1">
                                    <Star className="h-3 w-3" />
                                    VIP
                                  </Badge>
                                )}
                              </div>
                              
                              <p className="font-medium">{ticket.subject}</p>
                              <p className="text-sm text-gray-500 line-clamp-1">{ticket.description}</p>
                              
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>{ticket.customer.name}</span>
                                <span>•</span>
                                <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                                {ticket.assignee && (
                                  <>
                                    <span>•</span>
                                    <span>Assigned to {ticket.assignee.name}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Assign
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Flag className="h-4 w-4 mr-2" />
                                Escalate
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark Resolved
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <XCircle className="h-4 w-4 mr-2" />
                                Close Ticket
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        {/* Ticket Details */}
        <div>
          {selectedTicket ? (
            <Card>
              <CardHeader>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{selectedTicket.number}</h3>
                    <Badge className={cn("text-xs", getStatusColor(selectedTicket.status))}>
                      {selectedTicket.status}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{selectedTicket.subject}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Customer Info */}
                <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedTicket.customer.avatar} />
                      <AvatarFallback>{selectedTicket.customer.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedTicket.customer.name}</p>
                      <p className="text-sm text-gray-500">{selectedTicket.customer.email}</p>
                    </div>
                    {selectedTicket.customer.tier === 'vip' && (
                      <Badge variant="secondary" className="ml-auto">VIP</Badge>
                    )}
                  </div>
                </div>
                
                {/* Ticket Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Priority</span>
                    <Badge className={cn("text-xs", getPriorityColor(selectedTicket.priority))}>
                      {selectedTicket.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Category</span>
                    <span className="capitalize">{selectedTicket.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Created</span>
                    <span>{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                  </div>
                  {selectedTicket.assignee && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Assignee</span>
                      <span>{selectedTicket.assignee.name}</span>
                    </div>
                  )}
                  {selectedTicket.responseTime && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Response Time</span>
                      <span>{selectedTicket.responseTime} min</span>
                    </div>
                  )}
                </div>
                
                {/* Description */}
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-700">{selectedTicket.description}</p>
                </div>
                
                {/* Actions */}
                <div className="pt-4 space-y-2">
                  <Select onValueChange={(status) => updateTicketStatus(selectedTicket.id, status as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Change Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button className="w-full gap-2" onClick={() => setIsComposing(true)}>
                    <MessageSquare className="h-4 w-4" />
                    Reply to Customer
                  </Button>
                  
                  <Button variant="outline" className="w-full gap-2">
                    <UserPlus className="h-4 w-4" />
                    Reassign Ticket
                  </Button>
                  
                  {!selectedTicket.escalated && (
                    <Button variant="outline" className="w-full gap-2">
                      <Flag className="h-4 w-4" />
                      Escalate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center text-gray-400">
                <Inbox className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Select a ticket to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Reply Dialog */}
      <Dialog open={isComposing} onOpenChange={setIsComposing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reply to Ticket</DialogTitle>
            <DialogDescription>
              Send a response to the customer
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Response Template</Label>
              <Select onValueChange={(id) => {
                const template = responseTemplates.find(t => t.id === id)
                if (template) {
                  setSelectedTemplate(template)
                  setReplyContent(template.content)
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {responseTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Message</Label>
              <Textarea
                placeholder="Type your response..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={8}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Paperclip className="h-4 w-4" />
                Attach File
              </Button>
              <div className="flex-1" />
              <Checkbox id="internal">
                <Label htmlFor="internal" className="text-sm ml-2">Internal Note</Label>
              </Checkbox>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsComposing(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              console.log('Sending reply:', replyContent)
              setIsComposing(false)
              setReplyContent('')
            }}>
              <Send className="h-4 w-4 mr-2" />
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}