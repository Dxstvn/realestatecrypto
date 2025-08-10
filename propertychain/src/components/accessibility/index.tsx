/**
 * Accessibility Components Index - PropertyChain
 * 
 * Exports UI components for accessibility features
 * These are separate from the core accessibility utilities in /lib/accessibility
 */

// Property-specific accessibility components
export {
  AccessiblePropertyCard,
  AccessibleInvestmentCalculator,
  AccessiblePropertySearch,
  VoiceNavigation,
  TextToSpeech,
  type PropertyAccessibilityData,
  type AccessiblePropertyCardProps,
} from './property-accessibility'

// Skip links navigation
export {
  SkipLinks,
  useSkipLinks,
} from './skip-links'

// Note: The accessibility-ui components are available but not exported
// due to naming conflicts with lib/accessibility. They can be imported
// directly from './accessibility-ui' when needed.