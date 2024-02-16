import { ethers } from "hardhat";
import { getAccounts, sponsorRelayCall } from "./generalFunctions";
import {
  AddressLike,
  BigNumberish,
  ContractTransactionResponse,
  getBytes,
  solidityPackedKeccak256,
  toBeHex,
} from "ethers";
import { BlockRacersToken } from "../typechain-types";
import { assert, expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

export const deployTokenFixture = (initialAdminMint: BigNumberish = 0) => {
  return async function tokenFixture() {
    const { admin, issuerAccount, trustedForwarder } = await getAccounts();

    const blockRacersToken = await ethers.getContractFactory(
      "BlockRacersToken",
      admin,
    );
    const blockRacersTokenContract = await blockRacersToken.deploy(
      trustedForwarder,
      admin,
      issuerAccount,
      initialAdminMint,
    );
    await blockRacersTokenContract.waitForDeployment();

    return blockRacersTokenContract;
  };
};

export const setNewIssuerAccount = async (
  tokenContract: BlockRacersToken & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  owner: HardhatEthersSigner,
  account: AddressLike,
  relay: boolean = false,
) => {
  if (relay) {
    const { data } = await tokenContract
      .connect(owner)
      .setNewIssuerAccount.populateTransaction(account);

    await sponsorRelayCall(await tokenContract.getAddress(), owner, data);
  } else {
    await tokenContract.connect(owner).setNewIssuerAccount(account);
  }
};

export const setNewIssuerAccountWithEvents = async (
  tokenContract: BlockRacersToken & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  owner: HardhatEthersSigner,
  account: AddressLike,
  eventName: string,
  eventArgs: unknown[],
) => {
  await expect(
    await tokenContract.connect(owner).setNewIssuerAccount(account),
    `${eventName} Failed`,
  )
    .to.emit(tokenContract, eventName)
    .withArgs(...eventArgs);
};

export const setNewIssuerAccountWithErrors = async (
  tokenContract: BlockRacersToken & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  owner: HardhatEthersSigner,
  account: AddressLike,
  errorName: string,
  errorArgs: unknown[],
) => {
  await expect(
    tokenContract.connect(owner).setNewIssuerAccount(account),
    `${errorName} Failed`,
  )
    .to.be.revertedWithCustomError(tokenContract, errorName)
    .withArgs(...errorArgs);
};

export const mintWithPermit = async (
  tokenContract: BlockRacersToken & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  issuer: HardhatEthersSigner,
  account: AddressLike,
  value: BigNumberish,
  relay: boolean = false,
) => {
  const beforeMint = await balanceOfToken(tokenContract, account);
  const nonce = Date.now();
  const chainId = (await ethers.provider.getNetwork()).chainId;

  const permit = await createMintPermit(
    issuer, nonce, account, value, await tokenContract.getAddress(), chainId
  );
  if (relay) {
    const { data } = await tokenContract.mint.populateTransaction(
      account,
      value,
      nonce,
      permit,
    );

    await sponsorRelayCall(await tokenContract.getAddress(), issuer, data);
  } else {
    await tokenContract.mint(account, value, nonce, permit);
  }

  await balanceOfToken(tokenContract, account, beforeMint + BigInt(value));
};

export const setAllowanceToken = async (
  tokenContract: BlockRacersToken & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  sender: HardhatEthersSigner,
  spender: AddressLike,
  value: BigNumberish,
  expected?: BigNumberish,
  relay: boolean = false,
) => {
  if (relay) {
    const { data } = await tokenContract
      .connect(sender)
      .approve.populateTransaction(spender, value);

    await sponsorRelayCall(await tokenContract.getAddress(), sender, data);
  } else {
    await tokenContract.connect(sender).approve(spender, value);
  }

  if (expected) {
    await approvalToken(tokenContract, sender, spender, expected);
  }
};

export const transferFromToken = async (
  tokenContract: BlockRacersToken & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  sender: AddressLike,
  spender: HardhatEthersSigner,
  value: BigNumberish,
  relay: boolean = false,
) => {
  const approvalBefore = await approvalToken(tokenContract, sender, spender);

  const balanceSenderBefore = await balanceOfToken(tokenContract, sender);
  const balanceReceiverBefore = await balanceOfToken(tokenContract, spender);

  if (relay) {
    const { data } = await tokenContract
      .connect(spender)
      .transferFrom.populateTransaction(sender, spender, value);

    await sponsorRelayCall(await tokenContract.getAddress(), spender, data);
  } else {
    await tokenContract.connect(spender).transferFrom(sender, spender, value);
  }

  await approvalToken(
    tokenContract,
    sender,
    spender,
    approvalBefore - BigInt(value),
  );

  await balanceOfToken(
    tokenContract,
    sender,
    balanceSenderBefore - BigInt(value),
  );
  await balanceOfToken(
    tokenContract,
    spender,
    balanceReceiverBefore + BigInt(value),
  );
};

// Read
export const balanceOfToken = async (
  tokenContract: BlockRacersToken & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  account: AddressLike,
  expectedBalance?: BigNumberish,
) => {
  const accountBalance = await tokenContract.balanceOf(account);

  if (expectedBalance) {
    assert(
      accountBalance == expectedBalance,
      `Balance incorrect: Actual:${accountBalance} | Expected: ${expectedBalance}`,
    );
  }

  return accountBalance;
};

export const approvalToken = async (
  tokenContract: BlockRacersToken & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  sender: AddressLike,
  spender: AddressLike,
  expectedValue?: BigNumberish,
) => {
  const approval = await tokenContract.allowance(sender, spender);

  if (expectedValue) {
    assert(
      approval == expectedValue,
      `Allowance incorrect: Actual:${approval} | Expected: ${expectedValue}`,
    );
  }

  return approval;
};

export const getPlayerNonce = async (
  tokenContract: BlockRacersToken & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  player: AddressLike,
  expected?: BigNumberish,
) => {
  const nonce = await tokenContract.getPlayerNonce(player);

  if (expected) {
    assert(
      BigInt(nonce) == expected,
      `Nonce incorrect: Actual:${nonce} | Expected: ${expected}`,
    );
  }

  return nonce;
};

export const getIssuerAccount = async (
  tokenContract: BlockRacersToken & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  expected?: AddressLike,
) => {
  const issuerAccount = await tokenContract.issuerAccount();

  if (expected) {
    assert(
      issuerAccount == expected,
      `Issuer account incorrect: Actual:${issuerAccount} | Expected: ${expected}`,
    );
  }

  return issuerAccount;
};

export const createMintPermit = async (
  signer: HardhatEthersSigner,
  nonce: BigNumberish,
  account: AddressLike,
  value: BigNumberish,
  token: AddressLike,
  chainId: BigNumberish,
) => {
  const message = getBytes(
    solidityPackedKeccak256(
      ["address", "uint256", "uint256", "address", "uint256"],
      [account, toBeHex(value), nonce, token, chainId],
    ),
  );

  return await signer.signMessage(message);
};
