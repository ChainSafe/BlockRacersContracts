import { ethers } from "hardhat";
import { getAccounts } from "./generalFunctions";
import { AddressLike, BigNumberish, ContractTransactionResponse } from "ethers";
import { defaultGameSettings } from "../../scripts/defaultSettings";
import { approvalToken, deployTokenFixture } from "./BlockRacersToken.contract";
import { deployAssetsFixture } from "./BlockRacersAssets.contract";
import { BlockRacers, BlockRacersToken } from "../../typechain-types";
import { assert } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

export enum CarTypeOption {
    FIRST = 0,
    SECOND = 1,
    THIRD = 2
}

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

export const mintCar = async (
    coreContract: BlockRacers & {
        deploymentTransaction(): ContractTransactionResponse
    }, 
    tokenContract: BlockRacersToken & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    carType: CarTypeOption,
    minter: HardhatEthersSigner
) => {
    const { carCost } = await getCarOption(coreContract, carType)
    await approvalToken(tokenContract, minter, await coreContract.getAddress(), carCost)

    // TODO: Check Event once 
    // Get from latest before then
    await coreContract.connect(minter).mintCar(carType)
}

export const upgradeEngine = async (
    coreContract: BlockRacers & {
        deploymentTransaction(): ContractTransactionResponse
    }, 
    ownerAccount: HardhatEthersSigner,
    carId: BigNumberish,
    expectedLevel?: BigNumberish
) => {
    await coreContract.connect(ownerAccount).upgradeEngine(carId)

    if(expectedLevel) {
        const stats = await getCarStats(coreContract, carId);

        assert(stats.engineLevel == expectedLevel, `Engine level was not increased incorrect. Actual: ${stats.engineLevel} | Expected: ${expectedLevel}`)
    }
}

export const upgradeHandling = async (
    coreContract: BlockRacers & {
        deploymentTransaction(): ContractTransactionResponse
    }, 
    ownerAccount: HardhatEthersSigner,
    carId: BigNumberish,
    expectedLevel?: BigNumberish
) => {
    await coreContract.connect(ownerAccount).upgradeHandling(carId)

    if(expectedLevel) {
        const stats = await getCarStats(coreContract, carId);

        assert(stats.handlingLevel == expectedLevel, `Handling level was not increased incorrect. Actual: ${stats.handlingLevel} | Expected: ${expectedLevel}`)
    }
}

