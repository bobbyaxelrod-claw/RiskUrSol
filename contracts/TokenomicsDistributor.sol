// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IUSDCVault {
    function increaseHousePool(uint256 amount) external;
}

interface IRISKToken {
    function burn(uint256 amount) external;
}

/**
 * @title TokenomicsDistributor
 * @notice Distributes platform fees according to the 40/40/15/5 split
 * @dev Receives USDC fees and distributes to house, stakers, burn, and growth fund
 */
contract TokenomicsDistributor is Ownable {
    using SafeERC20 for IERC20;
    
    IERC20 public immutable usdc;
    IRISKToken public riskToken;
    IUSDCVault public vault;
    address public stakingVault;
    address public growthFund;
    address public dexRouter; // For auto-burn: buy RISK + burn
    
    uint256 public constant HOUSE_PERCENTAGE = 40;
    uint256 public constant STAKER_PERCENTAGE = 40;
    uint256 public constant BURN_PERCENTAGE = 15;
    uint256 public constant GROWTH_PERCENTAGE = 5;
    
    uint256 public totalDistributed;
    uint256 public totalBurned;
    
    event FeesDistributed(
        uint256 toHouse,
        uint256 toStakers,
        uint256 toBurn,
        uint256 toGrowth
    );
    event RISKBurned(uint256 usdcSpent, uint256 riskBurned);
    
    constructor(
        address _usdc,
        address _vault,
        address _growthFund
    ) Ownable(msg.sender) {
        require(_usdc != address(0), "Invalid USDC");
        require(_vault != address(0), "Invalid vault");
        require(_growthFund != address(0), "Invalid growth fund");
        
        usdc = IERC20(_usdc);
        vault = IUSDCVault(_vault);
        growthFund = _growthFund;
    }
    
    /**
     * @notice Distribute fees according to tokenomics split
     * @param amount Total fee amount in USDC
     */
    function distributeFees(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        
        // Calculate splits
        uint256 toHouse = (amount * HOUSE_PERCENTAGE) / 100;
        uint256 toStakers = (amount * STAKER_PERCENTAGE) / 100;
        uint256 toBurn = (amount * BURN_PERCENTAGE) / 100;
        uint256 toGrowth = amount - toHouse - toStakers - toBurn; // Remainder
        
        // Transfer USDC from sender (CrashGame contract)
        usdc.safeTransferFrom(msg.sender, address(this), amount);
        
        // 1. House Pool (40%)
        usdc.safeTransfer(address(vault), toHouse);
        vault.increaseHousePool(toHouse);
        
        // 2. Staker Yield (40%)
        if (stakingVault != address(0)) {
            usdc.safeTransfer(stakingVault, toStakers);
        }
        
        // 3. Auto-Burn (15%) - Buy RISK and burn
        if (toBurn > 0 && address(riskToken) != address(0) && dexRouter != address(0)) {
            _autoBurnRISK(toBurn);
        }
        
        // 4. Growth Fund (5%)
        usdc.safeTransfer(growthFund, toGrowth);
        
        totalDistributed += amount;
        
        emit FeesDistributed(toHouse, toStakers, toBurn, toGrowth);
    }
    
    /**
     * @notice Buy RISK tokens with USDC and burn them
     * @param usdcAmount Amount of USDC to spend
     */
    function _autoBurnRISK(uint256 usdcAmount) internal {
        // TODO: Implement DEX swap logic (Uniswap V3 on Base)
        // 1. Approve USDC to DEX router
        // 2. Swap USDC for RISK
        // 3. Burn received RISK tokens
        
        // Placeholder for now
        totalBurned += usdcAmount;
        emit RISKBurned(usdcAmount, 0);
    }
    
    /**
     * @notice Set RISK token address
     * @param _riskToken RISK token address
     */
    function setRISKToken(address _riskToken) external onlyOwner {
        require(_riskToken != address(0), "Invalid address");
        riskToken = IRISKToken(_riskToken);
    }
    
    /**
     * @notice Set staking vault address
     * @param _stakingVault Staking vault address
     */
    function setStakingVault(address _stakingVault) external onlyOwner {
        require(_stakingVault != address(0), "Invalid address");
        stakingVault = _stakingVault;
    }
    
    /**
     * @notice Set DEX router for auto-burn
     * @param _dexRouter DEX router address (Uniswap V3)
     */
    function setDexRouter(address _dexRouter) external onlyOwner {
        require(_dexRouter != address(0), "Invalid address");
        dexRouter = _dexRouter;
    }
    
    /**
     * @notice Update growth fund address
     * @param _growthFund New growth fund address
     */
    function setGrowthFund(address _growthFund) external onlyOwner {
        require(_growthFund != address(0), "Invalid address");
        growthFund = _growthFund;
    }
}
