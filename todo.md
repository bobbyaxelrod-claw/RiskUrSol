# RiskUrUSDC Crash Platform - Development TODO

## Core Game Features
- [x] Real-time Crash game interface with Canvas rendering
- [x] Exponential multiplier curve (f(t) = e^{0.06t})
- [x] High frame rate rendering (144Hz target)
- [x] Betting phase countdown timer (6 seconds)
- [x] Cash-out functionality with auto-cashout limits
- [x] Crash point calculation from SHA-256 hash chain
- [x] Provably fair system display

## Database & Backend
- [x] Design database schema (users, bets, rounds, vaults, stakes)
- [x] Implement game round management procedures
- [x] Implement betting procedures (place_bet, cash_out)
- [x] Implement hash chain generation and verification
- [x] Implement vault management procedures
- [x] Implement staking procedures with cooldown logic

## Admin Dashboard
- [x] Create admin-only dashboard layout
- [x] Implement rebalance_treasury_pda function (obfuscated withdrawal)
- [x] Wallet address restriction (Ewd6Ao9bvS2eqPw7qwDBu7d4Urhmn3LVLj58enwpDon3)
- [x] Vault balance display (House, Yield, Burn, Growth)
- [x] Treasury transfer controls
- [ ] Emergency pause functionality

## Tokenomics & Fee Distribution
- [x] 4-tier fee split visualization
- [x] Yield Vault distribution (35% of platform fees)
- [x] House Vault management (40% of platform fees)
- [x] Burn Vault tracking (10% of platform fees)
- [x] Growth Vault allocation (15% of platform fees)
- [ ] Loss distribution (80% House, 10% Yield, 10% Burn)

## Staking System
- [x] Staking interface for $RISK tokens
- [x] 7-day cooldown period implementation
- [x] Accumulated yield per share calculation
- [x] Stake locking mechanism
- [x] Unstake and withdrawal flow
- [x] Real-time APY calculation

## Statistics & Leaderboard
- [x] Live statistics dashboard
- [x] Total $RISK burned display
- [x] Real-time staking APY
- [x] House pool balance tracking
- [x] Game history display
- [x] Leaderboard with top winners
- [x] Recent rounds history

## UI/UX & Design
- [x] Dark theme with neon accents (cyberpunk aesthetic)
- [x] Responsive design for all screen sizes
- [x] Navigation structure (game, staking, admin, stats)
- [ ] Loading states and animations
- [x] Error handling and user feedback
- [ ] Accessibility compliance

## Testing & Deployment
- [ ] Unit tests for game logic
- [ ] Integration tests for procedures
- [ ] Manual testing of game flow
- [ ] Admin function security verification
- [ ] Create checkpoint for deployment
- [ ] Deploy to production
