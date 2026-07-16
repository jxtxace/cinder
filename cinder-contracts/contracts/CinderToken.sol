// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Unaudited demo contract for portfolio purposes. Testnet only. Not financial software.

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CashbackVault.sol";

contract CinderToken is ERC20, ERC20Burnable, Ownable {
    CashbackVault public cashbackVault;
    bool public vaultSet;
    mapping(address => bool) public isFeeExempt;

    event TransferFeeRouted(address indexed from, address indexed to, uint256 feeAmount);

    constructor() ERC20("Cinder", "ASH") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000_000 * 10 ** decimals());
    }

    function initializeVaults(
        address _cashbackVault,
        address _creatorLock,
        address _burnVault
    ) external onlyOwner {
        require(!vaultSet, "Vaults already set");
        require(_cashbackVault != address(0), "Invalid vault address");
        
        cashbackVault = CashbackVault(_cashbackVault);
        
        isFeeExempt[_cashbackVault] = true;
        isFeeExempt[_creatorLock] = true;
        isFeeExempt[_burnVault] = true;
        
        vaultSet = true;
    }

    function _update(address from, address to, uint256 value) internal virtual override {
        if (
            from == address(0) || 
            to == address(0) || 
            !vaultSet ||
            isFeeExempt[from] ||
            isFeeExempt[to]
        ) {
            super._update(from, to, value);
            return;
        }

        uint256 fee = value / 100; // 1% fee
        uint256 amountAfterFee = value - fee;

        if (fee > 0) {
            super._update(from, address(cashbackVault), fee);
            emit TransferFeeRouted(from, to, fee);
            
            cashbackVault.recordVolume(from, value);
        }

        super._update(from, to, amountAfterFee);
    }
}
