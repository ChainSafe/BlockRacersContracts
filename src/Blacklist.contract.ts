import { ethers } from "hardhat";
import { getAccounts } from "./generalFunctions";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { AddressLike, ContractTransactionResponse } from "ethers";
import { Blacklist } from "../typechain-types";
import { assert, expect } from "chai";
import { CallWithERC2771Request } from "@gelatonetwork/relay-sdk";
import { sponsoredCallERC2771Local } from "./__mock__/relay-sdk";

export const deployBlacklistFixture = async (
) => {
    const {
        admin,
        trustedForwarder
    } = await getAccounts()

    const Blacklist = await ethers.getContractFactory("Blacklist", admin);
    const BlacklistContract = await Blacklist.deploy(
        admin, 
        trustedForwarder
        );

    await BlacklistContract.waitForDeployment();
    
    return BlacklistContract;
}

export const addToBlacklist = async (
    blacklistContract: unknown & Blacklist & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    admin: HardhatEthersSigner,
    addTo: AddressLike,
    relay?: boolean
) => {
    if (relay) {
        const { data } = await blacklistContract.connect(admin).addToBlackList.populateTransaction(addTo);
    
        const request: CallWithERC2771Request = {
            target: await blacklistContract.getAddress(),
            user: admin.address,
            data: data,
            chainId: (await admin.provider.getNetwork()).chainId,
        };
      
        await sponsoredCallERC2771Local(request);

    } else {
        await blacklistContract.connect(admin).addToBlackList(addTo);
    }
}

export const removeFromBlackList = async (
    blacklistContract: unknown & Blacklist & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    admin: HardhatEthersSigner,
    removeFrom: AddressLike,
    relay?: boolean
) => {
    if (relay) {
        const { data } = await blacklistContract.connect(admin).removeFromBlackList.populateTransaction(removeFrom);
    
        const request: CallWithERC2771Request = {
            target: await blacklistContract.getAddress(),
            user: admin.address,
            data: data,
            chainId: (await admin.provider.getNetwork()).chainId,
        };
      
        await sponsoredCallERC2771Local(request);
    } else {
        await blacklistContract.connect(admin).removeFromBlackList(removeFrom);
    }
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

