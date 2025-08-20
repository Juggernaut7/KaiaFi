require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Kaia Network Testnet
    kaiaTestnet: {
      url: process.env.KAIA_TESTNET_RPC || "https://testnet-rpc.kaia.network",
      chainId: 1337,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: "auto",
      gas: "auto",
    },
    // Kaia Network Mainnet (for production)
    kaiaMainnet: {
      url: process.env.KAIA_MAINNET_RPC || "https://mainnet-rpc.kaia.network",
      chainId: 1,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: "auto",
      gas: "auto",
    },
    // Local development
    hardhat: {
      chainId: 1337,
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        count: 10,
      },
    },
  },
  etherscan: {
    apiKey: {
      kaiaTestnet: process.env.KAIA_EXPLORER_API_KEY || "",
      kaiaMainnet: process.env.KAIA_EXPLORER_API_KEY || "",
    },
    customChains: [
      {
        network: "kaiaTestnet",
        chainId: 1337,
        urls: {
          apiURL: "https://testnet-explorer.kaia.network/api",
          browserURL: "https://testnet-explorer.kaia.network",
        },
      },
      {
        network: "kaiaMainnet",
        chainId: 1,
        urls: {
          apiURL: "https://explorer.kaia.network/api",
          browserURL: "https://explorer.kaia.network",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 40000,
  },
}; 