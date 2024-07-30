require("@matterlabs/hardhat-zksync-solc");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  zksolc: {
    version: "1.3.9",
    compilerSource: "binary",
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  networks: {
    zksync_testnet: {
      url: "https://zksync2-testnet.zksync.dev",
      ethNetwork: "goerli",
      chainId: 280,
      zksync: true,
    },
    zksync_mainnet: {
      url: "https://zksync2-mainnet.zksync.io/",
      ethNetwork: "mainnet",
      chainId: 324,
      zksync: true,
    },
    local: {
      url: "http://127.0.0.1:8545", // URL of your local blockchain
      accounts: ["0x6df83d5be7c0fc6f3d185c0544f7cc3ee0095dbf17ed834e486441f40b171baa"],
      // Optional: Array of account private keys to use for transactions not for deploying
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/e84a2946755345209aa59f4a1645f14a`,
      accounts: ["0x6df83d5be7c0fc6f3d185c0544f7cc3ee0095dbf17ed834e486441f40b171baa"],
  }
  },
  paths: {
    artifacts: "./artifacts-zk",
    cache: "./cache-zk",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
