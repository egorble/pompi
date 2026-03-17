import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MarketInfo } from './components/MarketInfo';
import { Chart } from './components/Chart';
import { ExecutionPanel } from './components/ExecutionPanel';
import { OrderBook } from './components/OrderBook';
import { Positions } from './components/Positions';
import { BottomNav } from './components/BottomNav';
import { MobileTradingScreen } from './components/MobileTradingScreen';
import { MobileChartScreen } from './components/MobileChartScreen';
import { StatsPanel } from './components/StatsPanel';
import { Dashboard } from './components/Dashboard';
import { OpenOrders } from './components/OpenOrders';
import { Pair, Position, Order } from './types';
import { initialPairs, initialPositions, initialOrders } from './data';
import { getMarketId } from './utils';
import { useWebSocket } from './hooks/useWebSocket';
import { useStore } from './store';
import { apiClient } from './api/client';
import { Side, OrderType } from './api/types';
import { AccountPanel } from './components/AccountPanel';
function AppContent() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'Trade' | 'Positions' | 'OpenOrders' | 'Stats'>('dashboard');
  const [selectedPair, setSelectedPair] = useState<Pair>(initialPairs[0]);
  const [positions, setPositions] = useState<Position[]>(initialPositions);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [showMobileChart, setShowMobileChart] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  const { setCurrentMarketId, walletAddress, setTicker, setUsdcBalance, usdcBalance } = useStore();

  // Initialize WebSocket connection
  useWebSocket();

  // Sync market ID with store
  useEffect(() => {
    setCurrentMarketId(getMarketId(selectedPair.pair));
  }, [selectedPair, setCurrentMarketId]);

  // Fetch tickers for ALL markets + account balance
  useEffect(() => {
    const fetchMarketData = async () => {
      for (const pair of initialPairs) {
        const mid = getMarketId(pair.pair);
        try { const t = await apiClient.getTicker(mid); setTicker(mid, t); } catch {}
      }
      try { const a = await apiClient.getAccount(walletAddress); setUsdcBalance(a.usdc_balance); } catch {}
    };
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 3000);
    return () => clearInterval(interval);
  }, [walletAddress, setTicker, setUsdcBalance]);

  // Fetch positions from backend
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const backendPositions = await apiClient.getPositions(walletAddress);
        const mapped = backendPositions
          .filter(bp => bp.status !== 'Closed')
          .map(bp => {
            const sizeNum = parseFloat(bp.size) / 1e18;
            const collateralNum = parseFloat(bp.collateral) / 1e18;
            const entryPriceNum = parseFloat(bp.entry_price) / 1e18;
            const leverageNum = collateralNum > 0 ? (sizeNum * entryPriceNum) / collateralNum : 1;

            const currentPrice = useStore.getState().lastPrice;
            const markPrice = (bp.market_id === getMarketId(selectedPair.pair) && currentPrice > 0)
              ? currentPrice
              : entryPriceNum;

            const isLong = bp.side === 'Buy';
            const pnl = isLong
              ? (markPrice - entryPriceNum) * sizeNum
              : (entryPriceNum - markPrice) * sizeNum;
            const pnlPercent = collateralNum > 0 ? (pnl / collateralNum) * 100 : 0;
            const liqPrice = isLong ? entryPriceNum * 0.8 : entryPriceNum * 1.2;

            return {
              id: bp.position_id,
              pair: bp.market_id,
              type: isLong ? 'Long' : 'Short',
              leverage: Math.round(leverageNum || 1),
              size: sizeNum,
              entryPrice: entryPriceNum,
              markPrice,
              liqPrice,
              pnl,
              pnlPercent,
            } as Position;
          });

        if (mapped.length > 0) {
          setPositions(mapped);
        }
      } catch {
        // Backend not available — keep local positions
      }
    };

    fetchPositions();
    const interval = setInterval(fetchPositions, 5000);
    return () => clearInterval(interval);
  }, [walletAddress, selectedPair]);

  const handlePlaceTrade = async (trade: { type: 'Long' | 'Short', leverage: number, sizeUsd: number, price?: number }) => {
    const tradePrice = trade.price || selectedPair.price;
    const sizeInAsset = trade.sizeUsd / tradePrice;
    const marketId = getMarketId(selectedPair.pair);

    // Try sending to backend
    try {
      await apiClient.createOrder({
        market_id: marketId,
        trader: walletAddress,
        side: trade.type === 'Long' ? Side.Buy : Side.Sell,
        order_type: trade.price ? OrderType.Limit : OrderType.Market,
        price: tradePrice,
        size: sizeInAsset,
      });
    } catch {
      // Backend offline — create locally
    }

    // Always add locally for immediate feedback
    const newPos: Position = {
      id: Math.random().toString(36).substring(2, 9),
      pair: selectedPair.pair.replace('/USDC', '-PERP'),
      type: trade.type,
      leverage: trade.leverage,
      size: sizeInAsset,
      entryPrice: tradePrice,
      markPrice: selectedPair.price,
      liqPrice: trade.type === 'Long'
        ? tradePrice * (1 - 1 / trade.leverage)
        : tradePrice * (1 + 1 / trade.leverage),
      pnl: 0,
      pnlPercent: 0,
    };
    setPositions(prev => [newPos, ...prev]);
    setActiveTab('Positions');
  };

  const handleClosePosition = (id: string) => {
    setPositions(prev => prev.filter(p => p.id !== id));
  };

  const handleCloseAll = () => {
    setPositions([]);
  };

  const handleCancelOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const handleCancelAllOrders = () => {
    setOrders([]);
  };

  const pageVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut", staggerChildren: 0.1 }
    },
    exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen lg:h-screen flex flex-row text-dm-text bg-dm-bg lg:overflow-hidden font-sans relative">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onSettingsClick={() => setShowAccount(true)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="pl-0 pr-0 md:pr-4 lg:pr-2 py-0 md:py-4 lg:py-6 flex-1 overflow-y-auto lg:overflow-hidden relative pb-24 lg:pb-0">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="h-full pl-4 md:pl-4 pr-4 md:pr-4 pt-4 lg:pt-0"
              >
                <motion.div variants={itemVariants} className="max-w-7xl mx-auto h-full pb-20 lg:pb-6">
                  <Dashboard positions={positions} onNavigate={setActiveTab} />
                </motion.div>
              </motion.div>
            )}

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
                <div className="hidden lg:flex flex-col gap-4 h-full min-h-0">
                  <div className="grid grid-cols-12 gap-4 min-h-0 flex-1 overflow-hidden">
                    <motion.div variants={itemVariants} className="col-span-9 flex flex-col gap-4 overflow-hidden min-h-0 h-full">
                      <MarketInfo
                        pair={selectedPair}
                        pairs={initialPairs}
                        onSelectPair={setSelectedPair}
                      />
                      <div className="flex gap-4 h-full min-h-0 pb-4">
                        <div className="flex-1 flex flex-col gap-4">
                           <Chart pair={selectedPair} />
                        </div>
                        <div className="w-[260px] flex-shrink-0">
                           <OrderBook pair={selectedPair} />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="col-span-3 flex flex-col gap-4 overflow-y-auto no-scrollbar min-h-0 h-full pb-4 pr-0">
                      <ExecutionPanel pair={selectedPair} onPlaceTrade={handlePlaceTrade} />
                      <Positions
                        positions={positions}
                        onClose={handleClosePosition}
                        onCloseAll={handleCloseAll}
                      />
                    </motion.div>
                  </div>
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
                      balance={usdcBalance}
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
                className="h-full pl-0 md:pl-0 pr-4 md:pr-4 pt-16 lg:pt-4"
              >
                <motion.div variants={itemVariants} className="max-w-7xl w-full flex flex-col mx-auto px-4 lg:px-8 pt-6 pb-20 lg:pb-6">
                  <Positions
                    positions={positions}
                    onClose={handleClosePosition}
                    onCloseAll={handleCloseAll}
                    layout="grid"
                  />
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'Stats' && (
              <motion.div
                key="stats"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="h-full pl-0 md:pl-0 pr-4 md:pr-4 pt-16 lg:pt-4"
              >
                <motion.div variants={itemVariants} className="max-w-5xl mx-auto pt-6">
                  <StatsPanel />
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'OpenOrders' && (
              <motion.div
                key="openorders"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="h-full pl-0 md:pl-0 pr-4 md:pr-4 pt-16 lg:pt-4"
              >
                <motion.div variants={itemVariants} className="max-w-5xl flex flex-col mx-auto pt-6 pb-20 lg:pb-6">
                  <OpenOrders
                    orders={orders}
                    onCancel={handleCancelOrder}
                    onCancelAll={handleCancelAllOrders}
                    layout="grid"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTrade={() => setActiveTab('Trade')}
      />

      <AccountPanel isOpen={showAccount} onClose={() => setShowAccount(false)} />
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
