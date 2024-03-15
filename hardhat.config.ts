import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import "@nomicfoundation/hardhat-ethers";

dotenv.config({ path: __dirname + "/.env" });
const ACCOUNT_PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY || "";
console.log("PrivateKey set:", !!ACCOUNT_PRIVATE_KEY)

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    artifacts: "./artifacts",
  },
  networks: {
    zKatana: {
      url: `https://rpc.zkatana.gelato.digital`,
      accounts: [ACCOUNT_PRIVATE_KEY]
    },
    zKatana2: {
      url: `https://rpc.startale.com/zkatana`,
      accounts: [ACCOUNT_PRIVATE_KEY]
    },
    zkyotoGelato: {
      url: `https://rpc.zkyoto.gelato.digital`,
      accounts: [ACCOUNT_PRIVATE_KEY]
    },
    zKyoto: {
      url: `https://rpc.startale.com/zkyoto`,
      accounts: [ACCOUNT_PRIVATE_KEY]
    },
    mumbai: {
      url: `https://polygon-testnet.public.blastapi.io`,
      accounts: [ACCOUNT_PRIVATE_KEY]
    },
    shibuya: {
      url: `https://evm.shibuya.astar.network`,
      accounts: [ACCOUNT_PRIVATE_KEY]
    },
    astarZkEvm: {
      url: `https://rpc.startale.com/astar-zkevm`,
      accounts: [ACCOUNT_PRIVATE_KEY]
    },
  },
};

export default config;