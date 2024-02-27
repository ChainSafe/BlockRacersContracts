import { ethers } from "hardhat";
import { getAccounts } from "./generalFunctions";
import {
  AddressLike,
  BigNumberish,
  ContractTransactionResponse,
  getBytes,
  solidityPackedKeccak256,
  ZeroAddress,
} from "ethers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { deployTokenFixture } from "./BlockGameToken.contract";
import { BlockGameWagering } from "../typechain-types";
import { assert, expect } from "chai";

export enum WagerState {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  NOT_STARTED = 0,
  CREATED = 1,
  ACCEPTED = 2,
  COMPLETED = 3,
  CANCELLED = 4,
}

export const deployWageringFixture = (erc20TokenAddress?: AddressLike) => {
  return async function wageringFixture() {
    const { admin, trustedForwarder, server } = await getAccounts();

    if (!erc20TokenAddress) {
      erc20TokenAddress = (await deployTokenFixture()()).getAddress();
    }

    const blockGameWagering = await ethers.getContractFactory(
      "BlockGameWagering",
      admin,
    );
    const blockGameWageringContract = await blockGameWagering.deploy(
      trustedForwarder,
      admin,
      erc20TokenAddress,
      server,
    );

    await blockGameWageringContract.waitForDeployment();
    return blockGameWageringContract;
  };
};

export const startWager = async (
  wageringContract: BlockGameWagering & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  creator: HardhatEthersSigner,
  opponent: HardhatEthersSigner,
  prize: BigNumberish,
) => {
  const nonce = Date.now();
  const deadline = BigInt(Date.now()) / 1000n + 1000n;
  const chainId = (await ethers.provider.getNetwork()).chainId;
  const opponentSig = createOpponentSig(
    creator.address,
    opponent,
    prize,
    nonce,
    deadline,
    await wageringContract.getAddress(),
    chainId,
  );
  return wageringContract.connect(creator).startWager(opponent.address, prize, nonce, deadline, opponentSig);
};

export const startWagerWithEvent = async (
  wageringContract: BlockGameWagering & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  creator: HardhatEthersSigner,
  opponent: HardhatEthersSigner,
  prize: BigNumberish,
  eventName: string,
  eventArgs: unknown[],
) => {
  await expect(startWager(wageringContract, creator, opponent, prize))
    .to.emit(wageringContract, eventName)
    .withArgs(...eventArgs);
};

export const startWagerDefaultWithError = async (
  wageringContract: BlockGameWagering & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  creator: HardhatEthersSigner,
  opponent: HardhatEthersSigner,
  prize: BigNumberish,
  errorName: string,
  errorArgs: unknown[],
) => {
  await expect(startWager(wageringContract, creator, opponent, prize))
    .to.be.revertedWithCustomError(wageringContract, errorName)
    .withArgs(...errorArgs);
};

export const startWagerWithError = async (
  wageringContract: BlockGameWagering & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  creator: HardhatEthersSigner,
  opponent: HardhatEthersSigner,
  prize: BigNumberish,
  nonce: BigNumberish,
  deadline: BigNumberish,
  chainId: BigNumberish,
  errorName: string,
  errorArgs: unknown[],
) => {
  const opponentSig = createOpponentSig(
    creator.address,
    opponent,
    prize,
    nonce,
    deadline,
    await wageringContract.getAddress(),
    chainId,
  );
  await expect(wageringContract.connect(creator).startWager(opponent.address, prize, nonce, deadline, opponentSig))
    .to.be.revertedWithCustomError(wageringContract, errorName)
    .withArgs(...errorArgs);
};

export const cancelWager = async (
  wageringContract: BlockGameWagering & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  creator: HardhatEthersSigner,
  opponent: HardhatEthersSigner,
  prize: BigNumberish,
) => {
  const { server } = await getAccounts();
  const nonce = Date.now();
  const deadline = BigInt(Date.now()) / 1000n + 1000n;
  const chainId = (await ethers.provider.getNetwork()).chainId;
  const serverSig = createServerSigCancel(
    server,
    creator.address,
    opponent.address,
    prize,
    nonce,
    deadline,
    await wageringContract.getAddress(),
    chainId,
  );
  return wageringContract.connect(creator).cancelWager(nonce, deadline, serverSig);
};

export const cancelWagerWithEvent = async (
  wageringContract: BlockGameWagering & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  creator: HardhatEthersSigner,
  opponent: HardhatEthersSigner,
  prize: BigNumberish,
  eventName: string,
  eventArgs: unknown[],
) => {
  await expect(cancelWager(wageringContract, creator, opponent, prize))
    .to.emit(wageringContract, eventName)
    .withArgs(...eventArgs);
};

