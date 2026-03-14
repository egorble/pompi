import { Pair, Position } from './types';

export const initialPairs: Pair[] = [
  { id: 'btc', pair: 'BTC/USDC', name: 'Bitcoin', price: 70050.50, change: 0.86, volume: '$2.7B', funding: 0.0120 },
  { id: 'eth', pair: 'ETH/USDC', name: 'Ethereum', price: 3542.00, change: -1.20, volume: '$1.2B', funding: 0.0080 },
  { id: 'sol', pair: 'SOL/USDC', name: 'Solana', price: 145.20, change: 4.12, volume: '$850M', funding: 0.0150 },
  { id: 'arb', pair: 'ARB/USDC', name: 'Arbitrum', price: 1.84, change: -0.45, volume: '$120M', funding: 0.0050 },
  { id: 'link', pair: 'LINK/USDC', name: 'Chainlink', price: 18.25, change: 0.12, volume: '$95M', funding: 0.0020 },
  { id: 'avax', pair: 'AVAX/USDC', name: 'Avalanche', price: 54.10, change: 2.15, volume: '$210M', funding: 0.0110 },
];

export const initialPositions: Position[] = [
  {
    id: '1',
    pair: 'BTC-PERP',
    type: 'Long',
    leverage: 25,
    size: 0.5,
    entryPrice: 68420.00,
    markPrice: 70050.50,
    liqPrice: 66000.00,
    pnl: 815.25,
    pnlPercent: 1.19,
  },
  {
    id: '2',
    pair: 'ETH-PERP',
    type: 'Short',
    leverage: 10,
    size: 5.0,
    entryPrice: 3600.00,
    markPrice: 3542.00,
    liqPrice: 3900.00,
    pnl: 290.00,
    pnlPercent: 1.61,
  }
];
