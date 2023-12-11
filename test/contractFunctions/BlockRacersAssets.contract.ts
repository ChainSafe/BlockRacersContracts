import { ethers } from "hardhat";
import { getAccounts } from "./generalFunctions";
import { generalSettings } from "../../scripts/defaultSettings";

export const deployAssets = async (
) => {
    const {
        admin,
        trustedForwarder,
    } = await getAccounts()

    const BlockRacersAssets = await ethers.getContractFactory("BlockRacersAssets", admin);
    
    return await BlockRacersAssets.deploy(
        trustedForwarder, 
        generalSettings.NFT.baseUri,
        admin, 
        );
}