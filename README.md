# AgentCheckin

Daily check-in badges for Agent ID holders — built for the Binance Agent ID Hackathon.

## Features
- Daily check-in, only for Agent ID holders (verified on-chain via Registry 0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F).
- First check-in mints a Badge NFT (ERC-721) with dynamic metadata including Agent Name, streak, and tier.
- Streak tracking: 7 days -> Tier 2, 30 days -> Tier 3.

## Usage
- Deploy: `npm run deploy` (requires BSC network configuration or local environment)
- Verify: `CONTRACT_ADDRESS=<deployed-address> npm run verify`
- Tests: `npm test`

## Owner Permissions
- `pause()` / `unpause()`: Emergency pause functionality.
- `setRegistry(address)`: Update registry address if needed.

## Audit Notes
- Reentrancy: `checkIn()` uses `nonReentrant` modifier to prevent reentrancy attacks.
- Overflow: Solidity 0.8.27 has built-in overflow protection.
- Access Control: `Ownable` is used for owner-only functions.
- Gas Usage: Deployment gas is approximately 3.4M gas, estimated cost 0.006 BNB in the local dry run, about 0.010 BNB at 3 gwei.
