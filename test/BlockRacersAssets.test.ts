import {
  loadFixture,
  time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { deployAssetsFixture } from "./contractFunctions/BlockRacersAssets.contract";
import { getAccounts } from "./contractFunctions/generalFunctions";
import { assert } from "chai";

describe("BlockRacersNfts", function () {
  describe("Deployment", function () {
    it("deploys as expected", async () => {
      const { admin } = await getAccounts();
      const assetsContract = await loadFixture(deployAssetsFixture)
      const DEFAULT_ADMIN_ROLE = await assetsContract.DEFAULT_ADMIN_ROLE();
      const hasRole = await assetsContract.hasRole(DEFAULT_ADMIN_ROLE, admin);

      assert(hasRole, "Admin not issued rights")
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
    it("grantRole")
    it("mint(address,uint256,uint256)")
    it("mint(address,uint256,uint256,string)")
    it("mintBatch(address,uint256[],uint256[])")
    it("mintBatch(address,uint256[],uint256[],string[])")
    it("revokeRole")
    it("safeBatchTransferFrom")
    it("safeTransferFrom")
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
