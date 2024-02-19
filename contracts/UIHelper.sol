// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {BlockRacers} from "./BlockRacers.sol";

contract UIHelper {
    BlockRacers public immutable BLOCK_RACERS;

    constructor (BlockRacers bs) {
        BLOCK_RACERS = bs;
    }

    function getUserMintedTypes(address account) public view returns(bool[] memory types) {
        uint256[] memory prices = BLOCK_RACERS.getItemData(BlockRacers.GameItem.CAR);
        types = new bool[](prices.length);
        uint256[] memory cars = BLOCK_RACERS.getUserCars(account);
        uint256 len = cars.length;
        for (uint256 i = 0; i < len; ++i) {
            uint8[4] memory stats = BLOCK_RACERS.getCarStats(cars[i]);
            types[stats[0]] = true;
        }

        return types;
    }
}
