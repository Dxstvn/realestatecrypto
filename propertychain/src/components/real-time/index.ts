/**
 * Real-Time Components Export - PropertyChain
 * 
 * Central export file for all real-time features
 * Following UpdatedUIPlan.md Step 48 specifications and CLAUDE.md principles
 */

// Live Auction
export { LiveAuction } from './live-auction'

// Collaborative Viewing
export { CollaborativeViewing } from './collaborative-viewing'

// Market Data Feed
export { MarketDataFeed } from './market-data-feed'

// Real-Time Chat
export { RealTimeChat } from './real-time-chat'

// Re-export WebSocket provider utilities
export {
  useWebSocket,
  useWebSocketSubscription,
  useRealtimeProperty,
  useRealtimeInvestments,
} from '@/providers/websocket-provider'