import {
  loadFixture,
  time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { deployWageringFixture } from "./contractFunctions/BlockRacersWagering.contract";
import { deployTokenFixture } from "./contractFunctions/BlockRacersToken.contract";
import { getAccounts, isTrustedForwarder } from "./contractFunctions/generalFunctions";
import { ERC2771Context } from "../typechain-types";

describe("BlockRacersWagering", function () {
  
  describe("deployment", () => {
    it("deploys as expected", async () => {
      const wageringContract = await loadFixture(deployWageringFixture())

      wageringContract.trustedForwarder
    })  
  })

  describe("write", function () {
    it("acceptWager")
    it("acceptPvpWager")
    it("cancelWager")
    it("completeWager")
    it("createPvpWager")
  });

  describe("admin", () => {
    it("addToBlackList")
    it("adminCancelWager")
    it("removeFromBlackList")
    it("transferOwnership")
  })

  describe("read", function () {
    it("isTrustedForwarder", async () => {
      const { trustedForwarder } = await getAccounts()
      const wageringContract = await loadFixture(deployWageringFixture())

      await isTrustedForwarder(wageringContract as ERC2771Context, trustedForwarder.address, true)
    })
    it("latestWagerId")
    it("token")
    it("trustedForwarder")
  });

  describe("events", function () {
    it("WagerCreated")
    it("WagerAccepted")
    it("WagerCancelled")
    it("WagerCompleted")
  })

  describe("errors", () => {
    it("WagerStateIncorrect")
    it("WagerCantBeCancelled")
    it("OnlyParticipantsCanCancel")
    it("OpponentCantBeChallenger")
    it("PlayerSignatureInvalid")
  })
});