export const cancelWagerWithError = async (
  wageringContract: BlockGameWagering & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  creator: HardhatEthersSigner,
  opponent: HardhatEthersSigner,
  prize: BigNumberish,
  nonce: BigNumberish,
  deadline: BigNumberish,
  chainId: BigNumberish,
  errorName: string,
  errorArgs: unknown[],
) => {
  const { server } = await getAccounts();
  const serverSig = createServerSigCancel(
    server,
    creator.address,
    opponent.address,
    prize,
    nonce,
    deadline,
    await wageringContract.getAddress(),
    chainId,
  );
  await expect(wageringContract.connect(creator).cancelWager(nonce, deadline, serverSig))
    .to.be.revertedWithCustomError(wageringContract, errorName)
    .withArgs(...errorArgs);
};

export const completeWager = async (
  wageringContract: BlockGameWagering & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  winner: HardhatEthersSigner,
  opponent: HardhatEthersSigner,
  prize: BigNumberish,
) => {
  const { server } = await getAccounts();
  const nonce = Date.now();
  const deadline = BigInt(Date.now()) / 1000n + 1000n;
  const chainId = (await ethers.provider.getNetwork()).chainId;
  const serverSig = createServerSigWin(
    server,
    winner.address,
    opponent.address,
    prize,
    nonce,
    deadline,
    await wageringContract.getAddress(),
    chainId,
  );
  return wageringContract.connect(winner).completeWager(nonce, deadline, serverSig);
};

export const completeWagerWithEvent = async (
  wageringContract: BlockGameWagering & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  winner: HardhatEthersSigner,
  opponent: HardhatEthersSigner,
  prize: BigNumberish,
  eventName: string,
  eventArgs: unknown[],
) => {
  await expect(completeWager(wageringContract, winner, opponent, prize))
    .to.emit(wageringContract, eventName)
    .withArgs(...eventArgs);
};

export const completeWagerWithError = async (
  wageringContract: BlockGameWagering & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  winner: HardhatEthersSigner,
  opponent: HardhatEthersSigner,
  prize: BigNumberish,
  nonce: BigNumberish,
  deadline: BigNumberish,
  chainId: BigNumberish,
  errorName: string,
  errorArgs: unknown[],
) => {
  const { server } = await getAccounts();
  const serverSig = createServerSigWin(
    server,
    winner.address,
    opponent.address,
    prize,
    nonce,
    deadline,
    await wageringContract.getAddress(),
    chainId,
  );
  await expect(wageringContract.connect(winner).completeWager(nonce, deadline, serverSig))
    .to.be.revertedWithCustomError(wageringContract, errorName)
    .withArgs(...errorArgs);
};

export const getTokenAddressWagering = async (
  wageringContract: BlockGameWagering & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  expected?: AddressLike,
) => {
  const tokenAddress = await wageringContract.TOKEN();

  if (expected)
    assert(
      tokenAddress == expected,
      `Token Address incorrect. Actual: ${tokenAddress} | Expected: ${expected}`,
    );

  return tokenAddress;
};

export const getPlayersWagers = async (
  wageringContract: BlockGameWagering & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  player: AddressLike,
  expected?: unknown[],
) => {
  const playersWagers = await wageringContract.getWager(player);
  if (expected) {
    assert.deepEqual(playersWagers, expected);
  }
  return playersWagers;
};

export const createOpponentSig = async (
  sender: AddressLike,
  opponent: HardhatEthersSigner,
  prize: BigNumberish,
  nonce: BigNumberish,
  deadline: AddressLike,
  contract: AddressLike,
  chainId: BigNumberish,
) => {
  const message = getBytes(
    solidityPackedKeccak256(
      ["address", "uint256", "uint256", "uint256", "address", "uint256"],
      [sender, prize, nonce, deadline, contract, chainId],
    ),
  );

  return await opponent.signMessage(message);
};

export const createServerSigCancel = async (
  server: HardhatEthersSigner,
  creator: AddressLike,
  opponent: AddressLike,
  prize: BigNumberish,
  nonce: BigNumberish,
  deadline: AddressLike,
  contract: AddressLike,
  chainId: BigNumberish,
) => {
  const message = getBytes(
    solidityPackedKeccak256(
      ["bool", "address", "address", "uint256", "uint256", "uint256", "address", "uint256"],
      [false, creator, opponent, prize, nonce, deadline, contract, chainId],
    ),
  );

  return await server.signMessage(message);
};

export const createServerSigWin = async (
  server: HardhatEthersSigner,
  winner: AddressLike,
  opponent: AddressLike,
  prize: BigNumberish,
  nonce: BigNumberish,
  deadline: AddressLike,
  contract: AddressLike,
  chainId: BigNumberish,
) => {
  const message = getBytes(
    solidityPackedKeccak256(
      ["bool", "address", "address", "uint256", "uint256", "uint256", "address", "uint256"],
      [true, winner, opponent, prize, nonce, deadline, contract, chainId],
    ),
  );

  return await server.signMessage(message);
};
