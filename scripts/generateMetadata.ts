import fs from "node:fs/promises";
import metadata from "./metadata/index";

const gameId = process.env.GAME_ID;
const { items, objectSpecs } = metadata[gameId];

if (!items) {
  throw new Error(`GAME_ID should be set in the env and resolve to a config from scripts/metadata/{GAME_ID}/config.ts`);
}

const metadataTemplate = {
  "name": "",
  "description": "",
  "image": "",
  "attributes":
  [
    {
      "trait_type": "item1",
      "value": 0,
    },
    {
      "trait_type": "item2",
      "value": 0,
    },
    {
      "trait_type": "item3",
      "value": 0,
    },
  ]
};

metadataTemplate.attributes[0].trait_type = items[0];
metadataTemplate.attributes[1].trait_type = items[1];
metadataTemplate.attributes[2].trait_type = items[2];

async function main() {
  const levels = [
    process.env.OBJECT_PRICES.split(",").length,
    process.env.ITEM1_PRICES.split(",").length,
    process.env.ITEM2_PRICES.split(",").length,
    process.env.ITEM3_PRICES.split(",").length,
  ];

  const props = [0, 0, 0, 0];
  for (props[0] = 0; props[0] < levels[0]; props[0]++) {
    for (props[1] = 0; props[1] < levels[1]; props[1]++) {
      for (props[2] = 0; props[2] < levels[2]; props[2]++) {
        for (props[3] = 0; props[3] < levels[3]; props[3]++) {
          const filename = "0x" + props.map(el => ethers.toBeHex(el.toString(), 1).slice(2)).join("");
          metadataTemplate.name = objectSpecs[props[0]].name;
          metadataTemplate.description = objectSpecs[props[0]].description;
          metadataTemplate.image = objectSpecs[props[0]].image;
          metadataTemplate.attributes[0].value = props[1];
          metadataTemplate.attributes[1].value = props[2];
          metadataTemplate.attributes[2].value = props[3];
          await fs.writeFile(`./scripts/metadata/${gameId}/jsons/${filename}.json`, JSON.stringify(metadataTemplate));
        }
      }
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
