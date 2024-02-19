import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import {
  CarTypeOption,
  deployCoreFixture,
  getCarOption,
  mintCar,
  getUserMintedTypes,
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
    });
  });
});
