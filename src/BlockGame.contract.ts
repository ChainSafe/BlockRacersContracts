import { ethers } from "hardhat";
import { getAccounts, sponsorRelayCall } from "./generalFunctions";
import {
  AddressLike,
  BigNumberish,
  ContractTransactionResponse,
  parseEther,
} from "ethers";
import { defaultGameSettings, generalSettings } from "../scripts/defaultSettings";
import { approvalToken, deployTokenFixture } from "./BlockGameToken.contract";
import { deployAssetsFixture } from "./BlockGameAssets.contract";
import { BlockGame, BlockGameToken, UIHelper } from "../typechain-types";
import { assert, expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

export enum ObjectTypeOption {
  FIRST = 0,
  SECOND = 1,
  THIRD = 2,
}

export enum GameItem {
  OBJECT = 0,
  ITEM1 = 1,
  ITEM2 = 2,
  ITEM3 = 3,
}

export const modifiedGameSettings = [
  [55, 45, 30], // object levels/prices
  [15, 15, 15, 15, 15, 15, 15, 15, 15, 15], // item 1
  [12, 12, 12, 12, 12, 12, 12, 12, 12, 12], // item 2
  [40, 40, 40, 40, 40, 40], // item 3
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

    const blockGame = await ethers.getContractFactory("BlockGame", admin);
    const blockGameContract = await blockGame.deploy(
      trustedForwarder,
      admin,
      erc20TokenAddress,
      feeAccount,
      generalSettings.NFT.baseUri,
      defaultGameSettings,
    );

    await blockGameContract.waitForDeployment();

    const blockGameAssetsContract = await ethers.getContractAt("BlockGameAssets", await blockGameContract.ASSETS());

    const uiHelper = await ethers.getContractFactory("UIHelper", admin);
    const uiHelperContract = await uiHelper.deploy(blockGameContract.getAddress());

    await uiHelperContract.waitForDeployment();

    return { blockGameAssetsContract, blockGameContract, uiHelperContract };
  };
};

