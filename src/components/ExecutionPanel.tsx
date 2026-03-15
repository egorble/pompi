import React, { useState, useRef, useEffect } from 'react';
import { Pair } from '../types';
import { formatCurrency } from '../utils';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRightLeft, ChevronDown } from 'lucide-react';

interface ExecutionPanelProps {
  pair: Pair;
  onPlaceTrade: (trade: { type: 'Long' | 'Short', leverage: number, sizeUsd: number, price?: number }) => void;
}

export function ExecutionPanel({ pair, onPlaceTrade }: ExecutionPanelProps) {
  const [side, setSide] = useState<'Long' | 'Short'>('Long');
  const [orderType, setOrderType] = useState<'Market' | 'Limit'>('Market');
  const [marginMode, setMarginMode] = useState<'Cross' | 'Isolated'>('Cross');
  const [sizeStr, setSizeStr] = useState('1000');
  const [priceStr, setPriceStr] = useState(pair.price.toString());
  const [leverage, setLeverage] = useState(25);
  const [showLeverageDropdown, setShowLeverageDropdown] = useState(false);
  const [sizePercent, setSizePercent] = useState(0);
  const [reduceOnly, setReduceOnly] = useState(false);
  const [tpsl, setTpsl] = useState(false);

  const leverageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (leverageRef.current && !leverageRef.current.contains(event.target as Node)) {
        setShowLeverageDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sizeUsd = parseFloat(sizeStr) || 0;
  const orderPrice = orderType === 'Limit' ? (parseFloat(priceStr) || pair.price) : pair.price;

  const liqPrice = side === 'Long'
    ? orderPrice * (1 - 1 / leverage)
    : orderPrice * (1 + 1 / leverage);
  const executionFee = sizeUsd * 0.0012;

  const handleTrade = () => {
    if (sizeUsd <= 0) return;
    onPlaceTrade({
      type: side,
      leverage,
      sizeUsd,
      ...(orderType === 'Limit' && { price: orderPrice })
    });
  };

  const handleSizePercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = parseInt(e.target.value);
    setSizePercent(percent);
    const available = 10000;
    setSizeStr(((available * percent) / 100).toString());
  };

  return (
    <section className="bg-dm-surface p-2.5 md:p-3 rounded-2xl dream-shadow shrink-0">
      {/* Top Row: Margin, Leverage, Mode */}
      <div ref={leverageRef}>
        <div className="flex gap-2 mb-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMarginMode(m => m === 'Cross' ? 'Isolated' : 'Cross')}
            className="flex-1 py-1.5 px-2 bg-dm-surface hover:bg-dm-surface-alt border border-dm-border2 rounded-lg text-xs font-bold text-dream-blue transition-colors"
          >
            {marginMode}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLeverageDropdown(!showLeverageDropdown)}
            className={`flex-1 py-1.5 px-2 border rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 ${showLeverageDropdown
              ? 'bg-dm-surface border-dm-border2 text-dream-blue'
              : 'bg-dm-surface hover:bg-dm-surface-alt border-dm-border2 text-dream-blue'
              }`}
          >
            {leverage}x
          </motion.button>
        </div>

        <AnimatePresence>
          {showLeverageDropdown && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: 'auto', opacity: 1, marginBottom: 16 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-dm-surface border border-dm-border2 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-dm-text2">Leverage</span>
                  <span className="text-sm font-extrabold text-dream-blue">{leverage}x</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={leverage}
                  onChange={(e) => setLeverage(parseInt(e.target.value))}
                  className="w-full dream-slider text-dream-blue mb-3"
                  style={{ background: `linear-gradient(to right, color-mix(in srgb, currentColor 10%, transparent) 0%, currentColor ${leverage}%, var(--dm-surface-strong) ${leverage}%)` }}
                />
                <div className="flex justify-between text-xs text-dm-text3 font-bold">
                  <span>1x</span>
                  <span>50x</span>
                  <span>100x</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Long / Short Toggle with Animation */}
      <div className="relative flex p-1 bg-dm-surface rounded-xl mb-3 border border-dm-border2">
        <motion.div
          className="absolute inset-y-1 w-[calc(50%-4px)] z-0 rounded-lg shadow-sm"
          animate={{
            left: side === 'Long' ? '4px' : 'calc(50%)',
            backgroundColor: side === 'Long' ? '#16A34A' : '#EF4444',
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setSide('Long')}
          className={`relative z-10 flex-1 py-2.5 rounded-lg font-extrabold text-sm transition-colors ${side === 'Long' ? 'text-white' : 'text-dm-text3 hover:text-dm-text2'
            }`}
        >
          Long
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setSide('Short')}
          className={`relative z-10 flex-1 py-2.5 rounded-lg font-extrabold text-sm transition-colors ${side === 'Short' ? 'text-white' : 'text-dm-text3 hover:text-dm-text2'
            }`}
        >
          Short
        </motion.button>
      </div>

      {/* Market / Limit Tabs */}
      <div className="flex gap-4 mb-3 border-b border-dm-border px-1">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOrderType('Market')}
          className={`pb-2 text-sm font-bold relative transition-colors ${orderType === 'Market' ? 'text-dm-text' : 'text-dm-text3 hover:text-dm-text2'
            }`}
        >
          Market
          {orderType === 'Market' && (
            <motion.div layoutId="activeOrderTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-dm-text rounded-t-full" />
          )}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOrderType('Limit')}
          className={`pb-2 text-sm font-bold relative transition-colors ${orderType === 'Limit' ? 'text-dm-text' : 'text-dm-text3 hover:text-dm-text2'
            }`}
        >
          Limit
          {orderType === 'Limit' && (
            <motion.div layoutId="activeOrderTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-dm-text rounded-t-full" />
          )}
        </motion.button>
      </div>

      <div className="flex justify-between items-center text-xs mb-2 px-1">
        <span className="text-dm-text3 font-medium">Available Balance</span>
        <span className="font-bold text-dm-text2">10,000.00 USDC</span>
      </div>

      {/* Inputs */}
      <div className="space-y-3 mb-3">
        <AnimatePresence>
          {orderType === 'Limit' && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="relative"
            >
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <span className="text-dm-text3 font-bold text-sm">Price</span>
              </div>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="number"
                value={priceStr}
                onChange={(e) => setPriceStr(e.target.value)}
                className="w-full py-3 pl-16 pr-16 bg-dm-surface border border-dm-border2 rounded-xl font-bold text-sm text-right text-dm-text focus:border-dream-blue/30 focus:ring-2 focus:ring-dream-blue/20 outline-none transition-all"
              />
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <span className="text-dm-text2 font-bold text-sm">USDC</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <span className="text-dm-text3 font-bold text-sm">Total</span>
          </div>
          <input
            type="number"
            value={sizeStr}
            onChange={(e) => {
              setSizeStr(e.target.value);
              setSizePercent(Math.min(100, Math.max(0, (parseFloat(e.target.value) || 0) / 100)));
            }}
            className="w-full py-3 pl-16 pr-20 bg-dm-surface border border-dm-border2 rounded-xl font-bold text-sm text-right text-dm-text focus:border-dream-blue/30 focus:ring-2 focus:ring-dream-blue/20 outline-none transition-all"
          />
          <div className="absolute inset-y-0 right-4 flex items-center gap-1 pointer-events-none">
            <span className="text-dm-text2 font-bold text-sm">USDC</span>
            <ArrowRightLeft size={14} className="text-dm-text3" />
          </div>
        </motion.div>
      </div>

      {/* Slider */}
      <div className="flex items-center gap-3 mb-3 px-1">
        <input
          type="range"
          min="0"
          max="100"
          value={sizePercent}
          onChange={handleSizePercentChange}
          className="flex-1 dream-slider text-dream-blue"
          style={{ background: `linear-gradient(to right, color-mix(in srgb, currentColor 10%, transparent) 0%, currentColor ${sizePercent}%, var(--dm-surface-strong) ${sizePercent}%)` }}
        />
        <motion.div
          key={sizePercent}
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          className="px-2 py-1 bg-dm-surface border border-dm-border2 rounded-lg text-xs font-bold text-dm-text2 w-12 text-center"
        >
          {sizePercent}%
        </motion.div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-2 mb-4 px-1">
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <motion.div
            whileTap={{ scale: 0.8 }}
            className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${reduceOnly ? 'bg-dream-blue' : 'bg-dm-surface-strong group-hover:bg-dm-surface-raised'}`}
          >
            {reduceOnly && <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></motion.svg>}
          </motion.div>
          <span className="text-xs font-bold text-dm-text2 group-hover:text-dm-text transition-colors">Reduce-only</span>
          <input type="checkbox" className="hidden" checked={reduceOnly} onChange={(e) => setReduceOnly(e.target.checked)} />
        </label>
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <motion.div
            whileTap={{ scale: 0.8 }}
            className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${tpsl ? 'bg-dream-blue' : 'bg-dm-surface-strong group-hover:bg-dm-surface-raised'}`}
          >
            {tpsl && <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></motion.svg>}
          </motion.div>
          <span className="text-xs font-bold text-dm-text2 group-hover:text-dm-text transition-colors">TP/SL</span>
          <input type="checkbox" className="hidden" checked={tpsl} onChange={(e) => setTpsl(e.target.checked)} />
        </label>
      </div>

      {/* Stats */}
      <div className="space-y-1.5 py-2 px-1 mb-4">
        <div className="flex justify-between text-[11px] md:text-xs">
          <span className="text-dm-text3 font-medium">Liquidation Price</span>
          <span className="font-bold text-dm-text2">{formatCurrency(liqPrice)}</span>
        </div>
        <div className="flex justify-between text-[11px] md:text-xs">
          <span className="text-dm-text3 font-medium">Execution Fee</span>
          <span className="font-bold text-dm-text2">{formatCurrency(executionFee)}</span>
        </div>
      </div>

      {/* Place Trade Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleTrade}
        className={`w-full py-3.5 rounded-xl font-black text-base uppercase tracking-widest transition-all shadow-xl ${side === 'Long'
          ? 'bg-dream-green neon-button-green text-white'
          : 'bg-dream-red neon-button-red text-white'
          }`}
      >
        {side === 'Long' ? 'Buy / Long' : 'Sell / Short'}
      </motion.button>
    </section>
  );
}
