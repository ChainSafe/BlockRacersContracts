import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import {
  CarTypeOption,
  GameItem,
  deployCoreFixture,
  getBlockracersFeeAccount,
  getCarOption,
  isCarOwner,
  getCarStats,
  getOwner,
  getUpgradeData,
  mintCar,
  modifiedGameSettings,
  modifiedGameSettingsUnits,
  numberOfCarsMinted,
  renounceOwnership,
  setBlockracersFeeAccount,
  setPrices,
  transferOwnership,
  upgradeEngine,
  upgradeHandling,
  upgradeNos,
} from "../../src/BlockRacers.contract";
import { defaultDeployFixture, getAccounts } from "../../src/generalFunctions";
import { setAllowanceToken } from "../../src/BlockRacersToken.contract";
import { defaultGameSettings, defaultGameSettingsUnits } from "../../scripts/defaultSettings";
import { ZeroAddress } from "ethers";

describe("BlockRacers - ERC2771", function () {
  describe("admin", () => {
    it("renounceOwnership", async () => {
      const { admin } = await getAccounts();

      const { coreContract } = await loadFixture(defaultDeployFixture(true));
      await getOwner(coreContract, admin.address);

      await renounceOwnership(coreContract, admin, true);

      await getOwner(coreContract, ZeroAddress);
    });
    it("setBlockRacersFeeAccount", async () => {
      const { admin, feeAccount, player3 } = await getAccounts();
      const { blockRacersContract: coreContract } = await loadFixture(deployCoreFixture());

      await getBlockracersFeeAccount(coreContract, feeAccount.address);

      await setBlockracersFeeAccount(
        coreContract,
        admin,
        player3.address,
        true,
      );

      await getBlockracersFeeAccount(coreContract, player3.address);
    });
    it("setPrices", async () => {
      const { admin } = await getAccounts();
      const { blockRacersContract: coreContract } = await loadFixture(deployCoreFixture());

      await getUpgradeData(coreContract, defaultGameSettingsUnits);

      await setPrices(coreContract, admin, modifiedGameSettings, true);

      await getUpgradeData(coreContract, modifiedGameSettingsUnits);
    });
    it("transferOwnership", async () => {
      const { admin, player3 } = await getAccounts();
      const { blockRacersContract: coreContract } = await loadFixture(deployCoreFixture());

      await getOwner(coreContract, admin.address);

      await transferOwnership(coreContract, admin, player3.address, true);

      await getOwner(coreContract, player3.address);
    });
  });

  describe("write", function () {
    it("mintCar", async () => {
      const { player1 } = await getAccounts();

      const { coreContract, tokenContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      const carType = CarTypeOption.FIRST;
      const { carCost } = await getCarOption(coreContract, carType);
      await numberOfCarsMinted(coreContract, 0);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        carCost,
        undefined,
        true,
      );
      await mintCar(coreContract, carType, player1, true);

      const carOption = await getCarOption(coreContract, carType);

      const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);

      await isCarOwner(coreContract, player1, numberOfCarsMintedAsID, true);

      await getCarStats(coreContract, numberOfCarsMintedAsID, [carType, 0, 0, 0]);
    });
    it("upgradeEngine", async () => {
      const { player1 } = await getAccounts();
      const { coreContract, tokenContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      const carType = CarTypeOption.FIRST;
      const { carCost } = await getCarOption(coreContract, carType);
      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        carCost,
        undefined,
        true,
      );
      await mintCar(coreContract, carType, player1, true);
      const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);

      const upgradeData = await getUpgradeData(coreContract);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        upgradeData[GameItem.ENGINE][1],
        undefined,
        true,
      );

      await upgradeEngine(
        coreContract,
        player1,
        numberOfCarsMintedAsID,
        1,
        true,
      );
    });
    it("upgradeHandling", async () => {
      const { player1 } = await getAccounts();
      const { coreContract, tokenContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      const carType = CarTypeOption.FIRST;
      const { carCost } = await getCarOption(coreContract, carType);
      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        carCost,
        undefined,
        true,
      );
      await mintCar(coreContract, carType, player1, true);
      const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);

      const upgradeData = await getUpgradeData(coreContract);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        upgradeData[GameItem.HANDLING][1],
        undefined,
        true,
      );

      await upgradeHandling(
        coreContract,
        player1,
        numberOfCarsMintedAsID,
        1,
        true,
      );
    });
    it("upgradeNos", async () => {
      const { player1 } = await getAccounts();
      const { coreContract, tokenContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      const carType = CarTypeOption.FIRST;
      const { carCost } = await getCarOption(coreContract, carType);
      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        carCost,
        undefined,
        true,
      );
      await mintCar(coreContract, carType, player1, true);
      const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);

      const upgradeData = await getUpgradeData(coreContract);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        upgradeData[GameItem.NOS][1],
        undefined,
        true,
      );

      await upgradeNos(coreContract, player1, numberOfCarsMintedAsID, 1, true);
    });
  });
});
