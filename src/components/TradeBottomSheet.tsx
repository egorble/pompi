import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Settings, ChevronDown, Delete } from 'lucide-react';
import { Pair } from '../types';
import { formatCurrency } from '../utils';

interface TradeBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  pair: Pair;
  side: 'Long' | 'Short';
  onPlaceTrade: (trade: { type: 'Long' | 'Short', leverage: number, sizeUsd: number, price?: number }) => void;
  balance: number;
}

export function TradeBottomSheet({ isOpen, onClose, pair, side, onPlaceTrade, balance }: TradeBottomSheetProps) {
  const [amountStr, setAmountStr] = useState('0');
  const [isSuccess, setIsSuccess] = useState(false);
  const [leverage, setLeverage] = useState(25);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setAmountStr('0');
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handleKeyPress = (key: string) => {
    if (amountStr === '0' && key !== '.') {
      setAmountStr(key);
    } else {
      // Prevent multiple decimals
      if (key === '.' && amountStr.includes('.')) return;
      // Limit length
      if (amountStr.length > 8) return;
      setAmountStr(prev => prev + key);
    }
  };

  const handleDelete = () => {
    if (amountStr.length === 1) {
      setAmountStr('0');
    } else {
      setAmountStr(prev => prev.slice(0, -1));
    }
  };

  const amount = parseFloat(amountStr) || 0;
  const shares = amount / pair.price;

  const handleTrade = () => {
    if (amount <= 0) return;
    
    // Show success screen briefly before closing
    setIsSuccess(true);
    
    setTimeout(() => {
      onPlaceTrade({ type: side, leverage, sizeUsd: amount });
      onClose();
    }, 1500);
  };

  const handlePercentage = (percent: number) => {
    const val = (balance * percent) / 100;
    setAmountStr(val.toFixed(2).replace(/\.00$/, ''));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white text-slate-900 rounded-t-[32px] z-[101] flex flex-col h-[90vh] lg:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
          >
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex-1 flex flex-col items-center justify-center p-8 text-white rounded-t-[32px] ${side === 'Long' ? 'bg-dream-green text-slate-900' : 'bg-dream-red text-white'}`}
              >
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold">You now own</h2>
                  <div className="text-6xl font-black tracking-tighter">
                    {shares.toFixed(5)}
                  </div>
                  <p className="text-lg font-medium opacity-80">Shares of {pair.pair}</p>
                  
                  <div className="w-full h-px bg-current opacity-10 my-8" />
                  
                  <div className="flex justify-between w-full text-sm font-bold opacity-80">
                    <span>Amount invested</span>
                    <span>{formatCurrency(amount)}</span>
                  </div>
                  <div className="flex justify-between w-full text-sm font-bold opacity-80">
                    <span>Avg price per share</span>
                    <span>{formatCurrency(pair.price)}</span>
                  </div>
                </div>
                
                <button 
                  onClick={onClose}
                  className="mt-12 bg-slate-900 text-white w-full py-4 rounded-2xl font-black uppercase tracking-widest"
                >
                  Done
                </button>
              </motion.div>
            ) : (
              <>
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-100">
                  <button onClick={onClose} className="p-2 text-slate-600 hover:bg-slate-50 rounded-full">
                    <ArrowLeft size={24} />
                  </button>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-400">
                      {pair.pair.charAt(0)}
                    </div>
                    <span className="font-extrabold text-slate-900">{pair.pair.split('/')[0]}</span>
                    <span className="text-slate-400 font-medium">{formatCurrency(pair.price)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-slate-900 font-bold">
                      Market <ChevronDown size={16} />
                    </div>
                    <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-full">
                      <Settings size={20} />
                    </button>
                  </div>
                </div>

                {/* Banner */}
                <div className="bg-dream-blue text-white text-center py-2 text-sm font-bold">
                  USDC required for this market
                </div>

                {/* Amount Display */}
                <div className="flex-1 flex flex-col items-center justify-center px-6 pt-6">
                  <div className="flex items-start justify-center gap-2">
                    <span className="text-4xl font-medium text-slate-900 mt-2">$</span>
                    <span className={`text-8xl font-black tracking-tighter ${amountStr === '0' ? 'text-slate-900' : 'text-slate-900'}`}>
                      {amountStr}
                    </span>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <div className="text-slate-400 font-bold text-sm">Cash available</div>
                    <div className="text-slate-900 font-black text-lg">{formatCurrency(balance)}</div>
                  </div>
                  
                  {/* Percentage Buttons */}
                  <div className="flex gap-2 mt-6 w-full max-w-xs mx-auto">
                    {[10, 25, 50, 100].map((percent) => (
                      <button
                        key={percent}
                        onClick={() => handlePercentage(percent)}
                        className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 rounded-full text-sm font-bold text-slate-900 transition-colors"
                      >
                        {percent === 100 ? 'Max' : `${percent}%`}
                      </button>
                    ))}
                  </div>

                  {/* Leverage Slider */}
                  <div className="w-full max-w-xs mx-auto mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-slate-400">Leverage</span>
                      <span className="text-sm font-extrabold text-dream-blue">{leverage}x</span>
                    </div>
                    <input 
                      type="range" 
                      min="1"
                      max="100"
                      value={leverage}
                      onChange={(e) => setLeverage(parseInt(e.target.value))}
                      className="w-full accent-dream-blue h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer" 
                    />
                  </div>
                </div>

                {/* Keypad */}
                <div className="p-6 pb-8 bg-white">
                  <div className="grid grid-cols-3 gap-y-4 gap-x-4 mb-6 max-w-xs mx-auto">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0].map((key) => (
                      <button
                        key={key}
                        onClick={() => handleKeyPress(key.toString())}
                        className="text-3xl font-medium text-slate-900 hover:bg-slate-50 rounded-2xl transition-colors py-3"
                      >
                        {key}
                      </button>
                    ))}
                    <button
                      onClick={handleDelete}
                      className="flex items-center justify-center text-slate-900 hover:bg-slate-50 rounded-2xl transition-colors py-3"
                    >
                      <ArrowLeft size={28} />
                    </button>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={handleTrade}
                    disabled={amount <= 0}
                    className={`w-full py-4 rounded-2xl font-black text-lg uppercase tracking-widest transition-all ${
                      amount > 0 
                        ? (side === 'Long' ? 'bg-dream-green text-white shadow-lg shadow-dream-green/20' : 'bg-dream-red text-white shadow-lg')
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {side} {pair.pair.split('/')[0]}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
