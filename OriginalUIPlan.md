# Ultra-Detailed UI Specification for Real Estate Tokenization Platform - shadcn/ui Implementation Guide

## CRITICAL INSTRUCTIONS FOR CLAUDE CODE

**IMPORTANT**: This document contains EXACT specifications for every UI element. When implementing:
1. Use **shadcn/ui** as the PRIMARY component library
2. Follow every measurement, color, spacing, and animation specification EXACTLY as written
3. Customize shadcn components to match our exact design specifications
4. Never simplify or approximate any values
5. Implement ALL micro-interactions and hover states
6. Ensure pixel-perfect implementation at all breakpoints
7. Include ALL accessibility features mentioned
8. **CRITICAL**: Follow Section 0 foundational principles for EVERY component

---

## 0. FOUNDATIONAL DESIGN PRINCIPLES & POLISH STANDARDS

### 0.1 Core Design Philosophy

**These principles govern EVERY design decision:**

1. **Clarity Over Cleverness**
   - Every element must have an obvious purpose
   - Functionality is never sacrificed for aesthetics
   - If users need to think, redesign it

2. **Consistency Over Creativity**
   - Same action = same appearance everywhere
   - Established patterns > novel solutions
   - Predictability reduces cognitive load

3. **Progressive Disclosure**
   - Start with essentials, reveal complexity on demand
   - Default to collapsed, expand when requested
   - Power features hidden until needed

4. **Respect The Grid**
   - EVERYTHING aligns to 8px grid
   - No arbitrary spacing
   - Optical adjustments documented

5. **Purposeful Motion**
   - Animation only when it adds meaning
   - Duration: 200ms standard, 300ms for larger elements
   - Easing: ease-out for enters, ease-in for exits

6. **Content First, Chrome Second**
   - Interface recedes, content dominates
   - Minimal borders and dividers
   - Let whitespace do the work

7. **Obvious Interactions**
   - Clickable elements LOOK clickable
   - Hover states mandatory
   - Focus states visible

8. **Generous Whitespace**
   - When in doubt, add more space
   - Cramped is worse than scrolling
   - Breathing room creates hierarchy

9. **Performance Is Design**
   - Perceived speed > actual speed
   - Optimistic updates everywhere
   - Loading states for everything

10. **Accessibility Is Not Optional**
    - WCAG AA minimum
    - Keyboard navigation complete
    - Screen reader friendly

### 0.2 Visual Hierarchy System

**Z-Index Layer Management**
```css
/* EXACT z-index values - NEVER use arbitrary numbers */
:root {
  --z-base: 0;           /* Normal document flow */
  --z-dropdown: 50;      /* Dropdowns, tooltips */
  --z-sticky: 100;       /* Sticky headers/elements */
  --z-overlay: 200;      /* Overlays, backdrops */
  --z-modal: 300;        /* Modals, dialogs */
  --z-popover: 400;      /* Popovers, menus */
  --z-toast: 500;        /* Toast notifications */
  --z-tooltip: 600;      /* Tooltips (highest) */
  --z-maximum: 999;      /* Emergency only */
}

/* Usage enforcement: */
.header { z-index: var(--z-sticky); }
.modal-backdrop { z-index: var(--z-overlay); }
.modal { z-index: var(--z-modal); }
.toast { z-index: var(--z-toast); }
```

**Size Hierarchy Ratios**
```css
/* Mathematical relationships for visual harmony */
Title to Subtitle: 1.5x - 2x
Primary to Secondary Button: 1.2x height
Card Title to Body: 1.5x
Icon to Text: 1.25x
Logo to Nav: 2.5x

/* Example: */
H1: 36px → H2: 24px (1.5x)
Body: 16px → Small: 12px (1.33x)
Primary Button: 48px → Secondary: 40px (1.2x)
```

**Visual Weight Rules**
```typescript
// When to use what weight:
BOLD (700): 
  - Primary headings
  - Numerical values
  - CTAs
  
SEMIBOLD (600):
  - Secondary headings
  - Button text
  - Active nav items
  
MEDIUM (500):
  - Emphasized body text
  - Labels
  - Table headers
  
REGULAR (400):
  - Body text
  - Descriptions
  - Placeholders

// NEVER combine bold + color for emphasis
// Choose ONE: weight OR color, not both
```

### 0.3 Information Density Limits

**Maximum Items Per View**
```typescript
// Prevent cognitive overload:
const DENSITY_LIMITS = {
  // Cards/Grid Items
  propertyCards: {
    desktop: 12,  // 3x4 or 4x3 grid
    tablet: 8,    // 2x4 grid
    mobile: 6,    // 1x6 stack
    initial: 9,   // Above fold
  },
  
  // Dashboard Components
  kpiCards: {
    max: 6,
    optimal: 4,
    mobile: 2, // Most important only
  },
  
  // Table Rows
  tableRows: {
    default: 10,
    expanded: 25,
    max: 50,
    mobile: 5, // Convert to cards
  },
  
  // Dropdown Items
  dropdownItems: {
    visible: 7,
    scrollAfter: 8,
    max: 50,
    sections: 5, // Max sections
  },
  
  // Navigation
  navItems: {
    primary: 5,
    withMore: 4, // +More menu
    mobile: 4,   // Bottom tabs
  },
  
  // Form Fields
  formFields: {
    perStep: 6,
    perSection: 4,
    total: 20, // Split into steps
  },
  
  // Chart Data Points
  chartPoints: {
    line: 30,
    bar: 12,
    pie: 6,
  }
};

// Implementation:
if (properties.length > DENSITY_LIMITS.propertyCards.desktop) {
  // Add pagination or "Load More"
}
```

**Progressive Disclosure Patterns**
```typescript
// Start simple, reveal complexity:
const DISCLOSURE_LEVELS = {
  propertyCard: {
    always: ['image', 'title', 'price', 'primaryCTA'],
    hover: ['roi', 'monthlyYield', 'investorCount'],
    click: ['fullDetails', 'documents', 'analysis'],
  },
  
  dashboardWidget: {
    collapsed: ['title', 'mainValue', 'change'],
    expanded: ['chart', 'breakdown', 'history'],
    detailed: ['export', 'customize', 'analyze'],
  },
  
  tableRow: {
    visible: ['name', 'value', 'status', 'action'],
    expandable: ['history', 'details', 'notes'],
  },
  
  form: {
    basic: ['email', 'password'],
    extended: ['profile', 'preferences'],
    advanced: ['api', 'webhooks', 'integrations'],
  }
};
```

### 0.4 Whitespace & Alignment System

**Minimum Spacing Requirements**
```css
/* NEVER go below these values */
:root {
  --min-touch-target: 44px;      /* Mobile buttons/links */
  --min-text-spacing: 4px;       /* Between text elements */
  --min-element-gap: 8px;        /* Between any elements */
  --min-section-gap: 24px;       /* Between sections */
  --min-page-margin: 16px;       /* Edge of screen */
  --min-breathing-room: 16px;    /* Around content */
}

/* Optimal Spacing Matrix */
.related-items { gap: 8px; }      /* Tightly related */
.item-group { gap: 16px; }         /* Logical groups */
.section-gap { gap: 32px; }        /* Different sections */
.major-sections { gap: 64px; }     /* Major divisions */
.page-sections { gap: 80px; }      /* Page-level sections */
```

**Grid Alignment Rules**
```typescript
// Everything snaps to 8px grid:
const GRID_UNIT = 8;

// Helper function for Claude Code:
const snapToGrid = (value: number): number => {
  return Math.round(value / GRID_UNIT) * GRID_UNIT;
};

// Spacing Scale (ALL multiples of 8):
const SPACING = {
  micro: 4,    // 0.5 unit - ONLY for text spacing
  xs: 8,       // 1 unit
  sm: 16,      // 2 units
  md: 24,      // 3 units
  lg: 32,      // 4 units
  xl: 48,      // 6 units
  '2xl': 64,   // 8 units
  '3xl': 80,   // 10 units
  '4xl': 96,   // 12 units
};

// Optical Adjustments (when to break grid):
const OPTICAL_ADJUSTMENTS = {
  iconAlignment: -2,  // Icons appear heavy, shift up slightly
  capitalLetters: -1, // Capitals need less top space
  roundButtons: 2,    // Circles need more padding
};
```

### 0.5 Component State Specifications

**EVERY Interactive Element Must Have:**
```typescript
interface ComponentStates {
  default: StyleSpec;
  hover: StyleSpec;
  active: StyleSpec;
  focus: StyleSpec;
  disabled: StyleSpec;
  loading?: StyleSpec;
  error?: StyleSpec;
  success?: StyleSpec;
}

// Example Implementation:
const buttonStates = {
  default: {
    background: '#007BFF',
    transform: 'translateY(0)',
    shadow: 'sm',
    transition: 'all 200ms ease-out',
  },
  hover: {
    background: '#0062CC',
    transform: 'translateY(-1px)',
    shadow: 'md',
    cursor: 'pointer',
  },
  active: {
    background: '#004A99',
    transform: 'translateY(1px)',
    shadow: 'xs',
  },
  focus: {
    outline: '2px solid #007BFF',
    outlineOffset: '2px',
    background: '#007BFF',
  },
  disabled: {
    background: '#BDBDBD',
    cursor: 'not-allowed',
    opacity: 0.5,
  },
  loading: {
    background: '#007BFF',
    cursor: 'wait',
    position: 'relative',
    // Add spinner
  }
};
```

**State Transition Timing**
```css
/* Consistent timing for all transitions */
:root {
  --transition-instant: 0ms;
  --transition-fast: 150ms;
  --transition-base: 200ms;
  --transition-slow: 300ms;
  --transition-slower: 500ms;
  
  /* Easing functions */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Application: */
.button {
  transition: all var(--transition-base) var(--ease-out);
}
.modal {
  transition: all var(--transition-slow) var(--ease-out);
}
.tooltip {
  transition: all var(--transition-fast) var(--ease-out);
}
```

### 0.6 Empty States Design

**Every Container Must Handle Empty State**
```typescript
interface EmptyStateSpec {
  icon: string;
  title: string;
  description: string;
  action?: CTAButton;
  illustration?: string;
}

const EMPTY_STATES = {
  // Property Grid
  noProperties: {
    icon: 'Building',
    title: 'No Properties Found',
    description: 'Try adjusting your filters or check back later for new investments.',
    action: {
      text: 'Clear Filters',
      action: 'clearAllFilters',
    },
    illustration: '/empty-properties.svg',
  },
  
  // Search Results
  noSearchResults: {
    icon: 'Search',
    title: 'No Results Found',
    description: `We couldn't find anything matching "${query}".`,
    suggestions: ['Check spelling', 'Try different keywords', 'Remove filters'],
    action: {
      text: 'Clear Search',
      action: 'clearSearch',
    },
  },
  
  // Dashboard
  noInvestments: {
    icon: 'TrendingUp',
    title: 'Start Your Investment Journey',
    description: 'Browse our curated properties and make your first investment.',
    action: {
      text: 'Browse Properties',
      href: '/properties',
      variant: 'primary',
    },
    illustration: '/first-investment.svg',
  },
  
  // Transactions
  noTransactions: {
    icon: 'Receipt',
    title: 'No Transactions Yet',
    description: 'Your transaction history will appear here.',
    muted: true,
  },
  
  // Error States
  loadingError: {
    icon: 'AlertCircle',
    title: 'Unable to Load Data',
    description: 'Please check your connection and try again.',
    action: {
      text: 'Retry',
      action: 'retry',
      icon: 'RefreshCw',
    },
  },
};

