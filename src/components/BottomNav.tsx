import React from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, LineChart, Wallet, Star, BarChart3 } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'dashboard' | 'Trade' | 'Positions' | 'OpenOrders' | 'Stats';
  setActiveTab: (tab: 'dashboard' | 'Trade' | 'Positions' | 'OpenOrders' | 'Stats') => void;
  onOpenTrade: () => void;
}

export function BottomNav({ activeTab, setActiveTab, onOpenTrade }: BottomNavProps) {
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
    { id: 'Trade', icon: LineChart, label: 'Trade' },
    { id: 'Positions', icon: Wallet, label: 'Positions' },
    { id: 'OpenOrders', icon: Star, label: 'Orders' },
    { id: 'Stats', icon: BarChart3, label: 'Stats' },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dm-surface border-t border-dm-border px-12 py-3 flex items-center justify-between z-50 lg:hidden pb-safe">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative flex flex-col items-center gap-1 w-16 h-14 justify-center transition-colors duration-200 ${
              isActive ? 'text-brand-accent border-t-2 border-brand-accent bg-dm-surface-alt/50 w-full' : 'text-dm-text3 hover:text-dm-text2 border-t-2 border-transparent w-full'
            }`}
          >
            <Icon size={isActive ? 20 : 20} strokeWidth={isActive ? 2.5 : 2} className="relative z-10 transition-all duration-200" />
            <span className={`text-[9px] uppercase tracking-wider transition-all duration-200 ${isActive ? 'font-bold' : 'font-medium'}`}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
