import {
  time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { defaultDeploy, getAccounts } from "./contractFunctions/generalFunctions";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("BlockRacers", function () {
  async function deployFixture() {
    const {
      assetsContract,
      coreContract,
      tokenContract,
      wageringContract
    } = await defaultDeploy()

  }

  describe("read", function () {
    it("_token")
    it("devWallet")
    it("authWallet")
    it("pvpWager")
    it("nonce")
  });

  describe("write", function () {
    it("setPvpWager")
    it("acceptPvpWager")
    it("pvpWagerClaim")
  });

  describe("events", function () {
    it("SetPVPWager")
    it("AcceptPVPWager")
    it("ClaimedPVPWinnings")
  })
});
