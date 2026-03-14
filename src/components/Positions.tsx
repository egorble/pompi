import React from 'react';
import { Position } from '../types';
import { formatCurrency, formatPercent } from '../utils';
import { motion, AnimatePresence } from 'motion/react';

interface PositionsProps {
  positions: Position[];
  onClose: (id: string) => void;
  onCloseAll: () => void;
}

export function Positions({ positions, onClose, onCloseAll }: PositionsProps) {
  return (
    <section className="bg-white p-4 rounded-dream dream-shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-xl">Active Positions</h2>
        <div className="flex gap-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCloseAll}
            disabled={positions.length === 0}
            className="bg-slate-100 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Close All
          </motion.button>
        </div>
      </div>

      <div className="w-full overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-2 text-[10px] uppercase font-bold text-slate-400">Market</th>
              <th className="pb-2 text-[10px] uppercase font-bold text-slate-400">Size</th>
              <th className="pb-2 text-[10px] uppercase font-bold text-slate-400">Entry Price</th>
              <th className="pb-2 text-[10px] uppercase font-bold text-slate-400">Mark Price</th>
              <th className="pb-2 text-[10px] uppercase font-bold text-slate-400">Liq. Price</th>
              <th className="pb-2 text-[10px] uppercase font-bold text-slate-400 text-right">Unrealized PnL</th>
              <th className="pb-2 text-[10px] uppercase font-bold text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <motion.tbody 
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            <AnimatePresence>
              {positions.map((pos) => {
                const isPositive = pos.pnl >= 0;
                const assetSymbol = pos.pair.split('-')[0];
                
                return (
                  <motion.tr 
                    key={pos.id} 
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                    exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                    layout
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{pos.pair}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          pos.type === 'Long' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {pos.type} {pos.leverage}x
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 font-medium text-sm">{pos.size.toFixed(4)} {assetSymbol}</td>
                    <td className="py-2.5 font-medium text-sm">{formatCurrency(pos.entryPrice)}</td>
                    <td className="py-2.5 font-medium text-sm">{formatCurrency(pos.markPrice)}</td>
                    <td className="py-2.5 font-medium text-sm text-orange-500">{formatCurrency(pos.liqPrice)}</td>
                    <td className="py-2.5 text-right">
                      <div className={`font-bold text-sm ${isPositive ? 'text-emerald-500' : 'text-dream-red'}`}>
                        {formatCurrency(pos.pnl)}
                      </div>
                      <div className={`text-[10px] font-bold ${isPositive ? 'text-emerald-500' : 'text-dream-red'}`}>
                        {formatPercent(pos.pnlPercent)}
                      </div>
                    </td>
                    <td className="py-2.5 text-right">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onClose(pos.id)}
                        className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-transform"
                      >
                        Close
                      </motion.button>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </motion.tbody>
        </table>
        
        <AnimatePresence>
          {positions.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="py-8 text-center text-slate-400 font-medium text-sm"
            >
              No active positions
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
