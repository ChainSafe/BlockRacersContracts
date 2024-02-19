// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

interface IBlockGame {
    function serializeProperties(
        uint256 carId
    ) external view returns (string memory);
}
