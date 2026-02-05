# RiskUrUSDC Smart Contract Implementation Plan

## Architecture Overview

The protocol requires 3 core smart contracts on Base (+ RISK token via Clawnch):

### 1. **RISK Token** - Via Clawnch Launch 🚀
- **NOT implemented in this repo**
- Will be launched via Clawnch platform
- Address will be set in TokenomicsDistributor after launch
- Standard ERC-20 with burn functionality

### 2. **USDCVault.sol** - Deposit & Balance Management ✅
- Users deposit USDC
- Internal balance tracking
- Withdrawal with cooldown
- Emergency pause functionality

### 3. **CrashGame.sol** - Core Game Logic ✅
- Round management
- Bet placement from user balances
- Provably fair crash point generation (SHA-256 hash chain)
- Payout calculations
- 5% fee extraction

### 4. **TokenomicsDistributor.sol** - Fee Distribution Engine ✅
- Receives 5% fees from each round
- Distributes:
  - 40% → House Pool (back to USDCVault)
  - 40% → Staking Vault (yield for $RISK stakers)
  - 15% → Auto-burn (buy $RISK + burn)
  - 5% → Growth Fund (treasury multisig)

### 5. **StakingVault.sol** - $RISK Staking ⏸️
- **WAITING FOR GO-AHEAD**
- Will implement after RISK token launch via Clawnch
- Stake $RISK tokens
- Earn USDC yield from TokenomicsDistributor
- 7-day unstaking cooldown

## Current Status

✅ **Completed:**
1. USDCVault.sol
2. CrashGame.sol
3. TokenomicsDistributor.sol

⏸️ **On Hold:**
4. StakingVault.sol - Waiting for instruction

🚀 **External:**
5. RISK Token - Will launch via Clawnch

## Implementation Priority

**Phase 1: Core Infrastructure** (Week 1)
1. RISKToken.sol
2. USDCVault.sol
3. Basic deposit/withdrawal

**Phase 2: Game Mechanics** (Week 2)
4. CrashGame.sol
5. Provably fair hash chain
6. Bet placement and payouts

**Phase 3: Tokenomics** (Week 3)
7. TokenomicsDistributor.sol
8. StakingVault.sol
9. Auto-burn mechanism

**Phase 4: Integration & Testing** (Week 4)
10. Full integration tests
11. Audits (if budget allows)
12. Deployment to Base testnet
13. Frontend integration

## Contract Specifications

### RISKToken.sol
```solidity
contract RISKToken is ERC20Burnable {
    address public treasury;
    
    function mint(address to, uint256 amount) external onlyTreasury;
    function burn(uint256 amount) external override;
}
```

### USDCVault.sol
```solidity
contract USDCVault {
    IERC20 public usdc;
    mapping(address => uint256) public balances;
    
    function deposit(uint256 amount) external;
    function withdraw(uint256 amount) external;
    function getBalance(address user) external view returns (uint256);
}
```

### CrashGame.sol
```solidity
contract CrashGame {
    struct Round {
        uint256 id;
        bytes32 serverSeed;
        uint256 crashPoint;
        uint256 startTime;
        bool ended;
    }
    
    mapping(uint256 => Round) public rounds;
    mapping(uint256 => mapping(address => Bet)) public bets;
    
    function placeBet(uint256 amount, uint256 autoCashoutMultiplier) external;
    function cashOut() external;
    function endRound() external;
    function proveCrashPoint(uint256 roundId, bytes32 seed) external view returns (bool);
}
```

### TokenomicsDistributor.sol
```solidity
contract TokenomicsDistributor {
    address public housePool;
    address public stakingVault;
    address public growthFund;
    IRISKToken public riskToken;
    
    function distributeFees(uint256 amount) external {
        uint256 toHouse = amount * 40 / 100;
        uint256 toStakers = amount * 40 / 100;
        uint256 toBurn = amount * 15 / 100;
        uint256 toGrowth = amount * 5 / 100;
        
        // Execute distributions
    }
    
    function autoBurn(uint256 usdcAmount) internal {
        // Buy RISK on DEX + burn
    }
}
```

### StakingVault.sol
```solidity
contract StakingVault {
    IRISKToken public riskToken;
    IERC20 public usdc;
    
    struct Stake {
        uint256 amount;
        uint256 timestamp;
        uint256 unlockTime;
    }
    
    mapping(address => Stake) public stakes;
    uint256 public totalStaked;
    uint256 public rewardPool;
    
    function stake(uint256 amount) external;
    function unstake() external; // 7-day cooldown
    function claimRewards() external;
}
```

## Security Considerations

1. **Reentrancy Protection:** Use ReentrancyGuard on all state-changing functions
2. **Access Control:** OpenZeppelin AccessControl for role-based permissions
3. **Pausable:** Emergency pause on all contracts
4. **Upgrade Strategy:** Use UUPS proxy pattern for upgradeability
5. **Oracle Integration:** Chainlink for USDC/RISK price feeds (auto-burn)
6. **Rate Limiting:** Prevent flash loan attacks
7. **Timelock:** 24-48h delay on critical parameter changes

## Testing Strategy

- Unit tests for each contract
- Integration tests for full flow
- Fuzzing for edge cases
- Gas optimization
- Formal verification (optional)

## Deployment Checklist

- [ ] Deploy RISKToken
- [ ] Deploy USDCVault
- [ ] Deploy CrashGame
- [ ] Deploy TokenomicsDistributor
- [ ] Deploy StakingVault
- [ ] Configure addresses and permissions
- [ ] Initialize parameters
- [ ] Verify contracts on Basescan
- [ ] Test on Base Sepolia testnet
- [ ] Audit (if budget)
- [ ] Deploy to Base Mainnet

---

**Next Steps:**
1. Set up Hardhat/Foundry development environment
2. Write RISKToken.sol
3. Write USDCVault.sol
4. Begin testing

Let's build. 🎯
