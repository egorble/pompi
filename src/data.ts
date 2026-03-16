import { Pair, Position, Order } from './types';

// Only markets supported by the backend (ETH-USD, BTC-USD, SOL-USD)
export const initialPairs: Pair[] = [
  { id: 'btc', pair: 'BTC/USDC', name: 'Bitcoin', price: 85000.00, change: 0.86, volume: '$2.7B', funding: 0.0120 },
  { id: 'eth', pair: 'ETH/USDC', name: 'Ethereum', price: 2500.00, change: -1.20, volume: '$1.2B', funding: 0.0080 },
  { id: 'sol', pair: 'SOL/USDC', name: 'Solana', price: 140.00, change: 4.12, volume: '$850M', funding: 0.0150 },
];

// Start with no positions — they'll be fetched from backend
export const initialPositions: Position[] = [];

export const initialOrders: Order[] = [
  {
    id: 'ord-1',
    pair: 'BTC-PERP',
    type: 'Limit',
    side: 'Buy',
    price: 82500.00,
    size: 0.5,
    filled: 0,
    status: 'Open'
  },
  {
    id: 'ord-2',
    pair: 'ETH-PERP',
    type: 'Take Profit',
    side: 'Sell',
    price: 2800.00,
    size: 10,
    filled: 2,
    status: 'Open'
  },
  {
    id: 'ord-3',
    pair: 'SOL-PERP',
    type: 'Stop Loss',
    side: 'Sell',
    price: 130.00,
    size: 100,
    filled: 0,
    status: 'Open'
  }
];
