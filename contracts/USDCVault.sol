// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title USDCVault
 * @notice Manages user USDC deposits and internal balances for RiskUrUSDC
 * @dev Users deposit USDC and play with internal balance to minimize gas costs
 */
contract USDCVault is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;
    
    IERC20 public immutable usdc;
    address public crashGame;
    address public stakingVault;
    
    mapping(address => uint256) public balances;
    uint256 public totalDeposits;
    uint256 public housePool; // Sovereign bankroll
    
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    event BalanceUsed(address indexed user, uint256 amount, string purpose);
    event HousePoolIncreased(uint256 amount);
    
    constructor(address _usdc) Ownable(msg.sender) {
        require(_usdc != address(0), "Invalid USDC address");
        usdc = IERC20(_usdc);
    }
    
    /**
     * @notice Deposit USDC into vault
     * @param amount Amount of USDC to deposit
     */
    function deposit(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be > 0");
        
        usdc.safeTransferFrom(msg.sender, address(this), amount);
        balances[msg.sender] += amount;
        totalDeposits += amount;
        
        emit Deposit(msg.sender, amount);
    }
    
    /**
     * @notice Withdraw USDC from vault
     * @param amount Amount to withdraw
     */
    function withdraw(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be > 0");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        balances[msg.sender] -= amount;
        totalDeposits -= amount;
        usdc.safeTransfer(msg.sender, amount);
        
        emit Withdrawal(msg.sender, amount);
    }
    
    /**
     * @notice Deduct balance for game bet (called by CrashGame contract)
     * @param user User address
     * @param amount Amount to deduct
     */
    function deductBalance(address user, uint256 amount) external {
        require(msg.sender == crashGame, "Only CrashGame");
        require(balances[user] >= amount, "Insufficient balance");
        
        balances[user] -= amount;
        emit BalanceUsed(user, amount, "bet");
    }
    
    /**
     * @notice Credit balance for game payout (called by CrashGame contract)
     * @param user User address
     * @param amount Amount to credit
     */
    function creditBalance(address user, uint256 amount) external {
        require(msg.sender == crashGame, "Only CrashGame");
        
        balances[user] += amount;
    }
    
    /**
     * @notice Add funds to house pool (called by TokenomicsDistributor)
     * @param amount Amount to add
     */
    function increaseHousePool(uint256 amount) external {
        require(msg.sender == owner() || msg.sender == crashGame, "Unauthorized");
        
        housePool += amount;
        emit HousePoolIncreased(amount);
    }
    
    /**
     * @notice Get user balance
     * @param user User address
     */
    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }
    
    /**
     * @notice Set CrashGame contract address
     * @param _crashGame CrashGame address
     */
    function setCrashGame(address _crashGame) external onlyOwner {
        require(_crashGame != address(0), "Invalid address");
        crashGame = _crashGame;
    }
    
    /**
     * @notice Set StakingVault contract address
     * @param _stakingVault StakingVault address
     */
    function setStakingVault(address _stakingVault) external onlyOwner {
        require(_stakingVault != address(0), "Invalid address");
        stakingVault = _stakingVault;
    }
    
    /**
     * @notice Emergency pause
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @notice Unpause
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
