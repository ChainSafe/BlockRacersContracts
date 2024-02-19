// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {
    EnumerableSet
} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

/// @title ERC1155NFT contract.
/// @author ChainSafe Systems, Oleksii Matiiasevych
/// @dev Extension of ERC1155 that turns it into a strict NFT.
/// @dev Burning is disallowed, ids have to be minted in order starting with 1 and with value of 1.
/// @dev Enumerates tokens held by each holder.
abstract contract ERC1155NFT is ERC1155 {
    using EnumerableSet for EnumerableSet.UintSet;

    mapping(address holder => EnumerableSet.UintSet tokens) private _inventory;
    uint256 private _totalSupply;

    error InvalidMintId(uint256 id);
    error InvalidMintValue(uint256 value);
    error BurningNotAllowed();

    /**
     * @dev Total number of tokens.
     */
    function totalSupply() public view virtual returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev Indicates whether any token exist with a given id, or not.
     */
    function exists(uint256 id) public view virtual returns (bool) {
        return id > 0 && id <= _totalSupply;
    }

    /**
     * @dev Returns a list of token ids held by the address.
     */
    function getInventory(address holder) public view returns (uint256[] memory) {
        return _inventory[holder].values();
    }

    function _mint(address to) internal returns (uint256) {
        uint256 tokenId = _totalSupply + 1;
        _mint(to, tokenId, 1, new bytes(0));
        return tokenId;
    }

    /**
     * @dev See {ERC1155-_update}.
     */
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal virtual override {
        super._update(from, to, ids, values);

        uint currentSupply = _totalSupply;
        if (from == address(0)) {
            for (uint256 i = 0; i < ids.length; ++i) {
                ++currentSupply;
                if (ids[i] != currentSupply) revert InvalidMintId(ids[i]);
                if (values[i] != 1) revert InvalidMintValue(values[i]);
                _inventory[to].add(currentSupply);
            }
            _totalSupply = currentSupply;
        }

        if (to == address(0)) revert BurningNotAllowed();
    }
}
