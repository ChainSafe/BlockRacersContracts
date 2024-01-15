// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {
    ReentrancyGuard
} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {
    SignatureChecker
} from "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import {
    MessageHashUtils
} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {
    SafeERC20
} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {
    ERC2771Context
} from "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import {Blacklist} from "./utils/Blacklist.sol";

/// @title Block Racers Wagering Contract
/// @author RyRy79261
/// @notice This escrow contract holds functions used for the Block Racers
/// wagering used in the game
contract BlockRacersWagering is ERC2771Context, ReentrancyGuard, Blacklist {
    using SafeERC20 for IERC20;

    enum WagerState {
        NOT_STARTED,
        CREATED,
        ACCEPTED,
        COMPLETED,
        CANCELLED
    }

    struct Wager {
        uint256 prize;
        address creator;
        address opponent;
        address winner;
        WagerState state; // Could infer state from properties, though for cancelled might be tricky
    }

    IERC20 public immutable token;
    uint256 public latestWagerId;

    /// @dev Pvp wager data
    mapping(uint256 => Wager) private _wagers;
    /// @dev Used for tracking wagers that a player has engaged in
    mapping(address => uint256[]) private _playerWagers;

    /// @dev Contract events
    event WagerCreated(
        uint256 indexed wagerId,
        address indexed creator,
        uint256 prize
    );
    event WagerAccepted(uint256 indexed wagerId, address indexed opponent);
    event WagerCancelled(uint256 indexed wagerId, address cancelledBy);
    event WagerCompleted(uint256 indexed wagerId, address indexed winner);

    error WagerStateIncorrect(
        uint256 wagerId,
        WagerState currentState,
        WagerState expected
    );
    error WagerCantBeCancelled(uint256 wagerId, WagerState currentState);
    error OnlyParticipantsCanCancel(uint256 wagerId, address requestor);

    error OpponentCantBeChallenger(uint256 wagerId, address opponent);
    error WinnerMustBeParticipant(uint256 wagerId, address winner);
    error PlayerSignatureInvalid(
        uint256 wagerId,
        address winner,
        bytes32 message,
        bytes creatorProof,
        bytes opponentProof
    );

    modifier wagerStateMustBe(WagerState state, uint256 wagerId) {
        Wager memory wager = _wagers[wagerId];
        if (wager.state != state)
            revert WagerStateIncorrect(wagerId, wager.state, state);
        _;
    }

    /// @dev Constructor sets token to be used and nft info
    constructor(
        address trustedForwarder,
        address admin_,
        IERC20 token_
    ) Blacklist(admin_, trustedForwarder) {
        token = token_;
    }

    /// @notice PVP and wager tokens
    /// @param prize The amount of tokens being wagered
    /// @return true if successful
    function createWager(
        uint256 prize
    ) external isNotBlacklisted(_msgSender()) nonReentrant returns (bool) {
        address creator = _msgSender();

        token.safeTransferFrom(creator, address(this), prize);

        ++latestWagerId;
        _wagers[latestWagerId] = Wager(
            prize,
            creator,
            address(0),
            address(0),
            WagerState.CREATED
        );
        _playerWagers[creator].push(latestWagerId);
        emit WagerCreated(latestWagerId, creator, prize);
        return true;
    }

    /// @notice PVP and wager tokens
    /// @param wagerId The ID of the wager being accepted
    /// @return true if successful
    function acceptWager(
        uint256 wagerId
    )
        external
        isNotBlacklisted(_msgSender())
        wagerStateMustBe(WagerState.CREATED, wagerId)
        nonReentrant
        returns (bool)
    {
        address opponentAddress = _msgSender();

        Wager storage wager = _wagers[wagerId];

        if (wager.creator == opponentAddress)
            revert OpponentCantBeChallenger(wagerId, opponentAddress);

        token.safeTransferFrom(opponentAddress, address(this), wager.prize);

        wager.opponent = opponentAddress;
        wager.state = WagerState.ACCEPTED;
        _playerWagers[opponentAddress].push(wagerId);

        emit WagerAccepted(wagerId, opponentAddress);
        return true;
    }

    /// @notice Claim PVP Winnings
    /// @param wagerId The id of the wager
    /// @param winner The winner address
    /// @param creatorProof The signature from creator with the winner address
    /// @param opponentProof The signature from challenger with the winner address
    /// @return true if successful
    function completeWager(
        uint256 wagerId,
        address winner,
        bytes memory creatorProof,
        bytes memory opponentProof
    )
        external
        wagerStateMustBe(WagerState.ACCEPTED, wagerId)
        nonReentrant
        returns (bool)
    {
        Wager storage wager = _wagers[wagerId];

        if (winner != wager.creator && winner != wager.opponent)
            revert WinnerMustBeParticipant(wagerId, winner);

        bytes32 message = MessageHashUtils.toEthSignedMessageHash(
            keccak256(abi.encodePacked(wagerId, "-", winner))
        );

        bool creatorProofValid = SignatureChecker.isValidSignatureNow(
            wager.creator,
            message,
            creatorProof
        );

        bool opponentProofValid = SignatureChecker.isValidSignatureNow(
            wager.opponent,
            message,
            opponentProof
        );

        if (!creatorProofValid || !opponentProofValid)
            revert PlayerSignatureInvalid(
                wagerId,
                winner,
                message,
                creatorProof,
                opponentProof
            );

        wager.winner = winner;
        wager.state = WagerState.COMPLETED;
        token.safeTransfer(winner, wager.prize * 2);
        emit WagerCompleted(wagerId, winner);
        return true;
    }

    /// @notice Cancel Wager
    /// @param wagerId The id of the wager
    /// @return true if successful
    function cancelWager(
        uint256 wagerId
    ) external isNotBlacklisted(_msgSender()) nonReentrant returns (bool) {
        Wager storage wager = _wagers[wagerId];

        if (
            wager.state != WagerState.CREATED &&
            wager.state != WagerState.ACCEPTED
        ) revert WagerCantBeCancelled(wagerId, wager.state);

        address requestor = _msgSender();

        if (
            ((wager.state == WagerState.CREATED ||
                wager.state == WagerState.ACCEPTED) &&
                wager.creator == requestor) ||
            (wager.state == WagerState.ACCEPTED && wager.opponent == requestor)
        ) {
            // changing the wager state before transfers prevents replay attacks if possible
            if (wager.state == WagerState.CREATED) {
                wager.state = WagerState.CANCELLED;
                token.safeTransfer(wager.creator, wager.prize);
            } else {
                wager.state = WagerState.CANCELLED;
                token.safeTransfer(wager.creator, wager.prize);
                token.safeTransfer(wager.opponent, wager.prize);
            }
        } else {
            revert OnlyParticipantsCanCancel(wagerId, requestor);
        }

        emit WagerCancelled(wagerId, requestor);
        return true;
    }

    /// @notice Cancel Wager
    /// @param wagerId The id of the wager
    /// @return true if successful
    function adminCancelWager(
        uint256 wagerId
    ) external onlyOwner nonReentrant returns (bool) {
        Wager storage wager = _wagers[wagerId];

        if (wager.state == WagerState.CREATED) {
            wager.state = WagerState.CANCELLED;
            token.safeTransfer(wager.creator, wager.prize);
        } else if (wager.state == WagerState.ACCEPTED) {
            wager.state = WagerState.CANCELLED;
            token.safeTransfer(wager.creator, wager.prize);
            token.safeTransfer(wager.opponent, wager.prize);
        } else {
            revert WagerCantBeCancelled(wagerId, wager.state);
        }

        emit WagerCancelled(wagerId, _msgSender());
        return true;
    }

    function getWager(uint256 wagerId) external view returns (Wager memory) {
        return _wagers[wagerId];
    }

    function getPlayersWagers(
        address player
    ) external view returns (uint256[] memory) {
        return _playerWagers[player];
    }

    /**
     * @dev Override required as inheritance was indeterminant for which function to use
     */
    function _msgSender()
        internal
        view
        override(ERC2771Context, Blacklist)
        returns (address sender)
    {
        return ERC2771Context._msgSender();
    }

    /**
     * @dev Override required as inheritance was indeterminant for which function to use
     */
    function _msgData()
        internal
        view
        override(ERC2771Context, Blacklist)
        returns (bytes calldata)
    {
        return ERC2771Context._msgData();
    }
}
