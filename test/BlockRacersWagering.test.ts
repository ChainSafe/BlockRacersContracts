import {
  loadFixture,
  time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { WagerState, acceptWager, cancelWager, createWager, deployWageringFixture, getLatestWagerId, getPlayersWagers, getTokenAddressWagering } from "./contractFunctions/BlockRacersWagering.contract";
import { balanceOfToken, setAllowanceToken } from "./contractFunctions/BlockRacersToken.contract";
import { defaultDeployFixture, getAccounts, isTrustedForwarder, mintingAmount } from "./contractFunctions/generalFunctions";
import { ERC2771Context } from "../typechain-types";
import { parseUnits, ZeroAddress } from "ethers";

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
    
    it("completeWager")
  });

  describe("admin", () => {
    it("addToBlackList")
    it("adminCancelWager")
    it("removeFromBlackList")
    it("transferOwnership")
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
    it("trustedForwarder")
  });

  describe("events", function () {
    it("WagerCreated")
    it("WagerAccepted")
    it("WagerCancelled")
    it("WagerCompleted")
  })

  describe("errors", () => {
    it("WagerStateIncorrect")
    it("WagerCantBeCancelled")
    it("OnlyParticipantsCanCancel")
    it("OpponentCantBeChallenger")
    it("PlayerSignatureInvalid")
  })
});
