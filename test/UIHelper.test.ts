import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import {
  CarTypeOption,
  GameItem,
  deployCoreFixture,
  getCarOption,
  getUpgradeData,
  upgradeEngine,
  mintCar,
  getUserMintedTypes,
  getUserCarsByTypeWithStats,
} from "../src/BlockRacers.contract";
import {
  defaultDeployFixture,
  getAccounts,
} from "../src/generalFunctions";
import {
  setAllowanceToken,
} from "../src/BlockRacersToken.contract";

describe("UIHelper", function () {
  describe("read", function () {
    it("empty", async () => {
      const { player1 } = await getAccounts();
      const { uiHelperContract } = await loadFixture(
        deployCoreFixture(),
      );

      await getUserMintedTypes(uiHelperContract, player1.address, [false, false, false]);
      await getUserCarsByTypeWithStats(uiHelperContract, player1.address, [
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

      const carType = CarTypeOption.FIRST;
      const { carCost } = await getCarOption(coreContract, carType);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        carCost,
      );
      await mintCar(coreContract, carType, player1);

      await getUserMintedTypes(uiHelperContract, player1.address, [true, false, false]);
      await getUserCarsByTypeWithStats(uiHelperContract, player1.address, [
        [1n, 0n, 0n, 0n],
        [0n, 0n, 0n, 0n],
        [0n, 0n, 0n, 0n],
      ]);

      const upgradeData = await getUpgradeData(coreContract);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        upgradeData[GameItem.ENGINE][1],
      );

      await upgradeEngine(coreContract, player1, 1, 1);

      await getUserCarsByTypeWithStats(uiHelperContract, player1.address, [
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

      let carType = CarTypeOption.FIRST;
      let { carCost } = await getCarOption(coreContract, carType);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        carCost,
      );
      await mintCar(coreContract, carType, player1);

      carType = CarTypeOption.THIRD;
      ({ carCost } = await getCarOption(coreContract, carType));

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        carCost,
      );
      await mintCar(coreContract, carType, player1);

      await getUserMintedTypes(uiHelperContract, player1.address, [true, false, true]);
      await getUserCarsByTypeWithStats(uiHelperContract, player1.address, [
        [1n, 0n, 0n, 0n],
        [0n, 0n, 0n, 0n],
        [2n, 0n, 0n, 0n],
      ]);
    });
  });
});
