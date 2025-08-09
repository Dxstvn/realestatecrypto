/**
 * Crypto Utilities - PropertyChain
 * 
 * Blockchain and cryptocurrency utility functions
 */

/**
 * Format wei to ether
 */
export function formatWei(wei: string | number, decimals: number = 4): string {
  const value = typeof wei === 'string' ? parseInt(wei, 16) : wei
  const ether = value / Math.pow(10, 18)
  return ether.toFixed(decimals)
}

/**
 * Convert ether to wei
 */
export function toWei(ether: number): string {
  return (ether * Math.pow(10, 18)).toString()
}

/**
 * Shorten wallet address for display
 */
export function shortenAddress(address: string, chars: number = 4): string {
  if (!address) return ''
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

/**
 * Format transaction hash for display
 */
export function formatTxHash(hash: string, chars: number = 6): string {
  if (!hash) return ''
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`
}

/**
 * Generate checksum address
 */
export function toChecksumAddress(address: string): string {
  // Simplified checksum - in production use ethers.js
  return address.toLowerCase()
}

/**
 * Validate transaction hash format
 */
export function isValidTxHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash)
}

/**
 * Format blockchain network name
 */
export function formatNetworkName(chainId: number): string {
  const networks: Record<number, string> = {
    1: 'Ethereum Mainnet',
    137: 'Polygon',
    80001: 'Mumbai Testnet',
    5: 'Goerli Testnet',
  }
  return networks[chainId] || `Chain ${chainId}`
}

/**
 * Calculate gas cost
 */
export function calculateGasCost(gasUsed: number, gasPrice: number): string {
  const cost = (gasUsed * gasPrice) / Math.pow(10, 18)
  return cost.toFixed(6)
}