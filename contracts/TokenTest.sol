// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; // Import the ERC20 contract


contract TestTokenReward {
    // Mapping of user addresses to their TTK balances
    mapping (address => uint256) public balances;

    // Fixed amount of TTK tokens to distribute
    uint256 public tokenAmount = 100 * (10**18);

    // Event emitted when a user claims TTK tokens
    event TokensClaimed(address user, uint256 amount);

    // Constructor function
    constructor() public {
        // Initialize the contract owner's address
        address owner = msg.sender;

        // Set the total supply of TTK tokens
        uint256 totalSupply = 1000000 * (10**18);

        // Set the initial balance of the contract owner
        balances[owner] = totalSupply;
    }

    // Function to claim TTK tokens
    function claimTokens() public {
        // Get the user's address
        address user = msg.sender;

        // Check if the user has already claimed tokens
        require(balances[user] == 0, "User has already claimed tokens");

        // Transfer the fixed amount of TTK tokens to the user
        balances[user] += tokenAmount;
        balances[address(this)] -= tokenAmount;

        // Emit the TokensClaimed event
        emit TokensClaimed(user, tokenAmount);
    }

    // Function to get a user's TTK balance
    function getBalance(address user) public view returns (uint256) {
        return balances[user];
    }
}