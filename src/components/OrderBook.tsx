import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Pair } from '../types';
import { formatCurrency, getMarketId } from '../utils';
import { ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';
import { apiClient } from '../api/client';

interface OrderBookProps {
  pair: Pair;
}

type Tab = 'ORDER_BOOK' | 'TRADE_HISTORY';

export function OrderBook({ pair }: OrderBookProps) {
  const [activeTab, setActiveTab] = useState<Tab>('ORDER_BOOK');
  const { orderBook, trades: storeTrades, lastPrice, setOrderBook, addTrade } = useStore();
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const displayPrice = lastPrice > 0 ? lastPrice : pair.price;
  const marketId = getMarketId(pair.pair);

  // Poll REST API for orderbook + trades every 2 seconds as fallback
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ob = await apiClient.getOrderBook(marketId);
        if (ob && (ob.asks?.length > 0 || ob.bids?.length > 0)) {
          setOrderBook(ob);
        }
      } catch { /* backend offline */ }

      try {
        const trades = await apiClient.getTrades(marketId);
        if (trades && trades.length > 0) {
          // Add new trades that aren't already in store
          const existingIds = new Set(storeTrades.map(t => `${t.price}-${t.time}`));
          for (const t of trades.slice(-10)) {
            const key = `${t.price}-${t.timestamp_ms}`;
            if (!existingIds.has(key)) {
              addTrade({
                price: t.price,
                size: t.size,
                side: t.taker_side || 'Buy',
                time: new Date(t.timestamp_ms || Date.now()).toISOString(),
              });
            }
          }
        }
      } catch { /* no trades */ }
    };

    fetchData();
    pollRef.current = setInterval(fetchData, 2000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [marketId]);

  const hasRealData = orderBook.asks.length > 0 || orderBook.bids.length > 0;

  const asks = useMemo(() => {
    if (hasRealData) {
      const maxSize = Math.max(...orderBook.asks.map(a => a.size), 0.1);
      return orderBook.asks.slice(0, 10).map(a => ({
        price: a.price,
        size: a.size.toFixed(4),
        depth: (a.size / maxSize) * 100,
      }));
    }
    const spread = pair.price * 0.0005;
    return Array.from({ length: 10 }).map((_, i) => ({
      price: displayPrice + spread * (10 - i),
      size: (Math.random() * 2 + 0.1).toFixed(4),
      depth: Math.random() * 100
    }));
  }, [hasRealData, orderBook.asks, displayPrice, pair.price]);

  const bids = useMemo(() => {
    if (hasRealData) {
      const maxSize = Math.max(...orderBook.bids.map(b => b.size), 0.1);
      return orderBook.bids.slice(0, 10).map(b => ({
        price: b.price,
        size: b.size.toFixed(4),
        depth: (b.size / maxSize) * 100,
      }));
    }
    const spread = pair.price * 0.0005;
    return Array.from({ length: 10 }).map((_, i) => ({
      price: displayPrice - spread * (i + 1),
      size: (Math.random() * 2 + 0.1).toFixed(4),
      depth: Math.random() * 100
    }));
  }, [hasRealData, orderBook.bids, displayPrice, pair.price]);

  const trades = useMemo(() => {
    if (storeTrades.length > 0) {
      return storeTrades.slice(0, 21).map(t => ({
        price: t.price,
        size: t.size.toFixed(4),
        time: new Date(t.time).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        isBuyerMaker: t.side === 'Sell',
      }));
    }
    const spread = pair.price * 0.0005;
    return Array.from({ length: 21 }).map((_, i) => ({
      price: displayPrice + (Math.random() - 0.5) * spread * 10,
      size: (Math.random() * 0.5 + 0.01).toFixed(4),
      time: new Date(Date.now() - i * 5000).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      isBuyerMaker: Math.random() > 0.5
    }));
  }, [storeTrades, displayPrice, pair.price]);

  const baseCurrency = pair.pair.split('/')[0] || 'BTC';
  const quoteCurrency = pair.pair.split('/')[1] || 'USDC';

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.02 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 }
  };

  return (
    <section className="bg-dm-surface rounded-2xl dream-shadow flex-grow overflow-hidden flex flex-col">
      {/* Tabs */}
      <div className="flex items-center justify-between px-3 pt-3 border-b border-dm-border shrink-0">
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('ORDER_BOOK')}
            className={`pb-3 text-xs font-bold transition-colors relative ${activeTab === 'ORDER_BOOK' ? 'text-dream-blue' : 'text-dm-text3 hover:text-dm-text2'
              }`}
          >
            ORDER BOOK
            {activeTab === 'ORDER_BOOK' && (
              <motion.div layoutId="orderBookTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-dream-blue rounded-t-full" />
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('TRADE_HISTORY')}
            className={`pb-3 text-xs font-bold transition-colors relative ${activeTab === 'TRADE_HISTORY' ? 'text-dream-blue' : 'text-dm-text3 hover:text-dm-text2'
              }`}
          >
            TRADE HISTORY
            {activeTab === 'TRADE_HISTORY' && (
              <motion.div layoutId="orderBookTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-dream-blue rounded-t-full" />
            )}
          </motion.button>
        </div>
        <motion.button whileHover={{ scale: 1.1, x: 2 }} whileTap={{ scale: 0.9 }} className="pb-3 text-dm-text3 hover:text-dm-text2">
          <ChevronRight size={16} />
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'ORDER_BOOK' ? (
          <motion.div
            key="orderbook"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col flex-grow overflow-hidden"
          >
            {/* Headers */}
            <div className="grid grid-cols-[1.1fr_1fr_32px] gap-1 px-3 py-2 text-[9px] font-bold text-dm-text3 shrink-0 border-b border-dm-border">
              <div className="text-left whitespace-nowrap">Price <span className="border border-dm-border2 rounded px-1 py-0.5 ml-0.5">{quoteCurrency}</span></div>
              <div className="text-right whitespace-nowrap">Size <span className="border border-dm-border2 rounded px-1 py-0.5 ml-0.5">{baseCurrency}</span></div>
              <div className="text-right whitespace-nowrap">Mine</div>
            </div>

            <div className="flex-grow flex flex-col overflow-hidden pb-2">
              {/* Sells (Red) */}
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col justify-end flex-1 overflow-hidden">
                {asks.map((ask, i) => (
                  <motion.div variants={itemVariants} key={`ask-${i}`} className="grid grid-cols-[1.1fr_1fr_32px] gap-1 items-center text-[10px] py-[3px] px-3 group cursor-pointer hover:bg-dm-surface-alt relative">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${ask.depth}%` }} transition={{ duration: 0.5 }} className="absolute left-0 top-0 bottom-0 bg-dream-red/10"></motion.div>
                    <span className="text-left text-dream-red font-medium relative z-10">{ask.price.toFixed(1)}</span>
                    <span className="text-right text-dm-text2 font-medium relative z-10">{ask.size}</span>
                    <span className="text-right text-dm-text3 relative z-10">-</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Mid Price */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-2 px-4 flex items-center gap-2 shrink-0 bg-dm-surface-alt border-y border-dm-border my-1"
              >
                <span className="text-lg font-bold text-dm-text">{displayPrice.toFixed(1)}</span>
                <span className="text-xs font-medium text-dm-text2 underline decoration-dashed underline-offset-2">${displayPrice.toFixed(1)}</span>
              </motion.div>

              {/* Buys (Green) */}
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col justify-start flex-1 overflow-hidden">
                {bids.map((bid, i) => (
                  <motion.div variants={itemVariants} key={`bid-${i}`} className="grid grid-cols-[1.1fr_1fr_32px] gap-1 items-center text-[10px] py-[3px] px-3 group cursor-pointer hover:bg-dm-surface-alt relative">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${bid.depth}%` }} transition={{ duration: 0.5 }} className="absolute left-0 top-0 bottom-0 bg-dream-green/10"></motion.div>
                    <span className="text-left text-dream-green font-medium relative z-10">{bid.price.toFixed(1)}</span>
                    <span className="text-right text-dm-text2 font-medium relative z-10">{bid.size}</span>
                    <span className="text-right text-dm-text3 relative z-10">-</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="trades"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col flex-grow overflow-hidden"
          >
            {/* Headers */}
            <div className="flex justify-between px-4 py-2 text-[10px] font-bold text-dm-text3 shrink-0 border-b border-dm-border">
              <div className="flex-1 text-left">Price</div>
              <div className="flex-1 text-right">Size</div>
              <div className="flex-1 text-right">Time</div>
            </div>

            <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex-grow overflow-hidden pb-2">
              {trades.map((trade, i) => (
                <motion.div variants={itemVariants} key={`trade-${i}`} className="flex justify-between items-center text-[11px] py-1 px-4 hover:bg-dm-surface-alt cursor-pointer">
                  <span className={`flex-1 text-left font-medium ${trade.isBuyerMaker ? 'text-dream-red' : 'text-dream-green'}`}>
                    {trade.price.toFixed(1)}
                  </span>
                  <span className="flex-1 text-right text-dm-text2 font-medium">{trade.size}</span>
                  <span className="flex-1 text-right text-dm-text3">{trade.time}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
