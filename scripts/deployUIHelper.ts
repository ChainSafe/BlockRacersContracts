import { ethers } from "hardhat";

const sleep = (msec) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), msec);
  });
};

async function main() {
  const [deployer] = await ethers.getSigners();
  let blockGameAddress = process.env.BLOCK_GAME;

  if (!ethers.isAddress(blockGameAddress)) {
    throw new Error("Specify BLOCK_GAME env variable with the address of deployed main contract.");
  }

  console.log("Deploying UIHelper.");
  const uiHelper = await ethers.deployContract("UIHelper", [blockGameAddress]);
  await uiHelper.waitForDeployment();

  console.log(`UIHelper: ${uiHelper.target}`);

  if (process.env.VERIFY === "true") {
    console.log("Waiting half a minute to start verification");
    await sleep(30000);
    await hre.run("verify:verify", {
      address: uiHelper.target,
      constructorArguments: [blockGameAddress],
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
