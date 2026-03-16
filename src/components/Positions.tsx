import React, { useState } from 'react';
import { Position } from '../types';
import { formatCurrency, formatPercent } from '../utils';
import { motion, AnimatePresence } from 'motion/react';

interface PositionsProps {
  positions: Position[];
  onClose: (id: string) => void;
  onCloseAll: () => void;
  layout?: 'list' | 'grid';
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

function PositionCard({ pos, onClose }: { key?: string; pos: Position; onClose: (id: string) => void }) {
  const isPositive = pos.pnl >= 0;
  const assetSymbol = pos.pair.split('-')[0];
  const [expanded, setExpanded] = useState<false | 'tpsl' | 'close'>(false);
  const [tp, setTp] = useState('');
  const [sl, setSl] = useState('');
  const [tpPrice, setTpPrice] = useState<number | null>(null);
  const [slPrice, setSlPrice] = useState<number | null>(null);
  const [closeType, setCloseType] = useState<'Market' | 'Limit'>('Market');
  const [limitPrice, setLimitPrice] = useState(pos.markPrice.toString());
  const [closePercent, setClosePercent] = useState(100);

  const margin = (pos.size * pos.entryPrice) / pos.leverage;
  const roi = pos.pnlPercent;

  const tpPnl = tp ? ((pos.type === 'Long' ? 1 : -1) * (parseFloat(tp) - pos.entryPrice) * pos.size) : null;
  const slPnl = sl ? ((pos.type === 'Long' ? 1 : -1) * (parseFloat(sl) - pos.entryPrice) * pos.size) : null;

  return (
    <motion.div
      variants={cardVariants}
      className="bg-dm-surface border border-dm-border rounded-xl dream-shadow relative overflow-hidden"
    >
      {/* Accent stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${pos.type === 'Long' ? 'bg-dream-green' : 'bg-dream-red'}`} />

      {/* Main content */}
      <div className="p-4 pl-5">
        {/* Header row */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-black text-[13px] sm:text-[14px] text-dm-text truncate max-w-[80px] sm:max-w-none">{pos.pair}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-dm-surface-raised text-dm-text2 shrink-0">{pos.leverage}x</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ${pos.type === 'Long' ? 'bg-dream-green/10 text-dream-green' : 'bg-dream-red/10 text-dream-red'
              }`}>{pos.type}</span>
          </div>
          <span className="text-[11px] font-bold text-dm-text3">{pos.size.toFixed(4)} {assetSymbol}</span>
        </div>

        {/* PnL row */}
        <div className="flex items-baseline justify-between mb-3">
          <span className={`text-xl sm:text-2xl font-black tracking-tight ${isPositive ? 'text-dream-green' : 'text-dream-red'} truncate pr-2`}>
            {isPositive ? '+' : ''}{formatCurrency(pos.pnl)}
          </span>
          <span className={`text-[12px] font-bold ${isPositive ? 'text-dream-green' : 'text-dream-red'} shrink-0`}>
            {formatPercent(roi)}
          </span>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-4">
          <div className="text-left">
            <p className="text-[8px] font-semibold text-dm-text3 uppercase tracking-wide">Entry</p>
            <p className="text-[11px] font-bold text-dm-text mt-0.5 whitespace-nowrap">{formatCurrency(pos.entryPrice)}</p>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-semibold text-dm-text3 uppercase tracking-wide">Mark</p>
            <p className="text-[11px] font-bold text-dm-text mt-0.5 whitespace-nowrap">{formatCurrency(pos.markPrice)}</p>
          </div>
          <div className="text-left">
            <p className="text-[8px] font-semibold text-dm-text3 uppercase tracking-wide">Liq.</p>
            <p className="text-[11px] font-bold text-orange-500 mt-0.5 whitespace-nowrap">{formatCurrency(pos.liqPrice)}</p>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-semibold text-dm-text3 uppercase tracking-wide">Margin</p>
            <p className="text-[11px] font-bold text-dm-text mt-0.5 whitespace-nowrap">{formatCurrency(margin)}</p>
          </div>
        </div>

        {/* TP/SL badges */}
        {(tpPrice !== null || slPrice !== null) && (
          <div className="flex gap-1.5 mb-3">
            {tpPrice !== null && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTpPrice(null)}
                className="group flex items-center gap-1 bg-dream-green/8 hover:bg-dream-green/15 text-dream-green border border-dream-green/20 rounded-lg px-2.5 py-1 text-[10px] font-bold transition-colors"
              >
                TP {formatCurrency(tpPrice)}
                <span className="text-[8px] opacity-50 group-hover:opacity-100 transition-opacity">✕</span>
              </motion.button>
            )}
            {slPrice !== null && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSlPrice(null)}
                className="group flex items-center gap-1 bg-dream-red/8 hover:bg-dream-red/15 text-dream-red border border-dream-red/20 rounded-lg px-2.5 py-1 text-[10px] font-bold transition-colors"
              >
                SL {formatCurrency(slPrice)}
                <span className="text-[8px] opacity-50 group-hover:opacity-100 transition-opacity">✕</span>
              </motion.button>
            )}
          </div>
        )}

        {/* Action buttons — opens panel */}
        {!expanded && (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setExpanded('tpsl')}
              className="flex-1 py-2.5 rounded-lg text-[12px] font-bold bg-transparent border border-dm-border text-dm-text2 hover:text-dm-text hover:border-dm-border2 transition-colors"
            >
              TP / SL
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setExpanded('close')}
              className="flex-1 py-2.5 rounded-lg text-[12px] font-bold bg-transparent border border-dm-border text-dm-text2 hover:text-dm-text hover:border-dm-border2 transition-colors"
            >
              Close
            </motion.button>
          </div>
        )}
      </div>

      {/* ── Expandable panel with internal toggle ── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1, transition: { height: { type: 'spring', stiffness: 300, damping: 25 }, opacity: { duration: 0.2, delay: 0.05 } } }}
            exit={{ height: 0, opacity: 0, transition: { height: { type: 'spring', stiffness: 300, damping: 25 }, opacity: { duration: 0.1 } } }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 pt-2 border-t border-dm-border space-y-3">
              {/* Panel toggle: TP/SL ↔ Close — layoutId for shared animation */}
              <div className="relative flex bg-transparent rounded-lg p-0.5 border border-dm-border">
                <motion.div
                  className="absolute inset-y-0.5 w-[calc(50%-2px)] bg-brand-accent rounded-md shadow-sm z-0"
                  animate={{ left: expanded === 'tpsl' ? '2px' : 'calc(50%)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
                <button
                  onClick={() => setExpanded('tpsl')}
                  className={`relative z-10 flex-1 py-2 rounded-lg text-[11px] font-bold transition-colors ${expanded === 'tpsl' ? 'text-white' : 'text-dm-text3 hover:text-dm-text2'
                    }`}
                >
                  TP / SL
                </button>
                <button
                  onClick={() => setExpanded('close')}
                  className={`relative z-10 flex-1 py-2 rounded-lg text-[11px] font-bold transition-colors ${expanded === 'close' ? 'text-white' : 'text-dm-text3 hover:text-dm-text2'
                    }`}
                >
                  Close
                </button>
              </div>

              {/* Panel content — AnimatePresence for smooth switch */}
              <AnimatePresence mode="wait" initial={false}>
                {expanded === 'tpsl' && (
                  <motion.div
                    key="tpsl-content"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } }}
                    exit={{ opacity: 0, x: -10, transition: { duration: 0.1 } }}
                    className="space-y-2.5"
                  >
                    {/* TP and SL side by side */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Take Profit */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-bold text-dream-green flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-dream-green" /> TP
                          </p>
                          {tpPnl !== null && (
                            <motion.span
                              key={tp}
                              initial={{ scale: 0.8, opacity: 0.5 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className={`text-[9px] font-bold ${tpPnl >= 0 ? 'text-dream-green' : 'text-dream-red'}`}
                            >
                              {tpPnl >= 0 ? '+' : ''}{tpPnl.toFixed(2)}
                            </motion.span>
                          )}
                        </div>
                        <input
                          type="number"
                          placeholder={`${(pos.entryPrice * (pos.type === 'Long' ? 1.05 : 0.95)).toFixed(1)}`}
                          value={tp}
                          onChange={(e) => setTp(e.target.value)}
                          className="w-full bg-transparent border border-dm-border rounded-lg px-2.5 py-2 text-[12px] font-bold text-dm-text outline-none focus:border-dream-green/50 placeholder:text-dm-text3 transition-all"
                        />
                      </div>

                      {/* Stop Loss */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-bold text-dream-red flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-dream-red" /> SL
                          </p>
                          {slPnl !== null && (
                            <motion.span
                              key={sl}
                              initial={{ scale: 0.8, opacity: 0.5 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className={`text-[9px] font-bold ${slPnl >= 0 ? 'text-dream-green' : 'text-dream-red'}`}
                            >
                              {slPnl >= 0 ? '+' : ''}{slPnl.toFixed(2)}
                            </motion.span>
                          )}
                        </div>
                        <input
                          type="number"
                          placeholder={`${(pos.entryPrice * (pos.type === 'Long' ? 0.95 : 1.05)).toFixed(1)}`}
                          value={sl}
                          onChange={(e) => setSl(e.target.value)}
                          className="w-full bg-transparent border border-dm-border rounded-lg px-2.5 py-2 text-[12px] font-bold text-dm-text outline-none focus:border-dream-red/50 placeholder:text-dm-text3 transition-all"
                        />
                      </div>
                    </div>

                    {/* Set buttons — appear individually when value entered */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {tp && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => { setTpPrice(parseFloat(tp)); setTp(''); }}
                          className="py-2 bg-dream-green hover:bg-dream-green/90 text-white text-[11px] font-bold rounded-lg transition-colors"
                        >
                          Set TP
                        </motion.button>
                      )}
                      {sl && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => { setSlPrice(parseFloat(sl)); setSl(''); }}
                          className={`py-2 bg-dream-red hover:bg-dream-red/90 text-white text-[11px] font-bold rounded-lg transition-colors ${tp ? '' : 'col-start-2'}`}
                        >
                          Set SL
                        </motion.button>
                      )}
                    </div>

                    {/* Collapse */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setExpanded(false)}
                      className="w-full py-1.5 text-[11px] font-bold text-dm-text3 hover:text-dm-text transition-colors"
                    >
                      ▲ Collapse
                    </motion.button>
                  </motion.div>
                )}

                {expanded === 'close' && (
                  <motion.div
                    key="close-content"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } }}
                    exit={{ opacity: 0, x: 10, transition: { duration: 0.1 } }}
                    className="space-y-3"
                  >
                    {/* Market/Limit toggle */}
                    <div className="relative flex bg-transparent rounded-lg p-0.5 border border-dm-border">
                      <motion.div
                        className="absolute inset-y-0.5 w-[calc(50%-2px)] bg-brand-accent rounded-md shadow-sm z-0"
                        animate={{ left: closeType === 'Market' ? '2px' : 'calc(50%)' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      />
                      {(['Market', 'Limit'] as const).map(t => (
                        <button
                          key={t}
                          onClick={() => setCloseType(t)}
                          className={`relative z-10 flex-1 py-2 rounded-lg text-[11px] font-bold transition-colors ${closeType === t ? 'text-white' : 'text-dm-text3 hover:text-dm-text2'
                            }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    {/* Limit price input */}
                    <AnimatePresence initial={false}>
                      {closeType === 'Limit' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, scale: 0.95 }}
                          animate={{ opacity: 1, height: 'auto', scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } }}
                          exit={{ opacity: 0, height: 0, scale: 0.95, transition: { duration: 0.15 } }}
                          className="overflow-hidden"
                        >
                          <div>
                            <p className="text-[10px] font-bold text-dm-text3 mb-1">Limit Price</p>
                            <input
                              type="number"
                              value={limitPrice}
                              onChange={(e) => setLimitPrice(e.target.value)}
                              placeholder={pos.markPrice.toString()}
                              className="w-full bg-transparent border border-dm-border rounded-lg px-3 py-2.5 text-[12px] font-bold text-dm-text outline-none focus:border-dream-blue/50 placeholder:text-dm-text3 transition-all"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Amount */}
                    <div>
                      <div className="flex justify-between text-[11px] font-bold mb-1.5">
                        <span className="text-dm-text3">Amount</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={(pos.size * closePercent / 100).toFixed(4)}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setClosePercent(Math.min(100, Math.max(1, Math.round((val / pos.size) * 100))));
                            }}
                            className="w-20 bg-transparent text-right text-[11px] font-bold text-dm-text outline-none"
                          />
                          <span className="text-dm-text3">{assetSymbol}</span>
                        </div>
                      </div>
                      <input
                        type="range" min="1" max="100" value={closePercent}
                        onChange={(e) => setClosePercent(parseInt(e.target.value))}
                        className="w-full dream-slider text-dream-blue mb-1.5"
                        style={{ background: `linear-gradient(to right, color-mix(in srgb, currentColor 10%, transparent) 0%, currentColor ${closePercent}%, var(--dm-surface-strong) ${closePercent}%)` }}
                      />
                      <div className="flex gap-1.5">
                        {[25, 50, 75, 100].map(v => (
                          <motion.button
                            key={v}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setClosePercent(v)}
                            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${closePercent === v
                              ? 'bg-dream-blue text-white'
                              : 'bg-transparent border border-dm-border text-dm-text3 hover:text-dm-text hover:border-dm-border2'
                              }`}
                          >
                            {v}%
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Percent badge */}
                    <div className="flex justify-center">
                      <motion.span
                        key={closePercent}
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-[11px] font-bold text-dm-text2"
                      >
                        {closePercent}% — {(pos.size * closePercent / 100).toFixed(4)} {assetSymbol}
                      </motion.span>
                    </div>

                    {/* Close button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onClose(pos.id)}
                      className={`w-full font-bold py-3 rounded-lg text-[13px] uppercase tracking-wide text-white ${pos.type === 'Long' ? 'bg-dream-red hover:bg-dream-red/90' : 'bg-dream-green hover:bg-dream-green/90'
                        } transition-colors`}
                    >
                      Close {pos.type} — {closeType}{closePercent < 100 ? ` (${closePercent}%)` : ''}
                    </motion.button>

                    {/* Collapse */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setExpanded(false)}
                      className="w-full py-1.5 text-[11px] font-bold text-dm-text3 hover:text-dm-text transition-colors"
                    >
                      ▲ Collapse
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

export function Positions({ positions, onClose, onCloseAll, layout = 'list' }: PositionsProps) {
  return (
    <section className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-xl text-dm-text">Positions</h2>
          {positions.length > 0 && (
            <motion.span
              key={positions.length}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-xs font-bold bg-dream-blue/10 text-dream-blue px-2 py-0.5 rounded-full"
            >
              {positions.length}
            </motion.span>
          )}
        </div>
        {positions.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCloseAll}
            className="bg-transparent border border-dm-border hover:border-dm-border2 px-4 py-2 rounded-lg text-[12px] font-bold text-dm-text2 transition-colors"
          >
            Close All
          </motion.button>
        )}
      </div>

      {layout === 'grid' ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col md:flex-row items-start gap-4"
        >
          <div className="flex-1 flex flex-col gap-4 w-full">
            {positions.filter((_, i) => i % 2 === 0).map((pos) => (
              <PositionCard key={pos.id} pos={pos} onClose={onClose} />
            ))}
          </div>
          <div className="flex-1 flex flex-col gap-4 w-full">
            {positions.filter((_, i) => i % 2 === 1).map((pos) => (
              <PositionCard key={pos.id} pos={pos} onClose={onClose} />
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-3"
        >
          {positions.map((pos) => (
            <PositionCard key={pos.id} pos={pos} onClose={onClose} />
          ))}
        </motion.div>
      )}

      {positions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.2 } }}
          className="py-16 text-center text-dm-text3 font-medium text-sm"
        >
          No active positions
        </motion.div>
      )}
    </section>
  );
}
