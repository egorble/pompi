import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { formatCurrency } from '../utils';

interface AppStats {
  total_volume_usd: number;
  total_fees_usd: number;
  total_trades: number;
  active_users: number;
  recent_trades: Array<{
    market_id: string;
    price: number;
    size: number;
    taker_side: string;
    timestamp_ms: number;
  }>;
}

export function StatsPanel() {
  const [stats, setStats] = useState<AppStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:8081/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch {
        // Stats service offline
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center py-16 text-dm-text3 font-medium">
        Loading stats...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-16 text-dm-text3 font-medium">
        Stats service unavailable
      </div>
    );
  }

  const statCards = [
    { label: 'Total Volume', value: formatCurrency(stats.total_volume_usd) },
    { label: 'Total Fees', value: formatCurrency(stats.total_fees_usd) },
    { label: 'Total Trades', value: stats.total_trades.toLocaleString() },
    { label: 'Active Users', value: stats.active_users.toString() },
  ];

  return (
    <section>
      <h2 className="text-xs font-bold text-dm-text3 uppercase tracking-wider mb-4">Platform Stats</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="premium-card rounded-sm p-3 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-dream-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-dream-blue/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <p className="text-[9px] uppercase tracking-wide font-bold text-dm-text3 mb-1">{card.label}</p>
              <p className="text-base font-bold text-dm-text">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="premium-card rounded-sm overflow-hidden">
        <div className="px-3 py-2 border-b border-dm-border">
          <h3 className="text-[11px] font-bold text-dm-text3 uppercase tracking-wide">Recent Activity</h3>
        </div>

        {stats.recent_trades && stats.recent_trades.length > 0 ? (
          <div className="divide-y divide-dm-border">
            {stats.recent_trades.slice().reverse().map((trade, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 text-[11px] hover:bg-dm-surface-strong transition-colors">
                <span className="font-bold text-dm-text w-16">{trade.market_id}</span>
                <span className="font-bold text-dm-text2">{formatCurrency(trade.price)}</span>
                <span className="font-medium text-dm-text2">{trade.size.toFixed(4)}</span>
                <span className={`font-bold ${
                  trade.taker_side === 'Buy' || trade.taker_side === 'Long'
                    ? 'text-dream-green'
                    : 'text-dream-red'
                }`}>
                  {trade.taker_side}
                </span>
                <span className="text-dm-text3 text-[10px]">
                  {new Date(trade.timestamp_ms).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-3 py-6 text-center text-dm-text3 text-xs font-medium">
            No recent trades recorded
          </div>
        )}
      </div>
    </section>
  );
}
