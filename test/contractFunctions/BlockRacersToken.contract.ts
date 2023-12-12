import { ethers } from "hardhat";
import { getAccounts } from "./generalFunctions";
import { AddressLike, BigNumberish, ContractTransactionResponse } from "ethers";
import { BlockRacersToken } from "../../typechain-types";
import { assert } from "chai";
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
            issuerAccount,
            initialAdminMint
            );
        await BlockRacersTokenContract.waitForDeployment()
        
        return BlockRacersTokenContract;
    }
}

export const testnetMint = async (
    tokenContract: BlockRacersToken & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    account: AddressLike,
    expectedBalance: BigNumberish,
) => {
    await balanceOfToken(tokenContract, account, 0);
    await tokenContract["mint(address,uint256)"](account, expectedBalance);
    await balanceOfToken(tokenContract, account, expectedBalance);
}

export const setAllowanceToken = async (
    tokenContract: BlockRacersToken & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    sender: HardhatEthersSigner,
    spender: AddressLike,
    expected: BigNumberish,
) => {
    await approvalToken(tokenContract, sender, spender, 0)

    await tokenContract.connect(sender).approve(spender, expected);

    await approvalToken(tokenContract, sender, spender, expected)
}

export const transferFromToken = async (
    tokenContract: BlockRacersToken & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    sender: AddressLike,
    spender: HardhatEthersSigner,
    value: BigNumberish,
) => {
    await approvalToken(tokenContract, sender, spender, value)

    await balanceOfToken(tokenContract, sender, value)
    await balanceOfToken(tokenContract, spender, 0)

    await tokenContract.connect(spender).transferFrom(sender, spender, value)

    await approvalToken(tokenContract, sender, spender, 0)

    await balanceOfToken(tokenContract, sender, 0)
    await balanceOfToken(tokenContract, spender, value)

}

export const balanceOfToken = async (
    tokenContract: BlockRacersToken & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    account: AddressLike,
    expectedBalance: BigNumberish,
) => {
    let accountBalance = await tokenContract.balanceOf(account)

    assert(accountBalance == expectedBalance, `Balance incorrect: Actual:${accountBalance} | Expected: ${expectedBalance}`)
}

export const approvalToken = async (
    tokenContract: BlockRacersToken & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    sender: AddressLike,
    spender: AddressLike,
    expected: BigNumberish,
) => {
    const approval = await tokenContract.allowance(sender, spender)

    assert(approval == expected, "Approval invalid")
}