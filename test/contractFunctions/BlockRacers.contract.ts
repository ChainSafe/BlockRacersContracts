import { ethers } from "hardhat";
import { getAccounts } from "./generalFunctions";
import { AddressLike } from "ethers";
import { defaultGameSettings } from "../../scripts/defaultSettings";

export const deployCore = async (
    erc20TokenAddress: AddressLike,
    erc1155TokenAddress: AddressLike,
) => {
    const {
        admin,
        trustedForwarder,
        feeAccount
    } = await getAccounts()

    const BlockRacers = await ethers.getContractFactory("BlockRacers", admin);
    return await BlockRacers.deploy(
        trustedForwarder, 
        admin, 
        erc20TokenAddress, 
        erc1155TokenAddress,
        feeAccount,
        defaultGameSettings,
        );
}