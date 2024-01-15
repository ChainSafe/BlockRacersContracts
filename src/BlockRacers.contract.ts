import { ethers } from "hardhat";
import { getAccounts, sponsorRelayCall } from "./generalFunctions";
import {
  AddressLike,
  BigNumberish,
  ContractTransactionResponse,
  parseUnits,
} from "ethers";
import { defaultGameSettings } from "../scripts/defaultSettings";
import { approvalToken, deployTokenFixture } from "./BlockRacersToken.contract";
import { deployAssetsFixture } from "./BlockRacersAssets.contract";
import { BlockRacers, BlockRacersToken } from "../typechain-types";
import { assert, expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

export enum CarTypeOption {
  FIRST = 0,
  SECOND = 1,
  THIRD = 2,
}

export enum GameItem {
  CAR = 0,
  ENGINE = 1,
  HANDLING = 2,
  NOS = 3,
}

export const modifiedGameSettings: BlockRacers.GameSettingsDataStruct = {
  carOptions: [
    {
      carCost: parseUnits("55", 18),
      carUri: "QmdW2tRdCw2YERvhzbMHn2qcaBHPMNo5ofsoo8q9q9N3Qe",
    },
    {
      carCost: parseUnits("45", 18),
      carUri: "QmWavwGJgqxMP38a6cxn9ehJASqdXNNcRT4YD7sa3dDMST",
    },
    {
      carCost: parseUnits("30", 18),
      carUri: "QmevuY959udKfEYXJvLZmVqiNFVe6KfqqxMRprYbtRhncP",
    },
  ],
  engineMaxLevel: 10,
  enginePrice: parseUnits("15", 18),
  handlingMaxLevel: 10,
  handlingPrice: parseUnits("12", 18),
  nosMaxLevel: 6,
  nosPrice: parseUnits("40", 18),
};

export const deployCoreFixture = (
  erc20TokenAddress?: AddressLike,
  erc1155TokenAddress?: AddressLike,
) => {
  return async function coreFixture() {
    const { admin, trustedForwarder, feeAccount } = await getAccounts();

    if (!erc20TokenAddress) {
      erc20TokenAddress = (await deployTokenFixture()()).getAddress();
    }

    if (!erc1155TokenAddress) {
      erc1155TokenAddress = await (await deployAssetsFixture()).getAddress();
    }

    const blockRacers = await ethers.getContractFactory("BlockRacers", admin);
    const blockRacersContract = await blockRacers.deploy(
      trustedForwarder,
      admin,
      erc20TokenAddress,
      erc1155TokenAddress,
      feeAccount,
      defaultGameSettings,
    );

    await blockRacersContract.waitForDeployment();

    return blockRacersContract;
  };
};

// Admin
export const renounceOwnership = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  admin: HardhatEthersSigner,
  relay: boolean = false,
) => {
  // TODO: Check Event once
  // Get from latest before then

  if (relay) {
    const { data } = await coreContract
      .connect(admin)
      .renounceOwnership.populateTransaction();

    await sponsorRelayCall(await coreContract.getAddress(), admin, data);
  } else {
    await coreContract.connect(admin).renounceOwnership();
  }
};

export const setBlockracersFeeAccount = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  admin: HardhatEthersSigner,
  newAccount: AddressLike,
  relay: boolean = false,
) => {
  if (relay) {
    const { data } = await coreContract
      .connect(admin)
      .setBlockRacersFeeAccount.populateTransaction(newAccount);

    await sponsorRelayCall(await coreContract.getAddress(), admin, data);
  } else {
    await coreContract.connect(admin).setBlockRacersFeeAccount(newAccount);
  }
};

export const setNewGameSettings = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  admin: HardhatEthersSigner,
  newSettings: BlockRacers.GameSettingsDataStruct,
  relay: boolean = false,
) => {
  if (relay) {
    const { data } = await coreContract
      .connect(admin)
      .setNewGameSettings.populateTransaction(newSettings);

    await sponsorRelayCall(await coreContract.getAddress(), admin, data);
  } else {
    await coreContract.connect(admin).setNewGameSettings(newSettings);
  }
};

