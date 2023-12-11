import { ethers } from "hardhat";
import { getAccounts } from "./generalFunctions";
import { BigNumberish } from "ethers";

export const deployTokenFixture = async (
    initialAdminMint: BigNumberish = 0
) => {
    const {
        admin,
        issuerAccount,
        trustedForwarder,
    } = await getAccounts()

    const BlockRacersToken = await ethers.getContractFactory("BlockRacersToken", admin);
    const BlockRacersTokenContract =  await BlockRacersToken.deploy(
        trustedForwarder, 
        issuerAccount,
        initialAdminMint
        );
    await BlockRacersTokenContract.waitForDeployment()
    
    return BlockRacersTokenContract;
}