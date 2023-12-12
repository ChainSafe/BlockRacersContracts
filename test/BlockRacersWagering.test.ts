import {
  loadFixture,
  time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { deployWageringFixture } from "./contractFunctions/BlockRacersWagering.contract";
import { deployTokenFixture } from "./contractFunctions/BlockRacersToken.contract";

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
    it("isTrustedForwarder")
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
