// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

interface IAgentIDRegistry {
    function balanceOf(address owner) external view returns (uint256);
}

contract AgentCheckin is ERC721Enumerable, Ownable, Pausable, ReentrancyGuard {
    IAgentIDRegistry public registry;
    
    struct CheckinData {
        uint256 lastCheckin;
        uint256 streak;
    }
    
    mapping(address => CheckinData) public checkins;
    uint256 public totalCheckins;
    
    event CheckedIn(address indexed user, uint256 streak);
    event BadgeMinted(address indexed user, uint256 tokenId);
    
    constructor(address _registry) ERC721("AgentCheckinBadge", "ACB") Ownable(msg.sender) {
        registry = IAgentIDRegistry(_registry);
    }
    
    function setRegistry(address _registry) external onlyOwner {
        registry = IAgentIDRegistry(_registry);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function checkIn() external whenNotPaused nonReentrant {
        require(registry.balanceOf(msg.sender) > 0, "Must hold Agent ID");
        
        uint256 today = block.timestamp / 1 days;
        CheckinData storage data = checkins[msg.sender];
        
        require(data.lastCheckin / 1 days < today, "Already checked in today");
        
        // Update streak
        if (data.lastCheckin / 1 days == today - 1) {
            data.streak++;
        } else {
            data.streak = 1;
        }
        
        data.lastCheckin = block.timestamp;
        totalCheckins++;
        
        // Mint badge if not holding
        if (balanceOf(msg.sender) == 0) {
            _safeMint(msg.sender, totalSupply());
            emit BadgeMinted(msg.sender, totalSupply() - 1);
        }
        
        emit CheckedIn(msg.sender, data.streak);
    }
    
    function streakOf(address user) external view returns (uint256) {
        return checkins[user].streak;
    }
    
    function badgeOf(address user) external view returns (uint256) {
        if (balanceOf(user) > 0) {
            return tokenOfOwnerByIndex(user, 0);
        }
        return 0;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        address owner = ownerOf(tokenId);
        
        string memory agentName = "Unknown";
        (bool success, bytes memory data) = address(registry).staticcall(
            abi.encodeWithSignature("name(address)", owner)
        );
        if (success && data.length > 0) {
            try this._decodeName(data) returns (string memory decodedName) {
                if (bytes(decodedName).length > 0) {
                    agentName = decodedName;
                }
            } catch {}
        }
        
        uint256 streak = checkins[owner].streak;
        uint256 tier = this.tierOf(owner);
        
        string memory json = string(
            abi.encodePacked(
                '{"name": "Agent Checkin Badge #', toString(tokenId), 
                '", "description": "Daily check-in badge for Agent ID holders", "attributes": [{"trait_type": "Agent Name", "value": "', agentName, 
                '"}, {"trait_type": "Streak", "value": ', toString(streak), 
                '}, {"trait_type": "Tier", "value": ', toString(tier), '}]}'
            )
        );
        
        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(json))));
    }

    function _decodeName(bytes memory data) external pure returns (string memory) {
        return abi.decode(data, (string));
    }

    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    function tierOf(address user) external view returns (uint256) {
        uint256 streak = checkins[user].streak;
        if (streak >= 30) return 3;
        if (streak >= 7) return 2;
        return 1;
    }
}
