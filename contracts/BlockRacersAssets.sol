// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {ERC1155NFT, ERC1155} from "./ERC1155NFT.sol";
import {IBlockRacers} from "./IBlockRacers.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {
    ERC2771Context,
    Context
} from "@openzeppelin/contracts/metatx/ERC2771Context.sol";

/// @title Block Racers ERC1155 contract
/// @author ChainSafe Systems, RyRy79261, Oleksii Matiiasevych
/// @notice This contract facilitates NFT asset management in Block Racers
contract BlockRacersAssets is
    ERC2771Context,
    ERC1155NFT
{
    IBlockRacers public immutable BLOCK_RACERS;

    error NotAuthorizedGameContract();

    modifier onlyBlockracers() {
        if (_msgSender() != address(BLOCK_RACERS)) {
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
        BLOCK_RACERS = IBlockRacers(_msgSender());
    }

    /// @dev Minting functions
    /// @notice Mints an Nft to a users wallet
    /// @param to The receiving account
    /// @return The minted token id
    function mint(
        address to
    ) external onlyBlockracers returns(uint256) {
        uint256 tokenId = totalSupply() + 1;
        _mint(to, tokenId, 1, new bytes(0));
        return tokenId;
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
            BLOCK_RACERS.serializeProperties(tokenId),
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
