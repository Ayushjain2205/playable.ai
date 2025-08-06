# 🚀 Game Token Factory Deployment Guide

This guide will help you deploy the GameTokenFactory contracts to Base Sepolia testnet.

## 📋 Prerequisites

1. **Node.js 18+** installed
2. **MetaMask** or similar wallet with Base Sepolia testnet configured
3. **Base Sepolia testnet ETH** (get from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet))

## 🔧 Setup Steps

### 1. Environment Configuration

Create a `.env` file in the root directory:

```env
# Base Sepolia RPC URL
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Your private key (for deployment)
PRIVATE_KEY=your_private_key_here

# Optional: BaseScan API key for verification
BASESCAN_API_KEY=your_basescan_api_key_here
```

### 2. Get Base Sepolia Testnet ETH

1. Visit [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
2. Connect your wallet
3. Request testnet ETH

### 3. Deploy Contracts

```bash
# Compile contracts
npx hardhat compile

# Deploy to Base Sepolia testnet
npx hardhat run scripts/deploy.js --network baseSepolia
```

### 4. Update Contract Addresses

After deployment, you'll see output like this:

```json
{
  "gameTokenTemplate": "0x...",
  "gameTokenFactory": "0x...",
  "deployer": "0x...",
  "network": "baseSepolia",
  "chainId": 84532
}
```

Update the addresses in `lib/contracts.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  GAME_TOKEN_FACTORY: "0x...", // Your deployed factory address
  GAME_TOKEN_TEMPLATE: "0x...", // Your deployed template address
} as const;
```

### 5. Verify Contracts (Optional)

```bash
# Verify GameTokenFactory
npx hardhat verify --network baseSepolia DEPLOYED_FACTORY_ADDRESS DEPLOYER_ADDRESS

# Verify GameToken template
npx hardhat verify --network baseSepolia DEPLOYED_TEMPLATE_ADDRESS 0 "Template Game" "TEMP" "Template game description" "https://example.com/template.png" DEPLOYER_ADDRESS
```

## 🧪 Testing the Deployment

1. **Start the development server**:

   ```bash
   npm run dev
   ```

2. **Navigate to the test page**:

   - Go to `http://localhost:3000/test-token-factory`
   - Or click "🧪 Test Token Factory" in the header

3. **Connect your wallet**:

   - Make sure you're connected to Base Sepolia testnet
   - Ensure you have some testnet ETH

4. **Test the functionality**:
   - Create a new game token
   - Mint tokens to addresses
   - Burn tokens from addresses
   - View game information and metadata

## 🔍 Troubleshooting

### Common Issues

1. **"Insufficient funds" error**:

   - Get more Base Sepolia testnet ETH from the faucet

2. **"Network not supported" error**:

   - Make sure your wallet is connected to Base Sepolia testnet
   - Chain ID should be 84532

3. **"Contract not found" error**:

   - Verify the contract addresses are correct in `lib/contracts.ts`
   - Make sure contracts were deployed successfully

4. **"Transaction failed" error**:
   - Check if you have enough ETH for gas fees
   - Verify the contract addresses are correct

### Debugging

1. **Check contract deployment**:

   ```bash
   npx hardhat run scripts/deploy.js --network baseSepolia
   ```

2. **View deployment logs**:

   - Check the console output for any errors
   - Verify the contract addresses are valid

3. **Test on local network first**:
   ```bash
   npx hardhat run scripts/deploy.js --network hardhat
   ```

## 📊 Gas Costs

Estimated gas costs for Base Sepolia:

- **Deploy GameToken template**: ~1,500,000 gas
- **Deploy GameTokenFactory**: ~800,000 gas
- **Create game token**: ~2,000,000 gas
- **Mint tokens**: ~50,000 gas
- **Burn tokens**: ~50,000 gas

## 🔗 Useful Links

- [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
- [Base Sepolia Explorer](https://sepolia.basescan.org/)
- [Base Documentation](https://docs.base.org/)
- [Hardhat Documentation](https://hardhat.org/docs)

## 🎯 Next Steps

After successful deployment:

1. **Test all functionality** on the test page
2. **Integrate with your main app** (I'll help with this once deployed)
3. **Deploy to mainnet** when ready (Base mainnet)
4. **Add more features** like token transfers, staking, etc.

## 🆘 Need Help?

If you encounter issues:

1. Check the console for error messages
2. Verify your wallet is connected to Base Sepolia
3. Ensure you have sufficient testnet ETH
4. Double-check contract addresses in the configuration

---

**Happy Deploying! 🚀**
