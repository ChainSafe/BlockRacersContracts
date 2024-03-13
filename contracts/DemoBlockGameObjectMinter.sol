// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {BlockGame, OBJECT_ITEM, BlockGameAssets} from "./BlockGame.sol";
import {BlockGameTokenTest} from "./BlockGameToken.sol";
import {ERC1155Holder} from "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

contract DemoBlockGameObjectMinter is ERC1155Holder {
    BlockGame public immutable BLOCK_GAME;
    BlockGameTokenTest public immutable BLOCK_GAME_TOKEN;
    BlockGameAssets public immutable BLOCK_GAME_ASSETS;

    constructor (BlockGame blockGame) {
        BLOCK_GAME = blockGame;
        BlockGameTokenTest token = BlockGameTokenTest(address(blockGame.TOKEN()));
        BLOCK_GAME_TOKEN = token;
        token.approve(address(blockGame), type(uint256).max);
        BLOCK_GAME_ASSETS = blockGame.ASSETS();
    }

    function mint(address to, uint8 objectType, uint8[] memory levels) external {
        BLOCK_GAME_TOKEN.mint(address(this));
        BLOCK_GAME.mintObject(objectType);
        uint256[] memory inv = BLOCK_GAME.getUserObjects(address(this));
        uint256 id = inv[inv.length - 1];
        for (uint8 item = 0; item < levels.length; ++item) {
            uint8 level = levels[item];
            for (uint256 i = 0; i < level; ++i) {
                BLOCK_GAME.upgrade(id, item + 1);
            }
        }
        BLOCK_GAME_ASSETS.safeTransferFrom(address(this), to, id, 1, "0x");
    }
}
