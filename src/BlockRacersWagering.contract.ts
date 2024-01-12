import { ethers } from "hardhat";
import { getAccounts } from "./generalFunctions";
import { AddressLike, BigNumberish, ContractTransactionResponse, ZeroAddress, keccak256, toUtf8Bytes } from "ethers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { deployTokenFixture } from "./BlockRacersToken.contract";
import { BlockRacersWagering } from "../typechain-types";
import { assert, expect } from "chai";

export enum CarTypeOption {
    FIRST = 0,
    SECOND = 1,
    THIRD = 2
}

export enum WagerState { 
    NOT_STARTED = 0, 
    CREATED = 1, 
    ACCEPTED = 2, 
    COMPLETED = 3, 
    CANCELLED = 4
}

export const deployWageringFixture = (
    erc20TokenAddress?: AddressLike
) => {
    return async function wageringFixture() {
        const {
            admin,
            trustedForwarder,
        } = await getAccounts()
    
        if(!erc20TokenAddress) {
            erc20TokenAddress = (await (deployTokenFixture())()).getAddress();
        }
    
        const BlockRacersWagering = await ethers.getContractFactory("BlockRacersWagering", admin);
        const BlockRacersWageringContract = await BlockRacersWagering.deploy(
            trustedForwarder, 
            admin,
            erc20TokenAddress,
        );
    
        await BlockRacersWageringContract.waitForDeployment();
        return BlockRacersWageringContract;
    }
}

export const createWager = async (
    wageringContract: BlockRacersWagering & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    creator: HardhatEthersSigner,
    prize: BigNumberish,
    expectedWagerState?: BlockRacersWagering.WagerStruct
) => {
    if (expectedWagerState) {
        const latestWagerId = await getLatestWagerId(wageringContract)
        const curentState = await getWager(wageringContract, latestWagerId + BigInt(1))
        assert(curentState.prize == BigInt(0), `Pre-create wager prize incorrect. Actual: ${curentState.prize} | Expected: ${0}`)
        assert(curentState.creator == ZeroAddress, `Pre-create wager creator incorrect. Actual: ${curentState.creator} | Expected: ${ZeroAddress}`)
        assert(curentState.opponent == ZeroAddress, `Pre-create wager opponent incorrect. Actual: ${curentState.opponent} | Expected: ${ZeroAddress}`)
        assert(curentState.winner == ZeroAddress, `Pre-create wager winner incorrect. Actual: ${curentState.winner} | Expected: ${ZeroAddress}`)
        assert(curentState.state == BigInt(WagerState.NOT_STARTED), `Pre-create wager state incorrect. Actual: ${curentState.state} | Expected: ${WagerState.NOT_STARTED}`)
    }
        
    await wageringContract.connect(creator).createWager(prize);

    if (expectedWagerState) {
        const latestWagerId = await getLatestWagerId(wageringContract)

        const curentState = await getWager(wageringContract, latestWagerId)
        assert(curentState.prize == expectedWagerState.prize, `Post-create wager prize incorrect. Actual: ${curentState.prize} | Expected: ${expectedWagerState.prize}`)
        assert(curentState.creator == expectedWagerState.creator, `Post-create wager creator incorrect. Actual: ${curentState.creator} | Expected: ${expectedWagerState.creator}`)
        assert(curentState.opponent == expectedWagerState.opponent, `Post-create wager opponent incorrect. Actual: ${curentState.opponent} | Expected: ${expectedWagerState.opponent}`)
        assert(curentState.winner == expectedWagerState.winner, `Post-create wager winner incorrect. Actual: ${curentState.winner} | Expected: ${expectedWagerState.winner}`)
        assert(curentState.state == expectedWagerState.state, `Post-create wager state incorrect. Actual: ${curentState.state} | Expected: ${expectedWagerState.state}`)
    }
}

export const createWagerWithEvent = async (
    wageringContract: BlockRacersWagering & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    creator: HardhatEthersSigner,
    prize: BigNumberish,
    eventName: string,
    eventArgs: any[]
) => {
    await expect(await wageringContract.connect(creator).createWager(prize), `${eventName} Failed`)
        .to.emit(wageringContract, eventName)
        .withArgs(...eventArgs)
}

