import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { MarketInfo } from './components/MarketInfo';
import { Chart } from './components/Chart';
import { ExecutionPanel } from './components/ExecutionPanel';
import { OrderBook } from './components/OrderBook';
import { Positions } from './components/Positions';
import { BottomNav } from './components/BottomNav';
import { MobileTradingScreen } from './components/MobileTradingScreen';
import { MobileChartScreen } from './components/MobileChartScreen';
import { Pair, Position } from './types';
import { initialPairs, initialPositions } from './data';

function AppContent() {
  const [activeTab, setActiveTab] = useState<'Trade' | 'Positions' | 'Points'>('Trade');
  const [balance, setBalance] = useState(12450.20);
  const [selectedPair, setSelectedPair] = useState<Pair>(initialPairs[0]);
  const [positions, setPositions] = useState<Position[]>(initialPositions);
  const [showMobileChart, setShowMobileChart] = useState(false);

  const handleAddCash = () => {
    setBalance(prev => prev + 1000);
  };

  const handlePlaceTrade = (trade: { type: 'Long' | 'Short', leverage: number, sizeUsd: number, price?: number }) => {
    const tradePrice = trade.price || selectedPair.price;
    const sizeInAsset = trade.sizeUsd / tradePrice;
    const newPos: Position = {
      id: Math.random().toString(36).substring(2, 9),
      pair: selectedPair.pair.replace('/USDC', '-PERP'),
      type: trade.type,
      leverage: trade.leverage,
      size: sizeInAsset,
      entryPrice: tradePrice,
      markPrice: selectedPair.price,
      liqPrice: trade.type === 'Long'
        ? tradePrice * (1 - 1/trade.leverage)
        : tradePrice * (1 + 1/trade.leverage),
      pnl: 0,
      pnlPercent: 0,
    };
    setPositions(prev => [newPos, ...prev]);
    setBalance(prev => prev - (trade.sizeUsd / trade.leverage));
    setActiveTab('Positions');
  };

  const handleClosePosition = (id: string) => {
    const pos = positions.find(p => p.id === id);
    if (pos) {
      const margin = (pos.size * pos.entryPrice) / pos.leverage;
      setBalance(prev => prev + margin + pos.pnl);
    }
    setPositions(prev => prev.filter(p => p.id !== id));
  };

  const handleCloseAll = () => {
    let totalReturn = 0;
    positions.forEach(pos => {
      const margin = (pos.size * pos.entryPrice) / pos.leverage;
      totalReturn += margin + pos.pnl;
    });
    setBalance(prev => prev + totalReturn);
    setPositions([]);
  };

  const pageVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen lg:h-screen flex flex-col text-dm-text bg-dream-bg lg:overflow-hidden">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        balance={balance}
        onAddCash={handleAddCash}
      />

      <main className="p-0 md:p-4 flex-1 overflow-y-auto lg:overflow-hidden relative pb-24 lg:pb-4">
        <AnimatePresence mode="wait">
          {activeTab === 'Trade' && (
            <motion.div
              key="trade"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="h-full"
            >
              {/* Desktop View */}
              <div className="hidden lg:grid grid-cols-12 gap-4 h-full">
                <motion.div variants={itemVariants} className="col-span-7 flex flex-col gap-4 overflow-hidden">
                  <MarketInfo
                    pair={selectedPair}
                    pairs={initialPairs}
                    onSelectPair={setSelectedPair}
                  />
                  <Chart pair={selectedPair} />
                </motion.div>

                <motion.div variants={itemVariants} className="col-span-2 flex flex-col gap-4 overflow-hidden">
                  <OrderBook pair={selectedPair} />
                </motion.div>

                <motion.div variants={itemVariants} className="col-span-3 flex flex-col gap-4 overflow-hidden">
                  <ExecutionPanel pair={selectedPair} onPlaceTrade={handlePlaceTrade} />
                </motion.div>
              </div>

              {/* Mobile View */}
              <div className="lg:hidden h-full">
                {showMobileChart ? (
                  <MobileChartScreen
                    pair={selectedPair}
                    onBack={() => setShowMobileChart(false)}
                  />
                ) : (
                  <MobileTradingScreen
                    pair={selectedPair}
                    pairs={initialPairs}
                    onSelectPair={setSelectedPair}
                    onOpenChart={() => setShowMobileChart(true)}
                    balance={balance}
                    onPlaceTrade={handlePlaceTrade}
                  />
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'Positions' && (
            <motion.div
              key="positions"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="h-full overflow-y-auto no-scrollbar"
            >
              <motion.div variants={itemVariants}>
                <Positions
                  positions={positions}
                  onClose={handleClosePosition}
                  onCloseAll={handleCloseAll}
                />
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'Points' && (
            <motion.div
              key="points"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex items-center justify-center h-full text-dm-text3 font-medium"
            >
              <motion.div variants={itemVariants}>
                Points feature coming soon...
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTrade={() => setActiveTab('Trade')}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
