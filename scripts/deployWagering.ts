import { ethers } from "hardhat";

const sleep = (msec) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), msec);
  });
};

async function main() {
  const [deployer] = await ethers.getSigners();
  const trustedForwarder = process.env.GELATO_RELAY_1BALANCE_ERC2771;
  const admin = ethers.isAddress(process.env.ADMIN) ? process.env.ADMIN : deployer.address;
  const server = ethers.isAddress(process.env.SERVER) ? process.env.SERVER : deployer.address;
  const gameAddress = process.env.GAME_TOKEN;

  if (!ethers.isAddress(gameAddress)) {
    throw new Error("Specify GAME_TOKEN env variable with the address of deployed game token contract.");
  }

  const targetContract = process.env.PUBLIC_MINT === "true" ? "BlockGameWageringTest" : "BlockGameWagering";
  console.log(`Deploying ${targetContract}.`);
  const wagering = await ethers.deployContract(targetContract, [trustedForwarder, admin, gameAddress, server]);
  await wagering.waitForDeployment();

  console.log(`BlockGameWagering: ${wagering.target}`);

  if (process.env.VERIFY === "true") {
    console.log("Waiting half a minute to start verification");
    await sleep(30000);
    await hre.run("verify:verify", {
      address: wagering.target,
      constructorArguments: [trustedForwarder, admin, gameAddress, server],
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
