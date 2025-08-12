/**
 * Real Content Library - PropertyLend
 * Phase 4.2: Content Improvements
 * 
 * Replace all placeholder text with meaningful, real content
 */

// Company Information
export const COMPANY_INFO = {
  name: 'PropertyLend',
  tagline: 'DeFi Bridge Lending Platform',
  description: 'Connecting stablecoin holders with real estate borrowers through transparent, secure blockchain technology',
  mission: 'To democratize real estate financing by bridging traditional property investment with decentralized finance, making high-yield, asset-backed investments accessible to everyone.',
  vision: 'To become the leading DeFi platform for real estate bridge lending, transforming how property development is funded globally.',
  founded: '2024',
  headquarters: 'Singapore',
  email: 'hello@propertylend.io',
  support: 'support@propertylend.io',
  twitter: '@propertylend',
  telegram: 't.me/propertylend',
  discord: 'discord.gg/propertylend',
}

// Hero Section Content
export const HERO_CONTENT = {
  title: 'Earn Up to 30% APY with Real Estate-Backed DeFi',
  subtitle: 'Bridge the gap between stablecoin yields and property investment through secure, transparent lending pools',
  primaryCTA: 'Start Earning',
  secondaryCTA: 'Learn How It Works',
  stats: [
    { label: 'Total Value Locked', value: '$125M+' },
    { label: 'Average APY', value: '14.75%' },
    { label: 'Active Pools', value: '42' },
    { label: 'Default Rate', value: '0.02%' },
  ],
}

// Product Descriptions
export const PRODUCTS = {
  seniorTranche: {
    title: 'Senior Tranches',
    subtitle: 'Stable Returns with Priority Protection',
    description: 'Senior tranches offer predictable, fixed returns with first-priority payment protection. Perfect for conservative investors seeking stable yields above traditional DeFi rates.',
    features: [
      'Fixed 8% APY guaranteed returns',
      'First priority on all loan repayments',
      'Protected against first 20% of losses',
      'Quarterly interest distributions',
      'No lock-up period after initial term',
    ],
    benefits: [
      'Predictable income stream',
      'Lower risk profile',
      'Institutional-grade security',
      'Automated yield distribution',
    ],
    idealFor: 'Risk-averse investors, treasury management, stable yield seekers',
  },
  juniorTranche: {
    title: 'Junior Tranches',
    subtitle: 'Higher Yields for Risk-Tolerant Investors',
    description: 'Junior tranches capture excess returns after senior obligations, offering variable yields between 20-30% APY for investors comfortable with subordinated positions.',
    features: [
      'Variable 20-30% APY potential',
      'Subordinated payment position',
      'Exposure to upside performance',
      'Monthly interest distributions',
      'Enhanced yield opportunities',
    ],
    benefits: [
      'Significantly higher returns',
      'Leveraged upside potential',
      'Portfolio diversification',
      'Real estate market exposure',
    ],
    idealFor: 'Yield maximizers, experienced DeFi users, diversified portfolios',
  },
}

// How It Works Content
export const HOW_IT_WORKS = {
  forLenders: {
    title: 'How It Works for Lenders',
    steps: [
      {
        title: 'Connect Your Wallet',
        description: 'Link your Web3 wallet containing USDC, USDT, or DAI stablecoins to the PropertyLend platform.',
      },
      {
        title: 'Choose Your Risk Level',
        description: 'Select between Senior Tranches (8% fixed APY) or Junior Tranches (20-30% variable APY) based on your risk tolerance.',
      },
      {
        title: 'Deposit Stablecoins',
        description: 'Deposit your stablecoins into chosen lending pools. Smart contracts automatically manage your investment.',
      },
      {
        title: 'Earn Passive Income',
        description: 'Receive automated interest payments monthly or quarterly. Withdraw your principal after the loan term completes.',
      },
    ],
  },
  forBorrowers: {
    title: 'How It Works for Borrowers',
    steps: [
      {
        title: 'Submit Application',
        description: 'Provide property details, development plans, and financial projections through our streamlined application process.',
      },
      {
        title: 'Property Evaluation',
        description: 'Our team conducts due diligence including property appraisal, title verification, and financial assessment.',
      },
      {
        title: 'Pool Creation',
        description: 'Upon approval, we create a lending pool with terms tailored to your project needs and timeline.',
      },
      {
        title: 'Receive Funding',
        description: 'Once the pool reaches its target, funds are disbursed directly to your wallet for immediate use.',
      },
    ],
  },
}

// Features Content
export const FEATURES = {
  security: {
    title: 'Bank-Grade Security',
    description: 'Multi-signature wallets, audited smart contracts, and comprehensive insurance coverage protect your investments.',
    details: [
      'Smart contracts audited by CertiK and OpenZeppelin',
      'Multi-signature treasury management',
      'Real-time on-chain transparency',
      'Comprehensive insurance coverage up to $10M',
    ],
  },
  transparency: {
    title: 'Complete Transparency',
    description: 'Every transaction, loan detail, and platform metric is visible on-chain for full accountability.',
    details: [
      'All transactions recorded on blockchain',
      'Real-time pool performance tracking',
      'Publicly verifiable collateral values',
      'Open-source smart contracts',
    ],
  },
  liquidity: {
    title: 'Flexible Liquidity',
    description: 'No lock-up periods after initial terms, with secondary market for position trading coming soon.',
    details: [
      'Withdraw anytime after loan term',
      'Secondary market for LP tokens (coming Q2 2024)',
      'Instant deposits and withdrawals',
      'Multiple stablecoin support',
    ],
  },
  yields: {
    title: 'Superior Yields',
    description: 'Earn 8-30% APY backed by real estate collateral, significantly outperforming traditional DeFi protocols.',
    details: [
      'Fixed 8% APY for senior tranches',
      '20-30% APY for junior tranches',
      'Automated compound options',
      'No hidden fees or charges',
    ],
  },
}

