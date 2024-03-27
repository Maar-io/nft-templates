// npx hardhat ignition deploy ignition/modules/DappRadar.ts --network zKyoto --verify
// npx hardhat ignition deploy ignition/modules/DappRadar.ts --network astarZkEvm --verify


import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const RadarModule = buildModule("RadarModule", (m) => {
  const radar = m.contract("DappRadar", ["DappRadar", "RADAR"]);
  return { radar };
});

export default RadarModule;
