/**
 * Real-Time Chat Component - PropertyChain
 * 
 * Instant messaging and communication system
 * Following UpdatedUIPlan.md Step 48 specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MessageSquare,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Search,
  Phone,
  Video,
  Info,
  Pin,
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Clock,
  Reply,
  Forward,
  Copy,
  Trash,
  Edit,
  Star,
  Flag,
  Archive,
  Users,
  User,
  UserPlus,
  Settings,
  Circle,
  X,
  ChevronDown,
  Image as ImageIcon,
  File,
  MapPin,
  Calendar,
  DollarSign,
  Building,
  Hash,
  AtSign,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Loader2,
  AlertCircle,
  Shield,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useToast } from '@/hooks/use-toast'
import { useWebSocket } from '@/providers/websocket-provider'

// Types
interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: Date
  status: 'sending' | 'sent' | 'delivered' | 'read'
  type: 'text' | 'image' | 'file' | 'property' | 'system'
  replyTo?: string
  attachments?: Attachment[]
  reactions?: Reaction[]
  isEdited?: boolean
  editedAt?: Date
  metadata?: {
    propertyId?: string
    propertyTitle?: string
    price?: number
    location?: string
  }
}

interface Attachment {
  id: string
  type: 'image' | 'file' | 'document'
  name: string
  url: string
  size: number
  mimeType: string
}

interface Reaction {
  emoji: string
  users: string[]
}

interface Conversation {
  id: string
  type: 'direct' | 'group' | 'channel'
  name: string
  avatar?: string
  participants: ChatParticipant[]
  lastMessage?: ChatMessage
  unreadCount: number
  isPinned: boolean
  isMuted: boolean
  isArchived: boolean
  createdAt: Date
  updatedAt: Date
}

interface ChatParticipant {
  id: string
  name: string
  avatar?: string
  status: 'online' | 'away' | 'busy' | 'offline'
  role?: 'admin' | 'moderator' | 'member'
  lastSeen?: Date
  isTyping?: boolean
}

interface RealTimeChatProps {
  userId: string
  defaultConversationId?: string
  onMessageSent?: (message: ChatMessage) => void
}

export function RealTimeChat({
  userId,
  defaultConversationId,
  onMessageSent,
}: RealTimeChatProps) {
  const { subscribe, send, isConnected } = useWebSocket()
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // State
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      type: 'direct',
      name: 'Alice Chen',
      avatar: '/avatars/alice.jpg',
      participants: [
        { id: 'user-1', name: 'Alice Chen', status: 'online' },
        { id: userId, name: 'You', status: 'online' },
      ],
      lastMessage: {
        id: 'msg-1',
        conversationId: 'conv-1',
        senderId: 'user-1',
        senderName: 'Alice Chen',
        content: 'Are you interested in the downtown property?',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        status: 'read',
        type: 'text',
      },
      unreadCount: 0,
      isPinned: true,
      isMuted: false,
      isArchived: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      updatedAt: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: 'conv-2',
      type: 'group',
      name: 'Investment Group',
      participants: [
        { id: 'user-2', name: 'Bob Smith', status: 'away' },
        { id: 'user-3', name: 'Carol White', status: 'online' },
        { id: userId, name: 'You', status: 'online' },
      ],
      lastMessage: {
        id: 'msg-2',
        conversationId: 'conv-2',
        senderId: 'user-2',
        senderName: 'Bob Smith',
        content: 'The market analysis looks promising',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        status: 'delivered',
        type: 'text',
      },
      unreadCount: 3,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      updatedAt: new Date(Date.now() - 1000 * 60 * 30),
    },
  ])

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    conversations.find(c => c.id === defaultConversationId) || conversations[0]
  )

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null)
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null)
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set())
  const [showInfo, setShowInfo] = useState(false)

  // Common emojis
  const commonEmojis = ['👍', '❤️', '😊', '🎉', '🔥', '👏', '😍', '🤔', '😂', '🙏']

  // Load messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return

    // Mock messages
    const mockMessages: ChatMessage[] = [
      {
        id: 'msg-1',
        conversationId: selectedConversation.id,
        senderId: selectedConversation.participants[0].id,
        senderName: selectedConversation.participants[0].name,
        content: 'Hi! I saw your listing for the downtown office complex.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        status: 'read',
        type: 'text',
      },
      {
        id: 'msg-2',
        conversationId: selectedConversation.id,
        senderId: userId,
        senderName: 'You',
        content: 'Hello! Yes, it\'s a great investment opportunity. Would you like more details?',
        timestamp: new Date(Date.now() - 1000 * 60 * 55),
        status: 'read',
        type: 'text',
      },
      {
        id: 'msg-3',
        conversationId: selectedConversation.id,
        senderId: selectedConversation.participants[0].id,
        senderName: selectedConversation.participants[0].name,
        content: 'Absolutely! Can you share the financial projections?',
        timestamp: new Date(Date.now() - 1000 * 60 * 50),
        status: 'read',
        type: 'text',
      },
    ]

    setMessages(mockMessages)
  }, [selectedConversation, userId])

  // Subscribe to chat updates
  useEffect(() => {
    const unsubscribe = subscribe('chat_update', (data) => {
      // Handle new message
      if (data.type === 'new_message' && data.conversationId === selectedConversation?.id) {
        const newMsg: ChatMessage = {
          id: data.message.id,
          conversationId: data.conversationId,
          senderId: data.message.senderId,
          senderName: data.message.senderName,
          senderAvatar: data.message.senderAvatar,
          content: data.message.content,
          timestamp: new Date(data.message.timestamp),
          status: 'delivered',
          type: data.message.type || 'text',
        }

        setMessages(prev => [...prev, newMsg])
        scrollToBottom()

        // Show notification if not from current user
        if (data.message.senderId !== userId) {
          toast({
            title: data.message.senderName,
            description: data.message.content,
          })
        }
      }

      // Handle typing indicators
      if (data.type === 'typing') {
        if (data.isTyping) {
          setTypingUsers(prev => [...prev, data.userId])
        } else {
          setTypingUsers(prev => prev.filter(id => id !== data.userId))
        }
      }

      // Handle message status updates
      if (data.type === 'status_update') {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === data.messageId
              ? { ...msg, status: data.status }
              : msg
          )
        )
      }
    })

    return unsubscribe
  }, [selectedConversation, userId, subscribe, toast])

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Send message
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: userId,
      senderName: 'You',
      content: newMessage,
      timestamp: new Date(),
      status: 'sending',
      type: 'text',
      replyTo: replyingTo?.id,
    }

    // Add message optimistically
    setMessages(prev => [...prev, message])
    setNewMessage('')
    setReplyingTo(null)

    // Send via WebSocket
    send({
      type: 'send_message',
      conversationId: selectedConversation.id,
      content: newMessage,
      replyTo: replyingTo?.id,
    })

    // Update conversation last message
    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation.id
          ? { ...conv, lastMessage: message, updatedAt: new Date() }
          : conv
      )
    )

    if (onMessageSent) {
      onMessageSent(message)
    }

    // Simulate status update
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === message.id
            ? { ...msg, status: 'sent' }
            : msg
        )
      )
    }, 500)

    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === message.id
            ? { ...msg, status: 'delivered' }
            : msg
        )
      )
    }, 1000)
  }

  // Handle typing
  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true)
      send({
        type: 'typing',
        conversationId: selectedConversation?.id,
        isTyping: true,
      })

      // Stop typing after 3 seconds
      setTimeout(() => {
        setIsTyping(false)
        send({
          type: 'typing',
          conversationId: selectedConversation?.id,
          isTyping: false,
        })
      }, 3000)
    }
  }

  // Add reaction
  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || []
          const existingReaction = reactions.find(r => r.emoji === emoji)
          
          if (existingReaction) {
            if (existingReaction.users.includes(userId)) {
              // Remove reaction
              existingReaction.users = existingReaction.users.filter(id => id !== userId)
              if (existingReaction.users.length === 0) {
                return {
                  ...msg,
                  reactions: reactions.filter(r => r.emoji !== emoji),
                }
              }
            } else {
              // Add user to reaction
              existingReaction.users.push(userId)
            }
          } else {
            // Add new reaction
            reactions.push({ emoji, users: [userId] })
          }
          
          return { ...msg, reactions }
        }
        return msg
      })
    )
  }

  // Format timestamp
  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (days === 1) {
      return 'Yesterday'
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'long' })
    } else {
      return date.toLocaleDateString()
    }
  }

  // Get status icon
  const getStatusIcon = (status: ChatMessage['status']) => {
    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-[#9E9E9E]" />
      case 'sent':
        return <Check className="h-3 w-3 text-[#9E9E9E]" />
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-[#9E9E9E]" />
      case 'read':
        return <CheckCheck className="h-3 w-3 text-[#007BFF]" />
    }
  }

  // Get participant status color
  const getStatusColor = (status: ChatParticipant['status']) => {
    switch (status) {
      case 'online':
        return 'bg-[#4CAF50]'
      case 'away':
        return 'bg-[#FF6347]'
      case 'busy':
        return 'bg-[#DC3545]'
      default:
        return 'bg-[#9E9E9E]'
    }
  }

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden">
      {/* Conversations List */}
      <div className="w-80 border-r bg-[#F5F5F5] flex flex-col">
        {/* Search */}
        <div className="p-4 border-b bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {conversations
              .filter(conv => 
                conv.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={cn(
                    "w-full p-3 rounded-lg mb-2 text-left transition-colors",
                    selectedConversation?.id === conversation.id
                      ? "bg-[#007BFF] text-white"
                      : "hover:bg-white"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.avatar} />
                        <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                      </Avatar>
                      {conversation.type === 'direct' && (
                        <div className={cn(
                          "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                          getStatusColor(conversation.participants[0].status)
                        )} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={cn(
                          "font-medium truncate",
                          selectedConversation?.id === conversation.id && "text-white"
                        )}>
                          {conversation.name}
                          {conversation.isPinned && (
                            <Pin className="inline h-3 w-3 ml-1" />
                          )}
                        </p>
                        {conversation.lastMessage && (
                          <span className={cn(
                            "text-xs",
                            selectedConversation?.id === conversation.id
                              ? "text-white/80"
                              : "text-[#9E9E9E]"
                          )}>
                            {formatTimestamp(conversation.lastMessage.timestamp)}
                          </span>
                        )}
                      </div>
                      {conversation.lastMessage && (
                        <p className={cn(
                          "text-sm truncate mt-1",
                          selectedConversation?.id === conversation.id
                            ? "text-white/80"
                            : "text-[#757575]"
                        )}>
                          {conversation.lastMessage.content}
                        </p>
                      )}
                      {conversation.unreadCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="mt-1 h-5 px-1.5 text-xs"
                        >
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </ScrollArea>

        {/* New Conversation */}
        <div className="p-4 border-t bg-white">
          <Button className="w-full bg-[#007BFF] hover:bg-[#0062CC]">
            <MessageSquare className="h-4 w-4 mr-2" />
            New Conversation
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedConversation.avatar} />
                <AvatarFallback>{selectedConversation.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedConversation.name}</p>
                <p className="text-xs text-[#9E9E9E]">
                  {selectedConversation.type === 'group'
                    ? `${selectedConversation.participants.length} members`
                    : selectedConversation.participants[0].status}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowInfo(!showInfo)}
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => {
                const isOwn = message.senderId === userId
                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      isOwn && "flex-row-reverse"
                    )}
                  >
                    {!isOwn && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.senderAvatar} />
                        <AvatarFallback>{message.senderName[0]}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={cn("max-w-[70%]", isOwn && "items-end")}>
                      {!isOwn && (
                        <p className="text-xs text-[#9E9E9E] mb-1">
                          {message.senderName}
                        </p>
                      )}
                      <div
                        className={cn(
                          "rounded-lg px-3 py-2",
                          isOwn
                            ? "bg-[#007BFF] text-white"
                            : "bg-[#F5F5F5]"
                        )}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[#9E9E9E]">
                          {formatTimestamp(message.timestamp)}
                        </span>
                        {isOwn && getStatusIcon(message.status)}
                      </div>
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {message.reactions.map((reaction) => (
                            <button
                              key={reaction.emoji}
                              onClick={() => addReaction(message.id, reaction.emoji)}
                              className="px-2 py-0.5 rounded-full bg-[#F5F5F5] text-xs flex items-center gap-1 hover:bg-[#E0E0E0]"
                            >
                              <span>{reaction.emoji}</span>
                              <span>{reaction.users.length}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
              
              {/* Typing Indicator */}
              {typingUsers.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-[#9E9E9E]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>
                    {typingUsers.length === 1
                      ? `${selectedConversation.participants.find(p => typingUsers.includes(p.id))?.name} is typing...`
                      : `${typingUsers.length} people are typing...`}
                  </span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Reply Preview */}
          {replyingTo && (
            <div className="px-4 py-2 bg-[#F5F5F5] border-t flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Reply className="h-4 w-4 text-[#757575]" />
                <div>
                  <p className="text-xs text-[#9E9E9E]">Replying to {replyingTo.senderName}</p>
                  <p className="text-sm truncate">{replyingTo.content}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setReplyingTo(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {/* Message Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex items-end gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Textarea
                ref={inputRef}
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value)
                  handleTyping()
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                rows={1}
              />
              <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Smile className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <div className="grid grid-cols-5 gap-2">
                    {commonEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          setNewMessage(prev => prev + emoji)
                          setShowEmojiPicker(false)
                        }}
                        className="text-xl hover:bg-[#F5F5F5] p-1 rounded"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-[#007BFF] hover:bg-[#0062CC]"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 text-[#BDBDBD] mx-auto mb-4" />
            <p className="text-[#9E9E9E]">Select a conversation to start messaging</p>
          </div>
        </div>
      )}
    </div>
  )
}