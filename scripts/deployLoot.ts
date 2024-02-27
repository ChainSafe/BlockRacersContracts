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
  const lootUri = process.env.LOOT_BASE_URI;

  console.log(`Deploying BlockGameLoot.`);
  const loot = await ethers.deployContract("BlockGameLoot", [trustedForwarder, admin, lootUri]);
  await loot.waitForDeployment();

  console.log(`BlockGameLoot: ${loot.target}`);

  if (process.env.VERIFY === "true") {
    console.log("Waiting half a minute to start verification");
    await sleep(30000);
    await hre.run("verify:verify", {
      address: loot.target,
      constructorArguments: [trustedForwarder, admin, lootUri],
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
