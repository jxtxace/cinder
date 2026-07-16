const fs = require('fs');

const t = JSON.parse(fs.readFileSync('../cinder-contracts/artifacts/contracts/CinderToken.sol/CinderToken.json')).abi;
const cv = JSON.parse(fs.readFileSync('../cinder-contracts/artifacts/contracts/CashbackVault.sol/CashbackVault.json')).abi;
const cl = JSON.parse(fs.readFileSync('../cinder-contracts/artifacts/contracts/CreatorLock.sol/CreatorLock.json')).abi;
const bv = JSON.parse(fs.readFileSync('../cinder-contracts/artifacts/contracts/BurnVault.sol/BurnVault.json')).abi;

const output = `export const CINDER_TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const CASHBACK_VAULT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
export const CREATOR_LOCK_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
export const BURN_VAULT_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

export const CinderTokenABI = ${JSON.stringify(t)};
export const CashbackVaultABI = ${JSON.stringify(cv)};
export const CreatorLockABI = ${JSON.stringify(cl)};
export const BurnVaultABI = ${JSON.stringify(bv)};
`;

fs.writeFileSync('./src/config/contracts.js', output);
