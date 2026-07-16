// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Unaudited demo contract for portfolio purposes. Testnet only. Not financial software.

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BurnVault is Ownable {
    ERC20Burnable public immutable token;
    uint256 private _totalBurned;

    event BurnExecuted(uint256 amount, uint256 timestamp, uint256 totalBurnedToDate);

    constructor(address _token) Ownable(msg.sender) {
        require(_token != address(0), "Invalid token address");
        token = ERC20Burnable(_token);
    }

    function ownerDeposit(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        
        // Pull tokens from the owner
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        // Burn exactly the deposited amount (vault must be fee exempt)
        token.burn(amount);

        _totalBurned += amount;
        emit BurnExecuted(amount, block.timestamp, _totalBurned);
    }

    function totalBurned() external view returns (uint256) {
        return _totalBurned;
    }
}
