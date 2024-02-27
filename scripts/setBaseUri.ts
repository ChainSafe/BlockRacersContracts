import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const blockGameAddress = process.env.BLOCK_GAME;

  if (!ethers.isAddress(blockGameAddress)) {
    throw new Error("Specify BLOCK_GAME env variable with the address of deployed main contract.");
  }

  const blockGame = await ethers.getContractAt("BlockGame", blockGameAddress);

  console.log(`Setting Base Uri on ${blockGameAddress} to ${process.env.BASE_URI}`);
  await blockGame.setBaseUri(process.env.BASE_URI);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
