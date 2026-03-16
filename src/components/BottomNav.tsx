import React from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, LineChart, Wallet, Star, BarChart3 } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'dashboard' | 'Trade' | 'Positions' | 'Points' | 'Stats';
  setActiveTab: (tab: 'dashboard' | 'Trade' | 'Positions' | 'Points' | 'Stats') => void;
  onOpenTrade: () => void;
}

export function BottomNav({ activeTab, setActiveTab, onOpenTrade }: BottomNavProps) {
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
    { id: 'Trade', icon: LineChart, label: 'Trade' },
    { id: 'Positions', icon: Wallet, label: 'Positions' },
    { id: 'Stats', icon: BarChart3, label: 'Stats' },
    { id: 'Points', icon: Star, label: 'Points' },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dm-surface border-t border-dm-border px-12 py-3 flex items-center justify-between z-50 lg:hidden pb-safe">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center gap-1 ${isActive ? 'text-dm-text' : 'text-dm-text3'
              }`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-bold">{tab.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
