import * as codegen from "nethereum-codegen";
import {
  abi as BlockRacersAbi,
  bytecode as BlockRacersBytecode,
} from "../artifacts/contracts/BlockRacers.sol/BlockRacers.json";
import {
  abi as BlockRacersAssetsAbi,
  bytecode as BlockRacersAssetsBytecode,
} from "../artifacts/contracts/BlockRacersAssets.sol/BlockRacersAssets.json";
import {
  abi as BlockRacersTokenAbi,
  bytecode as BlockRacersTokenBytecode,
} from "../artifacts/contracts/BlockRacersToken.sol/BlockRacersToken.json";
import {
  abi as BlockRacersWageringAbi,
  bytecode as BlockRacersWageringBytecode,
} from "../artifacts/contracts/BlockRacersWagering.sol/BlockRacersWagering.json";

const basePath = "unityClasses";

// Block Racers
codegen.generateAllClasses(
  JSON.stringify(BlockRacersAbi),
  BlockRacersBytecode,
  "BlockRacers",
  "BlockRacers",
  basePath,
  0,
);

// Block Racers Token
codegen.generateAllClasses(
  JSON.stringify(BlockRacersTokenAbi),
  BlockRacersTokenBytecode,
  "BlockRacersToken",
  "BlockRacersToken",
  basePath,
  0,
);

// Block Racers Assets
codegen.generateAllClasses(
  JSON.stringify(BlockRacersAssetsAbi),
  BlockRacersAssetsBytecode,
  "BlockRacersAssets",
  "BlockRacersAssets",
  basePath,
  0,
);

// Block Racers Wager
codegen.generateAllClasses(
  JSON.stringify(BlockRacersWageringAbi),
  BlockRacersWageringBytecode,
  "BlockRacersWagering",
  "BlockRacersWagering",
  basePath,
  0,
);
