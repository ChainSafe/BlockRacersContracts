// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {ERC1155NFT, ERC1155} from "./ERC1155NFT.sol";
import {IBlockGame} from "./IBlockGame.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {
    ERC2771Context,
    Context
} from "@openzeppelin/contracts/metatx/ERC2771Context.sol";

/// @title Block Game ERC1155 contract
/// @author ChainSafe Systems, RyRy79261, Oleksii Matiiasevych
/// @notice This contract facilitates NFT asset management in Block Game
contract BlockGameAssets is
    ERC2771Context,
    ERC1155NFT
{
    IBlockGame public immutable BLOCK_GAME;

    error NotAuthorizedGameContract();

    modifier onlyBlockracers() {
        if (_msgSender() != address(BLOCK_GAME)) {
            revert NotAuthorizedGameContract();
        }
        _;
    }

    /// @dev Constructor sets token to be used and nft info
    /// @param trustedForwarder ERC2771 relayer address
    /// @param baseUri_ URI base string
    constructor(
        address trustedForwarder,
        string memory baseUri_
    ) ERC2771Context(trustedForwarder) ERC1155(baseUri_) {
        BLOCK_GAME = IBlockGame(_msgSender());
    }

    /// @dev Minting functions
    /// @notice Mints an Nft to a users wallet
    /// @param to The receiving account
    /// @return The minted token id
    function mint(
        address to
    ) external onlyBlockracers returns(uint256) {
        return _mint(to);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function uri(
        uint256 tokenId
    ) public view override returns (string memory) {
        return string(abi.encodePacked(
            super.uri(tokenId),
            BLOCK_GAME.serializeProperties(tokenId),
            '.json'
        ));
    }

    function setBaseUri(
        string memory baseUri
    ) external onlyBlockracers {
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
