import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {
  cancelWager,
  cancelWagerWithError,
  cancelWagerWithEvent,
  completeWager,
  completeWagerWithError,
  completeWagerWithEvent,
  startWager,
  startWagerWithEvent,
  startWagerDefaultWithError,
  startWagerWithError,
  deployWageringFixture,
  getPlayersWagers,
  getTokenAddressWagering,
} from "../src/BlockGameWagering.contract";
import {
  balanceOfToken,
  setAllowanceToken,
} from "../src/BlockGameToken.contract";
import {
  checkTrustedForwarder,
  defaultDeployFixture,
  getAccounts,
  isTrustedForwarder,
  mintingAmount,
} from "../src/generalFunctions";
import { ERC2771Context } from "../typechain-types";
import {
  parseUnits,
  ZeroAddress,
  getBytes,
  solidityPackedKeccak256,
  hashMessage,
} from "ethers";
import { addToBlacklist } from "../src/Blacklist.contract";

describe("BlockGameWagering", function () {
  const standardPrize = parseUnits("4", 18);

  describe("deployment", () => {
    it("deploys as expected", async () => {
      await loadFixture(deployWageringFixture());
    });
  });

  describe("write", function () {
    it("startWager", async () => {
      const { player1, player2 } = await getAccounts();

      const { tokenContract, wageringContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      await setAllowanceToken(
        tokenContract,
        player1,
        wageringContract,
        standardPrize,
      );
      await setAllowanceToken(
        tokenContract,
        player2,
        wageringContract,
        standardPrize,
      );

      await startWager(wageringContract, player1, player2, standardPrize);

      await balanceOfToken(
        tokenContract,
        player1,
        mintingAmount - standardPrize,
      );
      await balanceOfToken(
        tokenContract,
        player2,
        mintingAmount - standardPrize,
      );

      await getPlayersWagers(wageringContract, player1, [player2.address, standardPrize]);
      await getPlayersWagers(wageringContract, player2, [player1.address, standardPrize]);

      await balanceOfToken(
        tokenContract,
        wageringContract,
        standardPrize * 2n,
      );
    });
    describe("Cancel wager", () => {
      it("Started, cancelled by creator", async () => {
        const { player1, player2 } = await getAccounts();

        const { tokenContract, wageringContract } = await loadFixture(
          defaultDeployFixture(true),
        );

        await setAllowanceToken(
          tokenContract,
          player1,
          wageringContract,
          standardPrize,
        );
        await setAllowanceToken(
          tokenContract,
          player2,
          wageringContract,
          standardPrize,
        );

        await startWager(wageringContract, player1, player2, standardPrize);

        await cancelWager(wageringContract, player1, player2, standardPrize);

        await balanceOfToken(tokenContract, wageringContract, 0);
        await balanceOfToken(tokenContract, player1, mintingAmount);
        await balanceOfToken(tokenContract, player2, mintingAmount);
      });
      it("Started, cancelled by opponent", async () => {
        const { player1, player2 } = await getAccounts();

        const { tokenContract, wageringContract } = await loadFixture(
          defaultDeployFixture(true),
        );

        await setAllowanceToken(
          tokenContract,
          player1,
          wageringContract,
          standardPrize,
        );
        await setAllowanceToken(
          tokenContract,
          player2,
          wageringContract,
          standardPrize,
        );

        await startWager(wageringContract, player1, player2, standardPrize);

        await cancelWager(wageringContract, player2, player1, standardPrize);

        await balanceOfToken(tokenContract, wageringContract, 0);
        await balanceOfToken(tokenContract, player1, mintingAmount);
        await balanceOfToken(tokenContract, player2, mintingAmount);
      });
    });

    describe("completeWager", () => {
      it("Started, won by creator", async () => {
        const { player1, player2 } = await getAccounts();

        const { tokenContract, wageringContract } = await loadFixture(
          defaultDeployFixture(true),
        );

        await setAllowanceToken(
          tokenContract,
          player1,
          wageringContract,
          standardPrize,
        );
        await setAllowanceToken(
          tokenContract,
          player2,
          wageringContract,
          standardPrize,
        );

        await startWager(wageringContract, player1, player2, standardPrize);

        await completeWager(wageringContract, player1, player2, standardPrize);

        await balanceOfToken(tokenContract, wageringContract, 0);
        await balanceOfToken(tokenContract, player1, mintingAmount + standardPrize);
        await balanceOfToken(tokenContract, player2, mintingAmount - standardPrize);
      });
      it("Started, won by opponent", async () => {
        const { player1, player2 } = await getAccounts();

        const { tokenContract, wageringContract } = await loadFixture(
          defaultDeployFixture(true),
        );

        await setAllowanceToken(
          tokenContract,
          player1,
          wageringContract,
          standardPrize,
        );
        await setAllowanceToken(
          tokenContract,
          player2,
          wageringContract,
          standardPrize,
        );

        await startWager(wageringContract, player1, player2, standardPrize);

        await completeWager(wageringContract, player2, player1, standardPrize);

        await balanceOfToken(tokenContract, wageringContract, 0);
        await balanceOfToken(tokenContract, player1, mintingAmount - standardPrize);
        await balanceOfToken(tokenContract, player2, mintingAmount + standardPrize);
      });
    });
  });

  describe("admin", () => {
    it("Creator blacklisted", async () => {
      const { player1, player2, admin } = await getAccounts();

      const { tokenContract, wageringContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      await setAllowanceToken(
        tokenContract,
        player1,
        wageringContract,
        standardPrize,
      );
      await setAllowanceToken(
        tokenContract,
        player2,
        wageringContract,
        standardPrize,
      );

      await addToBlacklist(wageringContract, admin, player1.address);
      await startWagerDefaultWithError(wageringContract, player1, player2, standardPrize, "AccountBlacklisted", [player1.address]);
    });
    it("Opponent blacklisted", async () => {
      const { player1, player2, admin } = await getAccounts();

      const { tokenContract, wageringContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      await setAllowanceToken(
        tokenContract,
        player1,
        wageringContract,
        standardPrize,
      );
      await setAllowanceToken(
        tokenContract,
        player2,
        wageringContract,
        standardPrize,
      );

      await addToBlacklist(wageringContract, admin, player2.address);
      await startWagerDefaultWithError(wageringContract, player1, player2, standardPrize, "AccountBlacklisted", [player2.address]);
    });
    it("Both blacklisted", async () => {
      const { player1, player2, admin } = await getAccounts();

      const { tokenContract, wageringContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      await setAllowanceToken(
        tokenContract,
        player1,
        wageringContract,
        standardPrize,
      );
      await setAllowanceToken(
        tokenContract,
        player2,
        wageringContract,
        standardPrize,
      );

      await addToBlacklist(wageringContract, admin, player1.address);
      await addToBlacklist(wageringContract, admin, player2.address);
      await startWagerDefaultWithError(wageringContract, player1, player2, standardPrize, "AccountBlacklisted", [player1.address]);
    });
  });

  describe("read", function () {
    it("isTrustedForwarder", async () => {
      const { trustedForwarder } = await getAccounts();
      const wageringContract = await loadFixture(deployWageringFixture());

      await isTrustedForwarder(
        wageringContract as ERC2771Context,
        trustedForwarder.address,
        true,
      );
    });
    it("token", async () => {
      const { tokenContract, wageringContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      await getTokenAddressWagering(
        wageringContract,
        await tokenContract.getAddress(),
      );
    });
    it("trustedForwarder", async () => {
      const { trustedForwarder } = await getAccounts();
      const wageringContract = await loadFixture(deployWageringFixture());
      await checkTrustedForwarder(
        wageringContract as ERC2771Context,
        trustedForwarder.address,
      );
    });
  });

  describe("events", function () {
    it("WagerCreated", async () => {
      const { player1, player2 } = await getAccounts();

      const { tokenContract, wageringContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      await setAllowanceToken(
        tokenContract,
        player1,
        wageringContract,
        standardPrize,
      );
      await setAllowanceToken(
        tokenContract,
        player2,
        wageringContract,
        standardPrize,
      );

      await startWagerWithEvent(wageringContract, player1, player2, standardPrize,
        "WagerCreated", [player1.address, player2.address, standardPrize]);
    });
    it("WagerCancelled by creator", async () => {
      const { player1, player2 } = await getAccounts();

      const { tokenContract, wageringContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      await setAllowanceToken(
        tokenContract,
        player1,
        wageringContract,
        standardPrize,
      );
      await setAllowanceToken(
        tokenContract,
        player2,
        wageringContract,
        standardPrize,
      );

      await startWager(wageringContract, player1, player2, standardPrize);

      await cancelWagerWithEvent(wageringContract, player1, player2, standardPrize,
        "WagerCancelled", [player1.address, player2.address, standardPrize]);
    });
    it("WagerCancelled by oppponent", async () => {
      const { player1, player2 } = await getAccounts();

      const { tokenContract, wageringContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      await setAllowanceToken(
        tokenContract,
        player1,
        wageringContract,
        standardPrize,
      );
      await setAllowanceToken(
        tokenContract,
        player2,
        wageringContract,
        standardPrize,
      );

      await startWager(wageringContract, player1, player2, standardPrize);

      await cancelWagerWithEvent(wageringContract, player2, player1, standardPrize,
        "WagerCancelled", [player2.address, player1.address, standardPrize]);
    });
    it("WagerCompleted, won by creator", async () => {
      const { player1, player2 } = await getAccounts();

      const { tokenContract, wageringContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      await setAllowanceToken(
        tokenContract,
        player1,
        wageringContract,
        standardPrize,
      );
      await setAllowanceToken(
        tokenContract,
        player2,
        wageringContract,
        standardPrize,
      );

      await startWager(wageringContract, player1, player2, standardPrize);

      await completeWagerWithEvent(wageringContract, player1, player2, standardPrize,
        "WagerCompleted", [player1.address, player2.address, standardPrize]);
    });
    it("WagerCompleted, won by opponent", async () => {
      const { player1, player2 } = await getAccounts();

      const { tokenContract, wageringContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      await setAllowanceToken(
        tokenContract,
        player1,
        wageringContract,
        standardPrize,
      );
      await setAllowanceToken(
        tokenContract,
        player2,
        wageringContract,
        standardPrize,
      );

      await startWager(wageringContract, player1, player2, standardPrize);

      await completeWagerWithEvent(wageringContract, player2, player1, standardPrize,
        "WagerCompleted", [player2.address, player1.address, standardPrize]);
    });
  });

  describe("errors", () => {
    it("WagerStateIncorrect", async () => {

    });
  });
});
