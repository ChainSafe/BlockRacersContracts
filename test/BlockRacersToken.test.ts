import {
  loadFixture,
  time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { defaultDeployFixture, getAccounts } from "./contractFunctions/generalFunctions";
import { assert } from "chai";
import { parseUnits } from "ethers";
import { deployTokenFixture } from "./contractFunctions/BlockRacersToken.contract";

describe("BlockRacersToken", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  
  describe("deployment", () => {
    it("deploys as expected", async () => {
      const tokenContract = await loadFixture(deployTokenFixture)
      const symbol = await tokenContract.symbol();

      assert(symbol == "RACE", "Symbol not set")
    })
  })

  describe("write", function () {
    describe("testnet-only", () => {
      it("mint(to,amount)", async () => {
        const { player1 } = await getAccounts();
        const { tokenContract } = await loadFixture(defaultDeployFixture)
        const mintingAmount = parseUnits("100", 18);

        // Check player1 balance 0
        let player1Balance = await tokenContract.balanceOf(player1)
        assert(player1Balance == BigInt(0), "Player1 balance not 0");

        await tokenContract["mint(address,uint256)"](player1, mintingAmount);

        player1Balance = await tokenContract.balanceOf(player1);
        assert(mintingAmount == player1Balance, "Mint did not update Player 1 balance accurately");
      })
    })

    it("mint(to,amount,permit)")
    it("approve")
    it("transfer")
    it("transferFrom")
  });

  describe("read", () => {
    it("balanceOf")
    it("allowance")
    it("isTrustedForwarder")
    it("issuerAccount")
    it("name")
    it("symbol")
    it("totalSupply")
  });
});
