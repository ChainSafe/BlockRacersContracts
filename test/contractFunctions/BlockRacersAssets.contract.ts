import { ethers } from "hardhat";
import { getAccounts } from "./generalFunctions";
import { defaultGameSettings, generalSettings } from "../../scripts/defaultSettings";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { assert } from "chai";
import { AddressLike, BigNumberish, ContractTransactionResponse } from "ethers";
import { BlockRacersAssets } from "../../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

// Functions for reducing redundancy on function logic later on
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

export const mintNftWithURI = async (
    assetsContract: BlockRacersAssets & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    receiver: AddressLike,
    id: BigNumberish,
    value: BigNumberish,
    uri: string
) => {
    const { admin, issuerAccount} = await getAccounts();
    const BLOCK_RACERS = await assetsContract.BLOCK_RACERS();

    let balanceOf = await assetsContract.balanceOf(receiver, 1)

    assert(balanceOf == BigInt(0), "Player has nft already")
    let hasRole = await assetsContract.hasRole(BLOCK_RACERS, issuerAccount);

    if(!hasRole) {
        await assetsContract.connect(admin).grantRole(BLOCK_RACERS, issuerAccount);
        hasRole = await assetsContract.hasRole(BLOCK_RACERS, issuerAccount);
        assert(hasRole, "Issuer account was not granted role")
    }

    await assetsContract.connect(issuerAccount)["mint(address,uint256,uint256,string)"](receiver, id, value, uri)
    balanceOf = await assetsContract.balanceOf(receiver, id)
    assert(balanceOf == BigInt(1), "Player was not issued nft")
}

export const setApprovalForAll = async (
    assetsContract: BlockRacersAssets & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    from: HardhatEthersSigner, 
    operator: AddressLike,
    authorized: boolean
) => {
    await isApprovedForAll(assetsContract, from, operator, !authorized);

    await assetsContract.connect(from).setApprovalForAll(operator, authorized)

    await isApprovedForAll(assetsContract, from, operator, authorized);
}

export const isApprovedForAll = async (
    assetsContract: BlockRacersAssets & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    sender: AddressLike,
    operator: AddressLike, 
    expected: boolean
) => {
    let isApprovedForAll = await assetsContract.isApprovedForAll(sender, operator)

    assert(isApprovedForAll == expected, "approval not set correctly")
}