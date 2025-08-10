/**
 * Chat Interface Components - PropertyChain
 * 
 * Comprehensive chat system with messaging, threading, and real-time communication
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  MessageSquare,
  Send,
  Paperclip,
  Image,
  Smile,
  MoreVertical,
  Reply,
  Forward,
  Copy,
  Edit,
  Trash2,
  Star,
  Pin,
  Search,
  Filter,
  Users,
  UserPlus,
  Settings,
  Phone,
  Video,
  Info,
  Archive,
  VolumeX,
  Volume2,
  Eye,
  EyeOff,
  Download,
  Share,
  Clock,
  CheckCheck,
  Check,
  AlertTriangle,
  X,
  Plus,
  Minus,
  Hash,
  AtSign,
  Calendar,
  MapPin,
  Home,
  Building,
  DollarSign,
  FileText,
  Camera,
  Mic,
  MicOff,
  VideoOff,
  PhoneCall,
  PhoneOff,
  Maximize2,
  Minimize2,
  Zap,
} from 'lucide-react'
import { formatDate, formatTime } from '@/lib/format'
import { addMinutes, subMinutes, subHours, subDays, isToday, isYesterday } from 'date-fns'

// Chat Types
export interface ChatUser {
  id: string
  name: string
  avatar?: string
  email: string
  role?: string
  status: 'online' | 'away' | 'busy' | 'offline'
  lastSeen?: Date
  isTyping?: boolean
}

export interface ChatMessage {
  id: string
  content: string
  type: 'text' | 'image' | 'file' | 'system' | 'property' | 'document' | 'voice' | 'video_call'
  sender: ChatUser
  timestamp: Date
  edited?: boolean
  editedAt?: Date
  replyTo?: string
  reactions?: Array<{
    emoji: string
    users: string[]
    count: number
  }>
  attachments?: ChatAttachment[]
  mentions?: string[]
  isDelivered?: boolean
  isRead?: boolean
  readBy?: Array<{
    userId: string
    timestamp: Date
  }>
  metadata?: Record<string, any>
}

export interface ChatAttachment {
  id: string
  name: string
  type: 'image' | 'document' | 'video' | 'audio' | 'property' | 'other'
  url: string
  size: number
  thumbnail?: string
  metadata?: Record<string, any>
}

export interface ChatThread {
  id: string
  name?: string
  type: 'direct' | 'group' | 'property' | 'transaction' | 'support'
  participants: ChatUser[]
  messages: ChatMessage[]
  lastMessage?: ChatMessage
  unreadCount: number
  isPinned?: boolean
  isMuted?: boolean
  isArchived?: boolean
  createdAt: Date
  updatedAt: Date
  metadata?: Record<string, any>
  propertyId?: string
  transactionId?: string
}

export interface ChatConfig {
  enableNotifications: boolean
  notificationSound: boolean
  showTypingIndicators: boolean
  showReadReceipts: boolean
  enableFileSharing: boolean
  enableVoiceCalls: boolean
  enableVideoCalls: boolean
  messageRetention: number // days
  maxFileSize: number // MB
  allowedFileTypes: string[]
}

// Chat Interface Component
interface ChatInterfaceProps {
  currentUser: ChatUser
  threads: ChatThread[]
  activeThreadId?: string
  config?: Partial<ChatConfig>
  onThreadSelect?: (threadId: string) => void
  onSendMessage?: (threadId: string, content: string, type?: ChatMessage['type'], attachments?: ChatAttachment[]) => void
  onEditMessage?: (messageId: string, content: string) => void
  onDeleteMessage?: (messageId: string) => void
  onReaction?: (messageId: string, emoji: string) => void
  onCreateThread?: (participants: ChatUser[], type: ChatThread['type']) => void
  onTyping?: (threadId: string, isTyping: boolean) => void
  className?: string
}

export function ChatInterface({
  currentUser,
  threads,
  activeThreadId,
  config = {},
  onThreadSelect,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onReaction,
  onCreateThread,
  onTyping,
  className,
}: ChatInterfaceProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [showSidebar, setShowSidebar] = React.useState(true)
  const [selectedMessageId, setSelectedMessageId] = React.useState<string | null>(null)
  const [showThreadInfo, setShowThreadInfo] = React.useState(false)

  const chatConfig: ChatConfig = {
    enableNotifications: true,
    notificationSound: true,
    showTypingIndicators: true,
    showReadReceipts: true,
    enableFileSharing: true,
    enableVoiceCalls: true,
    enableVideoCalls: true,
    messageRetention: 30,
    maxFileSize: 10,
    allowedFileTypes: ['image/*', 'application/pdf', '.doc', '.docx'],
    ...config,
  }

  const activeThread = threads.find(t => t.id === activeThreadId)
  const filteredThreads = React.useMemo(() => {
    if (!searchQuery) return threads

    return threads.filter(thread => 
      thread.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.participants.some(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      thread.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [threads, searchQuery])

  const sortedThreads = React.useMemo(() => {
    return [...filteredThreads].sort((a, b) => {
      // Pinned threads first
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      
      // Then by last message timestamp
      const aTime = a.lastMessage?.timestamp || a.updatedAt
      const bTime = b.lastMessage?.timestamp || b.updatedAt
      return bTime.getTime() - aTime.getTime()
    })
  }, [filteredThreads])

  return (
    <div className={cn("flex h-96 bg-background border rounded-lg overflow-hidden", className)}>
      {/* Chat Sidebar */}
      {showSidebar && (
        <div className="w-80 border-r bg-muted/20">
          <ChatSidebar
            threads={sortedThreads}
            activeThreadId={activeThreadId}
            currentUser={currentUser}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onThreadSelect={onThreadSelect}
            onCreateThread={onCreateThread}
          />
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeThread ? (
          <>
            {/* Chat Header */}
            <ChatHeader
              thread={activeThread}
              currentUser={currentUser}
              config={chatConfig}
              onToggleSidebar={() => setShowSidebar(!showSidebar)}
              onToggleThreadInfo={() => setShowThreadInfo(!showThreadInfo)}
            />

            {/* Messages Area */}
            <div className="flex-1 flex">
              <div className="flex-1 flex flex-col">
                <ChatMessages
                  thread={activeThread}
                  currentUser={currentUser}
                  config={chatConfig}
                  selectedMessageId={selectedMessageId}
                  onMessageSelect={setSelectedMessageId}
                  onEditMessage={onEditMessage}
                  onDeleteMessage={onDeleteMessage}
                  onReaction={onReaction}
                />

                {/* Message Input */}
                <ChatInput
                  thread={activeThread}
                  currentUser={currentUser}
                  config={chatConfig}
                  onSendMessage={onSendMessage}
                  onTyping={onTyping}
                />
              </div>

              {/* Thread Info Panel */}
              {showThreadInfo && (
                <div className="w-80 border-l bg-muted/20">
                  <ChatThreadInfo
                    thread={activeThread}
                    currentUser={currentUser}
                    onClose={() => setShowThreadInfo(false)}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <ChatWelcome
            currentUser={currentUser}
            onCreateThread={onCreateThread}
          />
        )}
      </div>
    </div>
  )
}

// Chat Sidebar Component
interface ChatSidebarProps {
  threads: ChatThread[]
  activeThreadId?: string
  currentUser: ChatUser
  searchQuery: string
  onSearchChange: (query: string) => void
  onThreadSelect?: (threadId: string) => void
  onCreateThread?: (participants: ChatUser[], type: ChatThread['type']) => void
}

function ChatSidebar({
  threads,
  activeThreadId,
  currentUser,
  searchQuery,
  onSearchChange,
  onThreadSelect,
  onCreateThread,
}: ChatSidebarProps) {
  const [showNewChatDialog, setShowNewChatDialog] = React.useState(false)

  const getThreadDisplayName = (thread: ChatThread) => {
    if (thread.name) return thread.name
    
    if (thread.type === 'direct') {
      const otherUser = thread.participants.find(p => p.id !== currentUser.id)
      return otherUser?.name || 'Unknown User'
    }
    
    if (thread.type === 'property' && thread.metadata?.propertyAddress) {
      return thread.metadata.propertyAddress
    }
    
    return thread.participants.map(p => p.name).join(', ')
  }

  const getThreadSubtitle = (thread: ChatThread) => {
    if (thread.type === 'property') return 'Property Discussion'
    if (thread.type === 'transaction') return 'Transaction Chat'
    if (thread.type === 'support') return 'Support Chat'
    
    const participantCount = thread.participants.length
    if (participantCount > 2) return `${participantCount} participants`
    
    return thread.lastMessage?.content || 'No messages yet'
  }

  const formatMessageTime = (date: Date) => {
    if (isToday(date)) return formatTime(date)
    if (isYesterday(date)) return 'Yesterday'
    return formatDate(date)
  }

  const getThreadIcon = (thread: ChatThread) => {
    switch (thread.type) {
      case 'property': return <Home className="h-4 w-4 text-blue-500" />
      case 'transaction': return <DollarSign className="h-4 w-4 text-green-500" />
      case 'support': return <MessageSquare className="h-4 w-4 text-purple-500" />
      case 'group': return <Users className="h-4 w-4 text-orange-500" />
      default: return null
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Messages</h2>
          <Button
            size="sm"
            onClick={() => setShowNewChatDialog(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Thread List */}
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {threads.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No conversations yet</p>
              <Button 
                size="sm" 
                className="mt-2"
                onClick={() => setShowNewChatDialog(true)}
              >
                Start a conversation
              </Button>
            </div>
          ) : (
            threads.map((thread) => (
              <div
                key={thread.id}
                className={cn(
                  "p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent",
                  activeThreadId === thread.id && "bg-accent"
                )}
                onClick={() => onThreadSelect?.(thread.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    {thread.type === 'direct' ? (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={thread.participants.find(p => p.id !== currentUser.id)?.avatar} />
                        <AvatarFallback>
                          {getThreadDisplayName(thread).slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        {getThreadIcon(thread)}
                      </div>
                    )}
                    
                    {thread.participants.find(p => p.id !== currentUser.id)?.status === 'online' && thread.type === 'direct' && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">
                          {getThreadDisplayName(thread)}
                        </span>
                        {thread.isPinned && (
                          <Pin className="h-3 w-3 text-muted-foreground" />
                        )}
                        {thread.isMuted && (
                          <Volume2 className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      {thread.lastMessage && (
                        <span className="text-xs text-muted-foreground">
                          {formatMessageTime(thread.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">
                        {getThreadSubtitle(thread)}
                      </p>
                      {thread.unreadCount > 0 && (
                        <Badge variant="default" className="text-xs h-5 min-w-5 flex items-center justify-center">
                          {thread.unreadCount > 99 ? '99+' : thread.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* New Chat Dialog */}
      <NewChatDialog
        open={showNewChatDialog}
        onClose={() => setShowNewChatDialog(false)}
        onCreateThread={onCreateThread}
        currentUser={currentUser}
      />
    </div>
  )
}

// Chat Header Component
interface ChatHeaderProps {
  thread: ChatThread
  currentUser: ChatUser
  config: ChatConfig
  onToggleSidebar: () => void
  onToggleThreadInfo: () => void
}

function ChatHeader({ 
  thread, 
  currentUser, 
  config, 
  onToggleSidebar, 
  onToggleThreadInfo 
}: ChatHeaderProps) {
  const getDisplayName = () => {
    if (thread.name) return thread.name
    if (thread.type === 'direct') {
      const otherUser = thread.participants.find(p => p.id !== currentUser.id)
      return otherUser?.name || 'Unknown User'
    }
    return thread.participants.map(p => p.name).join(', ')
  }

  const getStatus = () => {
    if (thread.type === 'direct') {
      const otherUser = thread.participants.find(p => p.id !== currentUser.id)
      if (otherUser?.isTyping) return 'typing...'
      if (otherUser?.status === 'online') return 'online'
      if (otherUser?.lastSeen) return `last seen ${formatTime(otherUser.lastSeen)}`
    }
    
    const onlineCount = thread.participants.filter(p => p.status === 'online').length
    return `${thread.participants.length} participants, ${onlineCount} online`
  }

  const typingUsers = thread.participants.filter(p => p.isTyping && p.id !== currentUser.id)

  return (
    <div className="border-b bg-background">
      <div className="flex items-center justify-between p-4">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-3">
            {thread.type === 'direct' ? (
              <Avatar className="h-8 w-8">
                <AvatarImage src={thread.participants.find(p => p.id !== currentUser.id)?.avatar} />
                <AvatarFallback>
                  {getDisplayName().slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                {thread.type === 'property' && <Home className="h-4 w-4 text-blue-500" />}
                {thread.type === 'transaction' && <DollarSign className="h-4 w-4 text-green-500" />}
                {thread.type === 'group' && <Users className="h-4 w-4 text-orange-500" />}
              </div>
            )}
            
            <div>
              <h3 className="font-semibold text-sm">{getDisplayName()}</h3>
              <p className="text-xs text-muted-foreground">
                {typingUsers.length > 0 
                  ? `${typingUsers.map(u => u.name).join(', ')} typing...`
                  : getStatus()
                }
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {config.enableVoiceCalls && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Voice Call</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {config.enableVideoCalls && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Video Call</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleThreadInfo}
          >
            <Info className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Search className="mr-2 h-4 w-4" />
                Search Messages
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pin className="mr-2 h-4 w-4" />
                {thread.isPinned ? 'Unpin' : 'Pin'} Chat
              </DropdownMenuItem>
              <DropdownMenuItem>
                <VolumeX className="mr-2 h-4 w-4" />
                {thread.isMuted ? 'Unmute' : 'Mute'} Notifications
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Archive className="mr-2 h-4 w-4" />
                Archive Chat
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

// Chat Messages Component
interface ChatMessagesProps {
  thread: ChatThread
  currentUser: ChatUser
  config: ChatConfig
  selectedMessageId?: string | null
  onMessageSelect?: (messageId: string | null) => void
  onEditMessage?: (messageId: string, content: string) => void
  onDeleteMessage?: (messageId: string) => void
  onReaction?: (messageId: string, emoji: string) => void
}

function ChatMessages({
  thread,
  currentUser,
  config,
  selectedMessageId,
  onMessageSelect,
  onEditMessage,
  onDeleteMessage,
  onReaction,
}: ChatMessagesProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const [editingMessageId, setEditingMessageId] = React.useState<string | null>(null)

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread.messages])

  const groupedMessages = React.useMemo(() => {
    const groups: Array<{ date: string; messages: ChatMessage[] }> = []
    let currentGroup: { date: string; messages: ChatMessage[] } | null = null

    thread.messages.forEach(message => {
      const dateKey = formatDate(message.timestamp)
      
      if (!currentGroup || currentGroup.date !== dateKey) {
        currentGroup = { date: dateKey, messages: [] }
        groups.push(currentGroup)
      }
      
      currentGroup.messages.push(message)
    })

    return groups
  }, [thread.messages])

  const handleMessageClick = (messageId: string) => {
    onMessageSelect?.(selectedMessageId === messageId ? null : messageId)
  }

  const handleEditSave = (messageId: string, content: string) => {
    onEditMessage?.(messageId, content)
    setEditingMessageId(null)
  }

  return (
    <ScrollArea className="flex-1 px-4">
      <div className="space-y-6 py-4">
        {groupedMessages.map(group => (
          <div key={group.date}>
            {/* Date Separator */}
            <div className="flex items-center gap-4 mb-4">
              <Separator className="flex-1" />
              <Badge variant="outline" className="text-xs">
                {group.date}
              </Badge>
              <Separator className="flex-1" />
            </div>

            {/* Messages */}
            <div className="space-y-3">
              {group.messages.map((message, index) => {
                const isOwn = message.sender.id === currentUser.id
                const showAvatar = index === 0 || group.messages[index - 1].sender.id !== message.sender.id
                const isSelected = selectedMessageId === message.id
                const isEditing = editingMessageId === message.id

                return (
                  <ChatMessageBubble
                    key={message.id}
                    message={message}
                    isOwn={isOwn}
                    showAvatar={showAvatar}
                    isSelected={isSelected}
                    isEditing={isEditing}
                    config={config}
                    onMessageClick={() => handleMessageClick(message.id)}
                    onEditStart={() => setEditingMessageId(message.id)}
                    onEditSave={(content) => handleEditSave(message.id, content)}
                    onEditCancel={() => setEditingMessageId(null)}
                    onDelete={() => onDeleteMessage?.(message.id)}
                    onReaction={(emoji) => onReaction?.(message.id, emoji)}
                  />
                )
              })}
            </div>
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  )
}

// Chat Message Bubble Component
interface ChatMessageBubbleProps {
  message: ChatMessage
  isOwn: boolean
  showAvatar: boolean
  isSelected: boolean
  isEditing: boolean
  config: ChatConfig
  onMessageClick: () => void
  onEditStart: () => void
  onEditSave: (content: string) => void
  onEditCancel: () => void
  onDelete: () => void
  onReaction: (emoji: string) => void
}

function ChatMessageBubble({
  message,
  isOwn,
  showAvatar,
  isSelected,
  isEditing,
  config,
  onMessageClick,
  onEditStart,
  onEditSave,
  onEditCancel,
  onDelete,
  onReaction,
}: ChatMessageBubbleProps) {
  const [editContent, setEditContent] = React.useState(message.content)

  const getMessageStatusIcon = () => {
    if (message.type === 'system') return null
    if (!isOwn) return null
    
    if (message.readBy && message.readBy.length > 1) {
      return <CheckCheck className="h-3 w-3 text-blue-500" />
    }
    if (message.isDelivered) {
      return <CheckCheck className="h-3 w-3 text-muted-foreground" />
    }
    return <Check className="h-3 w-3 text-muted-foreground" />
  }

  const getMessageTypeIcon = () => {
    switch (message.type) {
      case 'image': return <Camera className="h-4 w-4" />
      case 'file': return <FileText className="h-4 w-4" />
      case 'voice': return <Mic className="h-4 w-4" />
      case 'video_call': return <Video className="h-4 w-4" />
      case 'property': return <Home className="h-4 w-4" />
      case 'document': return <FileText className="h-4 w-4" />
      default: return null
    }
  }

  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-2">
        <Badge variant="secondary" className="text-xs">
          {message.content}
        </Badge>
      </div>
    )
  }

  return (
    <div className={cn("flex gap-3 group", isOwn && "flex-row-reverse")}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {showAvatar && !isOwn && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={message.sender.avatar} />
            <AvatarFallback>
              {message.sender.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        {!showAvatar && !isOwn && <div className="w-8" />}
      </div>

      {/* Message Content */}
      <div className={cn("max-w-xs lg:max-w-md space-y-1", isOwn && "items-end")}>
        {/* Sender Name */}
        {showAvatar && !isOwn && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{message.sender.name}</span>
            {message.sender.role && (
              <Badge variant="outline" className="text-xs">
                {message.sender.role}
              </Badge>
            )}
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={cn(
            "relative p-3 rounded-2xl cursor-pointer transition-colors",
            isOwn 
              ? "bg-primary text-primary-foreground ml-auto" 
              : "bg-muted",
            isSelected && "ring-2 ring-primary/50",
            "hover:opacity-90"
          )}
          onClick={onMessageClick}
        >
          {/* Reply Context */}
          {message.replyTo && (
            <div className="mb-2 p-2 border-l-2 border-primary/50 bg-background/50 rounded text-sm">
              <p className="text-muted-foreground">Replying to message...</p>
            </div>
          )}

          {/* Message Content */}
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-0 resize-none"
                autoFocus
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => onEditSave(editContent)}
                >
                  Save
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onEditCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Content */}
              <div className="flex items-start gap-2">
                {getMessageTypeIcon()}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  
                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.attachments.map(attachment => (
                        <div 
                          key={attachment.id}
                          className="flex items-center gap-2 p-2 bg-background/50 rounded border"
                        >
                          <FileText className="h-4 w-4" />
                          <span className="text-sm truncate">{attachment.name}</span>
                          <Button variant="ghost" size="sm">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Reactions */}
              {message.reactions && message.reactions.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {message.reactions.map((reaction, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => onReaction(reaction.emoji)}
                    >
                      {reaction.emoji} {reaction.count}
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Message Actions */}
          {isSelected && !isEditing && (
            <div className={cn(
              "absolute top-0 flex gap-1 p-1 bg-background border rounded-lg shadow-lg",
              isOwn ? "-left-16" : "-right-16"
            )}>
              <Button variant="ghost" size="sm" onClick={() => onReaction('👍')}>
                <Smile className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm">
                <Reply className="h-3 w-3" />
              </Button>
              {isOwn && (
                <>
                  <Button variant="ghost" size="sm" onClick={onEditStart}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onDelete}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Message Info */}
        <div className={cn(
          "flex items-center gap-1 text-xs text-muted-foreground",
          isOwn && "justify-end"
        )}>
          <span>{formatTime(message.timestamp)}</span>
          {message.edited && <span>(edited)</span>}
          {getMessageStatusIcon()}
        </div>
      </div>
    </div>
  )
}

// Chat Input Component
interface ChatInputProps {
  thread: ChatThread
  currentUser: ChatUser
  config: ChatConfig
  onSendMessage?: (threadId: string, content: string, type?: ChatMessage['type'], attachments?: ChatAttachment[]) => void
  onTyping?: (threadId: string, isTyping: boolean) => void
}

function ChatInput({ 
  thread, 
  currentUser, 
  config, 
  onSendMessage, 
  onTyping 
}: ChatInputProps) {
  const [message, setMessage] = React.useState('')
  const [isTyping, setIsTyping] = React.useState(false)
  const [attachments, setAttachments] = React.useState<ChatAttachment[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false)
  
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = React.useRef<NodeJS.Timeout>()

  const handleInputChange = (value: string) => {
    setMessage(value)
    
    // Handle typing indicators
    if (config.showTypingIndicators) {
      if (!isTyping && value.length > 0) {
        setIsTyping(true)
        onTyping?.(thread.id, true)
      }
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      
      // Set new timeout
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false)
        onTyping?.(thread.id, false)
      }, 1000)
    }
  }

  const handleSend = () => {
    if (!message.trim() && attachments.length === 0) return
    
    onSendMessage?.(thread.id, message.trim(), 'text', attachments.length > 0 ? attachments : undefined)
    setMessage('')
    setAttachments([])
    inputRef.current?.focus()
    
    // Clear typing indicator
    if (isTyping) {
      setIsTyping(false)
      onTyping?.(thread.id, false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileUpload = (files: FileList) => {
    // Mock file upload
    Array.from(files).forEach(file => {
      const attachment: ChatAttachment = {
        id: `att-${Date.now()}-${Math.random()}`,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'document',
        url: URL.createObjectURL(file),
        size: file.size,
      }
      setAttachments(prev => [...prev, attachment])
    })
  }

  const removeAttachment = (attachmentId: string) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId))
  }

  const emojis = ['😀', '😂', '❤️', '👍', '👎', '😊', '😢', '😮', '😡', '🎉']

  return (
    <div className="border-t bg-background">
      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="p-3 border-b">
          <div className="flex flex-wrap gap-2">
            {attachments.map(attachment => (
              <div
                key={attachment.id}
                className="flex items-center gap-2 bg-muted px-2 py-1 rounded"
              >
                <FileText className="h-4 w-4" />
                <span className="text-sm truncate max-w-32">{attachment.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(attachment.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4">
        <div className="flex items-end gap-2">
          {/* File Upload */}
          {config.enableFileSharing && (
            <div>
              <input
                type="file"
                multiple
                accept={config.allowedFileTypes.join(',')}
                className="hidden"
                id="file-upload"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              />
              <Label htmlFor="file-upload">
                <Button variant="ghost" size="sm" asChild>
                  <div>
                    <Paperclip className="h-4 w-4" />
                  </div>
                </Button>
              </Label>
            </div>
          )}

          {/* Message Input */}
          <div className="flex-1 relative">
            <Textarea
              ref={inputRef}
              placeholder="Type a message..."
              value={message}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-0 resize-none pr-10"
              rows={1}
            />
            
            {/* Emoji Picker */}
            <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2">
                <div className="grid grid-cols-5 gap-1">
                  {emojis.map(emoji => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        setMessage(prev => prev + emoji)
                        setShowEmojiPicker(false)
                      }}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={!message.trim() && attachments.length === 0}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Chat Thread Info Component
interface ChatThreadInfoProps {
  thread: ChatThread
  currentUser: ChatUser
  onClose: () => void
}

function ChatThreadInfo({ thread, currentUser, onClose }: ChatThreadInfoProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Chat Info</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Participants */}
          <div>
            <h4 className="font-medium mb-3">Participants ({thread.participants.length})</h4>
            <div className="space-y-2">
              {thread.participants.map(participant => (
                <div key={participant.id} className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback>
                        {participant.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background",
                      participant.status === 'online' && "bg-green-500",
                      participant.status === 'away' && "bg-yellow-500",
                      participant.status === 'busy' && "bg-red-500",
                      participant.status === 'offline' && "bg-gray-400"
                    )} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{participant.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {participant.status}
                      {participant.role && ` • ${participant.role}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Thread Details */}
          <div>
            <h4 className="font-medium mb-3">Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="capitalize">{thread.type.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{formatDate(thread.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Messages:</span>
                <span>{thread.messages.length}</span>
              </div>
              {thread.propertyId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property ID:</span>
                  <span className="font-mono">{thread.propertyId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div>
            <h4 className="font-medium mb-3">Actions</h4>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Search className="mr-2 h-4 w-4" />
                Search Messages
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Archive className="mr-2 h-4 w-4" />
                Archive Chat
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Share className="mr-2 h-4 w-4" />
                Export Chat
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

// Chat Welcome Screen
interface ChatWelcomeProps {
  currentUser: ChatUser
  onCreateThread?: (participants: ChatUser[], type: ChatThread['type']) => void
}

function ChatWelcome({ currentUser, onCreateThread }: ChatWelcomeProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Welcome to PropertyChain Chat</h2>
        <p className="text-muted-foreground mb-6">
          Start a conversation with your team, clients, or property contacts. 
          Collaborate on transactions and share important updates in real-time.
        </p>
        <div className="space-y-2">
          <Button className="w-full" onClick={() => console.log('Start new chat')}>
            <Plus className="mr-2 h-4 w-4" />
            Start New Conversation
          </Button>
          <p className="text-xs text-muted-foreground">
            Select a conversation from the sidebar to begin messaging
          </p>
        </div>
      </div>
    </div>
  )
}

// New Chat Dialog Component
interface NewChatDialogProps {
  open: boolean
  onClose: () => void
  onCreateThread?: (participants: ChatUser[], type: ChatThread['type']) => void
  currentUser: ChatUser
}

function NewChatDialog({ open, onClose, onCreateThread, currentUser }: NewChatDialogProps) {
  const [chatType, setChatType] = React.useState<ChatThread['type']>('direct')
  const [selectedUsers, setSelectedUsers] = React.useState<ChatUser[]>([])
  const [searchQuery, setSearchQuery] = React.useState('')

  // Mock users for selection
  const mockUsers: ChatUser[] = [
    {
      id: 'user-1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'Agent',
      status: 'online',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
    {
      id: 'user-2',
      name: 'Mike Chen',
      email: 'mike@example.com',
      role: 'Buyer',
      status: 'away',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    },
    {
      id: 'user-3',
      name: 'Emily Davis',
      email: 'emily@example.com',
      role: 'Seller',
      status: 'online',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    },
  ]

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateChat = () => {
    if (selectedUsers.length > 0) {
      onCreateThread?.(selectedUsers, chatType)
      onClose()
      setSelectedUsers([])
      setSearchQuery('')
    }
  }

  const toggleUserSelection = (user: ChatUser) => {
    setSelectedUsers(prev =>
      prev.find(u => u.id === user.id)
        ? prev.filter(u => u.id !== user.id)
        : [...prev, user]
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start New Conversation</DialogTitle>
          <DialogDescription>
            Choose who you want to chat with
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Chat Type */}
          <div>
            <Label>Conversation Type</Label>
            <Select value={chatType} onValueChange={(value: any) => setChatType(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="direct">Direct Message</SelectItem>
                <SelectItem value="group">Group Chat</SelectItem>
                <SelectItem value="property">Property Discussion</SelectItem>
                <SelectItem value="transaction">Transaction Chat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* User Search */}
          <div>
            <Label>Search Users</Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* User List */}
          <div>
            <Label>Select Participants</Label>
            <ScrollArea className="h-48 mt-1 border rounded-md p-2">
              <div className="space-y-1">
                {filteredUsers.map(user => (
                  <div
                    key={user.id}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded cursor-pointer transition-colors",
                      selectedUsers.find(u => u.id === user.id)
                        ? "bg-primary/10 border border-primary"
                        : "hover:bg-muted"
                    )}
                    onClick={() => toggleUserSelection(user)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        {user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email} • {user.role}
                      </p>
                    </div>
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      user.status === 'online' && "bg-green-500",
                      user.status === 'away' && "bg-yellow-500",
                      user.status === 'busy' && "bg-red-500",
                      user.status === 'offline' && "bg-gray-400"
                    )} />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div>
              <Label>Selected ({selectedUsers.length})</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedUsers.map(user => (
                  <Badge key={user.id} variant="secondary" className="pr-1">
                    {user.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => toggleUserSelection(user)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateChat}
            disabled={selectedUsers.length === 0}
          >
            Create Chat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Utility function to create mock chat data
export function createMockChatData(): {
  currentUser: ChatUser
  threads: ChatThread[]
} {
  const currentUser: ChatUser = {
    id: 'current-user',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Agent',
    status: 'online',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  }

  const otherUsers: ChatUser[] = [
    {
      id: 'user-1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'Buyer',
      status: 'online',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
    {
      id: 'user-2',
      name: 'Mike Chen',
      email: 'mike@example.com',
      role: 'Seller',
      status: 'away',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    },
    {
      id: 'user-3',
      name: 'Emily Davis',
      email: 'emily@example.com',
      role: 'Inspector',
      status: 'online',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    },
  ]

  const threads: ChatThread[] = [
    {
      id: 'thread-1',
      type: 'direct',
      participants: [currentUser, otherUsers[0]],
      messages: [
        {
          id: 'msg-1',
          content: 'Hi! I\'m interested in the property on Oak Street. Can we schedule a viewing?',
          type: 'text',
          sender: otherUsers[0],
          timestamp: subHours(new Date(), 2),
          isDelivered: true,
          isRead: true,
        },
        {
          id: 'msg-2',
          content: 'Absolutely! I have availability tomorrow afternoon or Thursday morning. Which works better for you?',
          type: 'text',
          sender: currentUser,
          timestamp: subHours(new Date(), 1),
          isDelivered: true,
          isRead: false,
        },
        {
          id: 'msg-3',
          content: 'Tomorrow afternoon would be perfect! What time should we meet?',
          type: 'text',
          sender: otherUsers[0],
          timestamp: subMinutes(new Date(), 30),
          isDelivered: true,
          isRead: false,
        },
      ],
      unreadCount: 1,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      createdAt: subDays(new Date(), 3),
      updatedAt: subMinutes(new Date(), 30),
    },
    {
      id: 'thread-2',
      name: 'Downtown Property Team',
      type: 'group',
      participants: [currentUser, ...otherUsers],
      messages: [
        {
          id: 'msg-4',
          content: 'The inspection report is ready for review',
          type: 'document',
          sender: otherUsers[2],
          timestamp: subHours(new Date(), 4),
          attachments: [
            {
              id: 'att-1',
              name: 'Inspection_Report_Downtown.pdf',
              type: 'document',
              url: '/documents/inspection.pdf',
              size: 2048000,
            }
          ],
          isDelivered: true,
          isRead: true,
        },
        {
          id: 'msg-5',
          content: 'Thanks Emily! I\'ll review it and get back to you with any questions.',
          type: 'text',
          sender: currentUser,
          timestamp: subHours(new Date(), 3),
          isDelivered: true,
          isRead: true,
        },
      ],
      unreadCount: 0,
      isPinned: true,
      isMuted: false,
      isArchived: false,
      createdAt: subDays(new Date(), 7),
      updatedAt: subHours(new Date(), 3),
    },
    {
      id: 'thread-3',
      type: 'property',
      participants: [currentUser, otherUsers[1]],
      messages: [
        {
          id: 'msg-6',
          content: 'I\'ve updated the listing price based on the market analysis',
          type: 'property',
          sender: currentUser,
          timestamp: subDays(new Date(), 1),
          metadata: {
            propertyId: 'prop-123',
            previousPrice: 650000,
            newPrice: 625000,
          },
          isDelivered: true,
          isRead: true,
        },
      ],
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      createdAt: subDays(new Date(), 5),
      updatedAt: subDays(new Date(), 1),
      propertyId: 'prop-123',
      metadata: {
        propertyAddress: '123 Oak Street, Portland, OR',
      },
    },
  ]

  // Set last messages
  threads.forEach(thread => {
    if (thread.messages.length > 0) {
      thread.lastMessage = thread.messages[thread.messages.length - 1]
    }
  })

  return { currentUser, threads }
}