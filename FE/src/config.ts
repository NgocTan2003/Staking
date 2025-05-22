import { bscTestnet } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
const ProjectID = import.meta.env.VITE_PROJECT_ID

const config = getDefaultConfig({
  appName: 'Staking Dapp',
  projectId: ProjectID,
  chains: [bscTestnet],
})

export default config;



 