// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.19;
/**
 * @title MyValContract
 * @dev Store & retrieve value in a variable
 */
contract TaskCon{
    address public owner;
    address public tokenaddress;

    constructor(){
        owner = msg.sender;
        
    }
    event AddProject(address recipient, uint projectid);
}