// Risk Disclosure
export const RISK_DISCLOSURE = {
  title: 'Risk Disclosure',
  introduction: 'While PropertyLend implements multiple safeguards, all investments carry risk. Please review the following:',
  risks: [
    {
      type: 'Credit Risk',
      description: 'Borrowers may default on loans despite collateral protection.',
      mitigation: 'Conservative LTV ratios, thorough due diligence, and diversified pool structure.',
    },
    {
      type: 'Market Risk',
      description: 'Real estate values may decline affecting collateral coverage.',
      mitigation: 'Maximum 70% LTV, regular revaluations, and geographic diversification.',
    },
    {
      type: 'Smart Contract Risk',
      description: 'Technical vulnerabilities could affect platform operations.',
      mitigation: 'Multiple audits, bug bounty program, and emergency pause functionality.',
    },
    {
      type: 'Liquidity Risk',
      description: 'Funds are locked during active loan terms.',
      mitigation: 'Clear term disclosures and upcoming secondary market for LP tokens.',
    },
  ],
}

// FAQ Content
export const FAQ_CONTENT = [
  {
    question: 'What is PropertyLend?',
    answer: 'PropertyLend is a DeFi platform that connects stablecoin holders seeking yield with real estate developers needing bridge financing. We create transparent, blockchain-based lending pools backed by real property collateral.',
  },
  {
    question: 'How are the yields so high?',
    answer: 'Bridge loans in real estate typically command 12-24% interest rates due to their short-term nature and specialized use cases. By cutting out traditional intermediaries and using blockchain efficiency, we can pass most of these returns directly to lenders.',
  },
  {
    question: 'What happens if a borrower defaults?',
    answer: 'All loans are secured by real estate collateral at conservative loan-to-value ratios (typically 70% or less). In case of default, the collateral is liquidated through established legal processes, with proceeds distributed to lenders according to their tranche priority.',
  },
  {
    question: 'What stablecoins are accepted?',
    answer: 'We currently accept USDC, USDT, and DAI on Ethereum, Polygon, and Arbitrum networks. Additional stablecoins and networks are being evaluated for future integration.',
  },
  {
    question: 'What is the minimum investment?',
    answer: 'The minimum investment is $100 USD equivalent in supported stablecoins. There is no maximum limit, though large deposits may be subject to additional KYC requirements.',
  },
  {
    question: 'How often are interest payments made?',
    answer: 'Senior tranche holders receive quarterly distributions, while junior tranche holders receive monthly payments. All distributions are automated through smart contracts.',
  },
  {
    question: 'Are there any fees?',
    answer: 'PropertyLend charges a 2% origination fee on loans and a 0.5% annual management fee on deployed capital. There are no deposit, withdrawal, or hidden fees for lenders.',
  },
  {
    question: 'Is KYC required?',
    answer: 'KYC is not required for investments under $10,000. Larger investments and all borrowers must complete KYC/AML verification to comply with regulations.',
  },
]

// Pool Status Messages
export const POOL_STATUS = {
  open: {
    label: 'Open for Investment',
    description: 'This pool is accepting deposits',
    color: 'green',
  },
  funding: {
    label: 'Funding in Progress',
    description: 'Pool is gathering capital',
    color: 'blue',
  },
  active: {
    label: 'Loan Active',
    description: 'Funds deployed, earning interest',
    color: 'purple',
  },
  matured: {
    label: 'Matured',
    description: 'Loan term complete, withdrawals open',
    color: 'gray',
  },
  closed: {
    label: 'Closed',
    description: 'Pool fully settled and closed',
    color: 'gray',
  },
}

// Property Types
export const PROPERTY_TYPES = {
  residential: {
    label: 'Residential',
    description: 'Single-family homes, condos, and multi-family properties',
    icon: '🏠',
  },
  commercial: {
    label: 'Commercial',
    description: 'Office buildings, retail spaces, and business properties',
    icon: '🏢',
  },
  industrial: {
    label: 'Industrial',
    description: 'Warehouses, factories, and distribution centers',
    icon: '🏭',
  },
  mixed: {
    label: 'Mixed-Use',
    description: 'Properties combining residential and commercial uses',
    icon: '🏙️',
  },
  land: {
    label: 'Land Development',
    description: 'Raw land for development projects',
    icon: '🏗️',
  },
}

// Loan Purposes
export const LOAN_PURPOSES = {
  acquisition: 'Property Acquisition',
  renovation: 'Renovation & Rehabilitation',
  construction: 'New Construction',
  refinance: 'Refinancing Existing Debt',
  working_capital: 'Working Capital for Development',
}

// Geographic Regions
export const REGIONS = {
  north_america: 'North America',
  europe: 'Europe',
  asia_pacific: 'Asia Pacific',
  middle_east: 'Middle East',
  latin_america: 'Latin America',
}

// Export all content
export const CONTENT = {
  company: COMPANY_INFO,
  hero: HERO_CONTENT,
  products: PRODUCTS,
  howItWorks: HOW_IT_WORKS,
  features: FEATURES,
  risks: RISK_DISCLOSURE,
  faq: FAQ_CONTENT,
  poolStatus: POOL_STATUS,
  propertyTypes: PROPERTY_TYPES,
  loanPurposes: LOAN_PURPOSES,
  regions: REGIONS,
}