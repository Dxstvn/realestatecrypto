/**
 * Chat Interface Test Page - PropertyChain
 * Tests all chat interface components and features
 */

'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  ChatInterface,
  generateMockConversations,
  generateMockUsers,
  type ChatUser,
  type ChatMessage,
  type ChatConversation,
} from '@/components/custom/chat-interface'
import {
  PropertyChatManager,
  type PropertyChatRoom,
  type PropertyChatParticipant,
  type PropertyChatMessage,
} from '@/components/custom/property-chat'
import {
  MessageSquare,
  Users,
  Send,
  Reply,
  Heart,
  ThumbsUp,
  Smile,
  Edit,
  Trash2,
  Pin,
  Flag,
  Share,
  Download,
  Upload,
  File,
  Image,
  Video,
  Paperclip,
  Phone,
  VideoIcon,
  Calendar,
  Settings,
  Bell,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Home,
  Building,
  DollarSign,
  Shield,
  Info,
  Zap,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  BookOpen,
  Archive,
  Lock,
  Unlock,
  Eye,
  Copy,
  Bookmark,
  Tag,
  MapPin,
  Key,
  Camera,
  Mic,
  Headphones,
  Monitor,
} from 'lucide-react'
import { addDays, subDays, subHours, subMinutes } from 'date-fns'
import { toastSuccess, toastInfo, toastError } from '@/lib/toast'

// Mock data
const mockUsers = generateMockUsers(10)
const mockConversations = generateMockConversations(8, mockUsers)

const currentUser: ChatUser = {
  id: 'current-user',
  name: 'You',
  avatar: '/avatars/current-user.jpg',
  status: 'online',
}

const currentPropertyUser: PropertyChatParticipant = {
  ...currentUser,
  role: 'agent',
  permissions: ['read', 'write', 'invite', 'manage'],
  joinedAt: new Date(),
  company: 'PropertyChain Realty',
  licenseNumber: 'RE123456789',
}

