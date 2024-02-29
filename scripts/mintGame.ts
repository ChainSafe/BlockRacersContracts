import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const gameToken = process.env.GAME_TOKEN;

  if (!ethers.isAddress(gameToken)) {
    throw new Error("Specify GAME_TOKEN env variable with the address of deployed BlockGameToken contract.");
  }

  const game = await ethers.getContractAt("BlockGameTokenTest", gameToken);

  const to = "0xDa28303a5ac77aF33aD965cf96e871A4213682a6";
  console.log(`Minting 1000 on ${gameToken} to ${to}`);
  await game.mint(to);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
