import React from 'react';
import { motion } from 'motion/react';
import { Pair } from '../types';
import { formatCurrency } from '../utils';
import { ArrowLeft, Star, TrendingUp, Activity, PieChart } from 'lucide-react';
import { Chart } from './Chart';

interface MobileChartScreenProps {
  pair: Pair;
  onBack: () => void;
}

export function MobileChartScreen({ pair, onBack }: MobileChartScreenProps) {
  const isPositive = pair.change >= 0;

  return (
    <div className="flex flex-col h-full bg-dm-surface relative z-[60]">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-dm-border sticky top-0 bg-dm-surface/80 backdrop-blur-md z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-dm-text2 hover:bg-dm-surface-alt rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-lg text-dm-text">{pair.pair.split('/')[0]} USDC</span>
          <span className="text-[10px] font-bold text-dream-blue bg-dream-blue/10 px-1.5 py-0.5 rounded-md">50x</span>
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
          <div className="w-16 h-16 rounded-full bg-dm-surface-alt flex items-center justify-center font-black text-3xl text-dm-text3 border-4 border-dm-surface shadow-sm -mt-2">
            {pair.pair.charAt(0)}
          </div>
        </div>

        {/* Chart Area */}
        <div className="px-4 mb-8">
          <div className="rounded-[16px] h-[320px] relative overflow-hidden shadow-sm">
            <Chart pair={pair} />
          </div>
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
            <div className="font-bold text-dm-text">$3.1B</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-dm-text3">
              <PieChart size={20} />
              <span className="font-bold">Open interest</span>
            </div>
            <div className="font-bold text-dm-text">$1.9B</div>
          </div>
        </div>
      </div>
    </div>
  );
}
