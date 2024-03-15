import { expect } from "chai";
import { ethers } from "hardhat";


const NAME = "Bonbon";
const SYMBOL = "BON";
const MAX_SUPPLY = 10000;
const CONTRACT_URI_NEW = 'data:application/json;utf8,{"name": "Yoki collection","description":"Yoki collection Testnet","image": "https://bafybeiciwh2uki577w2fwgxde32ozaeyd3dgd3juhr3xirxqbhfkwrullu.ipfs.nftstorage.link/0.png"}';

describe("Bonbon contract", function () {
  let bonbon: any;

  beforeEach(async () => {
    const [owner] = await ethers.getSigners();
    const Bonbon = await ethers.getContractFactory("Bonbon");
    bonbon = await Bonbon.deploy(NAME, SYMBOL, MAX_SUPPLY);

  });

  it("General setup", async function () {
    const [owner] = await ethers.getSigners();
    expect(await bonbon.name()).to.equal(NAME);
    expect(await bonbon.symbol()).to.equal(SYMBOL);
    await bonbon.setContractURI(CONTRACT_URI_NEW);
    expect(await bonbon.contractURI()).to.equal(CONTRACT_URI_NEW);
  });

  it("mint works", async function () {
    const [owner, account1] = await ethers.getSigners();

    expect(await bonbon.totalSupply()).to.equal(0);
    await bonbon.mint(account1.address, 1);
    expect(await bonbon.totalSupply()).to.equal(1);
  });

});

