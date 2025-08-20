// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Mock KRW Stablecoin
 * @dev Simple ERC20 stablecoin for testing KaiaFi lending protocol
 * @author Korea Stablecoin Hackathon 2025
 */
contract MockKRW is ERC20, Ownable {
    uint8 private _decimals = 6; // KRW has 6 decimals like USDT
    
    constructor() ERC20("Mock Korean Won", "mKRW") {
        _mint(msg.sender, 1000000 * 10**6); // Mint 1M KRW
    }
    
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
} 