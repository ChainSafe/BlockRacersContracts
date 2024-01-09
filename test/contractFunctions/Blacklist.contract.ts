import { ethers } from "hardhat";
import { getAccounts } from "./generalFunctions";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { AddressLike, ContractTransactionResponse } from "ethers";
import { Blacklist } from "../../typechain-types";
import { assert, expect } from "chai";

export const deployBlacklistFixture = async (
) => {
    const {
        admin,
    } = await getAccounts()

    const Blacklist = await ethers.getContractFactory("Blacklist", admin);
    const BlacklistContract = await Blacklist.deploy(
        admin, 
        );

    await BlacklistContract.waitForDeployment();
    
    return BlacklistContract;
}

export const addToBlacklist = async (
    blacklistContract: unknown & Blacklist & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    admin: HardhatEthersSigner,
    addTo: AddressLike
) => {
    await blacklistContract.connect(admin).addToBlackList(addTo);
    await isBlackListed(blacklistContract, addTo, true)
}

export const removeFromBlackList = async (
    blacklistContract: unknown & Blacklist & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    admin: HardhatEthersSigner,
    removeFrom: AddressLike
) => {
    await blacklistContract.connect(admin).removeFromBlackList(removeFrom);
}

export const addToBlacklistWithEvents = async (
    blacklistContract: unknown & Blacklist & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    admin: HardhatEthersSigner,
    addTo: AddressLike,
    eventName: string,
    eventArgs?: any[]
) => {
    if(eventArgs) {
        await expect(await blacklistContract.connect(admin).addToBlackList(addTo), `${eventName} Failed`)
            .to.emit(blacklistContract, eventName)
            .withArgs(...eventArgs)
    } else {
        await expect(await blacklistContract.connect(admin).addToBlackList(addTo), `${eventName} Failed`)
            .to.emit(blacklistContract, eventName)
    }
}

export const removeFromBlackListWithEvents = async (
    blacklistContract: unknown & Blacklist & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    admin: HardhatEthersSigner,
    removeFrom: AddressLike,
    eventName: string,
    eventArgs?: any[]
) => {
    if(eventArgs) {
        await expect(await blacklistContract.connect(admin).removeFromBlackList(removeFrom), `${eventName} Failed`)
            .to.emit(blacklistContract, eventName)
            .withArgs(...eventArgs)
    } else {
        await expect(await blacklistContract.connect(admin).removeFromBlackList(removeFrom), `${eventName} Failed`)
            .to.emit(blacklistContract, eventName)
    }
}

export const addToBlacklistWithErrors = async (
    blacklistContract: unknown & Blacklist & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    admin: HardhatEthersSigner,
    addTo: AddressLike,
    errorName: string,
    errorArgs: any[]
) => {
    await blacklistContract.connect(admin).addToBlackList(addTo)
    await expect(blacklistContract.connect(admin).addToBlackList(addTo), `${errorName} Failed`)
        .to.be.revertedWithCustomError(blacklistContract, errorName).withArgs(...errorArgs)
}

export const removeFromBlackListWithErrors = async (
    blacklistContract: unknown & Blacklist & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    admin: HardhatEthersSigner,
    removeFrom: AddressLike,
    errorName: string,
    errorArgs: any[]
    ) => {
    await expect(blacklistContract.connect(admin).removeFromBlackList(removeFrom), `${errorName} Failed`)
        .to.be.revertedWithCustomError(blacklistContract, errorName).withArgs(...errorArgs)
}

// Read
export const isBlackListed = async (
    blacklistContract: unknown & Blacklist & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    account: AddressLike,
    expected?: boolean
) => {
    const result = await blacklistContract.isBlackListed(account);

    if(expected !== undefined) {
        assert(result == expected, `Expected state incorrect. Actual: ${result} | Expected: ${expected}`)
    }
}

