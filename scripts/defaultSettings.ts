import { parseEther } from "ethers";
import { BlockGame } from "../typechain-types/contracts/BlockGame";

export const generalSettings = {
  NFT: {
    baseUri: "https://ipfs.chainsafe.io/ipfs/",
  },
};

export const defaultGameSettings = [
  [50, 50, 50], // car levels/prices
  [20, 20, 20, 20, 20, 20, 20, 20], // engine
  [20, 20, 20, 20, 20, 20, 20, 20], // handling
  [20, 20, 20, 20, 20, 20, 20, 20], // nos
];

export const defaultGameSettingsUnits = defaultGameSettings
  .map(el => el.map(price => parseEther(price.toString())));
