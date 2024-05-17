import { expect } from "chai";
import { ethers } from "hardhat";

const NAME = "PBADAO GACHA COLLECTION x ASTAR";
const SYMBOL = "GACHA";
const MAX_SUPPLY = 8888;
const BASE_URI = "ipfs://QmVvj73kum2jZMTrAZbFyYa6n4egYexK4bXhdTbCgG5Bbz/"
const PRICE = ethers.parseEther("0.0008");
const TOTAL_TOKENS = 6;

describe("Orient Express contract", function () {
  let pbadao: any;

  beforeEach(async () => {
    const [owner] = await ethers.getSigners();
    const PBAdao = await ethers.getContractFactory("PBADAO");
    pbadao = await PBAdao.deploy();

  });

  it("General setup", async function () {
    const [owner] = await ethers.getSigners();
    expect(await pbadao.name()).to.equal(NAME);
    expect(await pbadao.symbol()).to.equal(SYMBOL);
  });

  it("mint works", async function () {
    const [owner, account1, account2] = await ethers.getSigners();

    expect(await pbadao.totalSupply()).to.equal(0);

    await pbadao.mint(account1.address, 1, { value: PRICE });
    expect(await pbadao["totalSupply()"]()).to.equal(1);
    expect(await pbadao["totalSupply(uint256)"](1)).to.equal(1);

    await pbadao.mint(account2.address, 1, { value: PRICE });
    expect(await pbadao["totalSupply()"]()).to.equal(2);
    expect(await pbadao["totalSupply(uint256)"](2)).to.equal(1);

    await pbadao.mint(account2.address, 1, { value: PRICE });
    await pbadao.mint(account2.address, 1, { value: PRICE });
    await pbadao.mint(account2.address, 1, { value: PRICE });
    await pbadao.mint(account2.address, 1, { value: PRICE });

    await pbadao.mint(account2.address, 1, { value: PRICE });
    expect(await pbadao["totalSupply()"]()).to.equal(7);
    expect(await pbadao["totalSupply(uint256)"](1)).to.equal(2);

  });


  it("mint failed for non minter", async function () {
    const [owner, account1] = await ethers.getSigners();

    await expect(pbadao.connect(account1).mint(account1.address, 1, { value: PRICE })).to.be.revertedWithCustomError(pbadao, "AccessControlUnauthorizedAccount");
    expect(await pbadao.totalSupply()).to.equal(0);
  });

  it("Should return correct tokenURI", async function () {
    const [owner, account1] = await ethers.getSigners();
    const baseURI = await pbadao.baseURI();
    expect(baseURI).to.equal(BASE_URI);

    const baseExtension = await pbadao.baseExtension();
    expect(baseExtension).to.equal(".json");

    for(let i = 1; i <= TOTAL_TOKENS; i++) {
      const expectedURI = baseURI + ((i % TOTAL_TOKENS == 0 ? TOTAL_TOKENS : i % TOTAL_TOKENS)).toString() + baseExtension;
      const tokenURI = await pbadao.uri(i);
      expect(tokenURI).to.equal(expectedURI);
    }
  });

  it("SetUri works", async function () {
    const [owner, account1] = await ethers.getSigners();

    const newUri = "newURI";
    const baseURI = await pbadao.baseURI();
    expect(baseURI).to.equal(BASE_URI);

    await pbadao.setURI(newUri);
    const newBaseUri = await pbadao.baseURI();

    expect(newBaseUri).to.equal(newUri);
  });


});

