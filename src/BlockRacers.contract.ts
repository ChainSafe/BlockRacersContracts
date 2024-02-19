import { ethers } from "hardhat";
import { getAccounts, sponsorRelayCall } from "./generalFunctions";
import {
  AddressLike,
  BigNumberish,
  ContractTransactionResponse,
  parseEther,
} from "ethers";
import { defaultGameSettings, generalSettings } from "../scripts/defaultSettings";
import { approvalToken, deployTokenFixture } from "./BlockRacersToken.contract";
import { deployAssetsFixture } from "./BlockRacersAssets.contract";
import { BlockRacers, BlockRacersToken, UIHelper } from "../typechain-types";
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

export const modifiedGameSettings = [
  [55, 45, 30], // car levels/prices
  [15, 15, 15, 15, 15, 15, 15, 15, 15, 15], // engine
  [12, 12, 12, 12, 12, 12, 12, 12, 12, 12], // handling
  [40, 40, 40, 40, 40, 40], // nos
];

export const modifiedGameSettingsUnits = modifiedGameSettings
  .map(el => el.map(price => parseEther(price.toString())));

export const deployCoreFixture = (
  erc20TokenAddress?: AddressLike,
) => {
  return async function coreFixture() {
    const { admin, trustedForwarder, feeAccount } = await getAccounts();

    if (!erc20TokenAddress) {
      erc20TokenAddress = (await deployTokenFixture()()).getAddress();
    }

    const blockRacers = await ethers.getContractFactory("BlockRacers", admin);
    const blockRacersContract = await blockRacers.deploy(
      trustedForwarder,
      admin,
      erc20TokenAddress,
      feeAccount,
      generalSettings.NFT.baseUri,
      defaultGameSettings,
    );

    await blockRacersContract.waitForDeployment();

    const blockRacersAssetsContract = await ethers.getContractAt("BlockRacersAssets", await blockRacersContract.ASSETS());

    const uiHelper = await ethers.getContractFactory("UIHelper", admin);
    const uiHelperContract = await uiHelper.deploy(blockRacersContract.getAddress());

    await uiHelperContract.waitForDeployment();

    return { blockRacersAssetsContract, blockRacersContract, uiHelperContract };
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

export const setPrices = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  admin: HardhatEthersSigner,
  newPrices: BigNumberish[][],
  relay: boolean = false,
) => {
  if (relay) {
    const { data } = await coreContract
      .connect(admin)
      .setPrices.populateTransaction(newPrices);

    await sponsorRelayCall(await coreContract.getAddress(), admin, data);
  } else {
    await coreContract.connect(admin).setPrices(newPrices);
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
      .upgrade.populateTransaction(carId, GameItem.ENGINE);

    await sponsorRelayCall(await coreContract.getAddress(), ownerAccount, data);
  } else {
    await coreContract.connect(ownerAccount).upgrade(carId, GameItem.ENGINE);
  }

  if (expectedLevel) {
    const stats = await getCarStats(coreContract, carId);

    assert(
      stats[GameItem.ENGINE] == expectedLevel,
      `Engine level was not increased incorrect. Actual: ${stats[GameItem.ENGINE]} | Expected: ${expectedLevel}`,
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
      await coreContract.connect(ownerAccount).upgrade(carId, GameItem.ENGINE),
      `${eventName} Failed`,
    )
      .to.emit(coreContract, eventName)
      .withArgs(...eventArgs);
  } else {
    await expect(
      await coreContract.connect(ownerAccount).upgrade(carId, GameItem.ENGINE),
      `${eventName} Failed`,
    ).to.emit(coreContract, eventName);
  }

  if (expectedLevel) {
    const stats = await getCarStats(coreContract, carId);

    assert(
      stats[GameItem.ENGINE] == expectedLevel,
      `Engine level was not increased incorrect. Actual: ${stats[GameItem.ENGINE]} | Expected: ${expectedLevel}`,
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
    coreContract.connect(ownerAccount).upgrade(carId, GameItem.ENGINE),
    `${errorName} Failed`,
  )
    .to.be.revertedWithCustomError(coreContract, errorName)
    .withArgs(...errorArgs);
};

export const upgradeWithErrors = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  ownerAccount: HardhatEthersSigner,
  carId: BigNumberish,
  item: GameItem,
  errorName: string,
  errorArgs: unknown[],
) => {
  await expect(
    coreContract.connect(ownerAccount).upgrade(carId, item),
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
      .upgrade.populateTransaction(carId, GameItem.HANDLING);

    await sponsorRelayCall(await coreContract.getAddress(), ownerAccount, data);
  } else {
    await coreContract.connect(ownerAccount).upgrade(carId, GameItem.HANDLING);
  }

  if (expectedLevel) {
    const stats = await getCarStats(coreContract, carId);

    assert(
      stats[GameItem.HANDLING] == expectedLevel,
      `Handling level was not increased incorrect. Actual: ${stats[GameItem.HANDLING]} | Expected: ${expectedLevel}`,
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
      await coreContract.connect(ownerAccount).upgrade(carId, GameItem.HANDLING),
      `${eventName} Failed`,
    )
      .to.emit(coreContract, eventName)
      .withArgs(...eventArgs);
  } else {
    await expect(
      await coreContract.connect(ownerAccount).upgrade(carId, GameItem.HANDLING),
      `${eventName} Failed`,
    ).to.emit(coreContract, eventName);
  }

  if (expectedLevel) {
    const stats = await getCarStats(coreContract, carId);

    assert(
      stats[GameItem.HANDLING] == expectedLevel,
      `Handling level was not increased incorrect. Actual: ${stats[GameItem.HANDLING]} | Expected: ${expectedLevel}`,
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
    coreContract.connect(ownerAccount).upgrade(carId, GameItem.HANDLING),
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
      .upgrade.populateTransaction(carId, GameItem.NOS);

    await sponsorRelayCall(await coreContract.getAddress(), ownerAccount, data);
  } else {
    await coreContract.connect(ownerAccount).upgrade(carId, GameItem.NOS);
  }

  if (expectedLevel) {
    const stats = await getCarStats(coreContract, carId);

    assert(
      stats[GameItem.NOS] == expectedLevel,
      `Nos level was not increased incorrect. Actual: ${stats[GameItem.NOS]} | Expected: ${expectedLevel}`,
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
    coreContract.connect(ownerAccount).upgrade(carId, GameItem.NOS),
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
      await coreContract.connect(ownerAccount).upgrade(carId, GameItem.NOS),
      `${eventName} Failed`,
    )
      .to.emit(coreContract, eventName)
      .withArgs(...eventArgs);
  } else {
    await expect(
      await coreContract.connect(ownerAccount).upgrade(carId, GameItem.NOS),
      `${eventName} Failed`,
    ).to.emit(coreContract, eventName);
  }

  if (expectedLevel) {
    const stats = await getCarStats(coreContract, carId);

    assert(
      stats[GameItem.NOS] == expectedLevel,
      `Nos level was not increased incorrect. Actual: ${stats[GameItem.NOS]} | Expected: ${expectedLevel}`,
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
  const token = await coreContract.TOKEN();
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
  const assets = await coreContract.ASSETS();
  assert(
    assets == expectedAssets,
    `Assets incorrect. Actual: ${assets} | Expected: ${expectedAssets}`,
  );
};

export const isCarOwner = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  owner: AddressLike,
  id: BigNumberish,
  expectedValue?: boolean,
) => {
  const isOwner = await coreContract.isCarOwner(id, owner);

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
  const option = await coreContract.getItemData(GameItem.CAR);

  if (expectedCost) {
    assert(
      option[carType] == expectedCost,
      `Option cost incorrect. Actual: ${option[carType]} | Expected: ${expectedCost}`,
    );
  }

  return {
    carCost: option[carType],
  };
};

export const getCarStats = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  carId: BigNumberish,
  expectedStats?: BigNumberish[],
) => {
  const stats = await coreContract.getCarStats(carId);

  if (expectedStats) {
    assert.deepEqual(stats, expectedStats.map(el => BigInt(el)));
  }

  return stats;
};

export const getUpgradeData = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  expected?: BlockRacers.GameSettingsDataStruct,
) => {
  const data = await coreContract.getItemsData();

  if (expected) {
    assert.deepEqual(data, expected.map(el => el.map(price => BigInt(price))));
  }
  return data;
};

export const getItemData = async (
  coreContract: BlockRacers & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  gameItem: GameItem,
  expected?: BigNumberish[],
) => {
  const data = await coreContract.getItemData(gameItem);

  if (expected) {
    assert.deepEqual(data, expected.map(el => BigInt(el)));
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

export const getUserMintedTypes = async (
  coreContract: UIHelper & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  owner: AddressLike,
  expectedTypes: bool[],
) => {
  const types = await coreContract.getUserMintedTypes(owner);
  assert.deepEqual(types, expectedTypes);
};
