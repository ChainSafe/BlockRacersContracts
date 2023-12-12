import {
  loadFixture,
  time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { deployAssetsFixture, mintNftWithURI, safeTransferFrom, setApprovalForAll } from "./contractFunctions/BlockRacersAssets.contract";
import { getAccounts } from "./contractFunctions/generalFunctions";
import { assert } from "chai";
import { defaultGameSettings } from "../scripts/defaultSettings";

describe("BlockRacersNfts", function () {
  describe("Deployment", function () {
    it("deploys as expected", async () => {
      const { admin } = await getAccounts();
      const assetsContract = await loadFixture(deployAssetsFixture)
      const DEFAULT_ADMIN_ROLE = await assetsContract.DEFAULT_ADMIN_ROLE();
      const hasRole = await assetsContract.hasRole(DEFAULT_ADMIN_ROLE, admin);

      assert(hasRole, "Admin not been issued rights")
    })
  });

  describe("Read functions", function () {
    it("BLOCK_RACERS")
    it("DEFAULT_ADMIN_ROLE")
    it("balanceOf")
    it("balanceOfBatch")
    it("getRoleAdmin")
    it("hasRole")
    it("isApprovedForAll")
    it("isTrustedForwarder")
    it("supportsInterface")
    it("trustedForwarder")
    it("uri")
  });

  describe("Write functions", function () {
    it("grantRole", async () => {
      const { admin, issuerAccount } = await getAccounts();
      const assetsContract = await loadFixture(deployAssetsFixture)
      const DEFAULT_ADMIN_ROLE = await assetsContract.DEFAULT_ADMIN_ROLE();

      let hasRole = await assetsContract.hasRole(DEFAULT_ADMIN_ROLE, issuerAccount);
      assert(!hasRole, "Issuer account already has role")

      await assetsContract.connect(admin).grantRole(DEFAULT_ADMIN_ROLE, issuerAccount);

      hasRole = await assetsContract.hasRole(DEFAULT_ADMIN_ROLE, issuerAccount);
      assert(hasRole, "Issuer account was not granted role")
    })
    it("mint(address,uint256,uint256)")
    it("mint(address,uint256,uint256,string)", async () => {
      const { player1 } = await getAccounts();
      const assetsContract = await loadFixture(deployAssetsFixture)

      await mintNftWithURI(assetsContract, player1, 1, 1, defaultGameSettings.carOptions[0].carUri)
    })
    it("mintBatch(address,uint256[],uint256[])")
    it("mintBatch(address,uint256[],uint256[],string[])")
    it("setApprovalForAll", async () => {
      const assetsContract = await loadFixture(deployAssetsFixture)

      const { player1, player2 } = await getAccounts();

      const nftId = 1;
      const value = 1;
      await mintNftWithURI(assetsContract, player1, nftId, value, defaultGameSettings.carOptions[0].carUri)

      let balanceOfPlayer1 = await assetsContract.balanceOf(player1, nftId)
      assert(balanceOfPlayer1 == BigInt(1), "Player1 was not issued nft")

      await setApprovalForAll(assetsContract, player1, player2, true)
    })
    it("revokeRole")
    it("safeBatchTransferFrom")
    it("safeTransferFrom", async () => {
      const assetsContract = await loadFixture(deployAssetsFixture)
      const { player1, player2 } = await getAccounts();
      const nftId = 1;
      const value = 1;

      await mintNftWithURI(assetsContract, player1, nftId, value, defaultGameSettings.carOptions[0].carUri)
      await setApprovalForAll(assetsContract, player1, player2, true)
      await safeTransferFrom(assetsContract, player1, player2, nftId, value)
    })
  });

  describe("events", function() {
    it("Approval")
    it("Transfer")
  })

  describe("errors", () => {
    it("UriArrayLengthInvalid")
    it("NotAuthorizedGameContract")
  })
});
