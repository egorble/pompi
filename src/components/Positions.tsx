import React, { useState } from 'react';
import { Position } from '../types';
import { formatCurrency, formatPercent } from '../utils';
import { motion, AnimatePresence } from 'motion/react';

interface PositionsProps {
  positions: Position[];
  onClose: (id: string) => void;
  onCloseAll: () => void;
}

function PositionCard({ pos, onClose }: { pos: Position; onClose: (id: string) => void }) {
  const isPositive = pos.pnl >= 0;
  const assetSymbol = pos.pair.split('-')[0];
  const [expanded, setExpanded] = useState<false | 'tpsl' | 'close'>(false);
  const [tp, setTp] = useState('');
  const [sl, setSl] = useState('');
  const [tpActive, setTpActive] = useState(false);
  const [slActive, setSlActive] = useState(false);
  const [closeType, setCloseType] = useState<'Market' | 'Limit'>('Market');
  const [limitPrice, setLimitPrice] = useState(pos.markPrice.toString());
  const [closePercent, setClosePercent] = useState(100);

  const margin = (pos.size * pos.entryPrice) / pos.leverage;
  const roi = pos.pnlPercent;

  const tpPnl = tp ? ((pos.type === 'Long' ? 1 : -1) * (parseFloat(tp) - pos.entryPrice) * pos.size) : null;
  const slPnl = sl ? ((pos.type === 'Long' ? 1 : -1) * (parseFloat(sl) - pos.entryPrice) * pos.size) : null;

  return (
    <motion.div
      initial={false}
      className="bg-dm-surface border border-dm-border rounded-2xl dream-shadow relative overflow-hidden"
    >
      {/* Accent stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${pos.type === 'Long' ? 'bg-dream-green' : 'bg-dream-red'}`} />

      {/* Main content */}
      <div className="p-4 pl-5">
        {/* Header row */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-black text-[15px] text-dm-text">{pos.pair}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-dm-surface-raised text-dm-text2">{pos.leverage}x</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
              pos.type === 'Long' ? 'bg-dream-green/10 text-dream-green' : 'bg-dream-red/10 text-dream-red'
            }`}>{pos.type}</span>
          </div>
          <span className="text-[11px] font-bold text-dm-text3">{pos.size.toFixed(4)} {assetSymbol}</span>
        </div>

        {/* PnL row */}
        <div className="flex items-baseline justify-between mb-3">
          <span className={`text-2xl font-black tracking-tight ${isPositive ? 'text-dream-green' : 'text-dream-red'}`}>
            {isPositive ? '+' : ''}{formatCurrency(pos.pnl)}
          </span>
          <span className={`text-[13px] font-bold ${isPositive ? 'text-dream-green' : 'text-dream-red'}`}>
            {formatPercent(roi)}
          </span>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-4 gap-x-3 gap-y-2 mb-3">
          <div>
            <p className="text-[9px] font-semibold text-dm-text3 uppercase tracking-wide">Entry</p>
            <p className="text-[12px] font-bold text-dm-text mt-0.5">{formatCurrency(pos.entryPrice)}</p>
          </div>
          <div>
            <p className="text-[9px] font-semibold text-dm-text3 uppercase tracking-wide">Mark</p>
            <p className="text-[12px] font-bold text-dm-text mt-0.5">{formatCurrency(pos.markPrice)}</p>
          </div>
          <div>
            <p className="text-[9px] font-semibold text-dm-text3 uppercase tracking-wide">Liq.</p>
            <p className="text-[12px] font-bold text-orange-500 mt-0.5">{formatCurrency(pos.liqPrice)}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-semibold text-dm-text3 uppercase tracking-wide">Margin</p>
            <p className="text-[12px] font-bold text-dm-text mt-0.5">{formatCurrency(margin)}</p>
          </div>
        </div>

        {/* TP/SL badges */}
        {(tpActive || slActive) && (
          <div className="flex gap-1.5 mb-3">
            {tpActive && (
              <button
                onClick={() => { setTpActive(false); setTp(''); }}
                className="group flex items-center gap-1 bg-dream-green/8 hover:bg-dream-green/15 text-dream-green border border-dream-green/20 rounded-lg px-2.5 py-1 text-[10px] font-bold transition-colors"
              >
                TP {formatCurrency(parseFloat(tp))}
                <span className="text-[8px] opacity-50 group-hover:opacity-100 transition-opacity">✕</span>
              </button>
            )}
            {slActive && (
              <button
                onClick={() => { setSlActive(false); setSl(''); }}
                className="group flex items-center gap-1 bg-dream-red/8 hover:bg-dream-red/15 text-dream-red border border-dream-red/20 rounded-lg px-2.5 py-1 text-[10px] font-bold transition-colors"
              >
                SL {formatCurrency(parseFloat(sl))}
                <span className="text-[8px] opacity-50 group-hover:opacity-100 transition-opacity">✕</span>
              </button>
            )}
          </div>
        )}

        {/* Action button — opens panel, toggles between TP/SL and Close inside */}
        {!expanded && (
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setExpanded('tpsl')}
              className="flex-1 py-2.5 rounded-xl text-[12px] font-bold bg-dm-surface-alt border border-dm-border text-dm-text2 hover:text-dm-text hover:border-dm-border2 transition-all"
            >
              TP / SL
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setExpanded('close')}
              className="flex-1 py-2.5 rounded-xl text-[12px] font-bold bg-dm-surface-alt border border-dm-border text-dm-text2 hover:text-dm-text hover:border-dm-border2 transition-all"
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
            animate={{ height: 'auto', opacity: 1, transition: { height: { type: "spring", stiffness: 500, damping: 35 }, opacity: { duration: 0.2, delay: 0.05 } } }}
            exit={{ height: 0, opacity: 0, transition: { height: { duration: 0.15 }, opacity: { duration: 0.08 } } }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 pt-2 border-t border-dm-border space-y-3">
              {/* Panel toggle: TP/SL ↔ Close */}
              <div className="relative flex bg-dm-surface-alt rounded-xl p-0.5 border border-dm-border">
                <motion.div
                  className="absolute inset-y-0.5 w-[calc(50%-2px)] bg-dm-surface rounded-lg shadow-sm z-0"
                  animate={{ left: expanded === 'tpsl' ? '2px' : 'calc(50%)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
                <button
                  onClick={() => setExpanded('tpsl')}
                  className={`relative z-10 flex-1 py-2 rounded-lg text-[11px] font-bold transition-colors ${
                    expanded === 'tpsl' ? 'text-dm-text' : 'text-dm-text3 hover:text-dm-text2'
                  }`}
                >
                  TP / SL
                </button>
                <button
                  onClick={() => setExpanded('close')}
                  className={`relative z-10 flex-1 py-2 rounded-lg text-[11px] font-bold transition-colors ${
                    expanded === 'close' ? 'text-dm-text' : 'text-dm-text3 hover:text-dm-text2'
                  }`}
                >
                  Close
                </button>
              </div>

              {/* TP/SL content */}
              {expanded === 'tpsl' && (
                <div className="space-y-3">
                  {/* Take Profit row */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-[11px] font-bold text-dream-green flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-dream-green" /> Take Profit
                      </p>
                      {tpPnl !== null && (
                        <span className={`text-[11px] font-bold ${tpPnl >= 0 ? 'text-dream-green' : 'text-dream-red'}`}>
                          PnL: {tpPnl >= 0 ? '+' : ''}{tpPnl.toFixed(2)} USDC
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder={`Price, e.g. ${(pos.entryPrice * (pos.type === 'Long' ? 1.05 : 0.95)).toFixed(1)}`}
                        value={tp}
                        onChange={(e) => { setTp(e.target.value); setTpActive(false); }}
                        className="flex-1 bg-dm-surface-alt border border-dm-border rounded-xl px-3 py-2.5 text-[12px] font-bold text-dm-text outline-none focus:border-dream-green/50 focus:ring-1 focus:ring-dream-green/20 placeholder:text-dm-text3 transition-all"
                      />
                      <motion.button
                        whileTap={{ scale: 0.93 }}
                        onClick={() => { if (tp) setTpActive(true); }}
                        disabled={!tp || tpActive}
                        className="px-5 py-2.5 bg-dream-green hover:bg-dream-green/90 text-white text-[11px] font-bold rounded-xl disabled:opacity-30 disabled:hover:bg-dream-green transition-all shrink-0"
                      >
                        {tpActive ? 'Active' : 'Set'}
                      </motion.button>
                    </div>
                  </div>

                  {/* Stop Loss row */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-[11px] font-bold text-dream-red flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-dream-red" /> Stop Loss
                      </p>
                      {slPnl !== null && (
                        <span className={`text-[11px] font-bold ${slPnl >= 0 ? 'text-dream-green' : 'text-dream-red'}`}>
                          PnL: {slPnl >= 0 ? '+' : ''}{slPnl.toFixed(2)} USDC
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder={`Price, e.g. ${(pos.entryPrice * (pos.type === 'Long' ? 0.95 : 1.05)).toFixed(1)}`}
                        value={sl}
                        onChange={(e) => { setSl(e.target.value); setSlActive(false); }}
                        className="flex-1 bg-dm-surface-alt border border-dm-border rounded-xl px-3 py-2.5 text-[12px] font-bold text-dm-text outline-none focus:border-dream-red/50 focus:ring-1 focus:ring-dream-red/20 placeholder:text-dm-text3 transition-all"
                      />
                      <motion.button
                        whileTap={{ scale: 0.93 }}
                        onClick={() => { if (sl) setSlActive(true); }}
                        disabled={!sl || slActive}
                        className="px-5 py-2.5 bg-dream-red hover:bg-dream-red/90 text-white text-[11px] font-bold rounded-xl disabled:opacity-30 disabled:hover:bg-dream-red transition-all shrink-0"
                      >
                        {slActive ? 'Active' : 'Set'}
                      </motion.button>
                    </div>
                  </div>

                  {/* Collapse button */}
                  <button
                    onClick={() => setExpanded(false)}
                    className="w-full py-2 text-[11px] font-bold text-dm-text3 hover:text-dm-text transition-colors"
                  >
                    ▲ Collapse
                  </button>
                </div>
              )}

              {/* Close content */}
              {expanded === 'close' && (
                <div className="space-y-3">
                  {/* Market/Limit toggle */}
                  <div className="relative flex bg-dm-surface-alt rounded-xl p-0.5 border border-dm-border">
                    <motion.div
                      className="absolute inset-y-0.5 w-[calc(50%-2px)] bg-dm-surface rounded-lg shadow-sm z-0"
                      animate={{ left: closeType === 'Market' ? '2px' : 'calc(50%)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                    {(['Market', 'Limit'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setCloseType(t)}
                        className={`relative z-10 flex-1 py-2 rounded-lg text-[11px] font-bold transition-colors ${
                          closeType === t ? 'text-dm-text' : 'text-dm-text3 hover:text-dm-text2'
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
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1, transition: { height: { type: 'spring', stiffness: 500, damping: 35 }, opacity: { duration: 0.15, delay: 0.05 } } }}
                        exit={{ height: 0, opacity: 0, transition: { height: { duration: 0.12 }, opacity: { duration: 0.08 } } }}
                        className="overflow-hidden"
                      >
                        <div>
                          <p className="text-[10px] font-bold text-dm-text3 mb-1">Limit Price</p>
                          <input
                            type="number"
                            value={limitPrice}
                            onChange={(e) => setLimitPrice(e.target.value)}
                            placeholder={pos.markPrice.toString()}
                            className="w-full bg-dm-surface-alt border border-dm-border rounded-xl px-3 py-2.5 text-[12px] font-bold text-dm-text outline-none focus:border-dream-blue/50 placeholder:text-dm-text3 transition-all"
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
                      className="w-full h-1.5 bg-dm-surface-strong rounded-lg appearance-none cursor-pointer accent-dream-blue mb-1.5"
                    />
                    <div className="flex gap-1.5">
                      {[25, 50, 75, 100].map(v => (
                        <button
                          key={v}
                          onClick={() => setClosePercent(v)}
                          className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                            closePercent === v
                              ? 'bg-dream-blue text-white'
                              : 'bg-dm-surface-alt border border-dm-border text-dm-text3 hover:text-dm-text hover:border-dm-border2'
                          }`}
                        >
                          {v}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Close button */}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onClose(pos.id)}
                    className={`w-full font-bold py-3 rounded-xl text-[13px] uppercase tracking-wide text-white ${
                      pos.type === 'Long' ? 'bg-dream-red hover:bg-dream-red/90' : 'bg-dream-green hover:bg-dream-green/90'
                    } transition-colors`}
                  >
                    Close {pos.type} — {closeType}{closePercent < 100 ? ` (${closePercent}%)` : ''}
                  </motion.button>

                  {/* Collapse button */}
                  <button
                    onClick={() => setExpanded(false)}
                    className="w-full py-2 text-[11px] font-bold text-dm-text3 hover:text-dm-text transition-colors"
                  >
                    ▲ Collapse
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Positions({ positions, onClose, onCloseAll }: PositionsProps) {
  return (
    <section className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-xl text-dm-text">Positions</h2>
          {positions.length > 0 && (
            <span className="text-xs font-bold bg-dream-blue/10 text-dream-blue px-2 py-0.5 rounded-full">{positions.length}</span>
          )}
        </div>
        {positions.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCloseAll}
            className="bg-dm-surface-raised hover:bg-dm-surface-strong px-4 py-2 rounded-xl text-[12px] font-bold text-dm-text2 transition-colors"
          >
            Close All
          </motion.button>
        )}
      </div>

      {/* Two independent columns so expanding one card doesn't affect the other column */}
      <div className="hidden md:flex gap-3">
        <div className="flex-1 flex flex-col gap-3">
          {positions.filter((_, i) => i % 2 === 0).map((pos) => (
            <PositionCard key={pos.id} pos={pos} onClose={onClose} />
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-3">
          {positions.filter((_, i) => i % 2 === 1).map((pos) => (
            <PositionCard key={pos.id} pos={pos} onClose={onClose} />
          ))}
        </div>
      </div>
      {/* Single column on mobile */}
      <div className="flex flex-col gap-3 md:hidden">
        {positions.map((pos) => (
          <PositionCard key={pos.id} pos={pos} onClose={onClose} />
        ))}
      </div>

      {positions.length === 0 && (
        <div className="py-16 text-center text-dm-text3 font-medium text-sm">
          No active positions
        </div>
      )}
    </section>
  );
}
