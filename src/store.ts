import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { MarketTicker } from './api/client';

export interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

export interface OrderBookState {
  marketId: string;
  asks: OrderBookEntry[];
  bids: OrderBookEntry[];
  timestamp: number;
}

export interface Trade {
  price: number;
  size: number;
  time: string;
  side: 'Buy' | 'Sell';
}

interface StoreState {
  isConnected: boolean;
  setIsConnected: (status: boolean) => void;

  walletAddress: string;
  setWalletAddress: (address: string) => void;

  currentMarketId: string;
  setCurrentMarketId: (id: string) => void;

  orderBook: OrderBookState;
  setOrderBook: (data: any) => void;

  lastPrice: number;
  setLastPrice: (price: number) => void;

  trades: Trade[];
  addTrade: (trade: Trade) => void;

  tickers: Record<string, MarketTicker>;
  setTicker: (marketId: string, ticker: MarketTicker) => void;

  usdcBalance: number;
  setUsdcBalance: (balance: number) => void;
}

export const useStore = create<StoreState>()(
  devtools((set) => ({
    isConnected: false,
    setIsConnected: (status) => set({ isConnected: status }),

    walletAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // Anvil account 0
    setWalletAddress: (address) => set({ walletAddress: address }),

    currentMarketId: 'ETH-USD',
    setCurrentMarketId: (id) => set({
      currentMarketId: id,
      orderBook: { marketId: id, asks: [], bids: [], timestamp: 0 },
      trades: [],
      lastPrice: 0,
    }),

    orderBook: { marketId: 'ETH-USD', asks: [], bids: [], timestamp: 0 },
    setOrderBook: (payload: any) => {
      try {
        const data = typeof payload === 'string' ? JSON.parse(payload) : payload;
        const asks = (data.asks || []).map((item: any) => ({
          price: item[0], size: item[1], total: 0,
        })).sort((a: any, b: any) => a.price - b.price);
        const bids = (data.bids || []).map((item: any) => ({
          price: item[0], size: item[1], total: 0,
        })).sort((a: any, b: any) => b.price - a.price);
        set({ orderBook: { marketId: data.market_id, asks, bids, timestamp: data.timestamp } });
      } catch (e) {
        console.error("Failed to parse OrderBook", e);
      }
    },

    lastPrice: 0,
    setLastPrice: (price) => set({ lastPrice: price }),

    trades: [],
    addTrade: (trade) => set((state) => ({
      trades: [trade, ...state.trades].slice(0, 50),
    })),

    tickers: {},
    setTicker: (marketId, ticker) => set((state) => ({
      tickers: { ...state.tickers, [marketId]: ticker },
    })),

    usdcBalance: 0,
    setUsdcBalance: (balance) => set({ usdcBalance: balance }),
  }))
);
