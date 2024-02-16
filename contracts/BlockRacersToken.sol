// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {
    BitMaps
} from "@openzeppelin/contracts/utils/structs/BitMaps.sol";
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
/// @author ChainSafe Systems, RyRy79261, Sneakz, Oleksii Matiiasevych
/// @notice This contract manages the ERC20 token used within the Block Racers game
contract BlockRacersToken is ERC20, ERC2771Context, Ownable {
    using BitMaps for BitMaps.BitMap;

    /// @dev Wallet that auth signatures come from
    address public issuerAccount;

    /// @dev Nonce to stop replay attacks
    BitMaps.BitMap private _usedNonces;

    event NewIssuer(address newIssuer);

    error InvalidIssuer(address proposedIssuer);
    error NonceAlreadyUsed(uint256 nonce);
    error PermitInvalid(address player, uint256 amount, uint256 nonce, bytes permit);

    modifier onlyValidPermit(
        address player,
        uint256 amount,
        uint256 nonce,
        bytes memory permit
    ) {
        if (!SignatureChecker.isValidSignatureNow(
                issuerAccount,
                MessageHashUtils.toEthSignedMessageHash(
                    keccak256(abi.encodePacked(
                        player, amount, nonce, address(this), block.chainid
                    ))
                ),
                permit
        )) {
            revert PermitInvalid(player, amount, nonce, permit);
        }
        if (_usedNonces.get(nonce)) revert NonceAlreadyUsed(nonce);
        _usedNonces.set(nonce);
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
    /// @param nonce The unique nonce for the signature
    /// @param permit The signed permit to allow for minting tokens
    function mint(
        address to,
        uint256 amount,
        uint256 nonce,
        bytes memory permit
    ) external onlyValidPermit(to, amount, nonce, permit) {
        _mint(to, amount);
    }

    function setNewIssuerAccount(address newIssuer) external onlyOwner {
        if (newIssuer == address(0) || newIssuer == issuerAccount) {
            revert InvalidIssuer(newIssuer);
        }

        issuerAccount = newIssuer;
        emit NewIssuer(issuerAccount);
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
