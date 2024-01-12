import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { WagerState, acceptWager, acceptWagerWithError, acceptWagerWithEvent, adminCancelWager, cancelWager, cancelWagerWithError, cancelWagerWithEvent, completeWager, completeWagerWithError, completeWagerWithEvent, createWager, createWagerWithEvent, deployWageringFixture, getLatestWagerId, getPlayersWagers, getTokenAddressWagering } from "../src/BlockRacersWagering.contract";
import { balanceOfToken, setAllowanceToken } from "../src/BlockRacersToken.contract";
import { checkTrustedForwarder, defaultDeployFixture, getAccounts, isTrustedForwarder, mintingAmount } from "../src/generalFunctions";
import { ERC2771Context } from "../typechain-types";
import { parseUnits, ZeroAddress, getBytes,  solidityPackedKeccak256, hashMessage } from "ethers";
import { addToBlacklist } from "../src/Blacklist.contract";

describe("BlockRacersWagering", function () {
  const standardPrize = parseUnits("4", 18);

  describe("deployment", () => {
    it("deploys as expected", async () => {
      const wageringContract = await loadFixture(deployWageringFixture())

      wageringContract.trustedForwarder
    })  
  })

  describe("write", function () {
    it("createPvpWager", async () => {
        const { player1 } = await getAccounts()

        const { tokenContract, wageringContract } = await loadFixture(defaultDeployFixture(true))
            
        await balanceOfToken(tokenContract, player1, mintingAmount)
        await balanceOfToken(tokenContract, wageringContract, 0)

        await setAllowanceToken(tokenContract, player1, wageringContract, standardPrize)

        await getPlayersWagers(wageringContract, player1, [])
        
        await createWager(wageringContract, player1, standardPrize, {
            prize: standardPrize,
            creator: player1.address,
            opponent: ZeroAddress,
            winner: ZeroAddress,
            state: WagerState.CREATED,
        })
        
        await balanceOfToken(tokenContract, player1, mintingAmount - standardPrize)
        await balanceOfToken(tokenContract, wageringContract, standardPrize)

        await getPlayersWagers(wageringContract, player1, [1])

    })
    it("acceptWager", async () => {
        const { player1, player2 } = await getAccounts()

        const { tokenContract, wageringContract } = await loadFixture(defaultDeployFixture(true))
            
        await setAllowanceToken(tokenContract, player1, wageringContract, standardPrize)

        await createWager(wageringContract, player1, standardPrize)

        await balanceOfToken(tokenContract, player1, mintingAmount - standardPrize)
        await balanceOfToken(tokenContract, wageringContract, standardPrize)

        const player1Wagers = await getPlayersWagers(wageringContract, player1, [1])
        await setAllowanceToken(tokenContract, player2, wageringContract, standardPrize)

        await acceptWager(wageringContract, player2, player1Wagers[0], {
            prize: standardPrize,
            creator: player1.address,
            opponent: player2.address,
            winner: ZeroAddress,
            state: WagerState.ACCEPTED,
        })

        await balanceOfToken(tokenContract, wageringContract, standardPrize * BigInt(2))

        
    })
    describe("Cancel wager", () => {
        it("Created, cancelled by creator", async () => {
            const { player1 } = await getAccounts()
    
            const { tokenContract, wageringContract } = await loadFixture(defaultDeployFixture(true))
                
            await setAllowanceToken(tokenContract, player1, wageringContract, standardPrize)
    
            await createWager(wageringContract, player1, standardPrize)
            const player1Wagers = await getPlayersWagers(wageringContract, player1, [1])
    
            await cancelWager(wageringContract, player1, player1Wagers[0], {
                prize: standardPrize,
                creator: player1.address,
                opponent: ZeroAddress,
                winner: ZeroAddress,
                state: WagerState.CANCELLED,
            })

            await balanceOfToken(tokenContract, wageringContract, 0)
            await balanceOfToken(tokenContract, player1, mintingAmount)
        })
        it("Accepted, cancelled by creator", async () => {
            const { player1, player2 } = await getAccounts()
    
            const { tokenContract, wageringContract } = await loadFixture(defaultDeployFixture(true))
                
            await setAllowanceToken(tokenContract, player1, wageringContract, standardPrize)
    
            await createWager(wageringContract, player1, standardPrize)
    
            const player1Wagers = await getPlayersWagers(wageringContract, player1, [1])
            await setAllowanceToken(tokenContract, player2, wageringContract, standardPrize)
    
            await acceptWager(wageringContract, player2, player1Wagers[0], {
                prize: standardPrize,
                creator: player1.address,
                opponent: player2.address,
                winner: ZeroAddress,
                state: WagerState.ACCEPTED,
            })
    
            await balanceOfToken(tokenContract, wageringContract, standardPrize * BigInt(2))
    
            await cancelWager(wageringContract, player2, player1Wagers[0], {
                prize: standardPrize,
                creator: player1.address,
                opponent: player2.address,
                winner: ZeroAddress,
                state: WagerState.CANCELLED,
            })

            await balanceOfToken(tokenContract, wageringContract, 0)
            await balanceOfToken(tokenContract, player1, mintingAmount)
            await balanceOfToken(tokenContract, player2, mintingAmount)
        })
        it("Accepted, cancelled by opponent", async () => {
            const { player1, player2 } = await getAccounts()
    
            const { tokenContract, wageringContract } = await loadFixture(defaultDeployFixture(true))
                
            await setAllowanceToken(tokenContract, player1, wageringContract, standardPrize)
    
            await createWager(wageringContract, player1, standardPrize)
    
            const player1Wagers = await getPlayersWagers(wageringContract, player1, [1])
            await setAllowanceToken(tokenContract, player2, wageringContract, standardPrize)
    
            await acceptWager(wageringContract, player2, player1Wagers[0], {
                prize: standardPrize,
                creator: player1.address,
                opponent: player2.address,
                winner: ZeroAddress,
                state: WagerState.ACCEPTED,
            })
    
            await balanceOfToken(tokenContract, wageringContract, standardPrize * BigInt(2))
    
            await cancelWager(wageringContract, player2, player1Wagers[0], {
                prize: standardPrize,
                creator: player1.address,
                opponent: player2.address,
                winner: ZeroAddress,
                state: WagerState.CANCELLED,
            })

            await balanceOfToken(tokenContract, wageringContract, 0)
            await balanceOfToken(tokenContract, player1, mintingAmount)
            await balanceOfToken(tokenContract, player2, mintingAmount)
        })
    })
    
    describe("completeWager", () => {
        it("Allows any account to submit completion TX", async () => {
            const { player1, player2, player3 } = await getAccounts()
    
            const { tokenContract, wageringContract } = await loadFixture(defaultDeployFixture(true))
                
            await setAllowanceToken(tokenContract, player1, wageringContract, standardPrize)
    
            await createWager(wageringContract, player1, standardPrize)
    
            const player1Wagers = await getPlayersWagers(wageringContract, player1, [1])
            await setAllowanceToken(tokenContract, player2, wageringContract, standardPrize)
    
            await acceptWager(wageringContract, player2, player1Wagers[0], {
                prize: standardPrize,
                creator: player1.address,
                opponent: player2.address,
                winner: ZeroAddress,
                state: WagerState.ACCEPTED,
            })
            const messageHash = solidityPackedKeccak256([ "uint256", "string", "address" ], [ player1Wagers[0], "-",  player1.address]);
            const messageHashAsBytes32 = getBytes(messageHash)

            const creatorProof = await player1.signMessage(messageHashAsBytes32)
            const opponentProof = await player2.signMessage(messageHashAsBytes32)

            
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
                }
            )
            await balanceOfToken(tokenContract, wageringContract, 0)

            await balanceOfToken(tokenContract, player1, mintingAmount + standardPrize)
        })
    })
  });

  describe("admin", () => {
    it("adminCancelWager:CREATED", async () => {
        const { player1, admin } = await getAccounts()
    
        const { tokenContract, wageringContract } = await loadFixture(defaultDeployFixture(true))
            
        await setAllowanceToken(tokenContract, player1, wageringContract, standardPrize)

        await createWager(wageringContract, player1, standardPrize)
        const player1Wagers = await getPlayersWagers(wageringContract, player1, [1])

        await adminCancelWager(wageringContract, admin, player1Wagers[0], {
            prize: standardPrize,
            creator: player1.address,
            opponent: ZeroAddress,
            winner: ZeroAddress,
            state: WagerState.CANCELLED,
        })

        await balanceOfToken(tokenContract, wageringContract, 0)
        await balanceOfToken(tokenContract, player1, mintingAmount)

    })
    it("adminCancelWager:ACCEPTED", async () => {
        const { player1, player2, admin } = await getAccounts()
    
        const { tokenContract, wageringContract } = await loadFixture(defaultDeployFixture(true))
            
        await setAllowanceToken(tokenContract, player1, wageringContract, standardPrize)

        await createWager(wageringContract, player1, standardPrize)

        const player1Wagers = await getPlayersWagers(wageringContract, player1, [1])
        await setAllowanceToken(tokenContract, player2, wageringContract, standardPrize)

        await acceptWager(wageringContract, player2, player1Wagers[0], {
            prize: standardPrize,
            creator: player1.address,
            opponent: player2.address,
            winner: ZeroAddress,
            state: WagerState.ACCEPTED,
        })

        await balanceOfToken(tokenContract, wageringContract, standardPrize * BigInt(2))

        await adminCancelWager(wageringContract, admin, player1Wagers[0], {
            prize: standardPrize,
            creator: player1.address,
            opponent: player2.address,
            winner: ZeroAddress,
            state: WagerState.CANCELLED,
        })

        await balanceOfToken(tokenContract, wageringContract, 0)
        await balanceOfToken(tokenContract, player1, mintingAmount)
        await balanceOfToken(tokenContract, player2, mintingAmount)
    })

    describe("Creator blacklisted", () => {
        it("adminCancelWager:CREATED", async () => {
            const { player1, admin } = await getAccounts()
    
            const { tokenContract, wageringContract } = await loadFixture(defaultDeployFixture(true))
                
            await setAllowanceToken(tokenContract, player1, wageringContract, standardPrize)
    
            await createWager(wageringContract, player1, standardPrize)
            const player1Wagers = await getPlayersWagers(wageringContract, player1, [1])
            
            await addToBlacklist(wageringContract, admin, player1.address)

            await adminCancelWager(wageringContract, admin, player1Wagers[0], {
                prize: standardPrize,
                creator: player1.address,
                opponent: ZeroAddress,
                winner: ZeroAddress,
                state: WagerState.CANCELLED,
            })
    
            await balanceOfToken(tokenContract, wageringContract, 0)
            await balanceOfToken(tokenContract, player1, mintingAmount)
        })
        it("adminCancelWager:ACCEPTED", async () => {
            const { player1, player2, admin } = await getAccounts()
    
            const { tokenContract, wageringContract } = await loadFixture(defaultDeployFixture(true))
                
            await setAllowanceToken(tokenContract, player1, wageringContract, standardPrize)

            await createWager(wageringContract, player1, standardPrize)

            const player1Wagers = await getPlayersWagers(wageringContract, player1, [1])
            await setAllowanceToken(tokenContract, player2, wageringContract, standardPrize)

            await acceptWager(wageringContract, player2, player1Wagers[0], {
                prize: standardPrize,
                creator: player1.address,
                opponent: player2.address,
                winner: ZeroAddress,
                state: WagerState.ACCEPTED,
            })

            await addToBlacklist(wageringContract, admin, player2.address)

            await balanceOfToken(tokenContract, wageringContract, standardPrize * BigInt(2))

            await adminCancelWager(wageringContract, admin, player1Wagers[0], {
                prize: standardPrize,
                creator: player1.address,
                opponent: player2.address,
                winner: ZeroAddress,
                state: WagerState.CANCELLED,
            })

            await balanceOfToken(tokenContract, wageringContract, 0)
            await balanceOfToken(tokenContract, player1, mintingAmount)
            await balanceOfToken(tokenContract, player2, mintingAmount)
        })
    })
    describe("Opponent blacklisted", () => {
        it("adminCancelWager:ACCEPTED", async () => {
            const { player1, player2, admin } = await getAccounts()
    
            const { tokenContract, wageringContract } = await loadFixture(defaultDeployFixture(true))
                
            await setAllowanceToken(tokenContract, player1, wageringContract, standardPrize)

            await createWager(wageringContract, player1, standardPrize)

            const player1Wagers = await getPlayersWagers(wageringContract, player1, [1])
            await setAllowanceToken(tokenContract, player2, wageringContract, standardPrize)

            await acceptWager(wageringContract, player2, player1Wagers[0], {
                prize: standardPrize,
                creator: player1.address,
                opponent: player2.address,
                winner: ZeroAddress,
                state: WagerState.ACCEPTED,
            })

            await addToBlacklist(wageringContract, admin, player2.address)

            await balanceOfToken(tokenContract, wageringContract, standardPrize * BigInt(2))

            await adminCancelWager(wageringContract, admin, player1Wagers[0], {
                prize: standardPrize,
                creator: player1.address,
                opponent: player2.address,
                winner: ZeroAddress,
                state: WagerState.CANCELLED,
            })

            await balanceOfToken(tokenContract, wageringContract, 0)
            await balanceOfToken(tokenContract, player1, mintingAmount)
            await balanceOfToken(tokenContract, player2, mintingAmount)
        })
    })
    it("Both Blacklisted | adminCancelWager:ACCEPTED", async () => {
        const { player1, player2, admin } = await getAccounts()

        const { tokenContract, wageringContract } = await loadFixture(defaultDeployFixture(true))
            
        await setAllowanceToken(tokenContract, player1, wageringContract, standardPrize)

        await createWager(wageringContract, player1, standardPrize)

        const player1Wagers = await getPlayersWagers(wageringContract, player1, [1])
        await setAllowanceToken(tokenContract, player2, wageringContract, standardPrize)

        await acceptWager(wageringContract, player2, player1Wagers[0], {
            prize: standardPrize,
            creator: player1.address,
            opponent: player2.address,
            winner: ZeroAddress,
            state: WagerState.ACCEPTED,
        })

        await addToBlacklist(wageringContract, admin, player1.address)
        await addToBlacklist(wageringContract, admin, player2.address)

        await balanceOfToken(tokenContract, wageringContract, standardPrize * BigInt(2))

        await adminCancelWager(wageringContract, admin, player1Wagers[0], {
            prize: standardPrize,
            creator: player1.address,
            opponent: player2.address,
            winner: ZeroAddress,
            state: WagerState.CANCELLED,
        })

        await balanceOfToken(tokenContract, wageringContract, 0)
        await balanceOfToken(tokenContract, player1, mintingAmount)
        await balanceOfToken(tokenContract, player2, mintingAmount)
    })
  })

  describe("read", function () {
    it("isTrustedForwarder", async () => {
      const { trustedForwarder } = await getAccounts()
      const wageringContract = await loadFixture(deployWageringFixture())

      await isTrustedForwarder(wageringContract as ERC2771Context, trustedForwarder.address, true)
    })
    it("latestWagerId", async () => {
        const { player1 } = await getAccounts()
        const { tokenContract, wageringContract } = await loadFixture(defaultDeployFixture(true))

        await getLatestWagerId(wageringContract, BigInt(0))

        await setAllowanceToken(tokenContract, player1, wageringContract, standardPrize)
        await createWager(wageringContract, player1, standardPrize)

        await getLatestWagerId(wageringContract, BigInt(1))
    })
    it("token", async () => {
        const { tokenContract, wageringContract } = await loadFixture(defaultDeployFixture(true))

        await getTokenAddressWagering(wageringContract, await tokenContract.getAddress())
    })
    it("trustedForwarder", async () => {
        const { trustedForwarder } = await getAccounts()
        const wageringContract = await loadFixture(deployWageringFixture())  
        await checkTrustedForwarder(wageringContract as ERC2771Context, trustedForwarder.address)
    })
  });

  describe("events", function () {
    it("WagerCreated", async () => {
        const { player1 } = await getAccounts()

        const { tokenContract, wageringContract } = await loadFixture(defaultDeployFixture(true))
        await setAllowanceToken(tokenContract, player1, wageringContract, standardPrize)
        await createWagerWithEvent(wageringContract, player1, standardPrize, "WagerCreated", [1, player1.address, standardPrize])
    })
    it("WagerAccepted", async () => {
        const { player1, player2 } = await getAccounts()

        const { tokenContract, wageringContract } = await loadFixture(defaultDeployFixture(true))
        await setAllowanceToken(tokenContract, player1, wageringContract, standardPrize)
        await createWager(wageringContract, player1, standardPrize)

        await setAllowanceToken(tokenContract, player2, wageringContract, standardPrize)

        await acceptWagerWithEvent(wageringContract, player2, 1, "WagerAccepted", [1, player2.address])
    })
    it("WagerCancelled", async () => {
        const { player1, player2 } = await getAccounts()

        const { tokenContract, wageringContract } = await loadFixture(defaultDeployFixture(true))
        await setAllowanceToken(tokenContract, player1, wageringContract, standardPrize)
        await createWager(wageringContract, player1, standardPrize)

        await setAllowanceToken(tokenContract, player2, wageringContract, standardPrize)

        await acceptWager(wageringContract, player2, 1)
        await cancelWagerWithEvent(wageringContract, player1, 1, "WagerCancelled", [1, player1.address])
    })
    it("WagerCompleted", async () => {
        const { player1, player2, player3 } = await getAccounts()

        const { tokenContract, wageringContract } = await loadFixture(defaultDeployFixture(true))
        await setAllowanceToken(tokenContract, player1, wageringContract, standardPrize)
        await createWager(wageringContract, player1, standardPrize)

        await setAllowanceToken(tokenContract, player2, wageringContract, standardPrize)

        await acceptWager(wageringContract, player2, 1)

        const messageHash = solidityPackedKeccak256([ "uint256", "string", "address" ], [ 1, "-",  player1.address]);
        const messageHashAsBytes32 = getBytes(messageHash)

        const creatorProof = await player1.signMessage(messageHashAsBytes32)
        const opponentProof = await player2.signMessage(messageHashAsBytes32)

        
        await completeWagerWithEvent(
            wageringContract, 
            player3, 
            player1.address, 
            1, 
            creatorProof, 
            opponentProof,
            "WagerCompleted",
            [
                1,
                player1.address
            ]
        )
    })
  })

  describe("errors", () => {
    it("WagerStateIncorrect", async () => {
        const { player1, player2, player3 } = await getAccounts()

        const { wageringContract } = await loadFixture(defaultDeployFixture(true))

        await acceptWagerWithError(wageringContract, player2, 1, "WagerStateIncorrect", [1, WagerState.NOT_STARTED, WagerState.CREATED])
        
        const messageHash = solidityPackedKeccak256([ "uint256", "string", "address" ], [ 1, "-",  player1.address]);
        const messageHashAsBytes32 = getBytes(messageHash)

        const creatorProof = await player1.signMessage(messageHashAsBytes32)
        const opponentProof = await player2.signMessage(messageHashAsBytes32)

        await completeWagerWithError(
            wageringContract, 
            player3, 
            player1.address, 
            1, 
            creatorProof, 
            opponentProof,
            "WagerStateIncorrect",
            [
                1,
                WagerState.NOT_STARTED,
                WagerState.ACCEPTED
            ]
        )
    })
    it("WagerCantBeCancelled", async () => {
        const { player1 } = await getAccounts()

        const { wageringContract } = await loadFixture(defaultDeployFixture(true))

        await cancelWagerWithError(wageringContract, player1, 1, "WagerCantBeCancelled", [1, WagerState.NOT_STARTED])

    })
    it("OnlyParticipantsCanCancel", async () => {
        const { player1, player2, player3 } = await getAccounts()

        const { tokenContract, wageringContract } = await loadFixture(defaultDeployFixture(true))
        await setAllowanceToken(tokenContract, player1, wageringContract, standardPrize)
        await createWager(wageringContract, player1, standardPrize)

        await setAllowanceToken(tokenContract, player2, wageringContract, standardPrize)

        await acceptWager(wageringContract, player2, 1)

        await cancelWagerWithError(wageringContract, player3, 1, "OnlyParticipantsCanCancel", [1, player3.address])
    })
    it("OpponentCantBeChallenger", async () => {
        const { player1 } = await getAccounts()

        const { tokenContract, wageringContract } = await loadFixture(defaultDeployFixture(true))
        await setAllowanceToken(tokenContract, player1, wageringContract, standardPrize)
        await createWager(wageringContract, player1, standardPrize)

        await acceptWagerWithError(wageringContract, player1, 1, "OpponentCantBeChallenger", [1, player1.address])
    })
    it("PlayerSignatureInvalid", async () => {
        const { player1, player2, player3 } = await getAccounts()

        const { tokenContract, wageringContract } = await loadFixture(defaultDeployFixture(true))
        await setAllowanceToken(tokenContract, player1, wageringContract, standardPrize)
        await createWager(wageringContract, player1, standardPrize)

        await setAllowanceToken(tokenContract, player2, wageringContract, standardPrize)

        await acceptWager(wageringContract, player2, 1)

        const messageHash = solidityPackedKeccak256([ "uint256", "string", "address" ], [ 1, "-",  player1.address]);
        const messageHashAsBytes32 = getBytes(messageHash)

        const creatorProof = await player1.signMessage(messageHashAsBytes32)
        const opponentProof = await player2.signMessage("several cats playing tennis")
        
        await completeWagerWithError(
            wageringContract, 
            player3, 
            player1.address, 
            1, 
            creatorProof, 
            opponentProof,
            "PlayerSignatureInvalid",
            [
                1,
                player1.address,
                hashMessage(messageHashAsBytes32),
                creatorProof,
                opponentProof
            ]
        )
    })
  })
});
