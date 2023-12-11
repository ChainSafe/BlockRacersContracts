import { ethers } from "hardhat";
import { getAccounts } from "./generalFunctions";
import { AddressLike } from "ethers";
import { defaultGameSettings } from "../../scripts/defaultSettings";
import { deployTokenFixture } from "./BlockRacersToken.contract";
import { deployAssetsFixture } from "./BlockRacersAssets.contract";

export const deployCoreFixture = async (
    erc20TokenAddress?: AddressLike,
    erc1155TokenAddress?: AddressLike,
) => {
    const {
        admin,
        trustedForwarder,
        feeAccount
    } = await getAccounts()

    if(!erc20TokenAddress) {
        erc20TokenAddress = await (await deployTokenFixture()).getAddress();
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