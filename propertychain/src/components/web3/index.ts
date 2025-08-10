/**
 * Web3 Components Export - PropertyChain
 * 
 * Central export file for all blockchain integration components
 * Following UpdatedUIPlan.md Step 47 specifications and CLAUDE.md principles
 */

// Core Web3 Provider and Context
export {
  Web3Provider,
  useWeb3,
  WalletConnectionModal,
  WalletDisplay,
} from './web3-provider-enhanced'

// Network Management
export {
  NetworkManager,
  NetworkStatusWidget,
} from './network-manager'

// Transaction Monitoring
export {
  TransactionMonitor,
  GasOptimizationWidget,
} from './transaction-monitor'

// Existing Transaction Modal (if needed for compatibility)
export { TransactionModal } from './transaction-modal'

// Existing Wallet Connect (if needed for compatibility)
export { WalletConnect } from './wallet-connect'