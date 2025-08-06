# Game Token Factory - Hardhat Project

This Hardhat project contains smart contracts for creating game-specific tokens. Each game can have its own ERC-20 token with minting and burning capabilities.

## 🏗️ Architecture

### Contracts

1. **GameToken.sol** - Individual game token contract

   - ERC-20 token with 18 decimals
   - Initial supply: 1,000,000 tokens
   - Max supply: 10,000,000 tokens
   - Owner can mint/burn tokens with reasons
   - Stores game metadata (name, description, image URI)

2. **GameTokenFactory.sol** - Factory contract for deploying game tokens
   - Creates new GameToken contracts for each game
   - Tracks all created games
   - Provides query functions for game information
   - Uses CREATE2 for deterministic addresses

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or similar wallet
- Base Sepolia testnet ETH

### Installation

```bash
# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Run tests with coverage
npx hardhat coverage
```

### Environment Setup

Create a `.env` file in the root directory:

```env
# Base Sepolia RPC URL
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Your private key (for deployment)
PRIVATE_KEY=your_private_key_here

# Optional: BaseScan API key for verification
BASESCAN_API_KEY=your_basescan_api_key_here

# Optional: Gas reporting
REPORT_GAS=true
```

### Deployment

```bash
# Deploy to Base Sepolia testnet
npx hardhat run scripts/deploy.js --network baseSepolia

# Deploy to local network for testing
npx hardhat run scripts/deploy.js --network hardhat
```

### Verification

```bash
# Verify contracts on BaseScan
npx hardhat verify --network baseSepolia DEPLOYED_CONTRACT_ADDRESS
```

## 📋 Contract Functions

### GameTokenFactory

#### Write Functions

- `createGameToken(gameName, gameSymbol, gameDescription, gameImageUri)` - Creates a new game token
- `setGameTokenTemplate(templateAddress)` - Sets the token template (owner only)

#### Read Functions

- `getGame(gameId)` - Get game information by ID
- `getGameByToken(tokenAddress)` - Get game information by token address
- `getGamesByCreator(creatorAddress)` - Get all games by a creator
- `getTotalGames()` - Get total number of games created
- `gameExists(gameId)` - Check if a game exists
- `isValidGameToken(tokenAddress)` - Check if address is a valid game token

### GameToken

#### Write Functions

- `mint(to, amount, reason)` - Mint tokens to an address (owner only)
- `burn(from, amount, reason)` - Burn tokens from an address (owner only)
- Standard ERC-20 functions (transfer, approve, etc.)

#### Read Functions

- `getGameMetadata()` - Get game metadata and token info
- Standard ERC-20 functions (balanceOf, totalSupply, etc.)

## 🧪 Testing

The project includes comprehensive tests covering:

- Contract deployment
- Game token creation
- Minting and burning functionality
- Access control
- Factory queries
- Error handling

Run tests:

```bash
npx hardhat test
```

Run specific test file:

```bash
npx hardhat test test/GameTokenFactory.test.js
```

## 🔧 Integration with Frontend

### TypeScript Integration

The `lib/contracts.ts` file provides TypeScript interfaces and utility functions for frontend integration:

```typescript
import { createGameToken, getGameInfo, mintTokens } from "@/lib/contracts";

// Create a new game token
const result = await createGameToken(walletClient, {
  gameName: "My Game",
  gameSymbol: "GAME",
  gameDescription: "A fun game",
  gameImageUri: "https://example.com/game.png",
});

// Get game information
const gameInfo = await getGameInfo(result.gameId);

// Mint tokens
await mintTokens(walletClient, result.tokenAddress, {
  to: "0x...",
  amount: ethers.parseEther("1000"),
  reason: "game_reward",
});
```

### Frontend Integration Steps

1. **Update Contract Addresses**: After deployment, update the addresses in `lib/contracts.ts`
2. **Generate ABIs**: Use `npx hardhat export-abi` to generate updated ABIs
3. **Environment Variables**: Add contract addresses to your frontend environment

## 🎮 Game Integration Examples

### Creating a Game Token

```javascript
// When a user creates a new game
const gameToken = await gameTokenFactory.createGameToken(
  "Space Invaders",
  "SPACE",
  "Classic space shooter game",
  "https://example.com/space-invaders.png",
);
```

### Rewarding Players

```javascript
// When a player achieves something
await gameToken.mint(playerAddress, ethers.parseEther("100"), "level_complete");
```

### Game Costs

```javascript
// When a player spends tokens
await gameToken.burn(
  playerAddress,
  ethers.parseEther("50"),
  "power_up_purchase",
);
```

## 🔒 Security Features

- **Access Control**: Only token owners can mint/burn
- **Supply Limits**: Cannot exceed max supply
- **Input Validation**: Proper validation for game names and symbols
- **Event Logging**: All important actions emit events
- **Deterministic Addresses**: CREATE2 ensures predictable addresses

## 📊 Gas Optimization

- Contract uses Solidity 0.8.20 with optimizer enabled
- Efficient storage patterns
- Minimal external calls
- Optimized for Base Sepolia network

## 🚨 Important Notes

1. **Testnet Only**: Currently configured for Base Sepolia testnet
2. **Private Key Security**: Never commit private keys to version control
3. **Gas Costs**: Base Sepolia has lower gas costs than Ethereum mainnet
4. **Token Economics**: Each game starts with 1M tokens, max 10M
5. **Upgradeability**: Contracts are not upgradeable by design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues or questions:

1. Check the test files for usage examples
2. Review the contract comments for detailed function descriptions
3. Open an issue on GitHub

---

**Happy Gaming! 🎮**
