import { ethers } from "hardhat";
import { deployTokenFixture } from "./BlockRacersToken.contract";
import { deployAssetsFixture } from "./BlockRacersAssets.contract";
import { deployWageringFixture } from "./BlockRacersWagering.contract";
import { deployCoreFixture } from "./BlockRacers.contract";
import { AddressLike, parseUnits } from "ethers";
import { ERC2771Context } from "../typechain-types/@openzeppelin/contracts/metatx/ERC2771Context";
import { assert } from "chai";
import { GELATO_RELAY_1BALANCE_ERC2771 } from "./constants";

export const mintingAmount = parseUnits("200", 18);

export const getAccounts = async () => {
    const [, issuerAccount, admin, feeAccount, player1, player2, player3 ] = await ethers.getSigners();

    return {
        trustedForwarder: await ethers.getImpersonatedSigner(GELATO_RELAY_1BALANCE_ERC2771), issuerAccount, admin, feeAccount, player1, player2, player3
    }
}

export const defaultDeployFixture = (withMint: boolean = false) => {
    return async function generalFixture() {
        const tokenContract = await (deployTokenFixture())();
        const assetsContract = await deployAssetsFixture();
        const wageringContract = await (deployWageringFixture(await tokenContract.getAddress()))()
        const coreContract = await (deployCoreFixture(await tokenContract.getAddress(), await assetsContract.getAddress()))()

        // Register BlockRacers core
        const { admin } = await getAccounts();
        await assetsContract.connect(admin).grantRole(await assetsContract.BLOCK_RACERS(), await coreContract.getAddress());


        if (withMint) {
            const { player1, player2, player3 } = await getAccounts();

            await tokenContract["mint(address,uint256)"](player1, mintingAmount);
            await tokenContract["mint(address,uint256)"](player2, mintingAmount);
            await tokenContract["mint(address,uint256)"](player3, mintingAmount);
        }

        return {
            tokenContract,
            assetsContract,
            wageringContract,
            coreContract,
        }
    }
}

export const isTrustedForwarder = async (
    contract: ERC2771Context,
    address: AddressLike,
    expectedState: boolean
) => {
    const state = await contract.isTrustedForwarder(address);
    assert(state == expectedState, `TrustedForwarder incorrect. Actual: ${state} | Expected: ${expectedState}`)
}

export const checkTrustedForwarder = async (
    contract: ERC2771Context,
    expectedState: AddressLike
) => {
    const state = await contract.trustedForwarder();
    assert(state == expectedState, `TrustedForwarder incorrect. Actual: ${state} | Expected: ${expectedState}`)
}