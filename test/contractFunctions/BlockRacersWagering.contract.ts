import { ethers } from "hardhat";
import { getAccounts } from "./generalFunctions";
import { AddressLike, BigNumberish, keccak256, toUtf8Bytes } from "ethers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { deployTokenFixture } from "./BlockRacersToken.contract";

// Functions for reducing redundancy on function logic later on
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

export const createWagerCompleteProof = async (signer: HardhatEthersSigner, wagerId: BigNumberish, winnerAddress: AddressLike) => {
    const messageHash = keccak256(toUtf8Bytes(`${wagerId}-${winnerAddress}`));
    return await signer.signMessage(messageHash);
}