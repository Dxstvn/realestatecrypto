/**
 * Blockchain Constants
 * Smart contract and Web3 configuration
 */

export const BLOCKCHAIN = {
  // Supported networks
  NETWORKS: {
    MAINNET: {
      chainId: 1,
      name: 'Ethereum Mainnet',
      rpcUrl: process.env.NEXT_PUBLIC_MAINNET_RPC_URL || '',
      explorerUrl: 'https://etherscan.io',
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
      },
    },
    POLYGON: {
      chainId: 137,
      name: 'Polygon',
      rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC_URL || '',
      explorerUrl: 'https://polygonscan.com',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
    },
    TESTNET: {
      chainId: 11155111, // Sepolia
      name: 'Sepolia Testnet',
      rpcUrl: process.env.NEXT_PUBLIC_TESTNET_RPC_URL || '',
      explorerUrl: 'https://sepolia.etherscan.io',
      nativeCurrency: {
        name: 'SepoliaETH',
        symbol: 'ETH',
        decimals: 18,
      },
    },
  },
  
  // Contract addresses (will be populated per network)
  CONTRACTS: {
    PROPERTY_TOKEN: process.env.NEXT_PUBLIC_PROPERTY_TOKEN_ADDRESS || '',
    MARKETPLACE: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || '',
    GOVERNANCE: process.env.NEXT_PUBLIC_GOVERNANCE_ADDRESS || '',
    TREASURY: process.env.NEXT_PUBLIC_TREASURY_ADDRESS || '',
  },
  
  // Transaction settings
  GAS_BUFFER: 1.2, // 20% buffer on gas estimates
  CONFIRMATION_BLOCKS: 2,
  MAX_GAS_PRICE: 500, // Gwei
  
  // Token standards
  TOKEN_DECIMALS: 18,
  MIN_TOKEN_AMOUNT: '0.001',
  
} as const

export const WALLET_CONNECT_CONFIG = {
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
  metadata: {
    name: 'PropertyChain',
    description: 'Tokenized Real Estate Investment Platform',
    url: 'https://propertychain.com',
    icons: ['/logo.png'],
  },
} as const