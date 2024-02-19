import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {
  balanceOfNft,
  batchMintNftWithURI,
  batchMintNftWithURIWithErrors,
  deployAssetsFixture,
  getUri,
  mintNft,
  mintNftWithError,
  safeTransferFrom,
  setApprovalForAll,
} from "../src/BlockGameAssets.contract";
import {
  checkTrustedForwarder,
  getAccounts,
  isTrustedForwarder,
} from "../src/generalFunctions";
import { assert } from "chai";
import { generalSettings } from "../scripts/defaultSettings";
import { ERC2771Context } from "../typechain-types";
import { keccak256, toUtf8Bytes } from "ethers";

describe("BlockGameNfts", function () {
  describe("Deployment", function () {
    it("deploys as expected", async () => {
      const { admin } = await getAccounts();
      const { blockGameAssetsContract: assetsContract, blockGameContract } = await loadFixture(deployAssetsFixture);

      assert(
        await assetsContract.BLOCK_GAME() == await blockGameContract.getAddress(),
      );
    });
  });

  describe("Read functions", function () {
    it("balanceOf", async () => {
      const { player1 } = await getAccounts();
      const { blockGameAssetsContract: assetsContract } = await loadFixture(deployAssetsFixture);
      await balanceOfNft(assetsContract, player1.address, 1, 0);
      await mintNft(
        assetsContract,
        player1,
        1,
      );
      await balanceOfNft(assetsContract, player1.address, 1, 1);
    });
    it("isTrustedForwarder", async () => {
      const { trustedForwarder } = await getAccounts();
      const { blockGameAssetsContract: assetsContract } = await loadFixture(deployAssetsFixture);

      await isTrustedForwarder(
        assetsContract as ERC2771Context,
        trustedForwarder.address,
        true,
      );
    });
    it("trustedForwarder", async () => {
      const { trustedForwarder } = await getAccounts();
      const { blockGameAssetsContract: assetsContract } = await loadFixture(deployAssetsFixture);
      await checkTrustedForwarder(
        assetsContract as ERC2771Context,
        trustedForwarder.address,
      );
    });
    it("uri", async () => {
      const { player1 } = await getAccounts();
      const { blockGameAssetsContract: assetsContract } = await loadFixture(deployAssetsFixture);

      await mintNft(
        assetsContract,
        player1,
        1,
      );

      await getUri(assetsContract, 1, generalSettings.NFT.baseUri + '0x00000000.json');
    });
  });

  describe("Write functions", function () {
    it("mint(address)", async () => {
      const { player1 } = await getAccounts();
      const { blockGameAssetsContract: assetsContract } = await loadFixture(deployAssetsFixture);

      await mintNft(
        assetsContract,
        player1,
        1,
      );
    });
    it("setApprovalForAll", async () => {
      const { blockGameAssetsContract: assetsContract } = await loadFixture(deployAssetsFixture);

      const { player1, player2 } = await getAccounts();

      const nftId = 1;
      const value = 1;
      await mintNft(
        assetsContract,
        player1,
        nftId,
      );

      const balanceOfPlayer1 = await assetsContract.balanceOf(player1, nftId);
      assert(balanceOfPlayer1 == BigInt(1), "Player1 was not issued nft");

      await setApprovalForAll(assetsContract, player1, player2, true);
    });
    it("safeTransferFrom", async () => {
      const { blockGameAssetsContract: assetsContract } = await loadFixture(deployAssetsFixture);
      const { player1, player2 } = await getAccounts();
      const nftId = 1;
      const value = 1;

      await mintNft(
        assetsContract,
        player1,
        nftId,
      );
      await setApprovalForAll(assetsContract, player1, player2, true);
      await safeTransferFrom(assetsContract, player1, player2, nftId, value);
    });
  });

  describe("errors", () => {
    it("NotAuthorizedGameContract", async () => {
      const { player1 } = await getAccounts();
      const { blockGameAssetsContract: assetsContract } = await loadFixture(deployAssetsFixture);
      const nftId = 1;
      const value = 1;

      await mintNftWithError(
        assetsContract,
        player1,
        nftId,
        "NotAuthorizedGameContract",
        [],
      );
    });
  });
});
