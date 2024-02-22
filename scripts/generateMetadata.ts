import fs from "node:fs/promises";
import metadata from "./metadata/index";
import { CartesianProduct } from 'js-combinatorics';

const gameId = process.env.GAME_ID;
const { items, objectSpecs } = metadata[gameId];

if (!items) {
  throw new Error(`GAME_ID should be set in the env and resolve to a config from scripts/metadata/{GAME_ID}/config.ts`);
}

const metadataTemplate = {
  "name": "",
  "description": "",
  "image": "",
  "attributes": [],
};

metadataTemplate.attributes = items.map(trait => ({
  trait_type: trait,
  value: 0,
}));

async function main() {
  const prices = process.env.PRICES.split("|")
    .map(itemPrices => itemPrices.split(","));
  if (prices.length - 1 != items.length) {
    throw new Error(`Items count from prices: ${prices.length - 1}, item names from config: ${items.length}. Must be equal.`);
  }
  if (prices[0].length != objectSpecs.length) {
    throw new Error(`Objects count from prices: ${prices[0].length}, specs from config: ${objectSpecs.length}. Must be equal.`);
  }
  const levelsCount = prices.map(itemPrices => itemPrices.length);
  const levels = levelsCount.map(count => [...Array(count).keys()]);
  const variations = new CartesianProduct(...levels);

  for (let i = 0; i < variations.length; i++) {
    const variation = variations.at(i);
    const objectType = variation[0];
    const filename = "0x" + variation.map(level => ethers.toBeHex(level.toString(), 1).slice(2)).join("");
    metadataTemplate.name = objectSpecs[objectType].name;
    metadataTemplate.description = objectSpecs[objectType].description;
    metadataTemplate.image = objectSpecs[objectType].image;
    for (let j = 1; j < variation.length; j++) {
      metadataTemplate.attributes[j - 1].value = variation[j];
    }
    await fs.writeFile(`./scripts/metadata/${gameId}/jsons/${filename}.json`, JSON.stringify(metadataTemplate));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
