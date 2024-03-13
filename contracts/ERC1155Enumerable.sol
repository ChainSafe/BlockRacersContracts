// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {ERC1155Supply, ERC1155} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {
    EnumerableSet
} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

/// @title ERC1155Enumerable contract.
/// @author ChainSafe Systems, Oleksii Matiiasevych
/// @dev Extension of ERC1155 that indexes balances of all users.
/// @dev Enumerates tokens held by each holder.
abstract contract ERC1155Enumerable is ERC1155Supply {
    using EnumerableSet for EnumerableSet.UintSet;

    mapping(address holder => EnumerableSet.UintSet tokens) private _inventory;

    /**
     * @dev Returns a list of token ids and balances held by the address.
     */
    function getInventory(address holder) public view returns (uint256[2][] memory) {
        uint256[] memory ids = _inventory[holder].values();
        uint256 len = ids.length;
        uint256[2][] memory result = new uint256[2][](len);
        for (uint i = 0; i < len; ++i) {
            uint256 id = ids[i];
            result[i][0] = id;
            result[i][1] = balanceOf(holder, id);
        }

        return result;
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

        uint256 len = ids.length;
        for (uint256 i = 0; i < len; ++i) {
            uint256 id = ids[i];
            if (from != address(0) && balanceOf(from, id) == 0) {
                _inventory[from].remove(id);
            }
            if (to != address(0)) {
                _inventory[to].add(id);
            }
        }
    }
}
