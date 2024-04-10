// npx hardhat ignition deploy ignition/modules/Bonbon.ts --network zKyoto --verify
// npx hardhat ignition deploy ignition/modules/DappRadar.ts --network astarZkEvm --verify


const NAME = "Bonbon";
const SYMBOL = "BONBON";
const MAX_SUPPLY = 10000;

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const BonbonModule = buildModule("BonbonModule", (m) => {
  const artifact = m.contract("Bonbon", [NAME, SYMBOL, MAX_SUPPLY]);
  return { artifact };
});

export default BonbonModule;
