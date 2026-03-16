import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, arbitrum, optimism, base, polygon } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Pompi',
  projectId: 'pompi-local-dev', // Replace with real WalletConnect projectId for production
  chains: [mainnet, arbitrum, optimism, base, polygon],
});
