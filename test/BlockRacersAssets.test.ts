import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {
  balanceOfNft,
  batchMintNftWithURI,
  batchMintNftWithURIWithErrors,
  deployAssetsFixture,
  getUri,
  mintNftWithURI,
  mintNftWithURIWithError,
  safeTransferFrom,
  setApprovalForAll,
} from "../src/BlockRacersAssets.contract";
import {
  checkTrustedForwarder,
  getAccounts,
  isTrustedForwarder,
} from "../src/generalFunctions";
import { assert } from "chai";
import { defaultGameSettings } from "../scripts/defaultSettings";
import { ERC2771Context } from "../typechain-types";
import { keccak256, toUtf8Bytes } from "ethers";

describe("BlockRacersNfts", function () {
  describe("Deployment", function () {
    it("deploys as expected", async () => {
      const { admin } = await getAccounts();
      const assetsContract = await loadFixture(deployAssetsFixture);
      const DEFAULT_ADMIN_ROLE = await assetsContract.DEFAULT_ADMIN_ROLE();
      const hasRole = await assetsContract.hasRole(DEFAULT_ADMIN_ROLE, admin);

      assert(hasRole, "Admin not been issued rights");
    });
  });

  describe("Read functions", function () {
    it("BLOCK_RACERS", async () => {
      const assetsContract = await loadFixture(deployAssetsFixture);

      assert(
        (await assetsContract.BLOCK_RACERS()) ==
          keccak256(toUtf8Bytes("BLOCK_RACERS")),
        "Role identifier not as expected",
      );
    });
    it("balanceOf", async () => {
      const { player1 } = await getAccounts();
      const assetsContract = await loadFixture(deployAssetsFixture);
      await balanceOfNft(assetsContract, player1.address, 1, 0);
      await mintNftWithURI(
        assetsContract,
        player1,
        1,
        1,
        defaultGameSettings.carOptions[0].carUri,
      );
      await balanceOfNft(assetsContract, player1.address, 1, 1);
    });
    it("isTrustedForwarder", async () => {
      const { trustedForwarder } = await getAccounts();
      const assetsContract = await loadFixture(deployAssetsFixture);

      await isTrustedForwarder(
        assetsContract as ERC2771Context,
        trustedForwarder.address,
        true,
      );
    });
    it("trustedForwarder", async () => {
      const { trustedForwarder } = await getAccounts();
      const assetsContract = await loadFixture(deployAssetsFixture);
      await checkTrustedForwarder(
        assetsContract as ERC2771Context,
        trustedForwarder.address,
      );
    });
    it("uri", async () => {
      const { player1 } = await getAccounts();
      const assetsContract = await loadFixture(deployAssetsFixture);

      await mintNftWithURI(
        assetsContract,
        player1,
        1,
        1,
        defaultGameSettings.carOptions[0].carUri,
      );

      await getUri(assetsContract, 1, defaultGameSettings.carOptions[0].carUri);
    });
  });

  describe("Write functions", function () {
    it("grantRole", async () => {
      const { admin, issuerAccount } = await getAccounts();
      const assetsContract = await loadFixture(deployAssetsFixture);
      const DEFAULT_ADMIN_ROLE = await assetsContract.DEFAULT_ADMIN_ROLE();

      let hasRole = await assetsContract.hasRole(
        DEFAULT_ADMIN_ROLE,
        issuerAccount,
      );
      assert(!hasRole, "Issuer account already has role");

      await assetsContract
        .connect(admin)
        .grantRole(DEFAULT_ADMIN_ROLE, issuerAccount);

      hasRole = await assetsContract.hasRole(DEFAULT_ADMIN_ROLE, issuerAccount);
      assert(hasRole, "Issuer account was not granted role");
    });
    it("mint(address,uint256,uint256,string)", async () => {
      const { player1 } = await getAccounts();
      const assetsContract = await loadFixture(deployAssetsFixture);

      await mintNftWithURI(
        assetsContract,
        player1,
        1,
        1,
        defaultGameSettings.carOptions[0].carUri,
      );
    });
    it("mintBatch(address,uint256[],uint256[],string[])", async () => {
      const { player1 } = await getAccounts();
      const assetsContract = await loadFixture(deployAssetsFixture);

      await batchMintNftWithURI(
        assetsContract,
        player1,
        [1, 2],
        [1, 1],
        [
          defaultGameSettings.carOptions[0].carUri,
          defaultGameSettings.carOptions[1].carUri,
        ],
      );
    });
    it("setApprovalForAll", async () => {
      const assetsContract = await loadFixture(deployAssetsFixture);

      const { player1, player2 } = await getAccounts();

      const nftId = 1;
      const value = 1;
      await mintNftWithURI(
        assetsContract,
        player1,
        nftId,
        value,
        defaultGameSettings.carOptions[0].carUri,
      );

      const balanceOfPlayer1 = await assetsContract.balanceOf(player1, nftId);
      assert(balanceOfPlayer1 == BigInt(1), "Player1 was not issued nft");

      await setApprovalForAll(assetsContract, player1, player2, true);
    });
    it("safeTransferFrom", async () => {
      const assetsContract = await loadFixture(deployAssetsFixture);
      const { player1, player2 } = await getAccounts();
      const nftId = 1;
      const value = 1;

      await mintNftWithURI(
        assetsContract,
        player1,
        nftId,
        value,
        defaultGameSettings.carOptions[0].carUri,
      );
      await setApprovalForAll(assetsContract, player1, player2, true);
      await safeTransferFrom(assetsContract, player1, player2, nftId, value);
    });
  });

  describe("errors", () => {
    it("UriArrayLengthInvalid", async () => {
      const { player1 } = await getAccounts();
      const assetsContract = await loadFixture(deployAssetsFixture);

      await batchMintNftWithURIWithErrors(
        assetsContract,
        player1,
        [1, 2],
        [1, 1],
        [defaultGameSettings.carOptions[0].carUri],
        "UriArrayLengthInvalid",
        [],
      );
    });
    it("NotAuthorizedGameContract", async () => {
      const { player1 } = await getAccounts();
      const assetsContract = await loadFixture(deployAssetsFixture);
      const nftId = 1;
      const value = 1;

      await mintNftWithURIWithError(
        assetsContract,
        player1,
        nftId,
        value,
        defaultGameSettings.carOptions[0].carUri,
        "NotAuthorizedGameContract",
        [],
      );
    });
  });
});
