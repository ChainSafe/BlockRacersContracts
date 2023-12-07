// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// $$$$$$$\  $$\       $$$$$$\   $$$$$$\  $$\   $$\       $$$$$$$\   $$$$$$\   $$$$$$\  $$$$$$$$\ $$$$$$$\   $$$$$$\  
// $$  __$$\ $$ |     $$  __$$\ $$  __$$\ $$ | $$  |      $$  __$$\ $$  __$$\ $$  __$$\ $$  _____|$$  __$$\ $$  __$$\ 
// $$ |  $$ |$$ |     $$ /  $$ |$$ /  \__|$$ |$$  /       $$ |  $$ |$$ /  $$ |$$ /  \__|$$ |      $$ |  $$ |$$ /  \__|
// $$$$$$$\ |$$ |     $$ |  $$ |$$ |      $$$$$  /        $$$$$$$  |$$$$$$$$ |$$ |      $$$$$\    $$$$$$$  |\$$$$$$\  
// $$  __$$\ $$ |     $$ |  $$ |$$ |      $$  $$<         $$  __$$< $$  __$$ |$$ |      $$  __|   $$  __$$<  \____$$\ 
// $$ |  $$ |$$ |     $$ |  $$ |$$ |  $$\ $$ |\$$\        $$ |  $$ |$$ |  $$ |$$ |  $$\ $$ |      $$ |  $$ |$$\   $$ |
// $$$$$$$  |$$$$$$$$\ $$$$$$  |\$$$$$$  |$$ | \$$\       $$ |  $$ |$$ |  $$ |\$$$$$$  |$$$$$$$$\ $$ |  $$ |\$$$$$$  |
// \_______/ \________|\______/  \______/ \__|  \__|      \__|  \__|\__|  \__| \______/ \________|\__|  \__| \______/ 

