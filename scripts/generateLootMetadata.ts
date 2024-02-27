import fs from "node:fs/promises";
import metadata from "./metadata/index";

const gameId = process.env.GAME_ID;
const { name, description, imagesBaseUri, itemsCount } = metadata[gameId].loot;

if (!name || !description || !imagesBaseUri || !itemsCount) {
  throw new Error(`GAME_ID should be set in the env and resolve to a config from scripts/metadata/{GAME_ID}/config.ts`);
}

const metadataTemplate = {
  "name": name,
  "description": description,
  "image": "",
};

async function main() {
  for (let i = 0; i < itemsCount; i++) {
    const filename = `${i}`;
    metadataTemplate.image = `${imagesBaseUri}${i}.png`;
    await fs.writeFile(`./scripts/metadata/${gameId}/loot/jsons/${filename}.json`, JSON.stringify(metadataTemplate));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
