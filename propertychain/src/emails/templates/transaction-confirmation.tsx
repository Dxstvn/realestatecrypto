/**
 * Transaction Confirmation Email Templates - PropertyChain
 * 
 * Email templates for various transaction types
 * Following UpdatedUIPlan.md Step 63 specifications and CLAUDE.md principles
 */

import * as React from 'react'
import { Text, Hr, Link, Section, Row, Column } from '@react-email/components'
import { BaseEmailTemplate, Button, TransactionRow, Alert } from '../components/base-template'

/**
 * Property Purchase Confirmation Email
 */
interface PurchaseConfirmationProps {
  userName: string
  propertyTitle: string
  propertyAddress: string
  transactionId: string
  purchaseAmount: string
  tokenAmount: string
  transactionHash: string
  purchaseDate: string
  propertyUrl: string
  receiptUrl: string
}

export function PurchaseConfirmationEmail({
  userName,
  propertyTitle,
  propertyAddress,
  transactionId,
  purchaseAmount,
  tokenAmount,
  transactionHash,
  purchaseDate,
  propertyUrl,
  receiptUrl,
}: PurchaseConfirmationProps) {
  return (
    <BaseEmailTemplate
      preview={`Your purchase of ${tokenAmount} tokens in ${propertyTitle} has been confirmed`}
      heading="Purchase Confirmed! 🎉"
    >
      <Text className="text-gray-700 mb-4">
        Hi {userName},
      </Text>

      <Text className="text-gray-700 mb-6">
        Great news! Your investment in <strong>{propertyTitle}</strong> has been successfully processed.
        You now own <strong>{tokenAmount} tokens</strong> in this property.
      </Text>

      <Alert type="success">
        <Text className="font-semibold mb-2">Transaction Complete</Text>
        <Text className="text-sm">
          Your transaction has been confirmed on the blockchain and your tokens have been transferred to your wallet.
        </Text>
      </Alert>

      <Section className="bg-gray-50 rounded-lg p-6 mb-6">
        <Text className="font-semibold text-gray-900 mb-4">Transaction Details</Text>
        
        <TransactionRow label="Transaction ID" value={transactionId} />
        <TransactionRow label="Property" value={propertyTitle} />
        <TransactionRow label="Location" value={propertyAddress} />
        <TransactionRow label="Purchase Amount" value={purchaseAmount} highlighted />
        <TransactionRow label="Token Amount" value={tokenAmount} highlighted />
        <TransactionRow label="Date" value={purchaseDate} />
        
        <Hr className="my-4" />
        
        <Text className="text-xs text-gray-600">
          Blockchain Transaction:{' '}
          <Link
            href={`https://etherscan.io/tx/${transactionHash}`}
            className="text-brand-primary hover:underline"
          >
            {transactionHash.substring(0, 10)}...{transactionHash.substring(transactionHash.length - 8)}
          </Link>
        </Text>
      </Section>

      <div className="text-center mb-6">
        <Button href={propertyUrl} variant="primary">
          View Property Details
        </Button>
        <Text className="text-sm text-gray-600 mt-4">
          or{' '}
          <Link href={receiptUrl} className="text-brand-primary hover:underline">
            Download Receipt
          </Link>
        </Text>
      </div>

      <Section className="border-t pt-6">
        <Text className="text-sm text-gray-600">
          <strong>What's Next?</strong>
        </Text>
        <ul className="text-sm text-gray-600 mt-2 space-y-1">
          <li>• Monitor your investment performance in your dashboard</li>
          <li>• Receive rental income distributions monthly</li>
          <li>• Vote on property decisions as a token holder</li>
          <li>• Trade your tokens on our marketplace anytime</li>
        </ul>
      </Section>
    </BaseEmailTemplate>
  )
}

/**
 * Token Sale Confirmation Email
 */
interface SaleConfirmationProps {
  userName: string
  propertyTitle: string
  transactionId: string
  saleAmount: string
  tokenAmount: string
  buyerAddress: string
  saleDate: string
  transactionHash: string
  dashboardUrl: string
}