export const createWagerWithError = async (
    wageringContract: BlockRacersWagering & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    creator: HardhatEthersSigner,
    prize: BigNumberish,
    errorName: string,
    errorArgs: any[]
) => {
    await expect(wageringContract.connect(creator).createWager(prize), `${errorName} Failed`)
        .to.be.revertedWithCustomError(wageringContract, errorName).withArgs(...errorArgs)
}

export const acceptWager = async (
    wageringContract: BlockRacersWagering & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    opponent: HardhatEthersSigner,
    wagerId: BigNumberish,
    expectedWagerState?: BlockRacersWagering.WagerStruct
) => {
    if (expectedWagerState) {
        const currentState = await getWager(wageringContract, wagerId)
        assert(currentState.prize == expectedWagerState.prize, `Pre-accept wager prize incorrect. Actual: ${currentState.prize} | Expected: ${expectedWagerState.prize}`)
        assert(currentState.creator == expectedWagerState.creator, `Pre-accept wager creator incorrect. Actual: ${currentState.creator} | Expected: ${expectedWagerState.creator}`)
        assert(currentState.opponent != expectedWagerState.opponent, `Pre-accept wager opponent incorrect. Actual: ${currentState.opponent} | Expected: ${expectedWagerState.opponent}`)
        assert(currentState.winner == expectedWagerState.winner, `Pre-accept wager winner incorrect. Actual: ${currentState.winner} | Expected: ${expectedWagerState.winner}`)
        assert(currentState.state == BigInt(WagerState.CREATED), `Pre-accept wager state incorrect. Actual: ${currentState.state} | Expected: ${expectedWagerState.state}`)
    }

    await wageringContract.connect(opponent).acceptWager(wagerId);

    if (expectedWagerState) {
        const currentState = await getWager(wageringContract, wagerId)
        assert(currentState.prize == expectedWagerState.prize, `Post-accept wager prize incorrect. Actual: ${currentState.prize} | Expected: ${expectedWagerState.prize}`)
        assert(currentState.creator == expectedWagerState.creator, `Post-accept wager creator incorrect. Actual: ${currentState.creator} | Expected: ${expectedWagerState.creator}`)
        assert(currentState.opponent == expectedWagerState.opponent, `Post-accept wager opponent incorrect. Actual: ${currentState.opponent} | Expected: ${expectedWagerState.opponent}`)
        assert(currentState.winner == expectedWagerState.winner, `Post-accept wager winner incorrect. Actual: ${currentState.winner} | Expected: ${expectedWagerState.winner}`)
        assert(currentState.state == expectedWagerState.state, `Post-accept wager state incorrect. Actual: ${currentState.state} | Expected: ${expectedWagerState.state}`)
    }
}

export const acceptWagerWithEvent = async (
    wageringContract: BlockRacersWagering & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    opponent: HardhatEthersSigner,
    wagerId: BigNumberish,
    eventName: string,
    eventArgs: any[]
) => {
    await expect(await wageringContract.connect(opponent).acceptWager(wagerId), `${eventName} Failed`)
        .to.emit(wageringContract, eventName)
        .withArgs(...eventArgs)
}

export const acceptWagerWithError = async (
    wageringContract: BlockRacersWagering & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    opponent: HardhatEthersSigner,
    wagerId: BigNumberish,
    errorName: string,
    errorArgs: any[]
) => {
    await expect(wageringContract.connect(opponent).acceptWager(wagerId), `${errorName} Failed`)
        .to.be.revertedWithCustomError(wageringContract, errorName).withArgs(...errorArgs)
}

