# RiskUrUSDC Refactoring Plan

## Goal
Transform RiskUrUSDC (Base-based) into RiskUrUSDC (Base-based) by removing all Base/USDC/Wallet/ references and implementing USDC deposit system.

## Changes Required

### 1. Blockchain Migration (Base → Base)
- [ ] Remove all Base wallet integration code
- [ ] Remove USDC token references
- [ ] Replace with Base blockchain integration
- [ ] Implement USDC (ERC-20) contract interaction
- [ ] Update RPC endpoints to Base network

### 2. Remove Wallet Authentication
- [ ] Remove Wallet SDK dependencies
- [ ] Remove Wallet context/provider
- [ ] Implement wallet-based authentication (MetaMask, WalletConnect)
- [ ] Update auth hooks and utilities

### 3. Deposit & Balance System
- [ ] Create deposit interface for USDC
- [ ] Implement balance tracking in database
- [ ] Update game logic to use internal balance instead of direct wallet
- [ ] Add withdrawal functionality
- [ ] Update bet placement to deduct from balance

### 4. Project Renaming (RiskUrUSDC → RiskUrUSDC)
- [ ] Update all file names
- [ ] Update all variable names
- [ ] Update all text content
- [ ] Update README and documentation
- [ ] Update package.json name

### 5. Remove  References
- [ ] Search and remove all  mentions
- [ ] Remove any  integration code
- [ ] Update tokenomics documentation

### 6. Smart Contract Updates
- [ ] Create/update USDC deposit contract
- [ ] Update $RISK token contract for Base
- [ ] Update staking contract
- [ ] Update fee distribution logic for USDC

### 7. Frontend Updates
- [ ] Update all UI text (Base → Base, USDC → USDC)
- [ ] Update wallet connection components
- [ ] Update deposit/withdrawal UI
- [ ] Update balance display
- [ ] Update transaction signing flow

### 8. Backend/API Updates
- [ ] Update database schema for USDC balances
- [ ] Update API endpoints for deposits/withdrawals
- [ ] Update game round logic
- [ ] Update payout calculations

## Execution Order

1. Project renaming (global find/replace)
2. Remove Wallet dependencies
3. Update smart contracts for Base/USDC
4. Implement deposit system
5. Update frontend wallet integration
6. Update game logic
7. Remove  references
8. Update documentation
9. Test everything

## Verification Criteria

- ✅ No mentions of "Base", "USDC", "Wallet", "", "RiskUrUSDC"
- ✅ All references use "Base", "USDC", "RiskUrUSDC"
- ✅ Deposit system functional
- ✅ Balance tracking works
- ✅ Game logic uses internal balances
- ✅ README updated
- ✅ All imports/dependencies updated
