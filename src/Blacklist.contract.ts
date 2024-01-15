import { ethers } from "hardhat";
import { getAccounts, sponsorRelayCall } from "./generalFunctions";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { AddressLike, ContractTransactionResponse } from "ethers";
import { Blacklist } from "../typechain-types";
import { assert, expect } from "chai";

export const deployBlacklistFixture = async () => {
  const { admin, trustedForwarder } = await getAccounts();

  const blacklist = await ethers.getContractFactory("Blacklist", admin);
  const blacklistContract = await blacklist.deploy(admin, trustedForwarder);

  await blacklistContract.waitForDeployment();

  return blacklistContract;
};

export const addToBlacklist = async (
  blacklistContract: unknown &
    Blacklist & {
      deploymentTransaction(): ContractTransactionResponse;
    },
  admin: HardhatEthersSigner,
  addTo: AddressLike,
  relay: boolean = false,
) => {
  if (relay) {
    const { data } = await blacklistContract
      .connect(admin)
      .addToBlackList.populateTransaction(addTo);
    await sponsorRelayCall(await blacklistContract.getAddress(), admin, data);
  } else {
    await blacklistContract.connect(admin).addToBlackList(addTo);
  }
};

export const removeFromBlackList = async (
  blacklistContract: unknown &
    Blacklist & {
      deploymentTransaction(): ContractTransactionResponse;
    },
  admin: HardhatEthersSigner,
  removeFrom: AddressLike,
  relay: boolean = false,
) => {
  if (relay) {
    const { data } = await blacklistContract
      .connect(admin)
      .removeFromBlackList.populateTransaction(removeFrom);

    await sponsorRelayCall(await blacklistContract.getAddress(), admin, data);
  } else {
    await blacklistContract.connect(admin).removeFromBlackList(removeFrom);
  }
};

export const addToBlacklistWithEvents = async (
  blacklistContract: unknown &
    Blacklist & {
      deploymentTransaction(): ContractTransactionResponse;
    },
  admin: HardhatEthersSigner,
  addTo: AddressLike,
  eventName: string,
  eventArgs?: unknown[],
) => {
  if (eventArgs) {
    await expect(
      await blacklistContract.connect(admin).addToBlackList(addTo),
      `${eventName} Failed`,
    )
      .to.emit(blacklistContract, eventName)
      .withArgs(...eventArgs);
  } else {
    await expect(
      await blacklistContract.connect(admin).addToBlackList(addTo),
      `${eventName} Failed`,
    ).to.emit(blacklistContract, eventName);
  }
};

export const removeFromBlackListWithEvents = async (
  blacklistContract: unknown &
    Blacklist & {
      deploymentTransaction(): ContractTransactionResponse;
    },
  admin: HardhatEthersSigner,
  removeFrom: AddressLike,
  eventName: string,
  eventArgs?: unknown[],
) => {
  if (eventArgs) {
    await expect(
      await blacklistContract.connect(admin).removeFromBlackList(removeFrom),
      `${eventName} Failed`,
    )
      .to.emit(blacklistContract, eventName)
      .withArgs(...eventArgs);
  } else {
    await expect(
      await blacklistContract.connect(admin).removeFromBlackList(removeFrom),
      `${eventName} Failed`,
    ).to.emit(blacklistContract, eventName);
  }
};

export const addToBlacklistWithErrors = async (
  blacklistContract: unknown &
    Blacklist & {
      deploymentTransaction(): ContractTransactionResponse;
    },
  admin: HardhatEthersSigner,
  addTo: AddressLike,
  errorName: string,
  errorArgs: unknown[],
) => {
  await blacklistContract.connect(admin).addToBlackList(addTo);
  await expect(
    blacklistContract.connect(admin).addToBlackList(addTo),
    `${errorName} Failed`,
  )
    .to.be.revertedWithCustomError(blacklistContract, errorName)
    .withArgs(...errorArgs);
};

export const removeFromBlackListWithErrors = async (
  blacklistContract: unknown &
    Blacklist & {
      deploymentTransaction(): ContractTransactionResponse;
    },
  admin: HardhatEthersSigner,
  removeFrom: AddressLike,
  errorName: string,
  errorArgs: unknown[],
) => {
  await expect(
    blacklistContract.connect(admin).removeFromBlackList(removeFrom),
    `${errorName} Failed`,
  )
    .to.be.revertedWithCustomError(blacklistContract, errorName)
    .withArgs(...errorArgs);
};

// Read
export const isBlackListed = async (
  blacklistContract: unknown &
    Blacklist & {
      deploymentTransaction(): ContractTransactionResponse;
    },
  account: AddressLike,
  expected: boolean = false,
) => {
  const isBlacklisted = await blacklistContract.isBlackListed(account);

  if (expected !== undefined) {
    assert(
      isBlacklisted == expected,
      `Expected state incorrect. Actual: ${isBlacklisted} | Expected: ${expected}`,
    );
  }

  return isBlacklisted;
};