export const upgradeNos = async (
    coreContract: BlockRacers & {
        deploymentTransaction(): ContractTransactionResponse
    }, 
    ownerAccount: HardhatEthersSigner,
    carId: BigNumberish,
    expectedLevel?: BigNumberish
) => {
    await coreContract.connect(ownerAccount).upgradeNos(carId)

    if(expectedLevel) {
        const stats = await getCarStats(coreContract, carId);

        assert(stats.nosLevel == expectedLevel, `Nos level was not increased incorrect. Actual: ${stats.nosLevel} | Expected: ${expectedLevel}`)
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
    expectedValue?: BigNumberish
) => {
    const minted = await coreContract.getNumberOfCarsMinted();

    if (expectedValue) {
        assert(minted == expectedValue, `Number minted incorrect. Actual: ${minted} | Expected: ${expectedValue}`)
    }

    return minted;
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

export const getCarOwner = async (
    coreContract: BlockRacers & {
        deploymentTransaction(): ContractTransactionResponse
    },
    owner: AddressLike,
    id: BigNumberish,
    expectedValue?: boolean
) => {
    const isOwner = await coreContract.getCarOwner(id, owner)

    if (expectedValue) {
        assert(isOwner == expectedValue, `Ownership incorrect. Actual: ${isOwner} | Expected: ${expectedValue}`)
    }

    return isOwner;
}

export const getCarOption = async (
    coreContract: BlockRacers & {
        deploymentTransaction(): ContractTransactionResponse
    },
    carType: CarTypeOption,
    expectedCost?: BigNumberish,
    expectedUri?: string
) => {
    const option = await coreContract.getCarOption(carType)

    if (expectedCost) {
        assert(option[0] == expectedCost, `Option cost incorrect. Actual: ${option[0]} | Expected: ${expectedCost}`)
    }
    if(expectedUri) {
        assert(option[1] == expectedUri, `Option uri incorrect. Actual: ${option[1]} | Expected: ${expectedUri}`)
    }

    return {
        carCost: option[0],
        carUri: option[1]
    }
}

export const getCarStats = async (
    coreContract: BlockRacers & {
        deploymentTransaction(): ContractTransactionResponse
    },
    carId: BigNumberish,
    expectedStats?: BlockRacers.CarStatsStruct
) => {
    const stats = await coreContract.getCarStats(carId)

    if (expectedStats) {
        assert(stats.carTypeId == expectedStats.carTypeId, `carId incorrect. Actual: ${stats.carTypeId} | Expected: ${expectedStats.carTypeId}`)
        assert(stats.carOptionData.carCost == expectedStats.carOptionData.carCost, `carCost incorrect. Actual: ${stats.carOptionData.carCost} | Expected: ${expectedStats.carOptionData.carCost}`)
        assert(stats.carOptionData.carUri == expectedStats.carOptionData.carUri, `carUri  incorrect. Actual: ${stats.carOptionData.carUri} | Expected: ${expectedStats.carOptionData.carUri}`)
        assert(stats.engineLevel == expectedStats.engineLevel, `engineLevel incorrect. Actual: ${stats.engineLevel} | Expected: ${expectedStats.engineLevel}`)
        assert(stats.handlingLevel == expectedStats.handlingLevel, `handlingLevel incorrect. Actual: ${stats.handlingLevel} | Expected: ${expectedStats.handlingLevel}`)
        assert(stats.nosLevel == expectedStats.nosLevel, `nosLevel incorrect. Actual: ${stats.nosLevel} | Expected: ${expectedStats.nosLevel}`)
    }

    return stats;
}

export const getUpgradeData = async (
    coreContract: BlockRacers & {
        deploymentTransaction(): ContractTransactionResponse
    },
    expected?: BlockRacers.GameSettingsDataStruct
) => {
    const data = await coreContract.getUpgradeData()

    if (expected) {
        assert(data.engineMaxLevel == expected.engineMaxLevel, `engineMaxLevel incorrect. Actual: ${data.engineMaxLevel} | Expected: ${expected.engineMaxLevel}`)
        assert(data.enginePrice == expected.enginePrice, `enginePrice incorrect. Actual: ${data.enginePrice} | Expected: ${expected.enginePrice}`)
        assert(data.handlingMaxLevel == expected.handlingMaxLevel, `handlingMaxLevel incorrect. Actual: ${data.handlingMaxLevel} | Expected: ${expected.handlingMaxLevel}`)
        assert(data.handlingPrice == expected.handlingPrice, `handlingPrice incorrect. Actual: ${data.handlingPrice} | Expected: ${expected.handlingPrice}`)
        assert(data.nosMaxLevel == expected.nosMaxLevel, `nosMaxLevel incorrect. Actual: ${data.nosMaxLevel} | Expected: ${expected.nosMaxLevel}`)
        assert(data.nosPrice == expected.nosPrice, `nosPrice incorrect. Actual: ${data.nosPrice} | Expected: ${expected.nosPrice}`)
        assert(data.carOptions.length == expected.carOptions.length, `carOptions incorrect. Actual: ${data.carOptions.length} | Expected: ${expected.carOptions.length}`)
        
        data.carOptions.map((item: BlockRacers.CarOptionStructOutput, index: number) => {
            assert(item.carCost == expected.carOptions[index].carCost, `Car option cost @ ${index} incorrect. Actual: ${item.carCost} | Expected: ${expected.carOptions[index].carCost}`)
            assert(item.carUri == expected.carOptions[index].carUri, `Car option uri @ ${index} incorrect. Actual: ${item.carUri} | Expected: ${expected.carOptions[index].carUri}`)

        })
    }
    return data
}