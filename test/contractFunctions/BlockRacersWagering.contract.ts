import { ethers } from "hardhat";
import { getAccounts } from "./generalFunctions";
import { AddressLike, BigNumberish, ContractTransactionResponse, keccak256, toUtf8Bytes } from "ethers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { deployTokenFixture } from "./BlockRacersToken.contract";
import { BlockRacersWagering } from "../../typechain-types";
import { assert } from "chai";

export const deployWageringFixture = (
    erc20TokenAddress?: AddressLike
) => {
    return async function wageringFixture() {
        const {
            admin,
            trustedForwarder,
        } = await getAccounts()
    
        if(!erc20TokenAddress) {
            erc20TokenAddress = (await (deployTokenFixture())()).getAddress();
        }
    
        const BlockRacersWagering = await ethers.getContractFactory("BlockRacersWagering", admin);
        const BlockRacersWageringContract = await BlockRacersWagering.deploy(
            trustedForwarder, 
            admin,
            erc20TokenAddress,
        );
    
        await BlockRacersWageringContract.waitForDeployment();
        return BlockRacersWageringContract;
    }
}

export const createWager = async (
    wageringContract: BlockRacersWagering & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    creator: HardhatEthersSigner,
    prize: BigNumberish,
    expectedProperties?: unknown
) => {
    await wageringContract.connect(creator).createWager(prize);

}


export const getLatestWagerId = async (
    wageringContract: BlockRacersWagering & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    expected?: BigNumberish
) => {
    const latestID = await wageringContract.latestWagerId();
    if (expected) {
        assert(latestID == expected, `Latest ID incorrect. Actual: ${latestID} | Expected: ${expected}`)
    }
    return latestID
}

export const createWagerCompleteProof = async (signer: HardhatEthersSigner, wagerId: BigNumberish, winnerAddress: AddressLike) => {
    const messageHash = keccak256(toUtf8Bytes(`${wagerId}-${winnerAddress}`));
    return await signer.signMessage(messageHash);
}