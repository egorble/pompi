import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store';
import { formatCurrency, formatPercent } from '../utils';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { LineChart, ArrowUpRight, ArrowDownRight, Activity, Calendar, Users, TrendingUp, ChevronLeft, ChevronRight, MoreHorizontal, Plus } from 'lucide-react';
import { Position } from '../types';
import { initialPairs } from '../data';

const LiquidationRiskGauge = ({ risk }: { risk: number }) => {
  const totalBars = 20;
  // Risk goes from 0 to 100
  const activeBars = Math.floor((risk / 100) * totalBars);
  
  return (
    <div className="relative flex flex-col items-center justify-end w-full mt-6" style={{ height: '110px' }}>
      <svg viewBox="0 0 200 100" className="w-[85%] overflow-visible">
        {Array.from({ length: totalBars }).map((_, i) => {
          const angle = -90 + (180 / (totalBars - 1)) * i;
          const isActive = i <= activeBars;
          return (
            <line 
              key={i}
              x1="100" y1="100" x2="100" y2="40"
              stroke={isActive ? '#3366FF' : 'var(--dm-surface-alt)'}
              strokeWidth="6"
              strokeLinecap="round"
              transform={`rotate(${angle} 100 100) translate(0, -25)`}
              className="transition-all duration-500"
            />
          );
        })}
        {/* Needle */}
        <g style={{ transform: `rotate(${risk * 1.8 - 90}deg)`, transformOrigin: '100px 100px', transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)' }}>
           <circle cx="100" cy="100" r="8" fill="var(--dm-text)" />
           <path d="M 96 100 L 104 100 L 100 25 Z" fill="var(--dm-text)" />
        </g>
      </svg>
    </div>
  );
};

export function Dashboard({ positions, onNavigate }: { positions: Position[], onNavigate: (tab: string) => void }) {
  const { tickers } = useStore();
  const accountEquity = 1001.33;
  const pnlPercent = -18.95; // using the actual mock data
  const liquidationRisk = 11.51; // using the actual mock data
  const marginUsage = 17.28; // actual mock data
  const activeOrders = 260; // mock total

  const equityData = [
    { time: '03-07', value: 950 },
    { time: '10-14', value: 920 },
    { time: '17-21', value: 980 },
    { time: '24-28', value: 1050 },
    { time: '03-07', value: 1020 },
    { time: '10-14', value: 1080 },
    { time: '17-21', value: 1001.33 },
  ];



  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="flex flex-col h-full w-full p-2">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0 px-2 mt-4">
        <div>
          <h1 className="text-3xl font-bold text-dm-text">Overview ☀️</h1>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 overflow-y-auto no-scrollbar pb-6 px-2"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6">
          
          {/* Card 1: Total Equity (Visual circles) */}
          <motion.div variants={cardVariants} className="bg-dm-surface border border-dm-border rounded-[24px] p-6 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="bg-[#3366FF]/20 p-1.5 rounded-full">
                  <TrendingUp size={16} className="text-[#3366FF]" />
                </div>
                <h3 className="text-sm font-semibold text-dm-text">Total Equity</h3>
              </div>
            </div>
            
            <div className="flex items-end gap-2 my-2">
              <span className="text-4xl font-bold text-dm-text">{formatCurrency(accountEquity, 0)}</span>
              <span className={`text-sm font-semibold px-2 py-0.5 rounded-full mb-1 ${pnlPercent >= 0 ? 'text-dream-green bg-dream-green/10' : 'text-dream-red bg-dream-red/10'}`}>
                {pnlPercent > 0 ? '+' : ''}{pnlPercent}%
              </span>
            </div>
            
            <div className="flex items-center gap-3 mt-2 text-xs text-dm-text3">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#3366FF]"></div>Cash</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#3366FF]/40"></div>Margin</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-dm-surface-strong"></div>Unrealized</div>
            </div>

            <div className="flex items-center justify-center mt-6">
              <div className="w-20 h-20 rounded-full bg-[#3366FF] flex items-center justify-center text-white font-bold relative z-10 shadow-lg shadow-[#3366FF]/20">
                55%
              </div>
              <div className="w-28 h-28 rounded-full bg-[#3366FF]/30 flex items-center justify-center text-white font-bold relative z-0 -ml-8 shadow-lg backdrop-blur-md border border-[#3366FF]/30">
                35%
              </div>
              <div className="w-16 h-16 rounded-full bg-dm-surface-strong border border-dm-border flex items-center justify-center text-dm-text2 font-bold relative z-10 -ml-4 shadow-lg">
                10%
              </div>
            </div>
          </motion.div>

          {/* Card 2: Liquidation Risk (Gauge) */}
          <motion.div variants={cardVariants} className="bg-dm-surface border border-dm-border rounded-[24px] p-6 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="bg-[#3366FF]/20 p-1.5 rounded-full">
                  <Activity size={16} className="text-[#3366FF]" />
                </div>
                <h3 className="text-sm font-semibold text-dm-text">Liq. Risk Rate</h3>
              </div>
            </div>
            
            <div className="flex items-end gap-2 my-2">
              <span className="text-4xl font-bold text-dm-text">{liquidationRisk.toFixed(2)}%</span>
              <span className="text-sm font-semibold text-dream-red bg-dream-red/10 px-2 py-0.5 rounded-full mb-1">
                +1.2%
              </span>
            </div>
            
            <LiquidationRiskGauge risk={liquidationRisk} />
          </motion.div>

          {/* Card 3: Margin Usage (Bars) */}
          <motion.div variants={cardVariants} className="bg-dm-surface border border-dm-border rounded-[24px] p-6 flex flex-col relative overflow-hidden">
             <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="bg-[#3366FF]/20 p-1.5 rounded-full">
                  <Users size={16} className="text-[#3366FF]" />
                </div>
                <h3 className="text-sm font-semibold text-dm-text">Margin Usage</h3>
              </div>
            </div>
            
            <div className="flex items-end gap-2 my-2">
              <span className="text-4xl font-bold text-dm-text">{marginUsage.toFixed(2)}%</span>
            </div>
            
            <div className="flex items-center gap-3 mt-2 mb-6 text-xs text-dm-text3">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#3366FF]"></div>Used</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#3366FF]/40"></div>Reserved</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-dm-surface-strong"></div>Free</div>
            </div>

            <div className="flex w-full gap-2 mt-auto pb-4">
               <div className="flex flex-col gap-2" style={{ width: `${marginUsage}%` }}>
                  <span className="text-lg font-bold text-dm-text">{marginUsage.toFixed(0)}%</span>
                  <div className="h-8 w-full bg-[#3366FF] rounded-[8px]"></div>
               </div>
               <div className="flex flex-col gap-2 w-1/4">
                  <span className="text-lg font-bold text-dm-text">2%</span>
                  <div className="h-8 w-full bg-[#3366FF]/40 rounded-[8px]"></div>
               </div>
                <div className="flex flex-col gap-2 flex-1">
                  <span className="text-lg font-bold text-dm-text">{Math.max(0, 100 - marginUsage - 2).toFixed(0)}%</span>
                  <div className="h-8 w-full bg-dm-surface-strong rounded-[8px]"></div>
               </div>
            </div>
          </motion.div>

          {/* Card 4: Account Performance (Chart) */}
          <motion.div variants={cardVariants} className="bg-dm-surface border border-dm-border rounded-[24px] p-6 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="bg-[#3366FF]/20 p-1.5 rounded-full">
                  <Calendar size={16} className="text-[#3366FF]" />
                </div>
                <h3 className="text-sm font-semibold text-dm-text">Performance</h3>
              </div>
            </div>
            
            <div className="flex items-end gap-2 my-2 mb-6">
              <span className="text-4xl font-bold text-dm-text">{formatCurrency(accountEquity, 0)}</span>
              <span className="text-sm font-semibold text-dream-green bg-dream-green/10 px-2 py-0.5 rounded-full mb-1">
                +16
              </span>
            </div>
            
            <div className="w-full h-32 mt-auto relative">
               <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-dashed border-dm-border z-0"></div>
               <div className="absolute left-0 top-1/2 -translate-y-1/2 -mt-4 bg-dm-surface px-1.5 rounded-[4px] text-[10px] text-dm-text3 z-10 border border-dm-border">Avg</div>
               <ResponsiveContainer width="100%" height="100%" className="relative z-10">
                  <AreaChart data={equityData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                     <defs>
                        <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#3366FF" stopOpacity={0.8}/>
                           <stop offset="95%" stopColor="#3366FF" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--dm-surface)', borderRadius: '8px', border: '1px solid var(--dm-border)', padding: '4px 8px' }}
                        itemStyle={{ color: 'var(--dm-text)', fontSize: '12px' }}
                        labelStyle={{ display: 'none' }}
                     />
                     <Area type="monotone" dataKey="value" stroke="#3366FF" strokeWidth={3} fill="url(#orderGrad)" />
                  </AreaChart>
               </ResponsiveContainer>
               <div className="flex justify-between text-[10px] text-dm-text3 font-medium mt-2">
                  <span>03-07</span>
                  <span>10-14</span>
                  <span>17-21</span>
                  <span>24-28</span>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           
           {/* Active Positions Table */}
           <motion.div variants={cardVariants} className="lg:col-span-2 bg-dm-surface border border-dm-border rounded-[24px] p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                 <div className="flex items-center gap-2">
                    <div className="bg-[#3366FF]/20 p-1.5 rounded-full">
                       <Calendar size={16} className="text-[#3366FF]" />
                    </div>
                    <h3 className="text-base font-semibold text-dm-text">Active Positions</h3>
                 </div>
                 
                 <div className="flex items-center gap-4 text-xs">
                    <button onClick={() => onNavigate('Positions')} className="text-[#3366FF] font-medium hover:underline ml-2">View more</button>
                 </div>
              </div>

              <div className="overflow-x-auto w-full mt-2">
                 <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                       <tr className="text-xs text-dm-text2 border-b border-dm-border/50">
                          <th className="py-3 px-2 font-medium">Market ↑↓</th>
                          <th className="py-3 px-2 font-medium">Type ↑↓</th>
                          <th className="py-3 px-2 font-medium">Size ↑↓</th>
                          <th className="py-3 px-2 font-medium">Entry Price ↑↓</th>
                          <th className="py-3 px-2 font-medium">Mark Price ↑↓</th>
                          <th className="py-3 px-2 font-medium">PnL ↑↓</th>
                          <th className="py-3 px-2 font-medium text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody>
                       {positions.map((pos) => {
                          const isPositive = pos.pnl >= 0;
                          const assetSymbol = pos.pair.split('-')[0];
                          return (
                          <tr key={pos.id} className="text-sm font-medium border-b border-dm-border/50 last:border-0 hover:bg-dm-surface-alt/50 transition-colors">
                             <td className="py-4 px-2 text-dm-text flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-dm-surface-strong border border-dm-border flex items-center justify-center text-[10px] font-bold">
                                   {assetSymbol}
                                </div>
                                <div>
                                   <div>{pos.pair}</div>
                                   <div className="text-[10px] text-dm-text3 font-medium mt-0.5">{pos.leverage}x Leverage</div>
                                </div>
                             </td>
                             <td className="py-4 px-2">
                                <span className={`flex items-center gap-1.5 text-xs ${pos.type === 'Long' ? 'text-dream-green' : 'text-dream-red'}`}>
                                   {pos.type}
                                </span>
                             </td>
                             <td className="py-4 px-2 text-dm-text">{pos.size.toFixed(4)} <span className="text-xs text-dm-text3">{assetSymbol}</span></td>
                             <td className="py-4 px-2 text-dm-text">{formatCurrency(pos.entryPrice)}</td>
                             <td className="py-4 px-2 text-dm-text">{formatCurrency(pos.markPrice)}</td>
                             <td className="py-4 px-2">
                                <div className={`flex flex-col ${isPositive ? 'text-dream-green' : 'text-dream-red'}`}>
                                   <span>{isPositive ? '+' : ''}{formatCurrency(pos.pnl)}</span>
                                   <span className="text-[10px]">{isPositive ? '+' : ''}{formatPercent(pos.pnlPercent)}</span>
                                </div>
                             </td>
                             <td className="py-4 px-2 flex justify-end gap-2">
                                <button className="w-8 h-8 rounded-full bg-dm-surface-alt border border-dm-border flex items-center justify-center text-dm-text hover:bg-dm-surface-strong transition-colors">
                                   <MoreHorizontal size={16} />
                                </button>
                             </td>
                          </tr>
                       )})}
                       {positions.length === 0 && (
                          <tr>
                             <td colSpan={7} className="py-8 text-center text-dm-text3 text-sm">No active positions found</td>
                          </tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </motion.div>

           {/* Markets / Available Tokens */}
           <motion.div variants={cardVariants} className="bg-dm-surface border border-dm-border rounded-[24px] p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                 <div className="flex items-center gap-2">
                    <div className="bg-[#3366FF]/20 p-1.5 rounded-full">
                       <TrendingUp size={16} className="text-[#3366FF]" />
                    </div>
                    <h3 className="text-base font-semibold text-dm-text">Available Markets</h3>
                 </div>
                 <button onClick={() => onNavigate('Trade')} className="text-[#3366FF] text-xs font-medium hover:underline">Trade all</button>
              </div>

              <div className="flex flex-col gap-4">
                 {initialPairs.map((pair) => {
                    const marketId = pair.pair.replace('/', '-'); // Rough mapping to market id, or just split
                    const symbol = pair.pair.split('/')[0];
                    const ticker = tickers[marketId] || tickers[`${symbol}-USD`];
                    
                    const price = ticker ? parseFloat(ticker.price) / 10**6 : pair.price;
                    const changeStr = ticker ? ticker.price_change_24h : '0';
                    const change = ticker ? parseFloat(changeStr) : pair.change;
                    const isPositive = change >= 0;

                    return (
                       <div key={pair.id} className="flex items-center justify-between p-3 rounded-[16px] border border-dm-border bg-dm-surface-alt/20 hover:bg-dm-surface-alt transition-colors cursor-pointer group">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-dm-surface-strong border border-dm-border flex items-center justify-center text-xs text-dm-text font-bold">
                                {symbol}
                             </div>
                             <div>
                                <div className="text-sm font-semibold text-dm-text group-hover:text-[#3366FF] transition-colors">{pair.name}</div>
                                <div className="text-[11px] text-dm-text3">{pair.pair}</div>
                             </div>
                          </div>
                          <div className="text-right">
                             <div className="text-sm font-bold text-dm-text">{formatCurrency(price)}</div>
                             <div className={`text-[11px] font-medium flex items-center justify-end gap-1 ${isPositive ? 'text-dream-green' : 'text-dream-red'}`}>
                                {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {Math.abs(change).toFixed(2)}%
                             </div>
                          </div>
                       </div>
                    );
                 })}
              </div>
           </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
