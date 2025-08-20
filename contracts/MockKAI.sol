// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Mock KAI Token
 * @dev Simple ERC20 token for testing KaiaFi lending protocol
 * @author Korea Stablecoin Hackathon 2025
 */
contract MockKAI is ERC20, Ownable {
    constructor() ERC20("Mock KAI", "mKAI") {
        _mint(msg.sender, 100000 * 10**18); // Mint 100k KAI
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
} 