// Layout for empty states:
const EmptyStateLayout = `
  <div class="flex flex-col items-center justify-center min-h-[400px] p-8">
    <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
      <Icon size={32} class="text-gray-400" />
    </div>
    <h3 class="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p class="text-sm text-gray-500 text-center max-w-sm mb-6">{description}</p>
    {action && <Button>{action.text}</Button>}
  </div>
`;
```

### 0.7 Loading States & Skeleton Screens

**Loading Strategy Hierarchy**
```typescript
const LOADING_STRATEGIES = {
  // 1. Optimistic Updates (Instant feedback)
  optimistic: [
    'likes',
    'favorites',
    'toggles',
    'filters',
    'sorts',
  ],
  
  // 2. Skeleton Screens (Structure preserved)
  skeleton: [
    'propertyCards',
    'dashboardWidgets',
    'tables',
    'lists',
  ],
  
  // 3. Progressive Loading (Critical first)
  progressive: {
    order: [
      'header',
      'primaryCTA',
      'aboveFold',
      'images',
      'secondaryContent',
      'footer',
    ],
  },
  
  // 4. Spinner (Last resort)
  spinner: [
    'submission',
    'processing',
    'calculation',
  ],
};
```

**Skeleton Screen Specifications**
```css
/* Exact skeleton dimensions matching content */
.skeleton-base {
  background: linear-gradient(
    90deg,
    #F5F5F5 0%,
    #EEEEEE 50%,
    #F5F5F5 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 4px;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Specific skeletons: */
.skeleton-text { height: 16px; width: 80%; }
.skeleton-title { height: 24px; width: 60%; }
.skeleton-button { height: 48px; width: 120px; }
.skeleton-image { height: 240px; width: 100%; }
.skeleton-avatar { height: 40px; width: 40px; border-radius: 50%; }
.skeleton-card { height: 400px; width: 100%; }
```

**Loading State Messages**
```typescript
const LOADING_MESSAGES = {
  // Rotate through these to maintain engagement
  default: [
    'Loading...',
    'Getting things ready...',
    'Almost there...',
    'One moment...',
  ],
  
  // Context-specific messages
  blockchain: [
    'Confirming on blockchain...',
    'Waiting for network confirmation...',
    'Processing transaction...',
    'Securing your investment...',
  ],
  
  calculation: [
    'Calculating returns...',
    'Analyzing market data...',
    'Computing optimal strategy...',
  ],
  
  upload: [
    'Uploading documents...',
    'Verifying files...',
    'Processing upload...',
  ],
};
```

### 0.8 Visual Polish Specifications

**Depth & Elevation System**
```css
/* Layered shadow system for realistic depth */
.elevation-0 { box-shadow: none; }
.elevation-1 { 
  box-shadow: 
    0 1px 3px rgba(0,0,0,0.12),
    0 1px 2px rgba(0,0,0,0.24);
}
.elevation-2 {
  box-shadow: 
    0 3px 6px rgba(0,0,0,0.15),
    0 2px 4px rgba(0,0,0,0.12);
}
.elevation-3 {
  box-shadow: 
    0 10px 20px rgba(0,0,0,0.15),
    0 3px 6px rgba(0,0,0,0.10);
}
.elevation-4 {
  box-shadow: 
    0 15px 25px rgba(0,0,0,0.15),
    0 5px 10px rgba(0,0,0,0.05);
}
.elevation-5 {
  box-shadow: 
    0 20px 40px rgba(0,0,0,0.20),
    0 8px 16px rgba(0,0,0,0.08);
}

/* Hover lifts: */
.hover-lift {
  transition: all 200ms ease-out;
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 20px rgba(0,0,0,0.13),
    0 4px 8px rgba(0,0,0,0.07);
}
```

**Input Field Polish**
```css
/* Subtle inner shadows for depth */
input, textarea, select {
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
  transition: all 200ms ease-out;
}

input:focus, textarea:focus, select:focus {
  box-shadow: 
    inset 0 1px 2px rgba(0,0,0,0.05),
    0 0 0 3px rgba(0,123,255,0.1);
  border-color: #007BFF;
}
```

**Glass Morphism (Use Sparingly)**
```css
/* For overlays and special elements only */
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### 0.9 Content & Typography Rules

**Text Hierarchy Rules**
```typescript
const TEXT_HIERARCHY = {
  // Only ONE H1 per page
  h1: {
    usage: 'Page title only',
    count: 1,
    size: '36px',
    weight: 700,
  },
  
  // Section headers
  h2: {
    usage: 'Major sections',
    maxCount: 6,
    size: '30px',
    weight: 700,
  },
  
  // Subsections
  h3: {
    usage: 'Card titles, subsections',
    size: '24px',
    weight: 600,
  },
  
  // Never skip levels (h1 → h3 is wrong)
  nesting: 'sequential',
  
  // Line length
  optimalLineLength: '65ch',
  maxLineLength: '80ch',
  minLineLength: '45ch',
};
```

**Content Width Constraints**
```css
/* Prevent content from becoming too wide */
.text-content { max-width: 65ch; }
.form-single { max-width: 480px; }
.form-double { max-width: 960px; }
.card { max-width: 400px; }
.modal-sm { max-width: 480px; }
.modal-md { max-width: 640px; }
.modal-lg { max-width: 800px; }
.container { max-width: 1440px; }
```

### 0.10 Quality Checklist for Every Component

```typescript
// MANDATORY checklist before any component is complete:
interface ComponentQualityChecklist {
  // Visual Polish
  alignsToGrid: boolean;           // 8px grid alignment
  hasAllStates: boolean;           // default, hover, active, focus, disabled
  smoothTransitions: boolean;      // 200ms ease-out
  consistentRadius: boolean;       // Uses border-radius scale
  properShadows: boolean;          // Uses elevation system
  
  // Interaction
  touchTarget44px: boolean;        // Minimum 44px on mobile
  keyboardNavigable: boolean;      // Tab, Enter, Escape work
  hasLoadingState: boolean;        // Shows feedback during async
  hasEmptyState: boolean;          // Handles no data gracefully
  hasErrorState: boolean;          // Shows errors clearly
  
  // Accessibility
  contrastPassing: boolean;        // WCAG AA minimum
  hasAriaLabels: boolean;          // Screen reader friendly
  focusVisible: boolean;           // Clear focus indicator
  
  // Performance
  lazyLoaded: boolean;             // Images use lazy loading
  optimisticUpdates: boolean;      // Instant feedback
  memoized: boolean;               // Prevents unnecessary renders
  
  // Responsive
  mobileOptimized: boolean;        // Works on 320px width
  tabletOptimized: boolean;        // Works on 768px width
  desktopOptimized: boolean;       // Works on 1440px width
}

// Implementation enforcement:
const validateComponent = (component: Component): boolean => {
  const checklist = component.qualityChecklist;
  return Object.values(checklist).every(check => check === true);
};
```

### 0.11 Responsive Behavior Specifications

**Breakpoint Transition Rules**
```typescript
const BREAKPOINT_BEHAVIOR = {
  // How layout changes at each breakpoint
  mobile: {
    range: '320px - 767px',
    columns: 1,
    navigation: 'bottom-tabs',
    sidebar: 'drawer',
    cards: 'stacked',
    tables: 'cards',
    fontSize: 'base', // Don't reduce
    touchTargets: '44px minimum',
    hover: 'disabled', // No hover on touch
  },
  
  tablet: {
    range: '768px - 1023px',
    columns: 2,
    navigation: 'hamburger',
    sidebar: 'overlay',
    cards: 'grid-2',
    tables: 'scrollable',
    fontSize: 'base',
    touchTargets: '44px minimum',
    hover: 'enabled',
  },
  
  desktop: {
    range: '1024px - 1439px',
    columns: 3,
    navigation: 'horizontal',
    sidebar: 'fixed',
    cards: 'grid-3',
    tables: 'full',
    fontSize: 'base',
    touchTargets: '32px minimum',
    hover: 'enabled',
  },
  
  wide: {
    range: '1440px+',
    columns: 4,
    navigation: 'horizontal',
    sidebar: 'fixed',
    cards: 'grid-4',
    tables: 'full',
    fontSize: 'base',
    touchTargets: '32px minimum',
    hover: 'enabled',
  },
};
```

### 0.12 Error Prevention & Recovery

**Input Validation Timing**
```typescript
const VALIDATION_TIMING = {
  // When to show validation messages
  onBlur: ['email', 'phone', 'url'],        // After leaving field
  onChange: ['password', 'passwordConfirm'], // While typing
  onSubmit: ['optional fields'],             // Only on submit
  debounced: ['search', 'username'],         // After 500ms pause
  
  // Error message positioning
  position: 'below-input',
  offset: '4px',
  animation: 'slideDown 200ms',
};
```

**Destructive Action Safeguards**
```typescript
const DESTRUCTIVE_ACTIONS = {
  // Actions requiring confirmation
  needsConfirmation: [
    'delete',
    'cancel investment',
    'logout with unsaved',
    'clear all data',
  ],
  
  // Confirmation UI pattern
  pattern: {
    step1: 'Click delete button',
    step2: 'Show confirmation modal',
    step3: 'Require typed confirmation for critical',
    step4: 'Show 5-second undo toast',
  },
  
  // Undo period
  undoDuration: 5000, // 5 seconds
};
```

### 0.13 Performance Perception Optimizations

**Optimistic UI Updates**
```typescript
const OPTIMISTIC_ACTIONS = {
  // Update UI immediately, sync in background
  immediate: [
    'like',
    'favorite',
    'toggle',
    'sort',
    'filter',
    'tab switch',
  ],
  
  // Pattern implementation
  implementation: `
    1. User clicks like
    2. UI updates instantly
    3. API call in background
    4. If fails, revert with error message
    5. Show toast: "Action failed. Please try again."
  `,
};
```

**Perceived Performance Tricks**
```typescript
const PERFORMANCE_TRICKS = {
  skeletonScreens: {
    showAfter: 100, // Don't flash for quick loads
    matchExactLayout: true,
    animateShimmer: true,
  },
  
  imageLoading: {
    sequence: 'blur → low-res → high-res',
    blurRadius: 20,
    transitionDuration: 200,
  },
  
  progressiveBehavior: {
    loadCriticalFirst: true,
    deferBelowFold: true,
    lazyLoadImages: true,
    virtualizeListsOver: 50,
  },
};
```

---

## 10. ADMIN DASHBOARD SPECIFICATIONS (BUSINESS OWNER VIEW)

### 1.1 Color System - EXACT HEX VALUES

**Primary Blue Palette** (Trust & Security)
- `#E6F2FF` - Lightest blue for subtle backgrounds, hover states on white buttons
- `#CCE0FF` - Light blue for secondary backgrounds, disabled states
- `#99C2FF` - Medium-light blue for borders on focus states
- `#66A3FF` - Medium blue for secondary CTAs, link hover states
- `#3385FF` - Bright blue for active states, progress bars
- `#007BFF` - PRIMARY ACTION COLOR - All main CTAs, primary buttons, links
- `#0062CC` - Darker blue for button hover states
- `#004A99` - Deep blue for pressed/active button states
- `#003166` - Navy for headers, important text
- `#001933` - Darkest navy for high-emphasis text

**Success Green Palette** (Positive Metrics)
- `#E8F5E9` - Lightest green for positive background highlights
- `#C8E6C9` - Light green for success message backgrounds
- `#A5D6A7` - Medium-light for positive trend backgrounds
- `#81C784` - Medium green for success borders
- `#66BB6A` - Bright green for positive change indicators
- `#4CAF50` - SUCCESS PRIMARY - Completed transactions, positive changes
- `#43A047` - Darker green for success button hover
- `#388E3C` - Deep green for success button pressed
- `#2E7D32` - Investment growth metrics, high-positive values
- `#1B5E20` - Darkest green for maximum positive emphasis

**Error Red Palette** (Alerts & Warnings)
- `#FFEBEE` - Lightest red for error backgrounds
- `#FFCDD2` - Light red for error message containers
- `#EF9A9A` - Medium-light for error borders
- `#E57373` - Medium red for error text
- `#EF5350` - Bright red for error icons
- `#DC3545` - ERROR PRIMARY - Main error states, critical alerts
- `#C62828` - Dark red for error emphasis
- `#B71C1C` - Darkest red for critical errors

**Warning Orange Palette**
- `#FFF3E0` - Lightest orange for warning backgrounds
- `#FFE0B2` - Light orange for caution areas
- `#FFCC80` - Medium-light for warning borders
- `#FFB74D` - Medium orange for warning icons
- `#FFA726` - Bright orange for attention-needed states
- `#FF6347` - WARNING PRIMARY - Non-critical warnings, attention states

**Neutral Gray Palette**
- `#FAFAFA` - Off-white background for main app
- `#F5F5F5` - Light gray for card backgrounds
- `#EEEEEE` - Border gray lightest
- `#E0E0E0` - Divider lines
- `#BDBDBD` - Disabled text, placeholder text
- `#9E9E9E` - Secondary text
- `#757575` - Icon default color
- `#616161` - Body text secondary
- `#424242` - Body text primary
- `#212121` - Heading text

### 1.2 Typography System - EXACT SPECIFICATIONS

**Font Family Stack**
- Primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- Monospace: 'JetBrains Mono', 'SF Mono', 'Monaco', monospace
- Load Inter weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)

**Type Scale with Line Heights**
- Display Large: 60px / 72px line-height / -0.04em letter-spacing
- Display: 48px / 56px line-height / -0.03em letter-spacing
- H1: 36px / 44px line-height / -0.03em letter-spacing / 700 weight
- H2: 30px / 38px line-height / -0.02em letter-spacing / 700 weight
- H3: 24px / 32px line-height / -0.02em letter-spacing / 600 weight
- H4: 20px / 30px line-height / -0.01em letter-spacing / 600 weight
- H5: 18px / 28px line-height / 0 letter-spacing / 600 weight
- H6: 16px / 24px line-height / 0 letter-spacing / 600 weight
- Body Large: 18px / 28px line-height / 0 letter-spacing / 400 weight
- Body: 16px / 24px line-height / 0 letter-spacing / 400 weight
- Body Small: 14px / 20px line-height / 0.01em letter-spacing / 400 weight
- Caption: 12px / 16px line-height / 0.02em letter-spacing / 400 weight
- Overline: 11px / 16px line-height / 0.08em letter-spacing / 600 weight / UPPERCASE

**Financial Data Typography**
- Large Value: 32px / 40px line-height / -0.02em / 700 weight / tabular-nums
- Medium Value: 24px / 32px line-height / -0.01em / 600 weight / tabular-nums
- Small Value: 18px / 24px line-height / 0 / 600 weight / tabular-nums
- Table Data: 14px / 20px line-height / 0 / 500 weight / tabular-nums
- Micro Value: 12px / 16px line-height / 0 / 600 weight / tabular-nums

### 1.3 Spacing System - 8px Base Unit

**Spacing Scale**
- 0.5 = 4px (micro spacing within components)
- 1 = 8px (tight spacing between related elements)
- 1.5 = 12px (compact spacing)
- 2 = 16px (default spacing between elements)
- 2.5 = 20px (comfortable spacing)
- 3 = 24px (section spacing within cards)
- 4 = 32px (spacing between cards)
- 5 = 40px (major section spacing)
- 6 = 48px (large section breaks)
- 8 = 64px (page section spacing)
- 10 = 80px (major page sections)
- 12 = 96px (hero section padding)

### 1.4 Responsive Breakpoints

- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px - 1439px
- Wide: 1440px+
- Maximum content width: 1440px
- Side margins: 24px (mobile), 32px (tablet), 48px (desktop), auto-centered (wide)

### 1.5 Border Radius System

- None: 0px (tables, full-width elements)
- Subtle: 4px (small buttons, badges, chips)
- Default: 8px (cards, inputs, dropdowns)
- Medium: 12px (modals, larger cards)
- Large: 16px (feature cards, hero sections)
- Extra Large: 20px (special CTAs)
- Pill: 9999px (pills, tags, rounded buttons)

### 1.6 Shadow System

- xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05) - Subtle elevation
- sm: 0 2px 4px -1px rgba(0, 0, 0, 0.06) - Cards rest state
- DEFAULT: 0 4px 6px -2px rgba(0, 0, 0, 0.05) - Standard elevation
- md: 0 6px 10px -3px rgba(0, 0, 0, 0.04) - Hover on cards
- lg: 0 10px 15px -3px rgba(0, 0, 0, 0.04) - Dropdowns, popovers
- xl: 0 20px 25px -5px rgba(0, 0, 0, 0.04) - Modals
- 2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.08) - Large modals
- inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06) - Pressed states

