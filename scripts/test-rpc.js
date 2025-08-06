const { ethers } = require("hardhat");

const RPC_ENDPOINTS = [
  "https://rpc.ankr.com/etherlink_testnet",
  "https://node.ghostnet.etherlink.com",
  "https://node.ghostnet.tezos.marigold.dev",
  "https://ghostnet.tezos.marigold.dev",
];

async function testRpcEndpoint(url) {
  console.log(`\n🔍 Testing RPC endpoint: ${url}`);

  try {
    const provider = new ethers.JsonRpcProvider(url);

    // Test basic connection
    const blockNumber = await provider.getBlockNumber();
    console.log(`✅ Connected! Current block: ${blockNumber}`);

    // Test network info
    const network = await provider.getNetwork();
    console.log(`✅ Network: ${network.name}, Chain ID: ${network.chainId}`);

    return { url, success: true, blockNumber, chainId: network.chainId };
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
    return { url, success: false, error: error.message };
  }
}

async function main() {
  console.log("🚀 Testing Etherlink RPC endpoints...\n");

  const results = [];

  for (const endpoint of RPC_ENDPOINTS) {
    const result = await testRpcEndpoint(endpoint);
    results.push(result);

    // Wait a bit between tests
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.log("\n📊 Results Summary:");
  console.log("==================");

  const workingEndpoints = results.filter((r) => r.success);

  if (workingEndpoints.length > 0) {
    console.log("✅ Working endpoints:");
    workingEndpoints.forEach((result, index) => {
      console.log(`${index + 1}. ${result.url}`);
      console.log(
        `   Block: ${result.blockNumber}, Chain ID: ${result.chainId}`,
      );
    });

    console.log("\n🎯 Recommended endpoint:");
    console.log(workingEndpoints[0].url);

    console.log("\n📝 Update your .env file with:");
    console.log(`ETHERLINK_TESTNET_RPC_URL=${workingEndpoints[0].url}`);
  } else {
    console.log("❌ No working endpoints found!");
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Check your internet connection");
    console.log("2. Try using a VPN");
    console.log("3. Check if the RPC endpoints are down");
    console.log("4. Try alternative RPC providers");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
