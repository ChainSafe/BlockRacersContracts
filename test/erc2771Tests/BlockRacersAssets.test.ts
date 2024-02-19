import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {
  deployAssetsFixture,
  mintNft,
  safeTransferFrom,
  setApprovalForAll,
} from "../../src/BlockRacersAssets.contract";
import { getAccounts } from "../../src/generalFunctions";
import { assert } from "chai";
import { defaultGameSettings } from "../../scripts/defaultSettings";

describe("BlockRacersNfts - ERC2771", function () {
  describe("Write functions", function () {
    it("mint(address)", async () => {
      const { player1 } = await getAccounts();
      const { blockRacersAssetsContract: assetsContract } = await loadFixture(deployAssetsFixture);

      await mintNft(
        assetsContract,
        player1,
        1,
        true,
      );
    });
    it("setApprovalForAll", async () => {
      const { blockRacersAssetsContract: assetsContract } = await loadFixture(deployAssetsFixture);

      const { player1, player2 } = await getAccounts();

      const nftId = 1;
      await mintNft(
        assetsContract,
        player1,
        nftId,
        true,
      );

      const balanceOfPlayer1 = await assetsContract.balanceOf(player1, nftId);
      assert(balanceOfPlayer1 == BigInt(1), "Player1 was not issued nft");

      await setApprovalForAll(assetsContract, player1, player2, true, true);
    });
    it("safeTransferFrom", async () => {
      const { blockRacersAssetsContract: assetsContract } = await loadFixture(deployAssetsFixture);
      const { player1, player2 } = await getAccounts();
      const nftId = 1;
      const value = 1;

      await mintNft(
        assetsContract,
        player1,
        nftId,
        true,
      );
      await setApprovalForAll(assetsContract, player1, player2, true, true);
      await safeTransferFrom(
        assetsContract,
        player1,
        player2,
        nftId,
        value,
        true,
      );
    });
  });
});
