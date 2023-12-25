import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { WagerState, acceptWager, cancelWager, completeWager, createWager, deployWageringFixture, getLatestWagerId, getPlayersWagers, getTokenAddressWagering } from "./contractFunctions/BlockRacersWagering.contract";
import { balanceOfToken, setAllowanceToken } from "./contractFunctions/BlockRacersToken.contract";
import { defaultDeployFixture, getAccounts, isTrustedForwarder, mintingAmount } from "./contractFunctions/generalFunctions";
import { ERC2771Context } from "../typechain-types";
import { hashMessage, parseUnits, recoverAddress, ZeroAddress, solidityPacked, keccak256, getBytes, verifyMessage, toBeHex, solidityPackedKeccak256, concat, toUtf8Bytes, MessagePrefix } from "ethers";

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
        it("does not allow cancel when not created")
        it("does not allow cancel when completed")
        it("does not allow non participants to cancel")
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
            let message = solidityPacked([ "uint256", "string", "address" ], [ player1Wagers[0], "-",  player1.address]);
            const messageHash = solidityPackedKeccak256([ "uint256", "string", "address" ], [ player1Wagers[0], "-",  player1.address]);
           
            const signedMessageHashBytes = getBytes(hashMessage(messageHash))
           
            console.log("Message match (Abi encoding): ", message === await wageringContract.getMessage(player1Wagers[0], player1.address))
            console.log("Message keccak match: ", messageHash === await wageringContract.getMessageHash(player1Wagers[0], player1.address))
            console.log()

            console.log("messageHash", messageHash)

            console.log("Fetch Eth signed message:          ", await wageringContract.getSignedMessageHash(player1Wagers[0], player1.address))
            console.log()

            console.log("Hash interior:                     ", concat([
                toUtf8Bytes(MessagePrefix + "32"),
                messageHash
            ]))
            console.log("getSignedMessage:                  ", await wageringContract.getSignedMessageHash(player1Wagers[0], player1.address))
            console.log("hashMessage(messageHash):          ", hashMessage(messageHash))
            console.log("getSignedMessageInterior:          ", await wageringContract.getSignedMessageInterior(player1Wagers[0], player1.address))
            console.log("Messagehash with prefix match:     ", signedMessageHashBytes.toString() === await wageringContract.getSignedMessageHash(player1Wagers[0], player1.address))
            
            console.log("getInteriorComponents:             ", await wageringContract.getInteriorComponents(player1Wagers[0], player1.address))
            console.log("messageHash as Bytes:              ", concat([
                toUtf8Bytes(String(messageHash.length)),
            ]))
            console.log("String(signedMessageHash.length)", String(messageHash.length))

            const signedMessageHashFetched = await wageringContract.getSignedMessageHash(player1Wagers[0], player1.address)

            const creatorProof = await player1.signMessage(signedMessageHashBytes)
            const opponentProof = await player2.signMessage(signedMessageHashBytes)        

            const verifyCreatorSigner = verifyMessage(signedMessageHashBytes, creatorProof);
            const verifyOpponentSigner = verifyMessage(signedMessageHashBytes, opponentProof);
            console.log()
            console.log("Creator valid: ", verifyCreatorSigner === player1.address)
            console.log("Opponent valid: ", verifyOpponentSigner === player2.address)

            const creatorProofOnchainCheck = await wageringContract.verifySignature(
                player1.address, 
                signedMessageHashBytes, 
                creatorProof
            )
            // 1: ABI >-> Bytes
            // 2: Keccak Encoded -> Bytes32
            // 3: Length taken from bytes32
            // 4: length -> string -> to bytes
            // 5: concat prefix string, length as bytes, keccak.abi.encoded

            // Prefixed message bytes
            // Prefix:  0x19457468657265756d205369676e6564204d6573736167653a0a
            // Message: 0xbbe13e8bb5ad7012922ad63ad1164a63cab8268aed7f1fd3946ec8a72ab17186
                
            // Local message length: 66
            // Local message length bytes: 0x3636

            // bytes32 message = keccak256(abi.encodePacked(wagerId, "-", winner));
            // return bytes(Strings.toString(message.length));
            // Fetched message length: 32n
            // Fetched message length bytes: 0x3332

            // Local:           0x19457468657265756d205369676e6564204d6573736167653a0a 3636 bbe13e8bb5ad7012922ad63ad1164a63cab8268aed7f1fd3946ec8a72ab17186
            // Fetched:         0x19457468657265756d205369676e6564204d6573736167653a0a 3332 bbe13e8bb5ad7012922ad63ad1164a63cab8268aed7f1fd3946ec8a72ab17186
            // Fixed length:    0x19457468657265756d205369676e6564204d6573736167653a0a 3332 bbe13e8bb5ad7012922ad63ad1164a63cab8268aed7f1fd3946ec8a72ab17186
            // 0x42c4a6b0d21c483e354116cbbc09bfc4da6e2dfa94dab0fddbaa21aa710c9362
            // 0x3f75414aab3f21fef79c064350fc8713d2b0fdf6b71e6f74e04dd59be90a65cc
            console.log("creatorProofOnchainCheck: ", creatorProofOnchainCheck)

            const opponentProofOnchainCheck = await wageringContract.verifySignature(
                player2.address, 
                signedMessageHashFetched, 
                opponentProof
            )
            console.log("opponentProofOnchainCheck: ", opponentProofOnchainCheck)


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
