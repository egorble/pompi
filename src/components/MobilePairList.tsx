import React from 'react';
import { motion } from 'motion/react';
import { Pair } from '../types';
import { formatCurrency } from '../utils';
import { Search, Menu } from 'lucide-react';
import { getTokenLogo } from '../tokenLogos';

interface MobilePairListProps {
  pairs: Pair[];
  onSelect: (pair: Pair) => void;
}

export function MobilePairList({ pairs, onSelect }: MobilePairListProps) {
  return (
    <div className="flex flex-col h-full bg-white rounded-t-3xl shadow-sm">
      <div className="px-6 pt-6 pb-4 flex justify-between items-center">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Perps</h1>
        <div className="flex gap-3">
          <button className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
            <Menu size={20} />
          </button>
          <button className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
            <Search size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pb-24 px-2">
        {pairs.map((pair) => {
          const isPositive = pair.change >= 0;
          const logo = getTokenLogo(pair.pair);
          return (
            <motion.div
              key={pair.pair}
              whileTap={{ scale: 0.98, backgroundColor: '#f8fafc' }}
              onClick={() => onSelect(pair)}
              className="flex items-center justify-between px-4 py-4 border-b border-slate-50 cursor-pointer rounded-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center font-black text-xl text-slate-400 border border-slate-100 shadow-sm overflow-hidden">
                  {logo ? (
                    <img src={logo} alt={pair.pair} className="w-full h-full object-cover p-2" />
                  ) : (
                    pair.pair.charAt(0)
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-extrabold text-lg text-slate-900">{pair.pair.split('/')[0]}</span>
                    <span className="text-[10px] font-bold text-dream-blue bg-blue-50 px-1.5 py-0.5 rounded-md">50x</span>
                  </div>
                  <div className="text-xs text-slate-400 font-bold">
                    $1.2B · 24h vol
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-extrabold text-slate-900 text-lg">{formatCurrency(pair.price)}</div>
                <div className={`text-xs font-bold mt-0.5 ${isPositive ? 'text-dream-green' : 'text-dream-red'}`}>
                  {isPositive ? '↑' : '↓'}{Math.abs(pair.change)}%
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
