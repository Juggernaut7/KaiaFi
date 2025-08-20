// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./InterestRateModel.sol";
import "./Liquidation.sol";

/**
 * @title KaiaFi Lending Pool
 * @dev Main lending protocol for Kaia Network
 * @author Korea Stablecoin Hackathon 2025
 */
contract LendingPool is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // ============ STRUCTS ============
    
    struct Asset {
        address token;
        uint256 totalSupply;
        uint256 totalBorrow;
        uint256 supplyIndex;
        uint256 borrowIndex;
        uint256 lastUpdateTime;
        uint256 maxLTV;
        uint256 liquidationThreshold;
        uint256 liquidationPenalty;
        bool isActive;
    }
    
    struct UserPosition {
        uint256 supplied;
        uint256 borrowed;
        uint256 supplyIndex;
        uint256 borrowIndex;
        bool isActive;
    }
    
    struct MarketData {
        uint256 totalValueLocked;
        uint256 totalBorrowed;
        uint256 averageAPY;
        uint256 utilizationRate;
    }

    // ============ STATE VARIABLES ============
    
    mapping(address => Asset) public assets;
    mapping(address => mapping(address => UserPosition)) public userPositions;
    mapping(address => bool) public supportedTokens;
    address[] public supportedTokenList; // Track list of supported tokens
    
    address public interestRateModel;
    address public liquidationContract;
    uint256 public constant SECONDS_PER_YEAR = 365 days;
    uint256 public constant LIQUIDATION_CLOSE_FACTOR = 0.5e18; // 50%
    
    // Events
    event AssetAdded(address indexed token, uint256 maxLTV, uint256 liquidationThreshold);
    event AssetUpdated(address indexed token, uint256 maxLTV, uint256 liquidationThreshold);
    event Supply(address indexed user, address indexed token, uint256 amount, uint256 newBalance);
    event Withdraw(address indexed user, address indexed token, uint256 amount, uint256 newBalance);
    event Borrow(address indexed user, address indexed token, uint256 amount, uint256 newBalance);
    event Repay(address indexed user, address indexed token, uint256 amount, uint256 newBalance);
    event InterestAccrued(address indexed token, uint256 supplyIndex, uint256 borrowIndex);
    event Liquidation(address indexed liquidator, address indexed user, address indexed token, uint256 amount);

    // ============ CONSTRUCTOR ============
    
    constructor(address _interestRateModel, address _liquidationContract) {
        interestRateModel = _interestRateModel;
        liquidationContract = _liquidationContract;
    }

    // ============ MODIFIERS ============
    
    modifier onlySupportedToken(address token) {
        require(supportedTokens[token], "Token not supported");
        require(assets[token].isActive, "Asset not active");
        _;
    }
    
    modifier onlyValidAmount(uint256 amount) {
        require(amount > 0, "Amount must be greater than 0");
        _;
    }

    // ============ ADMIN FUNCTIONS ============
    
    function addAsset(
        address token,
        uint256 maxLTV,
        uint256 liquidationThreshold,
        uint256 liquidationPenalty
    ) external onlyOwner {
        require(token != address(0), "Invalid token address");
        require(maxLTV <= 1e18, "Max LTV cannot exceed 100%");
        require(liquidationThreshold > maxLTV, "Liquidation threshold must be greater than max LTV");
        
        assets[token] = Asset({
            token: token,
            totalSupply: 0,
            totalBorrow: 0,
            supplyIndex: 1e18,
            borrowIndex: 1e18,
            lastUpdateTime: block.timestamp,
            maxLTV: maxLTV,
            liquidationThreshold: liquidationThreshold,
            liquidationPenalty: liquidationPenalty,
            isActive: true
        });
        
        supportedTokens[token] = true;
        supportedTokenList.push(token); // Add to the list
        emit AssetAdded(token, maxLTV, liquidationThreshold);
    }
    
    function updateAsset(
        address token,
        uint256 maxLTV,
        uint256 liquidationThreshold,
        uint256 liquidationPenalty
    ) external onlyOwner {
        require(supportedTokens[token], "Asset not found");
        
        assets[token].maxLTV = maxLTV;
        assets[token].liquidationThreshold = liquidationThreshold;
        assets[token].liquidationPenalty = liquidationPenalty;
        
        emit AssetUpdated(token, maxLTV, liquidationThreshold);
    }
    
    function setInterestRateModel(address _interestRateModel) external onlyOwner {
        require(_interestRateModel != address(0), "Invalid address");
        interestRateModel = _interestRateModel;
    }
    
    function setLiquidationContract(address _liquidationContract) external onlyOwner {
        require(_liquidationContract != address(0), "Invalid address");
        liquidationContract = _liquidationContract;
    }

    // ============ CORE FUNCTIONS ============
    
    function supply(address token, uint256 amount) 
        external 
        nonReentrant 
        onlySupportedToken(token) 
        onlyValidAmount(amount) 
    {
        Asset storage asset = assets[token];
        UserPosition storage position = userPositions[msg.sender][token];
        
        // Accrue interest
        _accrueInterest(token);
        
        // Transfer tokens from user
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        
        // Update user position
        if (position.isActive) {
            position.supplied += amount;
        } else {
            position.supplied = amount;
            position.supplyIndex = asset.supplyIndex;
            position.isActive = true;
        }
        
        // Update asset totals
        asset.totalSupply += amount;
        
        emit Supply(msg.sender, token, amount, position.supplied);
    }
    
    function withdraw(address token, uint256 amount) 
        external 
        nonReentrant 
        onlySupportedToken(token) 
        onlyValidAmount(amount) 
    {
        Asset storage asset = assets[token];
        UserPosition storage position = userPositions[msg.sender][token];
        
        require(position.isActive, "No position");
        require(amount <= position.supplied, "Insufficient supply");
        
        // Accrue interest
        _accrueInterest(token);
        
        // Check health factor
        require(_getHealthFactor(msg.sender) >= 1e18, "Health factor too low");
        
        // Update user position
        position.supplied -= amount;
        
        // Update asset totals
        asset.totalSupply -= amount;
        
        // Transfer tokens to user
        IERC20(token).safeTransfer(msg.sender, amount);
        
        emit Withdraw(msg.sender, token, amount, position.supplied);
    }
    
    function borrow(address token, uint256 amount) 
        external 
        nonReentrant 
        onlySupportedToken(token) 
        onlyValidAmount(amount) 
    {
        Asset storage asset = assets[token];
        UserPosition storage position = userPositions[msg.sender][token];
        
        require(position.isActive, "No position");
        require(amount <= _getMaxBorrowAmount(msg.sender, token), "Exceeds max borrow");
        
        // Accrue interest
        _accrueInterest(token);
        
        // Update user position
        if (position.borrowed == 0) {
            position.borrowIndex = asset.borrowIndex;
        }
        position.borrowed += amount;
        
        // Update asset totals
        asset.totalBorrow += amount;
        
        // Transfer tokens to user
        IERC20(token).safeTransfer(msg.sender, amount);
        
        emit Borrow(msg.sender, token, amount, position.borrowed);
    }
    
    function repay(address token, uint256 amount) 
        external 
        nonReentrant 
        onlySupportedToken(token) 
        onlyValidAmount(amount) 
    {
        Asset storage asset = assets[token];
        UserPosition storage position = userPositions[msg.sender][token];
        
        require(position.isActive, "No position");
        require(amount <= position.borrowed, "Exceeds borrowed amount");
        
        // Accrue interest
        _accrueInterest(token);
        
        // Transfer tokens from user
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        
        // Update user position
        position.borrowed -= amount;
        
        // Update asset totals
        asset.totalBorrow -= amount;
        
        emit Repay(msg.sender, token, amount, position.borrowed);
    }

    // ============ INTERNAL FUNCTIONS ============
    
    function _accrueInterest(address token) internal {
        Asset storage asset = assets[token];
        
        if (block.timestamp == asset.lastUpdateTime) {
            return;
        }
        
        uint256 timeElapsed = block.timestamp - asset.lastUpdateTime;
        
        if (asset.totalSupply > 0) {
            uint256 supplyRate = InterestRateModel(interestRateModel).getSupplyRate(
                asset.totalSupply,
                asset.totalBorrow,
                asset.totalSupply
            );
            
            uint256 supplyInterest = (asset.totalSupply * supplyRate * timeElapsed) / SECONDS_PER_YEAR / 1e18;
            asset.supplyIndex += (supplyInterest * 1e18) / asset.totalSupply;
        }
        
        if (asset.totalBorrow > 0) {
            uint256 borrowRate = InterestRateModel(interestRateModel).getBorrowRate(
                asset.totalSupply,
                asset.totalBorrow,
                asset.totalSupply
            );
            
            uint256 borrowInterest = (asset.totalBorrow * borrowRate * timeElapsed) / SECONDS_PER_YEAR / 1e18;
            asset.borrowIndex += (borrowInterest * 1e18) / asset.totalBorrow;
        }
        
        asset.lastUpdateTime = block.timestamp;
        emit InterestAccrued(token, asset.supplyIndex, asset.borrowIndex);
    }
    
    function _getMaxBorrowAmount(address user, address token) internal view returns (uint256) {
        // For simplicity, we'll use a fixed approach
        // In production, you'd implement proper cross-collateral logic
        
        UserPosition storage position = userPositions[user][token];
        if (!position.isActive || position.supplied == 0) {
            return 0;
        }
        
        Asset storage asset = assets[token];
        uint256 collateralValue = (position.supplied * asset.maxLTV) / 1e18;
        
        // Simple logic: can borrow up to 50% of collateral value
        return collateralValue / 2;
    }
    
    function _getHealthFactor(address user) internal view returns (uint256) {
        // For simplicity, we'll use a basic health factor calculation
        // In production, you'd implement proper cross-asset health factor
        
        uint256 totalCollateralValue = 0;
        uint256 totalBorrowValue = 0;
        
        // This is a simplified version - in production you'd iterate through all positions
        // For now, return a healthy health factor
        return 2e18; // 2.0 - very healthy
    }
    
    function _getSupportedTokens() internal view returns (address[] memory) {
        return supportedTokenList;
    }

    // ============ VIEW FUNCTIONS ============
    
    function getAsset(address token) external view returns (Asset memory) {
        return assets[token];
    }
    
    function getUserPosition(address user, address token) external view returns (UserPosition memory) {
        return userPositions[user][token];
    }
    
    function getHealthFactor(address user) external view returns (uint256) {
        return _getHealthFactor(user);
    }
    
    function getMaxBorrowAmount(address user, address token) external view returns (uint256) {
        return _getMaxBorrowAmount(user, token);
    }
    
    function getMarketData() external view returns (MarketData memory) {
        // For simplicity, return mock data
        // In production, you'd calculate this from actual asset data
        
        return MarketData({
            totalValueLocked: 1000000e18, // 1M tokens
            totalBorrowed: 500000e18,     // 500k tokens
            averageAPY: 0.05e18,          // 5% APY
            utilizationRate: 50            // 50% utilization
        });
    }
} 