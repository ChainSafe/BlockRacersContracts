import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { blockRacersFeeAccount, checkAssets, checkOwner, checkToken, deployCoreFixture, numberOfCarsMinted } from "./contractFunctions/BlockRacers.contract";
import { getAccounts, isTrustedForwarder } from "./contractFunctions/generalFunctions";
import { deployTokenFixture } from "./contractFunctions/BlockRacersToken.contract";
import { deployAssetsFixture } from "./contractFunctions/BlockRacersAssets.contract";
import { ERC2771Context } from "../typechain-types";

describe("BlockRacers", function () {
  describe("deployment", () => {
    it("deploys as expected", async () => {
      const { feeAccount } = await getAccounts()
      const coreContract = await loadFixture(deployCoreFixture())

      await blockRacersFeeAccount(coreContract, feeAccount.address)
    })  
  })
  describe("read", function () {
    it("assets", async () => {
      const assetsContract = await loadFixture(deployAssetsFixture)
      const assetsAddress = await assetsContract.getAddress()
      const coreContract = await loadFixture(deployCoreFixture(undefined, assetsAddress))

      await checkAssets(coreContract, assetsAddress)
    })
    it("blockRacersFeeAccount", async () => {
      const { feeAccount } = await getAccounts()
      const coreContract = await loadFixture(deployCoreFixture())

      await blockRacersFeeAccount(coreContract, feeAccount.address)
    })
    it("getCarOption")
    it("getItemData")
    it("getNumberOfCarsMinted", async () => {
      const coreContract = await loadFixture(deployCoreFixture())
      await numberOfCarsMinted(coreContract, 0);

      // Mint car then check
    })
    it("getUpgradeData")
    it("isTrustedForwarder", async () => {
      const { trustedForwarder } = await getAccounts()
      const coreContract = await loadFixture(deployCoreFixture())

      await isTrustedForwarder(coreContract as ERC2771Context, trustedForwarder.address, true)
    })
    it("mintCar")
    it("owner", async () => {
      const { admin } = await getAccounts()
      const coreContract = await loadFixture(deployCoreFixture())

      await checkOwner(coreContract, admin.address)
    })
    it("token", async () => {
      const tokenContract = await loadFixture(deployTokenFixture())
      const tokenAddress = await tokenContract.getAddress()
      const coreContract = await loadFixture(deployCoreFixture(tokenAddress))

      await checkToken(coreContract, tokenAddress)
    })
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
