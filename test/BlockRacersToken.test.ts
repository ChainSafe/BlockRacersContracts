import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { getAccounts } from "./contractFunctions/generalFunctions";
import { assert } from "chai";
import { parseUnits } from "ethers";
import { balanceOfToken, deployTokenFixture, setAllowanceToken, testnetMint, transferFromToken } from "./contractFunctions/BlockRacersToken.contract";

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
        const tokenContract = await loadFixture(deployTokenFixture)
        const mintingAmount = parseUnits("100", 18);

        await testnetMint(tokenContract, player1, mintingAmount);
      })
    })

    it("mint(to,amount,permit)")
    it("approve", async () => {
      const { player1, player2 } = await getAccounts();
      const tokenContract = await loadFixture(deployTokenFixture)

      const mintingAmount = parseUnits("100", 18);
      await testnetMint(tokenContract, player1, mintingAmount);

      await setAllowanceToken(tokenContract, player1, player2, mintingAmount)

    })
    it("transfer")
    it("transferFrom", async () => {
      const { player1, player2 } = await getAccounts();
      const tokenContract = await loadFixture(deployTokenFixture)

      const mintingAmount = parseUnits("100", 18);
      await testnetMint(tokenContract, player1, mintingAmount);

      await setAllowanceToken(tokenContract, player1, player2, mintingAmount)

      await transferFromToken(tokenContract, player1, player2, mintingAmount)
    })
  });

  describe("read", () => {
    it("balanceOf", async () => {
      const { player1 } = await getAccounts();
      const tokenContract = await loadFixture(deployTokenFixture)
      await balanceOfToken(tokenContract, player1, 0);
      const mintingAmount = parseUnits("100", 18);

      await testnetMint(tokenContract, player1, mintingAmount);

      await balanceOfToken(tokenContract, player1, mintingAmount);

    })
    it("allowance")
    it("isTrustedForwarder")
    it("issuerAccount")
    it("name")
    it("symbol")
    it("totalSupply")
  });
});
