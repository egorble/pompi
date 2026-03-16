import { Pair, Position } from './types';

// Only markets supported by the backend (ETH-USD, BTC-USD, SOL-USD)
export const initialPairs: Pair[] = [
  { id: 'btc', pair: 'BTC/USDC', name: 'Bitcoin', price: 85000.00, change: 0.86, volume: '$2.7B', funding: 0.0120 },
  { id: 'eth', pair: 'ETH/USDC', name: 'Ethereum', price: 2500.00, change: -1.20, volume: '$1.2B', funding: 0.0080 },
  { id: 'sol', pair: 'SOL/USDC', name: 'Solana', price: 140.00, change: 4.12, volume: '$850M', funding: 0.0150 },
];

// Start with no positions — they'll be fetched from backend
export const initialPositions: Position[] = [];
