import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import {
  ObjectTypeOption,
  GameItem,
  getFeeAccount,
  checkAssets,
  checkOwner,
  checkToken,
  deployCoreFixture,
  getFeeAccount,
  getObjectOption,
  isObjectOwner,
  getObjectStats,
  getItemData,
  getItemDataWithError,
  getOwner,
  getUpgradeData,
  mintObject,
  mintObjectWithErrors,
  mintObjectWithEvent,
  modifiedGameSettings,
  modifiedGameSettingsUnits,
  numberOfObjectsMinted,
  renounceOwnership,
  setFeeAccount,
  setPrices,
  transferOwnership,
  upgradeItem1,
  upgradeItem1WithErrors,
  upgradeItem1WithEvent,
  upgradeItem2,
  upgradeItem2WithErrors,
  upgradeItem2WithEvent,
  upgradeItem3,
  upgradeItem3WithErrors,
  upgradeItem3WithEvent,
  upgradeWithErrors,
} from "../src/BlockGame.contract";
import {
  checkTrustedForwarder,
  defaultDeployFixture,
  getAccounts,
  isTrustedForwarder,
} from "../src/generalFunctions";
import {
  deployTokenFixture,
  setAllowanceToken,
} from "../src/BlockGameToken.contract";
import { deployAssetsFixture } from "../src/BlockGameAssets.contract";
import { ERC2771Context } from "../typechain-types";
import { defaultGameSettings, defaultGameSettingsUnits } from "../scripts/defaultSettings";
import { ZeroAddress } from "ethers";

