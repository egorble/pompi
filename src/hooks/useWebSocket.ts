import { useEffect, useRef } from 'react';
import { useStore } from '../store';

const WS_URL = 'ws://localhost:8080/ws';

export function useWebSocket() {
  const { setIsConnected, setOrderBook, setLastPrice, addTrade } = useStore();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      setIsConnected(true);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const currentMarketId = useStore.getState().currentMarketId;

        // 1. OrderBook Snapshot (from order-engine via api-gateway)
        if (data.asks && data.bids) {
          if (data.market_id === currentMarketId) {
            setOrderBook(data);
          }
          return;
        }

        // 2. Matched Trade (from order-engine)
        if (data.trade_id) {
          if (data.market_id === currentMarketId) {
            setLastPrice(data.price);
            addTrade({
              price: data.price,
              size: data.size,
              side: data.taker_side || data.side || 'Buy',
              time: new Date(data.timestamp_ms || Date.now()).toISOString()
            });
          }
          return;
        }

        // 3. Price Update (from price-aggregator)
        // Format: { market_id: "ETH-USD", price: 2500.5, timestamp: ..., source: "aggregated" }
        if (data.price !== undefined && data.market_id) {
          if (data.market_id === currentMarketId) {
            setLastPrice(data.price);
          }
          return;
        }

      } catch (e) {
        // Silently ignore parse errors
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      wsRef.current = null;
      reconnectTimeoutRef.current = setTimeout(() => connect(), 3000);
    };

    ws.onerror = () => {
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
