// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {
    SignatureChecker
} from "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import {
    MessageHashUtils
} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {
    BitMaps
} from "@openzeppelin/contracts/utils/structs/BitMaps.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {
    SafeERC20
} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Blacklist} from "./utils/Blacklist.sol";

/// @title Block Game Wagering Contract
/// @author ChainSafe Systems, Oleksii Matiiasevych, RyRy79261
/// @notice This escrow contract holds functions used for the Block Game PVP
/// @notice wagering used in the game
contract BlockGameWagering is Blacklist {
    using SafeERC20 for IERC20;
    using BitMaps for BitMaps.BitMap;

    struct Wager {
        address opponent;
        uint96 prize;
    }

    IERC20 public immutable TOKEN;

    /// @dev Address that signs win/cancel messages
    address public server;

    /// @dev Nonce to stop replay attacks
    mapping(address signer => BitMaps.BitMap) private usedNonces;

    /// @dev Pvp wager data
    mapping(address player => Wager) private wagers;

    /// @dev Contract events
    event WagerCreated(address indexed creator, address indexed opponent, uint256 prize);
    event WagerCompleted(address indexed creator, address indexed opponent, uint256 prize);
    event WagerCancelled(address indexed creator, address indexed opponent, uint256 prize);
    event ServerUpdated();

    error InvalidOpponent();
    error InvalidPrize();
    error InvalidWager();
    error WagerInProgress();
    error InvalidOpponentSig(
        address sender,
        address opponent,
        uint256 prize,
        uint256 nonce,
        uint256 deadline
    );
    error InvalidServerSig(
        bool isWin,
        address winner,
        address loser,
        uint256 prize,
        uint256 nonce,
        uint256 deadline
    );
    error NonceAlreadyUsed(address signer, uint256 nonce);
    error SigExpired();

    /// @dev Constructor sets token to be used and nft info
    constructor(
        address trustedForwarder,
        address admin,
        IERC20 token,
        address server_
    ) Blacklist(admin, trustedForwarder) {
        TOKEN = token;
        server = server_;
    }

    function setServerAddress(address newServer) external onlyOwner() {
        server = newServer;
        emit ServerUpdated();
    }

    /// @notice Collect bets to start the match
    /// @param opponent The opponent address
    /// @param prize The bet each player places
    /// @param opponentSig The signature confiring that the opponent agreed to compete
    function startWager(
        address opponent,
        uint256 prize,
        uint256 nonce,
        uint256 deadline,
        bytes calldata opponentSig
    ) external isNotBlacklisted(_msgSender()) isNotBlacklisted(opponent) {
        address sender = _msgSender();
        if (opponent == sender) revert InvalidOpponent();
        if (prize == 0 || prize > type(uint96).max) revert InvalidPrize();
        if (wagers[opponent].prize > 0) revert WagerInProgress();
        if (wagers[sender].prize > 0) revert WagerInProgress();
        _verifyOpponent(sender, opponent, prize, nonce, deadline, opponentSig);

        wagers[opponent] = Wager(sender, uint96(prize));
        wagers[sender] = Wager(opponent, uint96(prize));

        TOKEN.safeTransferFrom(sender, address(this), prize);
        TOKEN.safeTransferFrom(opponent, address(this), prize);

        emit WagerCreated(sender, opponent, prize);
    }

    /// @notice Claim PVP Winnings
    /// @param serverSig The signature confiring that the sender is the winner
    function completeWager(uint256 nonce, uint256 deadline, bytes calldata serverSig) external {
        address sender = _msgSender();
        (address opponent, uint256 prize) = getWager(sender);

        if (prize == 0) revert InvalidWager();
        delete wagers[sender];
        delete wagers[opponent];

        _verifyWinner(sender, opponent, prize, nonce, deadline, serverSig);

        TOKEN.safeTransfer(sender, prize * 2);
        emit WagerCompleted(sender, opponent, prize);
    }

    /// @notice Cancel Wager and return the bets
    /// @param serverSig The signature confiring the cancellation
    function cancelWager(uint256 nonce, uint256 deadline, bytes calldata serverSig) external {
        address sender = _msgSender();
        (address opponent, uint256 prize) = getWager(sender);

        if (prize == 0) revert InvalidWager();
        delete wagers[sender];
        delete wagers[opponent];

        _verifyCancel(sender, opponent, prize, nonce, deadline, serverSig);

        TOKEN.safeTransfer(sender, prize);
        TOKEN.safeTransfer(opponent, prize);
        emit WagerCancelled(sender, opponent, prize);
    }

    function getWager(address player) public view returns (address opponent, uint256 prize) {
        Wager memory wager = wagers[player];
        if (wager.prize == 0) revert InvalidWager();
        return (wager.opponent, wager.prize);
    }

    function _verifyOpponent(
        address sender,
        address opponent,
        uint256 prize,
        uint256 nonce,
        uint256 deadline,
        bytes calldata opponentSig
    ) internal virtual {
        if (!SignatureChecker.isValidSignatureNow(
                opponent,
                MessageHashUtils.toEthSignedMessageHash(
                    keccak256(abi.encodePacked(
                        sender, prize, nonce, deadline, address(this), block.chainid
                    ))
                ),
                opponentSig
        )) {
            revert InvalidOpponentSig(sender, opponent, prize, nonce, deadline);
        }
        if (usedNonces[opponent].get(nonce)) revert NonceAlreadyUsed(opponent, nonce);
        usedNonces[opponent].set(nonce);
        if (passed(deadline)) revert SigExpired();
    }

    function _verifyWinner(
        address sender,
        address opponent,
        uint256 prize,
        uint256 nonce,
        uint256 deadline,
        bytes calldata serverSig
    ) internal {
        _verifyServer(true, sender, opponent, prize, nonce, deadline, serverSig);
    }

    function _verifyCancel(
        address sender,
        address opponent,
        uint256 prize,
        uint256 nonce,
        uint256 deadline,
        bytes calldata serverSig
    ) internal {
        _verifyServer(false, sender, opponent, prize, nonce, deadline, serverSig);
    }

    function _verifyServer(
        bool isWin,
        address winner,
        address loser,
        uint256 prize,
        uint256 nonce,
        uint256 deadline,
        bytes calldata serverSig
    ) internal virtual {
        address serverAddress = server;
        if (!SignatureChecker.isValidSignatureNow(
                serverAddress,
                MessageHashUtils.toEthSignedMessageHash(
                    keccak256(abi.encodePacked(
                        isWin, winner, loser, prize, nonce, deadline, address(this), block.chainid
                    ))
                ),
                serverSig
        )) {
            revert InvalidServerSig(isWin, winner, loser, prize, nonce, deadline);
        }
        if (usedNonces[serverAddress].get(nonce)) revert NonceAlreadyUsed(serverAddress, nonce);
        usedNonces[serverAddress].set(nonce);
        if (passed(deadline)) revert SigExpired();
    }

    function passed(uint256 timestamp) internal view returns(bool) {
        return timestamp < block.timestamp;
    }
}

contract BlockGameWageringTest is BlockGameWagering {
    /// @dev Only for testnets. Skips signatures verification.
    constructor(
        address trustedForwarder,
        address admin,
        IERC20 token,
        address server_
    ) BlockGameWagering(trustedForwarder, admin, token, server_) {}

    function _verifyOpponent(
        address /*sender*/,
        address /*opponent*/,
        uint256 /*prize*/,
        uint256 /*nonce*/,
        uint256 /*deadline*/,
        bytes calldata /*opponentSig*/
    ) internal pure override {
        return;
    }

    function _verifyServer(
        bool /*isWin*/,
        address /*winner*/,
        address /*loser*/,
        uint256 /*prize*/,
        uint256 /*nonce*/,
        uint256 /*deadline*/,
        bytes calldata /*serverSig*/
    ) internal pure override {
        return;
    }
}
