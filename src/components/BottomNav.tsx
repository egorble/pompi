import React from 'react';
import { motion } from 'motion/react';
import { Home, Briefcase, Star } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'Trade' | 'Positions' | 'Points';
  setActiveTab: (tab: 'Trade' | 'Positions' | 'Points') => void;
  onOpenTrade: () => void;
}

export function BottomNav({ activeTab, setActiveTab, onOpenTrade }: BottomNavProps) {
  const tabs = [
    { id: 'Trade', icon: Home, label: 'Trade' },
    { id: 'Positions', icon: Briefcase, label: 'Positions' },
    { id: 'Points', icon: Star, label: 'Points' },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-12 py-3 flex items-center justify-between z-50 lg:hidden pb-safe">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 ${
              isActive ? 'text-dream-blue' : 'text-slate-400'
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
