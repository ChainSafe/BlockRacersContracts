import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { getAccounts, isTrustedForwarder } from "../src/generalFunctions";
import { assert } from "chai";
import { ZeroAddress, parseUnits } from "ethers";
import {
  balanceOfToken,
  deployTokenFixture,
  getIssuerAccount,
  mintWithPermit,
  setAllowanceToken,
  setNewIssuerAccount,
  setNewIssuerAccountWithErrors,
  setNewIssuerAccountWithEvents,
  transferFromToken,
} from "../src/BlockGameToken.contract";
import { ERC2771Context } from "../typechain-types";

describe("BlockGameToken", function () {
  describe("deployment", () => {
    it("deploys as expected", async () => {
      const tokenContract = await loadFixture(deployTokenFixture());
      const symbol = await tokenContract.symbol();

      assert(symbol == "GAME", "Symbol not set");
    });
  });

  describe("restricted", () => {
    it("mint(to,amount,permit)", async () => {
      const { player1, issuerAccount } = await getAccounts();
      const tokenContract = await loadFixture(deployTokenFixture());
      const mintingAmount = parseUnits("100", 18);

      await mintWithPermit(
        tokenContract,
        issuerAccount,
        player1.address,
        mintingAmount,
      );
    });

    it("setNewIssuerAccount", async () => {
      const { admin, player1, issuerAccount } = await getAccounts();
      const tokenContract = await loadFixture(deployTokenFixture());

      await getIssuerAccount(tokenContract, issuerAccount.address);

      await setNewIssuerAccount(tokenContract, admin, player1.address);

      await getIssuerAccount(tokenContract, player1.address);
    });
  });

  describe("write", function () {
    it("approve", async () => {
      const { player1, player2, issuerAccount } = await getAccounts();
      const tokenContract = await loadFixture(deployTokenFixture());

      const mintingAmount = parseUnits("100", 18);
      await mintWithPermit(
        tokenContract,
        issuerAccount,
        player1.address,
        mintingAmount,
      );

      await setAllowanceToken(tokenContract, player1, player2, mintingAmount);
    });
    it("transferFrom", async () => {
      const { player1, player2, issuerAccount } = await getAccounts();
      const tokenContract = await loadFixture(deployTokenFixture());

      const mintingAmount = parseUnits("100", 18);
      await mintWithPermit(
        tokenContract,
        issuerAccount,
        player1.address,
        mintingAmount,
      );

      await setAllowanceToken(tokenContract, player1, player2, mintingAmount);

      await transferFromToken(tokenContract, player1, player2, mintingAmount);
    });
  });

  describe("read", () => {
    it("balanceOf", async () => {
      const { player1, issuerAccount } = await getAccounts();
      const tokenContract = await loadFixture(deployTokenFixture());
      await balanceOfToken(tokenContract, player1, 0);
      const mintingAmount = parseUnits("100", 18);

      await mintWithPermit(
        tokenContract,
        issuerAccount,
        player1.address,
        mintingAmount,
      );

      await balanceOfToken(tokenContract, player1, mintingAmount);
    });
    it("isTrustedForwarder", async () => {
      const { trustedForwarder } = await getAccounts();
      const tokenContract = await loadFixture(deployTokenFixture());

      await isTrustedForwarder(
        tokenContract as ERC2771Context,
        trustedForwarder.address,
        true,
      );
    });
    it("issuerAccount", async () => {
      const { issuerAccount } = await getAccounts();
      const tokenContract = await loadFixture(deployTokenFixture());

      await getIssuerAccount(tokenContract, issuerAccount.address);
    });
  });

  describe("events", () => {
    it("NewIssuer", async () => {
      const { admin, player1 } = await getAccounts();
      const tokenContract = await loadFixture(deployTokenFixture());

      await setNewIssuerAccountWithEvents(
        tokenContract,
        admin,
        player1.address,
        "NewIssuer",
        [player1.address],
      );
    });
  });

  describe("errors", () => {
    it("InvalidIssuer", async () => {
      const { admin, issuerAccount } = await getAccounts();
      const tokenContract = await loadFixture(deployTokenFixture());

      await setNewIssuerAccountWithErrors(
        tokenContract,
        admin,
        issuerAccount.address,
        "InvalidIssuer",
        [issuerAccount.address],
      );
      await setNewIssuerAccountWithErrors(
        tokenContract,
        admin,
        ZeroAddress,
        "InvalidIssuer",
        [ZeroAddress],
      );
    });
  });
});
