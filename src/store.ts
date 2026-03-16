import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// OrderBook types from backend
export interface OrderBookEntry {
  price: number;
  size: number;
  total: number; // Cumulative size or depth for visualization
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
  // Connection status
  isConnected: boolean;
  setIsConnected: (status: boolean) => void;

  // User Wallet
  walletAddress: string;
  setWalletAddress: (address: string) => void;

  // Market Data
  currentMarketId: string;
  setCurrentMarketId: (id: string) => void;
  
  // OrderBook
  orderBook: OrderBookState;
  setOrderBook: (data: any) => void; // Using any for raw JSON payload parsing

  // Last Price (from trades or aggregator)
  lastPrice: number;
  setLastPrice: (price: number) => void;

  // Recent Trades (for Trade History)
  trades: Trade[];
  addTrade: (trade: Trade) => void;
}

export const useStore = create<StoreState>()(
  devtools((set) => ({
    isConnected: false,
    setIsConnected: (status) => set({ isConnected: status }),

    walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', // Default mock wallet
    setWalletAddress: (address) => set({ walletAddress: address }),

    currentMarketId: 'ETH-USD',
    setCurrentMarketId: (id) => set({ 
      currentMarketId: id,
      // Clear data when switching markets
      orderBook: { marketId: id, asks: [], bids: [], timestamp: 0 },
      trades: [],
      lastPrice: 0
    }),

    orderBook: {
      marketId: 'ETH-USD',
      asks: [],
      bids: [],
      timestamp: 0,
    },
    setOrderBook: (payload: any) => {
      // Payload structure from Rust: { market_id, asks: [[price, size], ...], bids: [[price, size], ...], timestamp }
      try {
        const data = typeof payload === 'string' ? JSON.parse(payload) : payload;
        
        // Transform [price, size] arrays to OrderBookEntry objects
        // Sort Asks: Low to High
        const asks = (data.asks || []).map((item: any) => ({
          price: item[0],
          size: item[1],
          total: 0 // Calculated in UI if needed
        })).sort((a: any, b: any) => a.price - b.price);

        // Sort Bids: High to Low
        const bids = (data.bids || []).map((item: any) => ({
          price: item[0],
          size: item[1],
          total: 0
        })).sort((a: any, b: any) => b.price - a.price);

        set({
          orderBook: {
            marketId: data.market_id,
            asks,
            bids,
            timestamp: data.timestamp
          }
        });
      } catch (e) {
        console.error("Failed to parse OrderBook update", e);
      }
    },

    lastPrice: 0,
    setLastPrice: (price) => set({ lastPrice: price }),

    trades: [],
    addTrade: (trade) => set((state) => ({ 
      trades: [trade, ...state.trades].slice(0, 50) // Keep last 50
    })),
  }))
);