### 1.7 CSS Variables for shadcn/ui Integration

```css
/* These exact values override shadcn defaults */
@layer base {
  :root {
    --background: 0 0% 100%;          /* #FFFFFF */
    --foreground: 0 0% 13%;           /* #212121 */
    
    --primary: 211 100% 50%;          /* #007BFF */
    --primary-foreground: 0 0% 100%;  /* #FFFFFF */
    
    --secondary: 211 100% 95%;        /* #E6F2FF */
    --secondary-foreground: 211 100% 20%; /* #003166 */
    
    --muted: 0 0% 96%;                /* #F5F5F5 */
    --muted-foreground: 0 0% 45%;     /* #757575 */
    
    --accent: 211 100% 95%;           /* #E6F2FF */
    --accent-foreground: 211 100% 30%; /* #004A99 */
    
    --destructive: 354 70% 54%;       /* #DC3545 */
    --destructive-foreground: 0 0% 100%;
    
    --success: 123 38% 57%;           /* #4CAF50 */
    --success-foreground: 0 0% 100%;
    
    --warning: 9 100% 64%;            /* #FF6347 */
    --warning-foreground: 0 0% 100%;
    
    --border: 0 0% 88%;               /* #E0E0E0 */
    --input: 0 0% 88%;                /* #E0E0E0 */
    --ring: 211 100% 50%;             /* #007BFF */
    
    --radius: 0.5rem;                 /* 8px */
  }
}
```

---

## 2. NAVIGATION HEADER SPECIFICATIONS

### 2.1 Desktop Navigation Bar (≥1024px)

**Container Specifications**
- Position: Fixed top
- Height: EXACTLY 72px
- Background: #FFFFFF
- Border-bottom: 1px solid #E0E0E0
- Z-index: 1000
- Box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.06)
- Max-width container: 1440px centered
- Side padding: 48px

**Logo Section (Left)**
- Logo container: 40px × 40px
- Logo background: Linear gradient 135deg from #007BFF to #004A99
- Logo border-radius: 8px
- Logo icon: 24px × 24px white SVG, centered
- Logo text: "PropertyChain" - 18px Inter Bold #212121
- Logo tagline: "Tokenized Real Estate" - 12px Inter Regular #9E9E9E
- Logo hover: Box-shadow transitions from sm to md over 200ms ease
- Gap between logo icon and text: 12px

**Center Navigation Links**
- Uses shadcn NavigationMenu component
- Font: 15px Inter Medium
- Color: #616161 default, #007BFF hover
- Padding: 16px horizontal, 8px vertical
- Hover transition: color 200ms ease
- Active link: #007BFF color with 2px bottom border
- Gap between links: 8px

**Dropdown Menus**
- Uses shadcn NavigationMenuContent
- Trigger: Chevron-down icon 16px, rotates 180deg on hover
- Menu appears: 8px below trigger
- Menu width: 280px
- Menu background: #FFFFFF
- Menu border: 1px solid #E0E0E0
- Menu border-radius: 8px
- Menu shadow: xl (0 20px 25px -5px rgba(0, 0, 0, 0.04))
- Menu padding: 8px
- Menu animation: Fade in + slide down 10px over 200ms ease-out

**Right Section Elements**
- Notification bell: 20px icon, #757575 default, #424242 hover
- Notification badge: 8px × 8px circle, #DC3545 background, absolute position top-4px right-4px
- Button spacing: 12px gap between all buttons
- Uses shadcn Button components with custom variants

### 2.2 Mobile Navigation (<1024px)

**Mobile Header Bar**
- Height: 60px
- Position: Fixed top
- Background: #FFFFFF
- Border-bottom: 1px solid #E0E0E0
- Padding: 0 16px
- Z-index: 1000

**Mobile Menu Drawer**
- Uses shadcn Sheet component
- Position: fixed right
- Width: 280px
- Top: 60px (below header)
- Height: calc(100vh - 60px)
- Background: #FFFFFF
- Shadow: 2xl
- Animation: Slide from right 300ms ease-out
- Overlay: rgba(0, 0, 0, 0.5) backdrop

---

## 3. HERO SECTION SPECIFICATIONS

### 3.1 Hero Container

**Dimensions & Layout**
- Min-height: 700px mobile, 800px desktop
- Background: Linear gradient 135deg from #E6F2FF via #FFFFFF to #E6F2FF
- Padding-top: 120px mobile, 160px desktop (accounts for fixed header)
- Padding-bottom: 80px
- Max-width content: 1440px

**Background Pattern**
- Grid pattern: 40px × 40px squares
- Stroke: #003366 at 5% opacity
- Stroke-width: 1px
- Position: Absolute, full coverage

**Floating Elements**
- Uses Framer Motion for animations
- Element 1: 80px × 80px, #007BFF at 20% opacity, blur 24px
  - Position: top 10%, right 15%
  - Animation: Float up/down 20px + rotate ±5deg over 6s infinite
- Element 2: 120px × 120px circle, #4CAF50 at 20% opacity, blur 24px
  - Position: bottom 20%, left 10%
  - Animation: Float up/down 20px + rotate ±5deg over 8s infinite

### 3.2 Hero Content

**Main Headline**
- Font: 48px mobile / 60px desktop Inter Bold
- Line-height: 1.1
- Color: #001933 main text
- Color: #007BFF for emphasis text
- Letter-spacing: -0.03em
- Uses React Wrap Balancer for optimal line breaks

**CTA Buttons**
- Uses shadcn Button components
- Primary CTA:
  - Height: 56px
  - Padding: 24px horizontal
  - Background: #007BFF
  - Text: 16px Inter Semibold white
  - Border-radius: 8px
  - Shadow: lg default, xl on hover
  - Hover: Background #0062CC, translateY(-2px)
  - Arrow icon: 20px, margin-left 8px

**Featured Property Card**
- Uses shadcn Card component as base
- Custom styling for gradient overlays
- Framer Motion for entrance animations
- React CountUp for animated numbers

---

## 4. PROPERTY CARD COMPONENT SPECIFICATIONS

### 4.1 Card Container

**Base Structure**
- Uses shadcn Card, CardHeader, CardContent, CardFooter
- Width: 100% of grid column
- Min-height: 480px
- Background: #FFFFFF
- Border-radius: 12px
- Shadow: lg default, xl on hover
- Transition: all 300ms ease
- Hover: translateY(-4px) with Framer Motion
- Featured card: Additional 2px border #007BFF

### 4.2 Card Badges

**Using shadcn Badge component**
- Featured badge:
  - Variant: custom "featured"
  - Position: absolute top 16px, left 16px
  - Background: Linear gradient from #007BFF to #0062CC
  - Text: 11px Inter Bold white uppercase
  
### 4.3 Card Content Elements

**Progress Bar**
- Uses shadcn Progress component
- Height: 8px
- Background: #F5F5F5
- Fill: Linear gradient from #007BFF to #0062CC
- Animation: Width 0 to target over 1s ease-out with Framer Motion

**Action Buttons**
- Uses shadcn Button components
- Primary: variant="default" with custom width
- Secondary: variant="outline" size="icon"

---

## 5. DASHBOARD SPECIFICATIONS

### 5.1 Dashboard Layout

**Using shadcn + Resizable Panels**
- Sidebar: 240px fixed width on desktop
- Uses shadcn Sheet for mobile drawer
- Main content: calc(100% - 240px)
- Resizable panels for customizable layout

### 5.2 KPI Cards

**Using shadcn Card + Tremor for mini charts**
```typescript
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
    <DollarSign className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">$125,430</div>
    <p className="text-xs text-muted-foreground">+12.5% from last month</p>
    <SparkAreaChart data={data} className="h-[40px]" />
  </CardContent>
</Card>
```

### 5.3 Data Tables

**Using shadcn DataTable with TanStack Table**
- Column sorting
- Row selection
- Pagination
- Filtering
- Custom cell renderers
- Responsive design with card view on mobile

---

## 6. FORM COMPONENTS SPECIFICATIONS

### 6.1 All Form Elements

**Using shadcn Form components with React Hook Form + Zod**
```typescript
// Input
<FormField
  control={form.control}
  name="amount"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Investment Amount</FormLabel>
      <FormControl>
        <Input 
          placeholder="Enter amount" 
          type="number"
          className="h-12" // Our 48px height
          {...field} 
        />
      </FormControl>
      <FormDescription>Minimum investment: $50</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

**Custom Input Heights**
- Default: h-12 (48px)
- Small: h-10 (40px)
- Large: h-14 (56px)

---

## 7. MODAL & OVERLAY SPECIFICATIONS

### 7.1 Modal Components

**Using shadcn Dialog**
```typescript
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Modal</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[480px]">
    <DialogHeader>
      <DialogTitle>Modal Title</DialogTitle>
      <DialogDescription>Modal description</DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### 7.2 Toast Notifications

**Using shadcn Sonner integration**
```typescript
// In layout
<Toaster 
  position="top-right"
  toastOptions={{
    style: {
      background: '#FFFFFF',
      border: '1px solid #E0E0E0',
    },
  }}
/>

// Usage
toast.success("Investment successful!", {
  description: "You invested $5,000 in Marina District",
})
```

---

## 8. ADDITIONAL COMPONENT SPECIFICATIONS (shadcn enhanced)

