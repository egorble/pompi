import React from 'react';
import { motion } from 'motion/react';
import { Pair } from '../types';
import { formatCurrency, getMarketId } from '../utils';
import { ArrowLeft, Star, TrendingUp, Activity, PieChart } from 'lucide-react';
import { Chart } from './Chart';
import { useStore } from '../store';
import { getTokenLogo } from '../tokenLogos';

interface MobileChartScreenProps {
  pair: Pair;
  onBack: () => void;
}

export function MobileChartScreen({ pair, onBack }: MobileChartScreenProps) {
  const { tickers, lastPrice } = useStore();
  const ticker = tickers[getMarketId(pair.pair)];
  const change24h = ticker?.change_24h_pct ?? pair.change;
  const isPositive = change24h >= 0;

  return (
    <div className="flex flex-col h-full bg-dm-surface relative z-[60]">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-dm-border sticky top-0 bg-dm-surface/80 backdrop-blur-md z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-dm-text2 hover:bg-dm-surface-alt rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-lg text-dm-text">{pair.pair.split('/')[0]} USDC</span>
          <span className="text-[10px] font-bold text-dream-blue bg-dream-blue/10 px-1.5 py-0.5 rounded-md">PERP</span>
        </div>
        <button className="p-2 -mr-2 text-dm-text3 hover:text-yellow-400 transition-colors">
          <Star size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        {/* Price Info */}
        <div className="px-6 pt-8 pb-6 flex justify-between items-start">
          <div>
            <div className="text-5xl font-black text-dm-text tracking-tighter">
              {formatCurrency(pair.price)}
            </div>
            <div className={`text-sm font-bold mt-2 ${isPositive ? 'text-dream-green' : 'text-dream-red'}`}>
              {isPositive ? '↑' : '↓'}{Math.abs(pair.change)}% past day
            </div>
          </div>
          <div className="w-16 h-16 rounded-full bg-dm-surface-alt flex items-center justify-center font-black text-3xl text-dm-text3 border-4 border-dm-surface shadow-sm -mt-2 overflow-hidden">
            {getTokenLogo(pair.pair) ? (
              <img src={getTokenLogo(pair.pair)!} alt={pair.pair} className="w-full h-full object-cover p-2.5" />
            ) : (
              pair.pair.charAt(0)
            )}
          </div>
        </div>

        {/* Chart Area */}
        <div className="px-4 mb-8 h-[320px] relative">
          <Chart pair={pair} />
        </div>

        {/* Timeframes */}
        <div className="flex justify-center mb-10">
          <div className="bg-dm-surface-alt rounded-full p-1.5 flex gap-1 shadow-inner">
            {['1H', '24H', '1W'].map(tf => (
              <button key={tf} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${tf === '24H' ? 'bg-dm-surface shadow-sm text-dm-text' : 'text-dm-text3 hover:text-dm-text2'}`}>
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="px-8 space-y-6 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-dm-text3">
              <TrendingUp size={20} />
              <span className="font-bold">24h change</span>
            </div>
            <div className={`font-bold ${isPositive ? 'text-dream-green' : 'text-dream-red'}`}>
              {isPositive ? '↑' : '↓'}${(pair.price * Math.abs(pair.change) / 100).toFixed(2)} / {isPositive ? '↑' : '↓'}{Math.abs(pair.change)}%
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-dm-text3">
              <Activity size={20} />
              <span className="font-bold">24h volume</span>
            </div>
            <div className="font-bold text-dm-text">{ticker?.volume_24h_usd ? `$${ticker.volume_24h_usd.toLocaleString(undefined, {maximumFractionDigits: 0})}` : '—'}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-dm-text3">
              <PieChart size={20} />
              <span className="font-bold">Open interest</span>
            </div>
            <div className="font-bold text-dm-text">{ticker?.open_interest_usd ? `$${ticker.open_interest_usd.toLocaleString(undefined, {maximumFractionDigits: 0})}` : '—'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
