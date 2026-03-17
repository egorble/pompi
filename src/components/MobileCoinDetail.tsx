import React from 'react';
import { motion } from 'motion/react';
import { Pair } from '../types';
import { formatCurrency, getMarketId } from '../utils';
import { ArrowLeft, Star, TrendingUp, Activity, PieChart } from 'lucide-react';
import { Chart } from './Chart';
import { useStore } from '../store';
import { getTokenLogo } from '../tokenLogos';

interface MobileCoinDetailProps {
  pair: Pair;
  onBack: () => void;
  onOpenTrade: (side: 'Long' | 'Short') => void;
}

export function MobileCoinDetail({ pair, onBack, onOpenTrade }: MobileCoinDetailProps) {
  const { tickers } = useStore();
  const ticker = tickers[getMarketId(pair.pair)];
  const isPositive = (ticker?.change_24h_pct ?? pair.change) >= 0;

  return (
    <div className="flex flex-col h-full bg-white relative z-50">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-lg text-slate-900">{pair.pair.split('/')[0]} USDC</span>
          <span className="text-[10px] font-bold text-dream-blue bg-blue-50 px-1.5 py-0.5 rounded-md">PERP</span>
        </div>
        <button className="p-2 -mr-2 text-slate-400 hover:text-yellow-400 transition-colors">
          <Star size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        {/* Price Info */}
        <div className="px-6 pt-8 pb-6 flex justify-between items-start">
          <div>
            <div className="text-5xl font-black text-slate-900 tracking-tighter">
              {formatCurrency(pair.price)}
            </div>
            <div className={`text-sm font-bold mt-2 ${isPositive ? 'text-dream-green' : 'text-dream-red'}`}>
              {isPositive ? '↑' : '↓'}{Math.abs(pair.change)}% past day
            </div>
          </div>
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center font-black text-3xl text-slate-400 border-4 border-white shadow-sm -mt-2 overflow-hidden">
            {getTokenLogo(pair.pair) ? (
              <img src={getTokenLogo(pair.pair)!} alt={pair.pair} className="w-full h-full object-cover p-2.5" />
            ) : (
              pair.pair.charAt(0)
            )}
          </div>
        </div>

        {/* Chart Area */}
        <div className="px-4 mb-8">
          <div className="bg-dream-blue rounded-2xl p-4 h-[280px] relative overflow-hidden shadow-sm">
             <div className="absolute inset-0 opacity-90">
               <Chart pair={pair} />
             </div>
          </div>
        </div>

        {/* Timeframes */}
        <div className="flex justify-center mb-10">
          <div className="bg-slate-50 rounded-full p-1.5 flex gap-1 shadow-inner">
            {['1H', '24H', '1W'].map(tf => (
              <button key={tf} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${tf === '24H' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="px-8 space-y-6 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-slate-400">
              <TrendingUp size={20} />
              <span className="font-bold">24h change</span>
            </div>
            <div className={`font-bold ${isPositive ? 'text-dream-green' : 'text-dream-red'}`}>
              {isPositive ? '↑' : '↓'}${(pair.price * Math.abs(pair.change) / 100).toFixed(2)} / {isPositive ? '↑' : '↓'}{Math.abs(pair.change)}%
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-slate-400">
              <Activity size={20} />
              <span className="font-bold">24h volume</span>
            </div>
            <div className="font-bold text-slate-900">{ticker?.volume_24h_usd ? `$${ticker.volume_24h_usd.toLocaleString(undefined, {maximumFractionDigits: 0})}` : '—'}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-slate-400">
              <PieChart size={20} />
              <span className="font-bold">Open interest</span>
            </div>
            <div className="font-bold text-slate-900">{ticker?.open_interest_usd ? `$${ticker.open_interest_usd.toLocaleString(undefined, {maximumFractionDigits: 0})}` : '—'}</div>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent flex gap-3 z-40 pb-safe">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onOpenTrade('Short')}
          className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-lg"
        >
          <span className="text-xl">↘</span> Short
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onOpenTrade('Long')}
          className="flex-1 bg-dream-blue text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-lg shadow-dream-blue/20"
        >
          <span className="text-xl">↗</span> Long
        </motion.button>
      </div>
    </div>
  );
}
