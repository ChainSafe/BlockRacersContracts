import fs from "node:fs/promises";

const metadataTemplate = {
  "name": "",
  "description": "",
  "image": "",
  "attributes":
  [
    {
      "trait_type": "Engine",
      "value": 0,
    },
    {
      "trait_type": "Handling",
      "value": 0,
    },
    {
      "trait_type": "NOS",
      "value": 0,
    },
  ]
}

const carSpecs = [
  {
    name: "Camaro ZL1",
    description: "Camaro ZL1 car model item from BlockRacers game, by chainsafe.io",
    image: "ipfs://QmWVy8YraCR1eGuWhshYRydtc6kgKeGAgoxF5mPRANSFzU/0.png",
  },
  {
    name: "GT",
    description: "GT car model item from BlockRacers game, by chainsafe.io",
    image: "ipfs://QmWVy8YraCR1eGuWhshYRydtc6kgKeGAgoxF5mPRANSFzU/1.png",
  },
  {
    name: "488 Pista",
    description: "488 Pista car model item from BlockRacers game, by chainsafe.io",
    image: "ipfs://QmWVy8YraCR1eGuWhshYRydtc6kgKeGAgoxF5mPRANSFzU/2.png",
  },
];

async function main() {
  const levels = [
    process.env.CAR_PRICES.split(",").length,
    process.env.ENGINE_PRICES.split(",").length,
    process.env.HANDLING_PRICES.split(",").length,
    process.env.NOS_PRICES.split(",").length,
  ];

  const props = [0, 0, 0, 0];
  for (props[0] = 0; props[0] < levels[0]; props[0]++) {
    for (props[1] = 0; props[1] < levels[1]; props[1]++) {
      for (props[2] = 0; props[2] < levels[2]; props[2]++) {
        for (props[3] = 0; props[3] < levels[3]; props[3]++) {
          const filename = "0x" + props.map(el => ethers.toBeHex(el.toString(), 1).slice(2)).join("");
          metadataTemplate.name = carSpecs[props[0]].name;
          metadataTemplate.description = carSpecs[props[0]].description;
          metadataTemplate.image = carSpecs[props[0]].image;
          metadataTemplate.attributes[0].value = props[1];
          metadataTemplate.attributes[1].value = props[2];
          metadataTemplate.attributes[2].value = props[3];
          await fs.writeFile("./scripts/metadata/jsons/" + filename + ".json", JSON.stringify(metadataTemplate));
        }
      }
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});