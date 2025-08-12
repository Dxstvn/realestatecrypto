/**
 * Error Messages Library - PropertyLend
 * Phase 4.2: Content Improvements
 * 
 * User-friendly, actionable error messages
 */

export interface ErrorMessage {
  code: string
  title: string
  message: string
  action?: string
  technical?: string
}

// Error message categories
export const ERROR_MESSAGES: Record<string, ErrorMessage> = {
  // Wallet & Connection Errors
  WALLET_NOT_CONNECTED: {
    code: 'WALLET_NOT_CONNECTED',
    title: 'Wallet Not Connected',
    message: 'Please connect your wallet to continue',
    action: 'Click the "Connect Wallet" button in the navigation bar',
  },
  WALLET_WRONG_NETWORK: {
    code: 'WALLET_WRONG_NETWORK',
    title: 'Wrong Network',
    message: 'Please switch to a supported network',
    action: 'We support Ethereum, Polygon, and Arbitrum. Click here to switch automatically',
  },
  WALLET_CONNECTION_FAILED: {
    code: 'WALLET_CONNECTION_FAILED',
    title: 'Connection Failed',
    message: 'Unable to connect to your wallet',
    action: 'Please ensure your wallet is unlocked and try again',
    technical: 'Check browser console for detailed error',
  },
  WALLET_SIGNATURE_REJECTED: {
    code: 'WALLET_SIGNATURE_REJECTED',
    title: 'Signature Rejected',
    message: 'You need to sign the message to proceed',
    action: 'This signature verifies your wallet ownership and doesn\'t cost any gas',
  },
  
  // Transaction Errors
  INSUFFICIENT_BALANCE: {
    code: 'INSUFFICIENT_BALANCE',
    title: 'Insufficient Balance',
    message: 'You don\'t have enough funds for this transaction',
    action: 'Please add more funds to your wallet or reduce the amount',
  },
  INSUFFICIENT_GAS: {
    code: 'INSUFFICIENT_GAS',
    title: 'Insufficient Gas',
    message: 'You need more ETH/MATIC for gas fees',
    action: 'Add a small amount of native token to cover transaction fees',
  },
  TRANSACTION_FAILED: {
    code: 'TRANSACTION_FAILED',
    title: 'Transaction Failed',
    message: 'Your transaction could not be completed',
    action: 'Please try again. If the problem persists, contact support',
    technical: 'Transaction reverted. Check block explorer for details',
  },
  TRANSACTION_REJECTED: {
    code: 'TRANSACTION_REJECTED',
    title: 'Transaction Rejected',
    message: 'You cancelled the transaction',
    action: 'Click "Try Again" to submit a new transaction',
  },
  TRANSACTION_TIMEOUT: {
    code: 'TRANSACTION_TIMEOUT',
    title: 'Transaction Timeout',
    message: 'Transaction is taking longer than expected',
    action: 'Your transaction may still complete. Check your wallet for status',
  },
  SLIPPAGE_TOO_HIGH: {
    code: 'SLIPPAGE_TOO_HIGH',
    title: 'Price Impact Too High',
    message: 'This transaction would result in significant value loss',
    action: 'Try a smaller amount or wait for better market conditions',
  },
  
  // Pool & Investment Errors
  POOL_NOT_FOUND: {
    code: 'POOL_NOT_FOUND',
    title: 'Pool Not Found',
    message: 'The lending pool you\'re looking for doesn\'t exist',
    action: 'Return to pools page to see available options',
  },
  POOL_CLOSED: {
    code: 'POOL_CLOSED',
    title: 'Pool Closed',
    message: 'This pool is no longer accepting deposits',
    action: 'Browse other active pools for investment opportunities',
  },
  POOL_FULL: {
    code: 'POOL_FULL',
    title: 'Pool Fully Funded',
    message: 'This pool has reached its funding target',
    action: 'Join the waitlist or explore other available pools',
  },
  MINIMUM_INVESTMENT: {
    code: 'MINIMUM_INVESTMENT',
    title: 'Below Minimum Investment',
    message: 'The minimum investment for this pool is $100',
    action: 'Please increase your investment amount',
  },
  MAXIMUM_INVESTMENT: {
    code: 'MAXIMUM_INVESTMENT',
    title: 'Exceeds Maximum Investment',
    message: 'This amount exceeds the pool\'s individual investment limit',
    action: 'Please reduce your investment amount or split across multiple pools',
  },
  WITHDRAWAL_LOCKED: {
    code: 'WITHDRAWAL_LOCKED',
    title: 'Withdrawals Locked',
    message: 'Funds cannot be withdrawn during the active loan period',
    action: 'Withdrawals will be available when the loan matures',
  },
  
  // Validation Errors
  INVALID_ADDRESS: {
    code: 'INVALID_ADDRESS',
    title: 'Invalid Address',
    message: 'The wallet address you entered is not valid',
    action: 'Please check the address and try again',
  },
  INVALID_AMOUNT: {
    code: 'INVALID_AMOUNT',
    title: 'Invalid Amount',
    message: 'Please enter a valid amount',
    action: 'Amount must be a positive number',
  },
  INVALID_EMAIL: {
    code: 'INVALID_EMAIL',
    title: 'Invalid Email',
    message: 'Please enter a valid email address',
    action: 'Example: user@example.com',
  },
  REQUIRED_FIELD: {
    code: 'REQUIRED_FIELD',
    title: 'Required Field',
    message: 'This field is required',
    action: 'Please fill in all required fields',
  },
  
  // Authentication & Authorization
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    title: 'Unauthorized Access',
    message: 'You don\'t have permission to access this resource',
    action: 'Please sign in or contact support if you believe this is an error',
  },
  SESSION_EXPIRED: {
    code: 'SESSION_EXPIRED',
    title: 'Session Expired',
    message: 'Your session has expired for security reasons',
    action: 'Please reconnect your wallet to continue',
  },
  KYC_REQUIRED: {
    code: 'KYC_REQUIRED',
    title: 'Verification Required',
    message: 'This action requires identity verification',
    action: 'Complete KYC verification to continue. It only takes 5 minutes',
  },
  KYC_PENDING: {
    code: 'KYC_PENDING',
    title: 'Verification Pending',
    message: 'Your identity verification is being processed',
    action: 'We\'ll notify you once verification is complete (usually within 24 hours)',
  },
  KYC_REJECTED: {
    code: 'KYC_REJECTED',
    title: 'Verification Failed',
    message: 'We couldn\'t verify your identity',
    action: 'Please contact support for assistance',
  },
  
  // API & Network Errors
  NETWORK_ERROR: {
    code: 'NETWORK_ERROR',
    title: 'Network Error',
    message: 'Unable to connect to our servers',
    action: 'Please check your internet connection and try again',
  },
  API_ERROR: {
    code: 'API_ERROR',
    title: 'Service Unavailable',
    message: 'Our service is temporarily unavailable',
    action: 'Please try again in a few moments',
  },
  RATE_LIMITED: {
    code: 'RATE_LIMITED',
    title: 'Too Many Requests',
    message: 'You\'ve made too many requests',
    action: 'Please wait a moment before trying again',
  },
  BLOCKCHAIN_CONGESTED: {
    code: 'BLOCKCHAIN_CONGESTED',
    title: 'Network Congested',
    message: 'The blockchain network is congested',
    action: 'Consider increasing gas fees or try again later',
  },
  
  // Data Errors
  DATA_NOT_FOUND: {
    code: 'DATA_NOT_FOUND',
    title: 'Data Not Found',
    message: 'The requested information could not be found',
    action: 'Please refresh the page or try again later',
  },
  DATA_LOADING_ERROR: {
    code: 'DATA_LOADING_ERROR',
    title: 'Loading Error',
    message: 'Failed to load data',
    action: 'Please refresh the page to try again',
  },
  SYNC_ERROR: {
    code: 'SYNC_ERROR',
    title: 'Sync Error',
    message: 'Data synchronization failed',
    action: 'We\'re having trouble syncing with the blockchain. Please refresh',
  },
  
  // Smart Contract Errors
  CONTRACT_PAUSED: {
    code: 'CONTRACT_PAUSED',
    title: 'Contract Paused',
    message: 'This contract is temporarily paused for maintenance',
    action: 'Please check our status page for updates',
  },
  CONTRACT_ERROR: {
    code: 'CONTRACT_ERROR',
    title: 'Contract Error',
    message: 'Smart contract execution failed',
    action: 'Please try again or contact support',
    technical: 'Contract reverted. Check transaction for revert reason',
  },
  
  // Generic Errors
  UNKNOWN_ERROR: {
    code: 'UNKNOWN_ERROR',
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred',
    action: 'Please try again. If the problem persists, contact support',
  },
  COMING_SOON: {
    code: 'COMING_SOON',
    title: 'Coming Soon',
    message: 'This feature is not yet available',
    action: 'We\'re working hard to bring you this feature. Stay tuned!',
  },
  MAINTENANCE: {
    code: 'MAINTENANCE',
    title: 'Under Maintenance',
    message: 'We\'re performing scheduled maintenance',
    action: 'We\'ll be back shortly. Thank you for your patience',
  },
}

