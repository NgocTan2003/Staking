require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          evmVersion: "paris",
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  networks:{
    bscTestnet: {
      // url: `https://bsc-testnet-rpc.publicnode.com`,
      url: `https://bsc-testnet.public.blastapi.io`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 97,
    },
  }
};
