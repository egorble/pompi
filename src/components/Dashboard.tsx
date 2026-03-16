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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-4">
        {/* Left Column: Equity & Summary */}
        <div className="md:col-span-8 flex flex-col gap-4">
          
          <motion.div variants={cardVariants} className="premium-card rounded-sm p-4 relative overflow-hidden flex flex-col justify-center min-h-[140px]">
            <div className="relative z-10 w-2/3">
              <h2 className="text-dm-text3 font-medium text-xs uppercase tracking-wider mb-1">Total Equity</h2>
              <div className="text-4xl font-bold text-dm-text tracking-tight mb-2">
                {formatCurrency(accountEquity)}
              </div>
            </div>
          </motion.div>

          {/* Additional details */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div variants={cardVariants} className="premium-card rounded-sm p-4 relative overflow-hidden group">
               <div className="relative z-10">
                  <div className="text-xs text-dm-text3 font-medium uppercase tracking-wider mb-1">Free Collateral</div>
                  <div className="text-xl font-semibold text-dm-text">{formatCurrency(freeCollateral)}</div>
               </div>
            </motion.div>
            <motion.div variants={cardVariants} className="premium-card rounded-sm p-4 relative overflow-hidden group">
               <div className="relative z-10">
                  <div className="text-xs text-dm-text3 font-medium uppercase tracking-wider mb-1">Maintenance Margin</div>
                  <div className="text-xl font-semibold text-dm-text">{formatCurrency(maintenanceMargin)}</div>
               </div>
            </motion.div>
          </div>
          
        </div>

        {/* Right Column: Margin & Risk */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <motion.div variants={cardVariants} className="premium-card rounded-sm p-4 flex-1 flex flex-col relative overflow-hidden">
            
            <h3 className="text-dm-text3 font-medium text-xs uppercase tracking-wider mb-4 relative z-10">Usage & Risk</h3>
            
            <div className="flex flex-col gap-5 mb-4 flex-1 relative z-10">
              <div>
                <div className="flex justify-between items-end mb-1">
                  <span className="text-sm text-dm-text2">Collateral</span>
                  <span className="text-sm font-semibold text-dm-text">{formatCurrency(collateralMargin)}</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-end mb-1">
                  <span className="text-sm text-dm-text2">Margin Usage</span>
                  <span className="text-sm font-semibold text-dm-text">{marginUsage.toFixed(2)}%</span>
                </div>
                {/* Professional Usage Bar */}
                <div className="h-1.5 w-full bg-dm-surface-strong rounded-sm overflow-hidden mt-1 relative">
                  <div className="absolute inset-y-0 left-0 bg-brand-accent rounded-sm" style={{ width: `${Math.min(marginUsage, 100)}%` }}></div>
                </div>
              </div>

               <div className="mt-auto">
                <div className="flex justify-between items-end mb-1 mt-2">
                  <span className="text-sm text-dm-text2">Margin Level</span>
                  <span className="text-sm font-semibold text-dream-green">Safe</span>
                </div>
                {/* Liquidation Risk continuous bar */}
                <div className="h-1.5 w-full bg-dm-surface-alt rounded-sm overflow-hidden mt-1 relative flex">
                  <div className="h-full bg-dream-green/60" style={{ width: '40%' }}></div>
                  <div className="h-full bg-yellow-500/60" style={{ width: '40%' }}></div>
                  <div className="h-full bg-dream-red/60" style={{ width: '20%' }}></div>
                  
                  {/* Marker for current risk */}
                  <div className="absolute top-0 bottom-0 w-[2px] bg-dm-inverse shadow-sm border border-transparent" style={{ left: `${liquidationRisk}%`, transform: 'translateX(-50%)' }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-dm-text3 mt-1 font-medium select-none">
                   <span>0%</span>
                   <span>Risk: {liquidationRisk.toFixed(2)}%</span>
                   <span>100%</span>
                </div>
              </div>
            </div>
            
            
          </motion.div>
        </div>
        
        {/* Bottom Row */}
        <div className="md:col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Equity Curve */}
          <motion.div variants={cardVariants} className="premium-card rounded-sm p-4 lg:col-span-2 flex flex-col min-h-[300px]">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="text-dm-text3" size={16} />
              <h3 className="text-dm-text3 font-medium text-xs uppercase tracking-wider">Performance (24h)</h3>
            </div>
            <div className="flex-1 w-full min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equityData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3366FF" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3366FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--dm-surface)', borderRadius: '4px', border: '1px solid var(--dm-border)', padding: '8px' }}
                    itemStyle={{ color: 'var(--dm-text)', fontSize: '12px' }}
                    formatter={(value: number) => [formatCurrency(value), 'Equity']}
                    labelStyle={{ color: 'var(--dm-text3)', fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#3366FF" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Top Movers */}
          <motion.div variants={cardVariants} className="premium-card rounded-sm p-4">
            <div className="flex items-center gap-2 mb-4">
              <LineChart className="text-dm-text3" size={16} />
              <h3 className="text-dm-text3 font-medium text-xs uppercase tracking-wider">Top Movers</h3>
            </div>
            
            <div className="flex flex-col gap-1">
              {topMovers.map((mover, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 px-2 hover:bg-dm-surface-alt rounded-sm transition-colors cursor-pointer border border-transparent hover:border-dm-border">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <div className="font-semibold text-dm-text text-sm">{mover.pair}</div>
                      <div className="text-[10px] text-dm-text3 uppercase mt-0.5">Vol {mover.volume}</div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div className="font-medium text-dm-text text-sm">{formatCurrency(mover.price, 2)}</div>
                    <div className={`text-xs font-bold mt-0.5 ${mover.change >= 0 ? 'text-dream-green' : 'text-dream-red'}`}>
                      {mover.change >= 0 ? '+' : ''}{formatPercent(mover.change)}
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
            <motion.div variants={cardVariants} className="premium-card rounded-sm p-0 overflow-hidden">
               <div className="p-4 border-b border-dm-border">
                  <h3 className="text-dm-text3 font-medium text-xs uppercase tracking-wider">Active Positions</h3>
               </div>
               <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[10px] text-dm-text3 border-b border-dm-border">
                        <th className="py-2 px-4 font-medium uppercase tracking-wider">Market</th>
                        <th className="py-2 px-4 font-medium uppercase tracking-wider">Size</th>
                        <th className="py-2 px-4 font-medium uppercase tracking-wider">Entry Price</th>
                        <th className="py-2 px-4 font-medium uppercase tracking-wider">Mark Price</th>
                        <th className="py-2 px-4 font-medium uppercase tracking-wider text-right">PNL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activePositions.slice(0, 3).map((pos, i) => (
                        <tr key={i} className="text-sm hover:bg-dm-surface-alt transition-colors group border-b border-dm-border/50 last:border-0">
                          <td className="py-3 px-4 font-semibold text-dm-text">
                            <span className={pos.type === 'Long' ? 'text-dream-green' : 'text-dream-red'}>
                              {pos.type}
                            </span>
                            <span className="ml-2">{pos.pair}</span>
                            <span className="ml-2 text-[10px] text-dm-text3 font-medium border border-dm-border px-1.5 py-0.5 rounded-sm">
                              {pos.leverage}x
                            </span>
                          </td>
                          <td className="py-3 px-4 text-dm-text2">{pos.size.toFixed(4)}</td>
                          <td className="py-3 px-4 text-dm-text2">{formatCurrency(pos.entryPrice)}</td>
                          <td className="py-3 px-4 text-dm-text2">{formatCurrency(pos.markPrice)}</td>
                          <td className={`py-3 px-4 font-bold text-right ${pos.pnl >= 0 ? 'text-dream-green' : 'text-dream-red'}`}>
                            {formatCurrency(pos.pnl)} ({formatPercent(pos.pnlPercent)})
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
               {activePositions.length > 3 && (
                 <div className="w-full text-center p-3 border-t border-dm-border bg-dm-surface/50 hover:bg-dm-surface transition-colors cursor-pointer">
                   <span className="text-xs text-dm-text2 font-medium uppercase tracking-wider">View All Positions</span>
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
