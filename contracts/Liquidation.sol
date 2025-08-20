// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title KaiaFi Liquidation
 * @dev Handles liquidation of unhealthy positions
 * @author Korea Stablecoin Hackathon 2025
 */
contract Liquidation is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // ============ STRUCTS ============
    
    struct LiquidationInfo {
        address user;
        address collateralToken;
        address borrowToken;
        uint256 collateralAmount;
        uint256 borrowAmount;
        uint256 healthFactor;
        uint256 timestamp;
        bool isLiquidated;
    }
    
    struct LiquidationParams {
        uint256 closeFactor;
        uint256 liquidationIncentive;
        uint256 maxLiquidationClose;
    }

    // ============ STATE VARIABLES ============
    
    mapping(address => LiquidationInfo[]) public userLiquidations;
    mapping(address => bool) public liquidators;
    mapping(address => LiquidationParams) public liquidationParams;
    
    address public lendingPool;
    uint256 public constant HEALTH_FACTOR_THRESHOLD = 1e18; // 1.0
    uint256 public constant DEFAULT_CLOSE_FACTOR = 0.5e18; // 50%
    uint256 public constant DEFAULT_LIQUIDATION_INCENTIVE = 0.05e18; // 5%
    uint256 public constant MAX_LIQUIDATION_CLOSE = 0.5e18; // 50%
    
    // Events
    event LiquidationExecuted(
        address indexed liquidator,
        address indexed user,
        address indexed collateralToken,
        uint256 collateralAmount,
        uint256 borrowAmount,
        uint256 healthFactor
    );
    
    event LiquidationParamsUpdated(
        address indexed token,
        uint256 closeFactor,
        uint256 liquidationIncentive,
        uint256 maxLiquidationClose
    );
    
    event LiquidatorAdded(address indexed liquidator);
    event LiquidatorRemoved(address indexed liquidator);

    // ============ MODIFIERS ============
    
    modifier onlyLiquidator() {
        require(liquidators[msg.sender] || msg.sender == owner(), "Not authorized liquidator");
        _;
    }
    
    modifier onlyLendingPool() {
        require(msg.sender == lendingPool, "Only lending pool can call");
        _;
    }

    // ============ CONSTRUCTOR ============
    
    constructor(address _lendingPool) {
        lendingPool = _lendingPool;
        liquidators[msg.sender] = true;
    }

    // ============ ADMIN FUNCTIONS ============
    
    function setLendingPool(address _lendingPool) external onlyOwner {
        require(_lendingPool != address(0), "Invalid address");
        lendingPool = _lendingPool;
    }
    
    function addLiquidator(address _liquidator) external onlyOwner {
        require(_liquidator != address(0), "Invalid address");
        liquidators[_liquidator] = true;
        emit LiquidatorAdded(_liquidator);
    }
    
    function removeLiquidator(address _liquidator) external onlyOwner {
        require(_liquidator != owner(), "Cannot remove owner");
        liquidators[_liquidator] = false;
        emit LiquidatorRemoved(_liquidator);
    }
    
    function setLiquidationParams(
        address token,
        uint256 closeFactor,
        uint256 liquidationIncentive,
        uint256 maxLiquidationClose
    ) external onlyOwner {
        require(closeFactor <= 1e18, "Close factor cannot exceed 100%");
        require(liquidationIncentive <= 0.2e18, "Liquidation incentive cannot exceed 20%");
        require(maxLiquidationClose <= 1e18, "Max liquidation close cannot exceed 100%");
        
        liquidationParams[token] = LiquidationParams({
            closeFactor: closeFactor,
            liquidationIncentive: liquidationIncentive,
            maxLiquidationClose: maxLiquidationClose
        });
        
        emit LiquidationParamsUpdated(token, closeFactor, liquidationIncentive, maxLiquidationClose);
    }

    // ============ CORE FUNCTIONS ============
    
    /**
     * @dev Execute liquidation of an unhealthy position
     * @param user Address of the user to liquidate
     * @param collateralToken Address of the collateral token
     * @param borrowToken Address of the borrowed token
     * @param collateralAmount Amount of collateral to seize
     * @param borrowAmount Amount of debt to repay
     */
    function executeLiquidation(
        address user,
        address collateralToken,
        address borrowToken,
        uint256 collateralAmount,
        uint256 borrowAmount
    ) external onlyLiquidator nonReentrant {
        require(user != address(0), "Invalid user address");
        require(collateralToken != address(0), "Invalid collateral token");
        require(borrowToken != address(0), "Invalid borrow token");
        require(collateralAmount > 0, "Invalid collateral amount");
        require(borrowAmount > 0, "Invalid borrow amount");
        
        // Get liquidation parameters
        LiquidationParams memory params = liquidationParams[borrowToken];
        if (params.closeFactor == 0) {
            params.closeFactor = DEFAULT_CLOSE_FACTOR;
            params.liquidationIncentive = DEFAULT_LIQUIDATION_INCENTIVE;
            params.maxLiquidationClose = MAX_LIQUIDATION_CLOSE;
        }
        
        // Calculate actual amounts based on close factor
        uint256 actualBorrowAmount = (borrowAmount * params.closeFactor) / 1e18;
        uint256 actualCollateralAmount = (collateralAmount * params.closeFactor) / 1e18;
        
        // Apply liquidation incentive
        uint256 liquidatorReward = (actualCollateralAmount * params.liquidationIncentive) / 1e18;
        uint256 protocolReward = actualCollateralAmount - liquidatorReward;
        
        // Transfer borrowed tokens from liquidator to lending pool
        IERC20(borrowToken).safeTransferFrom(msg.sender, lendingPool, actualBorrowAmount);
        
        // Transfer collateral tokens from user to liquidator and protocol
        IERC20(collateralToken).safeTransferFrom(user, msg.sender, liquidatorReward);
        IERC20(collateralToken).safeTransferFrom(user, owner(), protocolReward);
        
        // Record liquidation
        LiquidationInfo memory liquidation = LiquidationInfo({
            user: user,
            collateralToken: collateralToken,
            borrowToken: borrowToken,
            collateralAmount: actualCollateralAmount,
            borrowAmount: actualBorrowAmount,
            healthFactor: 0, // Will be updated by lending pool
            timestamp: block.timestamp,
            isLiquidated: true
        });
        
        userLiquidations[user].push(liquidation);
        
        emit LiquidationExecuted(
            msg.sender,
            user,
            collateralToken,
            actualCollateralAmount,
            actualBorrowAmount,
            0
        );
    }
    
    /**
     * @dev Check if a position is eligible for liquidation
     * @param user Address of the user
     * @param healthFactor Current health factor
     * @return True if position can be liquidated
     */
    function canLiquidate(address user, uint256 healthFactor) external pure returns (bool) {
        return healthFactor < HEALTH_FACTOR_THRESHOLD;
    }
    
    /**
     * @dev Calculate liquidation amounts
     * @param user Address of the user
     * @param collateralToken Address of the collateral token
     * @param borrowToken Address of the borrowed token
     * @param healthFactor Current health factor
     * @return collateralAmount Amount of collateral to seize
     * @return borrowAmount Amount of debt to repay
     */
    function calculateLiquidationAmounts(
        address user,
        address collateralToken,
        address borrowToken,
        uint256 healthFactor
    ) external view returns (uint256 collateralAmount, uint256 borrowAmount) {
        // This is a simplified calculation
        // In production, you'd get actual user positions from the lending pool
        
        if (healthFactor >= HEALTH_FACTOR_THRESHOLD) {
            return (0, 0);
        }
        
        // Calculate how much to liquidate to bring health factor back to 1.0
        uint256 deficit = HEALTH_FACTOR_THRESHOLD - healthFactor;
        
        // For simplicity, assume we need to liquidate 50% of the position
        // In reality, this would be calculated based on collateral and debt ratios
        return (deficit, deficit);
    }

    // ============ VIEW FUNCTIONS ============
    
    function getUserLiquidations(address user) external view returns (LiquidationInfo[] memory) {
        return userLiquidations[user];
    }
    
    function getLiquidationParams(address token) external view returns (LiquidationParams memory) {
        LiquidationParams memory params = liquidationParams[token];
        if (params.closeFactor == 0) {
            return LiquidationParams({
                closeFactor: DEFAULT_CLOSE_FACTOR,
                liquidationIncentive: DEFAULT_LIQUIDATION_INCENTIVE,
                maxLiquidationClose: MAX_LIQUIDATION_CLOSE
            });
        }
        return params;
    }
    
    function isLiquidator(address account) external view returns (bool) {
        return liquidators[account] || account == owner();
    }
    
    function getHealthFactorThreshold() external pure returns (uint256) {
        return HEALTH_FACTOR_THRESHOLD;
    }
    
    function getDefaultCloseFactor() external pure returns (uint256) {
        return DEFAULT_CLOSE_FACTOR;
    }
    
    function getDefaultLiquidationIncentive() external pure returns (uint256) {
        return DEFAULT_LIQUIDATION_INCENTIVE;
    }
    
    function getMaxLiquidationClose() external pure returns (uint256) {
        return MAX_LIQUIDATION_CLOSE;
    }
    
    function getLendingPool() external view returns (address) {
        return lendingPool;
    }
} 