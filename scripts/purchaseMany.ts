import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const blockGame = process.env.BLOCK_GAME;
  const gameToken = process.env.GAME_TOKEN;

  if (!ethers.isAddress(blockGame)) {
    throw new Error("Specify BLOCK_GAME env variable with the address of deployed BlockGame contract.");
  }

  if (!ethers.isAddress(gameToken)) {
    throw new Error("Specify GAME_TOKEN env variable with the address of deployed BlockGameToken contract.");
  }

  const game = await ethers.getContractAt("BlockGame", blockGame);
  const token = await ethers.getContractAt("BlockGameTokenTest", gameToken);
  const assetsContract = await game.ASSETS();
  const assets = await ethers.getContractAt("BlockGameAssets", assetsContract);

  const to = "0x5D3e5009E469C1e8948BBe895A6ec0f424da44BD";
  const amount = 10n;

  const nonceMananger = new ethers.NonceManager(deployer);
  await token.connect(nonceMananger).approve(game.target, await token.balanceOf(deployer.address));
  let tx;
  for (let i = 0n; i < amount; i++) {
    tx = await game.connect(nonceMananger).mintObject(i % 3n);
  }
  await tx.wait();
  const items = (await assets.getInventory(deployer.address)).toArray();
  const mintedItems = items.slice(-Number(amount));
  const amounts = mintedItems.map(() => 1n);

  await (await assets.connect(nonceMananger).safeBatchTransferFrom(deployer.address, to, mintedItems, amounts, "0x")).wait();
  console.log(`Purchased items: ${mintedItems.join(', ')}`);
  console.log(`Transferred to: ${to}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
