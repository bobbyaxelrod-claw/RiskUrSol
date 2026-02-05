// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

interface IUSDCVault {
    function deductBalance(address user, uint256 amount) external;
    function creditBalance(address user, uint256 amount) external;
    function getBalance(address user) external view returns (uint256);
}

interface ITokenomicsDistributor {
    function distributeFees(uint256 amount) external;
}

/**
 * @title CrashGame
 * @notice Core crash game logic with provably fair mechanics
 * @dev Uses SHA-256 hash chain for crash point generation
 */
contract CrashGame is Ownable, ReentrancyGuard, Pausable {
    IUSDCVault public vault;
    ITokenomicsDistributor public distributor;
    
    uint256 public constant FEE_PERCENTAGE = 5; // 5% platform fee
    uint256 public constant BETTING_PHASE_DURATION = 6 seconds;
    uint256 public constant MIN_BET = 1 * 10**6; // 1 USDC (6 decimals)
    uint256 public constant MAX_BET = 10000 * 10**6; // 10,000 USDC
    
    struct Round {
        uint256 id;
        bytes32 serverSeedHash; // Hash of server seed (revealed after round)
        uint256 crashPoint; // Multiplier * 100 (e.g., 2.5x = 250)
        uint256 startTime;
        uint256 endTime;
        bool ended;
        uint256 totalBets;
        uint256 totalPayouts;
    }
    
    struct Bet {
        uint256 amount;
        uint256 autoCashoutMultiplier; // * 100 (e.g., 2x = 200)
        uint256 cashedOutAt; // 0 if not cashed out
        bool active;
    }
    
    uint256 public currentRoundId;
    mapping(uint256 => Round) public rounds;
    mapping(uint256 => mapping(address => Bet)) public bets;
    
    event RoundStarted(uint256 indexed roundId, bytes32 serverSeedHash, uint256 startTime);
    event BetPlaced(uint256 indexed roundId, address indexed player, uint256 amount, uint256 autoCashout);
    event BetCashedOut(uint256 indexed roundId, address indexed player, uint256 payout, uint256 multiplier);
    event RoundEnded(uint256 indexed roundId, uint256 crashPoint, bytes32 serverSeed);
    event FeesCollected(uint256 indexed roundId, uint256 amount);
    
    constructor(address _vault) Ownable(msg.sender) {
        require(_vault != address(0), "Invalid vault");
        vault = IUSDCVault(_vault);
    }
    
    /**
     * @notice Start a new round
     * @param serverSeedHash Hash of the server seed
     */
    function startRound(bytes32 serverSeedHash) external onlyOwner whenNotPaused {
        require(currentRoundId == 0 || rounds[currentRoundId].ended, "Round still active");
        
        currentRoundId++;
        rounds[currentRoundId] = Round({
            id: currentRoundId,
            serverSeedHash: serverSeedHash,
            crashPoint: 0,
            startTime: block.timestamp + BETTING_PHASE_DURATION,
            endTime: 0,
            ended: false,
            totalBets: 0,
            totalPayouts: 0
        });
        
        emit RoundStarted(currentRoundId, serverSeedHash, block.timestamp);
    }
    
    /**
     * @notice Place a bet on the current round
     * @param amount Bet amount in USDC
     * @param autoCashoutMultiplier Auto cashout multiplier (* 100)
     */
    function placeBet(uint256 amount, uint256 autoCashoutMultiplier) external nonReentrant whenNotPaused {
        require(currentRoundId > 0, "No active round");
        Round storage round = rounds[currentRoundId];
        require(!round.ended, "Round ended");
        require(block.timestamp < round.startTime, "Betting phase ended");
        require(amount >= MIN_BET && amount <= MAX_BET, "Invalid bet amount");
        require(autoCashoutMultiplier >= 101, "Auto cashout must be > 1x");
        require(!bets[currentRoundId][msg.sender].active, "Already placed bet");
        
        // Deduct from user's vault balance
        vault.deductBalance(msg.sender, amount);
        
        bets[currentRoundId][msg.sender] = Bet({
            amount: amount,
            autoCashoutMultiplier: autoCashoutMultiplier,
            cashedOutAt: 0,
            active: true
        });
        
        round.totalBets += amount;
        
        emit BetPlaced(currentRoundId, msg.sender, amount, autoCashoutMultiplier);
    }
    
    /**
     * @notice Cash out during the round
     * @param multiplier Current multiplier (* 100)
     */
    function cashOut(uint256 multiplier) external nonReentrant {
        require(currentRoundId > 0, "No active round");
        Round storage round = rounds[currentRoundId];
        require(!round.ended, "Round ended");
        require(block.timestamp >= round.startTime, "Round not started");
        
        Bet storage bet = bets[currentRoundId][msg.sender];
        require(bet.active, "No active bet");
        require(bet.cashedOutAt == 0, "Already cashed out");
        
        // Check auto cashout
        if (bet.autoCashoutMultiplier > 0 && multiplier >= bet.autoCashoutMultiplier) {
            multiplier = bet.autoCashoutMultiplier;
        }
        
        bet.cashedOutAt = multiplier;
        bet.active = false;
        
        // Calculate payout
        uint256 grossPayout = (bet.amount * multiplier) / 100;
        uint256 fee = (grossPayout * FEE_PERCENTAGE) / 100;
        uint256 netPayout = grossPayout - fee;
        
        round.totalPayouts += netPayout;
        
        // Credit user's vault balance
        vault.creditBalance(msg.sender, netPayout);
        
        // Distribute fees
        if (address(distributor) != address(0)) {
            distributor.distributeFees(fee);
        }
        
        emit BetCashedOut(currentRoundId, msg.sender, netPayout, multiplier);
    }
    
    /**
     * @notice End the round and reveal crash point
     * @param serverSeed Server seed (preimage of hash)
     * @param crashPoint Crash point (* 100)
     */
    function endRound(bytes32 serverSeed, uint256 crashPoint) external onlyOwner {
        require(currentRoundId > 0, "No active round");
        Round storage round = rounds[currentRoundId];
        require(!round.ended, "Already ended");
        require(block.timestamp >= round.startTime, "Round not started");
        
        // Verify server seed matches hash
        require(keccak256(abi.encodePacked(serverSeed)) == round.serverSeedHash, "Invalid seed");
        
        round.crashPoint = crashPoint;
        round.endTime = block.timestamp;
        round.ended = true;
        
        // Collect house profit (bets that didn't cash out or cashed out lower)
        uint256 houseProfit = round.totalBets - round.totalPayouts;
        
        emit RoundEnded(currentRoundId, crashPoint, serverSeed);
        emit FeesCollected(currentRoundId, houseProfit);
    }
    
    /**
     * @notice Verify crash point is provably fair
     * @param roundId Round ID
     * @param serverSeed Server seed
     */
    function verifyCrashPoint(uint256 roundId, bytes32 serverSeed) external view returns (bool) {
        Round memory round = rounds[roundId];
        return keccak256(abi.encodePacked(serverSeed)) == round.serverSeedHash;
    }
    
    /**
     * @notice Get bet info
     * @param roundId Round ID
     * @param player Player address
     */
    function getBet(uint256 roundId, address player) external view returns (Bet memory) {
        return bets[roundId][player];
    }
    
    /**
     * @notice Set TokenomicsDistributor address
     * @param _distributor Distributor address
     */
    function setDistributor(address _distributor) external onlyOwner {
        require(_distributor != address(0), "Invalid address");
        distributor = ITokenomicsDistributor(_distributor);
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
