// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract MockRegistry {
    mapping(address => uint256) public balances;
    mapping(address => string) public names;
    
    function setBalance(address user, uint256 balance) external {
        balances[user] = balance;
    }
    
    function setName(address user, string calldata name) external {
        names[user] = name;
    }
    
    function balanceOf(address owner) external view returns (uint256) {
        return balances[owner];
    }
    
    function name(address owner) external view returns (string memory) {
        return names[owner];
    }
}
