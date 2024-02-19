// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {BlockGame} from "./BlockGame.sol";

contract UIHelper {
    BlockGame public immutable BLOCK_GAME;

    constructor (BlockGame blockGame) {
        BLOCK_GAME = blockGame;
    }

    function getUserMintedTypes(address account) public view returns(bool[] memory types) {
        uint256[] memory prices = BLOCK_GAME.getItemData(0);
        types = new bool[](prices.length);
        uint256[] memory objects = BLOCK_GAME.getUserObjects(account);
        uint256 len = objects.length;
        for (uint256 i = 0; i < len; ++i) {
            uint8[4] memory stats = BLOCK_GAME.getObjectStats(objects[i]);
            types[stats[0]] = true;
        }

        return types;
    }

    function getUserObjectsByTypeWithStats(address account) public view returns(uint256[4][] memory objectsStats) {
        uint256[] memory prices = BLOCK_GAME.getItemData(0);
        objectsStats = new uint256[4][](prices.length);
        uint256[] memory objects = BLOCK_GAME.getUserObjects(account);
        uint256 len = objects.length;
        for (uint256 i = 0; i < len; ++i) {
            uint8[4] memory stats = BLOCK_GAME.getObjectStats(objects[i]);
            objectsStats[stats[0]][0] = objects[i];
            objectsStats[stats[0]][1] = stats[1];
            objectsStats[stats[0]][2] = stats[2];
            objectsStats[stats[0]][3] = stats[3];
        }

        return objectsStats;
    }
}
