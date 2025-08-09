# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Real Estate Tokenization Platform - An MVP for tokenizing properties and deploying smart contracts that function as mortgages on the blockchain.

## Core Expertise Areas

### 1. Blockchain & Smart Contract Development
- **Primary Focus**: ERC-721 and ERC-1155 for property tokenization
- **Smart Contract Architecture**: Implement upgradeable contracts using OpenZeppelin's proxy patterns
- **Mortgage Contract Features**:
  - Payment scheduling and amortization calculations
  - Interest rate management (fixed and variable)
  - Escrow functionality for taxes and insurance
  - Automated payment processing via Chainlink Keepers
  - Default and foreclosure mechanisms
  - Fractional ownership support
- **Security Practices**:
  - Always use SafeMath or Solidity 0.8+ built-in overflow protection
  - Implement reentrancy guards on all external functions
  - Follow Checks-Effects-Interactions pattern
  - Use pull payment patterns over push payments
  - Implement comprehensive access control (OpenZeppelin AccessControl)
  - Always audit for front-running vulnerabilities

### 2. Full-Stack Architecture

#### Backend
- **API Design**: RESTful with GraphQL for blockchain data queries
- **Database**: PostgreSQL for property metadata, MongoDB for transaction logs
- **Blockchain Integration**: 
  - Web3.js/Ethers.js for contract interactions
  - Event listeners for real-time updates
  - Transaction queue management with retry logic
- **Authentication**: JWT with Web3 wallet signatures
- **Microservices**:
  - Property Management Service
  - Payment Processing Service
  - KYC/AML Compliance Service
  - Document Storage Service (IPFS integration)

#### Frontend
- **Framework**: Next.js 14+ with TypeScript
- **State Management**: Zustand for app state, Wagmi/Viem for Web3 state
- **Wallet Integration**: RainbowKit or ConnectKit
- **UI Components**: Shadcn/ui with Tailwind CSS
- **Real-time Updates**: WebSocket connections for blockchain events

### 3. Cybersecurity Standards
- **Smart Contract Security**:
  - Implement circuit breakers for emergency stops
  - Use time locks for critical functions
  - Multi-signature wallets for admin functions
  - Regular security audits with tools like Slither, Mythril
- **Application Security**:
  - Input validation and sanitization at all layers
  - Rate limiting and DDoS protection
  - HTTPS everywhere with proper CORS configuration
  - Environment variable management with encryption
  - SQL injection prevention with parameterized queries
  - XSS protection with Content Security Policy
- **Data Protection**:
  - Encrypt sensitive data at rest and in transit
  - GDPR compliance for user data
  - Secure key management with AWS KMS or HashiCorp Vault

### 4. Development Standards

#### Code Quality
- **Testing Requirements**:
  - Unit tests: Minimum 80% coverage
  - Integration tests for all API endpoints
  - Smart contract tests using Hardhat/Foundry
  - E2E tests with Playwright for critical user flows
- **Code Organization**:
  ```
  /contracts         - Solidity smart contracts
  /scripts          - Deployment and management scripts
  /test            - Test files organized by type
  /src
    /api           - API routes and controllers
    /services      - Business logic layer
    /models        - Data models and schemas
    /utils         - Utility functions
    /components    - React components
    /hooks         - Custom React hooks
    /lib           - Third-party integrations
  ```

#### Git Workflow
- Feature branches from `develop`
- Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- PR requirements: Tests pass, security scan, code review

### 5. Prompt Engineering Guidelines

When receiving instructions, optimize them using this framework:

1. **Clarify Objectives**: Transform vague requests into specific, measurable goals
2. **Define Constraints**: Identify technical, security, and business constraints
3. **Structure Tasks**: Break complex requests into atomic, testable components
4. **Specify Output Format**: Define exact expected outputs with examples
5. **Include Context**: Add relevant domain knowledge and dependencies
6. **Set Success Criteria**: Define what "done" looks like with acceptance criteria

Example transformation:
- Original: "Add user authentication"
- Optimized: "Implement JWT-based authentication with Web3 wallet signatures, including: 1) Wallet connection flow with RainbowKit, 2) Message signing for authentication, 3) JWT generation with 24h expiry, 4) Refresh token mechanism, 5) Protected route middleware, 6) User session management in PostgreSQL. Success: Users can connect wallet, sign message, receive JWT, and access protected routes."

### 6. Common Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run test            # Run all tests
npm run test:unit       # Run unit tests only
npm run test:e2e        # Run E2E tests
npm run lint            # ESLint check
npm run typecheck       # TypeScript type checking

# Smart Contracts
npx hardhat compile     # Compile contracts
npx hardhat test        # Test contracts
npx hardhat deploy      # Deploy to network
npx hardhat verify      # Verify on Etherscan

# Database
npm run db:migrate      # Run migrations
npm run db:seed         # Seed database
npm run db:reset        # Reset database
```

### 7. Critical Workflows

#### Property Tokenization Flow
1. Property owner submits documentation
2. KYC/AML verification
3. Property valuation and legal review
4. Smart contract deployment with property metadata
5. NFT minting with fractional ownership options
6. Listing on marketplace

#### Mortgage Contract Deployment
1. Borrower application and credit check
2. Terms negotiation (LTV, interest rate, duration)
3. Smart contract generation with terms
4. Multi-sig approval from lender
5. Funds transfer to escrow
6. Automated payment scheduling activation

### 8. Performance Optimization
- Implement caching with Redis for blockchain data
- Use CDN for static assets
- Optimize smart contract gas usage
- Implement pagination for large datasets
- Use database indexing strategically
- Lazy load components and code splitting

### 9. Compliance & Legal
- Implement KYC/AML procedures
- Ensure SEC compliance for security tokens
- GDPR/CCPA compliance for data handling
- Smart contract audit trail for regulatory review
- Implement proper disclosures and terms of service

### 10. Monitoring & Logging
- Structured logging with Winston/Pino
- APM with DataDog or New Relic
- Smart contract event monitoring
- Error tracking with Sentry
- Performance monitoring for API endpoints
- Blockchain transaction monitoring dashboard

## Key Principles
1. **Security First**: Every feature must be threat-modeled before implementation
2. **Test-Driven Development**: Write tests before implementation
3. **Clean Architecture**: Maintain separation of concerns and dependency injection
4. **Documentation**: Document all APIs, smart contracts, and complex business logic
5. **Gas Optimization**: Always optimize for minimal gas consumption in smart contracts
6. **User Experience**: Prioritize clear error messages and loading states
7. **Scalability**: Design for 10x current load from day one

## Technology Stack
- **Blockchain**: Ethereum/Polygon/Arbitrum
- **Smart Contracts**: Solidity 0.8+, Hardhat/Foundry
- **Backend**: Node.js, Express/Fastify, TypeScript
- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Database**: PostgreSQL, Redis, MongoDB, Supabase, Firebase, NoSQL
- **Infrastructure**: Docker, Kubernetes, AWS/GCP
- **Testing**: Jest, Mocha, Chai, Playwright
- **CI/CD**: GitHub Actions, Docker Hub
- **Monitoring**: DataDog, Grafana, Prometheus

## Development Workflow Guidelines
- Review and follow all applicable rules/requirements/principles/context specified in sections 0.1 through 10.11 before phased steps, the Critical Implementation notes, and final execution instructions for Claude Code of UpdatedUIPlan.md before, during, and after completing a step of its plan

## Memories
- Update UpdatedUIPlan.md plan on status updates after executing its steps
