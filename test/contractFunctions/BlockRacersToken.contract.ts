import { ethers } from "hardhat";
import { getAccounts } from "./generalFunctions";
import { BigNumberish } from "ethers";

export const deployToken = async (
    initialAdminMint: BigNumberish = 0
) => {
    const {
        admin,
        issuerAccount,
        trustedForwarder,
    } = await getAccounts()

    const BlockRacersToken = await ethers.getContractFactory("BlockRacersToken", admin);
    return await BlockRacersToken.deploy(
        trustedForwarder, 
        issuerAccount,
        initialAdminMint
        );
}