### 8.1 Sidebar Navigation

**Using shadcn NavigationMenu + Sheet for mobile**
- Desktop: Fixed 240px sidebar
- Mobile: Sheet component with left-side drawer
- Collapsible with button
- Active states with data attributes

### 8.2 Date Range Picker

**Using shadcn Calendar + Popover**
```typescript
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" className="w-[280px]">
      <CalendarIcon className="mr-2 h-4 w-4" />
      {date ? format(date, "PPP") : "Pick a date"}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0">
    <Calendar
      mode="range"
      selected={date}
      onSelect={setDate}
    />
  </PopoverContent>
</Popover>
```

### 8.3 Command Palette Search

**Using shadcn Command (cmdk)**
```typescript
<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandInput placeholder="Search properties..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Properties">
      {properties.map((property) => (
        <CommandItem key={property.id}>
          {property.name}
        </CommandItem>
      ))}
    </CommandGroup>
  </CommandList>
</CommandDialog>
```

### 8.4 Tabs Component

**Using shadcn Tabs**
```typescript
<Tabs defaultValue="overview" className="w-full">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="details">Details</TabsTrigger>
    <TabsTrigger value="documents">Documents</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    {/* Content */}
  </TabsContent>
</Tabs>
```

### 8.5 Accordion Component

**Using shadcn Accordion**
```typescript
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section Title</AccordionTrigger>
    <AccordionContent>
      Section content here
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

---

## 9. PAGE LAYOUTS & INFORMATION ARCHITECTURE

### 9.1 Complete Site Structure

```
ROOT STRUCTURE:
/
├── PUBLIC PAGES
│   ├── / (Homepage)
│   │   ├── Header (shadcn NavigationMenu)
│   │   ├── Hero Section (Custom with Framer Motion)
│   │   ├── Featured Properties (3x shadcn Cards)
│   │   ├── How It Works (Custom with animations)
│   │   ├── Benefits Grid (shadcn Cards grid)
│   │   ├── Market Statistics (Tremor charts)
│   │   ├── Testimonials (Embla Carousel)
│   │   ├── Newsletter CTA (shadcn Form)
│   │   └── Footer
│   │
│   ├── /properties (Property Listing)
│   │   ├── Search Bar (shadcn Command)
│   │   ├── Filter Sidebar (shadcn Form elements)
│   │   ├── Results Count & Sort (shadcn Select)
│   │   ├── Property Cards Grid (shadcn Cards)
│   │   ├── Map View (React Map GL)
│   │   └── Pagination (shadcn Pagination)
│   │
│   ├── /properties/[id] (Property Detail)
│   │   ├── Image Gallery (Swiper + shadcn Dialog)
│   │   ├── Property Info (shadcn Tabs)
│   │   ├── Investment Calculator (shadcn Form)
│   │   ├── Documents (shadcn Table)
│   │   └── Sticky Investment Widget (shadcn Card)
│   │
├── DASHBOARD PAGES (Protected - Investors)
│   ├── /dashboard (Overview)
│   │   ├── Sidebar (shadcn NavigationMenu)
│   │   ├── KPI Cards (shadcn Cards + Tremor)
│   │   ├── Charts (Tremor in shadcn Cards)
│   │   └── Transactions (shadcn DataTable)
│   │
└── ADMIN DASHBOARD (Platform Owner Only)
    ├── /admin (Overview)
    │   ├── Business KPIs Strip
    │   ├── Revenue Analytics
    │   ├── User Growth Metrics
    │   ├── Property Performance Grid
    │   └── Live Activity Feed
    │
    ├── /admin/properties
    │   ├── Property Management Table
    │   ├── Approval Queue
    │   ├── Add/Edit Property
    │   ├── Bulk Actions
    │   └── Property Analytics
    │
    ├── /admin/users
    │   ├── User Management Table
    │   ├── KYC Verification Center
    │   ├── User Communications
    │   ├── Segmentation Tools
    │   └── User Analytics
    │
    ├── /admin/finances
    │   ├── Revenue Dashboard
    │   ├── Transaction Monitor
    │   ├── Payout Management
    │   ├── Fee Configuration
    │   └── Financial Reports
    │
    ├── /admin/blockchain
    │   ├── Smart Contract Monitor
    │   ├── Transaction Analytics
    │   ├── Wallet Management
    │   ├── Gas Analytics
    │   └── Emergency Controls
    │
    ├── /admin/marketing
    │   ├── Campaign Manager
    │   ├── Analytics Dashboard
    │   ├── SEO Tools
    │   ├── Content Manager
    │   └── Referral Program
    │
    ├── /admin/support
    │   ├── Ticket Queue
    │   ├── Response Center
    │   ├── FAQ Manager
    │   ├── System Health
    │   └── Audit Logs
    │
    └── /admin/settings
        ├── Platform Configuration
        ├── Fee Structure
        ├── Team Management
        ├── API Configuration
        └── Security Settings
```

### 9.2 Component Hierarchy

**Desktop Layout (1440px container)**
```
┌─────────────────────────────────────────────┐
│ Header (72px) - Fixed                       │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────┬──────────────────────────┐    │
│  │ Sidebar │  Main Content Area       │    │
│  │ (240px) │  (Flexible)              │    │
│  │         │                          │    │
│  │ Nav     │  ┌────────────────────┐  │    │
│  │ Items   │  │ Page Content       │  │    │
│  │         │  │                    │  │    │
│  │         │  │ - Cards            │  │    │
│  │         │  │ - Tables           │  │    │
│  │         │  │ - Charts           │  │    │
│  │         │  │                    │  │    │
│  └─────────┴──┴────────────────────┴──┘    │
│                                             │
├─────────────────────────────────────────────┤
│ Footer (400px)                              │
└─────────────────────────────────────────────┘
```

**Mobile Layout (100% width)**
```
┌─────────────────────┐
│ Header (60px)       │
│ ☰ Logo              │
├─────────────────────┤
│                     │
│ Main Content        │
│ (Stacked)           │
│                     │
│ ┌─────────────────┐ │
│ │ Component 1     │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ Component 2     │ │
│ └─────────────────┘ │
│                     │
├─────────────────────┤
│ Bottom Nav (64px)   │
│ [📊][💼][💸][⋯]     │
└─────────────────────┘
```

**Desktop Admin Layout (1440px container)**
```
┌─────────────────────────────────────────────────────────────┐
│ Admin Header (60px) - Dark theme                           │
│ [Logo] Overview | Properties | Users | Finance | More  [👤] │
├─────────────────────────────────────────────────────────────┤
│ Business KPIs Strip (100px) - Live metrics                 │
│ TVL: $127M | Revenue: $482k | Users: 15k | Properties: 156 │
├──────────────┬──────────────────────────────────┬──────────┤
│              │                                  │          │
│   Sidebar    │     Main Analytics Area         │   Live   │
│   (200px)    │        (Flexible)               │   Feed   │
│              │                                  │  (320px) │
│  Quick       │  ┌──────────────────────────┐   │          │
│  Actions     │  │ Revenue Chart            │   │ • New    │
│              │  │ Multi-line, toggleable   │   │   invest │
│  Reports     │  └──────────────────────────┘   │          │
│              │                                  │ • User   │
│  Alerts      │  ┌──────────────────────────┐   │   signup │
│              │  │ User Growth Funnel       │   │          │
│  Settings    │  │ Conversion metrics       │   │ • Failed │
│              │  └──────────────────────────┘   │   trans  │
│              │                                  │          │
└──────────────┴──────────────────────────────────┴──────────┘
```

**Mobile Admin Layout (Responsive)**
```
┌─────────────────────┐
│ Admin Header (60px) │
│ ☰  Admin Panel   👤 │
├─────────────────────┤
│ KPI Cards (Scroll)  │
│ ┌─────┐ ┌─────┐    │
│ │ TVL │ │Rev. │ >> │
│ └─────┘ └─────┘    │
├─────────────────────┤
│ Quick Actions       │
│ ┌─────────────────┐ │
│ │ Approve KYC     │ │
│ │ View Alerts     │ │
│ │ Check Tickets   │ │
│ └─────────────────┘ │
├─────────────────────┤
│ Priority Alerts     │
│ • Critical: Payment │
│ • High: KYC pending │
│ • Medium: Support   │
└─────────────────────┘
```

---

### 10.1 Admin Dashboard Overview

**Purpose:** Complete business management and monitoring system for platform owners/administrators to track business performance, manage properties, monitor users, and control platform operations.

**Access Level:** Super Admin, Admin, Support Staff (role-based permissions)

### 10.2 Business Metrics Dashboard (Main Overview)

**Layout:** Full-width dashboard with priority metrics at top
**Update Frequency:** Real-time with WebSocket connections

**Top KPI Strip (Always Visible)**
- Height: 100px
- Background: Linear gradient from #003166 to #001933
- 6 columns on desktop, horizontal scroll on mobile
- White text with live updates (green/red indicators)

**Primary Business KPIs:**
```
┌──────────────────────────────────────────────────────────────┐
│ TVL (Total Value Locked)     │ Platform Revenue (Month)      │
│ $127,438,291                 │ $482,739                      │
│ ↑ 12.3% from last month      │ ↑ 23.7% from last month      │
├──────────────────────────────┼───────────────────────────────┤
│ Active Investors              │ Properties Listed             │
│ 15,234                       │ 156 (12 pending)              │
│ ↑ 427 this week              │ 89% funded average            │
├──────────────────────────────┼───────────────────────────────┤
│ Transaction Volume (24h)      │ Avg Investment Size           │
│ $3,827,493                   │ $8,450                        │
│ 453 transactions             │ ↑ $750 from last month        │
└──────────────────────────────────────────────────────────────┘
```

**Live Activity Feed (Right Sidebar)**
- Width: 320px
- Real-time updates with animation
- Color-coded by type:
  - Green: New investments
  - Blue: New user signups
  - Orange: KYC submissions
  - Red: Failed transactions
  - Purple: Large transactions (>$10k)

**Revenue Analytics Section**
- Daily/Weekly/Monthly/Yearly toggle
- Multi-line chart showing:
  - Platform fees (primary line)
  - Transaction fees (secondary)
  - Premium subscriptions (if applicable)
  - Other revenue streams
- Export to CSV/PDF functionality

**User Growth Metrics**
- User acquisition funnel:
  - Visitors → Signups (conversion %)
  - Signups → KYC Complete (conversion %)
  - KYC Complete → First Investment (conversion %)
  - First Investment → Repeat Investor (retention %)
- Cohort analysis table
- Geographic heat map of users

**Property Performance Grid**
- 4-column grid of top performing properties
- Each card shows:
  - Property image thumbnail
  - Funding progress bar
  - Total invested amount
  - Number of investors
  - ROI/yield percentage
  - Quick actions (Feature/Edit/Pause)

### 10.3 Property Management System

**Property List Table**
- Columns:
  - Property ID
  - Name/Address
  - Status (Draft/Pending/Active/Paused/Completed)
  - Funding Progress (bar + percentage)
  - Investors Count
  - Total Raised
  - Target Amount
  - ROI/Yield
  - Created Date
  - Actions (Edit/View/Pause/Delete)

**Bulk Actions Bar**
- Select all/none
- Bulk approve
- Bulk feature
- Bulk export
- Bulk status change

**Property Approval Queue**
- Card-based layout for reviewing
- Each card (800px width) contains:
  - Full property details
  - Document checklist
  - Automated verification status
  - Manual review checkboxes
  - Approve/Reject/Request Info buttons
  - Internal notes section
  - Audit trail of actions

**Add/Edit Property Form**
- Multi-step wizard:
  1. Basic Information
  2. Financial Details
  3. Images/Gallery (drag-drop upload)
  4. Documents (legal, inspection, etc.)
  5. Tokenization Settings
  6. Review & Publish

**Property Analytics Dashboard**
- Individual property deep-dive
- Investment velocity chart
- Investor demographics
- Secondary market activity
- Rental payment tracking
- Maintenance/issue tracking

### 10.4 User Management Interface

**User Table View**
- Advanced filtering:
  - Status (Active/Suspended/Banned)
  - Verification level
  - Investment range
  - Geographic location
  - Account age
  - Activity level
- Columns:
  - User ID
  - Name
  - Email
  - Phone
  - KYC Status
  - Investment Total
  - Properties Owned
  - Last Active
  - Account Created
  - Actions

**KYC Verification Center**
- Queue-based interface
- Document viewer with zoom
- Side-by-side comparison
- Automated checks display:
  - ✓ Document authentic
  - ✓ Face match
  - ✓ Address verified
  - ✓ Sanctions check
- Manual override options
- Reject with reasons dropdown
- Request additional docs

**User Detail Modal**
- Complete profile view
- Investment history timeline
- Transaction log
- Communication history
- Support tickets
- Administrative actions log
- Ban/Suspend/Warn buttons
- Send message functionality

**Bulk Communication Tools**
- Segment builder (create user groups)
- Email campaign creator
- In-app notification sender
- SMS blast (if enabled)
- Template manager

### 10.5 Financial Management Dashboard

**Revenue Overview**
- Real-time revenue ticker
- Revenue breakdown pie chart:
  - Platform fees (2-3% per transaction)
  - Payment processing fees
  - Premium features
  - Property listing fees
- Monthly recurring revenue (MRR)
- Annual recurring revenue (ARR)
- Customer lifetime value (CLV)

**Transaction Monitor**
```
┌─────────────────────────────────────────────────────────────┐
│ Time     │ User         │ Type        │ Amount    │ Status │
├─────────────────────────────────────────────────────────────┤
│ 14:23:01 │ john***@...  │ Investment  │ $5,000    │ ✓      │
│ 14:22:47 │ sara***@...  │ Withdrawal  │ $2,500    │ ⏳      │
│ 14:22:15 │ mike***@...  │ Investment  │ $10,000   │ ✓      │
│ 14:21:58 │ lisa***@...  │ Failed      │ $1,000    │ ✗      │
└─────────────────────────────────────────────────────────────┘
```

**Payout Management**
- Rental distribution scheduler
- Batch payout processing
- Failed payment handling
- Payout history log
- Tax document generation

**Fee Configuration Panel**
- Platform fee percentage slider
- Transaction minimum/maximum
- Payment method fees
- Withdrawal fees
- Premium tier pricing
- Promotional discounts

**Financial Reports Generator**
- P&L statements
- Cash flow reports
- Tax reports
- Investor reports
- Regulatory compliance reports
- Custom report builder

### 10.6 Blockchain Management Console

**Smart Contract Monitor**
- Contract addresses list
- Contract balance displays
- Function call history
- Event log viewer
- Gas usage analytics
- Emergency pause buttons

**Transaction Analytics**
- On-chain transaction viewer
- Gas price tracker
- Transaction success/failure rates
- Average confirmation times
- Network congestion indicator
- Cross-chain analytics (if multi-chain)

**Wallet Management**
- Platform hot wallet balance
- Cold storage balance
- Automated sweep settings
- Withdrawal approval queue
- Multi-sig configuration
- Address whitelist management

### 10.7 Support & Operations Center

**Support Ticket System**
- Ticket queue with priorities:
  - Critical (red) - Payment issues
  - High (orange) - Access issues  
  - Medium (yellow) - Questions
  - Low (green) - Feedback
- Ticket assignment system
- Response time tracking
- Resolution metrics
- Canned responses library
- Escalation workflows

**System Health Dashboard**
- Server status indicators
- API response times
- Database performance
- Cache hit rates
- Error rate monitoring
- Uptime percentage
- Active alerts panel

**Audit Log Viewer**
- Complete admin action history
- Filterable by:
  - Admin user
  - Action type
  - Date range
  - Affected entity
- Export functionality
- Compliance reporting

### 10.8 Marketing & Analytics Hub

**Campaign Performance**
- UTM parameter tracking
- Conversion funnel visualization
- A/B test results
- ROI per campaign
- Channel attribution
- Referral program metrics

**User Behavior Analytics**
- Page flow visualization
- Feature usage heat maps
- Session recordings (if enabled)
- Conversion optimization suggestions
- Churn prediction model
- User segmentation analysis

**SEO & Content Metrics**
- Organic traffic trends
- Keyword rankings
- Page performance scores
- Content engagement metrics
- Backlink monitoring
- Competitor analysis

### 10.9 Admin Navigation Structure

**Primary Admin Sidebar (Left)**
```
[Platform Logo]
━━━━━━━━━━━━━━━
📊 Overview
🏢 Properties
  ├─ All Properties
  ├─ Approval Queue
  ├─ Add Property
  └─ Analytics
