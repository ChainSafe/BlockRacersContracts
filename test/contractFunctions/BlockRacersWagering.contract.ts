import { ethers } from "hardhat";
import { getAccounts } from "./generalFunctions";
import { AddressLike } from "ethers";

export const deployWagering = async (
    erc20TokenAddress: AddressLike
) => {
    const {
        admin,
        trustedForwarder,
    } = await getAccounts()

    const BlockRacersWagering = await ethers.getContractFactory("BlockRacersWagering", admin);
    return await BlockRacersWagering.deploy(
        trustedForwarder, 
        admin,
        erc20TokenAddress,
        );
}