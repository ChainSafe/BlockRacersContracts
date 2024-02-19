import { setBalance } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { getAccounts, sponsorRelayCall } from "./generalFunctions";
import { generalSettings } from "../scripts/defaultSettings";
import { deployTokenFixture } from "./BlockRacersToken.contract";
import { assert, expect } from "chai";
import {
  AddressLike,
  BigNumberish,
  ContractTransactionResponse,
  ZeroHash,
} from "ethers";
import { BlockRacersAssets } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

export const deployAssetsFixture = async () => {
  const { admin, trustedForwarder, feeAccount } = await getAccounts();

  const blockRacers = await ethers.getContractFactory(
    "BlockRacers",
    admin,
  );

  const erc20TokenAddress = (await deployTokenFixture()()).getAddress();
  const blockRacersContract = await blockRacers.deploy(
    trustedForwarder,
    admin,
    erc20TokenAddress,
    feeAccount,
    generalSettings.NFT.baseUri,
    [[55, 45, 30], [0], [0], [0]],
  );
  await blockRacersContract.waitForDeployment();
  await setBalance(await blockRacersContract.getAddress(), ethers.parseEther('100'));

  const blockRacersAssetsContract = await ethers.getContractAt("BlockRacersAssets", await blockRacersContract.ASSETS());

  return { blockRacersAssetsContract, blockRacersContract };
};

export const mintNft = async (
  assetsContract: BlockRacersAssets & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  receiver: AddressLike,
  id: BigNumberish,
  relay: boolean = false,
) => {
  const { admin, issuerAccount } = await getAccounts();
  const BLOCK_RACERS = await assetsContract.BLOCK_RACERS();

  const before = await balanceOfNft(assetsContract, receiver, id);

  const mockRacers = await ethers.getImpersonatedSigner(BLOCK_RACERS);

  if (relay) {
    const { data } = await assetsContract
      .mint.populateTransaction(receiver);

    await sponsorRelayCall(
      await assetsContract.getAddress(),
      mockRacers,
      data,
    );
  } else {
    await assetsContract.connect(mockRacers).mint(receiver);
  }

  await balanceOfNft(assetsContract, receiver, id, 1n + before);
};

export const mintNftWithError = async (
  assetsContract: BlockRacersAssets & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  receiver: AddressLike,
  id: BigNumberish,
  errorName: string,
  errorArgs: unknown[],
) => {
  const { issuerAccount } = await getAccounts();

  await expect(
    assetsContract.connect(issuerAccount).mint(receiver),
    `${errorName} Failed`,
  )
    .to.be.revertedWithCustomError(assetsContract, errorName)
    .withArgs(...errorArgs);
};

export const setApprovalForAll = async (
  assetsContract: BlockRacersAssets & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  from: HardhatEthersSigner,
  operator: AddressLike,
  authorized: boolean,
  relay: boolean = false,
) => {
  await isApprovedForAll(assetsContract, from, operator, !authorized);

  if (relay) {
    const { data } = await assetsContract
      .connect(from)
      .setApprovalForAll.populateTransaction(operator, authorized);

    await sponsorRelayCall(await assetsContract.getAddress(), from, data);
  } else {
    await assetsContract.connect(from).setApprovalForAll(operator, authorized);
  }

  await isApprovedForAll(assetsContract, from, operator, authorized);
};

export const safeTransferFrom = async (
  assetsContract: BlockRacersAssets & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  from: HardhatEthersSigner,
  operator: HardhatEthersSigner,
  id: BigNumberish,
  value: BigNumberish,
  relay: boolean = false,
) => {
  await isApprovedForAll(assetsContract, from, operator, true);
  if (relay) {
    const { data } = await assetsContract
      .connect(operator)
      .safeTransferFrom.populateTransaction(
        from,
        operator,
        id,
        value,
        ZeroHash,
      );

    await sponsorRelayCall(await assetsContract.getAddress(), from, data);
  } else {
    await assetsContract
      .connect(operator)
      .safeTransferFrom(from, operator, id, value, ZeroHash);
  }
};

// Read
export const balanceOfNft = async (
  assetsContract: BlockRacersAssets & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  account: AddressLike,
  nftId: BigNumberish,
  expectedBalance?: BigNumberish,
) => {
  const balanceOf = await assetsContract.balanceOf(account, nftId);

  if (expectedBalance) {
    assert(
      balanceOf == expectedBalance,
      `Balance incorrect: Actual:${balanceOf} | Expected: ${expectedBalance}`,
    );
  }

  return balanceOf;
};

export const isApprovedForAll = async (
  assetsContract: BlockRacersAssets & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  sender: AddressLike,
  operator: AddressLike,
  expected: boolean,
) => {
  const isApprovedForAll = await assetsContract.isApprovedForAll(
    sender,
    operator,
  );

  assert(isApprovedForAll == expected, "approval not set correctly");

  return isApprovedForAll;
};

export const getUri = async (
  assetsContract: BlockRacersAssets & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  nftId: BigNumberish,
  expected?: string,
) => {
  const uri = await assetsContract.uri(nftId);

  if (expected) {
    assert(
      uri == expected,
      `Uri incorrect: Actual:${uri} | Expected: ${expected}`,
    );
  }

  return uri;
};
