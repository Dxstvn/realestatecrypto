/**
 * Route Constants
 * Application routing configuration
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  PROPERTIES: '/properties',
  PROPERTY_DETAIL: '/properties/:id',
  EXPLORE: '/properties/explore',
  COMPARE: '/properties/compare',
  ABOUT: '/about',
  HOW_IT_WORKS: '/how-it-works',
  CONTACT: '/contact',
  
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY: '/verify',
  
  // Dashboard routes
  INVESTOR_DASHBOARD: '/dashboard/investor',
  ADMIN_DASHBOARD: '/dashboard/admin',
  PORTFOLIO: '/dashboard/investor/portfolio',
  TRANSACTIONS: '/dashboard/investor/transactions',
  SETTINGS: '/dashboard/settings',
  
  // Admin specific
  ADMIN_PROPERTIES: '/dashboard/admin/properties',
  ADMIN_USERS: '/dashboard/admin/users',
  ADMIN_ANALYTICS: '/dashboard/admin/analytics',
  ADMIN_SETTINGS: '/dashboard/admin/settings',
} as const

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.PROPERTIES,
  ROUTES.EXPLORE,
  ROUTES.ABOUT,
  ROUTES.HOW_IT_WORKS,
  ROUTES.CONTACT,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
]

export const PROTECTED_ROUTES = [
  ROUTES.INVESTOR_DASHBOARD,
  ROUTES.PORTFOLIO,
  ROUTES.TRANSACTIONS,
  ROUTES.SETTINGS,
]

export const ADMIN_ROUTES = [
  ROUTES.ADMIN_DASHBOARD,
  ROUTES.ADMIN_PROPERTIES,
  ROUTES.ADMIN_USERS,
  ROUTES.ADMIN_ANALYTICS,
  ROUTES.ADMIN_SETTINGS,
]