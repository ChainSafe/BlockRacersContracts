// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {BlockGame, OBJECT_ITEM} from "./BlockGame.sol";

contract UIHelper {
    BlockGame public immutable BLOCK_GAME;

    constructor (BlockGame blockGame) {
        BLOCK_GAME = blockGame;
    }

    function getUserMintedTypes(address account) public view returns(bool[] memory types) {
        uint256 objectTypes = BLOCK_GAME.getItemData(OBJECT_ITEM).length;
        types = new bool[](objectTypes);
        uint256[] memory objects = BLOCK_GAME.getUserObjects(account);
        uint256 len = objects.length;
        for (uint256 i = 0; i < len; ++i) {
            uint8[] memory stats = BLOCK_GAME.getObjectStats(objects[i]);
            types[stats[OBJECT_ITEM]] = true;
        }

        return types;
    }

    function getUserObjectsByTypeWithStats(address account) public view returns(uint256[][] memory objectsStats) {
        uint256 objectTypes = BLOCK_GAME.getItemData(OBJECT_ITEM).length;
        uint256 items = BLOCK_GAME.getItemsCount();
        objectsStats = new uint256[][](objectTypes);
        for (uint256 i = 0; i < objectTypes; ++i) {
            objectsStats[i] = new uint256[](items);
        }
        uint256[] memory objects = BLOCK_GAME.getUserObjects(account);
        for (uint256 i = 0; i < objects.length; ++i) {
            uint8[] memory stats = BLOCK_GAME.getObjectStats(objects[i]);
            uint256 objectType = stats[OBJECT_ITEM];
            objectsStats[objectType][OBJECT_ITEM] = objects[i];
            for (uint256 j = 1; j < items; ++j) {
                objectsStats[objectType][j] = stats[j];
            }
        }

        return objectsStats;
    }
}