export const transferOwnership = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  admin: HardhatEthersSigner,
  newAccount: AddressLike,
  relay: boolean = false,
) => {
  if (relay) {
    const { data } = await coreContract
      .connect(admin)
      .transferOwnership.populateTransaction(newAccount);

    await sponsorRelayCall(await coreContract.getAddress(), admin, data);
  } else {
    await coreContract.connect(admin).transferOwnership(newAccount);
  }
};

// Write
export const mintCar = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  carType: CarTypeOption,
  minter: HardhatEthersSigner,
  relay: boolean = false,
) => {
  if (relay) {
    const { data } = await coreContract
      .connect(minter)
      .mintCar.populateTransaction(carType);

    await sponsorRelayCall(await coreContract.getAddress(), minter, data);
  } else {
    await coreContract.connect(minter).mintCar(carType);
  }
};

export const mintCarWithEvent = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  tokenContract: BlockRacersToken & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  carType: CarTypeOption,
  minter: HardhatEthersSigner,
  eventName: string,
  eventArgs?: unknown[],
) => {
  const { carCost } = await getCarOption(coreContract, carType);

  await approvalToken(
    tokenContract,
    minter,
    await coreContract.getAddress(),
    carCost,
  );
  if (eventArgs) {
    await expect(
      await coreContract.connect(minter).mintCar(carType),
      `${eventName} Failed`,
    )
      .to.emit(coreContract, eventName)
      .withArgs(...eventArgs);
  } else {
    await expect(
      await coreContract.connect(minter).mintCar(carType),
      `${eventName} Failed`,
    ).to.emit(coreContract, eventName);
  }
};

export const mintCarWithErrors = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  carType: CarTypeOption,
  minter: HardhatEthersSigner,
  errorName: string,
  errorArgs: unknown[],
) => {
  await expect(
    coreContract.connect(minter).mintCar(carType),
    `${errorName} Failed`,
  )
    .to.be.revertedWithCustomError(coreContract, errorName)
    .withArgs(...errorArgs);
};

export const upgradeEngine = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  ownerAccount: HardhatEthersSigner,
  carId: BigNumberish,
  expectedLevel?: BigNumberish,
  relay: boolean = false,
) => {
  if (relay) {
    const { data } = await coreContract
      .connect(ownerAccount)
      .upgradeEngine.populateTransaction(carId);

    await sponsorRelayCall(await coreContract.getAddress(), ownerAccount, data);
  } else {
    await coreContract.connect(ownerAccount).upgradeEngine(carId);
  }

  if (expectedLevel) {
    const stats = await getCarStats(coreContract, carId);

    assert(
      stats.engineLevel == expectedLevel,
      `Engine level was not increased incorrect. Actual: ${stats.engineLevel} | Expected: ${expectedLevel}`,
    );
  }
};

export const upgradeEngineWithEvent = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  ownerAccount: HardhatEthersSigner,
  carId: BigNumberish,
  eventName: string,
  eventArgs?: unknown[],
  expectedLevel?: BigNumberish,
) => {
  if (eventArgs) {
    await expect(
      await coreContract.connect(ownerAccount).upgradeEngine(carId),
      `${eventName} Failed`,
    )
      .to.emit(coreContract, eventName)
      .withArgs(...eventArgs);
  } else {
    await expect(
      await coreContract.connect(ownerAccount).upgradeEngine(carId),
      `${eventName} Failed`,
    ).to.emit(coreContract, eventName);
  }

  if (expectedLevel) {
    const stats = await getCarStats(coreContract, carId);

    assert(
      stats.engineLevel == expectedLevel,
      `Engine level was not increased incorrect. Actual: ${stats.engineLevel} | Expected: ${expectedLevel}`,
    );
  }
};

export const upgradeEngineWithErrors = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  ownerAccount: HardhatEthersSigner,
  carId: BigNumberish,
  errorName: string,
  errorArgs: unknown[],
) => {
  await expect(
    coreContract.connect(ownerAccount).upgradeEngine(carId),
    `${errorName} Failed`,
  )
    .to.be.revertedWithCustomError(coreContract, errorName)
    .withArgs(...errorArgs);
};

