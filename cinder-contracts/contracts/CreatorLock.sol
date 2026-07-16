// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Unaudited demo contract for portfolio purposes. Testnet only. Not financial software.

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CreatorLock {
    address public immutable creator;
    uint256 public immutable unlockTimestamp;
    IERC20 public immutable token;

    constructor(address _creator, uint256 _unlockTimestamp, address _token) {
        require(_creator != address(0), "Invalid creator address");
        require(_token != address(0), "Invalid token address");
        creator = _creator;
        unlockTimestamp = _unlockTimestamp;
        token = IERC20(_token);
    }

    function release() external {
        require(block.timestamp >= unlockTimestamp, "Token is still locked");
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No tokens to release");
        
        require(token.transfer(creator, balance), "Transfer failed");
    }

    function timeUntilUnlock() external view returns (uint256) {
        if (block.timestamp >= unlockTimestamp) {
            return 0;
        }
        return unlockTimestamp - block.timestamp;
    }

    function isUnlocked() external view returns (bool) {
        return block.timestamp >= unlockTimestamp;
    }
}
