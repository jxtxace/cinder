// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Unaudited demo contract for portfolio purposes. Testnet only. Not financial software.

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CashbackVault is ReentrancyGuard {
    IERC20 public immutable cinderToken;
    
    uint256 public constant EPOCH_LENGTH = 7 days;
    uint256 public immutable genesisTimestamp;

    mapping(uint256 => uint256) public epochVolume;
    mapping(uint256 => uint256) public epochFees;
    mapping(uint256 => mapping(address => uint256)) public traderVolume;
    
    mapping(address => uint256) public nextClaimableEpoch;

    constructor(address _token) {
        require(_token != address(0), "Invalid token address");
        cinderToken = IERC20(_token);
        genesisTimestamp = block.timestamp;
    }

    function currentEpoch() public view returns (uint256) {
        return (block.timestamp - genesisTimestamp) / EPOCH_LENGTH;
    }

    function recordVolume(address trader, uint256 amount) external {
        require(msg.sender == address(cinderToken), "Only CinderToken can record volume");
        uint256 epoch = currentEpoch();
        
        traderVolume[epoch][trader] += amount;
        epochVolume[epoch] += amount;
        epochFees[epoch] += amount / 100;
    }

    function claimable(address trader) public view returns (uint256) {
        uint256 totalClaimable = 0;
        uint256 current = currentEpoch();
        
        for (uint256 i = nextClaimableEpoch[trader]; i < current; i++) {
            if (traderVolume[i][trader] > 0) {
                uint256 tVol = traderVolume[i][trader];
                uint256 eVol = epochVolume[i];
                uint256 eFees = epochFees[i];
                totalClaimable += (eFees * tVol) / eVol;
            }
        }
        return totalClaimable;
    }

    function claim() external nonReentrant {
        uint256 current = currentEpoch();
        uint256 totalShare = 0;

        uint256 startEpoch = nextClaimableEpoch[msg.sender];

        for (uint256 i = startEpoch; i < current; i++) {
            if (traderVolume[i][msg.sender] > 0) {
                uint256 tVol = traderVolume[i][msg.sender];
                uint256 eVol = epochVolume[i];
                uint256 eFees = epochFees[i];
                
                uint256 share = (eFees * tVol) / eVol;
                totalShare += share;
            }
        }

        nextClaimableEpoch[msg.sender] = current;

        require(totalShare > 0, "No claimable fees");
        require(cinderToken.transfer(msg.sender, totalShare), "Transfer failed");
    }
}