export function SaleConfirmationEmail({
  userName,
  propertyTitle,
  transactionId,
  saleAmount,
  tokenAmount,
  buyerAddress,
  saleDate,
  transactionHash,
  dashboardUrl,
}: SaleConfirmationProps) {
  return (
    <BaseEmailTemplate
      preview={`You've successfully sold ${tokenAmount} tokens in ${propertyTitle}`}
      heading="Sale Completed Successfully"
    >
      <Text className="text-gray-700 mb-4">
        Hi {userName},
      </Text>

      <Text className="text-gray-700 mb-6">
        Your sale of <strong>{tokenAmount} tokens</strong> in <strong>{propertyTitle}</strong> has been completed.
        The proceeds have been transferred to your account.
      </Text>

      <Section className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <Text className="font-semibold text-green-900 mb-4">Sale Summary</Text>
        
        <TransactionRow label="Transaction ID" value={transactionId} />
        <TransactionRow label="Property" value={propertyTitle} />
        <TransactionRow label="Tokens Sold" value={tokenAmount} />
        <TransactionRow label="Sale Amount" value={saleAmount} highlighted />
        <TransactionRow label="Buyer" value={`${buyerAddress.substring(0, 6)}...${buyerAddress.substring(38)}`} />
        <TransactionRow label="Completion Date" value={saleDate} />
      </Section>

      <div className="text-center mb-6">
        <Button href={dashboardUrl} variant="primary">
          View Transaction History
        </Button>
      </div>

      <Text className="text-xs text-gray-600 text-center">
        Transaction Hash:{' '}
        <Link
          href={`https://etherscan.io/tx/${transactionHash}`}
          className="text-brand-primary hover:underline"
        >
          {transactionHash}
        </Link>
      </Text>
    </BaseEmailTemplate>
  )
}

/**
 * Rental Distribution Email
 */
interface RentalDistributionProps {
  userName: string
  distributionPeriod: string
  properties: Array<{
    title: string
    tokens: string
    distribution: string
  }>
  totalDistribution: string
  paymentMethod: string
  paymentDate: string
  nextDistributionDate: string
  statementUrl: string
}

export function RentalDistributionEmail({
  userName,
  distributionPeriod,
  properties,
  totalDistribution,
  paymentMethod,
  paymentDate,
  nextDistributionDate,
  statementUrl,
}: RentalDistributionProps) {
  return (
    <BaseEmailTemplate
      preview={`Your rental income distribution of ${totalDistribution} is ready`}
      heading="Rental Income Distribution 💰"
    >
      <Text className="text-gray-700 mb-4">
        Hi {userName},
      </Text>

      <Text className="text-gray-700 mb-6">
        Your rental income for <strong>{distributionPeriod}</strong> has been calculated and is ready for distribution.
      </Text>

      <Alert type="success">
        <Text className="font-semibold">
          Total Distribution: {totalDistribution}
        </Text>
      </Alert>

      <Section className="mb-6">
        <Text className="font-semibold text-gray-900 mb-4">Distribution Breakdown</Text>
        
        {properties.map((property, index) => (
          <div key={index} className="border-b border-gray-200 pb-3 mb-3">
            <Text className="font-medium text-gray-900">{property.title}</Text>
            <div className="flex justify-between mt-1">
              <Text className="text-sm text-gray-600">Tokens: {property.tokens}</Text>
              <Text className="text-sm font-semibold text-green-600">{property.distribution}</Text>
            </div>
          </div>
        ))}

        <div className="bg-gray-50 rounded-lg p-4 mt-4">
          <TransactionRow label="Total Distribution" value={totalDistribution} highlighted />
          <TransactionRow label="Payment Method" value={paymentMethod} />
          <TransactionRow label="Payment Date" value={paymentDate} />
          <TransactionRow label="Next Distribution" value={nextDistributionDate} />
        </div>
      </Section>

      <div className="text-center mb-6">
        <Button href={statementUrl} variant="primary">
          View Full Statement
        </Button>
      </div>

      <Text className="text-xs text-gray-600 text-center">
        Distributions are processed monthly based on your token holdings and property performance.
      </Text>
    </BaseEmailTemplate>
  )
}

/**
 * Failed Transaction Email
 */
interface FailedTransactionProps {
  userName: string
  transactionType: 'purchase' | 'sale' | 'transfer'
  propertyTitle: string
  reason: string
  transactionId: string
  attemptDate: string
  supportUrl: string
  retryUrl: string
}

