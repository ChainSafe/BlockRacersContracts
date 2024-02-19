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
  const feeAccount = ethers.isAddress(process.env.FEE_ACCOUNT) ? process.env.FEE_ACCOUNT : deployer.address;

  if (!ethers.isAddress(gameAddress)) {
    const tokenContract = process.env.PUBLIC_MINT === "true" ? "BlockGameTokenTest" : "BlockGameToken";
    console.log(`Deploying ${tokenContract} token.`);
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

  const prices = [
    process.env.OBJECT_PRICES.split(","),
    process.env.ITEM1_PRICES.split(","),
    process.env.ITEM2_PRICES.split(","),
    process.env.ITEM3_PRICES.split(","),
  ];
  console.log("Deploying BlockGame and Assets.");
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

  console.log(`GAME: ${gameAddress}`);
  console.log(`BlockGame: ${blockGame.target}`);
  console.log(`Assets: ${assets}`);
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
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
