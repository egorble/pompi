import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store';
import { formatCurrency, formatPercent } from '../utils';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { LineChart, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

export function Dashboard() {
  const accountEquity = 1001.33;
  const pnl = -184.10;
  const pnlPercent = -18.95;
  const collateralMargin = 1001.33;
  const marginUsage = 17.28;
  const freeCollateral = 651.36;
  const maintenanceMargin = 90.63;
  const liquidationRisk = 11.51;

  // We'll use mock data for active positions for the visual overview, 
  // or fetch similarly to App.tsx later.
  const activePositions = [
    { type: 'Long', pair: 'BTC/USDC', leverage: 10, size: 0.15, entryPrice: 62100, markPrice: 63200, pnl: 165, pnlPercent: 2.65 },
    { type: 'Short', pair: 'ETH/USDC', leverage: 5, size: 2.5, entryPrice: 3500, markPrice: 3450, pnl: 125, pnlPercent: 1.42 },
  ];

  // Mock data for the equity curve
  const equityData = [
    { time: '00:00', value: 950 },
    { time: '04:00', value: 920 },
    { time: '08:00', value: 980 },
    { time: '12:00', value: 1050 },
    { time: '16:00', value: 1020 },
    { time: '20:00', value: 1080 },
    { time: '24:00', value: 1001.33 },
  ];

  // Mock data for top movers
  const topMovers = [
    { pair: 'BTC/USDC', change: 2.45, price: 64230.50, volume: '1.2B' },
    { pair: 'ETH/USDC', change: 4.12, price: 3450.20, volume: '850M' },
    { pair: 'SOL/USDC', change: -1.20, price: 145.60, volume: '420M' },
    { pair: 'DOGE/USDC', change: 8.50, price: 0.154, volume: '150M' },
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
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-dm-text">Overview</h1>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 overflow-y-auto no-scrollbar pb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6">
        {/* Left Column: Equity & Summary */}
        <div className="md:col-span-8 flex flex-col gap-6">
          
          <motion.div variants={cardVariants} className="bg-dm-surface rounded-[32px] p-8 dream-shadow relative overflow-hidden flex flex-col justify-center min-h-[240px]">
            {/* Background elements to match the reference */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 right-20 w-48 h-48 bg-dream-green/5 rounded-full blur-3xl -mb-10"></div>

            <div className="relative z-10 w-2/3">
              <h2 className="text-dm-text2 font-semibold text-lg mb-2">Total Equity</h2>
              <div className="text-5xl font-black text-dm-text tracking-tight mb-4">
                {formatCurrency(accountEquity)}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-dm-surface-alt rounded-2xl p-4 flex-1">
                  <div className="text-sm text-dm-text3 mb-1">Cumulative PNL</div>
                  <div className={`text-xl font-bold ${pnl >= 0 ? 'text-dream-green' : 'text-dream-red'}`}>
                    {pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}
                  </div>
                </div>
                
                <div className="bg-dm-surface-alt rounded-2xl p-4 flex-1">
                  <div className="text-sm text-dm-text3 mb-1">24h Return</div>
                  <div className={`text-xl font-bold ${pnlPercent >= 0 ? 'text-dream-green' : 'text-dream-red'}`}>
                    {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Additional details */}
          <div className="grid grid-cols-2 gap-6">
            <motion.div variants={cardVariants} className="bg-dm-surface rounded-[32px] p-6 dream-shadow relative overflow-hidden">
               <div className="relative z-10">
                  <div className="text-sm text-dm-text2 font-semibold mb-1">Free Collateral</div>
                  <div className="text-2xl font-bold text-dm-text">{formatCurrency(freeCollateral)}</div>
               </div>
            </motion.div>
            <motion.div variants={cardVariants} className="bg-dm-surface rounded-[32px] p-6 dream-shadow relative overflow-hidden">
               <div className="relative z-10">
                  <div className="text-sm text-dm-text2 font-semibold mb-1">Maintenance Margin</div>
                  <div className="text-2xl font-bold text-dm-text">{formatCurrency(maintenanceMargin)}</div>
               </div>
            </motion.div>
          </div>
          
        </div>

        {/* Right Column: Margin & Risk */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <motion.div variants={cardVariants} className="bg-dm-surface rounded-[32px] p-6 dream-shadow flex-1 flex flex-col relative overflow-hidden">
            <h3 className="text-dm-text font-bold text-lg mb-6">Account Margin</h3>
            
            <div className="flex flex-col gap-6 mb-8 flex-1">
              <div>
                <div className="flex justify-between items-end mb-1">
                  <span className="text-sm font-medium text-dm-text2">Collateral Margin</span>
                  <span className="text-lg font-bold text-dm-text">{formatCurrency(collateralMargin)}</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-end mb-1">
                  <span className="text-sm font-medium text-dm-text2">Margin Usage</span>
                  <span className="text-lg font-bold text-dm-text">{marginUsage.toFixed(2)}%</span>
                </div>
                {/* Simple Usage Bar */}
                <div className="h-2 w-full bg-dm-surface-strong rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-brand-accent rounded-full" style={{ width: `${Math.min(marginUsage, 100)}%` }}></div>
                </div>
              </div>
            </div>

            {/* Liquidation Risk (Segmented Style) */}
            <div className="mt-auto pt-6 border-t border-dm-border">
              <div className="flex justify-between items-end mb-4">
                <span className="text-sm font-medium text-dm-text2">Liquidation Risk</span>
                <span className="text-xl font-black text-dm-text">{liquidationRisk.toFixed(2)}%</span>
              </div>
              
              <div className="flex gap-1 h-3">
                {[...Array(20)].map((_, i) => {
                  const threshold = (i + 1) * 5; // each segment is 5%
                  let segmentColor = 'bg-dm-surface-strong';
                  
                  if (liquidationRisk >= threshold) {
                    if (threshold <= 40) segmentColor = 'bg-brand-accent';
                    else if (threshold <= 70) segmentColor = 'bg-yellow-400';
                    else segmentColor = 'bg-dream-red';
                  } else if (liquidationRisk > threshold - 5) {
                    // Partially filled segment
                     if (threshold <= 40) segmentColor = 'bg-brand-accent/50';
                     else if (threshold <= 70) segmentColor = 'bg-yellow-400/50';
                     else segmentColor = 'bg-dream-red/50';
                  }

                  return (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-sm ${segmentColor} transition-colors duration-500`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] text-dm-text3 font-medium mt-2 px-1">
                <span>Safe</span>
                <span>Danger</span>
              </div>
            </div>
            
            
          </motion.div>
        </div>
        
        {/* Bottom Row */}
        <div className="md:col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Equity Curve */}
          <motion.div variants={cardVariants} className="bg-dm-surface rounded-[32px] p-6 dream-shadow lg:col-span-2 flex flex-col min-h-[300px]">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="text-dream-blue" size={20} />
              <h3 className="text-dm-text font-bold">Performance (24h)</h3>
            </div>
            <div className="flex-1 w-full min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equityData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82B1FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#82B1FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--dm-surface)', borderRadius: '12px', border: '1px solid var(--dm-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: 'var(--dm-text)' }}
                    formatter={(value: number) => [formatCurrency(value), 'Equity']}
                    labelStyle={{ color: 'var(--dm-text3)' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#82B1FF" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Top Movers */}
          <motion.div variants={cardVariants} className="bg-dm-surface rounded-[32px] p-6 dream-shadow">
            <div className="flex items-center gap-2 mb-6">
              <LineChart className="text-brand-accent" size={20} />
              <h3 className="text-dm-text font-bold">Top Movers</h3>
            </div>
            
            <div className="flex flex-col gap-4">
              {topMovers.map((mover, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 hover:bg-dm-surface-alt rounded-2xl transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-dm-surface-strong ${mover.change >= 0 ? 'text-dream-green' : 'text-dream-red'}`}>
                      {mover.change >= 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                    </div>
                    <div>
                      <div className="font-bold text-dm-text text-sm">{mover.pair}</div>
                      <div className="text-xs text-dm-text3">Vol {mover.volume}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-dm-text text-sm">{formatCurrency(mover.price, 2)}</div>
                    <div className={`text-xs font-bold ${mover.change >= 0 ? 'text-dream-green' : 'text-dream-red'}`}>
                      {formatPercent(mover.change)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Active Positions Mini-Table */}
        {activePositions.length > 0 && (
          <div className="md:col-span-12 mt-2">
            <motion.div variants={cardVariants} className="bg-dm-surface rounded-[32px] p-6 dream-shadow overflow-hidden">
               <h3 className="text-dm-text font-bold mb-4">Active Positions</h3>
               <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-xs text-dm-text3 border-b border-dm-border">
                        <th className="pb-3 px-4 font-medium">Market</th>
                        <th className="pb-3 px-4 font-medium">Size</th>
                        <th className="pb-3 px-4 font-medium">Entry Price</th>
                        <th className="pb-3 px-4 font-medium">Mark Price</th>
                        <th className="pb-3 px-4 font-medium text-right">PNL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activePositions.slice(0, 3).map((pos, i) => (
                        <tr key={i} className="text-sm hover:bg-dm-surface-alt transition-colors group">
                          <td className="py-4 px-4 font-bold text-dm-text">
                            <span className={pos.type === 'Long' ? 'text-dream-green' : 'text-dream-red'}>
                              {pos.type}
                            </span>
                            <span className="ml-2">{pos.pair}</span>
                            <span className="ml-2 text-xs text-dm-text3 font-medium bg-dm-surface-strong px-2 py-0.5 rounded">
                              {pos.leverage}x
                            </span>
                          </td>
                          <td className="py-4 px-4 font-medium text-dm-text2">{pos.size.toFixed(4)}</td>
                          <td className="py-4 px-4 font-medium text-dm-text2">{formatCurrency(pos.entryPrice)}</td>
                          <td className="py-4 px-4 font-medium text-dm-text2">{formatCurrency(pos.markPrice)}</td>
                          <td className={`py-4 px-4 font-bold text-right ${pos.pnl >= 0 ? 'text-dream-green' : 'text-dream-red'}`}>
                            {formatCurrency(pos.pnl)} ({formatPercent(pos.pnlPercent)})
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
               {activePositions.length > 3 && (
                 <div className="w-full text-center mt-4">
                   <span className="text-xs text-brand-accent font-semibold cursor-pointer hover:underline">View All Positions</span>
                 </div>
               )}
            </motion.div>
          </div>
        )}
        </div>
      </motion.div>
    </div>
  );
}
