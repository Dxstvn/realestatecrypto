/**
 * Property Chat - PropertyChain
 * 
 * Specialized chat features for real estate transactions and property management
 */

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  ChatInterface,
  generateMockConversations,
  generateMockUsers,
  type ChatUser,
  type ChatMessage,
  type ChatConversation,
} from './chat-interface'
import {
  Home,
  Building,
  DollarSign,
  Users,
  FileText,
  Calendar,
  MapPin,
  Key,
  Shield,
  Camera,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Star,
  Heart,
  Tag,
  Briefcase,
  Mail,
  Phone,
  Settings,
  Plus,
  Search,
  Filter,
  MoreVertical,
  MessageSquare,
  Zap,
  Target,
  TrendingUp,
  Bell,
  Lock,
  Unlock,
  Eye,
  Share,
  Download,
  Upload,
  Edit,
  Trash2,
  Copy,
  Archive,
  Flag,
  Pin,
  Bookmark,
} from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/format'
import { addDays, subDays, subHours, subMinutes } from 'date-fns'

// PropertyChain Chat Types
export interface PropertyChatRoom extends ChatConversation {
  propertyId?: string
  transactionId?: string
  roomType: 'property' | 'transaction' | 'team' | 'support' | 'general'
  propertyAddress?: string
  transactionStage?: 'listing' | 'offer' | 'contract' | 'inspection' | 'financing' | 'closing'
  participants: PropertyChatParticipant[]
  isArchived?: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  tags?: string[]
  allowedActions?: Array<'view_property' | 'schedule_showing' | 'make_offer' | 'upload_docs' | 'request_info'>
}

export interface PropertyChatParticipant extends ChatUser {
  role: 'buyer' | 'seller' | 'agent' | 'lawyer' | 'inspector' | 'lender' | 'admin'
  permissions: Array<'read' | 'write' | 'invite' | 'manage' | 'moderate'>
  joinedAt: Date
  lastSeen?: Date
  isOwner?: boolean
  licenseNumber?: string
  company?: string
}

export interface PropertyChatMessage extends ChatMessage {
  propertyId?: string
  transactionId?: string
  actionType?: 'info' | 'alert' | 'action_required' | 'milestone' | 'reminder' | 'system'
  relatedEntity?: {
    type: 'property' | 'document' | 'showing' | 'offer' | 'inspection'
    id: string
    name: string
  }
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  requiresResponse?: boolean
  dueDate?: Date
}

// Property Chat Room Manager
interface PropertyChatManagerProps {
  propertyId?: string
  transactionId?: string
  currentUser: PropertyChatParticipant
  rooms?: PropertyChatRoom[]
  onRoomSelect?: (room: PropertyChatRoom) => void
  onCreateRoom?: (room: Partial<PropertyChatRoom>) => void
  onInviteUser?: (roomId: string, userId: string) => void
  className?: string
}

