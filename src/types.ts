export interface Pair {
  id: string;
  pair: string;
  name: string;
  price: number;
  change: number;
  volume: string;
  funding: number;
}

export interface Position {
  id: string;
  pair: string;
  type: 'Long' | 'Short';
  leverage: number;
  size: number;
  entryPrice: number;
  markPrice: number;
  liqPrice: number;
  pnl: number;
  pnlPercent: number;
}

export interface Order {
  id: string;
  pair: string;
  type: 'Limit' | 'Take Profit' | 'Stop Loss';
  side: 'Buy' | 'Sell';
  price: number;
  size: number;
  filled: number;
  status: 'Open' | 'Filled' | 'Cancelled';
}
