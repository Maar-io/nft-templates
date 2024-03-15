import { expect } from "chai";
import { ethers } from "hardhat";

const NAME = "Bonbon";
const SYMBOL = "BON";
const MAX_SUPPLY = 10000;
const CONTRACT_URI_NEW = 'data:application/json;utf8,{"name": "Yoki collection","description":"Yoki collection Testnet","image": "https://bafybeiciwh2uki577w2fwgxde32ozaeyd3dgd3juhr3xirxqbhfkwrullu.ipfs.nftstorage.link/0.png"}';
const BASE_URI = "ipfs://bafybeid7m6zourukghb3uajd45qo4seuny3rpdyuy6yhjfp6ja3d6pgy2e/"
const ROTATE_METADATA = 5;

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

  it("Should return correct tokenURI", async function () {
    const [owner, account1] = await ethers.getSigners();
    await bonbon.setBaseURI(BASE_URI);
    const baseURI = await bonbon.baseURI();
    expect(baseURI).to.equal(BASE_URI);

    const baseExtension = await bonbon.baseExtension();
    expect(baseExtension).to.equal(".json");

    // we need mint to make first 10 token exist
    await bonbon.mint(account1.address, 10);

    for(let i = 1; i <= 10; i++) {
      const expectedURI = baseURI + ((i % ROTATE_METADATA == 0 ? ROTATE_METADATA : i % ROTATE_METADATA)).toString() + baseExtension;
      const tokenURI = await bonbon.tokenURI(i);
      expect(tokenURI).to.equal(expectedURI);
    }
  });


});

