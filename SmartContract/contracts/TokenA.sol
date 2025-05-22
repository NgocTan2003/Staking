// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TokenA is ERC20, Ownable, ReentrancyGuard {
    uint256 public constant MAX_SUPPLY = 500000000 * 10 ** 18;
    uint256 public constant MAX_FAUCET_AMOUNT = 3000000 * 10 ** 18;
    address public _stakingContract;

    constructor() ERC20("Token A", "TKA") Ownable(msg.sender) {
        _mint(address(this), MAX_SUPPLY);
    }

    function setStakingContract(address stakingContract) external onlyOwner {
        _stakingContract = stakingContract;
    }

    function faucet(uint256 amount) public nonReentrant {
        require(
            amount <= MAX_FAUCET_AMOUNT,
            "Faucet: Amount exceed the allowable limit"
        );
        require(
            balanceOf(address(this)) >= amount,
            "Faucet: Not enough token to faucet"
        );
        _transfer(address(this), msg.sender, amount);
        // emit Transfer(address(this), msg.sender, amount);
    }

    function transferReward(
        address to,
        uint256 amount
    ) external nonReentrant returns (bool) {
        require(amount > 0, "No reward to withdraw");
        require(
            balanceOf(address(this)) >= amount,
            "Not enough tokens in contract"
        );
        require(
            msg.sender == _stakingContract,
            "Can't withdraw rewards from other contracts"
        );
        _transfer(address(this), to, amount);
        return true;
    }

    function getContractBalance() public view returns (uint256) {
        return balanceOf(address(this));
    }
}