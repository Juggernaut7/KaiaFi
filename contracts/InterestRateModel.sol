// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title KaiaFi Interest Rate Model
 * @dev Dynamic interest rate calculation based on utilization rate
 * @author Korea Stablecoin Hackathon 2025
 */
contract InterestRateModel {
    // ============ CONSTANTS ============
    
    uint256 public constant BASE_RATE = 0.02e18; // 2% base rate
    uint256 public constant MULTIPLIER = 0.20e18; // 20% multiplier
    uint256 public constant JUMP_MULTIPLIER = 3e18; // 300% jump multiplier
    uint256 public constant KINK = 0.80e18; // 80% kink point
    uint256 public constant OPTIMAL_UTILIZATION_RATE = 0.80e18; // 80% optimal utilization
    
    uint256 public constant SECONDS_PER_YEAR = 365 days;
    uint256 public constant RATE_PRECISION = 1e18;

    // ============ EVENTS ============
    
    event InterestRateUpdated(
        uint256 utilizationRate,
        uint256 supplyRate,
        uint256 borrowRate
    );

    // ============ PUBLIC FUNCTIONS ============
    
    /**
     * @dev Calculate the supply rate based on utilization
     * @param totalSupply Total supplied amount
     * @param totalBorrow Total borrowed amount
     * @param reserveFactor Reserve factor (unused in this model)
     * @return Supply rate per year (with 18 decimals)
     */
    function getSupplyRate(
        uint256 totalSupply,
        uint256 totalBorrow,
        uint256 reserveFactor
    ) public pure returns (uint256) {
        if (totalSupply == 0) {
            return 0;
        }
        
        uint256 utilizationRate = (totalBorrow * RATE_PRECISION) / totalSupply;
        uint256 borrowRate = getBorrowRate(totalSupply, totalBorrow, reserveFactor);
        
        // Supply rate = borrow rate * utilization rate * (1 - reserve factor)
        // For simplicity, we'll use a fixed reserve factor of 10%
        uint256 reserveFactorFixed = 0.10e18; // 10%
        
        return (borrowRate * utilizationRate * (RATE_PRECISION - reserveFactorFixed)) / (RATE_PRECISION * RATE_PRECISION);
    }
    
    /**
     * @dev Calculate the borrow rate based on utilization
     * @param totalSupply Total supplied amount
     * @param totalBorrow Total borrowed amount
     * @param reserveFactor Reserve factor (unused in this model)
     * @return Borrow rate per year (with 18 decimals)
     */
    function getBorrowRate(
        uint256 totalSupply,
        uint256 totalBorrow,
        uint256 reserveFactor
    ) public pure returns (uint256) {
        if (totalSupply == 0) {
            return BASE_RATE;
        }
        
        uint256 utilizationRate = (totalBorrow * RATE_PRECISION) / totalSupply;
        
        if (utilizationRate <= KINK) {
            // Normal rate: BASE_RATE + (utilizationRate * MULTIPLIER)
            return BASE_RATE + (utilizationRate * MULTIPLIER) / RATE_PRECISION;
        } else {
            // High utilization rate: BASE_RATE + (KINK * MULTIPLIER) + ((utilizationRate - KINK) * JUMP_MULTIPLIER)
            uint256 normalRate = BASE_RATE + (KINK * MULTIPLIER) / RATE_PRECISION;
            uint256 excessUtilization = utilizationRate - KINK;
            uint256 jumpRate = (excessUtilization * JUMP_MULTIPLIER) / RATE_PRECISION;
            
            return normalRate + jumpRate;
        }
    }
    
    /**
     * @dev Calculate utilization rate
     * @param totalSupply Total supplied amount
     * @param totalBorrow Total borrowed amount
     * @return Utilization rate (with 18 decimals)
     */
    function getUtilizationRate(uint256 totalSupply, uint256 totalBorrow) public pure returns (uint256) {
        if (totalSupply == 0) {
            return 0;
        }
        
        return (totalBorrow * RATE_PRECISION) / totalSupply;
    }
    
    /**
     * @dev Check if utilization rate is optimal
     * @param totalSupply Total supplied amount
     * @param totalBorrow Total borrowed amount
     * @return True if utilization is optimal
     */
    function isOptimalUtilization(uint256 totalSupply, uint256 totalBorrow) public pure returns (bool) {
        uint256 utilizationRate = getUtilizationRate(totalSupply, totalBorrow);
        return utilizationRate <= OPTIMAL_UTILIZATION_RATE;
    }
    
    /**
     * @dev Get optimal utilization rate
     * @return Optimal utilization rate (with 18 decimals)
     */
    function getOptimalUtilizationRate() public pure returns (uint256) {
        return OPTIMAL_UTILIZATION_RATE;
    }
    
    /**
     * @dev Get kink point
     * @return Kink point (with 18 decimals)
     */
    function getKink() public pure returns (uint256) {
        return KINK;
    }
    
    /**
     * @dev Get base rate
     * @return Base rate (with 18 decimals)
     */
    function getBaseRate() public pure returns (uint256) {
        return BASE_RATE;
    }
    
    /**
     * @dev Get multiplier
     * @return Multiplier (with 18 decimals)
     */
    function getMultiplier() public pure returns (uint256) {
        return MULTIPLIER;
    }
    
    /**
     * @dev Get jump multiplier
     * @return Jump multiplier (with 18 decimals)
     */
    function getJumpMultiplier() public pure returns (uint256) {
        return JUMP_MULTIPLIER;
    }
    
    /**
     * @dev Calculate APY from rate
     * @param rate Rate per year (with 18 decimals)
     * @return APY percentage (with 18 decimals)
     */
    function calculateAPY(uint256 rate) public pure returns (uint256) {
        // Convert rate to APY: APY = (1 + rate)^365 - 1
        // For small rates, this approximates to: APY ≈ rate
        return rate;
    }
    
    /**
     * @dev Calculate daily rate from annual rate
     * @param annualRate Annual rate (with 18 decimals)
     * @return Daily rate (with 18 decimals)
     */
    function getDailyRate(uint256 annualRate) public pure returns (uint256) {
        return (annualRate * 1 days) / SECONDS_PER_YEAR;
    }
    
    /**
     * @dev Calculate weekly rate from annual rate
     * @param annualRate Annual rate (with 18 decimals)
     * @return Weekly rate (with 18 decimals)
     */
    function getWeeklyRate(uint256 annualRate) public pure returns (uint256) {
        return (annualRate * 7 days) / SECONDS_PER_YEAR;
    }
    
    /**
     * @dev Calculate monthly rate from annual rate
     * @param annualRate Annual rate (with 18 decimals)
     * @return Monthly rate (with 18 decimals)
     */
    function getMonthlyRate(uint256 annualRate) public pure returns (uint256) {
        return (annualRate * 30 days) / SECONDS_PER_YEAR;
    }
} 