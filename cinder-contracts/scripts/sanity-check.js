const hre = require("hardhat");

async function main() {
  const [deployer, user1] = await hre.ethers.getSigners();
  
  // Hardcoded addresses from deploy output
  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const vaultAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const lockAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  const token = await hre.ethers.getContractAt("CinderToken", tokenAddress);
  
  // 1. Total Supply Check
  const totalSupply = await token.totalSupply();
  console.log(`Total Supply: ${hre.ethers.formatUnits(totalSupply, 18)} ASH`);
  
  if (totalSupply === hre.ethers.parseUnits("1000000000", 18)) {
    console.log("✅ Total supply matches exactly 1,000,000,000.");
  } else {
    console.log("❌ Total supply mismatch!");
  }

  // 2. CreatorLock Balance Check
  const lockBalance = await token.balanceOf(lockAddress);
  console.log(`CreatorLock Balance: ${hre.ethers.formatUnits(lockBalance, 18)} ASH`);
  
  if (lockBalance === totalSupply * 7n / 100n) {
    console.log("✅ CreatorLock holds exactly 7% of supply.");
  } else {
    console.log("❌ CreatorLock balance mismatch!");
  }

  // 3. Test Transfer & Fee Check
  const vaultBalBefore = await token.balanceOf(vaultAddress);
  
  // Transfer 10,000 ASH
  const transferAmount = hre.ethers.parseUnits("10000", 18);
  console.log(`\nTransferring 10,000 ASH from deployer to user1...`);
  const tx = await token.transfer(user1.address, transferAmount);
  const receipt = await tx.wait();
  
  // 4. Verify TransferFeeRouted Event
  const feeRoutedEvent = receipt.logs.find((log) => {
    try {
      return token.interface.parseLog(log)?.name === "TransferFeeRouted";
    } catch (e) {
      return false;
    }
  });

  if (feeRoutedEvent) {
    const parsedLog = token.interface.parseLog(feeRoutedEvent);
    console.log(`✅ TransferFeeRouted event fired! Fee amount: ${hre.ethers.formatUnits(parsedLog.args.feeAmount, 18)} ASH`);
  } else {
    console.log("❌ TransferFeeRouted event not found!");
  }

  // 5. Verify CashbackVault Balance
  const vaultBalAfter = await token.balanceOf(vaultAddress);
  const vaultReceived = vaultBalAfter - vaultBalBefore;
  console.log(`CashbackVault received: ${hre.ethers.formatUnits(vaultReceived, 18)} ASH`);
  
  const expectedFee = transferAmount * 1n / 100n;
  if (vaultReceived === expectedFee) {
    console.log("✅ CashbackVault correctly received the 1% fee.");
  } else {
    console.log("❌ CashbackVault fee received mismatch!");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
