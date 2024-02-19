import { ethers } from "hardhat";
import {
  deployTokenFixture,
  mintWithPermit,
} from "./BlockRacersToken.contract";
import { deployAssetsFixture } from "./BlockRacersAssets.contract";
import { deployWageringFixture } from "./BlockRacersWagering.contract";
import { deployCoreFixture } from "./BlockRacers.contract";
import { AddressLike, parseUnits } from "ethers";
import { ERC2771Context } from "../typechain-types/@openzeppelin/contracts/metatx/ERC2771Context";
import { assert } from "chai";
import { GELATO_RELAY_1BALANCE_ERC2771 } from "./constants";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { CallWithERC2771Request } from "@gelatonetwork/relay-sdk";
import { sponsoredCallERC2771Local } from "./__mock__/relay-sdk";

export const mintingAmount = parseUnits("200", 18);

export const getAccounts = async () => {
  const [, issuerAccount, admin, feeAccount, player1, player2, player3] =
    await ethers.getSigners();

  return {
    trustedForwarder: await ethers.getImpersonatedSigner(
      GELATO_RELAY_1BALANCE_ERC2771,
    ),
    issuerAccount,
    admin,
    feeAccount,
    player1,
    player2,
    player3,
  };
};

export const defaultDeployFixture = (withMint: boolean = false) => {
  return async function generalFixture() {
    const tokenContract = await deployTokenFixture()();
    const wageringContract = await deployWageringFixture(
      await tokenContract.getAddress(),
    )();
    const { blockRacersContract: coreContract, blockRacersAssetsContract: assetsContract, uiHelperContract } = await deployCoreFixture(
      await tokenContract.getAddress(),
    )();

    if (withMint) {
      const { player1, player2, player3, issuerAccount } = await getAccounts();
      await mintWithPermit(
        tokenContract,
        issuerAccount,
        player1.address,
        mintingAmount,
      );
      await mintWithPermit(
        tokenContract,
        issuerAccount,
        player2.address,
        mintingAmount,
      );
      await mintWithPermit(
        tokenContract,
        issuerAccount,
        player3.address,
        mintingAmount,
      );
    }

    return {
      tokenContract,
      assetsContract,
      wageringContract,
      coreContract,
      uiHelperContract,
    };
  };
};

export const sponsorRelayCall = async (
  target: string,
  sender: HardhatEthersSigner,
  data: string,
) => {
  const request: CallWithERC2771Request = {
    target,
    user: sender.address,
    data: data,
    chainId: (await sender.provider.getNetwork()).chainId,
  };

  await sponsoredCallERC2771Local(request);
};

export const isTrustedForwarder = async (
  contract: ERC2771Context,
  address: AddressLike,
  expectedState: boolean,
) => {
  const isTrusted = await contract.isTrustedForwarder(address);
  assert(
    isTrusted == expectedState,
    `TrustedForwarder incorrect. Actual: ${isTrusted} | Expected: ${expectedState}`,
  );
};

export const checkTrustedForwarder = async (
  contract: ERC2771Context,
  expectedState: AddressLike,
) => {
  const state = await contract.trustedForwarder();
  assert(
    state == expectedState,
    `TrustedForwarder incorrect. Actual: ${state} | Expected: ${expectedState}`,
  );
};
