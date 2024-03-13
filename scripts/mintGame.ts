import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const gameToken = process.env.GAME_TOKEN;

  if (!ethers.isAddress(gameToken)) {
    throw new Error("Specify GAME_TOKEN env variable with the address of deployed BlockGameToken contract.");
  }

  const token = await ethers.getContractAt("BlockGameTokenTest", gameToken);

  const to = "0xDDdd4c384C7A342Ff52ba741A5733379b2C5841E";
  console.log(`Minting 1000 on ${gameToken} to ${to}`);
  await token.mint(to);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