👥 Users
  ├─ All Users
  ├─ KYC Queue
  ├─ Communications
  └─ Segments
💰 Finances
  ├─ Revenue
  ├─ Transactions
  ├─ Payouts
  └─ Reports
⛓️ Blockchain
  ├─ Contracts
  ├─ Transactions
  └─ Wallets
🎯 Marketing
  ├─ Campaigns
  ├─ Analytics
  └─ SEO
⚙️ Settings
  ├─ Platform
  ├─ Fees
  ├─ Team
  └─ API
🎧 Support
  ├─ Tickets
  ├─ FAQ Manager
  └─ System Health
━━━━━━━━━━━━━━━
[Admin Profile]
[Logout]
```

**Admin Top Bar**
- Search everything (users, properties, transactions)
- Quick actions dropdown
- Notification center (system alerts)
- Admin chat (team communication)
- Environment switcher (Production/Staging)
- Help documentation link

### 10.10 Admin Mobile Interface

**Mobile Admin App Considerations**
- Responsive web app (not native initially)
- Priority on monitoring vs. management
- Critical actions only:
  - View key metrics
  - Approve/reject KYC
  - Pause/unpause properties
  - Respond to support tickets
  - View alerts
- Bottom navigation:
  - Overview
  - Alerts
  - Properties
  - Users
  - More

**Mobile-Optimized Views**
- Stacked KPI cards
- Simplified tables (card view)
- Swipe actions for quick decisions
- Touch-optimized buttons (min 44px)
- Pull-to-refresh data

### 10.11 Role-Based Access Control (RBAC)

**Admin Roles:**

**Super Admin**
- Full access to everything
- Can manage other admins
- Can modify platform settings
- Can access financial data
- Can execute blockchain functions

**Property Manager**
- Manage properties
- Approve listings
- View property analytics
- Cannot access financials

**Support Staff**
- View users
- Handle support tickets
- Cannot modify data
- Cannot access financials

**Marketing Manager**
- Access marketing tools
- View analytics
- Manage campaigns
- Cannot access user PII

**Finance Manager**
- View all financial data
- Process payouts
- Generate reports
- Cannot modify platform settings

### 10.12 Admin Security Features

**Two-Factor Authentication**
- Required for all admin accounts
- Hardware key support (YubiKey)
- Backup codes
- Session timeout (30 min)

**Audit Trail**
- Every action logged
- IP address tracking
- Browser fingerprinting
- Unusual activity alerts

**Data Protection**
- PII masking in UI
- Encrypted data export
- Secure file deletion
- GDPR compliance tools

---

## 1. GLOBAL DESIGN SYSTEM FOUNDATION

### 1.1 Color System - EXACT HEX VALUES

**Primary Blue Palette** (Trust & Security)
- `#E6F2FF` - Lightest blue for subtle backgrounds, hover states on white buttons
- `#CCE0FF` - Light blue for secondary backgrounds, disabled states
- `#99C2FF` - Medium-light blue for borders on focus states
- `#66A3FF` - Medium blue for secondary CTAs, link hover states
- `#3385FF` - Bright blue for active states, progress bars
- `#007BFF` - PRIMARY ACTION COLOR - All main CTAs, primary buttons, links
- `#0062CC` - Darker blue for button hover states
- `#004A99` - Deep blue for pressed/active button states
- `#003166` - Navy for headers, important text
- `#001933` - Darkest navy for high-emphasis text

**Success Green Palette** (Positive Metrics)
- `#E8F5E9` - Lightest green for positive background highlights
- `#C8E6C9` - Light green for success message backgrounds
- `#A5D6A7` - Medium-light for positive trend backgrounds
- `#81C784` - Medium green for success borders
- `#66BB6A` - Bright green for positive change indicators
- `#4CAF50` - SUCCESS PRIMARY - Completed transactions, positive changes
- `#43A047` - Darker green for success button hover
- `#388E3C` - Deep green for success button pressed
- `#2E7D32` - Investment growth metrics, high-positive values
- `#1B5E20` - Darkest green for maximum positive emphasis

**Error Red Palette** (Alerts & Warnings)
- `#FFEBEE` - Lightest red for error backgrounds
- `#FFCDD2` - Light red for error message containers
- `#EF9A9A` - Medium-light for error borders
- `#E57373` - Medium red for error text
- `#EF5350` - Bright red for error icons
- `#DC3545` - ERROR PRIMARY - Main error states, critical alerts
- `#C62828` - Dark red for error emphasis
- `#B71C1C` - Darkest red for critical errors

**Warning Orange Palette**
- `#FFF3E0` - Lightest orange for warning backgrounds
- `#FFE0B2` - Light orange for caution areas
- `#FFCC80` - Medium-light for warning borders
- `#FFB74D` - Medium orange for warning icons
- `#FFA726` - Bright orange for attention-needed states
- `#FF6347` - WARNING PRIMARY - Non-critical warnings, attention states

**Neutral Gray Palette**
- `#FAFAFA` - Off-white background for main app
- `#F5F5F5` - Light gray for card backgrounds
- `#EEEEEE` - Border gray lightest
- `#E0E0E0` - Divider lines
- `#BDBDBD` - Disabled text, placeholder text
- `#9E9E9E` - Secondary text
- `#757575` - Icon default color
- `#616161` - Body text secondary
- `#424242` - Body text primary
- `#212121` - Heading text

### 1.2 Typography System - EXACT SPECIFICATIONS

**Font Family Stack**
- Primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- Monospace: 'JetBrains Mono', 'SF Mono', 'Monaco', monospace
- Load Inter weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)

**Type Scale with Line Heights**
- Display Large: 60px / 72px line-height / -0.04em letter-spacing
- Display: 48px / 56px line-height / -0.03em letter-spacing
- H1: 36px / 44px line-height / -0.03em letter-spacing / 700 weight
- H2: 30px / 38px line-height / -0.02em letter-spacing / 700 weight
- H3: 24px / 32px line-height / -0.02em letter-spacing / 600 weight
- H4: 20px / 30px line-height / -0.01em letter-spacing / 600 weight
- H5: 18px / 28px line-height / 0 letter-spacing / 600 weight
- H6: 16px / 24px line-height / 0 letter-spacing / 600 weight
- Body Large: 18px / 28px line-height / 0 letter-spacing / 400 weight
- Body: 16px / 24px line-height / 0 letter-spacing / 400 weight
- Body Small: 14px / 20px line-height / 0.01em letter-spacing / 400 weight
- Caption: 12px / 16px line-height / 0.02em letter-spacing / 400 weight
- Overline: 11px / 16px line-height / 0.08em letter-spacing / 600 weight / UPPERCASE

**Financial Data Typography**
- Large Value: 32px / 40px line-height / -0.02em / 700 weight / tabular-nums
- Medium Value: 24px / 32px line-height / -0.01em / 600 weight / tabular-nums
- Small Value: 18px / 24px line-height / 0 / 600 weight / tabular-nums
- Table Data: 14px / 20px line-height / 0 / 500 weight / tabular-nums
- Micro Value: 12px / 16px line-height / 0 / 600 weight / tabular-nums

### 1.3 Spacing System - 8px Base Unit

**Spacing Scale**
- 0.5 = 4px (micro spacing within components)
- 1 = 8px (tight spacing between related elements)
- 1.5 = 12px (compact spacing)
- 2 = 16px (default spacing between elements)
- 2.5 = 20px (comfortable spacing)
- 3 = 24px (section spacing within cards)
- 4 = 32px (spacing between cards)
- 5 = 40px (major section spacing)
- 6 = 48px (large section breaks)
- 8 = 64px (page section spacing)
- 10 = 80px (major page sections)
- 12 = 96px (hero section padding)

### 1.4 Responsive Breakpoints

- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px - 1439px
- Wide: 1440px+
- Maximum content width: 1440px
- Side margins: 24px (mobile), 32px (tablet), 48px (desktop), auto-centered (wide)

### 1.5 Border Radius System

- None: 0px (tables, full-width elements)
- Subtle: 4px (small buttons, badges, chips)
- Default: 8px (cards, inputs, dropdowns)
- Medium: 12px (modals, larger cards)
- Large: 16px (feature cards, hero sections)
- Extra Large: 20px (special CTAs)
- Pill: 9999px (pills, tags, rounded buttons)

### 1.6 Shadow System

- xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05) - Subtle elevation
- sm: 0 2px 4px -1px rgba(0, 0, 0, 0.06) - Cards rest state
- DEFAULT: 0 4px 6px -2px rgba(0, 0, 0, 0.05) - Standard elevation
- md: 0 6px 10px -3px rgba(0, 0, 0, 0.04) - Hover on cards
- lg: 0 10px 15px -3px rgba(0, 0, 0, 0.04) - Dropdowns, popovers
- xl: 0 20px 25px -5px rgba(0, 0, 0, 0.04) - Modals
- 2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.08) - Large modals
- inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06) - Pressed states

### 1.7 CSS Variables for shadcn/ui Integration

```css
/* These exact values override shadcn defaults */
@layer base {
  :root {
    --background: 0 0% 100%;          /* #FFFFFF */
    --foreground: 0 0% 13%;           /* #212121 */
    
    --primary: 211 100% 50%;          /* #007BFF */
    --primary-foreground: 0 0% 100%;  /* #FFFFFF */
    
    --secondary: 211 100% 95%;        /* #E6F2FF */
    --secondary-foreground: 211 100% 20%; /* #003166 */
    
    --muted: 0 0% 96%;                /* #F5F5F5 */
    --muted-foreground: 0 0% 45%;     /* #757575 */
    
    --accent: 211 100% 95%;           /* #E6F2FF */
    --accent-foreground: 211 100% 30%; /* #004A99 */
    
    --destructive: 354 70% 54%;       /* #DC3545 */
    --destructive-foreground: 0 0% 100%;
    
    --success: 123 38% 57%;           /* #4CAF50 */
    --success-foreground: 0 0% 100%;
    
    --warning: 9 100% 64%;            /* #FF6347 */
    --warning-foreground: 0 0% 100%;
    
    --border: 0 0% 88%;               /* #E0E0E0 */
    --input: 0 0% 88%;                /* #E0E0E0 */
    --ring: 211 100% 50%;             /* #007BFF */
    
    --radius: 0.5rem;                 /* 8px */
  }
}
```

---

## 2. NAVIGATION HEADER SPECIFICATIONS

### 2.1 Desktop Navigation Bar (≥1024px)

**Container Specifications**
- Position: Fixed top
- Height: EXACTLY 72px
- Background: #FFFFFF
- Border-bottom: 1px solid #E0E0E0
- Z-index: 1000
- Box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.06)
- Max-width container: 1440px centered
- Side padding: 48px

**Logo Section (Left)**
- Logo container: 40px × 40px
- Logo background: Linear gradient 135deg from #007BFF to #004A99
- Logo border-radius: 8px
- Logo icon: 24px × 24px white SVG, centered
- Logo text: "PropertyChain" - 18px Inter Bold #212121
- Logo tagline: "Tokenized Real Estate" - 12px Inter Regular #9E9E9E
- Logo hover: Box-shadow transitions from sm to md over 200ms ease
- Gap between logo icon and text: 12px

**Center Navigation Links**
- Uses shadcn NavigationMenu component
- Font: 15px Inter Medium
- Color: #616161 default, #007BFF hover
- Padding: 16px horizontal, 8px vertical
- Hover transition: color 200ms ease
- Active link: #007BFF color with 2px bottom border
- Gap between links: 8px

**Dropdown Menus**
- Uses shadcn NavigationMenuContent
- Trigger: Chevron-down icon 16px, rotates 180deg on hover
- Menu appears: 8px below trigger
- Menu width: 280px
- Menu background: #FFFFFF
- Menu border: 1px solid #E0E0E0
- Menu border-radius: 8px
- Menu shadow: xl (0 20px 25px -5px rgba(0, 0, 0, 0.04))
- Menu padding: 8px
- Menu animation: Fade in + slide down 10px over 200ms ease-out

**Right Section Elements**
- Notification bell: 20px icon, #757575 default, #424242 hover
- Notification badge: 8px × 8px circle, #DC3545 background, absolute position top-4px right-4px
- Button spacing: 12px gap between all buttons
- Uses shadcn Button components with custom variants

### 2.2 Mobile Navigation (<1024px)

**Mobile Header Bar**
- Height: 60px
- Position: Fixed top
- Background: #FFFFFF
- Border-bottom: 1px solid #E0E0E0
- Padding: 0 16px
- Z-index: 1000

**Mobile Menu Drawer**
- Uses shadcn Sheet component
- Position: Fixed right
- Width: 280px
- Top: 60px (below header)
- Height: calc(100vh - 60px)
- Background: #FFFFFF
- Shadow: 2xl
- Animation: Slide from right 300ms ease-out
- Overlay: rgba(0, 0, 0, 0.5) backdrop

---

## 3. HERO SECTION SPECIFICATIONS

### 3.1 Hero Container

**Dimensions & Layout**
- Min-height: 700px mobile, 800px desktop
- Background: Linear gradient 135deg from #E6F2FF via #FFFFFF to #E6F2FF
- Padding-top: 120px mobile, 160px desktop (accounts for fixed header)
- Padding-bottom: 80px
- Max-width content: 1440px

**Background Pattern**
- Grid pattern: 40px × 40px squares
- Stroke: #003366 at 5% opacity
- Stroke-width: 1px
- Position: Absolute, full coverage

**Floating Elements**
- Uses Framer Motion for animations
- Element 1: 80px × 80px, #007BFF at 20% opacity, blur 24px
  - Position: top 10%, right 15%
  - Animation: Float up/down 20px + rotate ±5deg over 6s infinite
- Element 2: 120px × 120px circle, #4CAF50 at 20% opacity, blur 24px
  - Position: bottom 20%, left 10%
  - Animation: Float up/down 20px + rotate ±5deg over 8s infinite

### 3.2 Hero Content

**Main Headline**
- Font: 48px mobile / 60px desktop Inter Bold
- Line-height: 1.1
- Color: #001933 main text
- Color: #007BFF for emphasis text
- Letter-spacing: -0.03em
- Uses React Wrap Balancer for optimal line breaks

**CTA Buttons**
- Uses shadcn Button components
- Primary CTA:
  - Height: 56px
  - Padding: 24px horizontal
  - Background: #007BFF
  - Text: 16px Inter Semibold white
  - Border-radius: 8px
  - Shadow: lg default, xl on hover
  - Hover: Background #0062CC, translateY(-2px)
  - Arrow icon: 20px, margin-left 8px

**Featured Property Card**
- Uses shadcn Card component as base
- Custom styling for gradient overlays
- Framer Motion for entrance animations
- React CountUp for animated numbers

---

## 4. PROPERTY CARD COMPONENT SPECIFICATIONS

### 4.1 Card Container

**Base Structure**
- Uses shadcn Card, CardHeader, CardContent, CardFooter
- Width: 100% of grid column
- Min-height: 480px
- Background: #FFFFFF
- Border-radius: 12px
- Shadow: lg default, xl on hover
- Transition: all 300ms ease
- Hover: translateY(-4px) with Framer Motion
- Featured card: Additional 2px border #007BFF

### 4.2 Card Badges

**Using shadcn Badge component**
- Featured badge:
  - Variant: custom "featured"
  - Position: absolute top 16px, left 16px
  - Background: Linear gradient from #007BFF to #0062CC
  - Text: 11px Inter Bold white uppercase
  
### 4.3 Card Content Elements

**Progress Bar**
- Uses shadcn Progress component
- Height: 8px
- Background: #F5F5F5
- Fill: Linear gradient from #007BFF to #0062CC
- Animation: Width 0 to target over 1s ease-out with Framer Motion

**Action Buttons**
- Uses shadcn Button components
- Primary: variant="default" with custom width
- Secondary: variant="outline" size="icon"

---

## 5. DASHBOARD SPECIFICATIONS

### 5.1 Dashboard Layout

**Using shadcn + Resizable Panels**
- Sidebar: 240px fixed width on desktop
- Uses shadcn Sheet for mobile drawer
- Main content: calc(100% - 240px)
- Resizable panels for customizable layout

### 5.2 KPI Cards

**Using shadcn Card + Tremor for mini charts**
```typescript
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
    <DollarSign className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">$125,430</div>
    <p className="text-xs text-muted-foreground">+12.5% from last month</p>
    <SparkAreaChart data={data} className="h-[40px]" />
  </CardContent>
</Card>
```

### 5.3 Data Tables

**Using shadcn DataTable with TanStack Table**
- Column sorting
- Row selection
- Pagination
- Filtering
- Custom cell renderers
- Responsive design with card view on mobile

---

## 6. FORM COMPONENTS SPECIFICATIONS

### 6.1 All Form Elements

**Using shadcn Form components with React Hook Form + Zod**
```typescript
// Input
<FormField
  control={form.control}
  name="amount"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Investment Amount</FormLabel>
      <FormControl>
        <Input 
          placeholder="Enter amount" 
          type="number"
          className="h-12" // Our 48px height
          {...field} 
        />
      </FormControl>
      <FormDescription>Minimum investment: $50</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

**Custom Input Heights**
- Default: h-12 (48px)
- Small: h-10 (40px)
- Large: h-14 (56px)

---

## 7. MODAL & OVERLAY SPECIFICATIONS

### 7.1 Modal Components

**Using shadcn Dialog**
```typescript
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Modal</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[480px]">
    <DialogHeader>
      <DialogTitle>Modal Title</DialogTitle>
      <DialogDescription>Modal description</DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### 7.2 Toast Notifications

**Using shadcn Sonner integration**
```typescript
// In layout
<Toaster 
  position="top-right"
  toastOptions={{
    style: {
      background: '#FFFFFF',
      border: '1px solid #E0E0E0',
    },
  }}
/>

// Usage
toast.success("Investment successful!", {
  description: "You invested $5,000 in Marina District",
})
```

---

## 8. ADDITIONAL COMPONENT SPECIFICATIONS (shadcn enhanced)

### 8.1 Sidebar Navigation

**Using shadcn NavigationMenu + Sheet for mobile**
- Desktop: Fixed 240px sidebar
- Mobile: Sheet component with left-side drawer
- Collapsible with button
- Active states with data attributes

### 8.2 Date Range Picker

**Using shadcn Calendar + Popover**
```typescript
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" className="w-[280px]">
      <CalendarIcon className="mr-2 h-4 w-4" />
      {date ? format(date, "PPP") : "Pick a date"}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0">
    <Calendar
      mode="range"
      selected={date}
      onSelect={setDate}
    />
  </PopoverContent>
</Popover>
```

### 8.3 Command Palette Search

**Using shadcn Command (cmdk)**
```typescript
<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandInput placeholder="Search properties..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Properties">
      {properties.map((property) => (
        <CommandItem key={property.id}>
          {property.name}
        </CommandItem>
      ))}
    </CommandGroup>
  </CommandList>
</CommandDialog>
```

### 8.4 Tabs Component

**Using shadcn Tabs**
```typescript
<Tabs defaultValue="overview" className="w-full">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="details">Details</TabsTrigger>
    <TabsTrigger value="documents">Documents</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    {/* Content */}
  </TabsContent>
</Tabs>
```

### 8.5 Accordion Component

