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
      // url: `https://bsc-testnet.public.blastapi.io`,
      url: `https://bsc-testnet.drpc.org`,
      // url: `https://endpoints.omniatech.io/v1/bsc/testnet/public`,
      // url: `https://api.zan.top/bsc-testnet`,

      
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 97,
    },
  }
};