// Admin
export const renounceOwnership = async (
  coreContract: BlockGame & {
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

export const setFeeAccount = async (
  coreContract: BlockGame & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  admin: HardhatEthersSigner,
  newAccount: AddressLike,
  relay: boolean = false,
) => {
  if (relay) {
    const { data } = await coreContract
      .connect(admin)
      .setFeeAccount.populateTransaction(newAccount);

    await sponsorRelayCall(await coreContract.getAddress(), admin, data);
  } else {
    await coreContract.connect(admin).setFeeAccount(newAccount);
  }
};

export const setPrices = async (
  coreContract: BlockGame & {
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
  coreContract: BlockGame & {
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
export const mintObject = async (
  coreContract: BlockGame & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  objectType: ObjectTypeOption,
  minter: HardhatEthersSigner,
  relay: boolean = false,
) => {
  if (relay) {
    const { data } = await coreContract
      .connect(minter)
      .mintObject.populateTransaction(objectType);

    await sponsorRelayCall(await coreContract.getAddress(), minter, data);
  } else {
    await coreContract.connect(minter).mintObject(objectType);
  }
};

export const mintObjectWithEvent = async (
  coreContract: BlockGame & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  tokenContract: BlockGameToken & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  objectType: ObjectTypeOption,
  minter: HardhatEthersSigner,
  eventName: string,
  eventArgs?: unknown[],
) => {
  const { objectCost } = await getObjectOption(coreContract, objectType);

  await approvalToken(
    tokenContract,
    minter,
    await coreContract.getAddress(),
    objectCost,
  );
  if (eventArgs) {
    await expect(
      await coreContract.connect(minter).mintObject(objectType),
      `${eventName} Failed`,
    )
      .to.emit(coreContract, eventName)
      .withArgs(...eventArgs);
  } else {
    await expect(
      await coreContract.connect(minter).mintObject(objectType),
      `${eventName} Failed`,
    ).to.emit(coreContract, eventName);
  }
};

export const mintObjectWithErrors = async (
  coreContract: BlockGame & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  objectType: ObjectTypeOption,
  minter: HardhatEthersSigner,
  errorName: string,
  errorArgs: unknown[],
) => {
  await expect(
    coreContract.connect(minter).mintObject(objectType),
    `${errorName} Failed`,
  )
    .to.be.revertedWithCustomError(coreContract, errorName)
    .withArgs(...errorArgs);
};

export const upgradeItem1 = async (
  coreContract: BlockGame & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  ownerAccount: HardhatEthersSigner,
  objectId: BigNumberish,
  expectedLevel?: BigNumberish,
  relay: boolean = false,
) => {
  if (relay) {
    const { data } = await coreContract
      .connect(ownerAccount)
      .upgrade.populateTransaction(objectId, GameItem.ITEM1);

    await sponsorRelayCall(await coreContract.getAddress(), ownerAccount, data);
  } else {
    await coreContract.connect(ownerAccount).upgrade(objectId, GameItem.ITEM1);
  }

  if (expectedLevel) {
    const stats = await getObjectStats(coreContract, objectId);

    assert(
      stats[GameItem.ITEM1] == expectedLevel,
      `Item1 level was not increased incorrect. Actual: ${stats[GameItem.ITEM1]} | Expected: ${expectedLevel}`,
    );
  }
};

export const upgradeItem1WithEvent = async (
  coreContract: BlockGame & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  ownerAccount: HardhatEthersSigner,
  objectId: BigNumberish,
  eventName: string,
  eventArgs?: unknown[],
  expectedLevel?: BigNumberish,
) => {
  if (eventArgs) {
    await expect(
      await coreContract.connect(ownerAccount).upgrade(objectId, GameItem.ITEM1),
      `${eventName} Failed`,
    )
      .to.emit(coreContract, eventName)
      .withArgs(...eventArgs);
  } else {
    await expect(
      await coreContract.connect(ownerAccount).upgrade(objectId, GameItem.ITEM1),
      `${eventName} Failed`,
    ).to.emit(coreContract, eventName);
  }

  if (expectedLevel) {
    const stats = await getObjectStats(coreContract, objectId);

    assert(
      stats[GameItem.ITEM1] == expectedLevel,
      `Item1 level was not increased incorrect. Actual: ${stats[GameItem.ITEM1]} | Expected: ${expectedLevel}`,
    );
  }
};

export const upgradeItem1WithErrors = async (
  coreContract: BlockGame & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  ownerAccount: HardhatEthersSigner,
  objectId: BigNumberish,
  errorName: string,
  errorArgs: unknown[],
) => {
  await expect(
    coreContract.connect(ownerAccount).upgrade(objectId, GameItem.ITEM1),
    `${errorName} Failed`,
  )
    .to.be.revertedWithCustomError(coreContract, errorName)
    .withArgs(...errorArgs);
};

export const upgradeWithErrors = async (
  coreContract: BlockGame & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  ownerAccount: HardhatEthersSigner,
  objectId: BigNumberish,
  item: GameItem,
  errorName: string,
  errorArgs: unknown[],
) => {
  await expect(
    coreContract.connect(ownerAccount).upgrade(objectId, item),
    `${errorName} Failed`,
  )
    .to.be.revertedWithCustomError(coreContract, errorName)
    .withArgs(...errorArgs);
};

export const upgradeItem2 = async (
  coreContract: BlockGame & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  ownerAccount: HardhatEthersSigner,
  objectId: BigNumberish,
  expectedLevel?: BigNumberish,
  relay: boolean = false,
) => {
  if (relay) {
    const { data } = await coreContract
      .connect(ownerAccount)
      .upgrade.populateTransaction(objectId, GameItem.ITEM2);

    await sponsorRelayCall(await coreContract.getAddress(), ownerAccount, data);
  } else {
    await coreContract.connect(ownerAccount).upgrade(objectId, GameItem.ITEM2);
  }

  if (expectedLevel) {
    const stats = await getObjectStats(coreContract, objectId);

    assert(
      stats[GameItem.ITEM2] == expectedLevel,
      `Item2 level was not increased incorrect. Actual: ${stats[GameItem.ITEM2]} | Expected: ${expectedLevel}`,
    );
  }
};

export const upgradeItem2WithEvent = async (
  coreContract: BlockGame & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  ownerAccount: HardhatEthersSigner,
  objectId: BigNumberish,
  eventName: string,
  eventArgs?: unknown[],
  expectedLevel?: BigNumberish,
) => {
  if (eventArgs) {
    await expect(
      await coreContract.connect(ownerAccount).upgrade(objectId, GameItem.ITEM2),
      `${eventName} Failed`,
    )
      .to.emit(coreContract, eventName)
      .withArgs(...eventArgs);
  } else {
    await expect(
      await coreContract.connect(ownerAccount).upgrade(objectId, GameItem.ITEM2),
      `${eventName} Failed`,
    ).to.emit(coreContract, eventName);
  }

  if (expectedLevel) {
    const stats = await getObjectStats(coreContract, objectId);

    assert(
      stats[GameItem.ITEM2] == expectedLevel,
      `Item2 level was not increased incorrect. Actual: ${stats[GameItem.ITEM2]} | Expected: ${expectedLevel}`,
    );
  }
};

export const upgradeItem2WithErrors = async (
  coreContract: BlockGame & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  ownerAccount: HardhatEthersSigner,
  objectId: BigNumberish,
  errorName: string,
  errorArgs: unknown[],
) => {
  await expect(
    coreContract.connect(ownerAccount).upgrade(objectId, GameItem.ITEM2),
    `${errorName} Failed`,
  )
    .to.be.revertedWithCustomError(coreContract, errorName)
    .withArgs(...errorArgs);
};

export const upgradeItem3 = async (
  coreContract: BlockGame & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  ownerAccount: HardhatEthersSigner,
  objectId: BigNumberish,
  expectedLevel?: BigNumberish,
  relay: boolean = false,
) => {
  if (relay) {
    const { data } = await coreContract
      .connect(ownerAccount)
      .upgrade.populateTransaction(objectId, GameItem.ITEM3);

    await sponsorRelayCall(await coreContract.getAddress(), ownerAccount, data);
  } else {
    await coreContract.connect(ownerAccount).upgrade(objectId, GameItem.ITEM3);
  }

  if (expectedLevel) {
    const stats = await getObjectStats(coreContract, objectId);

    assert(
      stats[GameItem.ITEM3] == expectedLevel,
      `Item3 level was not increased incorrect. Actual: ${stats[GameItem.ITEM3]} | Expected: ${expectedLevel}`,
    );
  }
};

export const upgradeItem3WithErrors = async (
  coreContract: BlockGame & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  ownerAccount: HardhatEthersSigner,
  objectId: BigNumberish,
  errorName: string,
  errorArgs: unknown[],
) => {
  await expect(
    coreContract.connect(ownerAccount).upgrade(objectId, GameItem.ITEM3),
    `${errorName} Failed`,
  )
    .to.be.revertedWithCustomError(coreContract, errorName)
    .withArgs(...errorArgs);
};

export const upgradeItem3WithEvent = async (
  coreContract: BlockGame & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  ownerAccount: HardhatEthersSigner,
  objectId: BigNumberish,
  eventName: string,
  eventArgs?: unknown[],
  expectedLevel?: BigNumberish,
) => {
  if (eventArgs) {
    await expect(
      await coreContract.connect(ownerAccount).upgrade(objectId, GameItem.ITEM3),
      `${eventName} Failed`,
    )
      .to.emit(coreContract, eventName)
      .withArgs(...eventArgs);
  } else {
    await expect(
      await coreContract.connect(ownerAccount).upgrade(objectId, GameItem.ITEM3),
      `${eventName} Failed`,
    ).to.emit(coreContract, eventName);
  }

  if (expectedLevel) {
    const stats = await getObjectStats(coreContract, objectId);

    assert(
      stats[GameItem.ITEM3] == expectedLevel,
      `Item3 level was not increased incorrect. Actual: ${stats[GameItem.ITEM3]} | Expected: ${expectedLevel}`,
    );
  }
};

export const numberOfObjectsMinted = async (
  coreContract: BlockGame & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  expectedValue?: BigNumberish,
) => {
  const minted = await coreContract.getNumberOfObjectsMinted();

  if (expectedValue) {
    assert(
      minted == expectedValue,
      `Number minted incorrect. Actual: ${minted} | Expected: ${expectedValue}`,
    );
  }

  return minted;
};

export const checkOwner = async (
  coreContract: BlockGame & {
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
  coreContract: BlockGame & {
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
  coreContract: BlockGame & {
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

export const isObjectOwner = async (
  coreContract: BlockGame & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  owner: AddressLike,
  id: BigNumberish,
  expectedValue?: boolean,
) => {
  const isOwner = await coreContract.isObjectOwner(id, owner);

  if (expectedValue) {
    assert(
      isOwner == expectedValue,
      `Ownership incorrect. Actual: ${isOwner} | Expected: ${expectedValue}`,
    );
  }

  return isOwner;
};

export const getObjectOption = async (
  coreContract: BlockGame & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  objectType: ObjectTypeOption,
  expectedCost?: BigNumberish,
  expectedUri?: string,
) => {
  const option = await coreContract.getItemData(GameItem.OBJECT);

  if (expectedCost) {
    assert(
      option[objectType] == expectedCost,
      `Option cost incorrect. Actual: ${option[objectType]} | Expected: ${expectedCost}`,
    );
  }

  return {
    objectCost: option[objectType],
  };
};

export const getObjectStats = async (
  coreContract: BlockGame & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  objectId: BigNumberish,
  expectedStats?: BigNumberish[],
) => {
  const stats = await coreContract.getObjectStats(objectId);

  if (expectedStats) {
    assert.deepEqual(stats, expectedStats.map(el => BigInt(el)));
  }

  return stats;
};

export const getUpgradeData = async (
  coreContract: BlockGame & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  expected?: BlockGame.GameSettingsDataStruct,
) => {
  const data = await coreContract.getItemsData();

  if (expected) {
    assert.deepEqual(data, expected.map(el => el.map(price => BigInt(price))));
  }
  return data;
};

export const getItemData = async (
  coreContract: BlockGame & {
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
  coreContract: BlockGame & {
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
  coreContract: BlockGame & {
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

export const getFeeAccount = async (
  coreContract: BlockGame & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  expected?: AddressLike,
) => {
  const feeAccount = await coreContract.feeAccount();

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

export const getUserObjectsByTypeWithStats = async (
  coreContract: UIHelper & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  owner: AddressLike,
  expectedTypes: BigNumberish[][],
) => {
  const types = await coreContract.getUserObjectsByTypeWithStats(owner);
  assert.deepEqual(types, expectedTypes);
};
