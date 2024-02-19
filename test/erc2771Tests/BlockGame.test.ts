import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import {
  ObjectTypeOption,
  GameItem,
  deployCoreFixture,
  getFeeAccount,
  getObjectOption,
  isObjectOwner,
  getObjectStats,
  getOwner,
  getUpgradeData,
  mintObject,
  modifiedGameSettings,
  modifiedGameSettingsUnits,
  numberOfObjectsMinted,
  renounceOwnership,
  setFeeAccount,
  setPrices,
  transferOwnership,
  upgradeItem1,
  upgradeItem2,
  upgradeItem3,
} from "../../src/BlockGame.contract";
import { defaultDeployFixture, getAccounts } from "../../src/generalFunctions";
import { setAllowanceToken } from "../../src/BlockGameToken.contract";
import { defaultGameSettings, defaultGameSettingsUnits } from "../../scripts/defaultSettings";
import { ZeroAddress } from "ethers";

describe("BlockGame - ERC2771", function () {
  describe("admin", () => {
    it("renounceOwnership", async () => {
      const { admin } = await getAccounts();

      const { coreContract } = await loadFixture(defaultDeployFixture(true));
      await getOwner(coreContract, admin.address);

      await renounceOwnership(coreContract, admin, true);

      await getOwner(coreContract, ZeroAddress);
    });
    it("setBlockGameFeeAccount", async () => {
      const { admin, feeAccount, player3 } = await getAccounts();
      const { blockGameContract: coreContract } = await loadFixture(deployCoreFixture());

      await getFeeAccount(coreContract, feeAccount.address);

      await setFeeAccount(
        coreContract,
        admin,
        player3.address,
        true,
      );

      await getFeeAccount(coreContract, player3.address);
    });
    it("setPrices", async () => {
      const { admin } = await getAccounts();
      const { blockGameContract: coreContract } = await loadFixture(deployCoreFixture());

      await getUpgradeData(coreContract, defaultGameSettingsUnits);

      await setPrices(coreContract, admin, modifiedGameSettings, true);

      await getUpgradeData(coreContract, modifiedGameSettingsUnits);
    });
    it("transferOwnership", async () => {
      const { admin, player3 } = await getAccounts();
      const { blockGameContract: coreContract } = await loadFixture(deployCoreFixture());

      await getOwner(coreContract, admin.address);

      await transferOwnership(coreContract, admin, player3.address, true);

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
        undefined,
        true,
      );
      await mintObject(coreContract, objectType, player1, true);

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
        undefined,
        true,
      );
      await mintObject(coreContract, objectType, player1, true);
      const numberOfObjectsMintedAsID = await numberOfObjectsMinted(coreContract, 1);

      const upgradeData = await getUpgradeData(coreContract);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        upgradeData[GameItem.ITEM1][1],
        undefined,
        true,
      );

      await upgradeItem1(
        coreContract,
        player1,
        numberOfObjectsMintedAsID,
        1,
        true,
      );
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
        undefined,
        true,
      );
      await mintObject(coreContract, objectType, player1, true);
      const numberOfObjectsMintedAsID = await numberOfObjectsMinted(coreContract, 1);

      const upgradeData = await getUpgradeData(coreContract);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        upgradeData[GameItem.ITEM2][1],
        undefined,
        true,
      );

      await upgradeItem2(
        coreContract,
        player1,
        numberOfObjectsMintedAsID,
        1,
        true,
      );
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
        undefined,
        true,
      );
      await mintObject(coreContract, objectType, player1, true);
      const numberOfObjectsMintedAsID = await numberOfObjectsMinted(coreContract, 1);

      const upgradeData = await getUpgradeData(coreContract);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        upgradeData[GameItem.ITEM3][1],
        undefined,
        true,
      );

      await upgradeItem3(coreContract, player1, numberOfObjectsMintedAsID, 1, true);
    });
  });
});
