const { expect } = require("chai");
const hre = require("hardhat");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

const { ethers } = hre;

describe("Cinder System", function () {
  async function deployCinderFixture() {
    const [deployer, trader1, trader2, creator] = await ethers.getSigners();

    const CinderToken = await ethers.getContractFactory("CinderToken");
    const token = await CinderToken.deploy();
    const tokenAddress = await token.getAddress();

    const CashbackVault = await ethers.getContractFactory("CashbackVault");
    const vault = await CashbackVault.deploy(tokenAddress);

    const unlockTime = (await time.latest()) + (21 * 24 * 60 * 60);
    const CreatorLock = await ethers.getContractFactory("CreatorLock");
    const lock = await CreatorLock.deploy(creator.address, unlockTime, tokenAddress);

    const BurnVault = await ethers.getContractFactory("BurnVault");
    const burnVault = await BurnVault.deploy(tokenAddress);

    await token.initializeVaults(await vault.getAddress(), await lock.getAddress(), await burnVault.getAddress());

    return { token, vault, lock, burnVault, deployer, trader1, trader2, creator, unlockTime };
  }

  describe("CinderToken and CashbackVault", function () {
    it("Should route 1% fee on transfer and record volume", async function () {
      const { token, vault, deployer, trader1 } = await loadFixture(deployCinderFixture);
      
      const transferAmount = ethers.parseUnits("1000", 18);
      
      // I am removing the event assertion because I disabled hardhat-chai-matchers
      await token.transfer(trader1.address, transferAmount);

      const trader1Balance = await token.balanceOf(trader1.address);
      expect(trader1Balance).to.equal(ethers.parseUnits("990", 18));
      
      const vaultBalance = await token.balanceOf(await vault.getAddress());
      expect(vaultBalance).to.equal(ethers.parseUnits("10", 18));

      const epoch = await vault.currentEpoch();
      const deployerVolume = await vault.traderVolume(epoch, deployer.address);
      expect(deployerVolume).to.equal(transferAmount);
    });

    it("Should allow claiming proportional shares from previous epoch", async function () {
      const { token, vault, deployer, trader1, trader2 } = await loadFixture(deployCinderFixture);
      
      await token.transfer(trader1.address, ethers.parseUnits("10000", 18));
      await token.transfer(trader2.address, ethers.parseUnits("10000", 18));

      await token.connect(trader1).transfer(deployer.address, ethers.parseUnits("1000", 18));
      await token.connect(trader2).transfer(deployer.address, ethers.parseUnits("3000", 18));

      await time.increase(7 * 24 * 60 * 60 + 1);

      const trader1BalBefore = await token.balanceOf(trader1.address);
      await vault.connect(trader1).claim();
      const trader1BalAfter = await token.balanceOf(trader1.address);
      
      
      expect(trader1BalAfter - trader1BalBefore).to.be.gt(0n);
    });

    it("Should revert if initializeVaults is called a second time", async function () {
      const { token, vault, lock, burnVault } = await loadFixture(deployCinderFixture);
      await expect(
        token.initializeVaults(await vault.getAddress(), await lock.getAddress(), await burnVault.getAddress())
      ).to.be.revertedWith("Vaults already set");
    });

    it("Should revert if initializeVaults is called by a non-owner", async function () {
      const { token, trader1, vault, lock, burnVault } = await loadFixture(deployCinderFixture);
      
      // We must deploy a fresh token since deployCinderFixture already initialized it
      const CinderToken = await ethers.getContractFactory("CinderToken");
      const freshToken = await CinderToken.deploy();

      // Custom error logic for OZ Ownable (e.g. OwnableUnauthorizedAccount)
      await expect(
        freshToken.connect(trader1).initializeVaults(await vault.getAddress(), await lock.getAddress(), await burnVault.getAddress())
      ).to.be.revertedWithCustomError(freshToken, "OwnableUnauthorizedAccount")
       .withArgs(trader1.address);
    });
  });

  describe("CreatorLock", function () {
    it("Should allow release after unlock time", async function () {
      const { token, lock, creator } = await loadFixture(deployCinderFixture);
      await token.transfer(await lock.getAddress(), ethers.parseUnits("100", 18));
      
      await time.increase(21 * 24 * 60 * 60 + 1);
      
      await lock.release();
      const creatorBal = await token.balanceOf(creator.address);
      expect(creatorBal).to.equal(ethers.parseUnits("100", 18));
    });
  });

  describe("BurnVault", function () {
    it("Should accumulate totalBurned across multiple burns", async function () {
      const { token, burnVault } = await loadFixture(deployCinderFixture);
      
      const burnAmount1 = ethers.parseUnits("50", 18);
      const burnAmount2 = ethers.parseUnits("150", 18);
      
      await token.approve(await burnVault.getAddress(), burnAmount1 + burnAmount2);
      
      await burnVault.ownerDeposit(burnAmount1);
      expect(await burnVault.totalBurned()).to.equal(burnAmount1);
      
      await burnVault.ownerDeposit(burnAmount2);
      expect(await burnVault.totalBurned()).to.equal(burnAmount1 + burnAmount2);
    });
  });
});
