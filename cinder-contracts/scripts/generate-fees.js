const hre = require("hardhat");

async function main() {
  const accounts = await hre.ethers.getSigners();
  const trader = accounts[1]; // Use account 1 to trade

  const CINDER_TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const CASHBACK_VAULT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const token = await hre.ethers.getContractAt("CinderToken", CINDER_TOKEN_ADDRESS);
  const vault = await hre.ethers.getContractAt("CashbackVault", CASHBACK_VAULT_ADDRESS);

  // 1. Give trader some ASH
  console.log("Funding trader...");
  await token.transfer(trader.address, hre.ethers.parseUnits("1000", 18));

  // 2. Trader transfers 500 ASH to someone else to incur fee
  console.log("Trader sending tokens to incur fee...");
  await token.connect(trader).transfer(accounts[2].address, hre.ethers.parseUnits("500", 18));

  // 3. Advance time by 7 days so epoch ends
  console.log("Advancing time by 7 days...");
  await hre.network.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
  await hre.network.provider.send("evm_mine");

  // 4. Check claimable
  const claimable = await vault.claimable(trader.address);
  console.log(`Trader (${trader.address}) now has claimable: ${hre.ethers.formatUnits(claimable, 18)} ASH`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
