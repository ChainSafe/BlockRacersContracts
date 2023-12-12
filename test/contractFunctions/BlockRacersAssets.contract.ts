import { ethers } from "hardhat";
import { getAccounts } from "./generalFunctions";
import { generalSettings } from "../../scripts/defaultSettings";
import { assert } from "chai";
import { AddressLike, BigNumberish, ContractTransactionResponse, ZeroHash } from "ethers";
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

    await balanceOfNft(assetsContract, receiver, id, 0);

    let hasRole = await assetsContract.hasRole(BLOCK_RACERS, issuerAccount);

    if(!hasRole) {
        await assetsContract.connect(admin).grantRole(BLOCK_RACERS, issuerAccount);
        hasRole = await assetsContract.hasRole(BLOCK_RACERS, issuerAccount);
        assert(hasRole, "Issuer account was not granted role")
    }

    await assetsContract.connect(issuerAccount)["mint(address,uint256,uint256,string)"](receiver, id, value, uri)
    await balanceOfNft(assetsContract, receiver, id, 1);
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

export const safeTransferFrom = async (
    assetsContract: BlockRacersAssets & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    from: HardhatEthersSigner, 
    operator: HardhatEthersSigner,
    id: BigNumberish,
    value: BigNumberish
) => {
    await isApprovedForAll(assetsContract, from, operator, true)

    await balanceOfNft(assetsContract, operator, id, 0)
    await assetsContract.connect(operator).safeTransferFrom(from, operator, id, value, ZeroHash);
    await balanceOfNft(assetsContract, operator, id, 1)
}

export const balanceOfNft = async (
    assetsContract: BlockRacersAssets & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    account: AddressLike,
    nftId: BigNumberish,
    expectedBalance: BigNumberish,
) => {
    let balanceOf = await assetsContract.balanceOf(account, nftId)

    assert(balanceOf == expectedBalance, `Balance incorrect: Actual:${balanceOf} | Expected: ${expectedBalance}`)
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