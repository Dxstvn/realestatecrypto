/**
 * Standardized Card Components Export
 * PropertyLend DeFi Platform
 * 
 * Phase 2.2: Card Component Standardization
 */

// Standardized card system
export { 
  StandardizedCard,
  ImageContainer,
  BadgeContainer, 
  ActionButtons,
  AccessibleProgress,
  CardHeader,
  CardContent,
  CardFooter,
  cardVariants
} from '@/components/ui/card-standardized'

// Property cards
export { 
  PropertyCardV2,
  PropertyCardV2Skeleton,
  type PropertyData
} from './property-card-v2'

// Pool cards  
export {
  PoolCardV2,
  PoolCardV2Skeleton,
  type PoolData
} from './pool-card-v2'

// Legacy exports (for backward compatibility)
export { PropertyCard } from '@/components/custom/property-card'
export { LendingPoolCard } from '@/components/custom/lending-pool-card'