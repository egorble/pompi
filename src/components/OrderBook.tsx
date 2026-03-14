import React, { useState } from 'react';
import { Pair } from '../types';
import { formatCurrency } from '../utils';
import { ChevronRight, LayoutList, List, ChevronDown, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OrderBookProps {
  pair: Pair;
}

type Tab = 'ORDER_BOOK' | 'TRADE_HISTORY';

export function OrderBook({ pair }: OrderBookProps) {
  const [activeTab, setActiveTab] = useState<Tab>('ORDER_BOOK');
  
  // Generate dummy order book data based on current price
  const spread = pair.price * 0.0005;
  
  const asks = Array.from({ length: 12 }).map((_, i) => ({
    price: pair.price + spread * (12 - i),
    size: (Math.random() * 2 + 0.1).toFixed(6),
    depth: Math.random() * 100
  }));

  const bids = Array.from({ length: 12 }).map((_, i) => ({
    price: pair.price - spread * (i + 1),
    size: (Math.random() * 2 + 0.1).toFixed(6),
    depth: Math.random() * 100
  }));

  const trades = Array.from({ length: 20 }).map((_, i) => ({
    price: pair.price + (Math.random() - 0.5) * spread * 10,
    size: (Math.random() * 0.5 + 0.01).toFixed(4),
    time: new Date(Date.now() - i * 5000).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    isBuyerMaker: Math.random() > 0.5
  }));

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
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <section className="bg-white rounded-[24px] dream-shadow flex-grow overflow-hidden flex flex-col min-h-[400px]">
      {/* Tabs */}
      <div className="flex items-center justify-between px-4 pt-3 border-b border-slate-100 shrink-0">
        <div className="flex gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('ORDER_BOOK')}
            className={`pb-3 text-xs font-bold transition-colors relative ${
              activeTab === 'ORDER_BOOK' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            ORDER BOOK
            {activeTab === 'ORDER_BOOK' && (
              <motion.div layoutId="orderBookTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-t-full" />
            )}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('TRADE_HISTORY')}
            className={`pb-3 text-xs font-bold transition-colors relative ${
              activeTab === 'TRADE_HISTORY' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            TRADE HISTORY
            {activeTab === 'TRADE_HISTORY' && (
              <motion.div layoutId="orderBookTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-t-full" />
            )}
          </motion.button>
        </div>
        <motion.button whileHover={{ scale: 1.1, x: 2 }} whileTap={{ scale: 0.9 }} className="pb-3 text-slate-400 hover:text-slate-600">
          <ChevronRight size={16} />
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'ORDER_BOOK' ? (
          <motion.div 
            key="orderbook"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="flex flex-col flex-grow overflow-hidden"
          >
            {/* Headers */}
            <div className="grid grid-cols-[1fr_1fr_40px] gap-2 px-4 py-2 text-[10px] font-bold text-slate-400 shrink-0 border-b border-slate-50">
              <div className="text-left whitespace-nowrap">Price <span className="border border-slate-200 rounded px-1 py-0.5 ml-1">{quoteCurrency}</span></div>
              <div className="text-right whitespace-nowrap">Size <span className="border border-slate-200 rounded px-1 py-0.5 ml-1">{baseCurrency}</span></div>
              <div className="text-right whitespace-nowrap">Mine</div>
            </div>
            
            <div className="flex-grow flex flex-col overflow-hidden pb-2">
              {/* Sells (Red) */}
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col justify-end flex-1 overflow-hidden">
                {asks.map((ask, i) => (
                  <motion.div variants={itemVariants} key={`ask-${i}`} className="grid grid-cols-[1fr_1fr_40px] gap-2 items-center text-[11px] py-[2px] px-4 group cursor-pointer hover:bg-slate-50 relative">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${ask.depth}%` }} transition={{ duration: 0.5 }} className="absolute left-0 top-0 bottom-0 bg-red-50"></motion.div>
                    <span className="text-left text-dream-red font-medium relative z-10">{ask.price.toFixed(1)}</span>
                    <span className="text-right text-slate-700 font-medium relative z-10">{ask.size}</span>
                    <span className="text-right text-slate-400 relative z-10">-</span>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Mid Price */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-2 px-4 flex items-center gap-2 shrink-0 bg-slate-50/50 border-y border-slate-100 my-1"
              >
                <span className="text-lg font-bold text-slate-800">{pair.price.toFixed(1)}</span>
                <span className="text-xs font-medium text-slate-500 underline decoration-dashed underline-offset-2">${pair.price.toFixed(1)}</span>
              </motion.div>
              
              {/* Buys (Green) */}
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col justify-start flex-1 overflow-hidden">
                {bids.map((bid, i) => (
                  <motion.div variants={itemVariants} key={`bid-${i}`} className="grid grid-cols-[1fr_1fr_40px] gap-2 items-center text-[11px] py-[2px] px-4 group cursor-pointer hover:bg-slate-50 relative">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${bid.depth}%` }} transition={{ duration: 0.5 }} className="absolute left-0 top-0 bottom-0 bg-emerald-50"></motion.div>
                    <span className="text-left text-emerald-500 font-medium relative z-10">{bid.price.toFixed(1)}</span>
                    <span className="text-right text-slate-700 font-medium relative z-10">{bid.size}</span>
                    <span className="text-right text-slate-400 relative z-10">-</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="trades"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="flex flex-col flex-grow overflow-hidden"
          >
            {/* Headers */}
            <div className="flex justify-between px-4 py-2 text-[10px] font-bold text-slate-400 shrink-0 border-b border-slate-50">
              <div className="flex-1 text-left">Price</div>
              <div className="flex-1 text-right">Size</div>
              <div className="flex-1 text-right">Time</div>
            </div>
            
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex-grow overflow-y-auto pb-2">
              {trades.map((trade, i) => (
                <motion.div variants={itemVariants} key={`trade-${i}`} className="flex justify-between items-center text-[11px] py-1 px-4 hover:bg-slate-50 cursor-pointer">
                  <span className={`flex-1 text-left font-medium ${trade.isBuyerMaker ? 'text-dream-red' : 'text-emerald-500'}`}>
                    {trade.price.toFixed(1)}
                  </span>
                  <span className="flex-1 text-right text-slate-700 font-medium">{trade.size}</span>
                  <span className="flex-1 text-right text-slate-400">{trade.time}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
