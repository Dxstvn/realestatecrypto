/**
 * Collaborative Viewing Component - PropertyChain
 * 
 * Real-time shared property viewing sessions with synchronized navigation
 * Following UpdatedUIPlan.md Step 48 specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Users,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Share2,
  MessageSquare,
  Send,
  MapPin,
  Navigation,
  Eye,
  MousePointer,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Map as MapIcon,
  Image as ImageIcon,
  FileText,
  Info,
  Settings,
  Phone,
  PhoneOff,
  ScreenShare,
  ScreenShareOff,
  Hand,
  ThumbsUp,
  Heart,
  Star,
  Flag,
  Plus,
  Minus,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Copy,
  ExternalLink,
  Clock,
  Calendar,
  User,
  UserPlus,
  UserMinus,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Sparkles,
  Pencil,
  Eraser,
  Circle,
  Square,
  Type,
  Palette,
  Move,
  ArrowUp,
  MessageCircle,
  Volume2,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useToast } from '@/hooks/use-toast'
import { useWebSocket } from '@/providers/websocket-provider'

// Types
interface ViewingSession {
  id: string
  propertyId: string
  propertyTitle: string
  hostId: string
  hostName: string
  participants: SessionParticipant[]
  startTime: Date
  isActive: boolean
  currentView: 'gallery' | '3d' | 'floorplan' | 'map' | 'documents'
  currentImageIndex: number
  annotations: Annotation[]
  isRecording: boolean
  settings: {
    allowAnnotations: boolean
    allowChat: boolean
    allowScreenShare: boolean
    maxParticipants: number
  }
}

interface SessionParticipant {
  id: string
  name: string
  avatar?: string
  role: 'host' | 'co-host' | 'viewer'
  isActive: boolean
  isSpeaking: boolean
  hasVideo: boolean
  hasAudio: boolean
  cursor?: { x: number; y: number }
  color: string
  joinedAt: Date
}

interface Annotation {
  id: string
  type: 'arrow' | 'circle' | 'rectangle' | 'text' | 'freehand'
  authorId: string
  authorName: string
  color: string
  position: { x: number; y: number }
  size?: { width: number; height: number }
  text?: string
  timestamp: Date
}

interface ChatMessage {
  id: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  timestamp: Date
  type: 'message' | 'system' | 'reaction'
  reactions?: { emoji: string; users: string[] }[]
}

interface CollaborativeViewingProps {
  sessionId?: string
  propertyId: string
  onSessionEnd?: () => void
}

export function CollaborativeViewing({
  sessionId,
  propertyId,
  onSessionEnd,
}: CollaborativeViewingProps) {
  const { subscribe, send, isConnected } = useWebSocket()
  const { toast } = useToast()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Mock session data
  const [session, setSession] = useState<ViewingSession>({
    id: sessionId || `session-${Date.now()}`,
    propertyId,
    propertyTitle: 'Downtown Office Complex',
    hostId: 'current-user',
    hostName: 'John Doe',
    participants: [
      {
        id: 'current-user',
        name: 'John Doe (You)',
        role: 'host',
        isActive: true,
        isSpeaking: false,
        hasVideo: true,
        hasAudio: true,
        color: '#007BFF',
        joinedAt: new Date(),
      },
    ],
    startTime: new Date(),
    isActive: true,
    currentView: 'gallery',
    currentImageIndex: 0,
    annotations: [],
    isRecording: false,
    settings: {
      allowAnnotations: true,
      allowChat: true,
      allowScreenShare: true,
      maxParticipants: 10,
    },
  })

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedTool, setSelectedTool] = useState<string>('cursor')
  const [annotationColor, setAnnotationColor] = useState('#007BFF')
  const [showParticipants, setShowParticipants] = useState(true)
  const [showChat, setShowChat] = useState(true)
  const [myVideo, setMyVideo] = useState(true)
  const [myAudio, setMyAudio] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [inviteLink, setInviteLink] = useState('')
  const [propertyImages] = useState([
    '/images/property-1.jpg',
    '/images/property-2.jpg',
    '/images/property-3.jpg',
    '/images/property-4.jpg',
  ])

  // Subscribe to session updates
  useEffect(() => {
    const unsubscribe = subscribe('viewing_session', (data) => {
      if (data.sessionId === session.id) {
        // Handle participant updates
        if (data.type === 'participant_joined') {
          const newParticipant: SessionParticipant = {
            id: data.participant.id,
            name: data.participant.name,
            avatar: data.participant.avatar,
            role: 'viewer',
            isActive: true,
            isSpeaking: false,
            hasVideo: false,
            hasAudio: false,
            color: data.participant.color,
            joinedAt: new Date(),
          }

          setSession(prev => ({
            ...prev,
            participants: [...prev.participants, newParticipant],
          }))

          toast({
            title: 'Participant joined',
            description: `${data.participant.name} joined the viewing session`,
          })
        }

        // Handle view changes
        if (data.type === 'view_changed') {
          setSession(prev => ({
            ...prev,
            currentView: data.view,
            currentImageIndex: data.imageIndex || 0,
          }))
        }

        // Handle annotations
        if (data.type === 'annotation_added') {
          setSession(prev => ({
            ...prev,
            annotations: [...prev.annotations, data.annotation],
          }))
        }

        // Handle cursor movements
        if (data.type === 'cursor_moved') {
          setSession(prev => ({
            ...prev,
            participants: prev.participants.map(p =>
              p.id === data.participantId
                ? { ...p, cursor: data.cursor }
                : p
            ),
          }))
        }
      }
    })

    // Subscribe to chat messages
    const chatUnsubscribe = subscribe('chat_message', (data) => {
      if (data.sessionId === session.id) {
        const message: ChatMessage = {
          id: data.id,
          authorId: data.authorId,
          authorName: data.authorName,
          authorAvatar: data.authorAvatar,
          content: data.content,
          timestamp: new Date(data.timestamp),
          type: 'message',
        }
        setChatMessages(prev => [...prev, message])
      }
    })

    return () => {
      unsubscribe()
      chatUnsubscribe()
    }
  }, [session.id, subscribe, toast])

  // Generate invite link
  useEffect(() => {
    setInviteLink(`${window.location.origin}/viewing/${session.id}`)
  }, [session.id])

  // Send chat message
  const sendChatMessage = () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      authorId: 'current-user',
      authorName: 'You',
      content: newMessage,
      timestamp: new Date(),
      type: 'message',
    }

    setChatMessages(prev => [...prev, message])
    setNewMessage('')

    // Send via WebSocket
    send({
      type: 'chat_message',
      sessionId: session.id,
      content: newMessage,
    })
  }

  // Change view
  const changeView = (view: typeof session.currentView) => {
    setSession(prev => ({ ...prev, currentView: view }))
    
    // Broadcast view change
    send({
      type: 'view_change',
      sessionId: session.id,
      view,
      imageIndex: session.currentImageIndex,
    })
  }

  // Navigate images
  const navigateImage = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next'
      ? (session.currentImageIndex + 1) % propertyImages.length
      : (session.currentImageIndex - 1 + propertyImages.length) % propertyImages.length

    setSession(prev => ({ ...prev, currentImageIndex: newIndex }))

    // Broadcast navigation
    send({
      type: 'view_change',
      sessionId: session.id,
      view: session.currentView,
      imageIndex: newIndex,
    })
  }

  // Add annotation
  const addAnnotation = (type: Annotation['type'], position: { x: number; y: number }) => {
    const annotation: Annotation = {
      id: `ann-${Date.now()}`,
      type,
      authorId: 'current-user',
      authorName: 'You',
      color: annotationColor,
      position,
      timestamp: new Date(),
    }

    setSession(prev => ({
      ...prev,
      annotations: [...prev.annotations, annotation],
    }))

    // Broadcast annotation
    send({
      type: 'annotation_add',
      sessionId: session.id,
      annotation,
    })
  }

  // Toggle screen sharing
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        // Would request screen share permission here
        setIsScreenSharing(true)
        toast({
          title: 'Screen sharing started',
          description: 'Your screen is now visible to participants',
        })
      } catch (error) {
        toast({
          title: 'Screen sharing failed',
          description: 'Could not start screen sharing',
          variant: 'destructive',
        })
      }
    } else {
      setIsScreenSharing(false)
      toast({
        title: 'Screen sharing stopped',
        description: 'Your screen is no longer being shared',
      })
    }
  }

  // End session
  const endSession = () => {
    send({
      type: 'session_end',
      sessionId: session.id,
    })
    
    if (onSessionEnd) {
      onSessionEnd()
    }
  }

  // Copy invite link
  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)
    toast({
      title: 'Link copied',
      description: 'Invite link copied to clipboard',
    })
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold">{session.propertyTitle}</h2>
            <div className="flex items-center gap-2 text-sm text-[#9E9E9E]">
              <Users className="h-3 w-3" />
              <span>{session.participants.length} participants</span>
              <span>•</span>
              <Clock className="h-3 w-3" />
              <span>
                {Math.floor((Date.now() - session.startTime.getTime()) / 60000)} min
              </span>
            </div>
          </div>
          {session.isRecording && (
            <Badge variant="destructive" className="animate-pulse">
              <Circle className="h-2 w-2 mr-1 fill-current" />
              Recording
            </Badge>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#F5F5F5]">
            <TooltipProvider>
              {[
                { value: 'gallery', icon: Grid, label: 'Gallery' },
                { value: '3d', icon: Square, label: '3D Tour' },
                { value: 'floorplan', icon: MapIcon, label: 'Floor Plan' },
                { value: 'map', icon: MapPin, label: 'Map' },
                { value: 'documents', icon: FileText, label: 'Documents' },
              ].map(({ value, icon: Icon, label }) => (
                <Tooltip key={value}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={session.currentView === value ? 'default' : 'ghost'}
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => changeView(value as typeof session.currentView)}
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{label}</TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Media Controls */}
          <Button
            variant={myVideo ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMyVideo(!myVideo)}
          >
            {myVideo ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </Button>
          <Button
            variant={myAudio ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMyAudio(!myAudio)}
          >
            {myAudio ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
          <Button
            variant={isScreenSharing ? 'default' : 'outline'}
            size="sm"
            onClick={toggleScreenShare}
          >
            {isScreenSharing ? <ScreenShare className="h-4 w-4" /> : <ScreenShareOff className="h-4 w-4" />}
          </Button>

          <Separator orientation="vertical" className="h-8" />

          {/* Actions */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInviteDialog(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={endSession}
          >
            <PhoneOff className="h-4 w-4 mr-2" />
            End
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Viewing Area */}
        <div className="flex-1 relative bg-[#F5F5F5]">
          {/* Current View */}
          {session.currentView === 'gallery' && (
            <div className="relative h-full flex items-center justify-center">
              <img
                src={propertyImages[session.currentImageIndex]}
                alt="Property"
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Navigation */}
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2"
                onClick={() => navigateImage('prev')}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2"
                onClick={() => navigateImage('next')}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
                {session.currentImageIndex + 1} / {propertyImages.length}
              </div>
            </div>
          )}

          {session.currentView === 'floorplan' && (
            <div className="h-full flex items-center justify-center p-8">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <p className="text-[#9E9E9E]">Floor plan view would be displayed here</p>
              </div>
            </div>
          )}

          {session.currentView === 'map' && (
            <div className="h-full flex items-center justify-center p-8">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <p className="text-[#9E9E9E]">Interactive map would be displayed here</p>
              </div>
            </div>
          )}

          {/* Annotation Layer */}
          {session.settings.allowAnnotations && (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 pointer-events-none"
              style={{ zIndex: 10 }}
            />
          )}

          {/* Participant Cursors */}
          <AnimatePresence>
            {session.participants.map((participant) => (
              participant.cursor && participant.id !== 'current-user' && (
                <motion.div
                  key={participant.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute pointer-events-none z-20"
                  style={{
                    left: participant.cursor.x,
                    top: participant.cursor.y,
                  }}
                >
                  <MousePointer
                    className="h-5 w-5"
                    style={{ color: participant.color }}
                  />
                  <span
                    className="ml-2 text-xs px-1 py-0.5 rounded"
                    style={{
                      backgroundColor: participant.color,
                      color: 'white',
                    }}
                  >
                    {participant.name}
                  </span>
                </motion.div>
              )
            ))}
          </AnimatePresence>

          {/* Annotation Tools */}
          {session.settings.allowAnnotations && (
            <div className="absolute bottom-4 left-4 flex items-center gap-2 p-2 rounded-lg bg-white shadow-lg">
              {[
                { value: 'cursor', icon: MousePointer },
                { value: 'arrow', icon: ArrowUp },
                { value: 'circle', icon: Circle },
                { value: 'rectangle', icon: Square },
                { value: 'text', icon: Type },
                { value: 'freehand', icon: Pencil },
                { value: 'eraser', icon: Eraser },
              ].map(({ value, icon: Icon }) => (
                <Button
                  key={value}
                  variant={selectedTool === value ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setSelectedTool(value)}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
              <Separator orientation="vertical" className="h-8" />
              <input
                type="color"
                value={annotationColor}
                onChange={(e) => setAnnotationColor(e.target.value)}
                className="h-8 w-8 rounded cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l bg-white flex flex-col">
          <Tabs defaultValue="participants" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="participants">Participants</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>

            {/* Participants Tab */}
            <TabsContent value="participants" className="flex-1 p-4">
              <ScrollArea className="h-full">
                <div className="space-y-2">
                  {session.participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F5F5F5]"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback>{participant.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {participant.name}
                            {participant.role === 'host' && (
                              <Badge variant="outline" className="ml-2 text-xs">Host</Badge>
                            )}
                          </p>
                          <div className="flex items-center gap-2">
                            {participant.hasVideo && (
                              <Video className="h-3 w-3 text-[#4CAF50]" />
                            )}
                            {participant.hasAudio && (
                              <Mic className="h-3 w-3 text-[#4CAF50]" />
                            )}
                            {participant.isSpeaking && (
                              <Volume2 className="h-3 w-3 text-[#007BFF] animate-pulse" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat" className="flex-1 flex flex-col p-4">
              <ScrollArea className="flex-1 mb-4">
                <div className="space-y-2">
                  {chatMessages.map((message) => (
                    <div key={message.id} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={message.authorAvatar} />
                          <AvatarFallback>{message.authorName[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">{message.authorName}</span>
                        <span className="text-xs text-[#9E9E9E]">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm pl-8">{message.content}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                />
                <Button
                  size="icon"
                  onClick={sendChatMessage}
                  className="bg-[#007BFF] hover:bg-[#0062CC]"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Participants</DialogTitle>
            <DialogDescription>
              Share this link to invite others to the viewing session
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input value={inviteLink} readOnly />
              <Button onClick={copyInviteLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            
            <Alert className="border-[#99C2FF] bg-[#E6F2FF]">
              <Info className="h-4 w-4 text-[#007BFF]" />
              <AlertDescription className="text-[#003166]">
                Participants will need to sign in to join the session.
                The session supports up to {session.settings.maxParticipants} participants.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}