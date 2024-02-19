import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import {
  CarTypeOption,
  GameItem,
  blockRacersFeeAccount,
  checkAssets,
  checkOwner,
  checkToken,
  deployCoreFixture,
  getBlockracersFeeAccount,
  getCarOption,
  isCarOwner,
  getCarStats,
  getItemData,
  getItemDataWithError,
  getOwner,
  getUpgradeData,
  mintCar,
  mintCarWithErrors,
  mintCarWithEvent,
  modifiedGameSettings,
  modifiedGameSettingsUnits,
  numberOfCarsMinted,
  renounceOwnership,
  setBlockracersFeeAccount,
  setPrices,
  transferOwnership,
  upgradeEngine,
  upgradeEngineWithErrors,
  upgradeEngineWithEvent,
  upgradeHandling,
  upgradeHandlingWithErrors,
  upgradeHandlingWithEvent,
  upgradeNos,
  upgradeNosWithErrors,
  upgradeNosWithEvent,
  upgradeWithErrors,
  getUserMintedTypes,
} from "../src/BlockRacers.contract";
import {
  checkTrustedForwarder,
  defaultDeployFixture,
  getAccounts,
  isTrustedForwarder,
} from "../src/generalFunctions";
import {
  deployTokenFixture,
  setAllowanceToken,
} from "../src/BlockRacersToken.contract";
import { deployAssetsFixture } from "../src/BlockRacersAssets.contract";
import { ERC2771Context } from "../typechain-types";
import { defaultGameSettings, defaultGameSettingsUnits } from "../scripts/defaultSettings";
import { ZeroAddress } from "ethers";

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
