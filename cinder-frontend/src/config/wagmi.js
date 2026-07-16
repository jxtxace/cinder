import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { hardhat } from 'wagmi/chains';
import { http } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'Cinder Dashboard',
  projectId: 'YOUR_PROJECT_ID', // Replace with a real Project ID in production
  chains: [hardhat],
  transports: {
    [hardhat.id]: http('http://127.0.0.1:8545'),
  },
  ssr: false, // Vite is SPA
});
