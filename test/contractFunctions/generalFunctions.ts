import { ethers } from "hardhat";
import { deployToken } from "./BlockRacersToken.contract";
import { deployAssets } from "./BlockRacersAssets.contract";
import { deployWagering } from "./BlockRacersWagering.contract";
import { deployCore } from "./BlockRacers.contract";

export const getAccounts = async () => {
    const [trustedForwarder, issuerAccount, admin, feeAccount, player1, player2, player3 ] = await ethers.getSigners();

    return {
        trustedForwarder, issuerAccount, admin, feeAccount, player1, player2, player3
    }
}

export const defaultDeploy = async () => {
    const tokenContract = await deployToken();
    const assetsContract = await deployAssets();
    const wageringContract = await deployWagering(await tokenContract.getAddress())
    const coreContract = await deployCore(await tokenContract.getAddress(), await assetsContract.getAddress())

    // Register BlockRacers core
    const { admin } = await getAccounts();
    await assetsContract.connect(admin).grantRole(await assetsContract.BLOCK_RACERS(), await coreContract.getAddress());


    return {
        tokenContract,
        assetsContract,
        wageringContract,
        coreContract,
    }
}