export const upgradeHandling = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  ownerAccount: HardhatEthersSigner,
  carId: BigNumberish,
  expectedLevel?: BigNumberish,
  relay: boolean = false,
) => {
  if (relay) {
    const { data } = await coreContract
      .connect(ownerAccount)
      .upgradeHandling.populateTransaction(carId);

    await sponsorRelayCall(await coreContract.getAddress(), ownerAccount, data);
  } else {
    await coreContract.connect(ownerAccount).upgradeHandling(carId);
  }

  if (expectedLevel) {
    const stats = await getCarStats(coreContract, carId);

    assert(
      stats.handlingLevel == expectedLevel,
      `Handling level was not increased incorrect. Actual: ${stats.handlingLevel} | Expected: ${expectedLevel}`,
    );
  }
};

export const upgradeHandlingWithEvent = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  ownerAccount: HardhatEthersSigner,
  carId: BigNumberish,
  eventName: string,
  eventArgs?: unknown[],
  expectedLevel?: BigNumberish,
) => {
  if (eventArgs) {
    await expect(
      await coreContract.connect(ownerAccount).upgradeHandling(carId),
      `${eventName} Failed`,
    )
      .to.emit(coreContract, eventName)
      .withArgs(...eventArgs);
  } else {
    await expect(
      await coreContract.connect(ownerAccount).upgradeHandling(carId),
      `${eventName} Failed`,
    ).to.emit(coreContract, eventName);
  }

  if (expectedLevel) {
    const stats = await getCarStats(coreContract, carId);

    assert(
      stats.handlingLevel == expectedLevel,
      `Handling level was not increased incorrect. Actual: ${stats.handlingLevel} | Expected: ${expectedLevel}`,
    );
  }
};

export const upgradeHandlingWithErrors = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  ownerAccount: HardhatEthersSigner,
  carId: BigNumberish,
  errorName: string,
  errorArgs: unknown[],
) => {
  await expect(
    coreContract.connect(ownerAccount).upgradeHandling(carId),
    `${errorName} Failed`,
  )
    .to.be.revertedWithCustomError(coreContract, errorName)
    .withArgs(...errorArgs);
};

export const upgradeNos = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  ownerAccount: HardhatEthersSigner,
  carId: BigNumberish,
  expectedLevel?: BigNumberish,
  relay: boolean = false,
) => {
  if (relay) {
    const { data } = await coreContract
      .connect(ownerAccount)
      .upgradeNos.populateTransaction(carId);

    await sponsorRelayCall(await coreContract.getAddress(), ownerAccount, data);
  } else {
    await coreContract.connect(ownerAccount).upgradeNos(carId);
  }

  if (expectedLevel) {
    const stats = await getCarStats(coreContract, carId);

    assert(
      stats.nosLevel == expectedLevel,
      `Nos level was not increased incorrect. Actual: ${stats.nosLevel} | Expected: ${expectedLevel}`,
    );
  }
};

export const upgradeNosWithErrors = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  ownerAccount: HardhatEthersSigner,
  carId: BigNumberish,
  errorName: string,
  errorArgs: unknown[],
) => {
  await expect(
    coreContract.connect(ownerAccount).upgradeNos(carId),
    `${errorName} Failed`,
  )
    .to.be.revertedWithCustomError(coreContract, errorName)
    .withArgs(...errorArgs);
};

export const upgradeNosWithEvent = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  ownerAccount: HardhatEthersSigner,
  carId: BigNumberish,
  eventName: string,
  eventArgs?: unknown[],
  expectedLevel?: BigNumberish,
) => {
  if (eventArgs) {
    await expect(
      await coreContract.connect(ownerAccount).upgradeNos(carId),
      `${eventName} Failed`,
    )
      .to.emit(coreContract, eventName)
      .withArgs(...eventArgs);
  } else {
    await expect(
      await coreContract.connect(ownerAccount).upgradeNos(carId),
      `${eventName} Failed`,
    ).to.emit(coreContract, eventName);
  }

  if (expectedLevel) {
    const stats = await getCarStats(coreContract, carId);

    assert(
      stats.nosLevel == expectedLevel,
      `Nos level was not increased incorrect. Actual: ${stats.nosLevel} | Expected: ${expectedLevel}`,
    );
  }
};

