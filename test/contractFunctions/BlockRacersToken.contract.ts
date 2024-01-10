import { ethers } from "hardhat";
import { getAccounts } from "./generalFunctions";
import { AddressLike, BigNumberish, ContractTransactionResponse, getBytes, solidityPackedKeccak256, toBeHex, verifyMessage } from "ethers";
import { BlockRacersToken } from "../../typechain-types";
import { assert, expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

export const deployTokenFixture = (
    initialAdminMint: BigNumberish = 0
) => {
    return async function tokenFixture() {
        const {
            admin,
            issuerAccount,
            trustedForwarder,
        } = await getAccounts()
    
        const BlockRacersToken = await ethers.getContractFactory("BlockRacersToken", admin);
        const BlockRacersTokenContract =  await BlockRacersToken.deploy(
            trustedForwarder, 
            admin,
            issuerAccount,
            initialAdminMint
            );
        await BlockRacersTokenContract.waitForDeployment()
        
        return BlockRacersTokenContract;
    }
}

export const setNewIssuerAccount = async (
    tokenContract: BlockRacersToken & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    owner: HardhatEthersSigner,
    account: AddressLike,
) => {
    await tokenContract.connect(owner).setNewIssuerAccount(account)
}

export const setNewIssuerAccountWithEvents = async (
    tokenContract: BlockRacersToken & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    owner: HardhatEthersSigner,
    account: AddressLike,
    eventName: string,
    eventArgs: any[]
) => {
    await expect(await tokenContract.connect(owner).setNewIssuerAccount(account), `${eventName} Failed`)
        .to.emit(tokenContract, eventName)
        .withArgs(...eventArgs)
}

export const setNewIssuerAccountWithErrors = async (
    tokenContract: BlockRacersToken & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    owner: HardhatEthersSigner,
    account: AddressLike,
    errorName: string,
    errorArgs: any[]
) => {
    await expect(tokenContract.connect(owner).setNewIssuerAccount(account), `${errorName} Failed`)
        .to.be.revertedWithCustomError(tokenContract, errorName).withArgs(...errorArgs)
}

export const testnetMint = async (
    tokenContract: BlockRacersToken & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    account: AddressLike,
    value: BigNumberish,
) => {
    const beforeMint = await balanceOfToken(tokenContract, account);

    await tokenContract["mint(address,uint256)"](account, value);

    await balanceOfToken(tokenContract, account, beforeMint + BigInt(value));
}

export const mintWithPermit = async (
    tokenContract: BlockRacersToken & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    issuer: HardhatEthersSigner,
    account: AddressLike,
    value: BigNumberish,
) => {
    const beforeMint = await balanceOfToken(tokenContract, account);
    const nonce = await getPlayerNonce(tokenContract, account, 0);

    const permit = await createMintPermit(issuer, nonce, account, value)
    await tokenContract["mint(address,uint256,bytes)"](account, value, permit);

    await balanceOfToken(tokenContract, account, beforeMint + BigInt(value));
}

export const setAllowanceToken = async (
    tokenContract: BlockRacersToken & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    sender: HardhatEthersSigner,
    spender: AddressLike,
    value: BigNumberish,
    expected?: BigNumberish
) => {
    await tokenContract.connect(sender).approve(spender, value);

    if (expected) {
        await approvalToken(tokenContract, sender, spender, expected)
    }
}

export const transferFromToken = async (
    tokenContract: BlockRacersToken & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    sender: AddressLike,
    spender: HardhatEthersSigner,
    value: BigNumberish,
) => {
    const approvalBefore = await approvalToken(tokenContract, sender, spender)

    const balanceSenderBefore = await balanceOfToken(tokenContract, sender)
    const balanceReceiverBefore = await balanceOfToken(tokenContract, spender)

    await tokenContract.connect(spender).transferFrom(sender, spender, value)

    await approvalToken(tokenContract, sender, spender, approvalBefore - BigInt(value))

    await balanceOfToken(tokenContract, sender, balanceSenderBefore - BigInt(value))
    await balanceOfToken(tokenContract, spender, balanceReceiverBefore + BigInt(value))

}

// Read
export const balanceOfToken = async (
    tokenContract: BlockRacersToken & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    account: AddressLike,
    expectedBalance?: BigNumberish,
) => {
    let accountBalance = await tokenContract.balanceOf(account)

    if (expectedBalance) {
        assert(accountBalance == expectedBalance, `Balance incorrect: Actual:${accountBalance} | Expected: ${expectedBalance}`)
    }

    return accountBalance;
}

export const approvalToken = async (
    tokenContract: BlockRacersToken & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    sender: AddressLike,
    spender: AddressLike,
    expectedValue?: BigNumberish,
) => {
    const approval = await tokenContract.allowance(sender, spender)

    if(expectedValue) {
        assert(approval == expectedValue, `Allowance incorrect: Actual:${approval} | Expected: ${expectedValue}`)
    }

    return approval
}

export const getPlayerNonce = async (
    tokenContract: BlockRacersToken & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    player: AddressLike,
    expected?: BigNumberish,
) => {
    const nonce = await tokenContract.getPlayerNonce(player);

    if (expected) {
        assert(BigInt(nonce) == expected, `Nonce incorrect: Actual:${nonce} | Expected: ${expected}`)
    }

    return nonce;
}

export const getIssuerAccount = async (
    tokenContract: BlockRacersToken & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    expected?: AddressLike,
) => {
    const issuerAccount = await tokenContract.issuerAccount();

    if (expected) {
        assert(issuerAccount == expected, `Issuer account incorrect: Actual:${issuerAccount} | Expected: ${expected}`)
    }

    return issuerAccount
}

export const createMintPermit = async (
    signer: HardhatEthersSigner,
    nonce: BigNumberish,
    account: AddressLike,
    value: BigNumberish
) => {
    const message = getBytes(solidityPackedKeccak256(
        ["uint256", "address", "uint256"],
        [nonce, account, toBeHex(value)]
    ))

    return await signer.signMessage(message)
}