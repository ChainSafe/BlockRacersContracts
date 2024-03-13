import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const lootAddress = process.env.LOOT;

  if (!ethers.isAddress(lootAddress)) {
    throw new Error("Specify LOOT env variable with the address of deployed loot contract.");
  }

  const loot = await ethers.getContractAt("BlockGameLoot", lootAddress);

  const to = "0x5D3e5009E469C1e8948BBe895A6ec0f424da44BD";
  const ids = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const values = [150, 100, 50, 150, 100, 50, 150, 100, 50];
  console.log(`Minting on ${lootAddress} to ${to}`);
  await loot.mintBatch(to, ids, values, "0x");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