export function FailedTransactionEmail({
  userName,
  transactionType,
  propertyTitle,
  reason,
  transactionId,
  attemptDate,
  supportUrl,
  retryUrl,
}: FailedTransactionProps) {
  const typeText = {
    purchase: 'purchase',
    sale: 'sale',
    transfer: 'transfer',
  }

  return (
    <BaseEmailTemplate
      preview={`Your ${typeText[transactionType]} transaction could not be completed`}
      heading="Transaction Could Not Be Completed"
    >
      <Text className="text-gray-700 mb-4">
        Hi {userName},
      </Text>

      <Text className="text-gray-700 mb-6">
        Unfortunately, your {typeText[transactionType]} transaction for <strong>{propertyTitle}</strong> could not be completed.
      </Text>

      <Alert type="error">
        <Text className="font-semibold mb-2">Transaction Failed</Text>
        <Text className="text-sm">{reason}</Text>
      </Alert>

      <Section className="bg-gray-50 rounded-lg p-6 mb-6">
        <Text className="font-semibold text-gray-900 mb-4">Transaction Details</Text>
        
        <TransactionRow label="Transaction ID" value={transactionId} />
        <TransactionRow label="Type" value={typeText[transactionType]} />
        <TransactionRow label="Property" value={propertyTitle} />
        <TransactionRow label="Attempt Date" value={attemptDate} />
        <TransactionRow label="Status" value="Failed" />
      </Section>

      <Text className="text-gray-700 mb-4">
        <strong>What you can do:</strong>
      </Text>
      
      <ul className="text-sm text-gray-600 mb-6 space-y-2">
        <li>• Check your wallet balance and ensure sufficient funds</li>
        <li>• Verify your wallet is connected properly</li>
        <li>• Try the transaction again with higher gas fees</li>
        <li>• Contact support if the issue persists</li>
      </ul>

      <div className="text-center space-y-3">
        <Button href={retryUrl} variant="primary">
          Retry Transaction
        </Button>
        <br />
        <Link href={supportUrl} className="text-sm text-brand-primary hover:underline">
          Contact Support
        </Link>
      </div>
    </BaseEmailTemplate>
  )
}

/**
 * Escrow Notification Email
 */
interface EscrowNotificationProps {
  userName: string
  propertyTitle: string
  escrowAmount: string
  escrowStatus: 'initiated' | 'funded' | 'released' | 'cancelled'
  escrowId: string
  counterparty: string
  expectedClosing: string
  detailsUrl: string
}

export function EscrowNotificationEmail({
  userName,
  propertyTitle,
  escrowAmount,
  escrowStatus,
  escrowId,
  counterparty,
  expectedClosing,
  detailsUrl,
}: EscrowNotificationProps) {
  const statusMessages = {
    initiated: 'An escrow account has been created for your transaction',
    funded: 'The escrow account has been funded and is ready for closing',
    released: 'Escrow funds have been successfully released',
    cancelled: 'The escrow transaction has been cancelled',
  }

  const statusColors = {
    initiated: 'info',
    funded: 'success',
    released: 'success',
    cancelled: 'warning',
  } as const

  return (
    <BaseEmailTemplate
      preview={`Escrow update for ${propertyTitle}`}
      heading="Escrow Account Update"
    >
      <Text className="text-gray-700 mb-4">
        Hi {userName},
      </Text>

      <Text className="text-gray-700 mb-6">
        {statusMessages[escrowStatus]} for <strong>{propertyTitle}</strong>.
      </Text>

      <Alert type={statusColors[escrowStatus]}>
        <Text className="font-semibold">
          Escrow Status: {escrowStatus.charAt(0).toUpperCase() + escrowStatus.slice(1)}
        </Text>
      </Alert>

      <Section className="bg-gray-50 rounded-lg p-6 mb-6">
        <Text className="font-semibold text-gray-900 mb-4">Escrow Details</Text>
        
        <TransactionRow label="Escrow ID" value={escrowId} />
        <TransactionRow label="Property" value={propertyTitle} />
        <TransactionRow label="Amount" value={escrowAmount} highlighted />
        <TransactionRow label="Counterparty" value={counterparty} />
        <TransactionRow label="Expected Closing" value={expectedClosing} />
        <TransactionRow label="Current Status" value={escrowStatus} />
      </Section>

      <div className="text-center mb-6">
        <Button href={detailsUrl} variant="primary">
          View Escrow Details
        </Button>
      </div>

      <Text className="text-xs text-gray-600 text-center">
        All escrow transactions are secured by smart contracts and require multi-party approval.
      </Text>
    </BaseEmailTemplate>
  )
}