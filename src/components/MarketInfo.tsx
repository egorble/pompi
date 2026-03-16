import React, { useState, useRef, useEffect } from 'react';
import { Pair } from '../types';
import { formatCurrency, formatPercent } from '../utils';
import { ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';

interface MarketInfoProps {
  pair: Pair;
  pairs: Pair[];
  onSelectPair: (pair: Pair) => void;
}

export function MarketInfo({ pair, pairs, onSelectPair }: MarketInfoProps) {
  const { lastPrice, isConnected } = useStore();
  const displayPrice = lastPrice > 0 ? lastPrice : pair.price;
  const isPositive = pair.change >= 0;
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
    <section className="bg-dm-surface p-2.5 md:p-3 rounded-dream dream-shadow flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 shrink-0 relative z-40">
      <div className="flex items-center gap-2 md:gap-3 relative" ref={dropdownRef}>
        <div className="w-10 h-10 md:w-11 md:h-11 bg-dream-blue/15 rounded-xl flex items-center justify-center shrink-0">
          <span className="text-dream-blue font-bold text-lg md:text-xl">{pair.name.charAt(0)}</span>
        </div>

        <div
          className="cursor-pointer group flex items-center gap-2"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-xl md:text-2xl text-dm-text group-hover:text-dream-blue transition-colors">
                {pair.pair.replace('/USDC', '-PERP')}
              </h2>
              <ChevronDown size={20} className={`text-dm-text3 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </div>
            <p className="text-dm-text3 text-xs md:text-sm font-medium">{pair.name} / USDC</p>
          </motion.div>
        </div>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 mt-4 w-72 bg-dm-surface rounded-2xl shadow-2xl border border-dm-border overflow-hidden z-50"
            >
              <div className="p-3 border-b border-dm-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dm-text3 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search pairs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-dm-surface-alt border-none rounded-xl py-2 pl-9 pr-4 text-sm font-medium text-dm-text focus:ring-2 focus:ring-dream-blue/20 placeholder:text-dm-text3 outline-none"
                  />
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto custom-scrollbar p-2">
                {filteredPairs.map((item) => {
                  const isSelected = pair.id === item.id;
                  const itemIsPositive = item.change >= 0;

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
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-colors group ${isSelected ? 'bg-dream-blue/10 border border-dream-blue/20' : 'hover:bg-dm-surface-alt border border-transparent'
                        }`}
                    >
                      <div className="text-left">
                        <p className="text-sm font-bold text-dm-text">{item.pair}</p>
                        <p className="text-[10px] text-dm-text3 font-medium">{item.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-dm-text">{formatCurrency(item.price).replace('$', '')}</p>
                        <p className={`text-[10px] font-bold ${itemIsPositive ? 'text-dream-green' : 'text-dream-red'}`}>
                          {formatPercent(item.change)}
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 w-full lg:w-auto">
        <div>
          <p className="text-[10px] uppercase font-bold text-dm-text3">Mark Price {isConnected && <span className="inline-block w-1.5 h-1.5 rounded-full bg-dream-green ml-1" />}</p>
          <p className="font-bold text-base md:text-lg text-dm-text">{formatCurrency(displayPrice)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-dm-text3">24h Change</p>
          <p className={`font-bold text-base md:text-lg ${isPositive ? 'text-dream-green' : 'text-dream-red'}`}>
            {formatPercent(pair.change)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-dm-text3">24h Volume</p>
          <p className="font-bold text-base md:text-lg text-dm-text">{pair.volume}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-dm-text3">Funding Rate</p>
          <p className="font-bold text-base md:text-lg text-dream-blue">{pair.funding.toFixed(4)}%</p>
        </div>
      </div>
    </section>
  );
}
