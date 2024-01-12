import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { getAccounts } from "../../src/generalFunctions";
import { parseUnits } from "ethers";
import { deployTokenFixture, getIssuerAccount, mintWithPermit, setAllowanceToken, setNewIssuerAccount, testnetMint, transferFromToken } from "../../src/BlockRacersToken.contract";

describe("BlockRacersToken - ERC2771", function () {
  describe("restricted", () => {
    it("mint(to,amount,permit)", async () => {
      const { player1, issuerAccount } = await getAccounts();
      const tokenContract = await loadFixture(deployTokenFixture())
      const mintingAmount = parseUnits("100", 18);

      await mintWithPermit(tokenContract, issuerAccount, player1.address, mintingAmount)
    })

    it("setNewIssuerAccount", async () => {
      const { admin, player1, issuerAccount } = await getAccounts();
      const tokenContract = await loadFixture(deployTokenFixture())

      await getIssuerAccount(tokenContract, issuerAccount.address)

      await setNewIssuerAccount(tokenContract, admin, player1.address)

      await getIssuerAccount(tokenContract, player1.address)
    })
  })

  describe("write", function () {
    describe("testnet-only", () => {
      it("mint(to,amount)", async () => {
        const { player1 } = await getAccounts();
        const tokenContract = await loadFixture(deployTokenFixture())
        const mintingAmount = parseUnits("100", 18);

        await testnetMint(tokenContract, player1, mintingAmount);
      })
    })

    
    it("approve", async () => {
      const { player1, player2 } = await getAccounts();
      const tokenContract = await loadFixture(deployTokenFixture())

      const mintingAmount = parseUnits("100", 18);
      await testnetMint(tokenContract, player1, mintingAmount);

      await setAllowanceToken(tokenContract, player1, player2, mintingAmount)

    })
    it("transferFrom", async () => {
      const { player1, player2 } = await getAccounts();
      const tokenContract = await loadFixture(deployTokenFixture())

      const mintingAmount = parseUnits("100", 18);
      await testnetMint(tokenContract, player1, mintingAmount);

      await setAllowanceToken(tokenContract, player1, player2, mintingAmount)

      await transferFromToken(tokenContract, player1, player2, mintingAmount)
    })
  });
});
