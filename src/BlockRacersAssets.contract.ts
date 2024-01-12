import { ethers } from "hardhat";
import { getAccounts, sponsorRelayCall } from "./generalFunctions";
import { generalSettings } from "../scripts/defaultSettings";
import { assert, expect } from "chai";
import { AddressLike, BigNumberish, ContractTransactionResponse, ZeroHash } from "ethers";
import { BlockRacersAssets } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

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
    uri: string,
    relay: boolean = false
) => {
    const { admin, issuerAccount } = await getAccounts();
    const BLOCK_RACERS = await assetsContract.BLOCK_RACERS();

    const before = await balanceOfNft(assetsContract, receiver, id);

    let hasRole = await assetsContract.hasRole(BLOCK_RACERS, issuerAccount);

    if(!hasRole) {
        await assetsContract.connect(admin).grantRole(BLOCK_RACERS, issuerAccount);
        hasRole = await assetsContract.hasRole(BLOCK_RACERS, issuerAccount);
        assert(hasRole, "Issuer account was not granted role")
    }

    if(relay) {
        const { data } = await assetsContract.connect(issuerAccount).mint.populateTransaction(receiver, id, value, uri)

        await sponsorRelayCall(await assetsContract.getAddress(), issuerAccount, data);
    } else {
        await assetsContract.connect(issuerAccount).mint(receiver, id, value, uri)
    }

    await balanceOfNft(assetsContract, receiver, id, BigInt(value) + before);
}

export const mintNftWithURIWithError = async (
    assetsContract: BlockRacersAssets & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    receiver: AddressLike,
    id: BigNumberish,
    value: BigNumberish,
    uri: string,
    errorName: string,
    errorArgs: any[]
) => {
    const { issuerAccount } = await getAccounts();

    await expect((assetsContract.connect(issuerAccount).mint(receiver, id, value, uri)), `${errorName} Failed`)
    .to.be.revertedWithCustomError(assetsContract, errorName).withArgs(...errorArgs)
}

export const batchMintNftWithURI = async (
    assetsContract: BlockRacersAssets & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    receiver: AddressLike,
    ids: BigNumberish[],
    values: BigNumberish[],
    uris: string[],
    relay: boolean = false
) => {
    const { admin, issuerAccount } = await getAccounts();
    const BLOCK_RACERS = await assetsContract.BLOCK_RACERS();

    let hasRole = await assetsContract.hasRole(BLOCK_RACERS, issuerAccount);

    if(!hasRole) {
        await assetsContract.connect(admin).grantRole(BLOCK_RACERS, issuerAccount);
        hasRole = await assetsContract.hasRole(BLOCK_RACERS, issuerAccount);
        assert(hasRole, "Issuer account was not granted role")
    }

    if (relay) {
        const { data } = await assetsContract.connect(issuerAccount).mintBatch.populateTransaction(receiver, ids, values, uris)

        await sponsorRelayCall(await assetsContract.getAddress(), issuerAccount, data);
    } else {
        await assetsContract.connect(issuerAccount).mintBatch(receiver, ids, values, uris)
    }
}

export const batchMintNftWithURIWithErrors = async (
    assetsContract: BlockRacersAssets & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    receiver: AddressLike,
    ids: BigNumberish[],
    values: BigNumberish[],
    uris: string[],
    errorName: string,
    errorArgs: any[]
) => {
    const { admin, issuerAccount } = await getAccounts();
    const BLOCK_RACERS = await assetsContract.BLOCK_RACERS();

    let hasRole = await assetsContract.hasRole(BLOCK_RACERS, issuerAccount);

    if(!hasRole) {
        await assetsContract.connect(admin).grantRole(BLOCK_RACERS, issuerAccount);
        hasRole = await assetsContract.hasRole(BLOCK_RACERS, issuerAccount);
        assert(hasRole, "Issuer account was not granted role")
    }

    await expect((assetsContract.connect(issuerAccount).mintBatch(receiver, ids, values, uris)), `${errorName} Failed`)
        .to.be.revertedWithCustomError(assetsContract, errorName).withArgs(...errorArgs)
}

export const setApprovalForAll = async (
    assetsContract: BlockRacersAssets & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    from: HardhatEthersSigner, 
    operator: AddressLike,
    authorized: boolean,
    relay: boolean = false
) => {
    await isApprovedForAll(assetsContract, from, operator, !authorized);

    if (relay) {
        const { data } = await assetsContract.connect(from).setApprovalForAll.populateTransaction(operator, authorized)

        await sponsorRelayCall(await assetsContract.getAddress(), from, data);
    } else {
        await assetsContract.connect(from).setApprovalForAll(operator, authorized)
    }

    await isApprovedForAll(assetsContract, from, operator, authorized);
}

export const safeTransferFrom = async (
    assetsContract: BlockRacersAssets & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    from: HardhatEthersSigner, 
    operator: HardhatEthersSigner,
    id: BigNumberish,
    value: BigNumberish,
    relay: boolean = false
) => {
    await isApprovedForAll(assetsContract, from, operator, true)
    if (relay) {
        const { data } = await assetsContract.connect(operator).safeTransferFrom.populateTransaction(from, operator, id, value, ZeroHash)

        await sponsorRelayCall(await assetsContract.getAddress(), from, data);
    } else {
        await assetsContract.connect(operator).safeTransferFrom(from, operator, id, value, ZeroHash);
    }

}

// Read
export const balanceOfNft = async (
    assetsContract: BlockRacersAssets & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    account: AddressLike,
    nftId: BigNumberish,
    expectedBalance?: BigNumberish,
) => {
    let balanceOf = await assetsContract.balanceOf(account, nftId)

    if (expectedBalance) {
        assert(balanceOf == expectedBalance, `Balance incorrect: Actual:${balanceOf} | Expected: ${expectedBalance}`)
    }
    
    return balanceOf
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

    return isApprovedForAll
}

export const getUri = async (
    assetsContract: BlockRacersAssets & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    nftId: BigNumberish,
    expected?: string
) => {
    let uri = await assetsContract.uri(nftId)

    if (expected) {
        assert(uri == expected, `Uri incorrect: Actual:${uri} | Expected: ${expected}`)
    }

    return uri
}