// Helper function to get error by code
export function getErrorMessage(code: string): ErrorMessage {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES.UNKNOWN_ERROR
}

// Format error for display
export function formatError(error: any): ErrorMessage {
  // Check if it's already a formatted error
  if (error?.code && ERROR_MESSAGES[error.code]) {
    return ERROR_MESSAGES[error.code]
  }
  
  // Check for common error patterns
  if (error?.message) {
    const message = error.message.toLowerCase()
    
    if (message.includes('insufficient funds') || message.includes('insufficient balance')) {
      return ERROR_MESSAGES.INSUFFICIENT_BALANCE
    }
    if (message.includes('user rejected') || message.includes('user denied')) {
      return ERROR_MESSAGES.TRANSACTION_REJECTED
    }
    if (message.includes('network') || message.includes('connection')) {
      return ERROR_MESSAGES.NETWORK_ERROR
    }
    if (message.includes('gas')) {
      return ERROR_MESSAGES.INSUFFICIENT_GAS
    }
  }
  
  // Return generic error
  return ERROR_MESSAGES.UNKNOWN_ERROR
}

// Success messages for positive feedback
export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: 'Wallet connected successfully',
  TRANSACTION_SUBMITTED: 'Transaction submitted. Check your wallet for confirmation',
  TRANSACTION_CONFIRMED: 'Transaction confirmed successfully',
  DEPOSIT_SUCCESSFUL: 'Deposit successful! You\'re now earning yield',
  WITHDRAWAL_SUCCESSFUL: 'Withdrawal completed successfully',
  PROFILE_UPDATED: 'Your profile has been updated',
  KYC_SUBMITTED: 'Verification documents submitted successfully',
  COPIED_TO_CLIPBOARD: 'Copied to clipboard',
  EMAIL_SENT: 'Email sent successfully',
  SETTINGS_SAVED: 'Settings saved successfully',
}

// Warning messages for caution
export const WARNING_MESSAGES = {
  HIGH_GAS_FEES: 'Gas fees are currently high. Consider waiting for lower fees',
  LOW_LIQUIDITY: 'Low liquidity may result in higher slippage',
  UNAUDITED_POOL: 'This pool has not been audited. Invest at your own risk',
  BETA_FEATURE: 'This is a beta feature and may contain bugs',
  EXTERNAL_LINK: 'You are leaving PropertyLend. We are not responsible for external content',
  IMPERMANENT_LOSS: 'You may experience impermanent loss in volatile market conditions',
  WITHDRAWAL_FEE: 'Early withdrawal may incur penalties',
  TEST_NETWORK: 'You are on a test network. No real funds are at risk',
}