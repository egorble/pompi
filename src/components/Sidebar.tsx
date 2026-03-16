import React from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Wallet, LineChart, BookOpen, Settings, Box, BarChart3, HeadphonesIcon, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  activeTab: 'dashboard' | 'Trade' | 'Positions' | 'OpenOrders' | 'Stats';
  setActiveTab: (tab: 'dashboard' | 'Trade' | 'Positions' | 'OpenOrders' | 'Stats') => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { isDark, toggle } = useTheme();

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard },
    { id: 'Trade', icon: LineChart },
    { id: 'Positions', icon: Wallet },
    { id: 'OpenOrders', icon: Box },
    { id: 'Stats', icon: BarChart3 },
    { id: 'settings', icon: Settings },
  ];

  return (
    <div className="hidden lg:flex flex-col w-[80px] shrink-0 bg-transparent h-screen py-6 items-center z-50">
      <div className="mb-10 text-dm-bg w-12 h-12 bg-brand-accent rounded-xl flex items-center justify-center shadow-sm">
        {/* Placeholder for Logo */}
        <Box size={24} className="text-black fill-current" />
      </div>
      
      <div className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'Trade' && activeTab === 'Trade'); // Simplified logic
          
          return (
            <div key={item.id} className="relative flex items-center justify-center w-full group">
              <button
                onClick={() => {
                  if (item.id === 'Trade' || item.id === 'Positions' || item.id === 'OpenOrders' || item.id === 'Stats' || item.id === 'dashboard') {
                    setActiveTab(item.id as any);
                  }
                }}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 border border-transparent shadow-sm ${
                  isActive 
                    ? 'bg-brand-accent text-black shadow-brand-accent/20' 
                    : 'bg-dm-surface text-dm-text hover:bg-brand-accent/10'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-black' : 'text-dm-text'} strokeWidth={isActive ? 2.5 : 2} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-auto flex flex-col gap-2 relative z-50">
        <button 
          onClick={toggle}
          className="w-12 h-12 rounded-xl flex items-center justify-center bg-dm-surface text-dm-text2 hover:text-dm-text hover:bg-dm-surface-alt transition-all duration-200 shadow-sm"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="w-12 h-12 rounded-xl flex items-center justify-center bg-dm-surface text-dm-text2 hover:text-dm-text hover:bg-dm-surface-alt transition-all duration-200 shadow-sm">
           <HeadphonesIcon size={20} />
        </button>
      </div>
    </div>
  );
}
