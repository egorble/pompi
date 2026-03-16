import React from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Wallet, LineChart, BookOpen, CircleUserRound, Box, BarChart3, HeadphonesIcon, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  activeTab: 'dashboard' | 'Trade' | 'Positions' | 'OpenOrders' | 'Stats';
  setActiveTab: (tab: 'dashboard' | 'Trade' | 'Positions' | 'OpenOrders' | 'Stats') => void;
  onSettingsClick?: () => void;
}

export function Sidebar({ activeTab, setActiveTab, onSettingsClick }: SidebarProps) {
  const { isDark, toggle } = useTheme();

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard },
    { id: 'Trade', icon: LineChart },
    { id: 'Positions', icon: Wallet },
    { id: 'OpenOrders', icon: Box },
    { id: 'Stats', icon: BarChart3 },
    { id: 'settings', icon: CircleUserRound },
  ];

  return (
    <div className="hidden lg:flex flex-col w-[64px] shrink-0 bg-transparent border-r border-dm-border h-screen py-4 items-center z-50">
      <div className="mb-8 text-dm-bg w-10 h-10 bg-brand-accent rounded-sm flex items-center justify-center">
        {/* Placeholder for Logo */}
        <Box size={20} className="text-black fill-current" />
      </div>
      
      <div className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'Trade' && activeTab === 'Trade'); // Simplified logic
          
          return (
            <div key={item.id} className="relative flex items-center justify-center w-full group">
              <button
                onClick={() => {
                  if (item.id === 'settings') {
                    onSettingsClick?.();
                  } else if (item.id === 'Trade' || item.id === 'Positions' || item.id === 'OpenOrders' || item.id === 'Stats' || item.id === 'dashboard') {
                    setActiveTab(item.id as any);
                  }
                }}
                className={`relative w-10 h-10 rounded-sm flex items-center justify-center transition-all duration-200 border border-transparent overflow-hidden ${
                  isActive ? 'bg-brand-accent text-black' : 'bg-transparent text-dm-text hover:bg-dm-surface-alt'
                }`}
              >
                <Icon size={18} className="relative z-10" strokeWidth={isActive ? 2.5 : 2} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-auto flex flex-col gap-2 relative z-50">
        <button 
          onClick={toggle}
          className="w-10 h-10 rounded-sm flex items-center justify-center bg-transparent text-dm-text2 hover:text-dm-text hover:bg-dm-surface-alt transition-all duration-200"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="w-10 h-10 rounded-sm flex items-center justify-center bg-transparent text-dm-text2 hover:text-dm-text hover:bg-dm-surface-alt transition-all duration-200">
           <HeadphonesIcon size={18} />
        </button>
      </div>
    </div>
  );
}
