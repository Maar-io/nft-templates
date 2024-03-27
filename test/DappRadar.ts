import { expect } from "chai";
import { ethers } from "hardhat";

const NAME = "DappRadar";
const SYMBOL = "RADAR";
const MAX_SUPPLY = 10000;
const CONTRACT_URI_NEW = 'data:application/json;utf8,{"name": "Yoki collection","description":"Yoki collection Testnet","image": "https://bafybeiciwh2uki577w2fwgxde32ozaeyd3dgd3juhr3xirxqbhfkwrullu.ipfs.nftstorage.link/0.png"}';
const BASE_URI = "ipfs://bafybeid7m6zourukghb3uajd45qo4seuny3rpdyuy6yhjfp6ja3d6pgy2e/"
const ROTATE_METADATA = 1;

describe("DappRadar contract", function () {
  let radar: any;

  beforeEach(async () => {
    const [owner] = await ethers.getSigners();
    const Radar = await ethers.getContractFactory("DappRadar");
    radar = await Radar.deploy(NAME, SYMBOL);

  });

  it("General setup", async function () {
    const [owner] = await ethers.getSigners();
    expect(await radar.name()).to.equal(NAME);
    expect(await radar.symbol()).to.equal(SYMBOL);
    await radar.setContractURI(CONTRACT_URI_NEW);
    expect(await radar.contractURI()).to.equal(CONTRACT_URI_NEW);
  });

  it("mint works", async function () {
    const [owner, account1] = await ethers.getSigners();

    expect(await radar.totalSupply()).to.equal(0);
    await radar.mint(account1.address, 1);
    expect(await radar.totalSupply()).to.equal(1);
  });

  it("Should return correct tokenURI", async function () {
    const [owner, account1] = await ethers.getSigners();
    await radar.setBaseURI(BASE_URI);
    const baseURI = await radar.baseURI();
    expect(baseURI).to.equal(BASE_URI);

    const baseExtension = await radar.baseExtension();
    expect(baseExtension).to.equal(".json");

    // we need mint to make first 10 token exist
    await radar.mint(account1.address, 10);

    for(let i = 1; i <= 10; i++) {
      const expectedURI = baseURI;
      const tokenURI = await radar.tokenURI(i);
      expect(tokenURI).to.equal(expectedURI);
    }
  });


});

