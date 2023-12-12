import { ethers } from "hardhat";
import { getAccounts } from "./generalFunctions";
import { AddressLike, BigNumberish, ContractTransactionResponse } from "ethers";
import { defaultGameSettings } from "../../scripts/defaultSettings";
import { deployTokenFixture } from "./BlockRacersToken.contract";
import { deployAssetsFixture } from "./BlockRacersAssets.contract";
import { BlockRacers } from "../../typechain-types";
import { assert } from "chai";

export const deployCoreFixture = (
    erc20TokenAddress?: AddressLike,
    erc1155TokenAddress?: AddressLike,
) => {
    return async function coreFixture() {
        const {
            admin,
            trustedForwarder,
            feeAccount
        } = await getAccounts()
    
        if(!erc20TokenAddress) {
            erc20TokenAddress = (await (deployTokenFixture())()).getAddress()
        }
    
        if(!erc1155TokenAddress) {
            erc1155TokenAddress = await (await deployAssetsFixture()).getAddress();
        }
    
        const BlockRacers = await ethers.getContractFactory("BlockRacers", admin);
        const BlockRacersContract = await BlockRacers.deploy(
            trustedForwarder, 
            admin, 
            erc20TokenAddress, 
            erc1155TokenAddress,
            feeAccount,
            defaultGameSettings,
            );
    
        await BlockRacersContract.waitForDeployment();
        
        return BlockRacersContract;
    }
}


export const blockRacersFeeAccount = async (
    coreContract: BlockRacers & {
        deploymentTransaction(): ContractTransactionResponse
    },
    expectedAddress: AddressLike
) => {
    const feeAccountFetched = await coreContract.blockRacersFeeAccount()

    assert(expectedAddress == feeAccountFetched, `Fee account incorrect. Actual: ${feeAccountFetched} | Expected: ${expectedAddress}`)
}

export const numberOfCarsMinted = async (
    coreContract: BlockRacers & {
        deploymentTransaction(): ContractTransactionResponse
    },
    expectedValue: BigNumberish
) => {
    const minted = await coreContract.getNumberOfCarsMinted();

    assert(minted == expectedValue, `Number minted incorrect. Actual: ${minted} | Expected: ${expectedValue}`)
}

export const checkOwner = async (
    coreContract: BlockRacers & {
        deploymentTransaction(): ContractTransactionResponse
    },
    expectedOwner: AddressLike
) => {
    const owner = await coreContract.owner();
    assert(owner == expectedOwner, `Owner incorrect. Actual: ${owner} | Expected: ${expectedOwner}`)
}

export const checkToken = async (
    coreContract: BlockRacers & {
        deploymentTransaction(): ContractTransactionResponse
    },
    expectedToken: AddressLike
) => {
    const token = await coreContract.token();
    assert(token == expectedToken, `Token incorrect. Actual: ${token} | Expected: ${expectedToken}`)
}

export const checkAssets = async (
    coreContract: BlockRacers & {
        deploymentTransaction(): ContractTransactionResponse
    },
    expectedAssets: AddressLike
) => {
    const assets = await coreContract.assets();
    assert(assets == expectedAssets, `Assets incorrect. Actual: ${assets} | Expected: ${expectedAssets}`)
}