export default function TestChatInterfacePage() {
  const [selectedTab, setSelectedTab] = useState('basic')
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(mockConversations[0]?.id || null)

  const handleSendMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    toastSuccess(`Message sent: "${message.content.substring(0, 30)}..."`)
  }, [])

  const handleEditMessage = useCallback((messageId: string, content: string) => {
    toastSuccess(`Message edited`)
  }, [])

  const handleDeleteMessage = useCallback((messageId: string) => {
    toastSuccess('Message deleted')
  }, [])

  const handleReactToMessage = useCallback((messageId: string, emoji: string) => {
    toastInfo(`Reacted with ${emoji}`)
  }, [])

  const handleRoomSelect = useCallback((room: PropertyChatRoom) => {
    toastInfo(`Selected room: ${room.name}`)
  }, [])

  const handleCreateRoom = useCallback((room: Partial<PropertyChatRoom>) => {
    toastSuccess(`Room created: ${room.name}`)
  }, [])

  const handleInviteUser = useCallback((roomId: string, userId: string) => {
    toastSuccess('User invited to room')
  }, [])

  // Stats calculations
  const totalMessages = mockConversations.reduce((sum, conv) => sum + conv.messages.length, 0)
  const totalUsers = mockUsers.length
  const activeConversations = mockConversations.filter(conv => conv.messages.length > 0).length
  const unreadCount = mockConversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0)

  const generateSampleMessage = () => {
    const sampleMessages = [
      'This is a sample message for testing',
      'Hello! How are you doing today?',
      'Can we schedule a meeting for tomorrow?',
      'Thanks for the update on the project',
      'Looking forward to our next discussion',
    ]
    
    const message = sampleMessages[Math.floor(Math.random() * sampleMessages.length)]
    handleSendMessage({
      content: message,
      type: 'text',
      sender: currentUser,
    })
  }

  const generateSampleReaction = () => {
    const emojis = ['👍', '❤️', '😂', '😮', '😢', '🎉', '🔥', '✅']
    const emoji = emojis[Math.floor(Math.random() * emojis.length)]
    handleReactToMessage('sample-message', emoji)
  }

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Chat Interface Test</h1>
            <p className="text-muted-foreground">
              Testing comprehensive chat system with real-time messaging, threading, and PropertyChain features
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={generateSampleMessage}>
              <Send className="mr-2 h-4 w-4" />
              Send Sample Message
            </Button>
            <Button onClick={generateSampleReaction} variant="outline">
              <Heart className="mr-2 h-4 w-4" />
              Add Sample Reaction
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold text-blue-500">{totalMessages}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold text-green-500">{totalUsers}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Chats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-purple-500" />
              <span className="text-2xl font-bold text-purple-500">{activeConversations}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unread Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-red-500" />
              <span className="text-2xl font-bold text-red-500">{unreadCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Chat</TabsTrigger>
          <TabsTrigger value="threading">Threading</TabsTrigger>
          <TabsTrigger value="property">Property Chat</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
        </TabsList>

        {/* Basic Chat Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Basic Chat Interface</CardTitle>
                  <CardDescription>
                    Standard chat interface with message composition, real-time updates, and user management
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {activeConversations} active chats
                  </Badge>
                  <Badge variant="outline">
                    {totalMessages} messages
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChatInterface
                conversations={mockConversations}
                currentUser={currentUser}
                selectedConversationId={selectedConversationId}
                onConversationSelect={setSelectedConversationId}
                onSendMessage={handleSendMessage}
                onEditMessage={handleEditMessage}
                onDeleteMessage={handleDeleteMessage}
                onReactToMessage={handleReactToMessage}
                className="h-[600px]"
              />
            </CardContent>
          </Card>

          <Alert>
            <MessageSquare className="h-4 w-4" />
            <AlertDescription>
              The basic chat interface supports text messages, emoji reactions, message editing and deletion,
              user status indicators, and typing indicators. Click on different conversations to switch between chats.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Threading Tab */}
        <TabsContent value="threading" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Message Threading</CardTitle>
                <CardDescription>
                  Organize conversations with threaded replies and nested discussions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <MessageSquare className="h-5 w-5 text-blue-500 mt-1" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">Thread Support</div>
                        <div className="text-sm text-muted-foreground">
                          Reply to specific messages to create threaded conversations
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Reply className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">3 replies</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 border rounded-lg ml-6">
                      <Reply className="h-4 w-4 text-green-500 mt-1" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">Nested Replies</div>
                        <div className="text-sm text-muted-foreground">
                          Maintain context with nested conversation threads
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 border rounded-lg ml-12">
                      <Reply className="h-4 w-4 text-purple-500 mt-1" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">Deep Threading</div>
                        <div className="text-sm text-muted-foreground">
                          Support for multiple levels of nested replies
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thread Features</CardTitle>
                <CardDescription>
                  Advanced threading capabilities and management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Pin className="h-5 w-5 text-orange-500" />
                    <div>
                      <div className="font-medium text-sm">Thread Pinning</div>
                      <div className="text-sm text-muted-foreground">
                        Pin important threads for easy access
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Archive className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium text-sm">Thread Archiving</div>
                      <div className="text-sm text-muted-foreground">
                        Archive completed or old conversation threads
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Bell className="h-5 w-5 text-red-500" />
                    <div>
                      <div className="font-medium text-sm">Thread Notifications</div>
                      <div className="text-sm text-muted-foreground">
                        Get notified about replies in threads you follow
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Search className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium text-sm">Thread Search</div>
                      <div className="text-sm text-muted-foreground">
                        Search within specific threads and conversations
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Threading Interface</CardTitle>
            </CardHeader>
            <CardContent>
              <ChatInterface
                conversations={mockConversations}
                currentUser={currentUser}
                selectedConversationId={selectedConversationId}
                onConversationSelect={setSelectedConversationId}
                onSendMessage={handleSendMessage}
                onEditMessage={handleEditMessage}
                onDeleteMessage={handleDeleteMessage}
                onReactToMessage={handleReactToMessage}
                showThreads={true}
                className="h-[500px]"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Property Chat Tab */}
        <TabsContent value="property" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>PropertyChain Chat System</CardTitle>
                  <CardDescription>
                    Real estate specific chat features for properties, transactions, and team collaboration
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    <Home className="mr-1 h-3 w-3" />
                    Property Focused
                  </Badge>
                  <Badge variant="outline">
                    <DollarSign className="mr-1 h-3 w-3" />
                    Transaction Support
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <PropertyChatManager
                propertyId="prop-123"
                transactionId="trans-456"
                currentUser={currentPropertyUser}
                onRoomSelect={handleRoomSelect}
                onCreateRoom={handleCreateRoom}
                onInviteUser={handleInviteUser}
                className="h-[700px]"
              />
            </CardContent>
          </Card>

          <Alert>
            <Home className="h-4 w-4" />
            <AlertDescription>
              PropertyChain chat includes specialized rooms for property discussions, transaction management,
              team collaboration, and support. Each room type has specific features and permissions tailored
              for real estate workflows.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Management Tab */}
        <TabsContent value="management" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Room Types',
                icon: <Home className="h-6 w-6 text-blue-500" />,
                items: [
                  'Property Discussion Rooms',
                  'Transaction Chat Rooms', 
                  'Team Collaboration Rooms',
                  'Support & Help Rooms',
                  'General Chat Rooms',
                ],
              },
              {
                title: 'User Roles',
                icon: <Users className="h-6 w-6 text-green-500" />,
                items: [
                  'Buyer - View and participate',
                  'Seller - Manage property chats',
                  'Agent - Full room management',
                  'Lawyer - Legal document access',
                  'Lender - Financial discussions',
                  'Inspector - Inspection reports',
                  'Admin - System-wide management',
                ],
              },
              {
                title: 'Permissions',
                icon: <Shield className="h-6 w-6 text-purple-500" />,
                items: [
                  'Read - View messages only',
                  'Write - Send messages',
                  'Invite - Add new members',
                  'Manage - Room settings',
                  'Moderate - Content management',
                ],
              },
              {
                title: 'Priority Levels',
                icon: <Flag className="h-6 w-6 text-red-500" />,
                items: [
                  'Low - General discussions',
                  'Medium - Regular business',
                  'High - Important matters',
                  'Urgent - Time-sensitive issues',
                ],
              },
              {
                title: 'Message Types',
                icon: <MessageSquare className="h-6 w-6 text-orange-500" />,
                items: [
                  'Text - Standard messages',
                  'Image - Photo attachments',
                  'File - Document uploads',
                  'Property - Property cards',
                  'Document - Legal papers',
                  'System - Automated updates',
                ],
              },
              {
                title: 'Room Actions',
                icon: <Settings className="h-6 w-6 text-gray-500" />,
                items: [
                  'View Property Details',
                  'Schedule Property Showing',
                  'Make Offer on Property',
                  'Upload Documents',
                  'Request Information',
                ],
              },
            ].map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    {section.icon}
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Core Chat Features</CardTitle>
                <CardDescription>
                  Essential messaging and communication capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Send className="h-4 w-4" />
                    <span>Real-time message delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Edit className="h-4 w-4" />
                    <span>Message editing and deletion</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Heart className="h-4 w-4" />
                    <span>Emoji reactions and responses</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Reply className="h-4 w-4" />
                    <span>Message threading and replies</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="h-4 w-4" />
                    <span>Read receipts and typing indicators</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span>User status and presence</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Media & File Sharing</CardTitle>
                <CardDescription>
                  Rich media and document sharing capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Image className="h-4 w-4" />
                    <span>Image uploads with preview</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <File className="h-4 w-4" />
                    <span>Document and file attachments</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Video className="h-4 w-4" />
                    <span>Video file support</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Paperclip className="h-4 w-4" />
                    <span>Drag and drop file uploads</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Download className="h-4 w-4" />
                    <span>File download and sharing</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Archive className="h-4 w-4" />
                    <span>File organization and storage</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Search & Navigation</CardTitle>
                <CardDescription>
                  Find and organize conversations efficiently
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Search className="h-4 w-4" />
                    <span>Full-text message search</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Filter className="h-4 w-4" />
                    <span>Filter by user, date, type</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="h-4 w-4" />
                    <span>Message and room tagging</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Bookmark className="h-4 w-4" />
                    <span>Bookmark important messages</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Pin className="h-4 w-4" />
                    <span>Pin messages and announcements</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Message history and timeline</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>PropertyChain Specific</CardTitle>
                <CardDescription>
                  Real estate focused features and integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Home className="h-4 w-4" />
                    <span>Property-linked conversations</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4" />
                    <span>Transaction milestone updates</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>Showing and appointment scheduling</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4" />
                    <span>Document sharing and review</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Automated compliance alerts</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>Location and property context</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              The chat interface integrates seamlessly with other PropertyChain components like 
              property listings, document management, calendar scheduling, and transaction workflows 
              to provide a comprehensive real estate communication platform.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Components Tab */}
        <TabsContent value="components" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'ChatInterface',
                description: 'Main chat interface with conversation list and message view',
                features: ['Conversation management', 'Message display', 'User interactions', 'Real-time updates'],
              },
              {
                name: 'ChatSidebar',
                description: 'Conversation list with search and filtering',
                features: ['Conversation filtering', 'Search functionality', 'Unread indicators', 'User status'],
              },
              {
                name: 'ChatHeader',
                description: 'Chat room header with user info and actions',
                features: ['Room information', 'Participant list', 'Room actions', 'Settings menu'],
              },
              {
                name: 'ChatMessages',
                description: 'Message list with threading and reactions',
                features: ['Message threading', 'Emoji reactions', 'File attachments', 'Timestamp display'],
              },
              {
                name: 'ChatInput',
                description: 'Message composition with media upload',
                features: ['Text input', 'File uploads', 'Emoji picker', 'Send options'],
              },
              {
                name: 'MessageComponent',
                description: 'Individual message display with actions',
                features: ['Message content', 'User avatar', 'Action menu', 'Thread replies'],
              },
              {
                name: 'PropertyChatManager',
                description: 'PropertyChain-specific chat room management',
                features: ['Room types', 'User roles', 'Permissions', 'Property context'],
              },
              {
                name: 'PropertyChatInterface',
                description: 'Real estate focused chat interface',
                features: ['Transaction context', 'Property actions', 'Document integration', 'Stage tracking'],
              },
              {
                name: 'CreateRoomDialog',
                description: 'Dialog for creating new chat rooms',
                features: ['Room configuration', 'Privacy settings', 'User invites', 'Property linking'],
              },
            ].map((component, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base">{component.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {component.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {component.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Features Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Chat Interface System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="font-semibold mb-2">Core Components</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Real-time chat interface with message threading</li>
                <li>✅ Conversation management with search and filters</li>
                <li>✅ Message reactions, editing, and deletion</li>
                <li>✅ File and media sharing capabilities</li>
                <li>✅ User status and typing indicators</li>
                <li>✅ Responsive design for all screen sizes</li>
                <li>✅ Emoji picker and rich text formatting</li>
                <li>✅ Message bookmarking and pinning</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">PropertyChain Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Property and transaction-specific chat rooms</li>
                <li>✅ Role-based permissions and access control</li>
                <li>✅ Real estate professional user roles</li>
                <li>✅ Property context and transaction tracking</li>
                <li>✅ Document sharing and review workflows</li>
                <li>✅ Automated milestone and compliance alerts</li>
                <li>✅ Integrated scheduling and appointment booking</li>
                <li>✅ Priority levels and urgency indicators</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Advanced Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Message threading with nested replies</li>
                <li>✅ Full-text search across conversations</li>
                <li>✅ Room archiving and management</li>
                <li>✅ Notification preferences and controls</li>
                <li>✅ Privacy settings and confidentiality</li>
                <li>✅ Integration with PropertyChain ecosystem</li>
                <li>✅ Full TypeScript support with type safety</li>
                <li>✅ Accessibility features and keyboard navigation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}