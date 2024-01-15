// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {
    ReentrancyGuard
} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {
    SignatureChecker
} from "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import {
    ERC2771Context,
    Context
} from "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import {
    MessageHashUtils
} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/// @title Block Racers Token Contract
/// @author RyRy79261, Sneakz
/// @notice This contract manages the ERC20 token used within the Block Racers game
contract BlockRacersToken is ERC20, ERC2771Context, Ownable, ReentrancyGuard {
    /// @dev Wallet that auth signatures come from
    address public issuerAccount;

    /// @dev Nonce to stop replay attacks
    mapping(address => uint256) private _playerNonce;

    event NewIssuer(address newIssuer);

    error InvalidIssuer(address proposedIssuer);
    error PermitInvalid(bytes permit, address player, uint256 amount);

    modifier onlyValidPermit(
        bytes memory permit,
        address player,
        uint256 amount
    ) {
        if (
            !SignatureChecker.isValidSignatureNow(
                issuerAccount,
                MessageHashUtils.toEthSignedMessageHash(
                    keccak256(
                        abi.encodePacked(_playerNonce[player], player, amount)
                    )
                ),
                permit
            )
        ) revert PermitInvalid(permit, player, amount);

        _;
    }

    constructor(
        address trustedForwarder,
        address owner,
        address issuerAccount_,
        uint256 initialMint_
    )
        ERC20("BlockRacersToken", "RACE")
        ERC2771Context(trustedForwarder)
        Ownable(owner)
    {
        issuerAccount = issuerAccount_;

        // TODO: If migrated to a mainnet, this logic should be expanded depending on distribution
        if (initialMint_ > 0) {
            _mint(issuerAccount_, initialMint_);
        }
    }

    /// @dev Used to mint tokens to an address
    /// @param to The address to mint tokens to
    /// @param amount The amount of tokens to mint to the address
    /// @param permit The signed permit to allow for minting tokens
    /// @return true if  mint is successful
    function mint(
        address to,
        uint256 amount,
        bytes memory permit
    ) external onlyValidPermit(permit, to, amount) nonReentrant returns (bool) {
        _playerNonce[_msgSender()]++;
        _mint(to, amount);
        return true;
    }

    function setNewIssuerAccount(address newIssuer) external onlyOwner {
        if (newIssuer == address(0) || newIssuer == issuerAccount)
            revert InvalidIssuer(newIssuer);

        issuerAccount = newIssuer;
        emit NewIssuer(issuerAccount);
    }

    function getPlayerNonce(address player) external view returns (uint256) {
        return _playerNonce[player];
    }

    /**
     * @dev Override required as inheritance was indeterminant for which function to use
     */
    function _msgSender()
        internal
        view
        override(ERC2771Context, Context)
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
        override(ERC2771Context, Context)
        returns (bytes calldata)
    {
        return ERC2771Context._msgData();
    }
}
