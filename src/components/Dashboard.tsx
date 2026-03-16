import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store';
import { formatCurrency } from '../utils';

export function Dashboard() {
  const accountEquity = 1001.33;
  const pnl = -184.10;
  const pnlPercent = -18.95;
  
  const collateralMargin = 1001.33;
  const marginUsage = 17.28;
  const freeCollateral = 651.36;
  const maintenanceMargin = 90.63;
  const liquidationRisk = 11.51;

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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dm-text">Overview</h1>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-12 gap-6"
      >
        {/* Left Column: Equity & Summary */}
        <div className="md:col-span-8 flex flex-col gap-6">
          
          <motion.div variants={cardVariants} className="bg-dm-surface rounded-[32px] p-8 dream-shadow relative overflow-hidden flex flex-col justify-center min-h-[240px]">
            {/* Background elements to match the reference */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 right-20 w-48 h-48 bg-dream-green/5 rounded-full blur-3xl -mb-10"></div>
            
            <img src="/wallet_3d_icon_1773604660043.png" alt="Wallet" className="absolute -right-8 top-1/2 -translate-y-1/2 w-80 object-contain opacity-80 mix-blend-luminosity drop-shadow-2xl" />

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
               <img src="/hand_3d_icon_1773604647563.png" alt="Hand" className="absolute -right-10 -bottom-10 w-40 object-contain opacity-40 mix-blend-luminosity" />
               <div className="relative z-10">
                  <div className="text-sm text-dm-text2 font-semibold mb-1">Free Collateral</div>
                  <div className="text-2xl font-bold text-dm-text">{formatCurrency(freeCollateral)}</div>
               </div>
            </motion.div>
            <motion.div variants={cardVariants} className="bg-dm-surface rounded-[32px] p-6 dream-shadow relative overflow-hidden">
               <img src="/coin_3d_icon_1773604630375.png" alt="Coin" className="absolute -right-10 -bottom-10 w-40 object-contain opacity-40 mix-blend-luminosity" />
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
      </motion.div>
    </div>
  );
}
