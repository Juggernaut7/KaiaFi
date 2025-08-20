const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("KaiaFi Lending Protocol", function () {
  let interestRateModel;
  let liquidation;
  let lendingPool;
  let mockUSDT;
  let mockKAI;
  let mockKRW;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy Interest Rate Model
    const InterestRateModel = await ethers.getContractFactory("InterestRateModel");
    interestRateModel = await InterestRateModel.deploy();

    // Deploy Liquidation Contract
    const Liquidation = await ethers.getContractFactory("Liquidation");
    liquidation = await Liquidation.deploy(ethers.constants.AddressZero);

    // Deploy Lending Pool
    const LendingPool = await ethers.getContractFactory("LendingPool");
    lendingPool = await LendingPool.deploy(interestRateModel.address, liquidation.address);

    // Update Liquidation Contract with Lending Pool address
    await liquidation.setLendingPool(lendingPool.address);

    // Deploy Mock Tokens
    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    mockUSDT = await MockUSDT.deploy();

    const MockKAI = await ethers.getContractFactory("MockKAI");
    mockKAI = await MockKAI.deploy();

    const MockKRW = await ethers.getContractFactory("MockKRW");
    mockKRW = await MockKRW.deploy();
  });

  describe("Deployment", function () {
    it("Should deploy all contracts successfully", async function () {
      expect(interestRateModel.address).to.not.equal(ethers.constants.AddressZero);
      expect(liquidation.address).to.not.equal(ethers.constants.AddressZero);
      expect(lendingPool.address).to.not.equal(ethers.constants.AddressZero);
      expect(mockUSDT.address).to.not.equal(ethers.constants.AddressZero);
      expect(mockKAI.address).to.not.equal(ethers.constants.AddressZero);
      expect(mockKRW.address).to.not.equal(ethers.constants.AddressZero);
    });

    it("Should set correct addresses in LendingPool", async function () {
      expect(await lendingPool.interestRateModel()).to.equal(interestRateModel.address);
      expect(await lendingPool.liquidationContract()).to.equal(liquidation.address);
    });

    it("Should set correct address in Liquidation", async function () {
      expect(await liquidation.lendingPool()).to.equal(lendingPool.address);
    });
  });

  describe("Asset Management", function () {
    it("Should add USDT as supported asset", async function () {
      const maxLTV = ethers.utils.parseEther("0.75"); // 75%
      const liquidationThreshold = ethers.utils.parseEther("0.80"); // 80%
      const liquidationPenalty = ethers.utils.parseEther("0.05"); // 5%

      await lendingPool.addAsset(
        mockUSDT.address,
        maxLTV,
        liquidationThreshold,
        liquidationPenalty
      );

      const asset = await lendingPool.getAsset(mockUSDT.address);
      expect(asset.isActive).to.be.true;
      expect(asset.maxLTV).to.equal(maxLTV);
      expect(asset.liquidationThreshold).to.equal(liquidationThreshold);
    });
  });

  describe("Interest Rate Model", function () {
    it("Should calculate correct base rate", async function () {
      const baseRate = await interestRateModel.getBaseRate();
      expect(baseRate).to.equal(ethers.utils.parseEther("0.02")); // 2%
    });

    it("Should calculate correct multiplier", async function () {
      const multiplier = await interestRateModel.getMultiplier();
      expect(multiplier).to.equal(ethers.utils.parseEther("0.20")); // 20%
    });

    it("Should calculate correct kink point", async function () {
      const kink = await interestRateModel.getKink();
      expect(kink).to.equal(ethers.utils.parseEther("0.80")); // 80%
    });
  });

  describe("Liquidation", function () {
    it("Should have correct health factor threshold", async function () {
      const threshold = await liquidation.getHealthFactorThreshold();
      expect(threshold).to.equal(ethers.utils.parseEther("1.0")); // 1.0
    });

    it("Should have correct default close factor", async function () {
      const closeFactor = await liquidation.getDefaultCloseFactor();
      expect(closeFactor).to.equal(ethers.utils.parseEther("0.5")); // 50%
    });

    it("Should have correct liquidation incentive", async function () {
      const incentive = await liquidation.getDefaultLiquidationIncentive();
      expect(incentive).to.equal(ethers.utils.parseEther("0.05")); // 5%
    });
  });

  describe("Market Data", function () {
    it("Should return market data", async function () {
      const marketData = await lendingPool.getMarketData();
      expect(marketData.totalValueLocked).to.be.gt(0);
      expect(marketData.totalBorrowed).to.be.gt(0);
      expect(marketData.averageAPY).to.be.gt(0);
      expect(marketData.utilizationRate).to.be.gt(0);
    });
  });
}); 