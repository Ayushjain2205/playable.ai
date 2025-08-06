const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment...");

  // Get the deployer account
  const signers = await ethers.getSigners();

  if (signers.length === 0) {
    console.error(
      "❌ No signers found. Please check your private key configuration.",
    );
    console.log("📝 Make sure you have set PRIVATE_KEY in your .env file");
    process.exit(1);
  }

  const [deployer] = signers;
  console.log("Deploying contracts with account:", deployer.address);
  console.log(
    "Account balance:",
    (await ethers.provider.getBalance(deployer.address)).toString(),
  );

  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId);

  // Deploy GameToken template first
  console.log("\n📦 Deploying GameToken template...");
  const GameToken = await ethers.getContractFactory("GameToken");

  // Deploy a template instance (we'll use dummy values for the template)
  const gameTokenTemplate = await GameToken.deploy(
    0, // gameId
    "Template Game", // gameName
    "TEMP", // symbol
    "Template game description", // gameDescription
    "https://example.com/template.png", // gameImageUri
    deployer.address, // creator
  );

  await gameTokenTemplate.waitForDeployment();
  console.log(
    "✅ GameToken template deployed to:",
    await gameTokenTemplate.getAddress(),
  );

  // Deploy GameTokenFactory
  console.log("\n🏭 Deploying GameTokenFactory...");
  const GameTokenFactory = await ethers.getContractFactory("GameTokenFactory");
  const gameTokenFactory = await GameTokenFactory.deploy(deployer.address);

  await gameTokenFactory.waitForDeployment();
  console.log(
    "✅ GameTokenFactory deployed to:",
    await gameTokenFactory.getAddress(),
  );

  // Set the template in the factory
  console.log("\n🔧 Setting template in factory...");
  const setTemplateTx = await gameTokenFactory.setGameTokenTemplate(
    await gameTokenTemplate.getAddress(),
  );
  await setTemplateTx.wait();
  console.log("✅ Template set in factory");

  // Verify the setup
  console.log("\n🔍 Verifying deployment...");
  const templateAddress = await gameTokenFactory.gameTokenTemplate();
  console.log("Template address in factory:", templateAddress);

  const totalGames = await gameTokenFactory.getTotalGames();
  console.log("Total games created:", totalGames.toString());

  console.log("\n🎉 Deployment completed successfully!");
  console.log("📋 Deployment Summary:");
  console.log("GameToken Template:", await gameTokenTemplate.getAddress());
  console.log("GameTokenFactory:", await gameTokenFactory.getAddress());
  console.log("Deployer:", deployer.address);
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId);

  // Save deployment addresses for frontend integration
  const deploymentInfo = {
    gameTokenTemplate: await gameTokenTemplate.getAddress(),
    gameTokenFactory: await gameTokenFactory.getAddress(),
    deployer: deployer.address,
    network: network.name,
    chainId: Number(network.chainId),
  };

  console.log("\n📄 Deployment Info (for frontend):");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Save to file for easy reference
  const fs = require("fs");
  const deploymentFile = `deployment-${network.name}-${Date.now()}.json`;
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n💾 Deployment info saved to: ${deploymentFile}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
