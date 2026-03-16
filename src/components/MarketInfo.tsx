import React, { useState, useRef, useEffect } from 'react';
import { Pair } from '../types';
import { formatCurrency, formatPercent } from '../utils';
import { ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';
import { getMarketId } from '../utils';

interface MarketInfoProps {
  pair: Pair;
  pairs: Pair[];
  onSelectPair: (pair: Pair) => void;
}

export function MarketInfo({ pair, pairs, onSelectPair }: MarketInfoProps) {
  const { lastPrice, isConnected, tickers } = useStore();
  const ticker = tickers[getMarketId(pair.pair)];
  const displayPrice = lastPrice > 0 ? lastPrice : (ticker?.price || pair.price);
  const change24h = ticker?.change_24h_pct ?? pair.change;
  const volume24h = ticker && ticker.volume_24h_usd > 0 ? `$${ticker.volume_24h_usd.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : pair.volume;
  const fundingRate = ticker?.funding_rate_pct ?? pair.funding;
  const isPositive = change24h >= 0;
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredPairs = pairs.filter(p =>
    p.pair.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="premium-card rounded-[16px] p-3 md:p-4 flex flex-col lg:flex-row items-center justify-between gap-4 shrink-0 relative z-40 w-full mb-2">
      <div className="flex items-center gap-3 relative" ref={dropdownRef}>
        <div className="w-12 h-12 bg-[#1A2540] rounded-[10px] flex items-center justify-center shrink-0">
          <span className="text-[#3366FF] font-bold text-xl">{pair.name.charAt(0)}</span>
        </div>

        <div
          className="cursor-pointer group flex items-center gap-2"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-xl md:text-[22px] text-dm-text group-hover:text-brand-accent transition-colors leading-tight tracking-tight">
                {pair.pair.replace('/USDC', '-PERP')}
              </h2>
              <ChevronDown size={18} className={`text-dm-text3 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </div>
            <p className="text-dm-text3 text-sm font-medium leading-tight mt-0.5">{pair.name} / USDC</p>
          </motion.div>
        </div>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 mt-4 w-72 bg-dm-surface rounded-[16px] shadow-2xl border border-dm-border overflow-hidden z-50"
            >
              <div className="p-3 border-b border-dm-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dm-text3 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search pairs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-dm-surface-alt border-none rounded-[10px] py-2 pl-9 pr-4 text-sm font-medium text-dm-text focus:ring-2 focus:ring-brand-accent/20 placeholder:text-dm-text3 outline-none"
                  />
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto custom-scrollbar p-2">
                {filteredPairs.map((item) => {
                  const isSelected = pair.id === item.id;
                  const itemTicker = tickers[getMarketId(item.pair)];
                  const itemPrice = itemTicker?.price || item.price;
                  const itemChange = itemTicker?.change_24h_pct ?? item.change;
                  const itemIsPositive = itemChange >= 0;

                  return (
                    <motion.button
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      key={item.id}
                      onClick={() => {
                        onSelectPair(item);
                        setShowDropdown(false);
                        setSearchQuery('');
                      }}
                       className={`w-full flex items-center justify-between p-2.5 rounded-[10px] transition-colors group ${isSelected ? 'bg-brand-accent/10 border border-brand-accent/20' : 'hover:bg-dm-surface-alt border border-transparent'
                        }`}
                    >
                      <div className="text-left">
                        <p className="text-sm font-bold text-dm-text">{item.pair}</p>
                        <p className="text-[10px] text-dm-text3 font-medium">{item.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-dm-text">{formatCurrency(itemPrice).replace('$', '')}</p>
                        <p className={`text-[10px] font-bold ${itemIsPositive ? 'text-dream-green' : 'text-dream-red'}`}>
                          {formatPercent(itemChange)}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}

                {filteredPairs.length === 0 && (
                  <p className="text-xs text-center text-dm-text3 my-4">No pairs found</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-8 md:gap-12 w-full lg:w-auto">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-bold text-dm-text3 uppercase tracking-wider">Mark Price</p>
          <p className="font-bold text-lg md:text-[20px] text-dm-text tracking-tight">{formatCurrency(displayPrice)}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-bold text-dm-text3 uppercase tracking-wider">24h Change</p>
          <p className={`font-bold text-lg md:text-[20px] tracking-tight ${isPositive ? 'text-dream-green' : 'text-dream-red'}`}>
            {formatPercent(change24h)}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-bold text-dm-text3 uppercase tracking-wider">24h Volume</p>
          <p className="font-bold text-lg md:text-[20px] text-dm-text tracking-tight">{volume24h}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-bold text-dm-text3 uppercase tracking-wider">Funding Rate</p>
          <p className="font-bold text-lg md:text-[20px] text-brand-accent tracking-tight">{fundingRate.toFixed(4)}%</p>
        </div>
      </div>
    </section>
  );
}
