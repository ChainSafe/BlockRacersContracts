import { ethers } from "hardhat";
import { getAccounts } from "./generalFunctions";
import { generalSettings } from "../../scripts/defaultSettings";

export const deployAssetsFixture = async (
) => {
    const {
        admin,
        trustedForwarder,
    } = await getAccounts()

    const BlockRacersAssets = await ethers.getContractFactory("BlockRacersAssets", admin);
    
    const BlockRacersAssetsContract = await BlockRacersAssets.deploy(
        trustedForwarder, 
        generalSettings.NFT.baseUri,
        admin, 
        );
    await BlockRacersAssetsContract.waitForDeployment();

    return BlockRacersAssetsContract;
}