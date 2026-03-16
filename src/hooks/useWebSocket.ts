import { useEffect, useRef } from 'react';
import { useStore } from '../store';

const WS_URL = 'ws://localhost:8080/ws';

export function useWebSocket() {
  const { setIsConnected, setOrderBook, setLastPrice, addTrade } = useStore();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    // console.log('Connecting to WebSocket...');
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      // console.log('WebSocket Connected');
      setIsConnected(true);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };

    ws.onmessage = (event) => {
      try {
        const message = event.data;
        const data = JSON.parse(message);
        const currentMarketId = useStore.getState().currentMarketId;
        
        // 1. OrderBook Snapshot
        if (data.asks && data.bids) {
          if (data.market_id === currentMarketId) {
            setOrderBook(data);
          }
        } 
        // 2. Matched Trade
        else if (data.trade_id) {
          if (data.market_id === currentMarketId) {
            // Update last price
            setLastPrice(data.price);
            
            // Add to trade history
            addTrade({
              price: data.price,
              size: data.size,
              side: data.side, // "Buy" or "Sell"
              time: new Date(data.timestamp || Date.now()).toISOString()
            });
          }
        }
        // 3. Price Update (from Aggregator)
        else if (data.price && data.source) {
             // Price aggregator updates might not have market_id or might be global?
             // Assuming for now they match the current pair if we had a way to check.
             // But the aggregator usually sends { symbol: "ETH-USD", price: ... }
             // Let's check if data has symbol/market_id
             if (data.symbol === currentMarketId || data.market_id === currentMarketId || !data.symbol) {
                setLastPrice(data.price);
             }
        }
        
      } catch (e) {
        console.warn('Failed to parse WS message:', e);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      setIsConnected(false);
      wsRef.current = null;
      
      // Reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      ws.close();
    };

    wsRef.current = ws;
  };

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, []);

  return wsRef.current;
}
