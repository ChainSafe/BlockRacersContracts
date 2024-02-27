import { ethers } from "hardhat";

const sleep = (msec) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), msec);
  });
};

async function main() {
  const [deployer] = await ethers.getSigners();
  let gameAddress = process.env.GAME_TOKEN;
  const trustedForwarder = process.env.GELATO_RELAY_1BALANCE_ERC2771;
  const admin = ethers.isAddress(process.env.ADMIN) ? process.env.ADMIN : deployer.address;
  const issuer = ethers.isAddress(process.env.ISSUER) ? process.env.ISSUER : deployer.address;
  const server = ethers.isAddress(process.env.SERVER) ? process.env.SERVER : deployer.address;
  const feeAccount = ethers.isAddress(process.env.FEE_ACCOUNT) ? process.env.FEE_ACCOUNT : deployer.address;

  if (!ethers.isAddress(gameAddress)) {
    const tokenContract = process.env.PUBLIC_MINT === "true" ? "BlockGameTokenTest" : "BlockGameToken";
    console.log(`Deploying ${tokenContract}.`);
    const gameToken = await ethers.deployContract(tokenContract, [
      trustedForwarder,
      admin,
      issuer,
      ethers.parseEther("1000"),
    ]);
    await gameToken.waitForDeployment();
    if (tokenContract === "BlockGameToken") {
      console.log(`Minted 1000 to the issuer ${issuer}.`);
    }
    gameAddress = gameToken.target;
  }

  const prices = process.env.PRICES.split("|")
    .map(itemPrices => itemPrices.split(","));

  console.log("Deploying BlockGame and BlockGameAssets.");
  const blockGame = await ethers.deployContract("BlockGame", [
    trustedForwarder,
    admin,
    gameAddress,
    feeAccount,
    process.env.BASE_URI,
    prices,
  ]);
  await blockGame.waitForDeployment();

  const assets = await blockGame.ASSETS();

  console.log("Deploying UIHelper.");
  const uiHelper = await ethers.deployContract("UIHelper", [blockGame.target]);
  await uiHelper.waitForDeployment();

  const targetContract = process.env.PUBLIC_MINT === "true" ? "BlockGameWageringTest" : "BlockGameWagering";
  console.log(`Deploying ${targetContract}.`);
  const wagering = await ethers.deployContract(targetContract, [trustedForwarder, admin, gameAddress, server]);
  await wagering.waitForDeployment();

  console.log();
  console.log(`Game Id: ${process.env.GAME_ID}`);
  console.log(`BlockGameToken: ${gameAddress}`);
  console.log(`BlockGame: ${blockGame.target}`);
  console.log(`BlockGameAssets: ${assets}`);
  console.log(`UIHelper: ${uiHelper.target}`);
  console.log(`BlockGameWagering: ${wagering.target}`);
  console.log(`Admin: ${admin}`);
  console.log(`Fee: ${feeAccount}`);
  console.log(`BaseURI: ${process.env.BASE_URI}`);

  if (process.env.VERIFY === "true") {
    console.log("Waiting half a minute to start verification");
    await sleep(30000);
    if (!ethers.isAddress(process.env.GAME_TOKEN)) {
      await hre.run("verify:verify", {
        address: gameAddress,
        constructorArguments: [trustedForwarder, admin, issuer, ethers.parseEther("1000")],
      });
    }
    await hre.run("verify:verify", {
      address: blockGame.target,
      constructorArguments: [trustedForwarder, admin, gameAddress, feeAccount, process.env.BASE_URI, prices],
    });
    await hre.run("verify:verify", {
      address: assets,
      constructorArguments: [trustedForwarder, process.env.BASE_URI],
    });
    await hre.run("verify:verify", {
      address: uiHelper.target,
      constructorArguments: [blockGame.target],
    });
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
