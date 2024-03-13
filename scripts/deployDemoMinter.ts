import { ethers } from "hardhat";

const sleep = (msec) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), msec);
  });
};

async function main() {
  const [deployer] = await ethers.getSigners();
  const blockGameAddress = process.env.BLOCK_GAME;

  if (!ethers.isAddress(blockGameAddress)) {
    throw new Error("Specify BLOCK_GAME env variable with the address of deployed main contract.");
  }

  console.log("Deploying DemoBlockGameObjectMinter.");
  const demoMinter = await ethers.deployContract("DemoBlockGameObjectMinter", [blockGameAddress]);
  await demoMinter.waitForDeployment();

  // await (await demoMinter.mint(deployer.address, 2, [2, 2, 2])).wait();

  console.log(`DemoBlockGameObjectMinter: ${demoMinter.target}`);

  if (process.env.VERIFY === "true") {
    console.log("Waiting half a minute to start verification");
    await sleep(30000);
    await hre.run("verify:verify", {
      address: demoMinter.target,
      constructorArguments: [blockGameAddress],
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
