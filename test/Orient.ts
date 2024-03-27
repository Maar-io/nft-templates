import { expect } from "chai";
import { ethers } from "hardhat";

const NAME = "Orient Express";
const SYMBOL = "ORI";
const MAX_SUPPLY = 10000;
const CONTRACT_URI_NEW = 'data:application/json;utf8,{"name": "Yoki collection","description":"Yoki collection Testnet","image": "https://bafybeiciwh2uki577w2fwgxde32ozaeyd3dgd3juhr3xirxqbhfkwrullu.ipfs.nftstorage.link/0.png"}';
const BASE_URI = "ipfs://bafybeid7m6zourukghb3uajd45qo4seuny3rpdyuy6yhjfp6ja3d6pgy2e/"
const ROTATE_METADATA = 10;
const PRICE = ethers.parseEther("0.1");
const MINT_LIMIT = 25;

describe("Orient Express contract", function () {
  let orient: any;

  beforeEach(async () => {
    const [owner] = await ethers.getSigners();
    const Orient = await ethers.getContractFactory("Orient");
    orient = await Orient.deploy(NAME, SYMBOL, PRICE, MINT_LIMIT, MAX_SUPPLY);

  });

  it("General setup", async function () {
    const [owner] = await ethers.getSigners();
    expect(await orient.name()).to.equal(NAME);
    expect(await orient.symbol()).to.equal(SYMBOL);
    await orient.setContractURI(CONTRACT_URI_NEW);
    expect(await orient.contractURI()).to.equal(CONTRACT_URI_NEW);
  });

  it("mint works", async function () {
    const [owner, account1] = await ethers.getSigners();

    expect(await orient.totalSupply()).to.equal(0);
    await orient.mint(account1.address, 1, { value: PRICE });
    expect(await orient.totalSupply()).to.equal(1);
  });

  it("Should return correct tokenURI", async function () {
    const [owner, account1] = await ethers.getSigners();
    await orient.setBaseURI(BASE_URI);
    const baseURI = await orient.baseURI();
    expect(baseURI).to.equal(BASE_URI);

    const baseExtension = await orient.baseExtension();
    expect(baseExtension).to.equal(".json");

    // we need mint to make first 10 token exist
    await orient.mint(account1.address, BigInt(MINT_LIMIT), { value: BigInt(PRICE) * BigInt(MINT_LIMIT) });
    for(let i = 1; i <= MINT_LIMIT; i++) {
      const expectedURI = baseURI + ((i % ROTATE_METADATA == 0 ? ROTATE_METADATA : i % ROTATE_METADATA)).toString() + baseExtension;
      const tokenURI = await orient.tokenURI(i);
      expect(tokenURI).to.equal(expectedURI);
    }
  });


});