export const cancelWager = async (
    wageringContract: BlockRacersWagering & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    canceller: HardhatEthersSigner,
    wagerId: BigNumberish,
    expectedWagerState?: BlockRacersWagering.WagerStruct
) => {
    const currentState = await getWager(wageringContract, wagerId)

    assert(canceller.address == currentState.creator || canceller.address == currentState.opponent, `Only participants can cancel. Creator: ${currentState.creator} | Opponent: ${currentState.opponent} | Canceller: ${canceller}`)

    await wageringContract.connect(canceller).cancelWager(wagerId);
    
    if (expectedWagerState) {
        const currentState = await getWager(wageringContract, wagerId)
        assert(currentState.prize == expectedWagerState.prize, `Post-cancel wager prize incorrect. Actual: ${currentState.prize} | Expected: ${expectedWagerState.prize}`)
        assert(currentState.creator == expectedWagerState.creator, `Post-cancel wager creator incorrect. Actual: ${currentState.creator} | Expected: ${expectedWagerState.creator}`)
        assert(currentState.opponent == expectedWagerState.opponent, `Post-cancel wager opponent incorrect. Actual: ${currentState.opponent} | Expected: ${expectedWagerState.opponent}`)
        assert(currentState.winner == expectedWagerState.winner, `Post-cancel wager winner incorrect. Actual: ${currentState.winner} | Expected: ${expectedWagerState.winner}`)
        assert(currentState.state == expectedWagerState.state, `Post-cancel wager state incorrect. Actual: ${currentState.state} | Expected: ${expectedWagerState.state}`)
    }
}

export const cancelWagerWithEvent = async (
    wageringContract: BlockRacersWagering & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    canceller: HardhatEthersSigner,
    wagerId: BigNumberish,
    eventName: string,
    eventArgs: any[]
) => {
    await expect(await wageringContract.connect(canceller).cancelWager(wagerId), `${eventName} Failed`)
        .to.emit(wageringContract, eventName)
        .withArgs(...eventArgs)
}

export const cancelWagerWithError = async (
    wageringContract: BlockRacersWagering & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    canceller: HardhatEthersSigner,
    wagerId: BigNumberish,
    errorName: string,
    errorArgs: any[]
) => {
    await expect(wageringContract.connect(canceller).cancelWager(wagerId), `${errorName} Failed`)
        .to.be.revertedWithCustomError(wageringContract, errorName).withArgs(...errorArgs)
}

export const completeWager = async (
    wageringContract: BlockRacersWagering & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    submitter: HardhatEthersSigner,
    winner: AddressLike,
    wagerId: BigNumberish,
    creatorProof: string,
    opponentProof: string,
    expectedWagerState?: BlockRacersWagering.WagerStruct
) => {
    let currentState = await getWager(wageringContract, wagerId)

    assert(currentState.state === BigInt(WagerState.ACCEPTED), `Wager not ready to complete. State: ${currentState.state}`)

    await wageringContract.connect(submitter).completeWager(wagerId, winner, creatorProof, opponentProof);
    
    currentState = await getWager(wageringContract, wagerId)

    assert(currentState.state === BigInt(WagerState.COMPLETED), `Wager completed. State: ${currentState.state}`)
    assert(currentState.winner === winner, `Winner not updated correctly. Winner: ${currentState.winner}`)

    if (expectedWagerState) {
        const currentState = await getWager(wageringContract, wagerId)
        assert(currentState.prize == expectedWagerState.prize, `Post-complete wager prize incorrect. Actual: ${currentState.prize} | Expected: ${expectedWagerState.prize}`)
        assert(currentState.creator == expectedWagerState.creator, `Post-complete wager creator incorrect. Actual: ${currentState.creator} | Expected: ${expectedWagerState.creator}`)
        assert(currentState.opponent == expectedWagerState.opponent, `Post-complete wager opponent incorrect. Actual: ${currentState.opponent} | Expected: ${expectedWagerState.opponent}`)
        assert(currentState.winner == expectedWagerState.winner, `Post-complete wager winner incorrect. Actual: ${currentState.winner} | Expected: ${expectedWagerState.winner}`)
        assert(currentState.state == expectedWagerState.state, `Post-complete wager state incorrect. Actual: ${currentState.state} | Expected: ${expectedWagerState.state}`)
    }
}

export const completeWagerWithEvent = async (
    wageringContract: BlockRacersWagering & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    submitter: HardhatEthersSigner,
    winner: AddressLike,
    wagerId: BigNumberish,
    creatorProof: string,
    opponentProof: string,
    eventName: string,
    eventArgs: any[]
) => {
    await expect(await wageringContract.connect(submitter).completeWager(wagerId, winner, creatorProof, opponentProof), `${eventName} Failed`)
        .to.emit(wageringContract, eventName)
        .withArgs(...eventArgs)
}

