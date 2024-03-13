import { setBalance } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { getAccounts, sponsorRelayCall } from "./generalFunctions";
import { generalSettings } from "../scripts/defaultSettings";
import { assert, expect } from "chai";
import {
  AddressLike,
  BigNumberish,
  ContractTransactionResponse,
  ZeroHash,
} from "ethers";
import { BlockGameLoot } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

export const ADMIN_ROLE = ethers.zeroPadBytes(ethers.hexlify(ethers.toUtf8Bytes("admin")), 32);

export const deployLootFixture = async () => {
  const { admin, trustedForwarder } = await getAccounts();

  const blockGameLoot = await ethers.getContractFactory(
    "BlockGameLoot",
    admin,
  );

  const lootContract = await blockGameLoot.deploy(
    trustedForwarder,
    admin,
    generalSettings.NFT.baseUri,
  );
  await lootContract.waitForDeployment();

  return { lootContract };
};

export const burnNft = async (
  lootContract: BlockGameLoot & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  admin: HardhatEthersSigner,
  from: AddressLike,
  ids: BigNumberish[],
  values: BigNumberish[],
  relay: boolean = false,
) => {
  if (relay) {
    const { data } = await lootContract
      .burnBatch.populateTransaction(from, ids, values);

    await sponsorRelayCall(
      await lootContract.getAddress(),
      admin,
      data,
    );
  } else {
    await lootContract.connect(admin).burnBatch(from, ids, values);
  }
};

export const burnNftWithError = async (
  lootContract: BlockGameLoot & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  admin: HardhatEthersSigner,
  from: AddressLike,
  ids: BigNumberish[],
  values: BigNumberish[],
  errorName: string,
  errorArgs: unknown[],
) => {
  await expect(
    lootContract.connect(admin).burnBatch(from, ids, values),
    `${errorName} Failed`,
  )
    .to.be.revertedWithCustomError(lootContract, errorName)
    .withArgs(...errorArgs);
};

export const mintNft = async (
  lootContract: BlockGameLoot & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  admin: HardhatEthersSigner,
  receiver: AddressLike,
  ids: BigNumberish[],
  values: BigNumberish[],
  relay: boolean = false,
) => {
  if (relay) {
    const { data } = await lootContract
      .mintBatch.populateTransaction(receiver, ids, values, "0x");

    await sponsorRelayCall(
      await lootContract.getAddress(),
      admin,
      data,
    );
  } else {
    await lootContract.connect(admin).mintBatch(receiver, ids, values, "0x");
  }
};

export const mintNftWithError = async (
  lootContract: BlockGameLoot & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  admin: HardhatEthersSigner,
  receiver: AddressLike,
  ids: BigNumberish[],
  values: BigNumberish[],
  errorName: string,
  errorArgs: unknown[],
) => {
  await expect(
    lootContract.connect(admin).mintBatch(receiver, ids, values, "0x"),
    `${errorName} Failed`,
  )
    .to.be.revertedWithCustomError(lootContract, errorName)
    .withArgs(...errorArgs);
};

export const setUri = async (
  lootContract: BlockGameLoot & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  admin: HardhatEthersSigner,
  newUri: string,
  relay: boolean = false,
) => {
  if (relay) {
    const { data } = await lootContract
      .setBaseUri.populateTransaction(newUri);

    await sponsorRelayCall(
      await lootContract.getAddress(),
      admin,
      data,
    );
  } else {
    await lootContract.connect(admin).setBaseUri(newUri);
  }
};

export const setUriWithError = async (
  lootContract: BlockGameLoot & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  admin: HardhatEthersSigner,
  newUri: string,
  errorName: string,
  errorArgs: unknown[],
) => {
  await expect(
    lootContract.connect(admin).setBaseUri(newUri),
    `${errorName} Failed`,
  )
    .to.be.revertedWithCustomError(lootContract, errorName)
    .withArgs(...errorArgs);
};

// Read
export const balanceOfNft = async (
  lootContract: BlockGameLoot & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  account: AddressLike,
  nftId: BigNumberish,
  expectedBalance?: BigNumberish,
) => {
  const balanceOf = await lootContract.balanceOf(account, nftId);

  if (expectedBalance) {
    assert.equal(balanceOf, expectedBalance,
      `Balance incorrect: Actual:${balanceOf} | Expected: ${expectedBalance}`,
    );
  }

  return balanceOf;
};

export const totalSupply = async (
  lootContract: BlockGameLoot & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  nftId: BigNumberish,
  expectedSupply?: BigNumberish,
) => {
  const supply = await lootContract["totalSupply(uint256)"](nftId);

  if (expectedSupply) {
    assert.equal(supply, expectedSupply,
      `Supply incorrect: Actual:${supply} | Expected: ${expectedSupply}`,
    );
  }

  return supply;
};

export const getInventory = async (
  lootContract: BlockGameLoot & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  account: AddressLike,
  expectedInventory?: BigNumberish,
) => {
  const inventory = await lootContract.getInventory(account);

  if (expectedInventory) {
    assert.deepEqual(inventory, expectedInventory);
  }

  return inventory;
};

export const getUri = async (
  lootContract: BlockGameLoot & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  nftId: BigNumberish,
  expected?: string,
) => {
  const uri = await lootContract.uri(nftId);

  if (expected) {
    assert.equal(uri, expected,
      `Uri incorrect: Actual:${uri} | Expected: ${expected}`,
    );
  }

  return uri;
};

export const getUriWithError = async (
  lootContract: BlockGameLoot & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  nftId: BigNumberish,
  errorName: string,
  errorArgs: unknown[],
) => {
  await expect(
    lootContract.uri(nftId),
    `${errorName} Failed`,
  )
    .to.be.revertedWithCustomError(lootContract, errorName)
    .withArgs(...errorArgs);
};

export const safeTransferFrom = async (
  lootContract: BlockGameLoot & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  from: HardhatEthersSigner,
  to: AddressLike,
  id: BigNumberish,
  value: BigNumberish,
) => {
  await lootContract
    .connect(from)
    .safeTransferFrom(from.address, to, id, value, ZeroHash);
};
