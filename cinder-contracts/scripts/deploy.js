const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const CinderToken = await hre.ethers.getContractFactory("CinderToken");
  const token = await CinderToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("CinderToken deployed to:", tokenAddress);

  const CashbackVault = await hre.ethers.getContractFactory("CashbackVault");
  const cashbackVault = await CashbackVault.deploy(tokenAddress);
  await cashbackVault.waitForDeployment();
  const vaultAddress = await cashbackVault.getAddress();
  console.log("CashbackVault deployed to:", vaultAddress);

  const unlockTimestamp = Math.floor(Date.now() / 1000) + (21 * 24 * 60 * 60);
  const CreatorLock = await hre.ethers.getContractFactory("CreatorLock");
  const creatorLock = await CreatorLock.deploy(deployer.address, unlockTimestamp, tokenAddress);
  await creatorLock.waitForDeployment();
  const lockAddress = await creatorLock.getAddress();
  console.log("CreatorLock deployed to:", lockAddress);

  const BurnVault = await hre.ethers.getContractFactory("BurnVault");
  const burnVault = await BurnVault.deploy(tokenAddress);
  await burnVault.waitForDeployment();
  const burnVaultAddress = await burnVault.getAddress();
  console.log("BurnVault deployed to:", burnVaultAddress);

  console.log("Initializing vaults on CinderToken...");
  const tx1 = await token.initializeVaults(vaultAddress, lockAddress, burnVaultAddress);
  await tx1.wait();
  console.log("Vaults initialized and fee exemptions set.");

  const totalBalance = await token.balanceOf(deployer.address);
  const creatorAmount = totalBalance * 7n / 100n; 
  console.log("Funding CreatorLock with:", hre.ethers.formatUnits(creatorAmount, 18), "ASH");
  const tx2 = await token.transfer(lockAddress, creatorAmount);
  await tx2.wait();
  console.log("CreatorLock funded.");

  console.log("Deployment complete.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
