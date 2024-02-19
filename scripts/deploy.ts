import { ethers } from "hardhat";

const sleep = (msec) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), msec);
  });
};

async function main() {
  const [deployer] = await ethers.getSigners();
  let raceAddress = process.env.RACE_TOKEN;
  const trustedForwarder = process.env.GELATO_RELAY_1BALANCE_ERC2771;
  const admin = ethers.isAddress(process.env.ADMIN) ? process.env.ADMIN : deployer.address;
  const issuer = ethers.isAddress(process.env.ISSUER) ? process.env.ISSUER : deployer.address;
  const feeAccount = ethers.isAddress(process.env.FEE_ACCOUNT) ? process.env.FEE_ACCOUNT : deployer.address;

  if (!ethers.isAddress(raceAddress)) {
    const tokenContract = process.env.PUBLIC_MINT === "true" ? "BlockRacersTokenTest" : "BlockRacersToken";
    console.log(`Deploying ${tokenContract} token.`);
    const race = await ethers.deployContract(tokenContract, [
      trustedForwarder,
      admin,
      issuer,
      ethers.parseEther("1000"),
    ]);
    await race.waitForDeployment();
    if (tokenContract === "BlockRacersToken") {
      console.log(`Minted 1000 to the issuer ${issuer}.`);
    }
    raceAddress = race.target;
  }

  const prices = [
    process.env.CAR_PRICES.split(","),
    process.env.ENGINE_PRICES.split(","),
    process.env.HANDLING_PRICES.split(","),
    process.env.NOS_PRICES.split(","),
  ];
  console.log("Deploying Racers and Assets.");
  const racers = await ethers.deployContract("BlockRacers", [
    trustedForwarder,
    admin,
    raceAddress,
    feeAccount,
    process.env.BASE_URI,
    prices,
  ]);
  await racers.waitForDeployment();

  const assets = await racers.ASSETS();

  console.log(`RACE: ${raceAddress}`);
  console.log(`Racers: ${racers.target}`);
  console.log(`Assets: ${assets}`);
  console.log(`Admin: ${admin}`);
  console.log(`Fee: ${feeAccount}`);
  console.log(`BaseURI: ${process.env.BASE_URI}`);

  if (process.env.VERIFY === "true") {
    console.log("Waiting half a minute to start verification");
    await sleep(30000);
    if (!ethers.isAddress(process.env.RACE_TOKEN)) {
      await hre.run("verify:verify", {
        address: raceAddress,
        constructorArguments: [trustedForwarder, admin, issuer, ethers.parseEther("1000")],
      });
    }
    await hre.run("verify:verify", {
      address: racers.target,
      constructorArguments: [trustedForwarder, admin, raceAddress, feeAccount, process.env.BASE_URI, prices],
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