// Read
export const blockRacersFeeAccount = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  expectedAddress: AddressLike,
) => {
  const feeAccountFetched = await coreContract.blockRacersFeeAccount();

  assert(
    expectedAddress == feeAccountFetched,
    `Fee account incorrect. Actual: ${feeAccountFetched} | Expected: ${expectedAddress}`,
  );
};

export const numberOfCarsMinted = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  expectedValue?: BigNumberish,
) => {
  const minted = await coreContract.getNumberOfCarsMinted();

  if (expectedValue) {
    assert(
      minted == expectedValue,
      `Number minted incorrect. Actual: ${minted} | Expected: ${expectedValue}`,
    );
  }

  return minted;
};

export const checkOwner = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  expectedOwner: AddressLike,
) => {
  const owner = await coreContract.owner();
  assert(
    owner == expectedOwner,
    `Owner incorrect. Actual: ${owner} | Expected: ${expectedOwner}`,
  );
};

export const checkToken = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  expectedToken: AddressLike,
) => {
  const token = await coreContract.token();
  assert(
    token == expectedToken,
    `Token incorrect. Actual: ${token} | Expected: ${expectedToken}`,
  );
};

export const checkAssets = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  expectedAssets: AddressLike,
) => {
  const assets = await coreContract.assets();
  assert(
    assets == expectedAssets,
    `Assets incorrect. Actual: ${assets} | Expected: ${expectedAssets}`,
  );
};

export const getCarOwner = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  owner: AddressLike,
  id: BigNumberish,
  expectedValue?: boolean,
) => {
  const isOwner = await coreContract.getCarOwner(id, owner);

  if (expectedValue) {
    assert(
      isOwner == expectedValue,
      `Ownership incorrect. Actual: ${isOwner} | Expected: ${expectedValue}`,
    );
  }

  return isOwner;
};

export const getCarOption = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  carType: CarTypeOption,
  expectedCost?: BigNumberish,
  expectedUri?: string,
) => {
  const option = await coreContract.getCarOption(carType);

  if (expectedCost) {
    assert(
      option[0] == expectedCost,
      `Option cost incorrect. Actual: ${option[0]} | Expected: ${expectedCost}`,
    );
  }
  if (expectedUri) {
    assert(
      option[1] == expectedUri,
      `Option uri incorrect. Actual: ${option[1]} | Expected: ${expectedUri}`,
    );
  }

  return {
    carCost: option[0],
    carUri: option[1],
  };
};

export const getCarStats = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  carId: BigNumberish,
  expectedStats?: BlockRacers.CarStatsStruct,
) => {
  const stats = await coreContract.getCarStats(carId);

  if (expectedStats) {
    assert(
      stats.carTypeId == expectedStats.carTypeId,
      `carId incorrect. Actual: ${stats.carTypeId} | Expected: ${expectedStats.carTypeId}`,
    );
    assert(
      stats.carOptionData.carCost == expectedStats.carOptionData.carCost,
      `carCost incorrect. Actual: ${stats.carOptionData.carCost} | Expected: ${expectedStats.carOptionData.carCost}`,
    );
    assert(
      stats.carOptionData.carUri == expectedStats.carOptionData.carUri,
      `carUri  incorrect. Actual: ${stats.carOptionData.carUri} | Expected: ${expectedStats.carOptionData.carUri}`,
    );
    assert(
      stats.engineLevel == expectedStats.engineLevel,
      `engineLevel incorrect. Actual: ${stats.engineLevel} | Expected: ${expectedStats.engineLevel}`,
    );
    assert(
      stats.handlingLevel == expectedStats.handlingLevel,
      `handlingLevel incorrect. Actual: ${stats.handlingLevel} | Expected: ${expectedStats.handlingLevel}`,
    );
    assert(
      stats.nosLevel == expectedStats.nosLevel,
      `nosLevel incorrect. Actual: ${stats.nosLevel} | Expected: ${expectedStats.nosLevel}`,
    );
  }

  return stats;
};