export function PropertyChatManager({
  propertyId,
  transactionId,
  currentUser,
  rooms = [],
  onRoomSelect,
  onCreateRoom,
  onInviteUser,
  className,
}: PropertyChatManagerProps) {
  const [selectedRoom, setSelectedRoom] = React.useState<PropertyChatRoom | null>(null)
  const [filter, setFilter] = React.useState<{
    type?: string
    priority?: string
    archived?: boolean
    search?: string
  }>({})
  const [showCreateDialog, setShowCreateDialog] = React.useState(false)

  // Mock data
  const mockRooms: PropertyChatRoom[] = [
    {
      id: 'room-1',
      name: '123 Main St - Transaction Chat',
      description: 'Discussion about property purchase',
      participants: generateMockUsers(5).map((user, index) => ({
        ...user,
        role: ['buyer', 'seller', 'agent', 'lawyer', 'lender'][index] as any,
        permissions: ['read', 'write'],
        joinedAt: subDays(new Date(), index),
        company: index === 2 ? 'PropertyChain Realty' : undefined,
      })),
      messages: [],
      createdAt: subDays(new Date(), 5),
      updatedAt: subMinutes(new Date(), 15),
      roomType: 'transaction',
      propertyId: 'prop-123',
      transactionId: 'trans-456',
      propertyAddress: '123 Main Street, City, ST 12345',
      transactionStage: 'contract',
      priority: 'high',
      tags: ['urgent', 'closing-soon'],
      allowedActions: ['view_property', 'upload_docs', 'schedule_showing'],
      isPrivate: true,
      hasUnread: true,
      unreadCount: 3,
      lastActivity: subMinutes(new Date(), 15),
    },
    {
      id: 'room-2',
      name: '456 Oak Ave - Property Inquiry',
      description: 'Initial property discussion',
      participants: generateMockUsers(3).map((user, index) => ({
        ...user,
        role: ['buyer', 'agent', 'seller'][index] as any,
        permissions: ['read', 'write'],
        joinedAt: subDays(new Date(), index + 1),
        company: index === 1 ? 'PropertyChain Realty' : undefined,
      })),
      messages: [],
      createdAt: subDays(new Date(), 2),
      updatedAt: subHours(new Date(), 2),
      roomType: 'property',
      propertyId: 'prop-456',
      propertyAddress: '456 Oak Avenue, City, ST 12345',
      priority: 'medium',
      tags: ['new-inquiry'],
      allowedActions: ['view_property', 'schedule_showing', 'make_offer'],
      isPrivate: false,
      hasUnread: false,
      unreadCount: 0,
      lastActivity: subHours(new Date(), 2),
    },
    {
      id: 'room-3',
      name: 'PropertyChain Team',
      description: 'Internal team discussions',
      participants: generateMockUsers(8).map((user, index) => ({
        ...user,
        role: ['agent', 'admin', 'agent', 'agent', 'admin', 'agent', 'agent', 'admin'][index] as any,
        permissions: index < 2 ? ['read', 'write', 'invite', 'manage'] : ['read', 'write'],
        joinedAt: subDays(new Date(), index + 10),
        company: 'PropertyChain Realty',
      })),
      messages: [],
      createdAt: subDays(new Date(), 30),
      updatedAt: subMinutes(new Date(), 45),
      roomType: 'team',
      priority: 'low',
      tags: ['internal', 'team'],
      allowedActions: [],
      isPrivate: true,
      hasUnread: true,
      unreadCount: 1,
      lastActivity: subMinutes(new Date(), 45),
    },
    {
      id: 'room-4',
      name: 'Support & Help',
      description: 'Get help with PropertyChain platform',
      participants: generateMockUsers(2).map((user, index) => ({
        ...user,
        role: ['admin', 'admin'][index] as any,
        permissions: ['read', 'write', 'manage'],
        joinedAt: subDays(new Date(), 1),
        company: 'PropertyChain Support',
      })),
      messages: [],
      createdAt: subDays(new Date(), 1),
      updatedAt: subDays(new Date(), 1),
      roomType: 'support',
      priority: 'medium',
      tags: ['support', 'help'],
      allowedActions: ['request_info'],
      isPrivate: false,
      hasUnread: false,
      unreadCount: 0,
      lastActivity: subDays(new Date(), 1),
    },
  ]

  const allRooms = rooms.length > 0 ? rooms : mockRooms

  // Filter rooms
  const filteredRooms = React.useMemo(() => {
    let filtered = allRooms

    if (filter.type && filter.type !== 'all') {
      filtered = filtered.filter(room => room.roomType === filter.type)
    }
    if (filter.priority && filter.priority !== 'all') {
      filtered = filtered.filter(room => room.priority === filter.priority)
    }
    if (filter.archived !== undefined) {
      filtered = filtered.filter(room => !!room.isArchived === filter.archived)
    }
    if (filter.search) {
      filtered = filtered.filter(room => 
        room.name.toLowerCase().includes(filter.search!.toLowerCase()) ||
        (room.description && room.description.toLowerCase().includes(filter.search!.toLowerCase())) ||
        (room.propertyAddress && room.propertyAddress.toLowerCase().includes(filter.search!.toLowerCase()))
      )
    }

    // Sort by priority and last activity
    filtered.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
      const aPriority = priorityOrder[a.priority]
      const bPriority = priorityOrder[b.priority]
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority
      }
      
      return b.lastActivity.getTime() - a.lastActivity.getTime()
    })

    return filtered
  }, [allRooms, filter])

  const getRoomIcon = (type: PropertyChatRoom['roomType']) => {
    switch (type) {
      case 'property': return <Home className="h-4 w-4 text-blue-500" />
      case 'transaction': return <DollarSign className="h-4 w-4 text-green-500" />
      case 'team': return <Users className="h-4 w-4 text-purple-500" />
      case 'support': return <Shield className="h-4 w-4 text-orange-500" />
      default: return <MessageSquare className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500'
      case 'high': return 'text-orange-500'
      case 'medium': return 'text-yellow-500'
      default: return 'text-green-500'
    }
  }

  const handleRoomSelect = (room: PropertyChatRoom) => {
    setSelectedRoom(room)
    onRoomSelect?.(room)
  }

  return (
    <div className={cn("h-full flex", className)}>
      {/* Room List Sidebar */}
      <div className="w-80 border-r bg-muted/20 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Chat Rooms</h2>
            <Button size="sm" onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Room
            </Button>
          </div>

          {/* Filters */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search rooms..."
                value={filter.search || ''}
                onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                className="pl-9"
              />
            </div>
            
            <div className="flex gap-2">
              <Select
                value={filter.type || 'all'}
                onValueChange={(value) => setFilter(prev => ({ 
                  ...prev, 
                  type: value === 'all' ? undefined : value 
                }))}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="property">Property</SelectItem>
                  <SelectItem value="transaction">Transaction</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filter.priority || 'all'}
                onValueChange={(value) => setFilter(prev => ({ 
                  ...prev, 
                  priority: value === 'all' ? undefined : value 
                }))}
              >
                <SelectTrigger className="flex-1">
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
          </div>
        </div>

        {/* Room List */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {filteredRooms.map(room => (
              <div
                key={room.id}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-colors",
                  selectedRoom?.id === room.id 
                    ? "border-primary bg-primary/10" 
                    : "border-muted hover:border-border hover:bg-muted/50"
                )}
                onClick={() => handleRoomSelect(room)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    {getRoomIcon(room.roomType)}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-1">{room.name}</h3>
                      {room.propertyAddress && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {room.propertyAddress}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {room.hasUnread && room.unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs px-1.5 py-0.5 min-w-[18px] h-5">
                        {room.unreadCount > 99 ? '99+' : room.unreadCount}
                      </Badge>
                    )}
                    <div className={cn("text-xs", getPriorityColor(room.priority))}>
                      ●
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{room.participants.length}</span>
                  </div>
                  <span>{formatDate(room.lastActivity, 'relative')}</span>
                </div>

                {room.tags && room.tags.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {room.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">
                        {tag}
                      </Badge>
                    ))}
                    {room.tags.length > 2 && (
                      <span className="text-xs text-muted-foreground">+{room.tags.length - 2}</span>
                    )}
                  </div>
                )}

                {room.transactionStage && (
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {room.transactionStage.replace('_', ' ')}
                    </Badge>
                  </div>
                )}
              </div>
            ))}

            {filteredRooms.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No rooms found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <PropertyChatInterface 
            room={selectedRoom}
            currentUser={currentUser}
            onInviteUser={onInviteUser}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Select a Room</h3>
              <p className="text-muted-foreground">Choose a chat room to start the conversation</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Room Dialog */}
      <CreateRoomDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreate={onCreateRoom}
        propertyId={propertyId}
        transactionId={transactionId}
      />
    </div>
  )
}

