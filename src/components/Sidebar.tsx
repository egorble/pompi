import React from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Wallet, LineChart, BookOpen, CircleUserRound, Box, BarChart3, HeadphonesIcon, Sun, Moon } from 'lucide-react';
import { PompiLogo } from './PompiLogo';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  activeTab: 'dashboard' | 'Trade' | 'Positions' | 'OpenOrders' | 'Stats';
  setActiveTab: (tab: 'dashboard' | 'Trade' | 'Positions' | 'OpenOrders' | 'Stats') => void;
  onSettingsClick?: () => void;
}

export function Sidebar({ activeTab, setActiveTab, onSettingsClick }: SidebarProps) {
  const { isDark, toggle } = useTheme();

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'Trade', icon: LineChart, label: 'Trade' },
    { id: 'Positions', icon: Wallet, label: 'Positions' },
    { id: 'OpenOrders', icon: Box, label: 'Open Orders' },
    { id: 'Stats', icon: BarChart3, label: 'Statistics' },
    { id: 'settings', icon: CircleUserRound, label: 'Settings' },
  ];

  return (
    <div className="hidden lg:flex flex-col w-[64px] shrink-0 bg-transparent h-screen py-4 items-center z-50">
      <div className="mb-8 w-10 h-10 flex items-center justify-center">
        <PompiLogo size={28} animated={false} />
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
                className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 overflow-hidden ${
                  isActive ? 'bg-[#3366FF] text-white shadow-lg shadow-[#3366FF]/20' : 'text-dm-text hover:text-dm-text2 hover:scale-110 hover:bg-dm-surface-strong'
                }`}
              >
                <Icon size={18} className="relative z-10" strokeWidth={isActive ? 2.5 : 2} />
              </button>
              
              <div className="absolute left-[calc(100%+12px)] px-3 py-1.5 bg-dm-surface text-dm-text text-sm font-medium rounded-lg opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 border border-dm-border shadow-lg">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto flex flex-col gap-2 relative z-50">
        <div className="relative flex items-center justify-center w-full group">
          <button 
            onClick={toggle}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-transparent text-dm-text2 hover:text-dm-text hover:bg-dm-surface-strong transition-all duration-200"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="absolute left-[calc(100%+8px)] px-3 py-1.5 bg-dm-surface text-dm-text text-sm font-medium rounded-lg opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 border border-dm-border shadow-lg">
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </div>
        </div>

        <div className="relative flex items-center justify-center w-full group">
          <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-transparent text-dm-text2 hover:text-dm-text hover:bg-dm-surface-strong transition-all duration-200">
             <HeadphonesIcon size={18} />
          </button>
          <div className="absolute left-[calc(100%+8px)] px-3 py-1.5 bg-dm-surface text-dm-text text-sm font-medium rounded-lg opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 border border-dm-border shadow-lg">
            Support
          </div>
        </div>
      </div>
    </div>
  );
}
