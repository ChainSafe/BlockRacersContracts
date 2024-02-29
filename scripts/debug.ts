import { ethers } from "hardhat";

async function main() {
  const blockGameAddress = process.env.BLOCK_GAME;

  if (!ethers.isAddress(blockGameAddress)) {
    throw new Error("Specify BLOCK_GAME env variable with the address of deployed main contract.");
  }

  const blockGame = await ethers.getContractAt("BlockRacers", blockGameAddress);
  let result = await blockGame.getCarStats(1);
  console.log(result);

  const uiHelperAddress = process.env.UI_HELPER;

  if (!ethers.isAddress(uiHelperAddress)) {
    throw new Error("Specify UI_HELPER env variable with the address of deployed UIHelper.");
  }

  const uiHelper = await ethers.getContractAt("UIHelper", uiHelperAddress);
  result = await uiHelper.getUserCarsByTypeWithStats("0xB4590641ba39B2F2d38354e2A1Af8e62A6744174");
  console.log(result);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
