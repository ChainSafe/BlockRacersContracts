import {
  time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";

describe("BlockRacersNfts", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const ONE_GWEI = 1_000_000_000;

    const lockedAmount = ONE_GWEI;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const BlockRacersNfts = await ethers.getContractFactory("BlockRacersNfts");
    const blockRacersNfts = await BlockRacersNfts.deploy([], { });

    return { blockRacersNfts, unlockTime, lockedAmount, owner, otherAccount };
  }

  describe("Deployment", function () {
  });

  describe("Read functions", function () {
    it("_token")
    it("devWallet")
    it("authWallet")
    it("ownerNftIds")
    it("carOwner")
    it("ownerCarCount")
    it("nftId")
    it("totalNftCount")
    it("nftPrice")
    it("upgradePrice")
    it("nonce")
    it("engineLevel")
    it("handlingLevel")
    it("nosLevel")

    it("getOwnerNftIds")
  });

  describe("Write functions", function () {
    it("mintNft")
    it("upgradeEngine")
    it("upgradeHandling")
    it("upgradeNos")
  });

  describe("events", function() {
    it("MintNft")
    it("UpgradeEngine")
    it("UpgradeHandling")
    it("UpgradeNos")
  })

});
