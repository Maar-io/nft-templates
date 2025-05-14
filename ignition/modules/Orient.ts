// npx hardhat ignition deploy ignition/modules/Orient.ts --network zKyoto --verify
// npx hardhat ignition deploy ignition/modules/Orient.ts --network optimism --verify

import { ethers } from "hardhat";

const NAME = "Orient Express";
const SYMBOL = "ORIENT";
const MAX_SUPPLY = 5000;
const PRICE = ethers.parseEther("0.003");
const MINT_LIMIT = 3;

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const OrientModule = buildModule("OrientModule", (m) => {
  const artifact = m.contract("Orient", [ NAME, SYMBOL, PRICE, MINT_LIMIT, MAX_SUPPLY ]);
  return { artifact };
});

export default OrientModule;
