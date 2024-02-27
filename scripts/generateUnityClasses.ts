import * as codegen from "nethereum-codegen";
import {
  abi as BlockGameAbi,
  bytecode as BlockGameBytecode,
} from "../artifacts/contracts/BlockGame.sol/BlockGame.json";
import {
  abi as BlockGameAssetsAbi,
  bytecode as BlockGameAssetsBytecode,
} from "../artifacts/contracts/BlockGameAssets.sol/BlockGameAssets.json";
import {
  abi as BlockGameTokenAbi,
  bytecode as BlockGameTokenBytecode,
} from "../artifacts/contracts/BlockGameToken.sol/BlockGameToken.json";
import {
  abi as BlockGameWageringAbi,
  bytecode as BlockGameWageringBytecode,
} from "../artifacts/contracts/BlockGameWagering.sol/BlockGameWagering.json";

const basePath = "unityClasses";

// Block Game
codegen.generateAllClasses(
  JSON.stringify(BlockGameAbi),
  BlockGameBytecode,
  "BlockGame",
  "BlockGame",
  basePath,
  0,
);

// Block Game Token
codegen.generateAllClasses(
  JSON.stringify(BlockGameTokenAbi),
  BlockGameTokenBytecode,
  "BlockGameToken",
  "BlockGameToken",
  basePath,
  0,
);

// Block Game Assets
codegen.generateAllClasses(
  JSON.stringify(BlockGameAssetsAbi),
  BlockGameAssetsBytecode,
  "BlockGameAssets",
  "BlockGameAssets",
  basePath,
  0,
);

// Block Game Wager
codegen.generateAllClasses(
  JSON.stringify(BlockGameWageringAbi),
  BlockGameWageringBytecode,
  "BlockGameWagering",
  "BlockGameWagering",
  basePath,
  0,
);
