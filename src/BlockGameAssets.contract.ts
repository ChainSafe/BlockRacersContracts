import { setBalance } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { getAccounts, sponsorRelayCall } from "./generalFunctions";
import { generalSettings } from "../scripts/defaultSettings";
import { deployTokenFixture } from "./BlockGameToken.contract";
import { assert, expect } from "chai";
import {
  AddressLike,
  BigNumberish,
  ContractTransactionResponse,
  ZeroHash,
} from "ethers";
import { BlockGameAssets } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

export const deployAssetsFixture = async () => {
  const { admin, trustedForwarder, feeAccount } = await getAccounts();

  const blockGame = await ethers.getContractFactory(
    "BlockGame",
    admin,
  );

  const erc20TokenAddress = (await deployTokenFixture()()).getAddress();
  const blockGameContract = await blockGame.deploy(
    trustedForwarder,
    admin,
    erc20TokenAddress,
    feeAccount,
    generalSettings.NFT.baseUri,
    [[55, 45, 30], [0], [0], [0]],
  );
  await blockGameContract.waitForDeployment();
  await setBalance(await blockGameContract.getAddress(), ethers.parseEther('100'));

  const blockGameAssetsContract = await ethers.getContractAt("BlockGameAssets", await blockGameContract.ASSETS());

  return { blockGameAssetsContract, blockGameContract };
};

export const mintNft = async (
  assetsContract: BlockGameAssets & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  receiver: AddressLike,
  id: BigNumberish,
  relay: boolean = false,
) => {
  const { admin, issuerAccount } = await getAccounts();
  const BLOCK_GAME = await assetsContract.BLOCK_GAME();

  const before = await balanceOfNft(assetsContract, receiver, id);

  const mockGame = await ethers.getImpersonatedSigner(BLOCK_GAME);

  if (relay) {
    const { data } = await assetsContract
      .mint.populateTransaction(receiver);

    await sponsorRelayCall(
      await assetsContract.getAddress(),
      mockGame,
      data,
    );
  } else {
    await assetsContract.connect(mockGame).mint(receiver);
  }

  await balanceOfNft(assetsContract, receiver, id, 1n + before);
};

export const mintNftWithError = async (
  assetsContract: BlockGameAssets & {
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
  assetsContract: BlockGameAssets & {
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
  assetsContract: BlockGameAssets & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  from: HardhatEthersSigner,
  to: AddressLike,
  id: BigNumberish,
  value: BigNumberish,
  relay: boolean = false,
) => {
  if (relay) {
    const { data } = await assetsContract
      .connect(from)
      .safeTransferFrom.populateTransaction(
        from,
        to,
        id,
        value,
        ZeroHash,
      );

    await sponsorRelayCall(await assetsContract.getAddress(), from, data);
  } else {
    await assetsContract
      .connect(from)
      .safeTransferFrom(from, to, id, value, ZeroHash);
  }
};

// Read
export const balanceOfNft = async (
  assetsContract: BlockGameAssets & {
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
  assetsContract: BlockGameAssets & {
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
  assetsContract: BlockGameAssets & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  nftId: BigNumberish,
  expected?: string,
) => {
  const uri = await assetsContract.uri(nftId);

  if (expected) {
    assert.equal(uri, expected,
      `Uri incorrect: Actual:${uri} | Expected: ${expected}`,
    );
  }

  return uri;
};

export const getInventory = async (
  assetsContract: BlockGameAssets & {
    deploymentTransaction(): ContractTransactionResponse;
  },
  account: AddressLike,
  expected?: BigNumberish[],
) => {
  const inventory = await assetsContract.getInventory(account);

  if (expected) {
    assert.deepEqual(inventory, expected);
  }

  return inventory;
};
