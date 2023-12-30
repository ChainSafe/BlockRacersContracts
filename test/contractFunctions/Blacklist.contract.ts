import { ethers } from "hardhat";
import { getAccounts } from "./generalFunctions";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { AddressLike, ContractTransactionResponse } from "ethers";
import { Blacklist } from "../../typechain-types";
import { assert } from "chai";

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