export const getUpgradeData = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  expected?: BlockRacers.GameSettingsDataStruct,
) => {
  const data = await coreContract.getUpgradeData();

  if (expected) {
    assert(
      data.engineMaxLevel == expected.engineMaxLevel,
      `engineMaxLevel incorrect. Actual: ${data.engineMaxLevel} | Expected: ${expected.engineMaxLevel}`,
    );
    assert(
      data.enginePrice == expected.enginePrice,
      `enginePrice incorrect. Actual: ${data.enginePrice} | Expected: ${expected.enginePrice}`,
    );
    assert(
      data.handlingMaxLevel == expected.handlingMaxLevel,
      `handlingMaxLevel incorrect. Actual: ${data.handlingMaxLevel} | Expected: ${expected.handlingMaxLevel}`,
    );
    assert(
      data.handlingPrice == expected.handlingPrice,
      `handlingPrice incorrect. Actual: ${data.handlingPrice} | Expected: ${expected.handlingPrice}`,
    );
    assert(
      data.nosMaxLevel == expected.nosMaxLevel,
      `nosMaxLevel incorrect. Actual: ${data.nosMaxLevel} | Expected: ${expected.nosMaxLevel}`,
    );
    assert(
      data.nosPrice == expected.nosPrice,
      `nosPrice incorrect. Actual: ${data.nosPrice} | Expected: ${expected.nosPrice}`,
    );
    assert(
      data.carOptions.length == expected.carOptions.length,
      `carOptions incorrect. Actual: ${data.carOptions.length} | Expected: ${expected.carOptions.length}`,
    );

    data.carOptions.map(
      (item: BlockRacers.CarOptionStructOutput, index: number) => {
        assert(
          item.carCost == expected.carOptions[index].carCost,
          `Car option cost @ ${index} incorrect. Actual: ${item.carCost} | Expected: ${expected.carOptions[index].carCost}`,
        );
        assert(
          item.carUri == expected.carOptions[index].carUri,
          `Car option uri @ ${index} incorrect. Actual: ${item.carUri} | Expected: ${expected.carOptions[index].carUri}`,
        );
      },
    );
  }
  return data;
};

export const getItemData = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  gameItem: GameItem,
  expected?: {
    price: BigNumberish;
    maxLevel: BigNumberish;
  },
) => {
  const data = await coreContract.getItemData(gameItem);

  if (expected) {
    assert(
      data.price == expected.price,
      `price incorrect. Actual: ${data.price} | Expected: ${expected.price}`,
    );
    assert(
      data.maxLevel == expected.maxLevel,
      `maxLevel incorrect. Actual: ${data.maxLevel} | Expected: ${expected.maxLevel}`,
    );
  }
  return data;
};

export const getItemDataWithError = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  gameItem: GameItem,
  errorName: string,
  errorArgs: unknown[],
) => {
  await expect(coreContract.getItemData(gameItem), `${errorName} Failed`)
    .to.be.revertedWithCustomError(coreContract, errorName)
    .withArgs(...errorArgs);
};

export const getOwner = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  expected?: AddressLike,
) => {
  const owner = await coreContract.owner();

  if (expected) {
    assert(
      owner == expected,
      `Expected state invalid. Owner: ${owner} | Expected: ${expected}`,
    );
  }

  return owner;
};

export const getBlockracersFeeAccount = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  expected?: AddressLike,
) => {
  const feeAccount = await coreContract.blockRacersFeeAccount();

  if (expected) {
    assert(
      feeAccount == expected,
      `Expected fee account incorrect. Fee account: ${feeAccount} | Expected: ${expected}`,
    );
  }

  return feeAccount;
};
