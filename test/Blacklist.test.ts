import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import {
  addToBlacklist,
  addToBlacklistWithErrors,
  addToBlacklistWithEvents,
  deployBlacklistFixture,
  isBlackListed,
  removeFromBlackList,
  removeFromBlackListWithErrors,
  removeFromBlackListWithEvents,
} from "../src/Blacklist.contract";
import { defaultDeployFixture, getAccounts } from "../src/generalFunctions";
import { assert } from "chai";
import { parseUnits } from "ethers";
import { createWagerWithError } from "../src/BlockRacersWagering.contract";

describe("Blacklist", function () {
  describe("deployment", () => {
    it("deploys as expected", async () => {
      const { admin } = await getAccounts();
      const blacklistContract = await loadFixture(deployBlacklistFixture);

      const owner = await blacklistContract.owner();
      assert(
        owner == admin.address,
        `Contract not set up correctly. Owner: ${owner} | Expected: ${admin.address}`,
      );
    });
  });
  describe("read", function () {
    it("isBlackListed", async () => {
      const { admin, player1 } = await getAccounts();
      const blacklistContract = await loadFixture(deployBlacklistFixture);

      await isBlackListed(blacklistContract, player1.address, false);
      await addToBlacklist(blacklistContract, admin, player1.address);
      await isBlackListed(blacklistContract, player1.address, true);
    });
  });

  describe("write", function () {
    it("addToBlackList", async () => {
      const { admin, player1 } = await getAccounts();
      const blacklistContract = await loadFixture(deployBlacklistFixture);

      await addToBlacklist(blacklistContract, admin, player1.address);
    });
    it("removeFromBlackList", async () => {
      const { admin, player1 } = await getAccounts();
      const blacklistContract = await loadFixture(deployBlacklistFixture);

      await addToBlacklist(blacklistContract, admin, player1.address);

      await isBlackListed(blacklistContract, player1.address, true);
      await removeFromBlackList(blacklistContract, admin, player1.address);
      await isBlackListed(blacklistContract, player1.address, false);
    });
  });

  describe("events", function () {
    it("AddedToBlacklist", async () => {
      const { admin, player1 } = await getAccounts();
      const blacklistContract = await loadFixture(deployBlacklistFixture);

      await addToBlacklistWithEvents(
        blacklistContract,
        admin,
        player1.address,
        "AddedToBlacklist",
        [player1.address],
      );
    });
    it("RemovedFromBlacklisted", async () => {
      const { admin, player1 } = await getAccounts();
      const blacklistContract = await loadFixture(deployBlacklistFixture);
      await addToBlacklist(blacklistContract, admin, player1.address);

      await removeFromBlackListWithEvents(
        blacklistContract,
        admin,
        player1.address,
        "RemovedFromBlacklisted",
        [player1.address],
      );
    });
  });

  describe("errors", function () {
    it("AccountBlacklisted", async () => {
      const { admin, player1 } = await getAccounts();
      const { wageringContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      await addToBlacklist(wageringContract, admin, player1.address);
      const standardPrize = parseUnits("4", 18);

      await createWagerWithError(
        wageringContract,
        player1,
        standardPrize,
        "AccountBlacklisted",
        [player1.address],
      );
    });
    it("AccountAlreadyBlacklisted", async () => {
      const { admin, player1 } = await getAccounts();
      const blacklistContract = await loadFixture(deployBlacklistFixture);

      await addToBlacklistWithErrors(
        blacklistContract,
        admin,
        player1.address,
        `AccountAlreadyBlacklisted`,
        [player1.address],
      );
    });
    it("AccountNotBlacklisted", async () => {
      const { admin, player1 } = await getAccounts();
      const blacklistContract = await loadFixture(deployBlacklistFixture);

      await removeFromBlackListWithErrors(
        blacklistContract,
        admin,
        player1.address,
        "AccountNotBlacklisted",
        [player1.address],
      );
    });
  });
});
