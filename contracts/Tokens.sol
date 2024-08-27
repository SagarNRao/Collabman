// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; // Import the ERC20 contract

contract MyTokenContract is ERC20 {
    constructor() ERC20("CollaboratorToken", "CK") {
        // Initialize the token with a total supply of 1 million tokens
        _mint(msg.sender, 1000000 * (10**decimals()));
    }
}