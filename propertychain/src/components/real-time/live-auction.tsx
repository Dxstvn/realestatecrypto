/**
 * Live Auction Component - PropertyChain
 * 
 * Real-time property auction with live bidding functionality
 * Following UpdatedUIPlan.md Step 48 specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  Gavel,
  Clock,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Timer,
  DollarSign,
  Plus,
  Minus,
  Trophy,
  Heart,
  Share2,
  Bell,
  BellOff,
  Eye,
  MessageSquare,
  Send,
  Zap,
  Shield,
  Award,
  Target,
  Activity,
  ChevronUp,
  ChevronDown,
  Info,
  Loader2,
  Play,
  Pause,
  RefreshCw,
  Volume2,
  VolumeX,
  User,
  Crown,
  Flame,
  ArrowUp,
  ArrowDown,
  History,
  BarChart3,
  ExternalLink,
  Hash,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useToast } from '@/hooks/use-toast'
import { useWebSocket } from '@/providers/websocket-provider'

// Types
interface Auction {
  id: string
  propertyId: string
  propertyTitle: string
  propertyImage: string
  propertyAddress: string
  startTime: Date
  endTime: Date
  startingPrice: number
  currentBid: number
  minimumIncrement: number
  reservePrice: number
  totalBids: number
  uniqueBidders: number
  status: 'upcoming' | 'live' | 'ended' | 'cancelled'
  winner?: string
  tokenAmount: number
  auctionType: 'english' | 'dutch' | 'sealed'
}

interface Bid {
  id: string
  auctionId: string
  bidder: string
  bidderName: string
  bidderAvatar?: string
  amount: number
  timestamp: Date
  isAutoBid?: boolean
  isWinning?: boolean
}

interface BidHistory {
  bids: Bid[]
  highestBid: Bid | null
  myBids: Bid[]
}

interface AuctionParticipant {
  id: string
  name: string
  avatar?: string
  bidCount: number
  highestBid: number
  isActive: boolean
  isLeading: boolean
}

interface LiveAuctionProps {
  auctionId: string
  onAuctionEnd?: (winner: string, amount: number) => void
}

export function LiveAuction({ auctionId, onAuctionEnd }: LiveAuctionProps) {
  const { subscribe, send, isConnected } = useWebSocket()
  const { toast } = useToast()

  // Mock auction data
  const [auction, setAuction] = useState<Auction>({
    id: auctionId,
    propertyId: 'prop-1',
    propertyTitle: 'Downtown Office Complex',
    propertyImage: '/images/property-1.jpg',
    propertyAddress: '123 Business Ave, New York, NY',
    startTime: new Date(Date.now() - 1000 * 60 * 5), // Started 5 minutes ago
    endTime: new Date(Date.now() + 1000 * 60 * 25), // Ends in 25 minutes
    startingPrice: 1000000,
    currentBid: 1250000,
    minimumIncrement: 10000,
    reservePrice: 1500000,
    totalBids: 42,
    uniqueBidders: 8,
    status: 'live',
    tokenAmount: 1000,
    auctionType: 'english',
  })

  const [bidHistory, setBidHistory] = useState<BidHistory>({
    bids: [],
    highestBid: null,
    myBids: [],
  })

  const [participants, setParticipants] = useState<AuctionParticipant[]>([])
  const [myBidAmount, setMyBidAmount] = useState('')
  const [isPlacingBid, setIsPlacingBid] = useState(false)
  const [autoBidEnabled, setAutoBidEnabled] = useState(false)
  const [autoBidLimit, setAutoBidLimit] = useState('')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [showBidDialog, setShowBidDialog] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [watchersCount, setWatchersCount] = useState(127)

  // Calculate time remaining
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const end = auction.endTime.getTime()
      const remaining = Math.max(0, end - now)
      setTimeRemaining(remaining)

      if (remaining === 0 && auction.status === 'live') {
        setAuction(prev => ({ ...prev, status: 'ended' }))
        if (onAuctionEnd && bidHistory.highestBid) {
          onAuctionEnd(bidHistory.highestBid.bidder, bidHistory.highestBid.amount)
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [auction.endTime, auction.status, bidHistory.highestBid, onAuctionEnd])

  // Subscribe to auction updates
  useEffect(() => {
    const unsubscribe = subscribe('auction_update', (data) => {
      if (data.auctionId === auctionId) {
        setAuction(prev => ({
          ...prev,
          currentBid: data.currentBid,
          totalBids: data.totalBids,
          uniqueBidders: data.uniqueBidders,
        }))

        // Add new bid to history
        if (data.newBid) {
          const newBid: Bid = {
            id: `bid-${Date.now()}`,
            auctionId: auctionId,
            bidder: data.newBid.bidder,
            bidderName: data.newBid.bidderName,
            bidderAvatar: data.newBid.bidderAvatar,
            amount: data.newBid.amount,
            timestamp: new Date(),
            isWinning: true,
          }

          setBidHistory(prev => ({
            ...prev,
            bids: [newBid, ...prev.bids.map(b => ({ ...b, isWinning: false }))],
            highestBid: newBid,
          }))

          // Play sound if enabled
          if (soundEnabled && data.newBid.bidder !== 'current-user') {
            playBidSound()
          }

          // Show notification
          if (notifications && data.newBid.bidder !== 'current-user') {
            toast({
              title: 'New bid placed',
              description: `${data.newBid.bidderName} bid $${data.newBid.amount.toLocaleString()}`,
            })
          }
        }
      }
    })

    return unsubscribe
  }, [auctionId, subscribe, soundEnabled, notifications, toast])

  // Mock initial bid history
  useEffect(() => {
    const mockBids: Bid[] = [
      {
        id: 'bid-1',
        auctionId,
        bidder: 'user-2',
        bidderName: 'Alice Chen',
        bidderAvatar: '/avatars/alice.jpg',
        amount: 1250000,
        timestamp: new Date(Date.now() - 1000 * 60),
        isWinning: true,
      },
      {
        id: 'bid-2',
        auctionId,
        bidder: 'user-3',
        bidderName: 'Bob Smith',
        bidderAvatar: '/avatars/bob.jpg',
        amount: 1240000,
        timestamp: new Date(Date.now() - 1000 * 120),
      },
      {
        id: 'bid-3',
        auctionId,
        bidder: 'current-user',
        bidderName: 'You',
        amount: 1230000,
        timestamp: new Date(Date.now() - 1000 * 180),
      },
    ]

    setBidHistory({
      bids: mockBids,
      highestBid: mockBids[0],
      myBids: mockBids.filter(b => b.bidder === 'current-user'),
    })

    // Mock participants
    setParticipants([
      {
        id: 'user-2',
        name: 'Alice Chen',
        avatar: '/avatars/alice.jpg',
        bidCount: 8,
        highestBid: 1250000,
        isActive: true,
        isLeading: true,
      },
      {
        id: 'user-3',
        name: 'Bob Smith',
        avatar: '/avatars/bob.jpg',
        bidCount: 6,
        highestBid: 1240000,
        isActive: true,
        isLeading: false,
      },
      {
        id: 'current-user',
        name: 'You',
        bidCount: 5,
        highestBid: 1230000,
        isActive: true,
        isLeading: false,
      },
    ])
  }, [auctionId])

  // Place bid
  const placeBid = async () => {
    const amount = parseFloat(myBidAmount)
    
    if (isNaN(amount)) {
      toast({
        title: 'Invalid bid',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      })
      return
    }

    if (amount < auction.currentBid + auction.minimumIncrement) {
      toast({
        title: 'Bid too low',
        description: `Minimum bid is $${(auction.currentBid + auction.minimumIncrement).toLocaleString()}`,
        variant: 'destructive',
      })
      return
    }

    setIsPlacingBid(true)
    try {
      // Send bid via WebSocket
      send({
        type: 'place_bid',
        auctionId,
        amount,
      })

      // Optimistic update
      const newBid: Bid = {
        id: `bid-${Date.now()}`,
        auctionId,
        bidder: 'current-user',
        bidderName: 'You',
        amount,
        timestamp: new Date(),
        isWinning: true,
      }

      setBidHistory(prev => ({
        ...prev,
        bids: [newBid, ...prev.bids.map(b => ({ ...b, isWinning: false }))],
        highestBid: newBid,
        myBids: [newBid, ...prev.myBids],
      }))

      setAuction(prev => ({
        ...prev,
        currentBid: amount,
        totalBids: prev.totalBids + 1,
      }))

      toast({
        title: 'Bid placed successfully',
        description: `Your bid of $${amount.toLocaleString()} has been placed`,
      })

      setShowBidDialog(false)
      setMyBidAmount('')
    } catch (error) {
      toast({
        title: 'Bid failed',
        description: 'Could not place your bid. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsPlacingBid(false)
    }
  }

  // Play bid sound
  const playBidSound = () => {
    // Would play actual sound here
    console.log('Playing bid sound')
  }

  // Format time
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ${hours % 24}h`
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-[#DC3545] animate-pulse'
      case 'upcoming':
        return 'bg-[#FF6347]'
      case 'ended':
        return 'bg-[#9E9E9E]'
      default:
        return 'bg-[#9E9E9E]'
    }
  }

  // Calculate progress to reserve
  const progressToReserve = (auction.currentBid / auction.reservePrice) * 100

  return (
    <div className="space-y-6">
      {/* Auction Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle>{auction.propertyTitle}</CardTitle>
              <CardDescription>{auction.propertyAddress}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={cn('text-white', getStatusColor(auction.status))}>
                {auction.status === 'live' ? 'LIVE' : auction.status.toUpperCase()}
              </Badge>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4 text-[#9E9E9E]" />
                <span className="text-sm text-[#9E9E9E]">{watchersCount}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Image */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-[#F5F5F5]">
              <img
                src={auction.propertyImage}
                alt={auction.propertyTitle}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-white/80 backdrop-blur"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-white/80 backdrop-blur"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Auction Stats */}
            <div className="space-y-4">
              {/* Current Bid */}
              <div className="p-4 rounded-lg bg-[#E6F2FF] border border-[#99C2FF]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#003166]">Current Bid</span>
                  <Badge variant="outline" className="text-xs">
                    {auction.totalBids} bids
                  </Badge>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#007BFF]">
                    ${auction.currentBid.toLocaleString()}
                  </span>
                  <span className="text-sm text-[#757575]">
                    / {auction.tokenAmount} tokens
                  </span>
                </div>
                <div className="mt-2">
                  <Progress value={progressToReserve} className="h-2" />
                  <p className="text-xs text-[#757575] mt-1">
                    {progressToReserve.toFixed(1)}% of reserve price
                  </p>
                </div>
              </div>

              {/* Time Remaining */}
              <div className="p-4 rounded-lg bg-[#FFF3E0] border border-[#FFCC80]">
                <div className="flex items-center gap-2 mb-2">
                  <Timer className="h-4 w-4 text-[#F57C00]" />
                  <span className="text-sm text-[#F57C00] font-medium">Time Remaining</span>
                </div>
                <div className="text-2xl font-bold text-[#E65100]">
                  {formatTime(timeRemaining)}
                </div>
              </div>

              {/* Quick Bid Buttons */}
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-[#007BFF] hover:bg-[#0062CC]"
                  onClick={() => setShowBidDialog(true)}
                  disabled={auction.status !== 'live'}
                >
                  <Gavel className="h-4 w-4 mr-2" />
                  Place Bid
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const quickBid = auction.currentBid + auction.minimumIncrement
                    setMyBidAmount(quickBid.toString())
                    setShowBidDialog(true)
                  }}
                  disabled={auction.status !== 'live'}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  +${auction.minimumIncrement.toLocaleString()}
                </Button>
              </div>

              {/* Auto-Bid Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#757575]" />
                  <span className="text-sm">Auto-Bid</span>
                </div>
                <Button
                  variant={autoBidEnabled ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAutoBidEnabled(!autoBidEnabled)}
                >
                  {autoBidEnabled ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="history">Bid History</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="info">Auction Info</TabsTrigger>
        </TabsList>

        {/* Bid History */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Bids</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {bidHistory.bids.map((bid, index) => (
                    <motion.div
                      key={bid.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg",
                        bid.isWinning && "bg-[#E6F2FF] border border-[#99C2FF]",
                        bid.bidder === 'current-user' && !bid.isWinning && "bg-[#F5F5F5]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={bid.bidderAvatar} />
                          <AvatarFallback>{bid.bidderName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {bid.bidderName}
                            {bid.isWinning && (
                              <Crown className="inline-block h-3 w-3 ml-1 text-[#FFD700]" />
                            )}
                          </p>
                          <p className="text-xs text-[#9E9E9E]">
                            {new Date(bid.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ${bid.amount.toLocaleString()}
                        </p>
                        {bid.isAutoBid && (
                          <Badge variant="outline" className="text-xs">
                            Auto
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Participants */}
        <TabsContent value="participants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Active Bidders</CardTitle>
              <CardDescription>
                {participants.length} participants • {auction.uniqueBidders} unique bidders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback>{participant.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {participant.name}
                          {participant.isLeading && (
                            <Trophy className="inline-block h-3 w-3 ml-1 text-[#FFD700]" />
                          )}
                        </p>
                        <p className="text-sm text-[#9E9E9E]">
                          {participant.bidCount} bids placed
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${participant.highestBid.toLocaleString()}
                      </p>
                      {participant.isActive && (
                        <Badge variant="outline" className="text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Auction Info */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Auction Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#9E9E9E]">Auction Type</Label>
                  <p className="font-medium capitalize">{auction.auctionType}</p>
                </div>
                <div>
                  <Label className="text-[#9E9E9E]">Token Amount</Label>
                  <p className="font-medium">{auction.tokenAmount.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-[#9E9E9E]">Starting Price</Label>
                  <p className="font-medium">${auction.startingPrice.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-[#9E9E9E]">Reserve Price</Label>
                  <p className="font-medium">${auction.reservePrice.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-[#9E9E9E]">Min Increment</Label>
                  <p className="font-medium">${auction.minimumIncrement.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-[#9E9E9E]">Total Bids</Label>
                  <p className="font-medium">{auction.totalBids}</p>
                </div>
              </div>

              <Separator />

              <Alert className="border-[#99C2FF] bg-[#E6F2FF]">
                <Info className="h-4 w-4 text-[#007BFF]" />
                <AlertDescription className="text-[#003166]">
                  The winning bidder will receive {auction.tokenAmount} property tokens
                  representing fractional ownership of {auction.propertyTitle}.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Place Bid Dialog */}
      <Dialog open={showBidDialog} onOpenChange={setShowBidDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Place Your Bid</DialogTitle>
            <DialogDescription>
              Current bid: ${auction.currentBid.toLocaleString()}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="bid-amount">Bid Amount ($)</Label>
              <Input
                id="bid-amount"
                type="number"
                placeholder={`Minimum: ${(auction.currentBid + auction.minimumIncrement).toLocaleString()}`}
                value={myBidAmount}
                onChange={(e) => setMyBidAmount(e.target.value)}
                className="mt-2"
              />
            </div>

            {autoBidEnabled && (
              <div>
                <Label htmlFor="auto-bid-limit">Auto-Bid Limit ($)</Label>
                <Input
                  id="auto-bid-limit"
                  type="number"
                  placeholder="Maximum auto-bid amount"
                  value={autoBidLimit}
                  onChange={(e) => setAutoBidLimit(e.target.value)}
                  className="mt-2"
                />
                <p className="text-xs text-[#9E9E9E] mt-1">
                  We'll automatically bid up to this amount for you
                </p>
              </div>
            )}

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                By placing a bid, you commit to purchasing {auction.tokenAmount} tokens
                if you win this auction.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBidDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#007BFF] hover:bg-[#0062CC]"
              onClick={placeBid}
              disabled={isPlacingBid}
            >
              {isPlacingBid ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Placing...
                </>
              ) : (
                <>
                  <Gavel className="h-4 w-4 mr-2" />
                  Place Bid
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings */}
      <div className="flex items-center justify-end gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSoundEnabled(!soundEnabled)}
        >
          {soundEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setNotifications(!notifications)}
        >
          {notifications ? (
            <Bell className="h-4 w-4" />
          ) : (
            <BellOff className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}