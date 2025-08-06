# 🚀 Etherlink Testnet Deployment Guide

This guide will help you deploy the GameTokenFactory contracts to Etherlink testnet.

## 📋 Prerequisites

1. **Node.js 18+** installed
2. **MetaMask** or similar wallet with Etherlink testnet configured
3. **Etherlink testnet XTZ** (get from [Etherlink Faucet](https://faucet.etherlink.com/))

## 🔧 Setup Steps

### 1. Environment Configuration

Create a `.env` file in the root directory:

```env
# Etherlink Testnet RPC URL
ETHERLINK_TESTNET_RPC_URL=https://node.ghostnet.tezos.marigold.dev

# Your private key (for deployment)
PRIVATE_KEY=your_private_key_here

# Optional: Etherlink API key for verification
ETHERLINK_API_KEY=your_etherlink_api_key_here
```

### 2. Get Etherlink Testnet XTZ

1. Visit [Etherlink Faucet](https://faucet.etherlink.com/)
2. Connect your wallet
3. Request testnet XTZ

### 3. Configure MetaMask for Etherlink Testnet

Add Etherlink testnet to MetaMask:

- **Network Name**: Etherlink Testnet
- **RPC URL**: `https://node.ghostnet.tezos.marigold.dev`
- **Chain ID**: `128123`
- **Currency Symbol**: `XTZ`
- **Block Explorer**: `https://testnet-explorer.etherlink.com`

### 4. Deploy Contracts

```bash
# Compile contracts
npx hardhat compile

# Deploy to Etherlink testnet
npx hardhat run scripts/deploy.js --network etherlinkTestnet
```

### 5. Update Contract Addresses

After deployment, you'll see output like this:

```json
{
  "gameTokenTemplate": "0x...",
  "gameTokenFactory": "0x...",
  "deployer": "0x...",
  "network": "etherlinkTestnet",
  "chainId": 128123
}
```

Update the addresses in `lib/contracts.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  GAME_TOKEN_FACTORY: "0x...", // Your deployed factory address
  GAME_TOKEN_TEMPLATE: "0x...", // Your deployed template address
} as const;
```

### 6. Verify Contracts (Optional)

```bash
# Verify GameTokenFactory
npx hardhat verify --network etherlinkTestnet DEPLOYED_FACTORY_ADDRESS DEPLOYER_ADDRESS

# Verify GameToken template
npx hardhat verify --network etherlinkTestnet DEPLOYED_TEMPLATE_ADDRESS 0 "Template Game" "TEMP" "Template game description" "https://example.com/template.png" DEPLOYER_ADDRESS
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

   - Make sure you're connected to Etherlink testnet
   - Ensure you have some testnet XTZ

4. **Test the functionality**:
   - Create a new game token
   - Mint tokens to addresses
   - Burn tokens from addresses
   - View game information and metadata

## 🔍 Troubleshooting

### Common Issues

1. **"Insufficient funds" error**:

   - Get more Etherlink testnet XTZ from the faucet

2. **"Network not supported" error**:

   - Make sure your wallet is connected to Etherlink testnet
   - Chain ID should be 128123

3. **"Contract not found" error**:

   - Verify the contract addresses are correct in `lib/contracts.ts`
   - Make sure contracts were deployed successfully

4. **"Transaction failed" error**:
   - Check if you have enough XTZ for gas fees
   - Verify the contract addresses are correct

### Debugging

1. **Check contract deployment**:

   ```bash
   npx hardhat run scripts/deploy.js --network etherlinkTestnet
   ```

2. **View deployment logs**:

   - Check the console output for any errors
   - Verify the contract addresses are valid

3. **Test on local network first**:
   ```bash
   npx hardhat run scripts/deploy.js --network hardhat
   ```

## 📊 Gas Costs

Estimated gas costs for Etherlink testnet:

- **Deploy GameToken template**: ~1,500,000 gas
- **Deploy GameTokenFactory**: ~800,000 gas
- **Create game token**: ~2,000,000 gas
- **Mint tokens**: ~50,000 gas
- **Burn tokens**: ~50,000 gas

## 🔗 Useful Links

- [Etherlink Faucet](https://faucet.etherlink.com/)
- [Etherlink Explorer](https://testnet-explorer.etherlink.com/)
- [Etherlink Documentation](https://docs.etherlink.com/)
- [Hardhat Documentation](https://hardhat.org/docs)

## 🎯 Next Steps

After successful deployment:

1. **Test all functionality** on the test page
2. **Integrate with your main app** (I'll help with this once deployed)
3. **Deploy to mainnet** when ready (Etherlink mainnet)
4. **Add more features** like token transfers, staking, etc.

## 🆘 Need Help?

If you encounter issues:

1. Check the console for error messages
2. Verify your wallet is connected to Etherlink testnet
3. Ensure you have sufficient testnet XTZ
4. Double-check contract addresses in the configuration

## 🌟 Etherlink Benefits

- **EVM Compatible**: Full Ethereum compatibility
- **Low Gas Fees**: Much cheaper than Ethereum mainnet
- **Fast Transactions**: Quick block times
- **Tezos Integration**: Built on Tezos infrastructure

---

**Happy Deploying! 🚀**
