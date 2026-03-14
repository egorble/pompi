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
