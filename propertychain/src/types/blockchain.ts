/**
 * Blockchain Type Definitions
 * Web3 and smart contract interaction types
 */

import { BigNumber } from 'ethers'

export interface SmartContract {
  address: string
  abi: any[] // Contract ABI
  network: Network
  version: string
}

export interface Network {
  chainId: number
  name: string
  rpcUrl: string
  explorerUrl: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}

export interface TokenMetadata {
  tokenId: BigNumber
  propertyId: string
  owner: string
  price: BigNumber
  totalSupply: BigNumber
  availableSupply: BigNumber
  uri: string
  minted: boolean
  locked: boolean
}

export interface Web3State {
  connected: boolean
  address?: string
  chainId?: number
  balance?: BigNumber
  provider?: any
  signer?: any
}

export interface ContractCall {
  method: string
  args: any[]
  value?: BigNumber
  gasLimit?: BigNumber
  gasPrice?: BigNumber
}

export interface TransactionReceipt {
  transactionHash: string
  blockNumber: number
  blockHash: string
  gasUsed: BigNumber
  status: boolean
  events: TransactionEvent[]
}

export interface TransactionEvent {
  name: string
  args: Record<string, any>
  address: string
  blockNumber: number
}