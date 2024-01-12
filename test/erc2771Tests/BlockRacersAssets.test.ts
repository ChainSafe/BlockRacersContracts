import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { batchMintNftWithURI, deployAssetsFixture, mintNftWithURI, safeTransferFrom, setApprovalForAll } from "../../src/BlockRacersAssets.contract";
import { getAccounts } from "../../src/generalFunctions";
import { assert } from "chai";
import { defaultGameSettings } from "../../scripts/defaultSettings";

describe("BlockRacersNfts - ERC2771", function () {

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
    it("mint(address,uint256,uint256,string)", async () => {
      const { player1 } = await getAccounts();
      const assetsContract = await loadFixture(deployAssetsFixture)

      await mintNftWithURI(assetsContract, player1, 1, 1, defaultGameSettings.carOptions[0].carUri, true)
    })
    it("mintBatch(address,uint256[],uint256[],string[])", async () => {
      const { player1 } = await getAccounts();
      const assetsContract = await loadFixture(deployAssetsFixture)

      await batchMintNftWithURI(assetsContract, player1, [1, 2], [1,1], [
        defaultGameSettings.carOptions[0].carUri,
        defaultGameSettings.carOptions[1].carUri
      ], true)
    })
    it("setApprovalForAll", async () => {
      const assetsContract = await loadFixture(deployAssetsFixture)

      const { player1, player2 } = await getAccounts();

      const nftId = 1;
      const value = 1;
      await mintNftWithURI(assetsContract, player1, nftId, value, defaultGameSettings.carOptions[0].carUri, true)

      let balanceOfPlayer1 = await assetsContract.balanceOf(player1, nftId)
      assert(balanceOfPlayer1 == BigInt(1), "Player1 was not issued nft")

      await setApprovalForAll(assetsContract, player1, player2, true, true)
    })
    it("safeTransferFrom", async () => {
      const assetsContract = await loadFixture(deployAssetsFixture)
      const { player1, player2 } = await getAccounts();
      const nftId = 1;
      const value = 1;

      await mintNftWithURI(assetsContract, player1, nftId, value, defaultGameSettings.carOptions[0].carUri, true)
      await setApprovalForAll(assetsContract, player1, player2, true, true)
      await safeTransferFrom(assetsContract, player1, player2, nftId, value, true)
    })
  });
});