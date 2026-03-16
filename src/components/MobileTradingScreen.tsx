import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pair } from '../types';
import { formatCurrency } from '../utils';
import { BarChart2, ChevronDown, MoreHorizontal, Plus, Minus, Info, X, Check, ArrowLeft, Search } from 'lucide-react';

interface MobileTradingScreenProps {
  pair: Pair;
  pairs: Pair[];
  onSelectPair: (pair: Pair) => void;
  onOpenChart: () => void;
  balance: number;
  onPlaceTrade: (trade: { type: 'Long' | 'Short', leverage: number, sizeUsd: number, price?: number }) => void;
}

export function MobileTradingScreen({ pair, pairs, onSelectPair, onOpenChart, balance, onPlaceTrade }: MobileTradingScreenProps) {
  const [view, setView] = useState<'pairs' | 'trading'>('pairs');
  const [searchQuery, setSearchQuery] = useState('');

  // Trade form state
  const [orderType, setOrderType] = useState<'Limit' | 'Market'>('Market');
  const [leverage, setLeverage] = useState(50);
  const [amountStr, setAmountStr] = useState('');
  const [priceStr, setPriceStr] = useState(pair.price.toString());
  const [sliderValue, setSliderValue] = useState(0);
  const [showLeverageSelector, setShowLeverageSelector] = useState(false);
  const [tradeMode, setTradeMode] = useState<'Open' | 'Close'>('Open');
  const [marginMode, setMarginMode] = useState<'Cross' | 'Isolated'>('Cross');
  const [tpSlEnabled, setTpSlEnabled] = useState(false);
  const [tpPrice, setTpPrice] = useState('');
  const [slPrice, setSlPrice] = useState('');

  const isPositive = pair.change >= 0;
  const baseAsset = pair.pair.split('/')[0];

  const filteredPairs = pairs.filter(p =>
    p.pair.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const asks = useMemo(() => [...Array(8)].map((_, i) => {
    const askPrice = pair.price + (8 - i) * (pair.price * 0.0005);
    const amount = (Math.random() * 2 + 0.1).toFixed(4);
    const depth = Math.random() * 100;
    return { askPrice, amount, depth };
  }), [pair.price]);

  const bids = useMemo(() => [...Array(8)].map((_, i) => {
    const bidPrice = pair.price - (i + 1) * (pair.price * 0.0005);
    const amount = (Math.random() * 2 + 0.1).toFixed(4);
    const depth = Math.random() * 100;
    return { bidPrice, amount, depth };
  }), [pair.price]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSliderValue(val);
    const maxUsd = balance * leverage;
    const targetUsd = (maxUsd * val) / 100;
    const targetAsset = targetUsd / pair.price;
    setAmountStr(targetAsset > 0 ? targetAsset.toFixed(4) : '');
  };

  const handleTrade = (type: 'Long' | 'Short') => {
    const sizeAsset = parseFloat(amountStr) || 0;
    if (sizeAsset <= 0) return;

    onPlaceTrade({
      type,
      leverage,
      sizeUsd: sizeAsset * pair.price,
      price: orderType === 'Limit' ? parseFloat(priceStr) : undefined
    });

    setAmountStr('');
    setSliderValue(0);
  };

  const selectPair = (p: Pair) => {
    onSelectPair(p);
    setPriceStr(p.price.toString());
    setView('trading');
  };

  // ===== PAIRS LIST VIEW =====
  if (view === 'pairs') {
    return (
      <div className="flex flex-col h-full bg-dm-surface">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 shrink-0">
          <h1 className="text-xl font-black text-dm-text mb-3">Markets</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dm-text3 w-4 h-4" />
            <input
              type="text"
              placeholder="Search pairs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dm-surface-alt border border-dm-border rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium text-dm-text placeholder:text-dm-text3 outline-none focus:border-dream-blue/30 focus:ring-2 focus:ring-dream-blue/20"
            />
          </div>
        </div>

        {/* Column Headers */}
        <div className="flex justify-between items-center px-4 py-2 text-[10px] font-bold text-dm-text3 uppercase border-b border-dm-border">
          <span>Pair</span>
          <div className="flex gap-8">
            <span>Price</span>
            <span className="w-16 text-right">24h</span>
          </div>
        </div>

        {/* Pairs List */}
        <div className="flex-1 overflow-y-auto pb-20">
          {filteredPairs.map(p => {
            const pIsPositive = p.change >= 0;
            return (
              <button
                key={p.id}
                onClick={() => selectPair(p)}
                className="w-full flex items-center justify-between px-4 py-3.5 border-b border-dm-border hover:bg-dm-surface-alt active:bg-dm-surface-raised transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-dm-surface-raised flex items-center justify-center font-bold text-sm text-dm-text2">
                    {p.pair.charAt(0)}
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-dm-text block text-sm">{p.pair.replace('/USDC', '')}</span>
                    <span className="text-[11px] text-dm-text3">{p.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-sm text-dm-text">{formatCurrency(p.price)}</span>
                  <span className={`text-xs font-bold w-16 text-right px-2 py-1 rounded ${pIsPositive ? 'bg-dream-green/10 text-dream-green' : 'bg-dream-red/10 text-dream-red'}`}>
                    {pIsPositive ? '+' : ''}{p.change}%
                  </span>
                </div>
              </button>
            );
          })}
          {filteredPairs.length === 0 && (
            <p className="text-center text-dm-text3 text-sm mt-8">No pairs found</p>
          )}
        </div>
      </div>
    );
  }

  // ===== TRADING VIEW (2 columns: order form + order book) =====
  return (
    <div className="flex flex-col h-full bg-dm-surface relative">
      {/* Leverage Selector Overlay */}
      <AnimatePresence>
        {showLeverageSelector && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLeverageSelector(false)}
              className="fixed inset-0 bg-black/60 z-[100]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-dm-surface rounded-t-3xl z-[101] p-6 pb-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-black text-dm-text">Adjust Leverage</h2>
                <button onClick={() => setShowLeverageSelector(false)} className="p-2 text-dm-text3 hover:text-dm-text -mr-2">
                  <X size={24} />
                </button>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-dm-text3 font-bold">Leverage</span>
                <span className="text-2xl font-black text-dream-blue">{leverage}x</span>
              </div>
              <input
                type="range" min="1" max="100" value={leverage}
                onChange={(e) => setLeverage(parseInt(e.target.value))}
                className="w-full dream-slider text-dream-blue mb-3"
                style={{ background: `linear-gradient(to right, color-mix(in srgb, currentColor 10%, transparent) 0%, currentColor ${leverage}%, var(--dm-surface-strong) ${leverage}%)` }}
              />
              <div className="flex justify-between text-[10px] text-dm-text3 font-bold mb-6">
                <span>1x</span><span>25x</span><span>50x</span><span>75x</span><span>100x</span>
              </div>
              <button
                onClick={() => setShowLeverageSelector(false)}
                className="w-full bg-dm-inverse text-dm-surface font-black py-4 rounded-xl text-lg uppercase tracking-wide"
              >
                Confirm
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-dm-border shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => setView('pairs')} className="p-1 -ml-1 text-dm-text2">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-black text-dm-text">{pair.pair.replace('/', '')}</h1>
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${isPositive ? 'bg-dream-green/10 text-dream-green' : 'bg-dream-red/10 text-dream-red'}`}>
            {isPositive ? '+' : ''}{pair.change}%
          </span>
        </div>
        <div className="flex items-center gap-4 text-dm-text2">
          <button onClick={onOpenChart} className="hover:text-dream-blue transition-colors">
            <BarChart2 size={22} />
          </button>
          <button>
            <MoreHorizontal size={22} />
          </button>
        </div>
      </div>

      {/* Main Content - 2 Columns */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column - Order Entry */}
        <div className="w-[60%] border-r border-dm-border p-3 overflow-y-auto no-scrollbar pb-24">
          {/* Margin & Leverage */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setMarginMode(prev => prev === 'Cross' ? 'Isolated' : 'Cross')}
              className="flex-1 bg-dm-surface-alt hover:bg-dm-surface-raised transition-colors rounded-lg py-1.5 px-2 flex justify-between items-center text-xs font-bold text-dm-text2 border border-dm-border"
            >
              {marginMode} <ChevronDown size={14} className="text-dm-text3" />
            </button>
            <button
              onClick={() => setShowLeverageSelector(true)}
              className="flex-1 bg-dm-surface-alt hover:bg-dm-surface-raised transition-colors rounded-lg py-1.5 px-2 flex justify-between items-center text-xs font-bold text-dream-blue border border-dm-border"
            >
              {leverage}x <ChevronDown size={14} className="text-dm-text3" />
            </button>
          </div>

          {/* Open / Close Tabs */}
          <div className="flex bg-dm-surface-alt rounded-lg p-1 mb-3 border border-dm-border">
            <button
              onClick={() => setTradeMode('Open')}
              className={`flex-1 rounded-md py-1.5 text-xs font-bold transition-all ${tradeMode === 'Open' ? 'bg-dm-surface shadow-sm text-dm-text' : 'text-dm-text3'}`}
            >
              Open
            </button>
            <button
              onClick={() => setTradeMode('Close')}
              className={`flex-1 rounded-md py-1.5 text-xs font-bold transition-all ${tradeMode === 'Close' ? 'bg-dm-surface shadow-sm text-dm-text' : 'text-dm-text3'}`}
            >
              Close
            </button>
          </div>

          {/* Available Balance */}
          <div className="flex justify-between items-center mb-3 text-[11px] font-bold">
            <span className="text-dm-text3 border-b border-dashed border-dm-border2">Avail</span>
            <span className="text-dm-text">{formatCurrency(balance)}</span>
          </div>

          {/* Order Type */}
          <button
            onClick={() => setOrderType(prev => prev === 'Market' ? 'Limit' : 'Market')}
            className="w-full bg-dm-surface-alt hover:bg-dm-surface-raised transition-colors rounded-lg py-2 px-3 flex justify-between items-center text-xs font-bold text-dm-text2 mb-3 border border-dm-border"
          >
            <div className="flex items-center gap-1">
              <Info size={12} className="text-dm-text3" />
              {orderType}
            </div>
            <ChevronDown size={14} className="text-dm-text3" />
          </button>

          {/* Price Input (Limit only) */}
          {orderType === 'Limit' && (
            <div className="flex gap-2 mb-3">
              <div className="flex-1 bg-dm-surface-alt border border-dm-border rounded-lg flex items-center px-2 py-1.5">
                <button className="text-dm-text3 hover:text-dm-text p-1 transition-colors" onClick={() => setPriceStr((parseFloat(priceStr) - 10).toString())}>
                  <Minus size={14} />
                </button>
                <input
                  type="text"
                  value={priceStr}
                  onChange={(e) => setPriceStr(e.target.value)}
                  className="w-full bg-transparent text-center font-bold text-xs outline-none text-dm-text"
                />
                <button className="text-dm-text3 hover:text-dm-text p-1 transition-colors" onClick={() => setPriceStr((parseFloat(priceStr) + 10).toString())}>
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Amount Input */}
          <div className="bg-dm-surface-alt border border-dm-border rounded-lg flex items-center px-3 py-2 mb-3">
            <input
              type="number"
              placeholder="Amount"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              className="w-full bg-transparent font-bold text-xs outline-none text-dm-text placeholder:text-dm-text3"
            />
            <span className="text-dm-text3 text-xs font-bold ml-2">{baseAsset}</span>
          </div>

          {/* Slider */}
          <div className="mb-4 px-1">
            <input
              type="range" min="0" max="100" value={sliderValue}
              onChange={handleSliderChange}
              className="w-full dream-slider text-dream-blue"
              style={{ background: `linear-gradient(to right, color-mix(in srgb, currentColor 10%, transparent) 0%, currentColor ${sliderValue}%, var(--dm-surface-strong) ${sliderValue}%)` }}
            />
            <div className="flex justify-between text-[10px] font-bold text-dm-text3 mt-1">
              <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
            </div>
          </div>

          {/* TP/SL Checkbox */}
          <div className="flex justify-end items-center mb-2 mt-4 cursor-pointer group" onClick={() => setTpSlEnabled(!tpSlEnabled)}>
            <motion.div
              whileTap={{ scale: 0.8 }}
              className={`w-4 h-4 rounded flex items-center justify-center transition-colors relative ${tpSlEnabled ? 'bg-dream-blue' : 'border border-dm-border2 group-hover:bg-dm-surface-raised'}`}
            >
              {tpSlEnabled && (
                <>
                  <Check size={12} strokeWidth={4} className="text-white absolute inset-0 m-auto block group-hover:hidden" />
                  <Minus size={12} strokeWidth={4} className="text-white absolute inset-0 m-auto hidden group-hover:block" />
                </>
              )}
            </motion.div>
            <span className="ml-2 text-xs font-bold text-dm-text2 group-hover:text-dm-text transition-colors">TP/SL</span>
          </div>

          <AnimatePresence>
            {tpSlEnabled && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-4"
              >
                <div className="flex flex-col gap-3 pt-1 pb-1 px-1">
                  {/* TP Section */}
                  <div>
                    <div className="flex justify-end mb-1">
                      <div className="flex items-center text-[10px] text-dm-text3 cursor-pointer hover:text-dm-text transition-colors font-bold">
                        Mark <ChevronDown size={12} className="ml-0.5" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-transparent border border-dm-border rounded-lg flex items-center px-3 py-2 shadow-sm focus-within:border-dream-blue/30 focus-within:ring-1 focus-within:ring-dream-blue/20 transition-all">
                        <input
                          type="number" value={tpPrice} onChange={e => setTpPrice(e.target.value)} placeholder="Price TP"
                          className="w-full bg-transparent text-left font-bold text-xs outline-none text-dm-text"
                        />
                      </div>
                      <div className="flex-1 bg-transparent border border-dm-border rounded-lg flex items-center px-3 py-2 shadow-sm focus-within:border-dream-blue/30 focus-within:ring-1 focus-within:ring-dream-blue/20 transition-all">
                        <input
                          type="number" placeholder="Gain"
                          className="w-full bg-transparent text-left font-bold text-xs outline-none text-dm-text"
                        />
                        <span className="text-dm-text text-xs font-bold ml-1">%</span>
                      </div>
                    </div>
                  </div>

                  {/* SL Section */}
                  <div>
                    <div className="flex justify-end mb-1">
                      <div className="flex items-center text-[10px] text-dm-text3 cursor-pointer hover:text-dm-text transition-colors font-bold">
                        Mark <ChevronDown size={12} className="ml-0.5" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-transparent border border-dm-border rounded-lg flex items-center px-3 py-2 shadow-sm focus-within:border-dream-blue/30 focus-within:ring-1 focus-within:ring-dream-blue/20 transition-all">
                        <input
                          type="number" value={slPrice} onChange={e => setSlPrice(e.target.value)} placeholder="Price SL"
                          className="w-full bg-transparent text-left font-bold text-xs outline-none text-dm-text"
                        />
                      </div>
                      <div className="flex-1 bg-transparent border border-dm-border rounded-lg flex items-center px-3 py-2 shadow-sm focus-within:border-dream-blue/30 focus-within:ring-1 focus-within:ring-dream-blue/20 transition-all">
                        <input
                          type="number" placeholder="Loss"
                          className="w-full bg-transparent text-left font-bold text-xs outline-none text-dm-text"
                        />
                        <span className="text-dm-text text-xs font-bold ml-1">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info Rows */}
          <div className="space-y-1.5 mb-4">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-dm-text3">Max Long</span>
              <span className="text-dm-text">{((balance * leverage) / pair.price).toFixed(4)} {baseAsset}</span>
            </div>
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-dm-text3">Margin</span>
              <span className="text-dm-text">{amountStr ? ((parseFloat(amountStr) * pair.price) / leverage).toFixed(2) : '0.00'} USDC</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTrade('Long')}
              className="w-full bg-dream-green text-white font-black py-3 rounded-xl text-sm uppercase tracking-wide"
            >
              {tradeMode === 'Open' ? 'Open Long' : 'Close Long'}
            </motion.button>
            <div className="flex justify-between text-[11px] font-bold mt-2 mb-1">
              <span className="text-dm-text3">Max Short</span>
              <span className="text-dm-text">{((balance * leverage) / pair.price).toFixed(4)} {baseAsset}</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTrade('Short')}
              className="w-full bg-dream-red text-white font-black py-3 rounded-xl text-sm uppercase tracking-wide"
            >
              {tradeMode === 'Open' ? 'Open Short' : 'Close Short'}
            </motion.button>
          </div>
        </div>

        {/* Right Column - Order Book */}
        <div className="w-[40%] p-2 flex flex-col overflow-hidden">
          <div className="flex justify-between text-[10px] font-bold text-dm-text3 mb-2 px-1">
            <span>Price</span>
            <span>Amount</span>
          </div>

          {/* Asks (Red) */}
          <div className="flex flex-col gap-0.5 flex-1 justify-end">
            {asks.map((a, i) => (
              <div key={`ask-${i}`} className="flex justify-between text-[11px] font-mono relative py-0.5 px-1">
                <div className="absolute right-0 top-0 bottom-0 bg-dream-red/8" style={{ width: `${a.depth}%` }} />
                <span className="text-dream-red relative z-10">{a.askPrice.toFixed(1)}</span>
                <span className="text-dm-text2 relative z-10">{a.amount}</span>
              </div>
            ))}
          </div>

          {/* Current Price */}
          <div className="py-2 my-1 border-y border-dm-border text-center">
            <div className={`text-lg font-black ${isPositive ? 'text-dream-green' : 'text-dream-red'}`}>
              {formatCurrency(pair.price)}
            </div>
            <div className="text-[10px] font-bold text-dm-text3">
              ≈{formatCurrency(pair.price)}
            </div>
          </div>

          {/* Bids (Green) */}
          <div className="flex flex-col gap-0.5 flex-1">
            {bids.map((b, i) => (
              <div key={`bid-${i}`} className="flex justify-between text-[11px] font-mono relative py-0.5 px-1">
                <div className="absolute right-0 top-0 bottom-0 bg-dream-green/10" style={{ width: `${b.depth}%` }} />
                <span className="text-dream-green relative z-10">{b.bidPrice.toFixed(1)}</span>
                <span className="text-dm-text2 relative z-10">{b.amount}</span>
              </div>
            ))}
          </div>

          {/* Long/Short Ratio */}
          <div className="mt-auto pt-2 shrink-0">
            <div className="flex justify-between text-[10px] font-bold mb-1">
              <span className="text-dream-green">L 52%</span>
              <span className="text-dream-red">48% S</span>
            </div>
            <div className="h-1.5 w-full bg-dm-surface-raised rounded-full overflow-hidden flex">
              <div className="h-full bg-dream-green" style={{ width: '52%' }} />
              <div className="h-full bg-dream-red" style={{ width: '48%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
