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

describe("BlockRacers", function () {
  describe("deployment", () => {
    it("deploys as expected", async () => {
      const { feeAccount } = await getAccounts();
      const { blockRacersContract: coreContract } = await loadFixture(deployCoreFixture());

      await blockRacersFeeAccount(coreContract, feeAccount.address);
    });
  });
  describe("read", function () {
    it("assets", async () => {
      const { blockRacersContract: coreContract, blockRacersAssetsContract: assetsContract } = await loadFixture(
        deployCoreFixture(),
      );

      await checkAssets(coreContract, await assetsContract.getAddress());
    });
    it("blockRacersFeeAccount", async () => {
      const { feeAccount } = await getAccounts();
      const { blockRacersContract: coreContract } = await loadFixture(deployCoreFixture());

      await blockRacersFeeAccount(coreContract, feeAccount.address);
    });
    it("getItemData", async () => {
      const { blockRacersContract: coreContract } = await loadFixture(deployCoreFixture());

      await getItemData(coreContract, GameItem.CAR, defaultGameSettingsUnits[0]);
      await getItemData(coreContract, GameItem.ENGINE, defaultGameSettingsUnits[1]);
      await getItemData(coreContract, GameItem.HANDLING, defaultGameSettingsUnits[2]);
      await getItemData(coreContract, GameItem.NOS, defaultGameSettingsUnits[3]);
    });
    it("getNumberOfCarsMinted", async () => {
      const { player1 } = await getAccounts();
      const { coreContract, tokenContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      await numberOfCarsMinted(coreContract, 0);

      const carType = CarTypeOption.FIRST;
      const { carCost } = await getCarOption(coreContract, carType);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        carCost,
      );
      await mintCar(coreContract, carType, player1);

      await numberOfCarsMinted(coreContract, 1);
    });
    it("getUpgradeData", async () => {
      const { blockRacersContract: coreContract } = await loadFixture(deployCoreFixture());

      await getUpgradeData(coreContract, defaultGameSettingsUnits);
    });
    it("isTrustedForwarder", async () => {
      const { trustedForwarder } = await getAccounts();
      const { blockRacersContract: coreContract } = await loadFixture(deployCoreFixture());

      await isTrustedForwarder(
        coreContract as ERC2771Context,
        trustedForwarder.address,
        true,
      );
    });
    it("owner", async () => {
      const { admin } = await getAccounts();
      const { blockRacersContract: coreContract } = await loadFixture(deployCoreFixture());

      await checkOwner(coreContract, admin.address);
    });
    it("token", async () => {
      const tokenContract = await loadFixture(deployTokenFixture());
      const tokenAddress = await tokenContract.getAddress();
      const { blockRacersContract: coreContract } = await loadFixture(deployCoreFixture(tokenAddress));

      await checkToken(coreContract, tokenAddress);
    });
    it("trustedForwarder", async () => {
      const { trustedForwarder } = await getAccounts();
      const { blockRacersContract: coreContract } = await loadFixture(deployCoreFixture());
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
    it("setBlockRacersFeeAccount", async () => {
      const { admin, feeAccount, player3 } = await getAccounts();
      const { blockRacersContract: coreContract } = await loadFixture(deployCoreFixture());

      await getBlockracersFeeAccount(coreContract, feeAccount.address);

      await setBlockracersFeeAccount(coreContract, admin, player3.address);

      await getBlockracersFeeAccount(coreContract, player3.address);
    });
    it("setPrices", async () => {
      const { admin } = await getAccounts();
      const { blockRacersContract: coreContract } = await loadFixture(deployCoreFixture());

      await getUpgradeData(coreContract, defaultGameSettingsUnits);

      await setPrices(coreContract, admin, modifiedGameSettings);

      await getUpgradeData(coreContract, modifiedGameSettingsUnits);
    });
    it("transferOwnership", async () => {
      const { admin, player3 } = await getAccounts();
      const { blockRacersContract: coreContract } = await loadFixture(deployCoreFixture());

      await getOwner(coreContract, admin.address);

      await transferOwnership(coreContract, admin, player3.address);

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
      );
      await mintCar(coreContract, carType, player1);

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
      );
      await mintCar(coreContract, carType, player1);
      const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);

      const upgradeData = await getUpgradeData(coreContract);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        upgradeData[GameItem.ENGINE][1],
      );

      await upgradeEngine(coreContract, player1, numberOfCarsMintedAsID, 1);
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
      );
      await mintCar(coreContract, carType, player1);
      const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);

      const upgradeData = await getUpgradeData(coreContract);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        upgradeData[GameItem.HANDLING][1],
      );

      await upgradeHandling(coreContract, player1, numberOfCarsMintedAsID, 1);
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
      );
      await mintCar(coreContract, carType, player1);
      const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);

      const upgradeData = await getUpgradeData(coreContract);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        upgradeData[GameItem.NOS][1],
      );

      await upgradeNos(coreContract, player1, numberOfCarsMintedAsID, 1);
    });

    describe("Max level tests", () => {
      it("stops at the max level for Engine", async () => {
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
        );
        await mintCar(coreContract, carType, player1);
        const numberOfCarsMintedAsID = await numberOfCarsMinted(
          coreContract,
          1,
        );

        const upgradeData = await getUpgradeData(coreContract);

        // Max out stat
        for (let i = 1; i < upgradeData[GameItem.ENGINE].length; i++) {
          await setAllowanceToken(
            tokenContract,
            player1,
            await coreContract.getAddress(),
            upgradeData[GameItem.ENGINE][i],
          );

          await upgradeEngine(
            coreContract,
            player1,
            numberOfCarsMintedAsID,
            i,
          );
        }

        await upgradeEngineWithErrors(
          coreContract,
          player1,
          numberOfCarsMintedAsID,
          "InvalidItemLevel",
          [
            GameItem.ENGINE,
            upgradeData[GameItem.ENGINE].length,
          ],
        );
      });
      it("stops at the max level for Handling", async () => {
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
        );
        await mintCar(coreContract, carType, player1);
        const numberOfCarsMintedAsID = await numberOfCarsMinted(
          coreContract,
          1,
        );

        const upgradeData = await getUpgradeData(coreContract);

        // Max out stat
        for (let i = 1; i < upgradeData[GameItem.HANDLING].length; i++) {
          await setAllowanceToken(
            tokenContract,
            player1,
            await coreContract.getAddress(),
            upgradeData[GameItem.HANDLING][i],
          );

          await upgradeHandling(
            coreContract,
            player1,
            numberOfCarsMintedAsID,
            i,
          );
        }

        await upgradeHandlingWithErrors(
          coreContract,
          player1,
          numberOfCarsMintedAsID,
          "InvalidItemLevel",
          [
            GameItem.HANDLING,
            upgradeData[GameItem.HANDLING].length,
          ],
        );
      });
      it("stops at the max level for Nos", async () => {
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
        );
        await mintCar(coreContract, carType, player1);
        const numberOfCarsMintedAsID = await numberOfCarsMinted(
          coreContract,
          1,
        );

        const upgradeData = await getUpgradeData(coreContract);

        // Max out stat
        for (let i = 1; i < upgradeData[GameItem.NOS].length; i++) {
          await setAllowanceToken(
            tokenContract,
            player1,
            await coreContract.getAddress(),
            upgradeData[GameItem.NOS][i],
          );

          await upgradeNos(
            coreContract,
            player1,
            numberOfCarsMintedAsID,
            i,
          );
        }

        await upgradeNosWithErrors(
          coreContract,
          player1,
          numberOfCarsMintedAsID,
          "InvalidItemLevel",
          [
            GameItem.NOS,
            upgradeData[GameItem.NOS].length,
          ],
        );
      });
    });
  });

  describe("events", function () {
    it("MintCar", async () => {
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
      );
      await mintCarWithEvent(
        coreContract,
        tokenContract,
        carType,
        player1,
        "Purchase",
        [player1.address, 1, GameItem.CAR, carType],
      );
    });
    it("UpgradeEngine", async () => {
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
      );
      await mintCar(coreContract, carType, player1);
      const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);

      const upgradeData = await getUpgradeData(coreContract);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        upgradeData[GameItem.ENGINE][1],
      );

      await upgradeEngineWithEvent(
        coreContract,
        player1,
        numberOfCarsMintedAsID,
        "Purchase",
        [player1.address, numberOfCarsMintedAsID, GameItem.ENGINE, 1],
        1,
      );
    });
    it("UpgradeHandling", async () => {
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
      );
      await mintCar(coreContract, carType, player1);
      const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);

      const upgradeData = await getUpgradeData(coreContract);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        upgradeData[GameItem.HANDLING][1],
      );

      await upgradeHandlingWithEvent(
        coreContract,
        player1,
        numberOfCarsMintedAsID,
        "Purchase",
        [player1.address, numberOfCarsMintedAsID, GameItem.HANDLING, 1],
        1,
      );
    });
    it("UpgradeNos", async () => {
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
      );
      await mintCar(coreContract, carType, player1);
      const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);

      const upgradeData = await getUpgradeData(coreContract);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        upgradeData[GameItem.NOS][1],
      );

      await upgradeNosWithEvent(
        coreContract,
        player1,
        numberOfCarsMintedAsID,
        "Purchase",
        [player1.address, numberOfCarsMintedAsID, GameItem.NOS, 1],
        1,
      );
    });
  });

  describe("errors", function () {
    it("CarTypeDoesNotExist", async () => {
      const { player1 } = await getAccounts();
      const { blockRacersContract: coreContract } = await loadFixture(deployCoreFixture());

      await mintCarWithErrors(
        coreContract,
        4 as CarTypeOption,
        player1,
        "InvalidItemLevel",
        [GameItem.CAR, 4],
      );
    });
    it("NotCarOwner", async () => {
      const { player1, player2 } = await getAccounts();
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
      );
      await mintCar(coreContract, carType, player1);
      const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);

      const upgradeData = await getUpgradeData(coreContract);

      await setAllowanceToken(
        tokenContract,
        player1,
        await coreContract.getAddress(),
        upgradeData[GameItem.ENGINE][1],
      );

      await upgradeEngineWithErrors(
        coreContract,
        player2,
        numberOfCarsMintedAsID,
        "NotCarOwner",
        [numberOfCarsMintedAsID],
      );
    });
    it("InvalidItemType", async () => {
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
      );
      await mintCar(coreContract, carType, player1);
      const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);
      await upgradeWithErrors(
        coreContract,
        player1,
        numberOfCarsMintedAsID,
        GameItem.CAR,
        "InvalidItemType",
        [],
      );
    });
  });
});