/// @title Block Racers Wagering Contract
/// @author RyRy79261
/// @notice This escrow contract holds functions used for the Block Racers wagering used in the game at https://github.com/Chainsafe/BlockRacers
contract BlockRacersWagering is Context, ReentrancyGuard {
    using SafeERC20 for IERC20;
    enum WagerState { NOT_STARTED, CREATED, ACCEPTED, COMPLETED, CANCELLED }

    struct Wager {
        uint256 prize;
        address creator;
        address opponent;
        address winner;
        WagerState state; // Could infer state from properties, though for cancelled might be tricky
    }

    /// @dev Initializes the ERC20 token
    IERC20 public immutable token;
    
    uint256 public latestWagerId;
    
    /// @dev Pvp wager data
    mapping(uint256 => Wager) private wagers;
    /// @dev Used for tracking wagers that a player has engaged in
    mapping(address => uint256[]) private playerWagers;
    
    /// @dev Contract events
    event WagerCreated(uint256 indexed wagerId, address indexed creator, uint256 prize);
    event WagerAccepted(uint256 indexed wagerId, address indexed opponent);
    event WagerCancelled(uint256 indexed wagerId, address cancelledBy);
    event WagerCompleted(uint256 indexed wagerId, address indexed winner);

    error WagerStateIncorrect(uint256 wagerId, WagerState currentState, WagerState expected);
    error WagerCantBeCancelled(uint256 wagerId, WagerState currentState);
    error OnlyParticipantsCanCancel(uint256 wagerId, address requestor);

    error OpponentCantBeChallenger(uint256 wagerId, address opponent);
    error PlayerSignatureInvalid(uint256 wagerId, address winner, bytes creatorProof, bytes opponentProof);

    modifier wagerStateMustBe(WagerState state, uint256 wagerId) {
        Wager memory wager = wagers[wagerId];
        if (wager.state != state) 
            revert WagerStateIncorrect(wagerId, wager.state, state);
        _;
    }

    /// @dev Constructor sets token to be used and nft info, input the RACE token address here on deployment
    constructor(
        IERC20 token_
    ) {
        token = token_;
    }

    
    /// @notice PVP and wager tokens
    /// @param prize The amount of tokens being wagered
    /// @return true if successful
    function createPvpWager(uint256 prize) 
        external 
        nonReentrant() 
        returns (bool) {
        address creator = _msgSender();

        // TODO: Check success
        token.safeTransferFrom(creator, address(this), prize);

        ++latestWagerId;
        wagers[latestWagerId] = Wager(prize, creator, address(0), address(0), WagerState.CREATED);
        playerWagers[creator].push(latestWagerId);
        emit WagerCreated(latestWagerId, creator, prize);
        return true;
    }

    /// @notice PVP and wager tokens
    /// @param wagerId The ID of the wager being accepted
    /// @return true if successful
    function acceptWager(uint256 wagerId) 
        external 
        wagerStateMustBe(WagerState.CREATED, wagerId)
        nonReentrant() 
        returns (bool) {
        address opponentAddress = _msgSender();

        Wager storage wager = wagers[wagerId];

        if (wager.creator == opponentAddress) 
            revert OpponentCantBeChallenger(wagerId, opponentAddress);

        // TODO: Check success
        token.safeTransferFrom(opponentAddress, address(this), wager.prize);

        wager.opponent = opponentAddress;
        wager.state = WagerState.ACCEPTED;
        playerWagers[opponentAddress].push(wagerId);
       
        emit WagerAccepted(wagerId, opponentAddress);
        return true;
    }

    /// @notice Claim PVP Winnings
    /// @param wagerId The id of the wager
    /// @param winner The winner address
    /// @param creatorProof The signature from creator which should have signed the winner address
    /// @param opponentProof The signature from challenger which should have signed the winner address
    /// @return true if successful
    function completeWager(uint256 wagerId, address winner, bytes memory creatorProof, bytes memory opponentProof) 
        external 
        wagerStateMustBe(WagerState.ACCEPTED, wagerId)
        nonReentrant() 
        returns (bool) {
        Wager storage wager = wagers[wagerId];
        bytes32 message = MessageHashUtils.toEthSignedMessageHash(keccak256(abi.encodePacked(wagerId, winner)));
        bool creatorProofValid = SignatureChecker.isValidSignatureNow(
            wager.creator,
            message,
            creatorProof);

        bool opponentProofValid = SignatureChecker.isValidSignatureNow(
            wager.opponent,
            message,
            opponentProof);

        if (!creatorProofValid || !opponentProofValid) 
            revert PlayerSignatureInvalid(wagerId, winner, creatorProof, opponentProof);
        

        wager.winner = winner;
        wager.state = WagerState.COMPLETED;
        // Both the creator & the opponent transfered the wager tokens to this contract,
        // so this functionally returns the winner's stake and transfers the losers stake to the winner in one transaction
        // TODO: check for success
        token.transferFrom(address(this), winner, wager.prize * 2);
        emit WagerCompleted(wagerId, winner);
        return true;
    }

    /// @notice Cancel Wager
    /// @param wagerId The id of the wager
    /// @return true if successful
    function cancelWager(uint256 wagerId) 
        external 
        nonReentrant() 
        returns (bool) {
        Wager storage wager = wagers[wagerId];

        if (wager.state != WagerState.CREATED || wager.state != WagerState.ACCEPTED)
            revert WagerCantBeCancelled(wagerId, wager.state);

        address requestor = _msgSender();

        if (
            ((wager.state == WagerState.CREATED || wager.state == WagerState.ACCEPTED) && wager.creator == requestor) ||
            (wager.state == WagerState.ACCEPTED && wager.opponent == requestor)
        ) {

            // changing the wager state before transfers prevents replay attacks if possible
            if (wager.state == WagerState.CREATED) {
                wager.state = WagerState.CANCELLED;
                // TODO: check for success
                token.transferFrom(address(this), wager.creator, wager.prize);
            } else {
                wager.state = WagerState.CANCELLED;
                // TODO: check for success
                token.transferFrom(address(this), wager.creator, wager.prize);
                token.transferFrom(address(this), wager.opponent, wager.prize);
            }
        }  else {
            revert OnlyParticipantsCanCancel(wagerId, requestor);
        }

        emit WagerCancelled(wagerId, requestor);
        return true;
    }
}