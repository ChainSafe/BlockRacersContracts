import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import {
  ObjectTypeOption,
  GameItem,
  deployCoreFixture,
  getObjectOption,
  getUpgradeData,
  upgradeItem1,
  mintObject,
  getUserMintedTypes,
  getUserObjectsByTypeWithStats,
} from "../src/BlockGame.contract";
import {
  defaultDeployFixture,
  getAccounts,
} from "../src/generalFunctions";
import {
  setAllowanceToken,
} from "../src/BlockGameToken.contract";

describe("UIHelper", function () {
  describe("read", function () {
    it("empty", async () => {
      const { player1 } = await getAccounts();
      const { uiHelperContract } = await loadFixture(
        deployCoreFixture(),
      );

      await getUserMintedTypes(uiHelperContract, player1.address, [false, false, false]);
      await getUserObjectsByTypeWithStats(uiHelperContract, player1.address, [
        [0n, 0n, 0n, 0n],
        [0n, 0n, 0n, 0n],
        [0n, 0n, 0n, 0n],
      ]);
    });
    it("single", async () => {
      const { player1 } = await getAccounts();

      const { coreContract, tokenContract, uiHelperContract } = await loadFixture(
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

      await getUserMintedTypes(uiHelperContract, player1.address, [true, false, false]);
      await getUserObjectsByTypeWithStats(uiHelperContract, player1.address, [
        [1n, 0n, 0n, 0n],
        [0n, 0n, 0n, 0n],
        [0n, 0n, 0n, 0n],
      ]);

      const upgradeData = await getUpgradeData(coreContract);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        upgradeData[GameItem.ITEM1][1],
      );

      await upgradeItem1(coreContract, player1, 1, 1);

      await getUserObjectsByTypeWithStats(uiHelperContract, player1.address, [
        [1n, 1n, 0n, 0n],
        [0n, 0n, 0n, 0n],
        [0n, 0n, 0n, 0n],
      ]);
    });
    it("multiple", async () => {
      const { player1 } = await getAccounts();

      const { coreContract, tokenContract, uiHelperContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      let objectType = ObjectTypeOption.FIRST;
      let { objectCost } = await getObjectOption(coreContract, objectType);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        objectCost,
      );
      await mintObject(coreContract, objectType, player1);

      objectType = ObjectTypeOption.THIRD;
      ({ objectCost } = await getObjectOption(coreContract, objectType));

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        objectCost,
      );
      await mintObject(coreContract, objectType, player1);

      await getUserMintedTypes(uiHelperContract, player1.address, [true, false, true]);
      await getUserObjectsByTypeWithStats(uiHelperContract, player1.address, [
        [1n, 0n, 0n, 0n],
        [0n, 0n, 0n, 0n],
        [2n, 0n, 0n, 0n],
      ]);
    });
  });
});
