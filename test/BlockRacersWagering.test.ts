import {
  loadFixture,
  time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { createWager, deployWageringFixture, getLatestWagerId } from "./contractFunctions/BlockRacersWagering.contract";
import { balanceOfToken, deployTokenFixture, setAllowanceToken } from "./contractFunctions/BlockRacersToken.contract";
import { defaultDeployFixture, getAccounts, isTrustedForwarder, mintingAmount } from "./contractFunctions/generalFunctions";
import { ERC2771Context } from "../typechain-types";
import { parseUnits } from "ethers";

describe("BlockRacersWagering", function () {
  const standardPrize = parseUnits("4", 18);

  describe("deployment", () => {
    it("deploys as expected", async () => {
      const wageringContract = await loadFixture(deployWageringFixture())

      wageringContract.trustedForwarder
    })  
  })

  describe("write", function () {
    it("createPvpWager", async () => {
        const { player1 } = await getAccounts()

        const { tokenContract, wageringContract } = await loadFixture(defaultDeployFixture(true))
            
        // Check balance
        await balanceOfToken(tokenContract, player1, mintingAmount)
        await balanceOfToken(tokenContract, wageringContract, 0)

        await setAllowanceToken(tokenContract, player1, wageringContract, standardPrize)

        await createWager(wageringContract, player1, standardPrize)
        
        await balanceOfToken(tokenContract, player1, mintingAmount - standardPrize)
        await balanceOfToken(tokenContract, wageringContract, standardPrize)

        // Check escrow

    })
    it("acceptWager")
    it("cancelWager")
    it("completeWager")
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
    it("latestWagerId", async () => {
        const { player1 } = await getAccounts()
        const { tokenContract, wageringContract } = await loadFixture(defaultDeployFixture(true))

        await getLatestWagerId(wageringContract, BigInt(0))

        await setAllowanceToken(tokenContract, player1, wageringContract, standardPrize)
        await createWager(wageringContract, player1, standardPrize)

        await getLatestWagerId(wageringContract, BigInt(1))
    })
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