// Property Chat Interface
interface PropertyChatInterfaceProps {
  room: PropertyChatRoom
  currentUser: PropertyChatParticipant
  onInviteUser?: (roomId: string, userId: string) => void
}

function PropertyChatInterface({ room, currentUser, onInviteUser }: PropertyChatInterfaceProps) {
  // Generate mock messages with property-specific content
  const mockMessages: PropertyChatMessage[] = [
    {
      id: 'msg-1',
      content: 'Welcome to the transaction chat for 123 Main Street! I\'ll be your agent throughout this process.',
      type: 'text',
      sender: {
        id: 'user-agent',
        name: 'Sarah Agent',
        avatar: '/avatars/sarah.jpg',
        status: 'online',
        role: 'agent',
        permissions: ['read', 'write', 'manage'],
        joinedAt: new Date(),
        company: 'PropertyChain Realty',
      },
      timestamp: subDays(new Date(), 5),
      actionType: 'info',
      priority: 'medium',
    },
    {
      id: 'msg-2',
      content: 'Great! I\'m very interested in this property. When can we schedule a showing?',
      type: 'text',
      sender: {
        id: 'user-buyer',
        name: 'John Buyer',
        avatar: '/avatars/john.jpg',
        status: 'online',
        role: 'buyer',
        permissions: ['read', 'write'],
        joinedAt: new Date(),
      },
      timestamp: subDays(new Date(), 4),
    },
    {
      id: 'msg-3',
      content: 'I have availability this weekend. Would Saturday at 2 PM work for you?',
      type: 'text',
      sender: {
        id: 'user-agent',
        name: 'Sarah Agent',
        avatar: '/avatars/sarah.jpg',
        status: 'online',
        role: 'agent',
        permissions: ['read', 'write', 'manage'],
        joinedAt: new Date(),
        company: 'PropertyChain Realty',
      },
      timestamp: subDays(new Date(), 4),
      relatedEntity: {
        type: 'showing',
        id: 'showing-1',
        name: 'Property Showing - 123 Main St',
      },
      actionType: 'action_required',
      requiresResponse: true,
      dueDate: addDays(new Date(), 1),
    },
    {
      id: 'msg-4',
      content: 'Perfect! Saturday at 2 PM works great. Should I bring anything specific?',
      type: 'text',
      sender: {
        id: 'user-buyer',
        name: 'John Buyer',
        avatar: '/avatars/john.jpg',
        status: 'online',
        role: 'buyer',
        permissions: ['read', 'write'],
        joinedAt: new Date(),
      },
      timestamp: subDays(new Date(), 4),
    },
    {
      id: 'msg-5',
      content: '📄 I\'ve uploaded the property disclosure documents for your review.',
      type: 'document',
      sender: {
        id: 'user-agent',
        name: 'Sarah Agent',
        avatar: '/avatars/sarah.jpg',
        status: 'online',
        role: 'agent',
        permissions: ['read', 'write', 'manage'],
        joinedAt: new Date(),
        company: 'PropertyChain Realty',
      },
      timestamp: subDays(new Date(), 3),
      relatedEntity: {
        type: 'document',
        id: 'doc-1',
        name: 'Property Disclosure Statement.pdf',
      },
      actionType: 'alert',
      priority: 'high',
    },
    {
      id: 'msg-6',
      content: 'The inspection has been scheduled for next Tuesday at 10 AM. The inspector will send a detailed report within 24 hours.',
      type: 'text',
      sender: {
        id: 'user-inspector',
        name: 'Mike Inspector',
        avatar: '/avatars/mike.jpg',
        status: 'offline',
        role: 'inspector',
        permissions: ['read', 'write'],
        joinedAt: new Date(),
        company: 'ProInspect Services',
      },
      timestamp: subDays(new Date(), 1),
      relatedEntity: {
        type: 'inspection',
        id: 'inspection-1',
        name: 'Property Inspection - 123 Main St',
      },
      actionType: 'milestone',
      priority: 'high',
    },
    {
      id: 'msg-7',
      content: 'Reminder: The mortgage application deadline is in 3 days. Please ensure all required documents are submitted.',
      type: 'system',
      sender: {
        id: 'system',
        name: 'PropertyChain System',
        avatar: '/avatars/system.jpg',
        status: 'online',
        role: 'admin',
        permissions: ['read', 'write'],
        joinedAt: new Date(),
      },
      timestamp: subMinutes(new Date(), 30),
      actionType: 'reminder',
      priority: 'urgent',
      requiresResponse: false,
      dueDate: addDays(new Date(), 3),
    },
  ]

  return (
    <div className="flex-1 flex flex-col">
      {/* Room Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getRoomIcon(room.roomType)}
            <div>
              <h2 className="text-lg font-semibold">{room.name}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {room.propertyAddress && (
                  <>
                    <MapPin className="h-3 w-3" />
                    <span>{room.propertyAddress}</span>
                  </>
                )}
                {room.transactionStage && (
                  <>
                    <Separator orientation="vertical" className="h-3" />
                    <Badge variant="secondary" className="text-xs">
                      {room.transactionStage.replace('_', ' ')}
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {room.priority && (
              <Badge 
                variant={room.priority === 'urgent' ? 'destructive' : 'outline'}
                className={cn("text-xs", getPriorityColor(room.priority))}
              >
                {room.priority}
              </Badge>
            )}
            
            <div className="flex items-center gap-1">
              {room.participants.slice(0, 3).map(user => (
                <Avatar key={user.id} className="h-6 w-6">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-xs">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
              {room.participants.length > 3 && (
                <span className="text-xs text-muted-foreground ml-1">
                  +{room.participants.length - 3}
                </span>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Room Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  Manage Members
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Room Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive Room
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Room Actions */}
        {room.allowedActions && room.allowedActions.length > 0 && (
          <div className="flex gap-2 mt-3">
            {room.allowedActions.map(action => (
              <Button key={action} variant="outline" size="sm">
                {action === 'view_property' && <Home className="mr-2 h-3 w-3" />}
                {action === 'schedule_showing' && <Calendar className="mr-2 h-3 w-3" />}
                {action === 'make_offer' && <DollarSign className="mr-2 h-3 w-3" />}
                {action === 'upload_docs' && <Upload className="mr-2 h-3 w-3" />}
                {action === 'request_info' && <Info className="mr-2 h-3 w-3" />}
                {action.replace('_', ' ')}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          conversations={[{ 
            ...room, 
            messages: mockMessages.map(msg => ({
              ...msg,
              sender: msg.sender as ChatUser,
            })) 
          }]}
          currentUser={currentUser as ChatUser}
          selectedConversationId={room.id}
          onSendMessage={(message) => console.log('Send message:', message)}
          onEditMessage={(messageId, content) => console.log('Edit message:', messageId, content)}
          onDeleteMessage={(messageId) => console.log('Delete message:', messageId)}
          onReactToMessage={(messageId, emoji) => console.log('React to message:', messageId, emoji)}
          className="h-full"
          hideConversationList
        />
      </div>
    </div>
  )
}

// Create Room Dialog
interface CreateRoomDialogProps {
  open: boolean
  onClose: () => void
  onCreate?: (room: Partial<PropertyChatRoom>) => void
  propertyId?: string
  transactionId?: string
}

function CreateRoomDialog({
  open,
  onClose,
  onCreate,
  propertyId,
  transactionId,
}: CreateRoomDialogProps) {
  const [formData, setFormData] = React.useState<Partial<PropertyChatRoom>>({
    roomType: 'property',
    priority: 'medium',
    isPrivate: false,
    propertyId,
    transactionId,
  })

  const handleCreate = () => {
    onCreate?.(formData)
    onClose()
    setFormData({
      roomType: 'property',
      priority: 'medium',
      isPrivate: false,
      propertyId,
      transactionId,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Chat Room</DialogTitle>
          <DialogDescription>
            Set up a new chat room for property discussions or transactions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Room Name</Label>
            <Input
              id="name"
              placeholder="Enter room name"
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe the purpose of this room"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Room Type</Label>
              <Select
                value={formData.roomType}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  roomType: value as PropertyChatRoom['roomType']
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="property">Property</SelectItem>
                  <SelectItem value="transaction">Transaction</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  priority: value as PropertyChatRoom['priority']
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.roomType === 'property' && (
            <div>
              <Label htmlFor="address">Property Address</Label>
              <Input
                id="address"
                placeholder="Enter property address"
                value={formData.propertyAddress || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, propertyAddress: e.target.value }))}
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="private"
              checked={formData.isPrivate || false}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPrivate: checked }))}
            />
            <Label htmlFor="private">Make this room private</Label>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!formData.name}>
            Create Room
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Helper functions
function getRoomIcon(type: PropertyChatRoom['roomType']) {
  switch (type) {
    case 'property': return <Home className="h-4 w-4 text-blue-500" />
    case 'transaction': return <DollarSign className="h-4 w-4 text-green-500" />
    case 'team': return <Users className="h-4 w-4 text-purple-500" />
    case 'support': return <Shield className="h-4 w-4 text-orange-500" />
    default: return <MessageSquare className="h-4 w-4 text-gray-500" />
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'urgent': return 'text-red-500'
    case 'high': return 'text-orange-500'
    case 'medium': return 'text-yellow-500'
    default: return 'text-green-500'
  }
}