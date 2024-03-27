// npx hardhat run --network zKatana scripts/deploy_orient.ts

require('dotenv').config();
import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/.env" });
const NAME = "Bonbon";
const SYMBOL = "BON";
const MAX_SUPPLY = 10000;

async function main() {
    // Set up the deployer account using the private key from the config file
    const ACCOUNT_PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY || "";
    console.log("PrivateKey set:", !!ACCOUNT_PRIVATE_KEY)

    const wallet = new ethers.Wallet(ACCOUNT_PRIVATE_KEY, ethers.provider);
    console.log("Deploying contracts with the account:", wallet.address);

    // Deploy the contract
    const contract = await ethers.deployContract("Bonbon", [ NAME, SYMBOL, MAX_SUPPLY]);

    await contract.waitForDeployment();

    console.log(NAME, "contract address:", contract.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