export const completeWagerWithError = async (
    wageringContract: BlockRacersWagering & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    submitter: HardhatEthersSigner,
    winner: AddressLike,
    wagerId: BigNumberish,
    creatorProof: string,
    opponentProof: string,
    errorName: string,
    errorArgs: any[]
) => {
    await expect(wageringContract.connect(submitter).completeWager(wagerId, winner, creatorProof, opponentProof), `${errorName} Failed`)
        .to.be.revertedWithCustomError(wageringContract, errorName).withArgs(...errorArgs)
}

export const adminCancelWager = async (
    wageringContract: BlockRacersWagering & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    admin: HardhatEthersSigner,
    wagerId: BigNumberish,
    expectedWagerState?: BlockRacersWagering.WagerStruct
) => {
    await wageringContract.connect(admin).adminCancelWager(wagerId);
    
    if (expectedWagerState) {
        const currentState = await getWager(wageringContract, wagerId)
        assert(currentState.prize == expectedWagerState.prize, `Post-cancel wager prize incorrect. Actual: ${currentState.prize} | Expected: ${expectedWagerState.prize}`)
        assert(currentState.creator == expectedWagerState.creator, `Post-cancel wager creator incorrect. Actual: ${currentState.creator} | Expected: ${expectedWagerState.creator}`)
        assert(currentState.opponent == expectedWagerState.opponent, `Post-cancel wager opponent incorrect. Actual: ${currentState.opponent} | Expected: ${expectedWagerState.opponent}`)
        assert(currentState.winner == expectedWagerState.winner, `Post-cancel wager winner incorrect. Actual: ${currentState.winner} | Expected: ${expectedWagerState.winner}`)
        assert(currentState.state == expectedWagerState.state, `Post-cancel wager state incorrect. Actual: ${currentState.state} | Expected: ${expectedWagerState.state}`)
    }
}

// Read functions
export const getWager = async (
    wageringContract: BlockRacersWagering & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    wagerId: BigNumberish,
    expectedWagerState?: BlockRacersWagering.WagerStruct
) => {
    const wager = await wageringContract.getWager(wagerId);

    if (expectedWagerState) {
        assert(wager.prize == expectedWagerState.prize, `Wager prize incorrect. Actual: ${wager.prize} | Expected: ${expectedWagerState.prize}`)
        assert(wager.creator == expectedWagerState.creator, `Wager creator incorrect. Actual: ${wager.creator} | Expected: ${expectedWagerState.creator}`)
        assert(wager.opponent == expectedWagerState.opponent, `Wager opponent incorrect. Actual: ${wager.opponent} | Expected: ${expectedWagerState.opponent}`)
        assert(wager.winner == expectedWagerState.winner, `Wager winner incorrect. Actual: ${wager.winner} | Expected: ${expectedWagerState.winner}`)
        assert(wager.state == expectedWagerState.state, `Wager state incorrect. Actual: ${wager.state} | Expected: ${expectedWagerState.state}`)
    }
    return wager
}

export const getTokenAddressWagering = async (
    wageringContract: BlockRacersWagering & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    expected?: AddressLike
) => {
    const tokenAddress = await wageringContract.token();

    if(expected) 
        assert(tokenAddress == expected, `Token Address incorrect. Actual: ${tokenAddress} | Expected: ${expected}`)

    return tokenAddress;
}

export const getPlayersWagers = async (
    wageringContract: BlockRacersWagering & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    player: AddressLike,
    expected?: BigNumberish[]
) => {
    const playersWagers = await wageringContract.getPlayersWagers(player);
    if (expected) {
        assert(playersWagers.length == expected.length, `Players wagers incorrect. Actual: ${playersWagers.length} | Expected: ${expected.length}`)
    }
    return playersWagers
}

export const getLatestWagerId = async (
    wageringContract: BlockRacersWagering & {
        deploymentTransaction(): ContractTransactionResponse;
    },
    expected?: BigNumberish
) => {
    const latestID = await wageringContract.latestWagerId();
    if (expected) {
        assert(latestID == expected, `Latest ID incorrect. Actual: ${latestID} | Expected: ${expected}`)
    }
    return latestID
}

export const createWagerCompleteProof = async (signer: HardhatEthersSigner, wagerId: BigNumberish, winnerAddress: AddressLike) => {
    const messageHash = keccak256(toUtf8Bytes(`${wagerId}-${winnerAddress}`));
    return await signer.signMessage(messageHash);
}