describe("BlockGame", function () {
  describe("deployment", () => {
    it("deploys as expected", async () => {
      const { feeAccount } = await getAccounts();
      const { blockGameContract: coreContract } = await loadFixture(deployCoreFixture());

      await getFeeAccount(coreContract, feeAccount.address);
    });
  });
  describe("read", function () {
    it("assets", async () => {
      const { blockGameContract: coreContract, blockGameAssetsContract: assetsContract } = await loadFixture(
        deployCoreFixture(),
      );

      await checkAssets(coreContract, await assetsContract.getAddress());
    });
    it("feeAccount", async () => {
      const { feeAccount } = await getAccounts();
      const { blockGameContract: coreContract } = await loadFixture(deployCoreFixture());

      await getFeeAccount(coreContract, feeAccount.address);
    });
    it("getItemData", async () => {
      const { blockGameContract: coreContract } = await loadFixture(deployCoreFixture());

      await getItemData(coreContract, GameItem.OBJECT, defaultGameSettingsUnits[0]);
      await getItemData(coreContract, GameItem.ITEM1, defaultGameSettingsUnits[1]);
      await getItemData(coreContract, GameItem.ITEM2, defaultGameSettingsUnits[2]);
      await getItemData(coreContract, GameItem.ITEM3, defaultGameSettingsUnits[3]);
    });
    it("getNumberOfObjectsMinted", async () => {
      const { player1 } = await getAccounts();
      const { coreContract, tokenContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      await numberOfObjectsMinted(coreContract, 0);

      const objectType = ObjectTypeOption.FIRST;
      const { objectCost } = await getObjectOption(coreContract, objectType);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        objectCost,
      );
      await mintObject(coreContract, objectType, player1);

      await numberOfObjectsMinted(coreContract, 1);
    });
    it("getUpgradeData", async () => {
      const { blockGameContract: coreContract } = await loadFixture(deployCoreFixture());

      await getUpgradeData(coreContract, defaultGameSettingsUnits);
    });
    it("isTrustedForwarder", async () => {
      const { trustedForwarder } = await getAccounts();
      const { blockGameContract: coreContract } = await loadFixture(deployCoreFixture());

      await isTrustedForwarder(
        coreContract as ERC2771Context,
        trustedForwarder.address,
        true,
      );
    });
    it("owner", async () => {
      const { admin } = await getAccounts();
      const { blockGameContract: coreContract } = await loadFixture(deployCoreFixture());

      await checkOwner(coreContract, admin.address);
    });
    it("token", async () => {
      const tokenContract = await loadFixture(deployTokenFixture());
      const tokenAddress = await tokenContract.getAddress();
      const { blockGameContract: coreContract } = await loadFixture(deployCoreFixture(tokenAddress));

      await checkToken(coreContract, tokenAddress);
    });
    it("trustedForwarder", async () => {
      const { trustedForwarder } = await getAccounts();
      const { blockGameContract: coreContract } = await loadFixture(deployCoreFixture());
      await checkTrustedForwarder(
        coreContract as ERC2771Context,
        trustedForwarder.address,
      );
    });
  });

  describe("admin", () => {
    it("renounceOwnership", async () => {
      const { admin } = await getAccounts();

      const { coreContract } = await loadFixture(defaultDeployFixture(true));
      await getOwner(coreContract, admin.address);

      await renounceOwnership(coreContract, admin);

      await getOwner(coreContract, ZeroAddress);
    });
    it("setBlockGameFeeAccount", async () => {
      const { admin, feeAccount, player3 } = await getAccounts();
      const { blockGameContract: coreContract } = await loadFixture(deployCoreFixture());

      await getFeeAccount(coreContract, feeAccount.address);

      await setFeeAccount(coreContract, admin, player3.address);

      await getFeeAccount(coreContract, player3.address);
    });
    it("setPrices", async () => {
      const { admin } = await getAccounts();
      const { blockGameContract: coreContract } = await loadFixture(deployCoreFixture());

      await getUpgradeData(coreContract, defaultGameSettingsUnits);

      await setPrices(coreContract, admin, modifiedGameSettings);

      await getUpgradeData(coreContract, modifiedGameSettingsUnits);
    });
    it("transferOwnership", async () => {
      const { admin, player3 } = await getAccounts();
      const { blockGameContract: coreContract } = await loadFixture(deployCoreFixture());

      await getOwner(coreContract, admin.address);

      await transferOwnership(coreContract, admin, player3.address);

      await getOwner(coreContract, player3.address);
    });
  });

  describe("write", function () {
    it("mintObject", async () => {
      const { player1 } = await getAccounts();

      const { coreContract, tokenContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      const objectType = ObjectTypeOption.FIRST;
      const { objectCost } = await getObjectOption(coreContract, objectType);
      await numberOfObjectsMinted(coreContract, 0);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        objectCost,
      );
      await mintObject(coreContract, objectType, player1);

      const objectOption = await getObjectOption(coreContract, objectType);

      const numberOfObjectsMintedAsID = await numberOfObjectsMinted(coreContract, 1);

      await isObjectOwner(coreContract, player1, numberOfObjectsMintedAsID, true);

      await getObjectStats(coreContract, numberOfObjectsMintedAsID, [objectType, 0, 0, 0]);
    });
    it("upgradeItem1", async () => {
      const { player1 } = await getAccounts();
      const { coreContract, tokenContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      const objectType = ObjectTypeOption.FIRST;
      const { objectCost } = await getObjectOption(coreContract, objectType);
      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        objectCost,
      );
      await mintObject(coreContract, objectType, player1);
      const numberOfObjectsMintedAsID = await numberOfObjectsMinted(coreContract, 1);

      const upgradeData = await getUpgradeData(coreContract);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        upgradeData[GameItem.ITEM1][1],
      );

      await upgradeItem1(coreContract, player1, numberOfObjectsMintedAsID, 1);
    });
    it("upgradeItem2", async () => {
      const { player1 } = await getAccounts();
      const { coreContract, tokenContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      const objectType = ObjectTypeOption.FIRST;
      const { objectCost } = await getObjectOption(coreContract, objectType);
      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        objectCost,
      );
      await mintObject(coreContract, objectType, player1);
      const numberOfObjectsMintedAsID = await numberOfObjectsMinted(coreContract, 1);

      const upgradeData = await getUpgradeData(coreContract);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        upgradeData[GameItem.ITEM2][1],
      );

      await upgradeItem2(coreContract, player1, numberOfObjectsMintedAsID, 1);
    });
    it("upgradeItem3", async () => {
      const { player1 } = await getAccounts();
      const { coreContract, tokenContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      const objectType = ObjectTypeOption.FIRST;
      const { objectCost } = await getObjectOption(coreContract, objectType);
      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        objectCost,
      );
      await mintObject(coreContract, objectType, player1);
      const numberOfObjectsMintedAsID = await numberOfObjectsMinted(coreContract, 1);

      const upgradeData = await getUpgradeData(coreContract);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        upgradeData[GameItem.ITEM3][1],
      );

      await upgradeItem3(coreContract, player1, numberOfObjectsMintedAsID, 1);
    });

    describe("Max level tests", () => {
      it("stops at the max level for Item1", async () => {
        const { player1 } = await getAccounts();
        const { coreContract, tokenContract } = await loadFixture(
          defaultDeployFixture(true),
        );
        const objectType = ObjectTypeOption.FIRST;
        const { objectCost } = await getObjectOption(coreContract, objectType);

        await setAllowanceToken(
          tokenContract,
          player1,
          await coreContract.getAddress(),
          objectCost,
        );
        await mintObject(coreContract, objectType, player1);
        const numberOfObjectsMintedAsID = await numberOfObjectsMinted(
          coreContract,
          1,
        );

        const upgradeData = await getUpgradeData(coreContract);

        // Max out stat
        for (let i = 1; i < upgradeData[GameItem.ITEM1].length; i++) {
          await setAllowanceToken(
            tokenContract,
            player1,
            await coreContract.getAddress(),
            upgradeData[GameItem.ITEM1][i],
          );

          await upgradeItem1(
            coreContract,
            player1,
            numberOfObjectsMintedAsID,
            i,
          );
        }

        await upgradeItem1WithErrors(
          coreContract,
          player1,
          numberOfObjectsMintedAsID,
          "InvalidItemLevel",
          [
            GameItem.ITEM1,
            upgradeData[GameItem.ITEM1].length,
          ],
        );
      });
      it("stops at the max level for Item2", async () => {
        const { player1 } = await getAccounts();
        const { coreContract, tokenContract } = await loadFixture(
          defaultDeployFixture(true),
        );
        const objectType = ObjectTypeOption.FIRST;
        const { objectCost } = await getObjectOption(coreContract, objectType);

        await setAllowanceToken(
          tokenContract,
          player1,
          await coreContract.getAddress(),
          objectCost,
        );
        await mintObject(coreContract, objectType, player1);
        const numberOfObjectsMintedAsID = await numberOfObjectsMinted(
          coreContract,
          1,
        );

        const upgradeData = await getUpgradeData(coreContract);

        // Max out stat
        for (let i = 1; i < upgradeData[GameItem.ITEM2].length; i++) {
          await setAllowanceToken(
            tokenContract,
            player1,
            await coreContract.getAddress(),
            upgradeData[GameItem.ITEM2][i],
          );

          await upgradeItem2(
            coreContract,
            player1,
            numberOfObjectsMintedAsID,
            i,
          );
        }

        await upgradeItem2WithErrors(
          coreContract,
          player1,
          numberOfObjectsMintedAsID,
          "InvalidItemLevel",
          [
            GameItem.ITEM2,
            upgradeData[GameItem.ITEM2].length,
          ],
        );
      });
      it("stops at the max level for Item3", async () => {
        const { player1 } = await getAccounts();
        const { coreContract, tokenContract } = await loadFixture(
          defaultDeployFixture(true),
        );
        const objectType = ObjectTypeOption.FIRST;
        const { objectCost } = await getObjectOption(coreContract, objectType);

        await setAllowanceToken(
          tokenContract,
          player1,
          await coreContract.getAddress(),
          objectCost,
        );
        await mintObject(coreContract, objectType, player1);
        const numberOfObjectsMintedAsID = await numberOfObjectsMinted(
          coreContract,
          1,
        );

        const upgradeData = await getUpgradeData(coreContract);

        // Max out stat
        for (let i = 1; i < upgradeData[GameItem.ITEM3].length; i++) {
          await setAllowanceToken(
            tokenContract,
            player1,
            await coreContract.getAddress(),
            upgradeData[GameItem.ITEM3][i],
          );

          await upgradeItem3(
            coreContract,
            player1,
            numberOfObjectsMintedAsID,
            i,
          );
        }

        await upgradeItem3WithErrors(
          coreContract,
          player1,
          numberOfObjectsMintedAsID,
          "InvalidItemLevel",
          [
            GameItem.ITEM3,
            upgradeData[GameItem.ITEM3].length,
          ],
        );
      });
    });
  });

  describe("events", function () {
    it("MintObject", async () => {
      const { player1 } = await getAccounts();

      const { coreContract, tokenContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      const objectType = ObjectTypeOption.FIRST;
      const { objectCost } = await getObjectOption(coreContract, objectType);
      await numberOfObjectsMinted(coreContract, 0);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        objectCost,
      );
      await mintObjectWithEvent(
        coreContract,
        tokenContract,
        objectType,
        player1,
        "Purchase",
        [player1.address, 1, GameItem.OBJECT, objectType],
      );
    });
    it("UpgradeItem1", async () => {
      const { player1 } = await getAccounts();
      const { coreContract, tokenContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      const objectType = ObjectTypeOption.FIRST;
      const { objectCost } = await getObjectOption(coreContract, objectType);
      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        objectCost,
      );
      await mintObject(coreContract, objectType, player1);
      const numberOfObjectsMintedAsID = await numberOfObjectsMinted(coreContract, 1);

      const upgradeData = await getUpgradeData(coreContract);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        upgradeData[GameItem.ITEM1][1],
      );

      await upgradeItem1WithEvent(
        coreContract,
        player1,
        numberOfObjectsMintedAsID,
        "Purchase",
        [player1.address, numberOfObjectsMintedAsID, GameItem.ITEM1, 1],
        1,
      );
    });
    it("UpgradeItem2", async () => {
      const { player1 } = await getAccounts();
      const { coreContract, tokenContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      const objectType = ObjectTypeOption.FIRST;
      const { objectCost } = await getObjectOption(coreContract, objectType);
      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        objectCost,
      );
      await mintObject(coreContract, objectType, player1);
      const numberOfObjectsMintedAsID = await numberOfObjectsMinted(coreContract, 1);

      const upgradeData = await getUpgradeData(coreContract);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        upgradeData[GameItem.ITEM2][1],
      );

      await upgradeItem2WithEvent(
        coreContract,
        player1,
        numberOfObjectsMintedAsID,
        "Purchase",
        [player1.address, numberOfObjectsMintedAsID, GameItem.ITEM2, 1],
        1,
      );
    });
    it("UpgradeItem3", async () => {
      const { player1 } = await getAccounts();
      const { coreContract, tokenContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      const objectType = ObjectTypeOption.FIRST;
      const { objectCost } = await getObjectOption(coreContract, objectType);
      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        objectCost,
      );
      await mintObject(coreContract, objectType, player1);
      const numberOfObjectsMintedAsID = await numberOfObjectsMinted(coreContract, 1);

      const upgradeData = await getUpgradeData(coreContract);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        upgradeData[GameItem.ITEM3][1],
      );

      await upgradeItem3WithEvent(
        coreContract,
        player1,
        numberOfObjectsMintedAsID,
        "Purchase",
        [player1.address, numberOfObjectsMintedAsID, GameItem.ITEM3, 1],
        1,
      );
    });
  });

  describe("errors", function () {
    it("ObjectTypeDoesNotExist", async () => {
      const { player1 } = await getAccounts();
      const { blockGameContract: coreContract } = await loadFixture(deployCoreFixture());

      await mintObjectWithErrors(
        coreContract,
        4 as ObjectTypeOption,
        player1,
        "InvalidItemLevel",
        [GameItem.OBJECT, 4],
      );
    });
    it("NotObjectOwner", async () => {
      const { player1, player2 } = await getAccounts();
      const { coreContract, tokenContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      const objectType = ObjectTypeOption.FIRST;
      const { objectCost } = await getObjectOption(coreContract, objectType);
      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        objectCost,
      );
      await mintObject(coreContract, objectType, player1);
      const numberOfObjectsMintedAsID = await numberOfObjectsMinted(coreContract, 1);

      const upgradeData = await getUpgradeData(coreContract);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        upgradeData[GameItem.ITEM1][1],
      );

      await upgradeItem1WithErrors(
        coreContract,
        player2,
        numberOfObjectsMintedAsID,
        "NotObjectOwner",
        [numberOfObjectsMintedAsID],
      );
    });
    it("InvalidItemType", async () => {
      const { player1 } = await getAccounts();
      const { coreContract, tokenContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      const objectType = ObjectTypeOption.FIRST;
      const { objectCost } = await getObjectOption(coreContract, objectType);
      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        objectCost,
      );
      await mintObject(coreContract, objectType, player1);
      const numberOfObjectsMintedAsID = await numberOfObjectsMinted(coreContract, 1);
      await upgradeWithErrors(
        coreContract,
        player1,
        numberOfObjectsMintedAsID,
        GameItem.OBJECT,
        "InvalidItemType",
        [],
      );
    });
  });
});
