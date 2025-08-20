const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying KaiaFi Lending Protocol to Kaia Network...");
  
  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString());

  // Deploy Interest Rate Model
  console.log("\n📊 Deploying Interest Rate Model...");
  const InterestRateModel = await ethers.getContractFactory("InterestRateModel");
  const interestRateModel = await InterestRateModel.deploy();
  await interestRateModel.deployed();
  console.log("✅ Interest Rate Model deployed to:", interestRateModel.address);

  // Deploy Liquidation Contract
  console.log("\n⚡ Deploying Liquidation Contract...");
  const Liquidation = await ethers.getContractFactory("Liquidation");
  const liquidation = await Liquidation.deploy(ethers.constants.AddressZero); // Will be updated after LendingPool deployment
  await liquidation.deployed();
  console.log("✅ Liquidation Contract deployed to:", liquidation.address);

  // Deploy Lending Pool
  console.log("\n🏦 Deploying Lending Pool...");
  const LendingPool = await ethers.getContractFactory("LendingPool");
  const lendingPool = await LendingPool.deploy(interestRateModel.address, liquidation.address);
  await lendingPool.deployed();
  console.log("✅ Lending Pool deployed to:", lendingPool.address);

  // Update Liquidation Contract with Lending Pool address
  console.log("\n🔗 Updating Liquidation Contract...");
  await liquidation.setLendingPool(lendingPool.address);
  console.log("✅ Liquidation Contract updated");

  // Deploy Mock USDT
  console.log("\n💵 Deploying Mock USDT...");
  const MockUSDT = await ethers.getContractFactory("MockUSDT");
  const mockUSDT = await MockUSDT.deploy();
  await mockUSDT.deployed();
  console.log("✅ Mock USDT deployed to:", mockUSDT.address);

  // Add USDT as supported asset
  console.log("\n➕ Adding USDT as supported asset...");
  const maxLTV = ethers.utils.parseEther("0.75"); // 75% LTV
  const liquidationThreshold = ethers.utils.parseEther("0.80"); // 80% liquidation threshold
  const liquidationPenalty = ethers.utils.parseEther("0.05"); // 5% liquidation penalty
  
  await lendingPool.addAsset(
    mockUSDT.address,
    maxLTV,
    liquidationThreshold,
    liquidationPenalty
  );
  console.log("✅ USDT added as supported asset");

  // Mint some USDT to the lending pool for initial liquidity
  console.log("\n💸 Minting initial USDT to lending pool...");
  const initialLiquidity = ethers.utils.parseUnits("100000", 6); // 100k USDT
  await mockUSDT.mint(lendingPool.address, initialLiquidity);
  console.log("✅ Initial liquidity added");

  // Deploy Mock KAI Token
  console.log("\n🚀 Deploying Mock KAI Token...");
  const MockKAI = await ethers.getContractFactory("MockKAI");
  const mockKAI = await MockKAI.deploy();
  await mockKAI.deployed();
  console.log("✅ Mock KAI deployed to:", mockKAI.address);

  // Add KAI as supported asset
  console.log("\n➕ Adding KAI as supported asset...");
  const kaiMaxLTV = ethers.utils.parseEther("0.60"); // 60% LTV for KAI
  const kaiLiquidationThreshold = ethers.utils.parseEther("0.65"); // 65% liquidation threshold
  
  await lendingPool.addAsset(
    mockKAI.address,
    kaiMaxLTV,
    kaiLiquidationThreshold,
    liquidationPenalty
  );
  console.log("✅ KAI added as supported asset");

  // Mint some KAI to the lending pool
  console.log("\n💸 Minting initial KAI to lending pool...");
  const initialKaiLiquidity = ethers.utils.parseEther("50000"); // 50k KAI
  await mockKAI.mint(lendingPool.address, initialKaiLiquidity);
  console.log("✅ Initial KAI liquidity added");

  // Deploy Mock KRW Stablecoin
  console.log("\n🇰🇷 Deploying Mock KRW Stablecoin...");
  const MockKRW = await ethers.getContractFactory("MockKRW");
  const mockKRW = await MockKRW.deploy();
  await mockKRW.deployed();
  console.log("✅ Mock KRW deployed to:", mockKRW.address);

  // Add KRW as supported asset
  console.log("\n➕ Adding KRW as supported asset...");
  const krwMaxLTV = ethers.utils.parseEther("0.85"); // 85% LTV for KRW
  const krwLiquidationThreshold = ethers.utils.parseEther("0.90"); // 90% liquidation threshold
  
  await lendingPool.addAsset(
    mockKRW.address,
    krwMaxLTV,
    krwLiquidationThreshold,
    liquidationPenalty
  );
  console.log("✅ KRW added as supported asset");

  // Mint some KRW to the lending pool
  console.log("\n💸 Minting initial KRW to lending pool...");
  const initialKrwLiquidity = ethers.utils.parseUnits("100000", 6); // 100k KRW
  await mockKRW.mint(lendingPool.address, initialKrwLiquidity);
  console.log("✅ Initial KRW liquidity added");

  // Transfer ownership of tokens to lending pool for future management
  console.log("\n🔐 Transferring token ownership...");
  await mockUSDT.transferOwnership(lendingPool.address);
  await mockKAI.transferOwnership(lendingPool.address);
  await mockKRW.transferOwnership(lendingPool.address);
  console.log("✅ Token ownership transferred");

  // Print deployment summary
  console.log("\n🎉 DEPLOYMENT COMPLETE!");
  console.log("==================================");
  console.log("📊 Interest Rate Model:", interestRateModel.address);
  console.log("⚡ Liquidation Contract:", liquidation.address);
  console.log("🏦 Lending Pool:", lendingPool.address);
  console.log("💵 Mock USDT:", mockUSDT.address);
  console.log("🚀 Mock KAI:", mockKAI.address);
  console.log("🇰🇷 Mock KRW:", mockKRW.address);
  console.log("==================================");
  console.log("\n🔗 Next steps:");
  console.log("1. Update frontend with contract addresses");
  console.log("2. Test lending and borrowing functions");
  console.log("3. Verify on Kaia Network explorer");
  console.log("4. Submit to hackathon!");

  // Save deployment addresses to file
  const deploymentInfo = {
    network: "Kaia Testnet",
    deployer: deployer.address,
    contracts: {
      interestRateModel: interestRateModel.address,
      liquidation: liquidation.address,
      lendingPool: lendingPool.address,
      mockUSDT: mockUSDT.address,
      mockKAI: mockKAI.address,
      mockKRW: mockKRW.address
    },
    timestamp: new Date().toISOString()
  };

  const fs = require('fs');
  fs.writeFileSync(
    'deployment.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\n💾 Deployment info saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 