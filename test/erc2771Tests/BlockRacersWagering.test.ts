import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {
  WagerState,
  acceptWager,
  adminCancelWager,
  cancelWager,
  completeWager,
  createWager,
  getPlayersWagers,
} from "../../src/BlockRacersWagering.contract";
import {
  balanceOfToken,
  setAllowanceToken,
} from "../../src/BlockRacersToken.contract";
import {
  defaultDeployFixture,
  getAccounts,
  mintingAmount,
} from "../../src/generalFunctions";
import {
  parseUnits,
  ZeroAddress,
  getBytes,
  solidityPackedKeccak256,
} from "ethers";
import { addToBlacklist } from "../../src/Blacklist.contract";

describe("BlockRacersWagering - ERC2771", function () {
  const standardPrize = parseUnits("4", 18);

  describe("write", function () {
    it("createPvpWager", async () => {
      const { player1 } = await getAccounts();

      const { tokenContract, wageringContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      await balanceOfToken(tokenContract, player1, mintingAmount);
      await balanceOfToken(tokenContract, wageringContract, 0);

      await setAllowanceToken(
        tokenContract,
        player1,
        wageringContract,
        standardPrize,
      );

      await getPlayersWagers(wageringContract, player1, []);

      await createWager(wageringContract, player1, standardPrize, {
        prize: standardPrize,
        creator: player1.address,
        opponent: ZeroAddress,
        winner: ZeroAddress,
        state: WagerState.CREATED,
      });

      await balanceOfToken(
        tokenContract,
        player1,
        mintingAmount - standardPrize,
      );
      await balanceOfToken(tokenContract, wageringContract, standardPrize);

      await getPlayersWagers(wageringContract, player1, [1]);
    });
    it("acceptWager", async () => {
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

      await createWager(wageringContract, player1, standardPrize);

      await balanceOfToken(
        tokenContract,
        player1,
        mintingAmount - standardPrize,
      );
      await balanceOfToken(tokenContract, wageringContract, standardPrize);

      const player1Wagers = await getPlayersWagers(wageringContract, player1, [
        1,
      ]);
      await setAllowanceToken(
        tokenContract,
        player2,
        wageringContract,
        standardPrize,
      );

      await acceptWager(wageringContract, player2, player1Wagers[0], {
        prize: standardPrize,
        creator: player1.address,
        opponent: player2.address,
        winner: ZeroAddress,
        state: WagerState.ACCEPTED,
      });

      await balanceOfToken(
        tokenContract,
        wageringContract,
        standardPrize * BigInt(2),
      );
    });
    describe("Cancel wager", () => {
      it("Created, cancelled by creator", async () => {
        const { player1 } = await getAccounts();

        const { tokenContract, wageringContract } = await loadFixture(
          defaultDeployFixture(true),
        );

        await setAllowanceToken(
          tokenContract,
          player1,
          wageringContract,
          standardPrize,
        );

        await createWager(wageringContract, player1, standardPrize);
        const player1Wagers = await getPlayersWagers(
          wageringContract,
          player1,
          [1],
        );

        await cancelWager(wageringContract, player1, player1Wagers[0], {
          prize: standardPrize,
          creator: player1.address,
          opponent: ZeroAddress,
          winner: ZeroAddress,
          state: WagerState.CANCELLED,
        });

        await balanceOfToken(tokenContract, wageringContract, 0);
        await balanceOfToken(tokenContract, player1, mintingAmount);
      });
      it("Accepted, cancelled by creator", async () => {
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

        await createWager(wageringContract, player1, standardPrize);

        const player1Wagers = await getPlayersWagers(
          wageringContract,
          player1,
          [1],
        );
        await setAllowanceToken(
          tokenContract,
          player2,
          wageringContract,
          standardPrize,
        );

        await acceptWager(wageringContract, player2, player1Wagers[0], {
          prize: standardPrize,
          creator: player1.address,
          opponent: player2.address,
          winner: ZeroAddress,
          state: WagerState.ACCEPTED,
        });

        await balanceOfToken(
          tokenContract,
          wageringContract,
          standardPrize * BigInt(2),
        );

        await cancelWager(wageringContract, player2, player1Wagers[0], {
          prize: standardPrize,
          creator: player1.address,
          opponent: player2.address,
          winner: ZeroAddress,
          state: WagerState.CANCELLED,
        });

        await balanceOfToken(tokenContract, wageringContract, 0);
        await balanceOfToken(tokenContract, player1, mintingAmount);
        await balanceOfToken(tokenContract, player2, mintingAmount);
      });
      it("Accepted, cancelled by opponent", async () => {
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

        await createWager(wageringContract, player1, standardPrize);

        const player1Wagers = await getPlayersWagers(
          wageringContract,
          player1,
          [1],
        );
        await setAllowanceToken(
          tokenContract,
          player2,
          wageringContract,
          standardPrize,
        );

        await acceptWager(wageringContract, player2, player1Wagers[0], {
          prize: standardPrize,
          creator: player1.address,
          opponent: player2.address,
          winner: ZeroAddress,
          state: WagerState.ACCEPTED,
        });

        await balanceOfToken(
          tokenContract,
          wageringContract,
          standardPrize * BigInt(2),
        );

        await cancelWager(wageringContract, player2, player1Wagers[0], {
          prize: standardPrize,
          creator: player1.address,
          opponent: player2.address,
          winner: ZeroAddress,
          state: WagerState.CANCELLED,
        });

        await balanceOfToken(tokenContract, wageringContract, 0);
        await balanceOfToken(tokenContract, player1, mintingAmount);
        await balanceOfToken(tokenContract, player2, mintingAmount);
      });
    });

    describe("completeWager", () => {
      it("Allows any account to submit completion TX", async () => {
        const { player1, player2, player3 } = await getAccounts();

        const { tokenContract, wageringContract } = await loadFixture(
          defaultDeployFixture(true),
        );

        await setAllowanceToken(
          tokenContract,
          player1,
          wageringContract,
          standardPrize,
        );

        await createWager(wageringContract, player1, standardPrize);

        const player1Wagers = await getPlayersWagers(
          wageringContract,
          player1,
          [1],
        );
        await setAllowanceToken(
          tokenContract,
          player2,
          wageringContract,
          standardPrize,
        );

        await acceptWager(wageringContract, player2, player1Wagers[0], {
          prize: standardPrize,
          creator: player1.address,
          opponent: player2.address,
          winner: ZeroAddress,
          state: WagerState.ACCEPTED,
        });
        const messageHash = solidityPackedKeccak256(
          ["uint256", "string", "address"],
          [player1Wagers[0], "-", player1.address],
        );
        const messageHashAsBytes32 = getBytes(messageHash);

        const creatorProof = await player1.signMessage(messageHashAsBytes32);
        const opponentProof = await player2.signMessage(messageHashAsBytes32);

        await completeWager(
          wageringContract,
          player3,
          player1.address,
          player1Wagers[0],
          creatorProof,
          opponentProof,
          {
            prize: standardPrize,
            creator: player1.address,
            opponent: player2.address,
            winner: player1.address,
            state: WagerState.COMPLETED,
          },
        );
        await balanceOfToken(tokenContract, wageringContract, 0);

        await balanceOfToken(
          tokenContract,
          player1,
          mintingAmount + standardPrize,
        );
      });
    });
  });

  describe("admin", () => {
    it("adminCancelWager:CREATED", async () => {
      const { player1, admin } = await getAccounts();

      const { tokenContract, wageringContract } = await loadFixture(
        defaultDeployFixture(true),
      );

      await setAllowanceToken(
        tokenContract,
        player1,
        wageringContract,
        standardPrize,
      );

      await createWager(wageringContract, player1, standardPrize);
      const player1Wagers = await getPlayersWagers(wageringContract, player1, [
        1,
      ]);

      await adminCancelWager(wageringContract, admin, player1Wagers[0], {
        prize: standardPrize,
        creator: player1.address,
        opponent: ZeroAddress,
        winner: ZeroAddress,
        state: WagerState.CANCELLED,
      });

      await balanceOfToken(tokenContract, wageringContract, 0);
      await balanceOfToken(tokenContract, player1, mintingAmount);
    });
    it("adminCancelWager:ACCEPTED", async () => {
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

      await createWager(wageringContract, player1, standardPrize);

      const player1Wagers = await getPlayersWagers(wageringContract, player1, [
        1,
      ]);
      await setAllowanceToken(
        tokenContract,
        player2,
        wageringContract,
        standardPrize,
      );

      await acceptWager(wageringContract, player2, player1Wagers[0], {
        prize: standardPrize,
        creator: player1.address,
        opponent: player2.address,
        winner: ZeroAddress,
        state: WagerState.ACCEPTED,
      });

      await balanceOfToken(
        tokenContract,
        wageringContract,
        standardPrize * BigInt(2),
      );

      await adminCancelWager(wageringContract, admin, player1Wagers[0], {
        prize: standardPrize,
        creator: player1.address,
        opponent: player2.address,
        winner: ZeroAddress,
        state: WagerState.CANCELLED,
      });

      await balanceOfToken(tokenContract, wageringContract, 0);
      await balanceOfToken(tokenContract, player1, mintingAmount);
      await balanceOfToken(tokenContract, player2, mintingAmount);
    });

    describe("Creator blacklisted", () => {
      it("adminCancelWager:CREATED", async () => {
        const { player1, admin } = await getAccounts();

        const { tokenContract, wageringContract } = await loadFixture(
          defaultDeployFixture(true),
        );

        await setAllowanceToken(
          tokenContract,
          player1,
          wageringContract,
          standardPrize,
        );

        await createWager(wageringContract, player1, standardPrize);
        const player1Wagers = await getPlayersWagers(
          wageringContract,
          player1,
          [1],
        );

        await addToBlacklist(wageringContract, admin, player1.address);

        await adminCancelWager(wageringContract, admin, player1Wagers[0], {
          prize: standardPrize,
          creator: player1.address,
          opponent: ZeroAddress,
          winner: ZeroAddress,
          state: WagerState.CANCELLED,
        });

        await balanceOfToken(tokenContract, wageringContract, 0);
        await balanceOfToken(tokenContract, player1, mintingAmount);
      });
      it("adminCancelWager:ACCEPTED", async () => {
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

        await createWager(wageringContract, player1, standardPrize);

        const player1Wagers = await getPlayersWagers(
          wageringContract,
          player1,
          [1],
        );
        await setAllowanceToken(
          tokenContract,
          player2,
          wageringContract,
          standardPrize,
        );

        await acceptWager(wageringContract, player2, player1Wagers[0], {
          prize: standardPrize,
          creator: player1.address,
          opponent: player2.address,
          winner: ZeroAddress,
          state: WagerState.ACCEPTED,
        });

        await addToBlacklist(wageringContract, admin, player2.address);

        await balanceOfToken(
          tokenContract,
          wageringContract,
          standardPrize * BigInt(2),
        );

        await adminCancelWager(wageringContract, admin, player1Wagers[0], {
          prize: standardPrize,
          creator: player1.address,
          opponent: player2.address,
          winner: ZeroAddress,
          state: WagerState.CANCELLED,
        });

        await balanceOfToken(tokenContract, wageringContract, 0);
        await balanceOfToken(tokenContract, player1, mintingAmount);
        await balanceOfToken(tokenContract, player2, mintingAmount);
      });
    });
    describe("Opponent blacklisted", () => {
      it("adminCancelWager:ACCEPTED", async () => {
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

        await createWager(wageringContract, player1, standardPrize);

        const player1Wagers = await getPlayersWagers(
          wageringContract,
          player1,
          [1],
        );
        await setAllowanceToken(
          tokenContract,
          player2,
          wageringContract,
          standardPrize,
        );

        await acceptWager(wageringContract, player2, player1Wagers[0], {
          prize: standardPrize,
          creator: player1.address,
          opponent: player2.address,
          winner: ZeroAddress,
          state: WagerState.ACCEPTED,
        });

        await addToBlacklist(wageringContract, admin, player2.address);

        await balanceOfToken(
          tokenContract,
          wageringContract,
          standardPrize * BigInt(2),
        );

        await adminCancelWager(wageringContract, admin, player1Wagers[0], {
          prize: standardPrize,
          creator: player1.address,
          opponent: player2.address,
          winner: ZeroAddress,
          state: WagerState.CANCELLED,
        });

        await balanceOfToken(tokenContract, wageringContract, 0);
        await balanceOfToken(tokenContract, player1, mintingAmount);
        await balanceOfToken(tokenContract, player2, mintingAmount);
      });
    });
    it("Both Blacklisted | adminCancelWager:ACCEPTED", async () => {
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

      await createWager(wageringContract, player1, standardPrize);

      const player1Wagers = await getPlayersWagers(wageringContract, player1, [
        1,
      ]);
      await setAllowanceToken(
        tokenContract,
        player2,
        wageringContract,
        standardPrize,
      );

      await acceptWager(wageringContract, player2, player1Wagers[0], {
        prize: standardPrize,
        creator: player1.address,
        opponent: player2.address,
        winner: ZeroAddress,
        state: WagerState.ACCEPTED,
      });

      await addToBlacklist(wageringContract, admin, player1.address);
      await addToBlacklist(wageringContract, admin, player2.address);

      await balanceOfToken(
        tokenContract,
        wageringContract,
        standardPrize * BigInt(2),
      );

      await adminCancelWager(wageringContract, admin, player1Wagers[0], {
        prize: standardPrize,
        creator: player1.address,
        opponent: player2.address,
        winner: ZeroAddress,
        state: WagerState.CANCELLED,
      });

      await balanceOfToken(tokenContract, wageringContract, 0);
      await balanceOfToken(tokenContract, player1, mintingAmount);
      await balanceOfToken(tokenContract, player2, mintingAmount);
    });
  });
});
