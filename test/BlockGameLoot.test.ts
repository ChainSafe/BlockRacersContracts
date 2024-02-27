import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {
  balanceOfNft,
  totalSupply,
  getInventory,
  deployLootFixture,
  getUri,
  getUriWithError,
  setUri,
  setUriWithError,
  mintNft,
  mintNftWithError,
} from "../src/BlockGameLoot.contract";
import {
  checkTrustedForwarder,
  getAccounts,
  isTrustedForwarder,
} from "../src/generalFunctions";
import { assert } from "chai";
import { generalSettings } from "../scripts/defaultSettings";
import { ERC2771Context } from "../typechain-types";
import { keccak256, toUtf8Bytes } from "ethers";

describe("BlockGameLoot", function () {
  describe("Deployment", function () {
    it("deploys as expected", async () => {
      const { admin } = await getAccounts();
      const { lootContract } = await loadFixture(deployLootFixture);

      assert.equal(await lootContract.owner(), admin.address);
    });
  });

  describe("Read functions", function () {
    it("balanceOf", async () => {
      const { player1, admin } = await getAccounts();
      const { lootContract } = await loadFixture(deployLootFixture);
      await mintNft(
        lootContract,
        admin,
        player1,
        [1],
        [1],
      );
      await balanceOfNft(lootContract, player1.address, 1, 1);
    });
    it("totalSupply", async () => {
      const { player1, player2, admin } = await getAccounts();
      const { lootContract } = await loadFixture(deployLootFixture);
      await mintNft(
        lootContract,
        admin,
        player1,
        [1],
        [1],
      );
      await mintNft(
        lootContract,
        admin,
        player2,
        [1, 3],
        [4, 5],
      );
      await totalSupply(lootContract, 1, 5n);
      await totalSupply(lootContract, 3, 5n);
    });
    it("getInventory", async () => {
      const { player1, admin } = await getAccounts();
      const { lootContract } = await loadFixture(deployLootFixture);
      await mintNft(
        lootContract,
        admin,
        player1,
        [1, 5, 8],
        [10, 20, 80],
      );
      await getInventory(lootContract, player1.address, [[1n, 10n], [5n, 20n], [8n, 80n]]);
    });
    it("isTrustedForwarder", async () => {
      const { trustedForwarder } = await getAccounts();
      const { lootContract } = await loadFixture(deployLootFixture);

      await isTrustedForwarder(
        lootContract as ERC2771Context,
        trustedForwarder.address,
        true,
      );
    });
    it("trustedForwarder", async () => {
      const { trustedForwarder } = await getAccounts();
      const { lootContract } = await loadFixture(deployLootFixture);
      await checkTrustedForwarder(
        lootContract as ERC2771Context,
        trustedForwarder.address,
      );
    });
    it("uri", async () => {
      const { player1, admin } = await getAccounts();
      const { lootContract } = await loadFixture(deployLootFixture);

      await mintNft(
        lootContract,
        admin,
        player1,
        [1],
        [1],
      );

      await getUri(lootContract, 1, generalSettings.NFT.baseUri + "1.json");
    });
  });

  describe("Write functions", function () {
    it("mintBatch(address,uint256[],uint256[],bytes)", async () => {
      const { player1, admin } = await getAccounts();
      const { lootContract } = await loadFixture(deployLootFixture);

      await mintNft(
        lootContract,
        admin,
        player1,
        [1, 5, 8],
        [10, 20, 80],
      );

      await balanceOfNft(lootContract, player1.address, 1, 10);
      await balanceOfNft(lootContract, player1.address, 5, 20);
      await balanceOfNft(lootContract, player1.address, 8, 80);
    });
    it("setBaseUri(string)", async () => {
      const { player1, admin } = await getAccounts();
      const { lootContract } = await loadFixture(deployLootFixture);

      await mintNft(
        lootContract,
        admin,
        player1,
        [1],
        [1],
      );

      await setUri(lootContract, admin, "someNewUri");
      await getUri(lootContract, 1, "someNewUri" + "1.json");
    });
  });

  describe("errors", () => {
    it("OwnableUnauthorizedAccount", async () => {
      const { player1 } = await getAccounts();
      const { lootContract } = await loadFixture(deployLootFixture);
      const nftId = 1;
      const value = 1;

      await mintNftWithError(
        lootContract,
        player1,
        player1,
        [nftId],
        [value],
        "OwnableUnauthorizedAccount",
        [player1.address],
      );
      await setUriWithError(
        lootContract,
        player1,
        "someNewUri",
        "OwnableUnauthorizedAccount",
        [player1.address]
      );
    });
    it("TokenDoesNotExist()", async () => {
      const { lootContract } = await loadFixture(deployLootFixture);

      await getUriWithError(lootContract, 1, "TokenDoesNotExist", []);
    });
  });
});
