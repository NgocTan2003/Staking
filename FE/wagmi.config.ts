import { defineConfig } from '@wagmi/cli/config'
import { react } from '@wagmi/cli/plugins'
import contractABITokenA from './src/contracts/TokenA.json'
import contractABIStaking from './src/contracts/Staking.json'
import contractABINFTB from './src/contracts/NFTB.json'
import contractsAddress from "./src/contracts/contract-address.json";

export default defineConfig({
  out: 'src/abi/abi.ts',
  contracts: [
    {
      name: 'TokenA',
      abi: contractABITokenA.abi as any,
      address: contractsAddress.TokenA as `0x${string}`,
    },
    {
      name: 'Staking',
      abi: contractABIStaking.abi as any,
      address: contractsAddress.Staking as `0x${string}`,
    },
    {
      name: 'NFTB',
      abi: contractABINFTB.abi as any,
      address: contractsAddress.NFTB as `0x${string}`,
    },
  ],
  plugins: [react()],
})