**Using shadcn Accordion**
```typescript
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section Title</AccordionTrigger>
    <AccordionContent>
      Section content here
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

---

## 9. PAGE LAYOUTS & INFORMATION ARCHITECTURE

### 9.1 Complete Site Structure

```
ROOT STRUCTURE:
/
├── PUBLIC PAGES
│   ├── / (Homepage)
│   │   ├── Header (shadcn NavigationMenu)
│   │   ├── Hero Section (Custom with Framer Motion)
│   │   ├── Featured Properties (3x shadcn Cards)
│   │   ├── How It Works (Custom with animations)
│   │   ├── Benefits Grid (shadcn Cards grid)
│   │   ├── Market Statistics (Tremor charts)
│   │   ├── Testimonials (Embla Carousel)
│   │   ├── Newsletter CTA (shadcn Form)
│   │   └── Footer
│   │
│   ├── /properties (Property Listing)
│   │   ├── Search Bar (shadcn Command)
│   │   ├── Filter Sidebar (shadcn Form elements)
│   │   ├── Results Count & Sort (shadcn Select)
│   │   ├── Property Cards Grid (shadcn Cards)
│   │   ├── Map View (React Map GL)
│   │   └── Pagination (shadcn Pagination)
│   │
│   ├── /properties/[id] (Property Detail)
│   │   ├── Image Gallery (Swiper + shadcn Dialog)
│   │   ├── Property Info (shadcn Tabs)
│   │   ├── Investment Calculator (shadcn Form)
│   │   ├── Documents (shadcn Table)
│   │   └── Sticky Investment Widget (shadcn Card)
│   │
└── ADMIN DASHBOARD (Platform Owner Only)
    ├── /admin (Overview)
    │   ├── Business KPIs Strip
    │   ├── Revenue Analytics
    │   ├── User Growth Metrics
    │   ├── Property Performance Grid
    │   └── Live Activity Feed
    │
    ├── /admin/properties
    │   ├── Property Management Table
    │   ├── Approval Queue
    │   ├── Add/Edit Property
    │   ├── Bulk Actions
    │   └── Property Analytics
    │
    ├── /admin/users
    │   ├── User Management Table
    │   ├── KYC Verification Center
    │   ├── User Communications
    │   ├── Segmentation Tools
    │   └── User Analytics
    │
    ├── /admin/finances
    │   ├── Revenue Dashboard
    │   ├── Transaction Monitor
    │   ├── Payout Management
    │   ├── Fee Configuration
    │   └── Financial Reports
    │
    ├── /admin/blockchain
    │   ├── Smart Contract Monitor
    │   ├── Transaction Analytics
    │   ├── Wallet Management
    │   ├── Gas Analytics
    │   └── Emergency Controls
    │
    ├── /admin/marketing
    │   ├── Campaign Manager
    │   ├── Analytics Dashboard
    │   ├── SEO Tools
    │   ├── Content Manager
    │   └── Referral Program
    │
    ├── /admin/support
    │   ├── Ticket Queue
    │   ├── Response Center
    │   ├── FAQ Manager
    │   ├── System Health
    │   └── Audit Logs
    │
    └── /admin/settings
        ├── Platform Configuration
        ├── Fee Structure
        ├── Team Management
        ├── API Configuration
        └── Security Settings
    ├── /dashboard (Overview)
    │   ├── Sidebar (shadcn NavigationMenu)
    │   ├── KPI Cards (shadcn Cards + Tremor)
    │   ├── Charts (Tremor in shadcn Cards)
    │   └── Transactions (shadcn DataTable)
```

### 9.2 Component Hierarchy

**Desktop Admin Layout (1440px container)**
```
┌─────────────────────────────────────────────────────────────┐
│ Admin Header (60px) - Dark theme                           │
│ [Logo] Overview | Properties | Users | Finance | More  [👤] │
├─────────────────────────────────────────────────────────────┤
│ Business KPIs Strip (100px) - Live metrics                 │
│ TVL: $127M | Revenue: $482k | Users: 15k | Properties: 156 │
├──────────────┬──────────────────────────────────┬──────────┤
│              │                                  │          │
│   Sidebar    │     Main Analytics Area         │   Live   │
│   (200px)    │        (Flexible)               │   Feed   │
│              │                                  │  (320px) │
│  Quick       │  ┌──────────────────────────┐   │          │
│  Actions     │  │ Revenue Chart            │   │ • New    │
│              │  │ Multi-line, toggleable   │   │   invest │
│  Reports     │  └──────────────────────────┘   │          │
│              │                                  │ • User   │
│  Alerts      │  ┌──────────────────────────┐   │   signup │
│              │  │ User Growth Funnel       │   │          │
│  Settings    │  │ Conversion metrics       │   │ • Failed │
│              │  └──────────────────────────┘   │   trans  │
│              │                                  │          │
└──────────────┴──────────────────────────────────┴──────────┘
```

**Mobile Admin Layout (Responsive)**
```
┌─────────────────────┐
│ Admin Header (60px) │
│ ☰  Admin Panel   👤 │
├─────────────────────┤
│ KPI Cards (Scroll)  │
│ ┌─────┐ ┌─────┐    │
│ │ TVL │ │Rev. │ >> │
│ └─────┘ └─────┘    │
├─────────────────────┤
│ Quick Actions       │
│ ┌─────────────────┐ │
│ │ Approve KYC     │ │
│ │ View Alerts     │ │
│ │ Check Tickets   │ │
│ └─────────────────┘ │
├─────────────────────┤
│ Priority Alerts     │
│ • Critical: Payment │
│ • High: KYC pending │
│ • Medium: Support   │
└─────────────────────┘
```

---

# PHASE-BY-PHASE IMPLEMENTATION PLAN FOR CLAUDE CODE

## PHASE 1: PROJECT FOUNDATION & SHADCN SETUP (Steps 1-20)

### Step 1: Initialize Next.js Project with TypeScript
**Exact Commands & Configuration:**
```bash
npx create-next-app@14 propertychain --typescript --tailwind --app --eslint
cd propertychain
```

### Step 2: Install Core Dependencies
**Required Package Installation:**
```bash
# Core UI Libraries
npm install @radix-ui/react-icons lucide-react
npm install class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-slot

# Form & Validation
npm install react-hook-form @hookform/resolvers zod

# State Management & Data
npm install @tanstack/react-query@5 zustand@4.4
npm install @tanstack/react-table@8

# Animation & Interactions  
npm install framer-motion@11
npm install react-intersection-observer
npm install @formkit/auto-animate

# Utilities
npm install date-fns@3.0
npm install react-use
npm install react-wrap-balancer

# Dev Dependencies
npm install --save-dev @types/node @types/react prettier eslint-config-prettier
```

### Step 3: Initialize shadcn/ui
**CRITICAL: This sets up the component system**
```bash
npx shadcn-ui@latest init

# Choose these options:
# - Would you like to use TypeScript? → Yes
# - Which style would you like to use? → Default
# - Which color would you like to use as base color? → Blue
# - Where is your global CSS file? → app/globals.css
# - Would you like to use CSS variables for colors? → Yes
# - Where is your tailwind.config.js located? → tailwind.config.ts
# - Configure the import alias for components? → @/components
# - Configure the import alias for utils? → @/lib/utils
```

### Step 4: Install ALL shadcn/ui Components
**Install complete component library:**
```bash
# Core Components
npx shadcn-ui@latest add alert alert-dialog aspect-ratio avatar badge button calendar card checkbox

# Form Components  
npx shadcn-ui@latest add form input label radio-group select separator slider switch textarea toast

# Layout Components
npx shadcn-ui@latest add accordion collapsible command dialog dropdown-menu hover-card menubar

# Navigation Components
npx shadcn-ui@latest add navigation-menu pagination breadcrumb tabs

# Data Display
npx shadcn-ui@latest add table skeleton progress scroll-area sheet

# Feedback Components
npx shadcn-ui@latest add sonner tooltip popover context-menu

# Advanced Components
npx shadcn-ui@latest add carousel drawer resizable toggle toggle-group
```

### Step 5: Configure Custom Tailwind Theme
**File: tailwind.config.ts**
```typescript
// Merge shadcn config with our exact design system
// Add ALL color values from Section 1.1
// Add ALL spacing values from Section 1.3
// Add ALL typography from Section 1.2
// Configure animations and keyframes
```
- Copy EXACT configuration from Section 1.1-1.6
- Ensure compatibility with shadcn CSS variables

### Step 6: Setup Global CSS with shadcn Variables
**File: app/globals.css**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Add exact CSS variables from Section 1.7 */
    /* These override shadcn defaults with our colors */
  }
}

/* Add custom utility classes */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

### Step 7: Create Custom Button Variants
**File: components/ui/button.tsx**
```typescript
// Extend shadcn button with our exact specifications
// Add success, warning variants
// Ensure exact heights: 40px (sm), 48px (default), 56px (lg)
// Add loading state with spinner
```

### Step 8: Create Typography Components
**File: components/ui/typography.tsx**
```typescript
// Wrap shadcn components with our type scale
// H1-H6 with exact sizes from Section 1.2
// Financial data components with tabular-nums
```

### Step 9: Setup Project Structure
```
src/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── properties/
│   └── (marketing)/
├── components/
│   ├── ui/           # shadcn components
│   ├── custom/       # Our property-specific components
│   ├── layouts/      # Header, Footer, Sidebar
│   └── providers/    # Context providers
├── lib/
│   ├── hooks/
│   ├── utils/
│   └── constants/
└── styles/
```

### Step 10: Create Theme Provider
**File: components/providers/theme-provider.tsx**
```typescript
// Setup next-themes with shadcn
// Add system detection
// Configure CSS variable switching
```

### Step 11: Build Main Layout Structure
**File: app/layout.tsx**
```typescript
// Root layout with providers
// Font configuration
// Metadata setup
// Error boundary
```

### Step 12: Create Navigation Header
**File: components/layouts/header.tsx**
**PLACEMENT: Fixed top of every page, z-index 1000**
```typescript
// Use shadcn NavigationMenu
// Implement exact specs from Section 2.1
// Desktop: 72px height, 1440px max-width
// Mobile: 60px height with Sheet drawer
```

### Step 13: Create Mobile Navigation
**File: components/layouts/mobile-nav.tsx**
**PLACEMENT: Replaces header on screens < 1024px**
```typescript
// Use shadcn Sheet for drawer
// 280px width drawer from right
// Backdrop with overlay
// Touch gestures with react-use
```

### Step 14: Build Footer Component
**File: components/layouts/footer.tsx**
**PLACEMENT: Bottom of all public pages**
```typescript
// 4-column layout desktop (Section 17.5 specs)
// Accordion on mobile using shadcn Accordion
// Newsletter form with shadcn Form
```

### Step 15: Create Property Card Component
**File: components/custom/property-card.tsx**
**PLACEMENT: Homepage, /properties, dashboard, related properties**
```typescript
// Use shadcn Card as base
// Add image with lazy loading
// Progress bar with shadcn Progress
// Badges with shadcn Badge
// Framer Motion hover animations
```

### Step 16: Build Dashboard Sidebar
**File: components/layouts/dashboard-sidebar.tsx**
**PLACEMENT: Left side of all dashboard pages**
```typescript
// 240px fixed width
// Use shadcn NavigationMenu
// Collapsible with state
// Mobile: Bottom tabs or Sheet
```

### Step 17: Create KPI Card Components
**File: components/custom/kpi-card.tsx**
**PLACEMENT: Dashboard homepage, analytics pages**
```typescript
// Use shadcn Card
// Add Tremor SparkChart for mini charts
// Exact specs from Section 5.2
// Grid: 4 cols desktop, 2 tablet, 1 mobile
```

### Step 18: Setup Form Components
**File: components/custom/form-elements.tsx**
```typescript
// Wrap shadcn Form components
// Add React Number Format for currency
// Custom validation with Zod schemas
// Error states with FormMessage
```

### Step 19: Create Modal System
**File: components/custom/modals.tsx**
```typescript
// Use shadcn Dialog for all modals
// Standard sizes: 480px, 640px, 800px
// Mobile: Full screen with Sheet
// Focus trap and ESC handling built-in
```

### Step 20: Setup Toast System
**File: app/layout.tsx**
```typescript
// Add Sonner Toaster to root layout
// Configure position and styling
// Create toast utility functions
```

---

## PHASE 2: ADVANCED COMPONENTS & FEATURES (Steps 21-40)

### Step 21: Install Specialized Libraries
```bash
# Charts & Visualization
npm install @tremor/react recharts
npm install react-chartjs-2 chart.js

# Web3
npm install wagmi@2 viem@2 @rainbow-me/rainbowkit@2
npm install @web3modal/ethers@4 @dynamic-labs/sdk-react-core

# File Handling
npm install react-dropzone react-pdf

# Images & Media
npm install swiper react-image-gallery
npm install react-lazy-load-image-component

# Advanced Forms
npm install react-select react-number-format
npm install react-datepicker react-international-phone

