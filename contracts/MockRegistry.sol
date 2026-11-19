// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract MockRegistry {
    mapping(address => uint256) public balances;
    mapping(address => string) public handles;
    
    function setBalance(address user, uint256 balance) external {
        balances[user] = balance;
    }
    
    function setHandle(address user, string calldata handle) external {
        handles[user] = handle;
    }
    
    function balanceOf(address owner) external view returns (uint256) {
        return balances[owner];
    }
    
    function handleOf(address owner) external view returns (string memory) {
        return handles[owner];
    }
}
