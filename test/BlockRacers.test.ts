import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { deployCoreFixture } from "./contractFunctions/BlockRacers.contract";
import { getAccounts } from "./contractFunctions/generalFunctions";
import { assert } from "console";

describe("BlockRacers", function () {
  describe("deployment", () => {
    it("deploys as expected", async () => {
      const { feeAccount } = await getAccounts()
      const coreContract = await loadFixture(deployCoreFixture)

      const feeAccountFetched = await coreContract.blockRacersFeeAccount()

      assert(feeAccount.address == feeAccountFetched, "Fee account not set")
    })  
  })
  describe("read", function () {
    it("assets")
    it("blockRacersFeeAccount")
    it("getCarOption")
    it("getItemData")
    it("getNumberOfCarsMinted")
    it("getUpgradeData")
    it("isTrustedForwarder")
    it("mintCar")
    it("owner")
    it("token")
    it("trustedForwarder")
  });

  describe("admin", () => {
    it("renounceOwnership")
    it("setBlockRacersFeeAccount")
    it("setNewGameSettings")
    it("transferOwnership")
  })

  describe("write", function () {
    it("mintCar")
    it("upgradeEngine")
    it("upgradeHandling")
    it("upgradeNos")
  });

  describe("events", function () {
    it("MintCar")
    it("UpgradeEngine")
    it("UpgradeHandling")
    it("UpgradeNos")
  })

  describe("errors", function () {
    it("CarTypeDoesNotExist")
    it("NotCarOwner")
    it("InvalidItemType")
    it("UpgradeNotPossible")
  })
});
