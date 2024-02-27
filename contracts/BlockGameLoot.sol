// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {ERC1155Enumerable, ERC1155} from "./ERC1155Enumerable.sol";
import {IBlockGame} from "./IBlockGame.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {
    ERC2771Context,
    Context
} from "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/// @title Block Game Loot contract
/// @author ChainSafe Systems, RyRy79261, Oleksii Matiiasevych
/// @notice This contract facilitates NFT asset management in Block Game
contract BlockGameLoot is
    ERC2771Context,
    ERC1155Enumerable,
    Ownable
{
    error TokenDoesNotExist();

    /// @dev Constructor sets token to be used and nft info
    /// @param trustedForwarder ERC2771 relayer address
    /// @param baseUri_ URI base string
    constructor(
        address trustedForwarder,
        address owner_,
        string memory baseUri_
    ) ERC2771Context(trustedForwarder) ERC1155(baseUri_) Ownable(owner_) {}

    /// @dev Minting functions
    /// @notice Mints NFTs to target wallet
    /// @param to The receiving account
    /// @param ids The IDs to mint
    /// @param values The respective values for each ID to mint
    /// @param data The transfer data to be called on the receiving account contract
    function mintBatch(
        address to, uint256[] memory ids, uint256[] memory values, bytes memory data
    ) external onlyOwner {
        _mintBatch(to, ids, values, data);
    }

    function uri(
        uint256 tokenId
    ) public view override returns (string memory) {
        if (!exists(tokenId)) revert TokenDoesNotExist();
        return string(abi.encodePacked(
            super.uri(tokenId),
            Strings.toString(tokenId),
            '.json'
        ));
    }

    function setBaseUri(
        string memory baseUri
    ) external onlyOwner {
        _setURI(baseUri);
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
