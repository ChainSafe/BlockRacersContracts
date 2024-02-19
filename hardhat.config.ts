import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

const isSet = (param) => {
  return param && param.length > 0;
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.22",
    settings: {
      optimizer: { enabled: true, runs: 999999 },
      evmVersion: "paris",
    },
  },
  networks: {
    localhost: {
      chainId: 31337,
      url: 'http://127.0.0.1:8545/',
    },
    sepolia: {
      chainId: 11155111,
      url: process.env.SEPOLIA_URL || "",
      accounts:
        isSet(process.env.PRIVATE_KEY) ? [process.env.PRIVATE_KEY] : [],
    },
    mumbai: {
      chainId: 80001,
      url: process.env.MUMBAI_URL || "",
      accounts:
        isSet(process.env.PRIVATE_KEY) ? [process.env.PRIVATE_KEY] : [],
    },
    "cronos-testnet": {
      chainId: 338,
      url: process.env.CRONOS_TESTNET_URL || "",
      accounts:
        isSet(process.env.PRIVATE_KEY) ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