# Performance
npm install @tanstack/react-virtual million
npm install react-window react-intersection-observer
```

### Step 22: Build Hero Section
**File: components/sections/hero.tsx**
**PLACEMENT: Homepage top section**
```typescript
// Implement Section 3 specifications
// Framer Motion floating elements
// shadcn Buttons for CTAs
// React Wrap Balancer for headlines
// CountUp for statistics
```

### Step 23: Create Property Grid
**File: components/custom/property-grid.tsx**
**PLACEMENT: /properties main content**
```typescript
// Responsive grid with Tailwind
// Virtual scrolling with TanStack Virtual
// Loading states with shadcn Skeleton
// Empty state with illustration
```

### Step 24: Build Image Gallery
**File: components/custom/image-gallery.tsx**
**PLACEMENT: Property detail pages**
```typescript
// Swiper for main carousel
// shadcn Dialog for lightbox
// Lazy loading with react-lazy-load
// Touch gestures for mobile
```

### Step 25: Create Data Tables
**File: components/custom/data-table.tsx**
**PLACEMENT: Dashboard, transactions, admin**
```typescript
// shadcn Table with TanStack Table
// Sorting, filtering, pagination
// Column visibility toggle
// Export functionality
// Mobile: Card view transformation
```

### Step 26: Build Chart Components
**File: components/custom/charts.tsx**
**PLACEMENT: Dashboard, analytics**
```typescript
// Tremor for financial charts
// Recharts for custom visualizations
// Responsive containers
// Real-time updates with react-query
```

### Step 27: Create Investment Calculator
**File: components/custom/investment-calculator.tsx**
**PLACEMENT: Property details, modal, tools page**
```typescript
// shadcn Form with validation
// shadcn Slider for amount selection
// React Number Format for currency
// Real-time calculations
// Quick amount buttons
```

### Step 28: Build Search System
**File: components/custom/search.tsx**
**PLACEMENT: Header, properties page**
```typescript
// shadcn Command (cmdk) for palette
// Fuse.js for fuzzy search
// Recent searches in localStorage
// Voice search with Web Speech API
```

### Step 29: Create Filter Components
**File: components/custom/property-filters.tsx**
**PLACEMENT: /properties sidebar (desktop), modal (mobile)**
```typescript
// shadcn Form elements
// Price range with shadcn Slider
// Location with React Select
// Property type with shadcn Checkbox
// Mobile: Full screen Sheet
```

### Step 30: Build Authentication Forms
**File: components/auth/auth-forms.tsx**
**PLACEMENT: /auth/* pages**
```typescript
// shadcn Form with React Hook Form
// Social login buttons
// Password strength indicator
// Two-factor input
// Multi-step registration
```

### Step 31: Create Dashboard Layout
**File: app/(dashboard)/layout.tsx**
**STRUCTURE: Sidebar + Main Content**
```typescript
// Resizable panels for desktop
// shadcn Sheet for mobile sidebar
// Breadcrumbs with shadcn
// User menu with DropdownMenu
```

### Step 32: Build Dashboard Pages
**File: app/(dashboard)/dashboard/page.tsx**
```typescript
// KPI cards grid (Step 17)
// Charts row with Tremor
// Transactions table
// Activity feed
// Quick actions
```

### Step 33: Create Web3 Components
**File: components/web3/wallet-connect.tsx**
**PLACEMENT: Header, investment flows**
```typescript
// Dynamic.xyz or ConnectKit setup
// Custom modal with shadcn Dialog
// Network switcher
// Balance display with CountUp
```

### Step 34: Build Transaction Flow
**File: components/web3/transaction-modal.tsx**
**PLACEMENT: Investment actions**
```typescript
// Multi-step with shadcn Tabs
// Gas estimation display
// Confirmation with shadcn Checkbox
// Progress tracking
// Success with react-confetti
```

### Step 35: Create File Upload System
**File: components/custom/file-upload.tsx**
**PLACEMENT: KYC, documents**
```typescript
// React Dropzone for drag-drop
// shadcn Progress for upload
// File preview with icons
// Image cropping for avatars
```

### Step 36: Build Notification System
**File: components/custom/notifications.tsx**
**PLACEMENT: Dashboard, header**
```typescript
// Real-time with WebSockets
// shadcn Badge for unread count
// Grouped by type
// Mark as read functionality
```

### Step 37: Create Settings Pages
**File: app/(dashboard)/settings/page.tsx**
```typescript
// shadcn Tabs for sections
// Profile with avatar upload
// Security with 2FA setup
// Notifications with Switch
// API keys with copy function
```

### Step 38: Build Mobile Optimizations
**File: components/mobile/mobile-specific.tsx**
```typescript
// Bottom tab bar navigation
// Pull to refresh
// Swipe gestures
// Touch ripple effects
// App install prompt
```

### Step 39: Create Loading States
**File: components/custom/loading.tsx**
```typescript
// shadcn Skeleton variations
// Shimmer effects
// Progress indicators
// Suspense boundaries
```

### Step 40: Build Error Pages
**File: app/error.tsx & app/not-found.tsx**
```typescript
// Custom 404 with illustration
// Error boundary with retry
// Maintenance page
// Offline indicator
```

---

## PHASE 3: INTEGRATION & OPTIMIZATION (Steps 41-60)

### Step 41: Setup React Query
**File: lib/react-query.ts**
```typescript
// Configure query client
// Default stale times
// Error handling
// Optimistic updates
```

### Step 42: Create API Routes
**File: app/api/**
```typescript
// Property endpoints
// User management
// Transaction handling
// WebSocket setup
```

### Step 43: Implement Authentication
**File: lib/auth.ts**
```typescript
// NextAuth.js setup
// JWT handling
// Session management
// Protected routes
```

### Step 44: Build KYC Flow
**File: components/auth/kyc-flow.tsx**
**PLACEMENT: Registration, first investment**
```typescript
// Multi-step form with progress
// Document upload
// Verification status
// Resubmission handling
```

### Step 45: Build Complete Admin Dashboard System
**File: app/(admin)/**
**ACCESS: Platform owners and administrators only**
**CRITICAL: This is YOUR business management system**

#### Step 45.1: Admin Overview Dashboard
**File: app/(admin)/admin/page.tsx**
```typescript
// Business KPI Strip (Section 10.2)
// - TVL, Platform Revenue, Active Investors
// - Properties Listed, Transaction Volume
// - Real-time WebSocket updates
// - Export functionality

// Revenue Analytics Chart
// - Multi-line chart with Tremor
// - Daily/Weekly/Monthly/Yearly toggles
// - Platform fees vs transaction fees

// User Growth Funnel
// - Conversion metrics visualization
// - Cohort analysis table
// - Geographic distribution map

// Live Activity Feed
// - Real-time transaction stream
// - Color-coded by type
// - Click for details
```

#### Step 45.2: Property Management System
**File: app/(admin)/admin/properties/**
```typescript
// Property Management Table
// - shadcn DataTable with filters
// - Status badges (Draft/Active/Paused)
// - Funding progress bars
// - Bulk actions toolbar
// - Quick edit/pause controls

// Property Approval Queue
// - Card-based review interface
// - Document verification checklist
// - Approve/Reject/Request Info actions
// - Internal notes system
// - Audit trail

// Add/Edit Property Wizard
// - Multi-step form with shadcn
// - Image upload with preview
// - Document management
// - Tokenization settings
// - Publishing controls
```

#### Step 45.3: User Management System
**File: app/(admin)/admin/users/**
```typescript
// User Management Table
// - Advanced filtering system
// - KYC status indicators
// - Investment totals
// - Activity monitoring
// - Ban/Suspend actions

// KYC Verification Center
// - Queue-based workflow
// - Document viewer with zoom
// - Automated check results
// - Manual override options
// - Bulk processing

// Communication Center
// - Segment builder
// - Email campaign creator
// - Template manager
// - Send history log
```

#### Step 45.4: Financial Management
**File: app/(admin)/admin/finances/**
```typescript
// Revenue Dashboard
// - Real-time revenue ticker
// - Fee breakdown charts
// - MRR/ARR tracking
// - CLV calculations

// Transaction Monitor
// - Live transaction feed
// - Filter by type/status
// - Failed transaction alerts
// - Export capabilities

// Payout Management
// - Rental distribution scheduler
// - Batch processing interface
// - Failed payment recovery
// - Tax document generator
```

#### Step 45.5: Blockchain Management
**File: app/(admin)/admin/blockchain/**
```typescript
// Smart Contract Monitor
// - Contract status dashboard
// - Function call history
// - Event log viewer
// - Emergency pause controls

// Gas Analytics
// - Price tracking charts
// - Transaction cost analysis
// - Optimization suggestions
// - Network congestion alerts
```

#### Step 45.6: Support Center
**File: app/(admin)/admin/support/**
```typescript
// Ticket Management System
// - Priority-based queue
// - Assignment workflow
// - Response templates
// - Resolution tracking
// - Escalation rules

// System Health Monitor
// - Server status grid
// - API performance metrics
// - Error rate tracking
// - Uptime statistics
// - Alert configuration
```

#### Step 45.7: Admin Security & Access Control
**File: components/admin/AdminWrapper.tsx**
```typescript
// Role-based access control
// - Super Admin: Full access
// - Property Manager: Property operations
// - Support Staff: User support only
// - Finance Manager: Financial data only

// Security features:
// - Mandatory 2FA
// - Session management
// - Audit logging
// - IP restrictions
// - Activity monitoring
```

### Step 46: Setup Performance Monitoring
```typescript
// Lighthouse CI
// Bundle analyzer
// Error tracking (Sentry)
// Analytics (GA4/Mixpanel)
```

### Step 47: Implement SEO
**File: components/seo.tsx**
```typescript
// Dynamic meta tags
// Open Graph images
// Structured data
// Sitemap generation
```

### Step 48: Build PWA Features
```typescript
// Service worker
// Offline support
// Push notifications
// App manifest
```

### Step 49: Create Testing Suite
```typescript
// Unit tests with Jest
// Component tests with Testing Library
// E2E with Playwright
// Visual regression tests
```

### Step 50: Setup CI/CD Pipeline
```yaml
# GitHub Actions
# Automated testing
# Preview deployments
# Production deployment
```

### Step 51: Optimize Images
```typescript
// Next.js Image optimization
// Blur placeholders
// WebP with fallback
// Responsive srcsets
```

### Step 52: Implement Caching
```typescript
// Redis for API caching
// Static page generation
// ISR for dynamic content
// CDN configuration
```

### Step 53: Build Email Templates
```typescript
// React Email components
// Transaction confirmations
// Welcome emails
// Newsletter templates
```

### Step 54: Create Documentation
```typescript
// Storybook for components
// API documentation
// User guides
// Developer docs
```

### Step 55: Setup Monitoring
```typescript
// Uptime monitoring
// Performance metrics
// Error alerting
// User analytics
```

### Step 56: Implement Security
```typescript
// Rate limiting
// CSRF protection
// Content Security Policy
// Input sanitization
```

### Step 57: Build Accessibility Features
```typescript
// Screen reader support
// Keyboard navigation
// Focus management
// ARIA labels
```

### Step 58: Create Backup Systems
```typescript
// Database backups
// File storage backup
// Disaster recovery
// Data export tools
```

### Step 59: Performance Optimization
```typescript
// Code splitting
// Tree shaking
// Lazy loading
// Bundle optimization
```

### Step 60: Production Preparation
```typescript
// Environment variables
// Security audit
// Load testing
// Launch checklist
```

---

## CRITICAL IMPLEMENTATION NOTES

### Component Library Usage:
- **shadcn/ui**: 80% of all UI components
- **Tremor**: Dashboard charts and metrics only
- **Framer Motion**: Complex animations only
- **Custom**: Property-specific components only

### Quality Checkpoints:
- After Step 20: Core UI system complete with shadcn
- After Step 30: All investor-facing components built
- After Step 40: Features fully implemented
- **After Step 45: Complete Admin Dashboard operational**
- After Step 50: Testing and CI/CD complete
- After Step 60: Production ready

### Dual Dashboard Architecture:
- **Investor Dashboard** (/dashboard): Personal portfolio management
- **Admin Dashboard** (/admin): Business operations & monitoring
- **Clear separation** of concerns and access levels
- **Different metrics** for investors vs business owners

### Performance Targets:
- Lighthouse Score: 95+ on all metrics
- Bundle Size: <200KB initial load
- FCP: <1.5s
- TTI: <3.5s
- CLS: <0.05

### Mobile-First Development:
- Build mobile layout first
- Add desktop enhancements
- Test on real devices
- Ensure touch optimization

### Accessibility Requirements:
- WCAG 2.1 AA compliance
- Keyboard navigation for all features
- Screen reader testing
- Focus indicators on all interactive elements

---

## FINAL EXECUTION INSTRUCTIONS FOR CLAUDE CODE

When implementing this plan:

1. **Start with shadcn/ui setup** - This is the foundation
2. **Customize shadcn components** to match exact specifications
3. **Only add additional libraries** when shadcn doesn't provide the feature
4. **Test each component** immediately after creation
5. **Maintain consistent spacing** using the 8px grid system
6. **Follow the exact color system** with CSS variables
7. **Ensure mobile responsiveness** at every step
8. **Add loading and error states** for all async operations
9. **Implement accessibility** from the start, not as an afterthought
10. **Document component props** with TypeScript interfaces

This plan leverages modern UI libraries to deliver a professional, performant platform in significantly less time than building from scratch, while still meeting every design specification exactly.