/**
 * Web3 Provider - PropertyChain
 * 
 * Blockchain connectivity and wallet management
 * Supports multiple wallets with PropertyChain token integration
 */

'use client'

import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { Web3State } from '@/types'
import { BLOCKCHAIN } from '@/lib/constants/blockchain'

interface Web3ContextType extends Web3State {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  switchNetwork: (chainId: number) => Promise<void>
  isConnecting: boolean
  error: string | null
}

const Web3Context = createContext<Web3ContextType | null>(null)

interface Web3ProviderProps {
  children: ReactNode
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [state, setState] = useState<Web3State>({
    connected: false,
    address: undefined,
    chainId: undefined,
    balance: undefined,
    provider: undefined,
    signer: undefined,
  })
  
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize Web3 connection on mount
  useEffect(() => {
    initializeWeb3()
  }, [])

  const initializeWeb3 = async (): Promise<void> => {
    try {
      // Check if wallet was previously connected
      const lastConnected = localStorage.getItem('web3-wallet-connected')
      if (lastConnected === 'true' && window.ethereum) {
        await connect()
      }
    } catch (error) {
      console.error('Web3 initialization failed:', error)
    }
  }

  const connect = async (): Promise<void> => {
    try {
      setIsConnecting(true)
      setError(null)

      if (!window.ethereum) {
        throw new Error('No Web3 wallet detected. Please install MetaMask or another Web3 wallet.')
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please make sure your wallet is unlocked.')
      }

      // Get network info
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      })

      // Get balance
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest'],
      })

      setState({
        connected: true,
        address: accounts[0],
        chainId: parseInt(chainId, 16),
        balance,
        provider: window.ethereum,
        signer: window.ethereum,
      })

      // Store connection state
      localStorage.setItem('web3-wallet-connected', 'true')

      // Setup event listeners
      setupEventListeners()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect wallet'
      setError(message)
      throw error
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = async (): Promise<void> => {
    try {
      setState({
        connected: false,
        address: undefined,
        chainId: undefined,
        balance: undefined,
        provider: undefined,
        signer: undefined,
      })

      localStorage.removeItem('web3-wallet-connected')
      removeEventListeners()
      setError(null)
    } catch (error) {
      console.error('Disconnect failed:', error)
    }
  }

  const switchNetwork = async (chainId: number): Promise<void> => {
    try {
      if (!window.ethereum) {
        throw new Error('No Web3 wallet detected')
      }

      const chainIdHex = `0x${chainId.toString(16)}`

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      })
    } catch (error: unknown) {
      // If network doesn't exist, try to add it
      if (error && typeof error === 'object' && 'code' in error && error.code === 4902) {
        const networkConfig = getNetworkConfig(chainId)
        if (networkConfig) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networkConfig],
          })
        }
      }
      throw error
    }
  }

  const setupEventListeners = (): void => {
    if (!window.ethereum) return

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)
    window.ethereum.on('disconnect', handleDisconnect)
  }

  const removeEventListeners = (): void => {
    if (!window.ethereum) return

    window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
    window.ethereum.removeListener('chainChanged', handleChainChanged)
    window.ethereum.removeListener('disconnect', handleDisconnect)
  }

  const handleAccountsChanged = (accounts: string[]): void => {
    if (accounts.length === 0) {
      disconnect()
    } else {
      setState(prev => ({
        ...prev,
        address: accounts[0],
      }))
    }
  }

  const handleChainChanged = (chainId: string): void => {
    setState(prev => ({
      ...prev,
      chainId: parseInt(chainId, 16),
    }))
    
    // Reload page to reset application state
    window.location.reload()
  }

  const handleDisconnect = (): void => {
    disconnect()
  }

  const getNetworkConfig = (chainId: number) => {
    const networks = BLOCKCHAIN.NETWORKS
    
    switch (chainId) {
      case networks.POLYGON.chainId:
        return {
          chainId: `0x${networks.POLYGON.chainId.toString(16)}`,
          chainName: networks.POLYGON.name,
          nativeCurrency: networks.POLYGON.nativeCurrency,
          rpcUrls: [networks.POLYGON.rpcUrl],
          blockExplorerUrls: [networks.POLYGON.explorerUrl],
        }
      default:
        return null
    }
  }

  const contextValue: Web3ContextType = {
    ...state,
    connect,
    disconnect,
    switchNetwork,
    isConnecting,
    error,
  }

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3Context() {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error('useWeb3Context must be used within Web3Provider')
  }
  return context
}

// Global type declaration for ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      on: (event: string, handler: (args: unknown) => void) => void
      removeListener: (event: string, handler: (args: unknown) => void) => void
    }
  }
}